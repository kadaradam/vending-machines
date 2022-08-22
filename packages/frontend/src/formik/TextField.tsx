import {
  TextField,
  TextFieldProps as OriginalTextFieldProps,
} from "@mui/material";
import { useFormikContext } from "formik";
import _ from "lodash";

type TextFieldProps = {
  name: string;
  label?: string;
} & OriginalTextFieldProps;

export function CustomTextField({ name, label, ...props }: TextFieldProps) {
  const { values, handleChange, handleBlur, touched, errors } =
    useFormikContext();

  const hasError = !!_.get(touched, name) && !!_.get(errors, name);
  const error = _.get(errors, name);
  const inputValue = _.get(values, name);

  return (
    <TextField
      value={inputValue}
      label={hasError ? `${label} | ${error}` : label}
      error={hasError}
      onChange={handleChange(name)}
      onBlur={handleBlur(name)}
      {...props}
    />
  );
}
