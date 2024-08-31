import { FormField, FormItem, FormLabel } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const SelectRole = ({
  control,
  name,
  disabled,
  include_agency_owner,
}: {
  control: any;
  name: string;
  disabled?: boolean;
  include_agency_owner?: boolean;
}) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>User Role</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select user role" />
            </SelectTrigger>
            <SelectContent className="z-[400]">
              {include_agency_owner && (
                <SelectItem value="AGENCY_OWNER">Agency Owner</SelectItem>
              )}
              <SelectItem value="AGENCY_ADMIN">Agency Admin</SelectItem>
              <SelectItem value="SUBACCOUNT_ADMIN">Subaccount Admin</SelectItem>
              <SelectItem value="SUBACCOUNT_USER">Subaccount User</SelectItem>
              <SelectItem value="SUBACCOUNT_GUEST">Subaccount Guest</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};

export default SelectRole;
