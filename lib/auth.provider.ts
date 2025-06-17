import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase/client";
import { signInWithProvider } from "./auth.action";

let isSigningIn = false;

export async function signInWithGoogle() {
  if (isSigningIn) return
    isSigningIn = true;
    
  const Provider = new GoogleAuthProvider();
  
    try {
      
    const result = await signInWithPopup(auth, Provider);
    const idToken = await result.user.getIdToken();

    const response = await signInWithProvider({
      idToken,
      email: result.user.email || "",
    });

    return response;

  } catch (error: any) {
    
    if (error.code === "auth/popup-closed-by-user") {
      console.warn("User closed the login popup.", error);
      return {
        success: false,
        message: "Login popup was closed. Please try again.",
        };
        
    } else if (error.code === "auth/unauthorized-domain") {

      return {
        success: false,
        message:
          "Unauthorized domain. Make sure localhost:3000 is added to Firebase Auth > Authorized Domains.",
        };
        
    } else {

      console.error("Google Sign-In Error:", error);
      return {
        success: false,
        message: error.message || "Google login failed. Try again.",
      };
        }
        
  } finally {
    isSigningIn = false;
  }
}

export async function signInWithGithub() {

    if (isSigningIn) return;
    isSigningIn = true;
    
  const provider = new GithubAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const response = await signInWithProvider({
        idToken,
        email: result.user.email || "",
      });

      return response;
    } catch (error: any) {

    if (error.code === "auth/popup-closed-by-user") {
          
          console.warn("User closed the login popup.");
          return { success: false, message: error.message };
          
    } else {
        
        console.error("Github Sign-In Error:", error);
        return { success: false, message: error.message };

        }
        
    } finally {
      isSigningIn = false;
    }
    
}
