"use client";

import { createContext, useContext } from "react";

export type ClientEnvironmentVarsType = {
  cloudinary_preset: string;
  cloudinary_api_key: string;
  cloudinary_cloud_name: string;
  cloudinary_upload_folder: string;
};

const Context = createContext<ClientEnvironmentVarsType>({
  cloudinary_preset: "",
  cloudinary_api_key: "",
  cloudinary_cloud_name: "",
  cloudinary_upload_folder: "",
});

export const useEnvVars = () => useContext(Context);

export default function ClientEnvironmentVars({
  cloudinary_preset,
  cloudinary_api_key,
  cloudinary_cloud_name,
  cloudinary_upload_folder,
  children,
}: ClientEnvironmentVarsType & { children: React.ReactNode }) {
  return (
    <Context.Provider
      value={{
        cloudinary_preset,
        cloudinary_api_key,
        cloudinary_cloud_name,
        cloudinary_upload_folder,
      }}
    >
      {children}
    </Context.Provider>
  );
}
