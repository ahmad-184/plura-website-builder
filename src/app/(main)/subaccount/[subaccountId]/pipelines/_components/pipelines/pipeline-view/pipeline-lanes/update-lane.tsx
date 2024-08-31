import LaneDetails from "@/components/lane-details";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Lane } from "@prisma/client";

export default function UpdateLane({
  lane,
  subaccountId,
}: {
  lane: Lane;
  subaccountId: string;
}) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Update lane informations</DialogTitle>
        <DialogDescription>
          Pipelines allows you to group tickets into lanes and track your
          business processes all in one place.
        </DialogDescription>
      </DialogHeader>
      <LaneDetails
        pipelineId={lane.pipelineId}
        subaccountId={subaccountId}
        lane={lane}
      />
    </DialogContent>
  );
}
