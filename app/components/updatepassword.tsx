
"use client"
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation"; 

type FormData = {
    currentPassword: string;
    newPassword: string;
};

const UpdatePassword: React.FC = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        mode: "onTouched",
    });
    const router=useRouter();
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
    const [updateMessage, setUpdateMessage] = useState<string>("");
    const [updateFailed, setUpdateFailed] = useState<boolean>(false);
    const [updateFailedMessage, setUpdateFailedMessage] = useState<string>("");
    


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
        const checkAuth = () => {
            const token = localStorage.getItem("token"); 
            if (!token) {
                router.push('/login'); 
            }
        };

        checkAuth();
        fetchPatientData();
      }, [reset]);

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            const patientId = localStorage.getItem("userId");
            const response = await axios.patch(`http://localhost:3000/patients/update-password/${patientId}`, data, { withCredentials: true });

            if (response.data.message) {
                setUpdateSuccess(true);
                setUpdateMessage(response.data.message);
                reset();
                router.push('/profile'); // Redirect or handle next steps
            }
        } catch (error: any) {
            console.error("Update failed:", error.response?.data?.message || "Unknown error");
            setUpdateFailed(true);
            setUpdateFailedMessage(error.response?.data?.message || "An error occurred");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="my-10 space-y-6 bg-reg-bg shadow-lg rounded-lg p-6 sm:mx-auto sm:w-full sm:max-w-md">
                <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                        Current Password:
                    </label>
                    <input
                        id="currentPassword"
                        type="password"
                        {...register("currentPassword", { required: "Current password is required" })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                    />
                    {errors.currentPassword && <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>}
                </div>

                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        New Password:
                    </label>
                    <input
                        id="newPassword"
                        type="password"
                        {...register("newPassword", {
                            required: "New password is required",
                            minLength: { value: 6, message: "Password must be at least 6 characters" }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                    />
                    {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>}
                </div>

                <button type="submit" className="w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Change Password
                </button>
            </form>

            {updateSuccess && <div className="w-1/3 mx-auto text-center p-4 mt-4 rounded-md bg-green-500 text-white font-semibold">{updateMessage}</div>}
            {updateFailed && <div className="w-1/3 mx-auto text-center p-4 mt-4 rounded-md bg-red-500 text-white font-semibold">{updateFailedMessage}</div>}
        </div>
    );
};

export default UpdatePassword;
