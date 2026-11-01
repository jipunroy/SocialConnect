
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Mail, MapPin, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t bg-card">
      <div className="container-custom py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="gradient-bg flex h-10 w-10 items-center justify-center rounded-xl text-white">
                <Heart size={21} fill="white" />
              </div>

              <span className="text-xl font-extrabold">
                Social<span className="gradient-text">Connect</span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-7 text-muted-foreground">
              Bringing people together to create meaningful community
              experiences and a better future.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-lg border font-bold hover:border-primary hover:text-primary"
              >
                f
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-lg border font-bold hover:border-primary hover:text-primary"
              >
                ◎
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-lg border font-bold hover:border-primary hover:text-primary"
              >
                in
              </a>

              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                className="flex h-9 w-9 items-center justify-center rounded-lg border font-bold hover:border-primary hover:text-primary"
              >
                𝕏
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 font-semibold">Quick Links</h3>

            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary">
                  Home
                </Link>
              </li>

              <li>
                <Link href="/events" className="hover:text-primary">
                  Upcoming Events
                </Link>
              </li>

              <li>
                <Link href="/create-event" className="hover:text-primary">
                  Create Event
                </Link>
              </li>

              <li>
                <Link href="/login" className="hover:text-primary">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-5 font-semibold">Event Categories</h3>

            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>Community Cleanup</li>
              <li>Tree Plantation</li>
              <li>Blood Donation</li>
              <li>Education Support</li>
              <li>Food Distribution</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 font-semibold">Get in Touch</h3>

            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-primary" />
                <span>hello@socialconnect.example</span>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-1 text-primary" />
                <span>
                  Building stronger communities everywhere.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-6 text-center text-xs text-muted-foreground sm:flex-row">
          <p>
            © {year ?? "2026"} SocialConnect. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-primary">
              Privacy Policy
            </Link>

            <Link href="/terms" className="hover:text-primary">
              Terms & Conditions
            </Link>

            <a href="#top" className="flex items-center gap-1 hover:text-primary">
              Back to top
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
