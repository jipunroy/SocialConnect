
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Heart,
  CalendarDays,
  Menu,
  PlusCircle,
  LayoutDashboard,
  BookmarkCheck,
  LogIn,
  LogOut,
  UserRound,
  ChevronDown,
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type NavbarUser = {
  name: string;
  email: string;
  image?: string;
};

type NavbarProps = {
  user?: NavbarUser | null;
  onLogout?: () => void;
};

export function Navbar({
  user = null,
  onLogout,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const navLinks = [
    {
      label: "Upcoming Events",
      href: "/events",
      icon: CalendarDays,
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
      icon: LayoutDashboard,
    },
    {
      label: "Joined Events",
      href: "/joined-events",
      icon: BookmarkCheck,
    },
  ];

  const navigateTo = (href: string) => {
    router.push(href);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md">
      <div className="container-custom flex h-16 items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <div className="gradient-bg flex h-10 w-10 items-center justify-center rounded-xl text-white">
            <Heart size={21} fill="white" />
          </div>

          <span className="text-xl font-extrabold tracking-tight">
            Social<span className="gradient-text">Connect</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
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
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border px-2 py-1.5 outline-none hover:bg-accent">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user.image || ""}
                    alt={user.name}
                  />
                  <AvatarFallback>
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <span className="max-w-28 truncate text-sm font-medium">
                  {user.name}
                </span>

                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-1">
                    <span>{user.name}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {privateLinks.map((link) => {
                  const Icon = link.icon;

                  return (
                    <DropdownMenuItem
                      key={link.href}
                      onSelect={() => navigateTo(link.href)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {link.label}
                    </DropdownMenuItem>
                  );
                })}

                <DropdownMenuItem
                  onSelect={() => navigateTo("/profile")}
                >
                  <UserRound className="mr-2 h-4 w-4" />
                  My Profile
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onSelect={() => onLogout?.()}
                  className="text-destructive focus:text-destructive"
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

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              aria-label="Open navigation menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border bg-background hover:bg-accent"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>

            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle>
                  <Link
                    href="/"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2"
                  >
                    <div className="gradient-bg flex h-9 w-9 items-center justify-center rounded-lg text-white">
                      <Heart size={19} fill="white" />
                    </div>

                    <span className="text-lg font-extrabold">
                      Social<span className="gradient-text">Connect</span>
                    </span>
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div className="mt-8 flex flex-col gap-3">
                {/* Public Links */}
                {navLinks.map((link) => {
                  const Icon = link.icon;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-accent hover:text-primary"
                    >
                      <Icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  );
                })}

                <div className="my-2 border-t" />

                {user ? (
                  <>
                    {/* User Information */}
                    <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={user.image || ""}
                          alt={user.name}
                        />
                        <AvatarFallback>
                          {user.name?.charAt(0).toUpperCase() || "U"}
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

                    {/* Private Links */}
                    {privateLinks.map((link) => {
                      const Icon = link.icon;

                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-accent hover:text-primary"
                        >
                          <Icon className="h-5 w-5" />
                          {link.label}
                        </Link>
                      );
                    })}

                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-accent hover:text-primary"
                    >
                      <UserRound className="h-5 w-5" />
                      My Profile
                    </Link>

                    <Button
                      variant="destructive"
                      className="mt-2 w-full"
                      onClick={() => {
                        setMobileOpen(false);
                        onLogout?.();
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => navigateTo("/login")}
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
