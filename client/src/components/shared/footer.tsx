
import Link from "next/link";
import {
  Heart,
  Mail,
  MapPin,
  ArrowUpRight,
  CalendarDays,
  Users,
} from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Upcoming Events", href: "/upcoming-events" },
  { label: "Impact Dashboard", href: "/impact-dashboard" },
  { label: "Create Event", href: "/create-event" },
];

const eventCategories = [
  "Community Cleanup",
  "Tree Plantation",
  "Blood Donation",
  "Education Support",
  "Food Distribution",
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: "f",
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: "◎",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: "in",
  },
  {
    label: "X",
    href: "https://x.com",
    icon: "𝕏",
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t bg-card">
      <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

      <div className="container-custom relative py-12 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">

          {/* Brand */}
          <div className="space-y-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="gradient-bg flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md">
                <Heart size={22} fill="white" />
              </div>

              <span className="text-xl font-extrabold tracking-tight">
                Social
                <span className="gradient-text">Connect</span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-7 text-muted-foreground">
              Bringing people together to create meaningful
              community experiences and a better future.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2.5">
              {socialLinks.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border bg-background font-bold text-muted-foreground transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-white"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 flex items-center gap-2 font-semibold">
              <CalendarDays className="h-4 w-4 text-primary" />
              Quick Links
            </h3>

            <ul className="space-y-3.5 text-sm text-muted-foreground">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Event Categories */}
          <div>
            <h3 className="mb-5 flex items-center gap-2 font-semibold">
              <Users className="h-4 w-4 text-primary" />
              Event Categories
            </h3>

            <ul className="space-y-3.5 text-sm text-muted-foreground">
              {eventCategories.map((category) => (
                <li
                  key={category}
                  className="transition-colors hover:text-primary"
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 flex items-center gap-2 font-semibold">
              <Mail className="h-4 w-4 text-primary" />
              Get in Touch
            </h3>

            <div className="space-y-4 text-sm text-muted-foreground">
              <a
                href="mailto:hello@socialconnect.example"
                className="flex min-w-0 items-center gap-3 transition-colors hover:text-primary"
              >
                <Mail size={18} className="shrink-0 text-primary" />

                <span className="break-all">
                  hello@socialconnect.example
                </span>
              </a>

              <div className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-primary"
                />

                <span className="leading-6">
                  Building stronger communities everywhere.
                </span>
              </div>
            </div>

            <Link
              href="/impact-dashboard"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all hover:gap-3"
            >
              Explore our impact
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 border-t pt-6 sm:mt-14">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <p className="text-xs leading-5 text-muted-foreground">
              © 2026 SocialConnect. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs text-muted-foreground">
              <Link
                href="/privacy"
                className="transition-colors hover:text-primary"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="transition-colors hover:text-primary"
              >
                Terms & Conditions
              </Link>

              <a
                href="#top"
                className="inline-flex items-center gap-1 transition-colors hover:text-primary"
              >
                Back to top
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-muted-foreground/70">
            Connect People. Create Impact. Change Communities.
          </p>
        </div>
      </div>
    </footer>
  );
}
