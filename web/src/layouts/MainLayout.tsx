// src/layouts/app/MainLayout.tsx
import { Outlet, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function MainLayout() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-4">
        <h2 className="text-2xl font-bold mb-6">EasyBudget</h2>
        <nav className="flex flex-col gap-2">
          <Link to="/dashboard">
            <Button variant="ghost" className="justify-start w-full">
              Dashboard
            </Button>
          </Link>
          <Link to="/accounts">
            <Button variant="ghost" className="justify-start w-full">
              Accounts
            </Button>
          </Link>
          <Link to="/budgets">
            <Button variant="ghost" className="justify-start w-full">
              Budgets
            </Button>
          </Link>
          <Link to="/transactions">
            <Button variant="ghost" className="justify-start w-full">
              Transactions
            </Button>
          </Link>
          <Link to="/settings">
            <Button variant="ghost" className="justify-start w-full">
              Settings
            </Button>
          </Link>
        </nav>
      </aside>

      {/* Routed content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
