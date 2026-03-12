"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Package,
  Bot,
  Plug,
  ChevronDown,
  Settings,
  LogOut,
  CalendarDays,
  DollarSign,
  MoreVertical,
  Layers,
  Zap,
} from "lucide-react";

// ─── Helpers ────────────────────────────────────────────────────────────────

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

function getInitials(name?: string, email?: string): string {
  if (name) {
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  if (email) return email[0].toUpperCase();
  return "U";
}

function getDisplayName(name?: string, email?: string): string {
  return name || email || "Usuário";
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  href: string;
  comingSoon?: boolean;
}

interface NavGroup {
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  items: NavItem[];
}

type NavEntry = NavItem | NavGroup;

function isGroup(entry: NavEntry): entry is NavGroup {
  return "items" in entry;
}

// ─── Default navigation (customize as needed) ────────────────────────────────

const navigation: NavEntry[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  {
    label: "Workspace",
    icon: Layers,
    items: [
      { label: "Mensagens", icon: MessageSquare, href: "/mensagens" },
      { label: "Agenda", icon: CalendarDays, href: "/agenda" },
      { label: "Clientes", icon: Users, href: "/clientes" },
      { label: "Produtos", icon: Package, href: "/produtos" },
      { label: "Financeiro", icon: DollarSign, href: "/financeiro" },
    ],
  },
  {
    label: "Automação",
    icon: Zap,
    items: [
      { label: "Agentes", icon: Bot, href: "/agentes" },
      { label: "Plugins", icon: Plug, href: "/plugins" },
    ],
  },
];

// ─── Toggle icon ─────────────────────────────────────────────────────────────

function SidebarToggleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1.5"
        y="1.5"
        width="15"
        height="15"
        rx="3.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="7"
        y1="1.5"
        x2="7"
        y2="16.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface SidebarProps {
  userEmail?: string;
  userName?: string;
  workspaceName?: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
  /** Called when the user clicks "Sair". Handle your own logout logic. */
  onLogout?: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function Sidebar({
  userEmail,
  userName,
  workspaceName = "Meu Workspace",
  collapsed,
  onToggleCollapse,
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Workspace: true,
    Automação: true,
  });

  const initials = getInitials(userName, userEmail);
  const displayName = getDisplayName(userName, userEmail);

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  const isGroupActive = (group: NavGroup) =>
    group.items.some((item) => isActive(item.href));

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col bg-zinc-900 transition-all duration-300 ease-in-out",
        collapsed ? "w-[68px]" : "w-[252px]"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex h-14 items-center shrink-0",
          collapsed ? "justify-center px-3" : "justify-between px-5"
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
          <span className="text-sm font-bold text-zinc-900">W</span>
        </div>

        {!collapsed && (
          <button
            onClick={onToggleCollapse}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/8 hover:text-zinc-200"
          >
            <SidebarToggleIcon className="h-[18px] w-[18px]" />
          </button>
        )}
      </div>

      {/* Separator */}
      {!collapsed && <div className="mx-4 border-t border-white/8" />}

      {/* Workspace name */}
      {!collapsed ? (
        <div className="px-5 py-4">
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5">
            <span className="text-sm font-semibold text-zinc-100 truncate">
              {workspaceName}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-zinc-500" />
          </div>
        </div>
      ) : (
        <div className="py-3 flex justify-center">
          <button
            onClick={onToggleCollapse}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/8 hover:text-zinc-200"
          >
            <SidebarToggleIcon className="h-[18px] w-[18px]" />
          </button>
        </div>
      )}

      {/* Separator */}
      {!collapsed && <div className="mx-4 border-t border-white/8" />}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {navigation.map((entry) => {
          if (isGroup(entry)) {
            const GroupIcon = entry.icon;
            const open = openGroups[entry.label] ?? false;
            const groupActive = isGroupActive(entry);

            return (
              <div key={entry.label}>
                <button
                  onClick={() => !collapsed && toggleGroup(entry.label)}
                  title={collapsed ? entry.label : undefined}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-150",
                    collapsed && "justify-center px-0",
                    groupActive && !open
                      ? "text-white"
                      : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
                  )}
                >
                  <GroupIcon
                    className={cn(
                      "h-[18px] w-[18px] shrink-0 transition-colors",
                      groupActive
                        ? "text-white"
                        : "text-zinc-500 group-hover:text-zinc-200"
                    )}
                    strokeWidth={1.8}
                  />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{entry.label}</span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200",
                          open && "rotate-180"
                        )}
                      />
                    </>
                  )}
                </button>

                {!collapsed && (
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-200 ease-in-out",
                      open ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="ml-7 space-y-0.5 py-1">
                      {entry.items.map((item) => {
                        const ItemIcon = item.icon;
                        const active = isActive(item.href);

                        if (item.comingSoon) {
                          return (
                            <div
                              key={item.label}
                              className="flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium cursor-default text-white/20"
                            >
                              <ItemIcon
                                className="h-[18px] w-[18px] shrink-0 text-white/20"
                                strokeWidth={1.8}
                              />
                              <span className="flex-1">{item.label}</span>
                              <span className="text-[10px] font-medium text-white/30 bg-white/5 px-1.5 py-0.5 rounded-md">
                                breve
                              </span>
                            </div>
                          );
                        }

                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                              "group flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-all duration-150",
                              active
                                ? "bg-white text-zinc-900"
                                : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
                            )}
                          >
                            <ItemIcon
                              className={cn(
                                "h-[18px] w-[18px] shrink-0 transition-colors",
                                active
                                  ? "text-zinc-900"
                                  : "text-zinc-500 group-hover:text-zinc-200"
                              )}
                              strokeWidth={active ? 2 : 1.8}
                            />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          }

          const Icon = entry.icon;
          const active = isActive(entry.href);

          if (entry.comingSoon) {
            return (
              <div
                key={entry.label}
                title={collapsed ? `${entry.label} (em breve)` : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium cursor-default text-white/20",
                  collapsed && "justify-center px-0"
                )}
              >
                <Icon
                  className="h-[18px] w-[18px] shrink-0 text-white/20"
                  strokeWidth={1.8}
                />
                {!collapsed && (
                  <>
                    <span className="flex-1">{entry.label}</span>
                    <span className="text-[10px] font-medium text-white/30 bg-white/5 px-1.5 py-0.5 rounded-md">
                      breve
                    </span>
                  </>
                )}
              </div>
            );
          }

          return (
            <Link
              key={entry.label}
              href={entry.href}
              title={collapsed ? entry.label : undefined}
              className={cn(
                "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-150",
                collapsed && "justify-center px-0",
                active
                  ? "bg-white text-zinc-900 shadow-[0_1px_3px_rgba(0,0,0,0.2)]"
                  : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
              )}
            >
              <Icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0 transition-colors",
                  active
                    ? "text-zinc-900"
                    : "text-zinc-500 group-hover:text-zinc-200"
                )}
                strokeWidth={active ? 2 : 1.8}
              />
              {!collapsed && <span>{entry.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom — user profile */}
      <div className="shrink-0">
        {!collapsed && <div className="mx-4 border-t border-white/8" />}

        <div className="px-3 py-3">
          <div
            className={cn(
              "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150 hover:bg-white/5 cursor-pointer",
              collapsed && "justify-center px-0"
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-zinc-100">
              <span className="text-xs font-semibold">{initials}</span>
            </div>
            {!collapsed && (
              <>
                <span className="flex-1 truncate text-left text-[13px] font-medium text-zinc-100">
                  {displayName}
                </span>
                <MoreVertical className="h-4 w-4 shrink-0 text-zinc-500" />
              </>
            )}
          </div>

          {/* Settings & Logout — shown as simple links below avatar when expanded */}
          {!collapsed && (
            <div className="mt-1 space-y-0.5">
              <Link
                href="/configuracoes"
                className="group flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium text-zinc-500 transition-all duration-150 hover:bg-white/5 hover:text-zinc-200"
              >
                <Settings className="h-[18px] w-[18px] shrink-0 text-zinc-500 group-hover:text-zinc-200" strokeWidth={1.8} />
                <span>Configurações</span>
              </Link>
              <button
                onClick={onLogout}
                className="group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium text-zinc-500 transition-all duration-150 hover:bg-white/5 hover:text-zinc-200"
              >
                <LogOut className="h-[18px] w-[18px] shrink-0 text-zinc-500 group-hover:text-zinc-200" strokeWidth={1.8} />
                <span>Sair</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
