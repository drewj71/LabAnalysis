import React from 'react';
import { useNavigate, useSearch } from "@tanstack/react-router";
import { emailConfirmationRoute } from "@/router";
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

export const EmailConfirmation: React.FC = () => {
    const navigate = useNavigate();
    const search = useSearch({ from: emailConfirmationRoute as any }) as EmailConfirmationSearch;
    const { email, token } = search;

    React.useEffect(() => {
        const submitEmailConfirmation = async () => {
            if (!email || !token) {
                toast.error("Invalid email confirmation link");
                navigate({ to: "/" });
                return;
            }

            await api.get("/accounts/confirm-email", {
                params: { email, token }
            });

            toast.success("Your email has been confirmed!");
            navigate({ to: "/" });
        };

        submitEmailConfirmation();
    }, [email, token]);


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