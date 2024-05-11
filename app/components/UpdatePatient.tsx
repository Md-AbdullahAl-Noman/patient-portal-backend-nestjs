"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation"; 

type FormData = {
  username: string;
  email: string;
  
  
};
// axios.defaults.withCredentials = true;

const UpdatePatient: React.FC = () => {
  const [generalError, setGeneralError] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const router = useRouter();

  const fetchPatientData = async () => {
    try {
      const patientId = localStorage.getItem("userId");
      const response = await axios.get(`http://localhost:3000/patients/${patientId}`);
      reset(response.data);
    } catch (error) {
      setGeneralError("Failed to fetch patient data");
      router.push("/login");
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, [reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const patientId = localStorage.getItem("userId");
      await axios.patch(`http://localhost:3000/patients/update/${patientId}`, data, { withCredentials: true }  );
      router.push("/profile");
    } catch (error) {
      setGeneralError("Failed to update patient data");
    }
  };

  return (
    <>
    <div className="max-w-md mx-auto bg-white p-6 shadow-md rounded-lg">
      {generalError && <p className="text-red-500 text-center">{generalError}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username:
          </label>
          <input
            id="username"
            type="text"
            {...register("username", { required: "Username is required" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          />
          {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
        </div>
       

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email:
          </label>
          <input
            id="email"
            type="email"
            {...register("email", { required: "Email is required" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Update Patient
        </button>
      </form>
    </div>
    </>
  );
};

export default UpdatePatient;
