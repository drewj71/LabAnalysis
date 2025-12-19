// src/components/RegisterForm.tsx
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, Link } from "@tanstack/react-router";
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
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isValid },
  } = useForm<RegisterFormValues>({
    mode: "onChange",
  });

  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const passwordValue = watch("password");
  const confirmPasswordValue = watch("confirmPassword");

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerUser(data.email, data.password, data.confirmPassword);
      toast.success("Please check your email to confirm your account.");
      navigate({ to: "/dashboard" });
    } catch (err: AxiosError | any) {
      if (err.response?.data) {
        const data = err.response.data;

        // Case 1: email already exists (string)
        if (typeof data === "string") {
          setError("email", { type: "server", message: data });
        }
        // Case 2: password requirement errors (array of objects)
        else if (Array.isArray(data)) {
          data.forEach((e) => {
            setError("password", { type: "server", message: e.description });
          });
        }
      } else {
        // fallback for network or unknown errors
        setError("email", { type: "server", message: "Registration failed" });
      }

      console.error(err);
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
            Create Account
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
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
                required
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email.message}</span>
              )}
            </div>

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
                  <span className="text-red-500">•</span>
                  At least 6 characters
                </li>
                <li className="flex items-center gap-1">
                  <span className="text-red-500">•</span>
                  At least one uppercase letter
                </li>
                <li className="flex items-center gap-1">
                  <span className="text-red-500">•</span>
                  At least one lowercase letter
                </li>
                <li className="flex items-center gap-1">
                  <span className="text-red-500">•</span>
                  At least one special character
                </li>
              </ul>
              {/* Error from server */}
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
              Register
            </Button>
            <div className="flex justify-center w-full">
              <Button asChild variant="link" className="px-0 text-sm">
                <Link to="/login">Already have an account? Login</Link>
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
