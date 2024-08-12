import PageWrapper from "@/components/page-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import GetMediaBucketData from "./get-media-bucket-data";
import UploadMediaButton from "../../_components/upload-media-button";
import { protectSubaccountRoute } from "@/actions/auth";
import AnimateFadeIn from "@/components/animate/animate-fade-in";

export const revalidate = 60;

export default async function Page({
  params,
}: {
  params: { subaccountId: string };
}) {
  await protectSubaccountRoute();

  return (
    <PageWrapper>
      <div className="flex w-full flex-col gap-5">
        <AnimateFadeIn>
          <div className="flex justify-between ap-4 items-start">
            <h1 className="text-3xl font-semibold tracking-tight">
              Media Bucket
            </h1>
            <UploadMediaButton subaccountId={params.subaccountId} />
          </div>
        </AnimateFadeIn>
        <Suspense
          fallback={
            <div className="flex w-full gap-5">
              {[...Array(3)].map((i) => (
                <Skeleton
                  key={i + i * 6}
                  className="w-[33%] rounded-lg h-[250px]"
                />
              ))}
            </div>
          }
        >
          <AnimateFadeIn>
            <GetMediaBucketData subaccountId={params.subaccountId} />
          </AnimateFadeIn>
        </Suspense>
      </div>
    </PageWrapper>
  );
}
