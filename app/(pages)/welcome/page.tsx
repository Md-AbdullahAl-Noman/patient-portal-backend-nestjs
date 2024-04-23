// pages/welcome.js
'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import isAuthenticated from '@/app/utils/auth';

export default function WelcomePage() {
    const router = useRouter();
    const [userId, setUserId] = useState(null);
  
    useEffect(() => {
      const authCheck = async () => {
        const authInfo = await isAuthenticated();
        if (!authInfo.isAuthenticated) {
          router.push('/login');
        } else {
          setUserId(authInfo.userId);
        }
      };
  
      authCheck();
    }, [router]);
  
    return (
      <div>
        {userId ? (
          <div>
            <p>Welcome! You are authenticated.</p>
            <p>Your user ID is: {userId}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  }