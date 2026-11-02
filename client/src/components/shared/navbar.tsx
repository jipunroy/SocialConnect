
"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

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
  LayoutDashboard,
  Sparkles,
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

const publicLinks = [
  {
    label: "Upcoming Events",
    href: "/upcoming-events",
    icon: CalendarDays,
  },
  {
    label: "Features",
    href: "/#features",
    icon: Sparkles,
  },
  {
    label: "Community",
    href: "/#community",
    icon: Users,
  },
  {
    label: "Impact Dashboard",
    href: "/impact-dashboard",
    icon: LayoutDashboard,
  },
];

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
  const pathname = usePathname();

  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return false;

    return (
      pathname === href ||
      (href !== "/" && pathname.startsWith(`${href}/`))
    );
  };

  const handleLogout = () => {
    setMobileOpen(false);
    onLogout?.();
  };

  const handleNavigation = (href: string) => {
    setMobileOpen(false);
    router.push(href);
  };

  const navLinkClass = (href: string) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
      isActive(href)
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:bg-accent hover:text-foreground"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 shadow-sm backdrop-blur-xl">
      <div className="container-custom flex h-16 items-center justify-between gap-3">

        {/* Logo */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2"
          aria-label="SocialConnect Home"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-500 text-white shadow-md transition-transform duration-200 group-hover:scale-105">
            <Users className="h-5 w-5" />
          </div>

          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight">
              Social
              <span className="text-primary">Connect</span>
            </span>

            <span className="hidden text-[10px] leading-none text-muted-foreground sm:block">
              Connect. Create. Impact.
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {publicLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={
                isActive(item.href) ? "page" : undefined
              }
              className={navLinkClass(item.href)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />

          {!user ? (
            <Button
              onClick={() => router.push("/login")}
              className="rounded-xl px-5 shadow-sm"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-border bg-background py-1 pl-1 pr-3 transition-all hover:border-primary/40 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
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
                className="w-60 rounded-xl p-2"
              >
                {/* User Information */}
                <div className="flex items-center gap-3 px-2 py-3">
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

                <DropdownMenuSeparator />

                {privateLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <DropdownMenuItem
                      key={item.href}
                      onClick={() => router.push(item.href)}
                      className={`cursor-pointer rounded-lg ${
                        isActive(item.href)
                          ? "bg-primary/10 text-primary"
                          : ""
                      }`}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </DropdownMenuItem>
                  );
                })}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer rounded-lg text-destructive focus:text-destructive"
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
            <SheetTrigger className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-input bg-background transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Menu className="h-5 w-5" />
              <span className="sr-only">
                Toggle navigation menu
              </span>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[300px] overflow-y-auto sm:w-[360px]"
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
                    Social
                    <span className="text-primary">Connect</span>
                  </span>
                </Link>

                <div className="h-px bg-border" />

                {/* Public Links */}
                <nav className="flex flex-col gap-1">
                  {publicLinks.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        aria-current={
                          isActive(item.href) ? "page" : undefined
                        }
                        className={navLinkClass(item.href)}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>

                <div className="h-px bg-border" />

                {/* Logged In User */}
                {user ? (
                  <>
                    <div className="flex items-center gap-3 rounded-xl border border-border bg-accent/40 p-3">
                      <Avatar className="h-11 w-11">
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

                    <nav className="flex flex-col gap-1">
                      {privateLinks.map((item) => {
                        const Icon = item.icon;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            aria-current={
                              isActive(item.href) ? "page" : undefined
                            }
                            className={navLinkClass(item.href)}
                          >
                            <Icon className="h-5 w-5" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </nav>

                    <Button
                      variant="destructive"
                      className="mt-2 w-full rounded-xl"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button
                    className="w-full rounded-xl"
                    onClick={() => handleNavigation("/login")}
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                )}

                <div className="rounded-xl bg-accent/50 p-4">
                  <p className="text-sm font-semibold">
                    Make a Difference Together
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Join community events and create a positive impact.
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
