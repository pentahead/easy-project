import { createRootRoute, Outlet } from "@tanstack/react-router";
import NotFound from "../components/NotFound/404";

export const Route = createRootRoute({
  component: () => (
    <>
        <Outlet />
    </>
  ),
  notFoundComponent: NotFound,
});
