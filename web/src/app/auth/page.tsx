"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { apiClient } from "@/lib/api-client";
import { useAppContext } from "@/contexts/AppContext";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const registerSchema = z.object({
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

const testimonials = [
  {
    quote:
      "The journey of a thousand miles begins with a single step, and a comfortable stay.",
    author: "Ranit Manik",
  },
  {
    quote:
      "Travel makes one modest. You see what a tiny place you occupy in the world.",
    author: "Gustave Flaubert",
  },
  {
    quote: "To travel is to live.",
    author: "Hans Christian Andersen",
  },
  {
    quote: "Investment in travel is an investment in yourself.",
    author: "Matthew Karsten",
  },
];

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const router = useRouter();

  const { validateToken } = useAppContext();

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    try {
      await apiClient.post("/api/auth/login", values);
      await validateToken();
      toast.success("Welcome back!");
      router.push("/");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Invalid credentials";
      toast.error(message);
    }
  }

  async function onRegisterSubmit(values: z.infer<typeof registerSchema>) {
    try {
      await apiClient.post("/api/users/register", values);
      await validateToken();
      toast.success("Account created successfully!");
      setAuthMode("login"); // Optionally redirect to home or login
      router.push("/");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create account";
      toast.error(message);
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-row overflow-hidden">
      {/* Left Side: Visual Storytelling */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-zinc-900 p-12 lg:flex">
        <Image
          src="/assets/hero-hotel.jpg"
          alt="Serene tropical hotel pool at sunset"
          fill
          className="absolute inset-0 object-cover opacity-60"
          priority
        />
        {/* Branding Overlay Top */}
        <div className="relative z-10 flex items-center gap-3">
          <Image
            src="/logo/logo.svg"
            alt="Vihara Logo"
            width={32}
            height={32}
            className="rounded-sm"
          />
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            Vihara
          </h2>
        </div>

        {/* Testimonial / Quote Overlay Bottom Right */}
        <div
          key={testimonialIndex}
          className="animate-in fade-in slide-in-from-bottom-4 relative z-10 max-w-sm self-end text-right duration-1000"
        >
          <p className="text-xl leading-relaxed font-light text-white/90">
            "{testimonials[testimonialIndex].quote}"
          </p>
          <p className="mt-3 text-sm font-medium text-white/60">
            &mdash; {testimonials[testimonialIndex].author}
          </p>
        </div>
      </div>

      {/* Right Side: Authentication Form */}
      <div className="bg-background flex min-h-screen w-full flex-col overflow-y-auto p-6 sm:p-12 lg:w-1/2 xl:p-24">
        {/* Mobile Header Logo */}
        <div className="mb-12 flex shrink-0 items-center gap-2.5 lg:hidden">
          <Image
            src="/logo/logo.svg"
            alt="Vihara Logo"
            width={28}
            height={28}
            className="rounded-sm"
          />
          <h2 className="text-lg font-semibold">Vihara</h2>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <div className="mx-auto flex w-full max-w-md flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl leading-tight font-bold tracking-tight">
                {authMode === "login" ? "Welcome Back" : "Create an Account"}
              </h1>
              <p className="text-muted-foreground text-base font-normal">
                {authMode === "login"
                  ? "Plan your next escape with ease."
                  : "Join us and start your journey."}
              </p>
            </div>

            <Tabs
              value={authMode}
              onValueChange={(v) => setAuthMode(v as "login" | "signup")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="mt-2">
              {authMode === "login" ? (
                <Form {...loginForm} key="login-form">
                  <form
                    onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                    className="flex flex-col gap-5"
                  >
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="name@example.com"
                              {...field}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel className="font-semibold">
                              Password
                            </FormLabel>
                            <Link
                              href="#"
                              className="text-primary text-xs font-medium hover:underline hover:underline-offset-4"
                            >
                              Forgot Password?
                            </Link>
                          </div>
                          <FormControl>
                            <div className="group relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pr-10"
                                {...field}
                                value={field.value ?? ""}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                              >
                                {showPassword ? (
                                  <EyeOff className="h-5 w-5" />
                                ) : (
                                  <Eye className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full font-bold shadow-md"
                    >
                      Log In
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form {...registerForm} key="register-form">
                  <form
                    onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                    className="flex flex-col gap-5"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">
                              First Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John"
                                {...field}
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">
                              Last Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Doe"
                                {...field}
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="name@example.com"
                              {...field}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">
                            Password
                          </FormLabel>
                          <FormControl>
                            <div className="group relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pr-10"
                                {...field}
                                value={field.value ?? ""}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                              >
                                {showPassword ? (
                                  <EyeOff className="h-5 w-5" />
                                ) : (
                                  <Eye className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full font-bold shadow-md"
                    >
                      Sign Up
                    </Button>
                  </form>
                </Form>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background text-muted-foreground px-2">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() =>
                  toast.info(
                    "Social login is for design only. Please use email.",
                  )
                }
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() =>
                  toast.info(
                    "Social login is for design only. Please use email.",
                  )
                }
              >
                <svg viewBox="0 0 666.66668 666.66717" className="h-5 w-5">
                  <g transform="matrix(1.3333333,0,0,-1.3333333,-133.33333,799.99999)">
                    <g>
                      <g>
                        <g transform="translate(600,350)">
                          <path
                            d="m 0,0 c 0,138.071 -111.929,250 -250,250 -138.071,0 -250,-111.929 -250,-250 0,-117.245 80.715,-215.622 189.606,-242.638 v 166.242 h -51.552 V 0 h 51.552 v 32.919 c 0,85.092 38.508,124.532 122.048,124.532 15.838,0 43.167,-3.105 54.347,-6.211 V 81.986 c -5.901,0.621 -16.149,0.932 -28.882,0.932 -40.993,0 -56.832,-15.528 -56.832,-55.9 V 0 h 81.659 l -14.028,-76.396 h -67.631 V -248.169 C -95.927,-233.218 0,-127.818 0,0"
                            style={{
                              fill: "#0866ff",
                              fillOpacity: 1,
                              fillRule: "nonzero",
                              stroke: "none",
                            }}
                          />
                        </g>
                        <g transform="translate(447.9175,273.6036)">
                          <path
                            d="M 0,0 14.029,76.396 H -67.63 v 27.019 c 0,40.372 15.838,55.899 56.831,55.899 12.733,0 22.981,-0.31 28.882,-0.931 v 69.253 c -11.18,3.106 -38.509,6.212 -54.347,6.212 -83.539,0 -122.048,-39.441 -122.048,-124.533 V 76.396 h -51.552 V 0 h 51.552 v -166.242 c 19.343,-4.798 39.568,-7.362 60.394,-7.362 10.254,0 20.358,0.632 30.288,1.831 L -67.63,0 Z"
                            style={{
                              fill: "#ffffff",
                              fillOpacity: 1,
                              fillRule: "nonzero",
                              stroke: "none",
                            }}
                          />
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
                Facebook
              </Button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-muted-foreground text-sm">
                Are you a hotel owner?{" "}
                <Link
                  href="#"
                  className="text-primary font-semibold hover:underline hover:underline-offset-4"
                >
                  Partner with us
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
