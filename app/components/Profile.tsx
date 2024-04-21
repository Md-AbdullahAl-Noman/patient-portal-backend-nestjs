"use client"
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


import Image from 'next/image';

type UserProfile = {
    id: number;
    username: string;
    email: string;
    profilePicture?: string;
    created_at?: string;
    updated_at?: string;
};

const ProfilePage = () => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');

            if (!userId || !token) {
                setError("You are not logged in or your session has expired. Please log in again.");
                router.push('/login');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:3000/patients/profile/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserProfile(response.data);
            } catch (err:any) {
                console.error('Error fetching profile:', err);
                if (err.response && err.response.status === 401) {
                    setError("Your session has expired. Please log in again.");
                    router.push('/login');
                } else {
                    setError('Failed to fetch profile');
                }
            }
        };

        fetchData();
    }, [router]);

    if (!userProfile && !error) return <div>Loading...</div>;
    if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Profile Page</h1>
            <div className="max-w-sm mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                {userProfile?.profilePicture ? (
                    <div className="relative w-full" style={{ height: '250px' }}> 
                        <Image
                            src={`http://localhost:3000/${userProfile.profilePicture}`}
                            layout="fill"
                            objectFit="contain" 
                            alt="Profile Picture"
                        />
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-56 bg-gray-200">No Image Available</div>
                )}
                <div className="p-4">
                    <p className="text-lg text-gray-700"><span className="font-bold">Username:</span> {userProfile?.username}</p>
                    <p className="text-lg text-gray-700"><span className="font-bold">Email:</span> {userProfile?.email}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
