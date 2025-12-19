import React from 'react';
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import api from "@/api";
import toast from "react-hot-toast";

interface EmailConfirmationSearch {
    email?: string;
    token?: string;
}

export default function EmailConfirmation() {
    const navigate = useNavigate();
    const search = useSearch({ from: '/confirm-email' }) as EmailConfirmationSearch;
    const { email, token } = search;
    const hasSubmittedRef = React.useRef(false);

    React.useEffect(() => {
        if (hasSubmittedRef.current) return;
        hasSubmittedRef.current = true;

        const submitEmailConfirmation = async () => {
            if (!email || !token) {
                toast.error("Invalid email confirmation link");
                navigate({ to: "/login" });
                return;
            }

            try {
                await api.get("/accounts/confirm-email", {
                    params: { email, token }
                });

                toast.success("Your email has been confirmed!");
                navigate({ to: "/login" });
            } catch {
                toast.error("Email confirmation failed.");
                navigate({ to: "/login" });
            }
        };

        submitEmailConfirmation();
    }, [email, token, navigate]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted">
            <Card className="w-full max-w-sm shadow-md">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-semibold">
                        Email Confirmed
                    </CardTitle>
                    <CardDescription>
                        Your email has been confirmed! You will be redirected.
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
}