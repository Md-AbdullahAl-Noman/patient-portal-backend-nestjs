"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import isAuthenticated from '../utils/auth';

type Doctor = {
    id: number;
    name: string;
};

type FormData = {
    doctorId: number;
    appointmentDateTime: string;
    reason: string;
};

const BookAppointment: React.FC = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [message, setMessage] = useState('');
    const router=useRouter();
 

    useEffect(() => {

      
    const checkAuth = async () => {
      
        const auth = await isAuthenticated();
        

        if(!auth.isAuthenticated) {
            router.push('/login');  

        }
      };

      

        const fetchDoctors = async () => {
            try {
                const response = await axios.get('http://localhost:3000/doctors/all-doctors');
                setDoctors(response.data);
            } catch (error) {
                console.error('Failed to fetch doctors', error);
            }
        };
        fetchDoctors();

        checkAuth();
    }, [router]);

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            const patientId = localStorage.getItem("userId");
            const response = await axios.post(`http://localhost:3000/patients/${patientId}/appointments`, data,{withCredentials: true});
            setMessage('Appointment booked successfully!');
            setBookingSuccess(true);
        } catch (error: any) {
            router.push('/login'); 
            setMessage(error.response?.data?.message || 'Failed to book appointment');
            setBookingSuccess(false);
        }
    };

    return (
        <div className="container mx-auto px-8">
            <h1 className="text-2xl text-center text-black-800 font-semibold m-4">Book an Appointment</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg mx-auto">
                <div>
                    <label htmlFor="doctorId" className="block mb-2 text-sm font-medium text-gray-700">Select Doctor:</label>
                    <select id="doctorId" {...register('doctorId', { required: true })} className="p-2 border rounded-md w-full">
                        {doctors.map(doctor => (
                            <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="appointmentDateTime" className="block mb-2 text-sm font-medium text-gray-700">Date and Time:</label>
                    <input type="datetime-local" id="appointmentDateTime" {...register('appointmentDateTime', { required: true })} className="p-2 border rounded-md w-full"/>
                </div>
                <div>
                    <label htmlFor="reason" className="block mb-2 text-sm font-medium text-gray-700">Reason for Visit:</label>
                    <textarea id="reason" {...register('reason', { required: true })} className="p-2 border rounded-md w-full"/>
                </div>
                <div className="flex justify-between">
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex-grow mr-2">Book Appointment</button>
                <button onClick={() => router.push('/view-appointment')} type="button" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex-grow">
                    View Appointments
                </button>
            </div>
            </form>
            <div className='text-center font-semibold'>
            {message && <p className={`mt-4 ${bookingSuccess ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}</div>
        </div>
    );
};

export default BookAppointment;
