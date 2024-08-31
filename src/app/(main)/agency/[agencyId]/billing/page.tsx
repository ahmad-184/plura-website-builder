import { protectAgencyRoute } from "@/actions/auth";
import PageWrapper from "@/components/page-wrapper";
import { ConstructionIcon } from "lucide-react";

export default async function Page() {
  await protectAgencyRoute();

  return (
    <PageWrapper>
      <div className="absolute inset-0 w-full h-full flex justify-center items-center">
        <div className="flex gap-2 items-center">
          <span>
            <ConstructionIcon className="w-9 h-9 text-primary lg:w-14 lg:h-14" />
          </span>
          <h1 className="text-4xl font-bold dark:text-gray-200 lg:text-6xl">
            Under Construction
          </h1>
          <div>
            <ConstructionIcon className="w-9 h-9 text-primary lg:w-14 lg:h-14" />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
