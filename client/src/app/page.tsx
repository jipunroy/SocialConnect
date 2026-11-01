
import {
  ArrowRight,
  CalendarDays,
  Heart,
  Users,
  HandHeart,
  Globe2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div>

      {/* Hero Section */}
      <section className="container-custom py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-accent px-4 py-2 text-sm font-medium text-accent-foreground">
            <HandHeart size={17} />
            Together for a better community
          </div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Make a Difference.
            <br />
            <span className="gradient-text">
              Start with Your Community.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
            Discover meaningful community events, connect with
            passionate people, and turn small actions into a
            positive impact.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="gradient-bg border-0">
              <a href="/events">
                Explore Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>

            <Button asChild size="lg" variant="outline">
              <a href="/create-event">
                Create an Event
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="container-custom pb-20">
        <div className="mb-10 text-center">

          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Our Platform
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            Everything starts with connection
          </h2>

          <p className="mt-3 text-muted-foreground">
            Make community participation easier and more meaningful.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">

          <Card className="card-hover">
            <CardHeader>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CalendarDays size={24} />
              </div>

              <CardTitle>Discover Events</CardTitle>

              <CardDescription>
                Find upcoming community activities and social
                development programs.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                <Users size={24} />
              </div>

              <CardTitle>Join Communities</CardTitle>

              <CardDescription>
                Connect with volunteers and people who share
                your passion for positive change.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                <Globe2 size={24} />
              </div>

              <CardTitle>Create Impact</CardTitle>

              <CardDescription>
                Organize activities and make your community
                stronger through collective action.
              </CardDescription>
            </CardHeader>
          </Card>

        </div>
      </section>

      {/* Impact Banner */}
      <section className="container-custom pb-20">
        <div className="gradient-bg rounded-3xl px-6 py-12 text-center text-white md:px-12 md:py-16">

          <Heart className="mx-auto mb-5" size={38} />

          <h2 className="text-3xl font-bold md:text-4xl">
            Small Actions. Big Impact.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/85 md:text-base">
            Every volunteer, every event, and every contribution
            helps build a stronger and more caring community.
          </p>

          <Button
            asChild
            variant="secondary"
            size="lg"
            className="mt-7"
          >
            <a href="/events">
              Find an Event
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>

        </div>
      </section>

    </div>
  );
}
