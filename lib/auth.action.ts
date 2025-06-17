'use server'

import { cookies } from "next/headers";
import { db,auth } from "../firebase/admin";
import { _success } from "zod/v4/core";


const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams ) {
  const { uid, name, email, idToken } = params;
  try {
    const decoded = await auth.verifyIdToken(idToken);
   
    if (decoded.uid !== uid) {
      return {
        success: false,
        message: "UID mismatch in token verification.",
      };
    }
    const userRecord = await db.collection("users").doc(uid).get();

    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exists. Please try signing in instead.",
      };
    }

      await db.collection("users").doc(uid).set({
        name,
        email,
        createdAt: new Date().toISOString(),
      });
      await setSessionCookie(idToken);
    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: any) {
    console.error("Error during sign up:", error);
    if (error.code === "auth/email-already-in-use") {
      return {
        success: false,
        message: "Email already in use. Please try signing in instead.",
      };
    }
    return {
      success: false,
      message: "An error occurred during sign up. Please try again later.",
    };
  }
}


export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies()
    
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: ONE_WEEK * 1000,
    });

    cookieStore.set("session", sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
     });
}
export async function signIn(params: SignInParams) {
    const { email, idToken } = params;
    
    try {
        const userRecord = await await auth.getUserByEmail(email);
        
        if(!userRecord) {
            return {
                success: false,
                message: "User not found. Please sign up first.",
            }
        }

        await setSessionCookie(idToken);
        return {
            success: true,
            message: "Sign in successful!",
            user: {
                uid: userRecord.uid,
                email: userRecord.email,
                displayName: userRecord.displayName,
            }
        }
    } catch (error) {
        console.error("Error during sign in:", error);
        return {
            success:false,
            message:"An error occurred during sign in. Please try again later.",
        }
    }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
    const userRecord = await db.collection("users").doc(decodedToken.uid).get();

    if (!userRecord.exists) {
      return null;
    }

    return {
        ...userRecord.data(),
        id: decodedToken.id,
    } as User
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user ;
}
export const signInWithProvider = async ({
  idToken,
  email,
}: {
  idToken: string;
  email: string;
}) => {
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
      const userRecord = await db.collection("users").doc(decodedToken.uid);
      const userSnap = await userRecord.get();

      if(!userSnap.exists) {
        await userRecord.set({
          name: decodedToken.name || "Unknown User",
          email: decodedToken.email || email,
          provider: decodedToken.firebase?.sign_in_provider || "unknown",
          createdAt: new Date().toISOString(),
        });
      }

      return {
        success: true,
        message: "Provider sign-in successful!",
        user: {
          uid: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name,
        },
      };
  
  } catch (err: any) {
    console.error("signInWithProvider error", err);
    return { success: false, message: err.message };
  }
};