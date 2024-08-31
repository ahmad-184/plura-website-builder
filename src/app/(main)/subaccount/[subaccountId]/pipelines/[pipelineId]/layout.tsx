import { PipelineStoreProvider } from "@/providers/pipeline-store-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PipelineStoreProvider>{children}</PipelineStoreProvider>;
}
