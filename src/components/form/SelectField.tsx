"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormBase, { FormControlProps } from "./FormBase";
import { useFieldContext } from "./hooks";

export type SelectOption = {
  label: string;
  value: string;
};

type SelectFieldProps = Omit<FormControlProps, "type"> & {
  options: SelectOption[];
  placeholder?: string;
};

const SelectField = ({ options, placeholder, ...props }: SelectFieldProps) => {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase {...props}>
      <Select
        value={field.state.value}
        onValueChange={(value) => {
          field.handleChange(value);
          field.handleBlur();
        }}
      >
        <SelectTrigger
          id={field.name}
          aria-invalid={isInvalid}
          className="w-full"
        >
          <SelectValue placeholder={placeholder ?? `Select ${props.label}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormBase>
  );
};

export default SelectField;
