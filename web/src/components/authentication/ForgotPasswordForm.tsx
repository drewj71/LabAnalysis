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
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

interface  ForgotPasswordFormValues {
  email: string;
}

export const ForgotPasswordForm: React.FC = () => {
  const { register: registerInput, handleSubmit } = useForm<ForgotPasswordFormValues>();
  const { login } = useAuth();
  const navigate = useNavigate(); 

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    // try {
    //   await login(data.email, data.password);
    //   navigate({ to: "/dashboard" });
    // } catch (err) {
    //   toast.error("Login failed. Please check your credentials and try again.");
    //   console.error(err);
    // }
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
            <Button type="submit" className="w-full cursor-pointer">
              Send Email
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
