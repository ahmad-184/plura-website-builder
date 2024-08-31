"use client";

import CustomDialog from "@/components/custom/custom-dialog";
import FunnelDetails from "@/components/funnel-details";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/model-providers";
import { PlusIcon } from "lucide-react";

export default function CreateFunnelButton({
  subaccountId,
}: {
  subaccountId: string;
}) {
  const { setOpen, setClose } = useModal();

  return (
    <Button
      className="flex gap-2 w-full mt-4"
      onClick={() => {
        setOpen({
          modal: (
            <CustomDialog
              header="Create A Funnel"
              description="Funnels are a like websites, but better! Try creating one!"
              content={
                <>
                  <FunnelDetails
                    subaccountId={subaccountId}
                    setOpen={setClose}
                  />
                </>
              }
            />
          ),
        });
      }}
    >
      <PlusIcon size={15} />
      Create Funnel
    </Button>
  );
}
