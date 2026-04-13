"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormBase, { FormControlProps } from "./FormBase";
import { useFieldContext } from "./hooks";

type DateTimeFieldProps = Omit<FormControlProps, "type" | "placeholder"> & {
  minDate?: Date;
  showTimeSelect?: boolean;
};

// Custom input styled to match the rest of the form fields
const CustomInput = forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & { isInvalid?: boolean }
>(({ isInvalid, className, ...props }, ref) => (
  <input
    ref={ref}
    aria-invalid={isInvalid}
    className={cn(
      "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex h-9 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      className,
    )}
    {...props}
  />
));
CustomInput.displayName = "CustomDateInput";

const DateTimeField = ({
  minDate,
  showTimeSelect = true,
  ...props
}: DateTimeFieldProps) => {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const dateValue = field.state.value ? new Date(field.state.value) : null;

  return (
    <FormBase {...props}>
      <DatePicker
        selected={dateValue}
        onChange={(date: Date | null) => {
          field.handleChange(date ? date.toISOString() : "");
          field.handleBlur();
        }}
        showTimeSelect={showTimeSelect}
        timeIntervals={15}
        dateFormat={showTimeSelect ? "MMM d, yyyy h:mm aa" : "MMM d, yyyy"}
        minDate={minDate ?? new Date()}
        customInput={<CustomInput isInvalid={isInvalid} />}
        wrapperClassName="w-full"
        popperClassName="z-50"
        showPopperArrow={false}
        placeholderText={showTimeSelect ? "Select date & time" : "Select date"}
      />
    </FormBase>
  );
};

export default DateTimeField;
