import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { BottomNav } from "./BottomNav";

interface Props {
  title?: string;
  subtitle?: string;
  back?: string;
  children: ReactNode;
  hero?: ReactNode;
}

export function PageShell({ title, subtitle, back, children, hero }: Props) {
  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="mx-auto max-w-md">
        {hero ? (
          hero
        ) : (
          <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-lg px-5 pt-6 pb-4">
            <div className="flex items-center gap-3">
              {back && (
                <Link
                  to={back}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border hover:bg-muted transition-colors"
                  aria-label="Back"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Link>
              )}
              <div className="flex-1">
                {title && <h1 className="text-2xl font-bold">{title}</h1>}
                {subtitle && (
                  <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
                )}
              </div>
            </div>
          </header>
        )}
        <main className="px-5 pt-2">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
