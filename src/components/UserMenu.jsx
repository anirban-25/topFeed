import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "@/firebase";
import { RxAvatar } from "react-icons/rx";

const UserMenu = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const auth = getAuth(app);
  const menuRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        router.push("/login");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      <button className="flex items-center" onClick={toggleMenu}>
        <RxAvatar size={32} />
      </button>
      {menuOpen && user && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-5 mr-2 min-w-[300px] bg-white border border-gray-300 rounded-lg shadow-lg"
        >
          <div className="flex items-center p-4">
            <img
              src={user.photoURL || "default-avatar-url"}
              alt="Profile"
              className="w-12 h-12 rounded-full mr-4"
            />
            <div className="text-sm text-gray-700">
              <div className="font-medium break-words">{user.displayName || "User"}</div>
              <div className="text-xs text-gray-500 break-words">{user.email} Loremasdsdf ipsum dolor sit, amet consectetur adipisicing elit. Cum fugit voluptatum architecto consectetur expedita necessitatibus. Cupiditate incidunt id vel laboriosam!</div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-2">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
