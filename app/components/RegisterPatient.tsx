"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";

type FormData = {
  username: string;
  password: string;
  email: string;
  profilePicture: FileList;
};

export default function RegisterPatient() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    mode: "onTouched",
  });

  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState("");

  const [registrationFailed, setRegistrationFailed] = useState(false);
  const [registrationFailedMessage, setRegistrationFailedMessage] =
    useState("");

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);
    formData.append("email", data.email);
    if (data.profilePicture.length > 0) {
      formData.append("profilePicture", data.profilePicture[0]);
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/patients/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Check only for the specific email error message
      if (response.data.message === "Email address already exists") {
        console.error("Registration failed:", response.data.message);
        setRegistrationFailed(true);
        setRegistrationFailedMessage("Email address already exists");
      } else {
        console.log("Registration successful:", response.data);
        setRegistrationSuccess(true);
        setRegistrationMessage("Registration successful!");
        reset(); // Reset form fields after successful submission
      }
    } catch (error: any) {
      console.error("Registration failed:", error.message);
      setRegistrationSuccess(false);
      setRegistrationMessage(
        "Registration failed: " +
          (error.response?.data.message || "Unknown error")
      );
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="my-10 space-y-6 bg-reg-bg shadow-lg rounded-lg p-6 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username:
          </label>
          <input
            id="username"
            type="text"
            {...register("username", { required: "Username is required" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">
              {errors.username.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password:
          </label>
          <input
            id="password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email:
          </label>
          <input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,3}$/,
                message: "Invalid email format",
              },
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="profilePicture"
            className="block text-sm font-medium text-gray-700"
          >
            Profile Picture:
          </label>
          <input
            id="profilePicture"
            type="file"
            {...register("profilePicture", {
              required: "Profile picture is required",
            })}
            className="mt-1 block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {errors.profilePicture && (
            <p className="mt-1 text-sm text-red-600">
              {errors.profilePicture.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Register
        </button>

        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?
          <a
            href="/login"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Login
          </a>
        </p>
      </form>

      {registrationSuccess && (
        <div className=" w-1/3 mx-auto text-center p-4 mt-4 rounded-md bg-green-500 text-white font-semibold">
          {registrationMessage}
        </div>
      )}
      {registrationFailed && (
        <div className="w-1/3 mx-auto text-center p-4 mt-4 rounded-md bg-red-500 text-white font-semibold">
          {registrationFailedMessage}
        </div>
      )}
    </div>
  );
}
