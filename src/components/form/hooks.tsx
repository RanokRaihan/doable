import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { FormCheckbox } from "./FormCheckbox";
import InputWithIcon from "./InputWithIcon";
import PasswordInput from "./PasswordInput";

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: {
    InputWithIcon,
    PasswordInput,
    Checkbox: FormCheckbox,
  },
  formComponents: {},
  fieldContext,
  formContext,
});
export { useAppForm, useFieldContext, useFormContext };
