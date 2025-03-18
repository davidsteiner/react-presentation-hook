import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRoute({
  component: () => (
    <div className="max-w-3xl mx-auto">
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  ),
});
