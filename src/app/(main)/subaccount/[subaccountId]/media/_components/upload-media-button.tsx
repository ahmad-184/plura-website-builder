import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UploadMediaForm from "@/components/upload-media-form";

export default function UploadMediaButton({
  subaccountId,
}: {
  subaccountId: string;
}) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="w-[200px]">Upload New Media</Button>
      </DialogTrigger>
      <DialogContent className="overflow-auto max-h-[95vh]">
        <DialogHeader>
          <DialogTitle>Upload Media</DialogTitle>
          <DialogDescription>
            Upload a file to your media bucket
          </DialogDescription>
        </DialogHeader>
        <UploadMediaForm subaccountId={subaccountId} />
      </DialogContent>
    </Dialog>
  );
}
