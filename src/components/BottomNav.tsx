import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Bell, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/help", icon: Bell, label: "Updates" },
  { to: "/ask", icon: MessageCircle, label: "Ask AI" },
  { to: "/profile", icon: User, label: "Profile" },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {items.map(({ to, icon: Icon, label }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl transition-all",
                  active && "bg-primary text-primary-foreground shadow-soft scale-110",
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
              </div>
              <span className={cn("text-[11px] font-semibold", active && "text-primary")}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
