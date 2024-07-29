import { ThemeProvider } from "./theme-provider";
import ClientEnvironmentVars, {
  ClientEnvironmentVarsType,
} from "./ClientEnvironmentVars";
import { Toaster } from "@/components/ui/sonner";
import ModalProvider from "./model-providers";

export const Providers = ({
  children,
  cloudinary_api_key,
  cloudinary_cloud_name,
  cloudinary_preset,
  cloudinary_upload_folder,
}: { children: React.ReactNode } & ClientEnvironmentVarsType) => {
  return (
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
        <ModalProvider>{children}</ModalProvider>
        <Toaster />
      </ThemeProvider>
    </ClientEnvironmentVars>
  );
};
