"use client";

import { EyeIcon, EyeOffIcon, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Field, FieldError, FieldLabel } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";
import { useFieldContext } from "./hooks";

type PasswordInputProps = {
  label?: string;
  placeholder?: string;
  showForgotPassword?: boolean;
};

const PasswordInput = ({
  label = "Password",
  placeholder = "Enter your password",
  showForgotPassword = true,
}: PasswordInputProps) => {
  const [inputType, setInputType] = useState("password");
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const toggleInputType = () => {
    setInputType((prevType) => (prevType === "password" ? "text" : "password"));
  };
  return (
    <Field>
      <div className="flex items-center justify-between">
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        {showForgotPassword && (
          <Link
            href="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            Forgot password?
          </Link>
        )}
      </div>
      <InputGroup>
        <InputGroupInput
          id={field.name}
          type={inputType}
          name={field.name}
          onBlur={field.handleBlur}
          value={field.state.value}
          placeholder={placeholder}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={isInvalid}
          className="h-full"
        />
        <InputGroupAddon>
          <Lock />
        </InputGroupAddon>
        <InputGroupButton className="h-full" onClick={toggleInputType}>
          {inputType === "password" ? (
            <EyeIcon className="size-5" />
          ) : (
            <EyeOffIcon className="size-5" />
          )}
        </InputGroupButton>
      </InputGroup>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};

export default PasswordInput;
