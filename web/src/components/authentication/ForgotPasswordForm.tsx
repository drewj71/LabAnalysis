// src/components/ForgotPasswordForm.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import api from "@/api";

interface ForgotPasswordFormValues {
  email: string;
}

export const ForgotPasswordForm: React.FC = () => {
  const { register: registerInput, handleSubmit } = useForm<ForgotPasswordFormValues>();
  const navigate = useNavigate();
  const [cooldown, setCooldown] = React.useState(0);

  React.useEffect(() => {
    if (cooldown <= 0) return;

    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      await api.post("/auth/forgot-password", { email: data.email }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success("Reset password email sent successfully!");
      setCooldown(30);
    } catch (err) {
      toast.error("Failed to send reset password email. Please try again later.");
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Card className="w-full max-w-sm shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Forgot Password
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...registerInput("email")}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" className="w-full cursor-pointer" disabled={cooldown > 0}>
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Send Email"}
            </Button>
            <div className="flex justify-between w-full">
              <Button variant="link" className="px-0 text-sm cursor-pointer" onClick={() => window.location.href = '/'}>
                Login
              </Button>
              <Button variant="link" className="px-0 text-sm cursor-pointer" onClick={() => window.location.href = '/register'}>
                Register
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
