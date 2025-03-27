import { Outlet, createRootRoute } from "@tanstack/react-router";
import { lazy } from "react";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : lazy(() =>
      import("@tanstack/react-router-devtools").then((res) => ({
        default: res.TanStackRouterDevtools,
      }))
    );

export const Route = createRootRoute({
  component: () => (
    <div className="max-w-3xl mx-auto h-screen py-8">
      <div className="h-full px-4 py-8 flex flex-col gap-4 bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg">
        <Outlet />
      </div>
      <TanStackRouterDevtools />
    </div>
  ),
});
