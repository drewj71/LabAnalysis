// src/components/ResetPasswordForm.tsx
import { useForm } from "react-hook-form";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { resetPasswordRoute } from "@/router";
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

interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

interface ResetPasswordSearch {
  email?: string;
  token?: string;
}

export const ResetPasswordForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<ResetPasswordFormValues>({
    mode: "onChange", // live validation
  });

  const navigate = useNavigate();
  const search = useSearch({ from: resetPasswordRoute as any }) as ResetPasswordSearch;
  const { email, token } = search;

  const passwordValue = watch("password");
  const confirmPasswordValue = watch("confirmPassword");

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!email || !token) {
      toast.error("Invalid reset link");
      return;
    }

    try {
      await api.post("/auth/reset-password", {
        email,
        token,
        newPassword: data.password,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Password reset successfully!");
      navigate({ to: "/login" as any });
    } catch (err: any) {
      console.error(err);
      const message =
        err?.response?.data?.message ||
        "Failed to reset password. Please try again.";
      toast.error(message);
    }
  };

  const canSubmit =
    isValid &&
    passwordValue &&
    confirmPasswordValue &&
    passwordValue === confirmPasswordValue;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Card className="w-full max-w-sm shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Reset Password
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "At least 6 characters" },
                  pattern: {
                    value: /(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/,
                    message:
                      "Must include uppercase, lowercase, and special character",
                  },
                })}
              />
              {/* Password rules */}
              <ul className="text-sm mt-1 space-y-1">
                <li className="flex items-center gap-1">
                  <span className="text-red-500">•</span> At least 6 characters
                </li>
                <li className="flex items-center gap-1">
                  <span className="text-red-500">•</span> At least one uppercase letter
                </li>
                <li className="flex items-center gap-1">
                  <span className="text-red-500">•</span> At least one lowercase letter
                </li>
                <li className="flex items-center gap-1">
                  <span className="text-red-500">•</span> At least one special character
                </li>
              </ul>
              {errors.password && (
                <span className="text-red-500 text-sm">{errors.password.message}</span>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="********"
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                  validate: (value) =>
                    value === passwordValue || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" className="w-full cursor-pointer" disabled={!canSubmit}>
              Reset Password
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
