import React, { useState } from "react";
import FormInput from "../components/FormInput";
import { useNavigate } from "react-router-dom";
import { useLoginUser } from "../hooks/mutations/useUserboarding";

const Signin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const { mutate: loginMutate, isLoading } = useLoginUser({ navigate });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = { message: "Email is required" };
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = { message: "Email is invalid" };
    }

    if (!formData.password) {
      newErrors.password = { message: "Password is required" };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Submit the form data to your API
      loginMutate(formData);
      console.log("Signin form submitted:", formData);
      // Reset form after successful submission
      setFormData({
        email: "",
        password: "",
      });
    }
  };

  // Mock register function to match the FormInput component
  const register = (name) => ({
    name,
    onChange: handleChange,
    value: formData[name],
  });

  return (
    <div className="absolute inset-0 -z-10 flex h-full w-full items-center justify-center bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="w-full max-w-md bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-slate-50 py-4 px-6 border-b">
          <h1 className="text-xl font-bold text-slate-800">Welcome Back</h1>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <FormInput
              name="email"
              label="Email Address"
              type="email"
              register={register}
              errors={errors}
              placeholder="john@example.com"
            />

            <FormInput
              name="password"
              label="Password"
              type="password"
              register={register}
              errors={errors}
              placeholder="••••••••"
            />

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-slate-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-slate-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="text-slate-600 hover:text-slate-800 font-medium"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-slate-900">
              Don't have an account?
              <a
                href="/signup"
                className="ml-1 text-slate-900 hover:text-slate-800 font-medium"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
