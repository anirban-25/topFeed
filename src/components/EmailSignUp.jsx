import { useState } from "react";
import { initFirebase } from "@/firebase";
import {
  GoogleAuthProvider,
  getAuth,
  sendSignInLinkToEmail,
  signInWithPopup,
} from "firebase/auth";
import { XIcon } from "@heroicons/react/solid";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
const EmailSignUp = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const provider = new GoogleAuthProvider();
  const app = initFirebase();
  const auth = getAuth(app);
  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user) {
        router.push("/");
        onClose();
        router.refresh();
      }
    } catch (error) {
      if (error.code === "auth/cancelled-popup-request") {
      } else {
        // Handle other errors
        console.error("Error signing in with Google:", error);
      }
    }
  };
  const handleSendSignInLink = async () => {
    try {
      await sendSignInLinkToEmail(auth, email, {
        url: window.location.href,
        handleCodeInApp: true,
      });
      setIsEmailSent(true);
      setError("");
      window.localStorage.setItem("emailForSignIn", email);
    } catch (error) {
      setError("Error sending sign-in link. Please try again.");
      console.error("Error sending sign-in link:", error);
    }
  };
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="z-90 fixed inset-0 flex items-center pt-10 justify-center bg-[#131414] bg-opacity-75 z-50">
      <div className="bg-[#202123] border border-gray-500 shadow-2xl rounded-lg p-8 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={handleClose}
        >
          <div className="w-5 text-white">
            <XIcon />
          </div>
        </button>
        {!isEmailSent ? (
          <div className="z-50">
            <div>
              <div className="flex justify-around  items-center cursor-pointer text-base font-gilroy-medium mb-4 bg-white text-black p-3 rounded-lg" onClick={signIn}>
                <div className="scale-125">
                  <FcGoogle />
                </div>
                <div>Sign in with Google</div>
              </div>
            </div>
          <div className="items-center my-5 flex">
            <div className="w-full border border-gray-500 "/>
            <div className="text-gray-500">&nbsp;or&nbsp;</div>
            <div className="w-full border border-gray-500 "/>
          </div>
            <div className="text-xl  font-gilroy-bold mb-4 text-white">
              Sign in with Email
            </div>
            <div className="mb-4 ">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className=" outline-none bg-[#202123] border border-gray-500 rounded-xl px-3 py-2 w-full text-gray-200"
              />
            </div>
            <button
              onClick={handleSendSignInLink}
              className="bg-orange-500 hover:bg-orange-600 transition text-white font-bold py-2 px-4 rounded shadow-md"
            >
              Send Sign-In Link
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-300">
              Check Your Email
            </h2>
            <p className="text-gray-300 mb-4">
              An email with a sign-in link has been sent to {email}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailSignUp;
