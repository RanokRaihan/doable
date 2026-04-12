"use client";

import { cn } from "@/lib/utils";
import FormBase, { FormControlProps } from "./FormBase";
import { useFieldContext } from "./hooks";

type DateTimeFieldProps = Omit<FormControlProps, "type" | "placeholder"> & {
  min?: string;
};

const DateTimeField = ({ min, ...props }: DateTimeFieldProps) => {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase {...props}>
      <input
        id={field.name}
        name={field.name}
        type="datetime-local"
        min={min}
        value={field.state.value ?? ""}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        className={cn(
          "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex h-9 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        )}
      />
    </FormBase>
  );
};

export default DateTimeField;
