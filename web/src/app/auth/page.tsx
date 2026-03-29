"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { useLogin, useRegister } from "@/hooks/use-auth";

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

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();
  const register = useRegister();

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
    login.mutate(values);
  }

  async function onRegisterSubmit(values: z.infer<typeof registerSchema>) {
    register.mutate(values);
  }

  const handleGoogleLogin = () => {
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  const activeForm =
    authMode === "login"
      ? {
          form: loginForm,
          title: "Welcome back",
          subtitle: "Pick up your next trip exactly where you left it.",
          submitLabel: "Log in",
        }
      : {
          form: registerForm,
          title: "Create your account",
          subtitle: "Start booking beautiful stays with less friction.",
          submitLabel: "Create account",
        };

  return (
    <main className="">
      <div className="grid min-h-screen overflow-hidden bg-[#201612] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden p-8 text-white lg:flex lg:flex-col lg:justify-between xl:p-10">
          <Image
            src="/hotels/hotel-image-03.jpg"
            alt="Serene hotel pool at sunset"
            fill
            priority
            className="object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(238,193,136,0.28),transparent_28%),linear-gradient(180deg,rgba(16,11,9,0.2),rgba(16,11,9,0.88))]" />

          <div className="relative z-10 flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="bg-primary/20 border-primary/30 flex h-11 w-11 items-center justify-center rounded-2xl border">
                <Image
                  src="/logo/logo.svg"
                  alt="Vihara logo"
                  width={24}
                  height={24}
                  className="rounded-sm"
                />
              </div>
              <p className="font-heading text-3xl leading-none font-semibold">
                Vihara
              </p>
            </Link>
          </div>

          <div className="relative z-10 space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-amber-300" />
              Designed to make planning feel calm again
            </div>

            <div className="max-w-xl space-y-4">
              <h2 className="font-heading text-6xl leading-[0.95] font-semibold">
                Book stays with a little more taste and a lot less clutter.
              </h2>
              <p className="max-w-lg text-base leading-7 text-white/74">
                Save time, manage trips, and move between discovery and booking
                in a flow that feels polished from the first click.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[linear-gradient(180deg,rgba(255,250,243,0.98),rgba(250,244,232,0.98))] p-6 sm:p-8 xl:p-12">
          <div className="mx-auto flex h-full w-full max-w-xl flex-col justify-center">
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="bg-primary/12 flex h-11 w-11 items-center justify-center rounded-2xl">
                <Image
                  src="/logo/logo.svg"
                  alt="Vihara logo"
                  width={22}
                  height={22}
                />
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-semibold tracking-[0.22em] uppercase">
                  Stay beautifully
                </p>
                <h2 className="font-heading text-3xl leading-none font-semibold">
                  Vihara
                </h2>
              </div>
            </div>

            <div className="surface-panel p-6 sm:p-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="section-kicker">
                    {authMode === "login" ? "Member access" : "New journey"}
                  </p>
                  <h1 className="font-heading text-5xl leading-none font-semibold">
                    {activeForm.title}
                  </h1>
                  <p className="text-muted-foreground text-base leading-7">
                    {activeForm.subtitle}
                  </p>
                </div>

                <Tabs
                  value={authMode}
                  onValueChange={(value) =>
                    setAuthMode(value as "login" | "signup")
                  }
                  className="w-full"
                >
                  <TabsList className="bg-secondary grid h-12 w-full grid-cols-2 rounded-full p-1">
                    <TabsTrigger value="login" className="rounded-full">
                      Login
                    </TabsTrigger>
                    <TabsTrigger value="signup" className="rounded-full">
                      Sign up
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {authMode === "login" ? (
                  <Form {...loginForm}>
                    <form
                      onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                      className="space-y-5"
                    >
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">
                              Email
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="name@example.com"
                                className="h-12 rounded-2xl"
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
                              <FormLabel className="text-sm font-semibold">
                                Password
                              </FormLabel>
                              {/* <Link
                                href="#"
                                className="text-primary text-xs font-semibold hover:underline"
                              >
                                Forgot password?
                              </Link> */}
                            </div>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="••••••••"
                                  className="h-12 rounded-2xl pr-12"
                                  {...field}
                                  value={field.value ?? ""}
                                />
                                <button
                                  type="button"
                                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-4 -translate-y-1/2"
                                  onClick={() =>
                                    setShowPassword((current) => !current)
                                  }
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
                        className="h-12 w-full rounded-full text-base font-semibold"
                        disabled={login.isPending || register.isPending}
                      >
                        {login.isPending || register.isPending
                          ? "Processing..."
                          : activeForm.submitLabel}
                      </Button>
                    </form>
                  </Form>
                ) : (
                  <Form {...registerForm} key="signup-form">
                    <form
                      onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                      className="space-y-5"
                    >
                      <div className="grid gap-5 sm:grid-cols-2">
                        <FormField
                          control={registerForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold">
                                First name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Aanya"
                                  className="h-12 rounded-2xl"
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
                              <FormLabel className="text-sm font-semibold">
                                Last name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Sharma"
                                  className="h-12 rounded-2xl"
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
                            <FormLabel className="text-sm font-semibold">
                              Email
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="name@example.com"
                                className="h-12 rounded-2xl"
                                name={field.name}
                                ref={field.ref}
                                value={field.value ?? ""}
                                onBlur={field.onBlur}
                                onChange={field.onChange}
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
                            <FormLabel className="text-sm font-semibold">
                              Password
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="••••••••"
                                  className="h-12 rounded-2xl pr-12"
                                  {...field}
                                  value={field.value ?? ""}
                                />
                                <button
                                  type="button"
                                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-4 -translate-y-1/2"
                                  onClick={() =>
                                    setShowPassword((current) => !current)
                                  }
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
                        className="h-12 w-full rounded-full text-base font-semibold"
                        disabled={login.isPending || register.isPending}
                      >
                        {login.isPending || register.isPending
                          ? "Processing..."
                          : activeForm.submitLabel}
                      </Button>
                    </form>
                  </Form>
                )}

                <div className="relative mt-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="text-muted-foreground bg-[#FFFAF3] px-2">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  type="button"
                  className="h-12 w-full rounded-full text-base font-semibold"
                  onClick={handleGoogleLogin}
                >
                  <svg className="mr-1 size-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Sign in with Google
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
