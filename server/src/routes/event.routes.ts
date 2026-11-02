import { Router } from "express";
import { ObjectId } from "mongodb";

import { db } from "../lib/db.js";
import { requireAuth } from "../middleware/require-auth.js";

const router = Router();

const eventsCollection = db.collection("events");
const joinsCollection = db.collection("eventJoins");

const eventTypes = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Education",
  "Community",
  "Other",
];

// CREATE EVENT

router.post("/", requireAuth, async (req, res) => {
  try {
    const user = res.locals.user;

    const {
      title,
      description,
      eventType,
      thumbnail,
      location,
      eventDate,
    } = req.body;

    if (
      !title ||
      !description ||
      !eventType ||
      !thumbnail ||
      !location ||
      !eventDate
    ) {
      return res.status(400).json({
        success: false,
        message: "All event fields are required.",
      });
    }

    if (!eventTypes.includes(eventType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event type.",
      });
    }

    const parsedDate = new Date(eventDate);

    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid event date.",
      });
    }

    if (parsedDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Event date must be in the future.",
      });
    }

    const event = {
      title: String(title).trim(),
      description: String(description).trim(),
      eventType,
      thumbnail: String(thumbnail).trim(),
      location: String(location).trim(),
      eventDate: parsedDate,
      creatorId: user.id,
      creatorEmail: user.email,
      creatorName: user.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await eventsCollection.insertOne(event);

    return res.status(201).json({
      success: true,
      message: "Event created successfully!",
      event: {
        ...event,
        _id: result.insertedId,
      },
    });
  } catch (error) {
    console.error("Create event error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create event.",
    });
  }
});

// GET UPCOMING EVENTS
// Home page can request /api/events?limit=6

router.get("/", async (req, res) => {
  try {
    const requestedLimit = Number(req.query.limit);

    const cursor = eventsCollection
      .find({
        eventDate: { $gt: new Date() },
      })
      .sort({ eventDate: 1 });

    if (
      Number.isInteger(requestedLimit) &&
      requestedLimit > 0
    ) {
      cursor.limit(Math.min(requestedLimit, 100));
    }

    const events = await cursor.toArray();

    return res.status(200).json({
      success: true,
      total: events.length,
      events,
    });
  } catch (error) {
    console.error("Get events error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch events.",
    });
  }
});

// GET MY CREATED EVENTS

router.get("/my-events", requireAuth, async (_req, res) => {
  try {
    const user = res.locals.user;

    const events = await eventsCollection
      .find({ creatorId: user.id })
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json({
      success: true,
      total: events.length,
      events,
    });
  } catch (error) {
    console.error("Get my events error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch your events.",
    });
  }
});

// GET MY JOINED EVENTS

router.get("/joined", requireAuth, async (_req, res) => {
  try {
    const user = res.locals.user;

    const joinedRecords = await joinsCollection
      .find({ userId: user.id })
      .toArray();

    const eventIds = joinedRecords.map(
      (record) => record.eventId
    );

    const events = await eventsCollection
      .find({
        _id: { $in: eventIds },
      })
      .sort({ eventDate: 1 })
      .toArray();

    return res.status(200).json({
      success: true,
      total: events.length,
      events,
    });
  } catch (error) {
    console.error("Get joined events error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch joined events.",
    });
  }
});

// GET SINGLE EVENT BY ID

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID.",
      });
    }

    const event = await eventsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    return res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("Get single event error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch event details.",
    });
  }
});

// JOIN EVENT

router.post("/:id/join", requireAuth, async (req, res) => {
  try {
    const user = res.locals.user;
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID.",
      });
    }

    const event = await eventsCollection.findOne({
      _id: new ObjectId(id),
      eventDate: { $gt: new Date() },
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Upcoming event not found.",
      });
    }

    const existingJoin = await joinsCollection.findOne({
      eventId: event._id,
      userId: user.id,
    });

    if (existingJoin) {
      return res.status(409).json({
        success: false,
        message: "You have already joined this event.",
      });
    }

    await joinsCollection.insertOne({
      eventId: event._id,
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      joinedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "You joined the event successfully!",
    });
  } catch (error) {
    console.error("Join event error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to join event.",
    });
  }
});

// UPDATE MY EVENT

router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const user = res.locals.user;
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID.",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "eventType",
      "thumbnail",
      "location",
      "eventDate",
    ];

    const updates: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided.",
      });
    }

    if (
      updates.eventType !== undefined &&
      !eventTypes.includes(String(updates.eventType))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid event type.",
      });
    }

    if (updates.eventDate !== undefined) {
      const parsedDate = new Date(
        String(updates.eventDate)
      );

      if (
        Number.isNaN(parsedDate.getTime()) ||
        parsedDate <= new Date()
      ) {
        return res.status(400).json({
          success: false,
          message: "Event date must be in the future.",
        });
      }

      updates.eventDate = parsedDate;
    }

    for (const field of [
      "title",
      "description",
      "thumbnail",
      "location",
    ]) {
      if (updates[field] !== undefined) {
        updates[field] = String(updates[field]).trim();

        if (!updates[field]) {
          return res.status(400).json({
            success: false,
            message: `${field} cannot be empty.`,
          });
        }
      }
    }

    updates.updatedAt = new Date();

    const result = await eventsCollection.updateOne(
      {
        _id: new ObjectId(id),
        creatorId: user.id,
      },
      {
        $set: updates,
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Event not found or you are not the owner.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Event updated successfully!",
    });
  } catch (error) {
    console.error("Update event error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update event.",
    });
  }
});

// DELETE MY EVENT

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const user = res.locals.user;
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID.",
      });
    }

    const event = await eventsCollection.findOneAndDelete({
      _id: new ObjectId(id),
      creatorId: user.id,
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found or you are not the owner.",
      });
    }

    await joinsCollection.deleteMany({
      eventId: new ObjectId(id),
    });

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully!",
    });
  } catch (error) {
    console.error("Delete event error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete event.",
    });
  }
});

export default router;