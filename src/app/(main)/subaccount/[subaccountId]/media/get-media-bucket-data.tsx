import { getSubaccountAndMedia } from "@/actions/global-use-case";
import MediaBucketItems from "@/components/media/media-bucket-items";

export default async function GetMediaBucketData({
  subaccountId,
}: {
  subaccountId: string;
}) {
  const getSubaccoutMedia = await getSubaccountAndMedia(subaccountId);
  return <MediaBucketItems data={getSubaccoutMedia} />;
}
