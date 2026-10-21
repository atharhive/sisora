"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedRef = useRef<string>("");

  useEffect(() => {
    if (!pathname) return;

    // Do not track admin panels, internal api calls, or login console
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    const searchString = searchParams ? searchParams.toString() : "";
    const fullPath = searchString ? `${pathname}?${searchString}` : pathname;

    // Prevent immediate duplicate fires on the exact same fullPath in the same session
    if (lastTrackedRef.current === fullPath) {
      return;
    }
    lastTrackedRef.current = fullPath;

    const track = () => {
      try {
        const payload = JSON.stringify({
          path: fullPath,
          referrer: typeof document !== "undefined" ? document.referrer || "" : "",
          screen:
            typeof window !== "undefined"
              ? `${window.innerWidth}x${window.innerHeight}`
              : null,
          title: typeof document !== "undefined" ? document.title : "",
        });

        // Use sendBeacon if supported for zero impact on navigation
        if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
          const blob = new Blob([payload], { type: "application/json" });
          const sent = navigator.sendBeacon("/api/analytics/track", blob);
          if (sent) return;
        }

        // Fallback to fetch with keepalive
        fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {
          // Non-critical, ignore network error silently
        });
      } catch {
        // Safe failover
      }
    };

    // Run when idle or after brief delay so initial page render is never delayed
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = (window as unknown as { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(track);
      return () => {
        if ("cancelIdleCallback" in window) {
          (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(id);
        }
      };
    } else {
      const timer = setTimeout(track, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  return null;
}

export default AnalyticsTracker;
