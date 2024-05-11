'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import isAuthenticated from '../utils/auth';

const FeedbackPage = () => {
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [rating, setRating] = useState(1);
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

  const handleFeedbackSubmit = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      setError('You are not logged in or your session has expired. Please log in again.');
      router.push('/login');
      return;
    }

    if (!feedbackMessage.trim() || rating < 1 || rating > 5) {
      setError('Please provide valid feedback and a rating between 1 and 5.');
      return;
    }

    try {
      await axios.post(
        `http://localhost:3000/patients/feedback/${userId}`,
        { feedback_message: feedbackMessage, rating },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setFeedbackMessage('');
      setRating(1);
      setError('');
      setSuccess('Feedback submitted successfully.');
    } catch (err: any) {
      console.error('Error submitting feedback:', err);
      setError('Failed to submit feedback');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Submit Feedback</h1>
      <div className="mb-4 bg-white p-6 rounded-md shadow-md">
        <textarea
          value={feedbackMessage}
          onChange={(e) => setFeedbackMessage(e.target.value)}
          placeholder="Enter your feedback"
          className="border p-2 rounded-md w-full mb-4"
          rows={4}
        />
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Rating:</label>
          <select
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
            className="border p-2 rounded-md w-full"
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleFeedbackSubmit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit Feedback
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">{success}</p>}
      </div>
    </div>
  );
};

export default FeedbackPage;
