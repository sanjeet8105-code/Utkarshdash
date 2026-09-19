"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  Mailbox,
  RefreshCcw,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  Bell,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Wallet", href: "/dashboard/wallet", icon: Wallet },
  { label: "Letters", href: "/dashboard/letters", icon: Mailbox },
  { label: "Fee Payments", href: "/dashboard/fee-payments", icon: RefreshCcw },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Help Center", href: "/dashboard/help", icon: HelpCircle },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <Link href="/dashboard" className="flex items-center gap-2 px-6 py-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand font-extrabold text-white">
          U
        </span>
        <span className="text-lg font-bold tracking-tight text-ink">
          Utkarsh Capital
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1 px-4">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-brand-light text-brand"
                  : "text-ink/60 hover:bg-black/[0.03] hover:text-ink"
              }`}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-xl border border-red-100 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" /> Logout
        </Link>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAFE] font-sans text-ink">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-black/5 bg-white md:block">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl">
            <div className="flex justify-end px-4 pt-4">
              <button onClick={() => setMobileNavOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5 text-ink/60" />
              </button>
            </div>
            <SidebarContent onNavigate={() => setMobileNavOpen(false)} />
          </aside>
        </div>
      )}

      <div className="md:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-black/5 bg-white/95 px-4 py-3.5 backdrop-blur sm:px-6">
          <button
            className="text-ink md:hidden"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 items-center gap-2 rounded-full bg-black/[0.03] px-4 py-2.5 sm:max-w-sm">
            <Search className="h-4 w-4 shrink-0 text-ink/40" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent text-sm text-ink placeholder:text-ink/40 focus:outline-none"
            />
          </div>

          <div className="ml-auto flex items-center gap-3 sm:gap-4">
            <button
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-ink/60 hover:bg-black/[0.03]"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <div className="relative">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-light text-brand hover:bg-brand/20"
                aria-label="Profile menu"
              >
                <User className="h-5 w-5" />
              </button>

              {profileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div className="absolute right-0 top-12 z-20 w-48 overflow-hidden rounded-xl border border-black/5 bg-white py-1.5 shadow-xl shadow-black/10">
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink/80 hover:bg-black/[0.03]"
                    >
                      <User className="h-4 w-4" /> Profile
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink/80 hover:bg-black/[0.03]"
                    >
                      <Settings className="h-4 w-4" /> Settings
                    </Link>
                    <Link
                      href="/dashboard/help"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink/80 hover:bg-black/[0.03]"
                    >
                      <HelpCircle className="h-4 w-4" /> Help
                    </Link>
                    <Link
                      href="/"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
