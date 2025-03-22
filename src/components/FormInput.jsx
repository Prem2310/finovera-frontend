const FormInput = ({
  name,
  label,
  className = "",
  type = "text",
  errors = {},
  options = [],
  register,
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

  // Check if register is a function before calling it
  const registerProps =
    register && typeof register === "function"
      ? register(name, props.validation)
      : {};

  const inputProps = {
    id: name,
    className: `${baseInputStyles} ${
      errors[name] ? errorInputStyles : ""
    } ${className}`,
    placeholder,
    ...registerProps,
    ...props,
  };

  const renderInput = () => {
    switch (type) {
      case "textarea":
        return <textarea {...inputProps} rows={rows} />;
      case "select":
        return (
          <select {...inputProps}>
            {options.map((option, index) => (
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

export default FormInput;
