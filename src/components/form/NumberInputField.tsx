"use client";

import { cn } from "@/lib/utils";
import FormBase, { FormControlProps } from "./FormBase";
import { useFieldContext } from "./hooks";

type NumberInputFieldProps = Omit<FormControlProps, "type"> & {
  min?: number;
  max?: number;
  step?: number | "any";
  prefix?: string;
};

const NumberInputField = ({
  min,
  max,
  step = "any",
  prefix,
  ...props
}: NumberInputFieldProps) => {
  const field = useFieldContext<number>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase {...props}>
      <div className="relative">
        {prefix && (
          <span className="text-muted-foreground absolute inset-y-0 left-3 flex items-center text-sm select-none">
            {prefix}
          </span>
        )}
        <input
          id={field.name}
          name={field.name}
          type="number"
          min={min}
          max={max}
          step={step}
          value={
            field.state.value === undefined ||
            field.state.value === null ||
            field.state.value === 0
              ? ""
              : field.state.value
          }
          placeholder={props.placeholder}
          onBlur={field.handleBlur}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === "") {
              field.handleChange(0);
            } else {
              const parsed = parseFloat(raw);
              field.handleChange(isNaN(parsed) ? 0 : parsed);
            }
          }}
          aria-invalid={isInvalid}
          className={cn(
            "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex h-9 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            prefix && "pl-7",
          )}
        />
      </div>
    </FormBase>
  );
};

export default NumberInputField;
