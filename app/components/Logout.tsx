"use client";
import React, { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        const logout = async () => {
            try {
                
                await axios.post("http://localhost:3000/patient-auth/logout", {}, {
                    withCredentials: true
                });

                
                localStorage.removeItem("token");
                localStorage.removeItem("userId");

                
                setTimeout(() => {
                    router.push('/login');
                }, 2000);  //login after 2 seconds
            } catch (error) {
                console.error("Logout failed:", error);
            }
        };

        logout();
    }, [router]);

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-logout mb-4">You are being logged out...</h1>
                <p className="text-md text-gray-600">
                    Redirecting to <Link href="/login" className="text-blue-500 hover:underline">Login Page</Link>.
                </p>
            </div>
        </div>
    );
}
