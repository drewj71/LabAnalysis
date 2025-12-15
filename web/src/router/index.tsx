import { createRootRoute, createRoute, createRouter, RouterProvider, Outlet } from '@tanstack/react-router'
import { LoginForm } from '../components/authentication/LoginForm'
import { RegisterForm } from '../components/authentication/RegisterForm'
import { ForgotPasswordForm } from '../components/authentication/ForgotPasswordForm'
import { ResetPasswordForm } from '../components/authentication/ResetPasswordForm'
import { EmailConfirmation } from '../components/authentication/EmailConfirmation'
import { Dashboard } from '../components/Dashboard'
import { Accounts } from '../components/Accounts'
import { Budgets } from '../components/Budgets'
import { Transactions } from '../components/Transactions'
import { Settings } from '../components/Settings'
import { useAuth } from '../hooks/useAuth'
import { MainLayout } from '@/components/MainLayout'

// Define child routes first
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LoginForm,
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterForm,
})

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot-password',
  component: ForgotPasswordForm,
})

export const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reset-password',
  component: ResetPasswordForm
})

export const emailConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/confirm-email',
  component: EmailConfirmation,
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => {
    const { token } = useAuth()
    if (!token) {
      window.location.href = '/'
      return null
    }
    return <MainLayout><Dashboard /></MainLayout>
  },
})

const accountsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/accounts',
  component: () => {
    const { token } = useAuth()
    if (!token) {
      window.location.href = '/'
      return null
    }
    return <MainLayout><Accounts /></MainLayout>
  },
})

const budgetsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/budgets',
  component: () => {
    const { token } = useAuth()
    if (!token) {
      window.location.href = '/'
      return null
    }
    return <MainLayout><Budgets /></MainLayout>
  },
})

const transactionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/transactions',
  component: () => {
    const { token } = useAuth()
    if (!token) {
      window.location.href = '/'
      return null
    }
    return <MainLayout><Transactions /></MainLayout>
  },
})

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: () => {
    const { token } = useAuth()
    if (!token) {
      window.location.href = '/'
      return null
    }
    return <MainLayout><Settings /></MainLayout>
  },
})

// Root route with children
const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

// Build the route tree
const routeTree = rootRoute.addChildren([indexRoute, registerRoute, forgotPasswordRoute, resetPasswordRoute, emailConfirmationRoute, dashboardRoute, accountsRoute, budgetsRoute, transactionsRoute, settingsRoute])

// Create router with the complete route tree
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

// Type declaration for better TypeScript support
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// AppRouter component
export const AppRouter: React.FC = () => <RouterProvider router={router} />