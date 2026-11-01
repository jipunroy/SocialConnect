import Link from "next/link";
import { Users, Heart, Sparkles } from "lucide-react";

export function AuthLayout({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="container-custom grid min-h-[85vh] items-center gap-12 py-12 lg:grid-cols-2">
      <div className="hidden space-y-8 lg:block">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="gradient-bg flex h-12 w-12 items-center justify-center rounded-2xl text-white">
            <Heart className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold">
            Social<span className="gradient-text">Connect</span>
          </span>
        </Link>

        <div className="max-w-lg space-y-5">
          <div className="gradient-bg inline-flex rounded-full p-3 text-white">
            <Sparkles className="h-6 w-6" />
          </div>

          <h1 className="text-5xl font-bold leading-tight">
            Connect People.
            <span className="gradient-text block">
              Create Impact.
            </span>
          </h1>

          <p className="text-lg text-muted-foreground">
            Join a community of people who care about making
            their neighborhoods better through meaningful
            events and social activities.
          </p>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border p-5">
          <div className="gradient-bg rounded-xl p-3 text-white">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold">
              Together, We Make a Difference
            </p>
            <p className="text-sm text-muted-foreground">
              Discover events. Meet people. Create change.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center lg:hidden">
          <Link href="/" className="text-2xl font-bold">
            Social<span className="gradient-text">Connect</span>
          </Link>
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-xl sm:p-9">
          <div className="mb-8 space-y-2">
            <h2 className="text-3xl font-bold">{title}</h2>
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}