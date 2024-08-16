import {
  chakra,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  InputProps,
  InputRightAddon,
  Tooltip,
} from "@chakra-ui/react";
import { MdInfoOutline } from "react-icons/md";

type InputFieldProps = {
  type: "number" | "text";
  label: string;
  labelSub?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputLeftAddon?: string | JSX.Element;
  inputRightAddon?: string | JSX.Element;
  tooltip?: string;
  labelFontSize?: "sm" | "md" | "lg";
} & InputProps;

export function InputField({
  type,
  label,
  labelSub,
  value,
  onChange,
  inputLeftAddon,
  inputRightAddon,
  tooltip,
  labelFontSize = "md",
  ...props
}: InputFieldProps) {
  return (
    <FormControl>
      <FormLabel display="flex" mb={0}>
        <chakra.span fontSize={labelFontSize} mr={tooltip ? 1 : 0}>
          {label}
        </chakra.span>
        {tooltip && (
          <Tooltip
            label={tooltip}
            hasArrow
            placement="top-start"
            shadow={"dark-lg"}
          >
            <chakra.span>
              <MdInfoOutline cursor="pointer" color="dodgerblue" size="18px" />
            </chakra.span>
          </Tooltip>
        )}
      </FormLabel>
      {labelSub && (
        <FormLabel display="flex" color="gray.500" mb={0} fontSize="xs">
          {labelSub}
        </FormLabel>
      )}
      <InputGroup margin="auto">
        {inputLeftAddon && <InputLeftAddon>{inputLeftAddon}</InputLeftAddon>}
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e)}
          {...props}
        />
        {inputRightAddon && (
          <InputRightAddon>{inputRightAddon}</InputRightAddon>
        )}
      </InputGroup>
    </FormControl>
  );
}
