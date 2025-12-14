// src/components/MainLayout.tsx
import React from "react";
import { Outlet } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

interface MainLayoutProps {
  children: React.ReactNode
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-4">
                <h2 className="text-2xl font-bold mb-6">EasyBudget</h2>
                <nav className="flex flex-col gap-2">
                    <Link to="/dashboard">
                        <Button variant="ghost" className="justify-start cursor-pointer">Dashboard</Button>
                    </Link>
                    <Link to="/accounts">
                        <Button variant="ghost" className="justify-start cursor-pointer">Accounts</Button>
                    </Link>
                    <Link to="/budgets">
                        <Button variant="ghost" className="justify-start cursor-pointer">Budgets</Button>
                    </Link>
                    <Link to="/transactions">
                        <Button variant="ghost" className="justify-start cursor-pointer">Transactions</Button>
                    </Link>
                    <Link to="/settings">
                        <Button variant="ghost" className="justify-start cursor-pointer">Settings</Button>
                    </Link>
                </nav>
            </aside>

            {/* Page content */}
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
};
