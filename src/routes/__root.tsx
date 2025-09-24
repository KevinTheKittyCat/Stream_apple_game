import RootWrapper from '@/components/Wrappers/rootWrapper'
import CanvasApp from '@/components/Canvas/CanvasApp'
import { Outlet, createRootRoute } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <RootWrapper>
        <Outlet />
        {/* Main Game Canvas */}
        {/* Loaded here because of performance - So much for routing I suppose. */}
        <CanvasApp />
        {/*<TanStackRouterDevtools />*/}
      </RootWrapper>
    </>
  ),
})
