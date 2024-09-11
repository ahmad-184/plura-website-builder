import { cn } from "@/lib/utils";
import Recursive from "./elements/recursive";
import { EditorElement } from "@/stores/editor-store/editor-type";
import { db } from "@/lib/db";

export default async function PageContent({
  elements,
  funnelPageId,
}: {
  elements: EditorElement[];
  funnelPageId: string;
}) {
  await db.funnelPage.update({
    where: {
      id: funnelPageId,
    },
    data: {
      visits: {
        increment: 1,
      },
    },
  });

  return (
    <div className="h-screen bg-background w-full">
      <div
        className={cn(
          "dark:bg-gray-900 scroll-smooth bg-gray-50 w-full max-w-full max-h-full h-full transition-all duration-300 use-automation-zoom-in"
        )}
      >
        {elements.map((e) => (
          <Recursive key={e.id} element={e} />
        ))}
      </div>
    </div>
  );
}
