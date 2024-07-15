"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { initFirebase } from "@/firebase";
import {
  User,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

const HOME_ROUTE = "/";

const AuthRouter = (props: any) => {
  const app = initFirebase();
  const auth = getAuth(app);
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const pathName = usePathname();

  

  useEffect(() => {
    const redirect = (
    isLoading: boolean,
    firebaseUser: User | null | undefined
  ) => {
    if (!isLoading) {
      if (firebaseUser) {
        router.refresh()
      } else {
        router.push(HOME_ROUTE);
      }
    }
  };
    redirect(loading, user);
  }, [loading, user, pathName]);

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  // Handle email sign-in
  const handleEmailSignIn = async (email: string) => {
    try {
      const actionCodeSettings = {
        url: window.location.origin,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
    } catch (error) {
      console.error("Error sending sign-in email link:", error);
    }
  };

  // Check if the current URL contains a sign-in email link
  useEffect(() => {
    const handleSignInWithEmailLink = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        const email = window.localStorage.getItem("emailForSignIn");
        if (!email) {
          console.error("Email not found in localStorage");
          return;
        }

        try {
          await signInWithEmailLink(auth, email, window.location.href);
          window.localStorage.removeItem("emailForSignIn");
        } catch (error) {
          console.error("Error signing in with email link:", error);
        }
      }
    };

    handleSignInWithEmailLink();
  }, [auth, pathName]);

  if (loading) {
    return null;
  } else {
    return <>{props.children}</>;
  }
};

export default AuthRouter;