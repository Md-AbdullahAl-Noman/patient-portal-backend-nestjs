'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useRouter} from 'next/navigation';

type Appointment = {
  id: number;
  doctor:{
    name:string;
  }
  appointmentDateTime: string;
  reason: string;
};

const ViewAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {


    const isAuthenticated = !!localStorage.getItem('token'); 
    const patientId = localStorage.getItem('userId'); 
    if (!isAuthenticated || !patientId) {
      router.push('/login'); 
      return;
    }

    const fetchAppointments = async () => {
      try {
        const patientId = localStorage.getItem('userId'); 
        const response = await axios.get(`http://localhost:3000/patients/${patientId}/appointments`);
        setAppointments(response.data);
        setLoading(false);
      } catch (err: any) {
        setError('Failed to fetch appointments');
        setLoading(false);
        console.error(err);
      }
    };

    fetchAppointments();
  }, [router]);

  const cancelAppointment = async (appointmentId: number) => {
    try {
      await axios.delete(`http://localhost:3000/patients/cancel-appointments/${appointmentId}`);
      setAppointments(appointments.filter(appointment => appointment.id !== appointmentId));
      alert('Appointment canceled successfully');
    } catch (error: any) {
      setError('Failed to cancel appointment');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-semibold text-black-800 text-center my-6">Appointments</h1>
      {loading ? (
        <p>Loading appointments...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="space-y-4">
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <div key={appointment.id} className="p-4 bg-white shadow rounded-lg">
                <h2 className="text-xl font-bold">Appointment with Dr. {appointment.doctor.name}</h2>
                <p><strong>Date/Time:</strong> {new Date(appointment.appointmentDateTime).toLocaleString()}</p>
                <p><strong>Reason:</strong> {appointment.reason}</p>
                <button
                  onClick={() => cancelAppointment(appointment.id)}
                  className="mt-3 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                >
                  Cancel Appointment
                </button>
              </div>
            ))
          ) : (
            <p>No appointments found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewAppointments;