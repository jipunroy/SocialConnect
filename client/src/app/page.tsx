
import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  Heart,
  Users,
  HandHeart,
  Globe2,
  MapPin,
  Clock,
  Leaf,
  TreePine,
  HeartHandshake,
  Sparkles,
  Mail,
  MoveRight,
  CheckCircle2,
} from "lucide-react";

const events = [
  {
    id: 1,
    title: "Community Cleanup Day",
    type: "Environment",
    location: "Central Park, Dhaka",
    date: "November 12, 2026",
    image:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=900",
    icon: Leaf,
    color: "bg-green-500/10 text-green-600",
  },
  {
    id: 2,
    title: "Plant a Tree, Save Earth",
    type: "Plantation",
    location: "Dhanmondi, Dhaka",
    date: "November 15, 2026",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=900",
    icon: TreePine,
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    id: 3,
    title: "Winter Clothes Donation",
    type: "Donation",
    location: "Mirpur, Dhaka",
    date: "November 18, 2026",
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900",
    icon: HeartHandshake,
    color: "bg-pink-500/10 text-pink-600",
  },
  {
    id: 4,
    title: "Community Food Sharing",
    type: "Social Welfare",
    location: "Uttara, Dhaka",
    date: "November 20, 2026",
    image:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=900",
    icon: Heart,
    color: "bg-orange-500/10 text-orange-600",
  },
  {
    id: 5,
    title: "Youth Volunteer Meetup",
    type: "Community",
    location: "Banani, Dhaka",
    date: "November 23, 2026",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900",
    icon: Users,
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    id: 6,
    title: "Clean Water Awareness",
    type: "Awareness",
    location: "Gulshan, Dhaka",
    date: "November 27, 2026",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900",
    icon: Globe2,
    color: "bg-purple-500/10 text-purple-600",
  },
];

const features = [
  {
    icon: CalendarDays,
    title: "Discover Events",
    description:
      "Explore meaningful community events and find opportunities to make a difference.",
    color: "bg-violet-500/10 text-violet-600",
  },
  {
    icon: Users,
    title: "Connect with People",
    description:
      "Meet passionate volunteers and build meaningful relationships in your community.",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: HandHeart,
    title: "Make Real Impact",
    description:
      "Turn your ideas into action and help create a better future for everyone.",
    color: "bg-pink-500/10 text-pink-600",
  },
];

const gallery = [
  {
    image:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=900",
    title: "Volunteers in Action",
  },
  {
    image:
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=900",
    title: "Helping Each Other",
  },
  {
    image:
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=900",
    title: "Building Communities",
  },
  {
    image:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=900",
    title: "Together We Grow",
  },
];

export default function Home() {
  return (
    <main className="overflow-hidden">

      {/* HERO SECTION */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-500/10 via-background to-blue-500/10" />

        <div className="container-custom grid items-center gap-12 py-20 md:grid-cols-2 md:py-28">

          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium shadow-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              Building stronger communities together
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Small Actions.
              <br />
              <span className="gradient-text">
                Big Community Impact.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
              Discover local events, meet inspiring people,
              and become part of something meaningful.
              Together, we can create positive change in
              every community.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/events"
                className="gradient-bg inline-flex items-center rounded-xl px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
              >
                Explore Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>

              <Link
                href="/create-event"
                className="inline-flex items-center rounded-xl border bg-background px-6 py-3.5 text-sm font-semibold transition hover:border-primary hover:text-primary"
              >
                Create an Event
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <div className="flex -space-x-3">
                {[
                  "photo-1534528741775-53994a69daeb",
                  "photo-1500648767791-00dcc994a43e",
                  "photo-1531123897727-8f129e1688ce",
                  "photo-1506794778202-cad84cf45f1d",
                ].map((photo) => (
                  <img
                    key={photo}
                    src={`https://images.unsplash.com/${photo}?w=100`}
                    alt="Community member"
                    className="h-10 w-10 rounded-full border-2 border-background object-cover"
                  />
                ))}
              </div>

              <div>
                <p className="text-sm font-bold">
                  People creating change
                </p>
                <p className="text-xs text-muted-foreground">
                  Join a growing community of volunteers
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-5 -top-5 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-5 -left-5 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border bg-background p-3 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200"
                alt="Community volunteers working together"
                className="h-[340px] w-full rounded-[1.5rem] object-cover md:h-[460px]"
              />

              <div className="absolute bottom-7 left-7 right-7 rounded-2xl border bg-background/95 p-4 shadow-lg backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <HeartHandshake size={25} />
                  </div>
                  <div>
                    <p className="font-bold">
                      Together We Can
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Every small action matters.
                    </p>
                  </div>
                  <div className="ml-auto">
                    <CheckCircle2 className="text-green-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* IMPACT STATISTICS */}
      <section className="container-custom pb-20">
        <div className="grid grid-cols-2 gap-4 rounded-3xl border bg-card p-6 shadow-sm md:grid-cols-4 md:p-10">

          {[
            { value: "1,200+", label: "Active Volunteers" },
            { value: "150+", label: "Community Events" },
            { value: "35+", label: "Local Communities" },
            { value: "5,000+", label: "Lives Impacted" },
          ].map((stat) => (
            <div key={stat.label} className="py-4 text-center">
              <h3 className="text-3xl font-extrabold gradient-text md:text-4xl">
                {stat.value}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* FEATURES */}
      <section className="container-custom pb-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-primary">
            Why SocialConnect?
          </span>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
            Everything you need to
            <span className="gradient-text"> create impact</span>
          </h2>

          <p className="mt-4 leading-7 text-muted-foreground">
            One platform to discover opportunities,
            connect with people, and make your community stronger.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="card-hover rounded-2xl border bg-card p-7"
              >
                <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${feature.color}`}>
                  <Icon size={27} />
                </div>

                <h3 className="text-xl font-bold">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="bg-muted/40 py-20">
        <div className="container-custom">

          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-primary">
                Be Part of Something
              </span>

              <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">
                Upcoming Community Events
              </h2>

              <p className="mt-3 text-muted-foreground">
                Find an event and start making a difference.
              </p>
            </div>

            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              View All Events
              <MoveRight size={17} />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const Icon = event.icon;

              return (
                <div
                  key={event.id}
                  className="card-hover overflow-hidden rounded-2xl border bg-card"
                >
                  <div className="relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-52 w-full object-cover"
                    />

                    <span className="absolute left-4 top-4 rounded-full bg-background/95 px-3 py-1.5 text-xs font-semibold shadow">
                      {event.type}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold">
                      {event.title}
                    </h3>

                    <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-primary" />
                        {event.location}
                      </div>

                      <div className="flex items-center gap-2">
                        <CalendarDays size={16} className="text-primary" />
                        {event.date}
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t pt-4">
                      <span className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${event.color}`}>
                        <Icon size={14} />
                        {event.type}
                      </span>

                      <Link
                        href="/events"
                        className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                      >
                        Explore
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* COMMUNITY GALLERY */}
      <section className="container-custom py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-primary">
            Our Community
          </span>

          <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">
            Moments That Make a Difference
          </h2>

          <p className="mt-4 text-muted-foreground">
            Every picture tells a story of kindness,
            teamwork, and positive change.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {gallery.map((item, index) => (
            <div
              key={item.title}
              className={`group relative overflow-hidden rounded-2xl ${index % 2 === 0 ? "h-56 md:h-80" : "h-56 md:h-64"}`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

              <h3 className="absolute bottom-5 left-4 right-3 text-sm font-bold text-white md:text-base">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="container-custom pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 to-blue-600 px-6 py-14 text-center text-white md:px-16 md:py-20">

          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[35px] border-white/10" />
          <div className="absolute -bottom-28 -left-16 h-64 w-64 rounded-full border-[35px] border-white/10" />

          <div className="relative mx-auto max-w-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
              <Mail size={28} />
            </div>

            <h2 className="mt-6 text-3xl font-extrabold md:text-4xl">
              Stay Connected. Stay Inspired.
            </h2>

            <p className="mt-4 leading-7 text-white/80">
              Get updates about upcoming events,
              volunteering opportunities, and community stories.
            </p>

            <div className="mx-auto mt-8 flex max-w-lg flex-col gap-3 rounded-2xl bg-white p-2 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email address"
                className="min-w-0 flex-1 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none"
                aria-label="Email address"
              />

              <button
                type="button"
                className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
              >
                Subscribe
                <ArrowRight className="ml-2 inline h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 text-xs text-white/70">
              Join our community and never miss an opportunity.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container-custom pb-24">
        <div className="rounded-3xl border bg-card px-6 py-12 text-center md:px-12 md:py-16">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Heart size={28} />
          </div>

          <h2 className="mt-6 text-3xl font-extrabold md:text-4xl">
            Your Community Needs You.
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-muted-foreground">
            Be the reason someone smiles today.
            Join SocialConnect and start creating positive change.
          </p>

          <Link
            href="/events"
            className="gradient-bg mt-8 inline-flex items-center rounded-xl px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-1"
          >
            Get Started Today
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

    </main>
  );
}
