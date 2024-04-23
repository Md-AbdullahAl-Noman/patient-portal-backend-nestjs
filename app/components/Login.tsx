"use client";
import React, { useState } from "react";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation"; 

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginFormInputs>({
    mode: "onTouched",
  });

  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/patient-auth/login",
        data,
        { withCredentials: true }  
      );
      console.log("Login successful:", response.data);
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem('userId', response.data.id.toString());
      setLoginSuccess("Login successful!");
      reset();
      router.push('/profile');
    } catch (error: any) {
      console.error("Login failed:", error);
      const errorMsg = error.response?.data?.message || "Unknown error";
      setLoginError(`Failed to login: ${errorMsg}`);
      setLoginSuccess("");
    }
  };

  return (
    <>
      <div>
        <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link href="/registration"
             className="font-medium text-indigo-600 hover:text-indigo-500">
              sign up for an account
            
          </Link>
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="my-10 space-y-6 bg-white shadow-lg rounded-lg p-6 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="rounded-md shadow-sm space-y-3">
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,3}$/,
                  message: "Invalid email format",
                },
              })}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Email address"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign in
        </button>
      </form>
      {loginError && (
        <div className="w-1/3 mx-auto text-center p-3 mt-4 rounded-md bg-red-500 text-white font-medium">
          {loginError}
        </div>
      )}
      {loginSuccess && (
        <div className="w-1/3 mx-auto text-center p-4 mt-4 rounded-md bg-green-500 text-white font-semibold">
          {loginSuccess}
        </div>
      )}
    </>
  );
}
