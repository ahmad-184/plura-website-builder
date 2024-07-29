import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";
import { env } from "@/env";
import { ClerkProvider } from "@clerk/nextjs";
import NextTopLoader from "nextjs-toploader";

const dm_sans = DM_Sans({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Plura",
  description: "All in one Agency Solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={dm_sans.className}>
          <Providers
            cloudinary_api_key={env.NEXT_PUBLIC_CLOUDINARY_API_KEY}
            cloudinary_cloud_name={env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
            cloudinary_preset={env.NEXT_PUBLIC_CLOUDINARY_PRESET}
            cloudinary_upload_folder={env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_FOLDER}
          >
            <NextTopLoader showSpinner={false} color="#3b82f6" />
            {children}
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
