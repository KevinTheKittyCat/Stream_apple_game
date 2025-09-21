import RootWrapper from '@/components/Wrappers/rootWrapper'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <RootWrapper>
        <Outlet />
        {/*<TanStackRouterDevtools />*/}
      </RootWrapper>
    </>
  ),
})
