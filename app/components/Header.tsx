"use client"
import Link from 'next/link';

import { useEffect, useState } from 'react';

import { FaHospitalUser } from "react-icons/fa6";
import { usePathname } from 'next/navigation'

const Header = () => {
 
  const pathname = usePathname();
  const [showLogin, setShowLogin] = useState(true);
  const [showSignup, setShowSignup] = useState(true);

  useEffect(() => {
  
    setShowLogin(pathname !== '/login');
    setShowSignup(pathname !== '/registration');
  }, [pathname]); 

  return (
    <nav className="bg-custombg text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex-grow flex items-center">
            <FaHospitalUser size={30} className='text-signup-bg mx-5'/>
            <Link href="/" passHref>
              <span className="text-xl font-bold cursor-pointer">Patient Portal</span>
            </Link>
            <div className="hidden md:flex items-center space-x-10 ml-10">
              <Link href="/profile"><span className="hover:bg-custom-dark-green px-3 py-2 rounded-md text-sm font-medium cursor-pointer">My Profile</span></Link>
              <Link href="/appointments"><span className="hover:bg-custom-dark-green px-3 py-2 rounded-md text-sm font-medium cursor-pointer">Appointments</span></Link>
              <Link href="/emergency"><span className="hover:bg-custom-dark-green px-3 py-2 rounded-md text-sm font-medium cursor-pointer">Emergency</span></Link>
              <Link href="/feedback"><span className="hover:bg-custom-dark-green px-3 py-2 rounded-md text-sm font-medium cursor-pointer">Feedback</span></Link>
            </div>
          </div>
          <div className='mx-2'>
          {showLogin && (
            <div className="hidden md:flex items-center space-x-10">
              <Link href="/login"><span className="bg-signup-bg text-custom-green hover:bg-custom-dark-green hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer">Login</span></Link>
            </div>
          )}</div>
          <div>{showSignup && (
            <div className="hidden md:flex items-center space-x-10">
              <Link href="/registration"><span className="bg-signup-bg text-custom-green hover:bg-custom-dark-green hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer">Sign Up</span></Link>
            </div>
          )}</div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
