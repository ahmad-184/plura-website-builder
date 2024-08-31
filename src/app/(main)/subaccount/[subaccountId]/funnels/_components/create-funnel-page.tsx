import CustomDialog from "@/components/custom/custom-dialog";
import FunnelPageDetails from "@/components/funnel-page-details";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/model-providers";

export default function CreateFunnelPage({
  funnelId,
  subaccountId,
}: {
  funnelId: string;
  subaccountId: string;
}) {
  const { setOpen, setClose } = useModal();

  return (
    <Button
      className="mt-4 w-full"
      onClick={() => {
        setOpen({
          modal: (
            <CustomDialog
              header="Create Funnel Page"
              description="Funnel Pages allow you to create step by step processes for customers to follow"
              content={
                <FunnelPageDetails
                  funnelId={funnelId}
                  subaccountId={subaccountId}
                  setClose={setClose}
                />
              }
            />
          ),
        });
      }}
    >
      Create New Steps
    </Button>
  );
}
