import { useState } from "react";
import { Eye, EyeClosed } from "@phosphor-icons/react";

const PasswordInput = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    label,
    isWhite,
    name,
    id,
    placeholder,
    value,
    onChange = () => {},
    onBlur = () => {},
    onFocus = () => {},
    hasError = false,
    errorMessage = "error",
    // Persistent requirement note rendered *below* the field (in the same red
    // as the error) rather than as in-field placeholder text. When the field is
    // in an error state the error wins, so there's only ever one line of red.
    hint,
  } = props;

  const handlePassword = () => {
    setShowPassword((cur) => !cur);
  };

  return (
    <div className={`flex gap-y-1 flex-col  w-full`}>
      <label htmlFor={id} className="text- capitalize">
        {label}
      </label>
      <div
        className={`flex ${
          isWhite ? "bg-white" : "bg-transparent"
        } items-center border ${
          hasError ? "border-red-500" : "border-primary"
        } px-2 py-3 rounded-md`}
      >
        <input
          className="bg-transparent  w-full focus:outline-none"
          id={id}
          type={`${showPassword ? "text" : "password"}`}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
        />
        <span className="cursor-pointer" onClick={() => handlePassword()}>
          {!showPassword && (
            <Eye width={"1rem"} height={"1rem"} color={"#333"} />
          )}
          {showPassword && (
            <EyeClosed width={"1rem"} height={"1rem"} color={"#333"} />
          )}
        </span>
      </div>
      {hasError ? (
        <p className="text-sm text-red-500">{errorMessage}</p>
      ) : (
        hint && <p className="text-sm text-red-500">{hint}</p>
      )}
    </div>
  );
};

export default PasswordInput;
