import { ThemeProvider } from "./theme-provider";
import ClientEnvironmentVars, {
  ClientEnvironmentVarsType,
} from "./client-environment-vars";
import { Toaster } from "@/components/ui/sonner";
import ModalProvider from "./model-providers";
import QueryClientProvider from "./query-client-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export const Providers = ({
  children,
  cloudinary_api_key,
  cloudinary_cloud_name,
  cloudinary_preset,
  cloudinary_upload_folder,
}: { children: React.ReactNode } & ClientEnvironmentVarsType) => {
  return (
    <QueryClientProvider>
      <ClientEnvironmentVars
        cloudinary_api_key={cloudinary_api_key}
        cloudinary_cloud_name={cloudinary_cloud_name}
        cloudinary_preset={cloudinary_preset}
        cloudinary_upload_folder={cloudinary_upload_folder}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <ModalProvider>{children}</ModalProvider>
          </TooltipProvider>
          <Toaster />
        </ThemeProvider>
      </ClientEnvironmentVars>
    </QueryClientProvider>
  );
};
