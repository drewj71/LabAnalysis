// src/router.tsx
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from '@tanstack/react-router'

import { useAuth } from '@/hooks/useAuth'

// Auth / public pages
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import ForgotPassword from '@/pages/auth/ForgotPassword'
import ResetPassword from '@/pages/auth/ResetPassword'
import EmailConfirmation from '@/pages/auth/EmailConfirmation'

// App pages
import { Dashboard } from '@/pages/app/Dashboard'
import { Accounts } from '@/pages/app/Accounts'
import { Budgets } from '@/pages/app/Budgets'
import { Transactions } from '@/pages/app/Transactions'
import { Settings } from '@/pages/app/Settings'

// Layout
import { MainLayout } from '@/layouts/MainLayout'
import { LandingLayout } from '@/layouts/LandingLayout'

/* -----------------------------------------------------
   Root route
----------------------------------------------------- */

const rootRoute = createRootRoute({
  component: Outlet,
})

/* -----------------------------------------------------
   Public routes
----------------------------------------------------- */

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => {
    const { token } = useAuth()

    if (token) return <Navigate to="/dashboard" />

    return <LandingLayout />
  },
})

const loginRoute = createRoute({
  getParentRoute: () => landingRoute,
  path: '/login',
  component: Login,
})

const registerRoute = createRoute({
  getParentRoute: () => landingRoute,
  path: '/register',
  component: Register,
})

const forgotPasswordRoute = createRoute({
  getParentRoute: () => landingRoute,
  path: '/forgot-password',
  component: ForgotPassword,
})

const resetPasswordRoute = createRoute({
  getParentRoute: () => landingRoute,
  path: '/reset-password',
  component: ResetPassword,
})

const emailConfirmationRoute = createRoute({
  getParentRoute: () => landingRoute,
  path: '/confirm-email',
  component: EmailConfirmation,
})

/* -----------------------------------------------------
   Authenticated app route (THE KEY CHANGE)
----------------------------------------------------- */

const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app',
  component: () => {
    const { token } = useAuth()

    if (!token) return <Navigate to="/" />

    return <MainLayout />
  },
})

/* -----------------------------------------------------
   App child routes
----------------------------------------------------- */

const dashboardRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/dashboard',
  component: Dashboard,
})

const accountsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/accounts',
  component: Accounts,
})

const budgetsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/budgets',
  component: Budgets,
})

const transactionsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/transactions',
  component: Transactions,
})

const settingsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/settings',
  component: Settings,
})

/* -----------------------------------------------------
   Route tree
----------------------------------------------------- */

const routeTree = rootRoute.addChildren([
  landingRoute.addChildren([
    loginRoute,
    registerRoute,
    forgotPasswordRoute,
    resetPasswordRoute,
    emailConfirmationRoute,
  ]),
  appRoute.addChildren([
    dashboardRoute,
    accountsRoute,
    budgetsRoute,
    transactionsRoute,
    settingsRoute,
  ]),
])

/* -----------------------------------------------------
   Router
----------------------------------------------------- */

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

/* -----------------------------------------------------
   Type safety
----------------------------------------------------- */

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

/* -----------------------------------------------------
   Provider
----------------------------------------------------- */

export function AppRouter() {
  return <RouterProvider router={router} />
}
