'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import isAuthenticated from '@/app/utils/auth';

type Doctor = {
  id: number;
  name: string;
  specialization: string;
};

const SearchResults: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [isAuth, setIsAuth] = useState(false);
  const router=useRouter();
  
  useEffect(() => {

    const checkAuth = async () => {
      
      const auth = await isAuthenticated();
      setIsAuth(auth.isAuthenticated);

      if (!auth.isAuthenticated) {
      
        router.push('/login');
      }
    };

    
    const specialization = searchParams.get('specialization');

    if (isAuth && specialization && typeof specialization === 'string') {
      const fetchDoctors = async () => {
        try {
          const response = await axios.get<Doctor[]>(
            `http://localhost:3000/doctors?specialization=${encodeURIComponent(specialization)}`
          );
          setDoctors(response.data);
          setError(null);
        } catch (err: any) {
          setError(err.response?.data?.message || 'Error fetching doctors');
          setDoctors([]);
        }
      };

      fetchDoctors();
    }

    checkAuth();

  }, [searchParams,router,isAuth]);

  return (
    <div className="container mx-auto px-8 py-4 bg-white rounded-md shadow-md">
      <h1 className="text-2xl font-semibold text-black-800  text-center mb-6">Doctor Search Results</h1>
      {error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div>
          {doctors.map((doctor) => (
            <div key={doctor.id} className="mb-4 p-4 border rounded-md bg-gray-100">
              <h2 className="text-xl font-bold mb-2">Doctor Details</h2>
              <p className="mb-1"><strong>ID:</strong> {doctor.id}</p>
              <p className="mb-1"><strong>Name:</strong> {doctor.name}</p>
              <p className="mb-1"><strong>Specialization:</strong> {doctor.specialization}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
