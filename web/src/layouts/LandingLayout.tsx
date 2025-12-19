// src/layouts/LandingLayout.tsx
import { Outlet, Link } from '@tanstack/react-router'

export function LandingLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="w-full flex justify-between items-center p-6 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">LabAnalysis</h1>
        <nav className="flex gap-4">
          <Link className="text-gray-700 hover:text-gray-900" to="/login">Login</Link>
          <Link className="text-gray-700 hover:text-gray-900" to="/register">Register</Link>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-500 p-6 text-center">
        © {new Date().getFullYear()} LabAnalysis. All rights reserved.
      </footer>
    </div>
  )
}
