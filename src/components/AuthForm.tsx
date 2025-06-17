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
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/client";
import { signUp,signIn } from "../../lib/auth.action";
import { signInWithGithub, signInWithGoogle } from "../../lib/auth.provider";
import { useCallback, useState } from "react";


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
  const [loading, setLoading] = useState(false);
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (loading) return;
    setLoading(true);
    try {
      if (type === "sign-up") {
        const { name, email, password } = values;
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const idToken = await userCredentials.user.getIdToken();
        if (!idToken) {
          toast.error("Failed to retrieve user token. Please try again.");
          return;
        }
        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,
          idToken
        });

        if (!result?.success) {
          toast.error(result?.message);
          return;
        }

        toast.success("Account created successfully!");
        router.push("/sign-in");
      } else {
        const { email, password } = values;
        const userCredentials = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const idToken = await userCredentials.user.getIdToken();

        if (!idToken) {
          toast.error("Failed to retrieve user token. Please try again.");
          return;
        }

        await signIn({
          email,
          idToken,
        });

        toast.success("Signed in successfully!");
        router.push("/");
        console.log("Sign-in values:", values);
      }
    } catch (error) {
      console.log("Error submitting form:", error);
      toast.error(`An error occurred while submitting the form. ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogleHandler = async () => {
    if (loading) return;

    // 📌 Don’t block popup with loading setState
    const result = await signInWithGoogle();

    if (!result?.success) {
      toast.error(result?.message);
      return;
    }

    setLoading(true);
    toast.success("Signed in with Google successfully!");
    router.push("/");
  };

  const signInWithGithubHandler = async () => {
    if (loading) return;

    const result = await signInWithGithub();

    if (!result?.success) {
      toast.error(result?.message);
      return;
    }

    setLoading(true);
    toast.success("Signed in with GitHub successfully!");
    router.push("/");
  };
  
  const isSignIn = type === "sign-in";
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
            {!isSignIn  && (
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
        <div>
          <p className="text-center">-- Or continue with --</p>
          <div className="flex justify-center gap-4 mt-4">
            <Button
              variant="outline"
              size="icon"
              className="w-fit h-10 px-4 py-2"
              onClick={signInWithGoogleHandler}
              disabled={loading}
            >
              <Image src="/google.svg" alt="Google" width={25} height={25} />
              <span className="text-lg ml-2">Google</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="w-fit h-10 px-4 py-2"
              onClick={signInWithGithubHandler}
              disabled={loading}
            >
              <Image src="/github.svg" alt="GitHub" width={25} height={25} />
              <span className="text-lg ml-2">Github</span>
            </Button>
          </div>
        </div>
        <p className="text-center">
          {isSignIn ? "Don't have an account yet?" : "already Have an Account."}
          <Link
            href={!isSignIn ?  "/sign-in":"/sign-up" }
            className="font-bold text-user-primary ml-1 hover:underline "
          >
            {!isSignIn ? "Sign in":"Sign up" }
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
