// src/components/Dashboard.tsx
import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
// import api from "@/api";
// import toast from "react-hot-toast";

export const Dashboard: React.FC = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate({ to: "/login", replace: true });
    };

    // const handleResendEmailConfirmation = async () => {
    //     await api.get("/accounts/resend-confirm-email", {params: { email: user?.email }
    //     });
    //     toast.success("Email confirmation sent successfully!");
    // }

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Main content */}
            <main className="flex-1 p-8 space-y-6">
                {/* Welcome header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-semibold">Welcome, User!</h1>
                    {/* <Button className="cursor-pointer" onClick={handleResendEmailConfirmation}>Resend Email Confirmation</Button> */}
                    <Button className="cursor-pointer" onClick={handleLogout}>Log Out</Button>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Balance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">$12,345.67</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Budget</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">$3,500</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Expenses This Month</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">$1,234</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent transactions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {[
                                { date: "2025-09-01", desc: "Groceries", amount: "-$123.45" },
                                { date: "2025-09-02", desc: "Salary", amount: "+$4,500.00" },
                                { date: "2025-09-03", desc: "Rent", amount: "-$1,200.00" },
                            ].map((tx, idx) => (
                                <div key={idx} className="flex justify-between">
                                    <span>{tx.date} - {tx.desc}</span>
                                    <span className={tx.amount.startsWith("-") ? "text-red-500" : "text-green-500"}>
                                        {tx.amount}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};
