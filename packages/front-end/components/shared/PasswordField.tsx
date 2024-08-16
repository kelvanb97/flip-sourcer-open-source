import {
  FormControl,
  FormControlProps,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
  useMergeRefs,
} from "@chakra-ui/react";
import { Dispatch, forwardRef, SetStateAction, useRef } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";

type PasswordFieldProps = {
  showLabel?: boolean;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
} & FormControlProps;

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ showLabel = true, password, setPassword, ...props }, ref) => {
    const { isOpen, onToggle } = useDisclosure();
    const inputRef = useRef<HTMLInputElement>(null);

    const mergeRef = useMergeRefs(inputRef, ref);
    const onClickReveal = () => {
      onToggle();
      if (inputRef.current) {
        inputRef.current.focus({ preventScroll: true });
      }
    };

    return (
      <FormControl {...props}>
        {showLabel && <FormLabel htmlFor="password">Password</FormLabel>}
        <InputGroup>
          <InputRightElement>
            <IconButton
              variant="link"
              aria-label={isOpen ? "Mask password" : "Reveal password"}
              icon={isOpen ? <HiEyeOff /> : <HiEye />}
              onClick={onClickReveal}
            />
          </InputRightElement>
          <Input
            id="password"
            ref={mergeRef}
            name="password"
            type={isOpen ? "text" : "password"}
            autoComplete="current-password"
            borderColor={"gray.300"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </InputGroup>
      </FormControl>
    );
  }
);

PasswordField.displayName = "PasswordField";
