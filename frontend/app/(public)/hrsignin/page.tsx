"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Apple, Github, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// const API_BASE_URL = "${BASE_URL}";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const form = e.target as HTMLFormElement;
    const usernameElement = form.elements.namedItem("username") as HTMLInputElement;
    const passwordElement = form.elements.namedItem("password") as HTMLInputElement;

    if (!usernameElement || !passwordElement) {
      setError("Please fill out the username and password fields");
      setIsLoading(false);
      return;
    }

    const formData = new URLSearchParams();
    formData.append("username", usernameElement.value);
    formData.append("password", passwordElement.value);

    try {
      const response = await fetch(`${BASE_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API Response:", data); 
        if (data.token) {
          // Store token in localStorage or cookie
          localStorage.setItem("token", data.token);
          console.log("Token stored:", data.token); 
          login(data.token, data.role, data.name || "Unknown");
          router.push("/hrdash");
        } else {
          setError("Signin failed");
        }
      } else {
        const data = await response.json();
        setError(data.error || "Signin failed");
      }
    } catch (error) {
      setError("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-[1200px] p-12 bg-white shadow-lg rounded-2xl border-0">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Sign-up form */}
          <Card className="w-full max-w-lg mx-auto p-12 bg-white shadow-lg rounded-3xl border border-gray-300">
            <CardHeader className="space-y-2 text-center pb-8">
              <CardTitle className="text-4xl font-bold tracking-tight font-poppins bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent">
                Welcome to HireXpert!
              </CardTitle>
            <CardDescription className="text-black-300 text-base font-inter">
            Optimize Recruitment, Elevate Careers—Experience HireXpert
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  name="username"
                  placeholder="username"
                  required
                  className="h-12 w-full px-4 py-2 border border-black-300 rounded-md"
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  className="h-12 w-full px-4 py-2 border border-black-300 rounded-md"
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <Link href="/forgot-password" className="text-black-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Button
                type="submit"
                className="w-full h-12 text-base bg-black hover:bg-gray-800 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            {error && <div className="text-gray-500 text-center mt-4">{error}</div>}
            {error && <div className="text-gray-500 text-center mt-4">{error}</div>}
              <div className="mt-8 text-center text-sm text-slate-500 font-inter">
                Already have an account?{" "}
                <Link href="/hrsignup" className="text-black-600 hover:text-black-300 font-medium transition-colors">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
          {/* Side information */}
        
        <div className="hidden md:block bg-white p-8 rounded-2xl shadow-lg">
          <div className="relative h-[500px] w-full">
            <Image
              src="https://images.unsplash.com/photo-1551135049-8a33b5883817?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="hr operations"
              fill
              className="object-cover rounded-xl"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0 rounded-xl" />
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h2 className="text-2xl font-bold font-poppins mb-2">Streamline HR Processes</h2>
              <p className="text-slate-200 font-inter">
              Boost efficiency and engagement with smart digital solutions
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
    </main>
  );
}