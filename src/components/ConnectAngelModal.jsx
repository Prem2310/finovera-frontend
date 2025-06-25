import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiXMark } from "react-icons/hi2";
import { FiUser, FiKey, FiCode, FiShield } from "react-icons/fi";

// Modified version of FormInput for direct control (without the register prop)
const FormInputControlled = ({
  name,
  label,
  className = "",
  type = "text",
  errors = {},
  value,
  onChange,
  placeholder = "",
  prefix,
  rows = 4,
  ...props
}) => {
  const baseInputStyles =
    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500";
  const errorInputStyles = "border-red-500 focus:ring-red-500";
  const errorMessageStyles =
    "mt-1 text-sm text-red-600 bg-red-50 p-1 rounded-md";
  const labelStyles = "block mb-1 font-medium text-gray-700";

  const inputProps = {
    id: name,
    name,
    value,
    onChange,
    className: `${baseInputStyles} ${
      errors[name] ? errorInputStyles : ""
    } ${className}`,
    placeholder,
    ...props,
  };

  const renderInput = () => {
    switch (type) {
      case "textarea":
        return <textarea {...inputProps} rows={rows} />;
      case "select":
        return (
          <select {...inputProps}>
            {props.options?.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case "file":
        return <input type="file" {...inputProps} value={undefined} />;
      default:
        return (
          <div className="relative">
            {prefix && (
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                {prefix}
              </div>
            )}
            <input
              type={type}
              {...inputProps}
              className={`${inputProps.className} ${prefix ? "pl-10" : ""}`}
            />
          </div>
        );
    }
  };

  return (
    <div className="mb-4 w-full">
      {label && (
        <label htmlFor={name} className={labelStyles}>
          {label}
        </label>
      )}
      {renderInput()}
      {errors && errors[name] && (
        <div className={errorMessageStyles}>{errors[name]?.message}</div>
      )}
    </div>
  );
};

const ConnectAngelModal = ({ isOpen, onClose, onConnect }) => {
  const [formData, setFormData] = useState({
    client_id: "PWQX1073",
    mpin: "5110",
    api_key: "HlfzK6Q4",
    totp_secret: "ASEXNEB6KDHOJTY4Q5PJ3BKCHE",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const modalRef = useRef();

  const steps = [
    {
      field: "client_id",
      label: "Client ID",
      icon: <FiUser className="text-green-500" />,
    },
    { field: "mpin", label: "MPIN", icon: <FiKey className="text-green-500" /> },
    {
      field: "api_key",
      label: "API Key",
      icon: <FiCode className="text-green-500" />,
    },
    {
      field: "totp_secret",
      label: "TOTP Secret",
      icon: <FiShield className="text-green-500" />,
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = (field, value) => {
    if (!value.trim()) {
      return `${steps.find((step) => step.field === field).label} is required`;
    }
    return null;
  };

  const handleNext = () => {
    const currentField = steps[currentStep].field;
    const error = validate(currentField, formData[currentField]);

    if (error) {
      setErrors((prev) => ({ ...prev, [currentField]: { message: error } }));
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Validate all fields
    const newErrors = {};
    let hasError = false;

    Object.keys(formData).forEach((field) => {
      const error = validate(field, formData[field]);
      if (error) {
        newErrors[field] = { message: error };
        hasError = true;
      }
    });

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    // Submit the form
    setIsLoading(true);
    try {
      // This is where you would make your API call
      // For demo purposes, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      onConnect(formData);
      onClose();
    } catch (error) {
      console.error("Connection failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    const { field, label, icon } = steps[currentStep];
    const type =
      field === "mpin" || field === "totp_secret" ? "password" : "text";

    return (
      <motion.div
        key={field}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <FormInputControlled
          name={field}
          label={label}
          type={type}
          placeholder={`Enter your ${label}`}
          value={formData[field]}
          onChange={handleChange}
          errors={errors}
          className="bg-gray-50"
          prefix={icon}
        />
      </motion.div>
    );
  };

  // Track progress
  const progress = ((currentStep + 1) / steps.length) * 100;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="relative mx-auto w-full max-w-md rounded-xl bg-white shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Progress bar */}
            <div className="h-1 bg-gray-100 w-full">
              <motion.div
                className="h-full bg-green-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Connect to AngelOne
              </h3>
              <motion.button
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <HiXMark size={24} />
              </motion.button>
            </div>

            {/* Body */}
            <div className="px-6 py-4">
              <div className="mb-6 text-center">
                <p className="text-sm text-gray-500">
                  Step {currentStep + 1} of {steps.length}: Enter your{" "}
                  {steps[currentStep].label}
                </p>
              </div>

              <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
            </div>

            {/* Footer with clearly visible buttons */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  currentStep === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Back
              </button>

              <button
                onClick={handleNext}
                disabled={isLoading}
                className="px-4 py-2 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2 animate-spin" />
                    Connecting...
                  </div>
                ) : currentStep === steps.length - 1 ? (
                  "Connect"
                ) : (
                  "Next"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConnectAngelModal;
