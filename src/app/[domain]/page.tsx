import { getDomainDetails } from "@/actions/funnel";
import { notFound } from "next/navigation";
import PageContent from "./_components/pgae-content";
import { EditorElement } from "@/stores/editor-store/editor-type";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { domain: string };
}): Promise<Metadata> {
  const data = await getDomainDetails(params.domain.split(".")[0]);

  if (!data) return notFound();
  if (!data.published) return notFound();

  const page = data.FunnelPages.find((e) => !e.pathName);

  return {
    title: `${data?.name || "Plura"} ${page?.name ? `| ${page?.name}` : ""}`,
    icons: {
      icon: {
        url: data?.favicon || "/favicon.ico",
      },
    },
  };
}

export default async function Page({ params }: { params: { domain: string } }) {
  const data = await getDomainDetails(params.domain.split(".")[0]);

  if (!data || !data.published) return notFound();

  const page = data.FunnelPages.find((e) => !e.pathName);

  if (page && page.published) {
    return (
      <PageContent
        funnelPageId={page.id}
        elements={
          page.content
            ? (JSON.parse(page?.content as string) as EditorElement[])
            : [
                {
                  type: "__body",
                  content: [],
                  id: "__body",
                  name: "Body",
                  styles: {},
                  classnames: "",
                },
              ]
        }
      />
    );
  } else return notFound();
}
