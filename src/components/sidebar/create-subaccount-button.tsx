"use client";

import { useModal } from "@/providers/model-providers";
import { Button } from "../ui/button";
import CustomDialog from "../custom/custom-dialog";
import SubAccountDetails from "../subaccount-details";
import { PlusCircleIcon } from "lucide-react";

export default function CreateSubaccountButton({
  agencyId,
}: {
  agencyId: string;
}) {
  const { setOpen } = useModal();

  return (
    <>
      <Button
        className="w-full flex gap-2"
        onClick={() => {
          setOpen({
            modal: (
              <>
                <CustomDialog
                  content={<SubAccountDetails agencyId={agencyId!} data={{}} />}
                  header="Create A Sub Account"
                  description="You can switch between your agency account and the subaccount from the sidebar"
                />
              </>
            ),
          });
        }}
      >
        <PlusCircleIcon size={15} />
        Create New Account
      </Button>
    </>
  );
}
