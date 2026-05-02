"use client";

import { Textarea } from "@/components/ui/textarea";
import FormBase, { FormControlProps } from "./FormBase";
import { useFieldContext } from "./hooks";

type TextAreaFieldProps = Omit<FormControlProps, "type"> & {
  rows?: number;
};

const TextAreaField = ({ rows = 4, ...props }: TextAreaFieldProps) => {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase {...props}>
      <Textarea
        id={field.name}
        name={field.name}
        rows={rows}
        value={field.state.value}
        placeholder={props.placeholder}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        className="resize-none"
      />
    </FormBase>
  );
};

export default TextAreaField;
