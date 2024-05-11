'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import isAuthenticated from '../utils/auth';



const EmergencyEmailPage = () => {
  const [email, setEmail] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await isAuthenticated();
      if (!auth.isAuthenticated) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);
  

  const handleSendEmail = async () => {
    const token = localStorage.getItem('token');


    

    if (!email.trim() || !text.trim()) {
      setError('Please provide both email and text.');
      return;
    }

    try {
      await axios.post(
        `http://localhost:3000/patients/send-emergency-email`,
        { email, text },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setEmail('');
      setText('');
      setError('');
      setSuccess('Emergency email sent successfully.');
    } catch (err: any) {
      console.error('Error sending email:', err);
      setError('Failed to send email');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Send Emergency Email</h1>
      <div className="mb-4 bg-white p-6 rounded-md shadow-md">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter recipient's email"
          className="border p-2 rounded-md w-full mb-4"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your message"
          className="border p-2 rounded-md w-full mb-4"
          rows={4}
        />
        <button
          onClick={handleSendEmail}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Send Email
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">{success}</p>}
      </div>
    </div>
  );
};

export default EmergencyEmailPage;
