
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
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ThemeToggle from "@/components/shared/theme-toggle";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="container-custom flex h-20 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="gradient-bg flex h-10 w-10 items-center justify-center rounded-xl text-white">
              <Heart size={22} />
            </div>

            <span className="text-xl font-bold tracking-tight">
              Social<span className="gradient-text">Connect</span>
            </span>
          </div>

          <ThemeToggle />
        </div>
      </header>

      {/* Hero */}
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
            <Button size="lg" className="gradient-bg border-0">
              Explore Events
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button size="lg" variant="outline">
              Create an Event
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
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

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container-custom flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <p>
            © 2026 SocialConnect. All rights reserved.
          </p>

          <p>Connect People. Create Impact.</p>
        </div>
      </footer>
    </main>
  );
}
