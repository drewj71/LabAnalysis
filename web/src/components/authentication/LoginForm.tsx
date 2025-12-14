// src/components/LoginForm.tsx
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
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

interface LoginFormValues {
  email: string;
  password: string;
}

export const LoginForm: React.FC = () => {
  const { register: registerInput, handleSubmit } = useForm<LoginFormValues>();
  const { login } = useAuth();
  const navigate = useNavigate(); 

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password);
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error("Login failed. Please check your credentials and try again.");
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Card className="w-full max-w-sm shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Login
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

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                {...registerInput("password")}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" className="w-full cursor-pointer">
              Login
            </Button>
            <div className="flex justify-between w-full">
              <Button variant="link" className="px-0 text-sm cursor-pointer" onClick={() => window.location.href = '/register'}>
                Register
              </Button>
              <Button variant="link" className="px-0 text-sm cursor-pointer" onClick={() => window.location.href = '/forgot-password'}>
                Forgot password?
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
