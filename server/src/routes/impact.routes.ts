
import { Router } from "express";
import { db } from "../lib/db.js";

// ======================================
// ROUTER
// ======================================

const router = Router();

// ======================================
// COMMUNITY IMPACT STATISTICS
// ======================================

router.get("/stats", async (_req, res) => {
  try {
    const eventsCollection = db.collection("events");
    const joinsCollection = db.collection("eventJoins");

    const now = new Date();

    // ======================================
    // TOTAL EVENT STATISTICS
    // ======================================

    const totalEvents = await eventsCollection.countDocuments({});

    const upcomingEvents = await eventsCollection.countDocuments({
      eventDate: { $gt: now },
    });

    const completedEvents = await eventsCollection.countDocuments({
      eventDate: { $lte: now },
    });

    // ======================================
    // JOINED MEMBER STATISTICS
    // ======================================

    const totalJoinedMembers = await joinsCollection.countDocuments({});

    const uniqueMembers = await joinsCollection.distinct("userId");

    const communityMembers = uniqueMembers.length;

    // ======================================
    // EVENT CATEGORY STATISTICS
    // ======================================

    const eventCategories = await eventsCollection
      .aggregate([
        {
          $group: {
            _id: "$eventType",
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ])
      .toArray();

    // ======================================
    // MONTHLY EVENT ACTIVITY
    // ======================================

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyActivity = await eventsCollection
      .aggregate([
        {
          $match: {
            createdAt: { $gte: sixMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            total: { $sum: 1 },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ])
      .toArray();

    // ======================================
    // API RESPONSE
    // ======================================

    return res.status(200).json({
      success: true,

      stats: {
        totalEvents,
        upcomingEvents,
        completedEvents,
        totalJoinedMembers,
        communityMembers,
      },

      eventCategories,

      monthlyActivity,
    });
  } catch (error) {
    console.error("Impact statistics error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load community impact statistics.",
    });
  }
});

export default router;
