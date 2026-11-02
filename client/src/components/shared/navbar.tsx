
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  CalendarDays,
  ChevronDown,
  LogIn,
  LogOut,
  Menu,
  PlusCircle,
  Settings,
  Users,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export type NavbarUser = {
  name: string;
  email: string;
  image?: string;
};

type NavbarProps = {
  user?: NavbarUser | null;
  onLogout?: () => void;
};

const privateLinks = [
  {
    label: "Create Event",
    href: "/create-event",
    icon: PlusCircle,
  },
  {
    label: "Manage Events",
    href: "/manage-events",
    icon: Settings,
  },
  {
    label: "Joined Events",
    href: "/joined-events",
    icon: Users,
  },
  {
    label: "My Profile",
    href: "/profile",
    icon: User,
  },
];

export function Navbar({
  user = null,
  onLogout,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const handleLogout = () => {
    setMobileOpen(false);
    onLogout?.();
  };

  const handleNavigation = (href: string) => {
    setMobileOpen(false);
    router.push(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-xl">
      <div className="container-custom flex h-16 items-center justify-between gap-4">

        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-500 text-white shadow-md">
            <Users className="h-5 w-5" />
          </div>

          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight">
              Social<span className="text-primary">Connect</span>
            </span>

            <span className="hidden text-[10px] leading-none text-muted-foreground sm:block">
              Connect. Create. Impact.
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          <Link
            href="/upcoming-events"
            className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Upcoming Events
          </Link>

          <Link
            href="/#features"
            className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Features
          </Link>

          <Link
            href="/#community"
            className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Community
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />

          {!user ? (
            <Button onClick={() => router.push("/login")}>
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-border bg-background py-1 pl-1 pr-3 transition-colors hover:bg-accent">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={user.image || undefined}
                    alt={user.name}
                  />

                  <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <span className="max-w-28 truncate text-sm font-medium">
                  {user.name}
                </span>

                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-60"
              >
                {/* User Information */}
                <div className="px-2 py-2">
                  <p className="truncate text-sm font-semibold">
                    {user.name}
                  </p>

                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>

                <DropdownMenuSeparator />

                {privateLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <DropdownMenuItem
                      key={item.href}
                      onClick={() => router.push(item.href)}
                      className="cursor-pointer"
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </DropdownMenuItem>
                  );
                })}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />

          <Sheet
            open={mobileOpen}
            onOpenChange={setMobileOpen}
          >
            <SheetTrigger className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background hover:bg-accent">
              <Menu className="h-5 w-5" />
              <span className="sr-only">
                Toggle navigation menu
              </span>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[300px] sm:w-[360px]"
            >
              <div className="mt-8 flex flex-col gap-5">

                {/* Mobile Logo */}
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-500 text-white">
                    <Users className="h-5 w-5" />
                  </div>

                  <span className="text-lg font-bold">
                    Social<span className="text-primary">Connect</span>
                  </span>
                </Link>

                <div className="h-px bg-border" />

                {/* Public Links */}
                <nav className="flex flex-col gap-2">
                  <Link
                    href="/upcoming-events"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-accent"
                  >
                    <CalendarDays className="h-5 w-5" />
                    Upcoming Events
                  </Link>

                  <Link
                    href="/#features"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-accent"
                  >
                    <Settings className="h-5 w-5" />
                    Features
                  </Link>

                  <Link
                    href="/#community"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-accent"
                  >
                    <Users className="h-5 w-5" />
                    Community
                  </Link>
                </nav>

                <div className="h-px bg-border" />

                {/* Logged In User */}
                {user ? (
                  <>
                    <div className="flex items-center gap-3 rounded-xl bg-accent/50 p-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={user.image || undefined}
                          alt={user.name}
                        />

                        <AvatarFallback className="bg-primary/10 text-primary">
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {user.name}
                        </p>

                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <nav className="flex flex-col gap-2">
                      {privateLinks.map((item) => {
                        const Icon = item.icon;

                        return (
                          <button
                            key={item.href}
                            type="button"
                            onClick={() =>
                              handleNavigation(item.href)
                            }
                            className="flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium hover:bg-accent"
                          >
                            <Icon className="h-5 w-5" />
                            {item.label}
                          </button>
                        );
                      })}
                    </nav>

                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => handleNavigation("/login")}
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
