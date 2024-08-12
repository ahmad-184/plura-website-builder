import { protectAgencyRoute } from "@/actions/auth";
import PageWrapper from "@/components/page-wrapper";
import { auth } from "@clerk/nextjs/server";

export default async function Page() {
  await protectAgencyRoute();

  return (
    <PageWrapper>
      <></>
    </PageWrapper>
  );
}
