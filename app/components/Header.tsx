'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaHospitalUser } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { usePathname } from "next/navigation";
import isAuthenticated from "../utils/auth";
import SearchBox from "./search";


const Header = () => {
  const pathname = usePathname();
  const [showLogin, setShowLogin] = useState(true);
  const [showSignup, setShowSignup] = useState(true);
  const [showLogout, setShowLogout] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const noLoginPaths = ["/login", "/profile", "/settings", "/update", "/view-appointment"];
    const noSignupPaths = ["/registration", "/profile", "/update", "/view-appointment"];
    const noLogoutVisiblePaths = ["/contact"];

    setShowLogin(!noLoginPaths.includes(pathname));
    setShowSignup(!noSignupPaths.includes(pathname));
    setShowLogout(!noLogoutVisiblePaths.includes(pathname));

    const checkAuth = async () => {
      const auth = await isAuthenticated();
      setIsAuth(auth.isAuthenticated);
    };

    checkAuth();
  }, [pathname]);

  return (
    <nav className="bg-custombg text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-5">
            <FaHospitalUser size={30} className="text-signup-bg" />
            <Link href="/" passHref>
              <span className="text-xl font-bold cursor-pointer">Medilab Hospital</span>
            </Link>
          </div>
          <div className="flex-grow">
            <div className="flex justify-center space-x-10">
              <Link href="/profile"><span className="hover:bg-custom-dark-green px-3 py-2 rounded-md text-sm font-medium cursor-pointer">My Profile</span></Link>
              <Link href="/book-appointment"><span className="hover:bg-custom-dark-green px-3 py-2 rounded-md text-sm font-medium cursor-pointer">Appointments</span></Link>
              <Link href="/emergency"><span className="hover:bg-custom-dark-green px-3 py-2 rounded-md text-sm font-medium cursor-pointer">Emergency</span></Link>
              <Link href="/feedback"><span className="hover:bg-custom-dark-green px-3 py-2 rounded-md text-sm font-medium cursor-pointer">Feedback</span></Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAuth ? (
              <>
                <Link href="/logout"><span className="bg-red-500 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer">Logout</span></Link>
                <Link href="/changepassword">
                  <div className="flex items-center space-x-2 cursor-pointer">
                    <IoSettings size={20} className="text-white hover:text-pass" />
                  </div>
                </Link>
              </>
            ) : (
              <>
                {showLogin && <Link href="/login"><span className="bg-signup-bg text-custom-green hover:bg-custom-dark-green hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer">Login</span></Link>}
                {showSignup && <Link href="/registration"><span className="bg-signup-bg text-custom-green hover:bg-custom-dark-green hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer">Sign Up</span></Link>}
              </>
            )}
            <SearchBox />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
