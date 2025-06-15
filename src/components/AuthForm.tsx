"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormField from "./FormField";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


const AuthFormSchema = (type: FormType) => {
  return z.object({
    name:
      type === "sign-up"
        ? z
            .string()
            .trim()
            .min(1, { message: "Please enter your name" })
            .min(3, { message: "Username must be longer then 3 characters" })
            .max(20, { message: "Username must be within 20 characters" })
        : z.string().optional(),
    email: z.string().trim()
    .min(1, { message: "Please enter your email" }).email({
      message: "Please enter a valid email address",
    }),
    password: z.string().trim()
    .min(1, { message: "Please enter password" }).min(6, {
      message: "Password must be at least 6 characters",
    }),
  });
};
const AuthForm = ({ type }: { type: FormType }) => {
  const formSchema = AuthFormSchema(type);
   const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      if (type === "sign-up") {
      
          toast.success("Account created successfully!");
        console.log("Sign-up values:", values);
        router.push('/sign-in');
      } else {
        
          toast.success("Signed in successfully!");
          router.push('/');
        console.log("Sign-in values:", values);
      }
    } catch (error) {
      console.log("Error submitting form:", error);
      toast.error(`An error occurred while submitting the form. ${error}`);
    }
  };

  const isSignIn = type === "sign-up";
  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10 ">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={32} />
          <h2>NexView</h2>
        </div>
        <h3>Practice job interview with AI</h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Enter your username"
              />
            )}
            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Enter your email address"
              type="email"
            />{" "}
            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />
            <Button className="btn" type="submit">
              {isSignIn ? "Sign in" : "Create an Account"}
            </Button>
          </form>
        </Form>
        <p className="text-center">
          {isSignIn ? "Don't have an account yet?" : "already Have an Account."}
          <Link
            href={!isSignIn ? "/sign-up" : "/sign-in"}
            className="font-bold text-user-primary ml-1 hover:underline "
          >
            {!isSignIn ? "Sign in" : "Sign up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
