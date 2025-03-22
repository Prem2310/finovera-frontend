import React, { useState } from "react";
import FormInput from "../components/FormInput";
import { useSignupUser } from "../hooks/mutations/useUserboarding";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const { mutate: signupMutate, isLoading } = useSignupUser({ navigate });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name)
      newErrors.first_name = { message: "First name is required" };
    if (!formData.last_name)
      newErrors.last_name = { message: "Last name is required" };
    if (!formData.username)
      newErrors.username = { message: "Username is required" };

    if (!formData.email) {
      newErrors.email = { message: "Email is required" };
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = { message: "Email is invalid" };
    }

    if (!formData.password) {
      newErrors.password = { message: "Password is required" };
    } else if (formData.password.length < 6) {
      newErrors.password = {
        message: "Password must be at least 6 characters",
      };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Submit the form data to your API
      console.log("Signup form submitted:", formData);
      signupMutate(formData);
      // Reset form after successful submission
      setFormData({
        first_name: "",
        last_name: "",
        username: "",
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
        <div className="bg-gray-50 py-4 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-slate-800">
            Create an Account
          </h1>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row gap-4">
              <FormInput
                name="first_name"
                label="First Name"
                register={register}
                errors={errors}
                placeholder="John"
              />

              <FormInput
                name="last_name"
                label="Last Name"
                register={register}
                errors={errors}
                placeholder="Doe"
              />
            </div>

            <FormInput
              name="username"
              label="Username"
              register={register}
              errors={errors}
              placeholder="johndoe"
            />

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

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 mt-4"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Already have an account?
              <a
                href="/signin"
                className="ml-1 text-slate-600 hover:text-slate-800 font-medium"
              >
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
