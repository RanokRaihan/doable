import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import InputWithIcon from "./InputWithIcon";
import PasswordInput from "./PasswordInput";
import PasswordInputBase from "./PasswordInputBase";

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: {
    InputWithIcon: InputWithIcon,
    PasswordInput: PasswordInput,
    PasswordInputBase: PasswordInputBase,
  },
  formComponents: {},
  fieldContext,
  formContext,
});
export { useAppForm, useFieldContext, useFormContext };
