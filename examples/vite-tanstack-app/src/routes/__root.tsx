import { Outlet, createRootRoute } from "@tanstack/react-router";

import { lazy } from "react";
import { isMobile, isTablet } from "react-device-detect";

import { UnsupportedWarning } from "@/components/unsupported-warning";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : lazy(() =>
        import("@tanstack/react-router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        }))
      );

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  const isSupportedDevice = !(isMobile || isTablet);

  return (
    <div className="max-w-3xl mx-auto h-screen py-8">
      <div className="h-full px-4 py-8 flex flex-col gap-4 bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg">
        {isSupportedDevice ? <Outlet /> : <UnsupportedWarning />}
      </div>
      <TanStackRouterDevtools />
    </div>
  );
}
