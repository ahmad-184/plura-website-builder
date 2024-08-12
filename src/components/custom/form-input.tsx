import { cn } from "@/lib/utils";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

export default function FormInput({
  control,
  placeholder,
  label,
  description,
  name,
  message,
  className,
  readOnly,
  disabled,
}: {
  control: any;
  placeholder?: string;
  name: string;
  description?: string;
  label?: string;
  message?: string;
  className?: string;
  readOnly?: boolean;
  disabled?: boolean;
}) {
  return (
    <FormField
      control={control}
      name={name}
      disabled={disabled}
      render={({ field }) => (
        <FormItem className={cn("", className)}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              readOnly={readOnly || false}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          {message && <FormMessage>{message}</FormMessage>}
        </FormItem>
      )}
    />
  );
}
