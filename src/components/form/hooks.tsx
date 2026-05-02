import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import DateTimeField from "./DateTimeField";
import { FormCheckbox } from "./FormCheckbox";
import InputWithIcon from "./InputWithIcon";
import NumberInputField from "./NumberInputField";
import PasswordInput from "./PasswordInput";
import SelectField from "./SelectField";
import TextAreaField from "./TextAreaField";

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: {
    InputWithIcon,
    PasswordInput,
    Checkbox: FormCheckbox,
    SelectField,
    TextAreaField,
    NumberInputField,
    DateTimeField,
  },
  formComponents: {},
  fieldContext,
  formContext,
});
export { useAppForm, useFieldContext, useFormContext };
