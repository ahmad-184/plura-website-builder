import ContactDetails from "@/components/contact-details";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const CreateContactButton = ({ subaccountId }: { subaccountId: string }) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>Create New Contact</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create A Contact</DialogTitle>
          <DialogDescription>Contacts are like customers.</DialogDescription>
        </DialogHeader>
        <ContactDetails subaccountId={subaccountId} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateContactButton;
