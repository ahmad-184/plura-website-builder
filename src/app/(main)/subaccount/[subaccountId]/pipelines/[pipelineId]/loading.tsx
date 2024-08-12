import Loader from "@/components/loader";
import React from "react";

const LoadingAgencyPage = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Loader className="w-[40px] h-[40px]" loaderColor="fill-primary" />
    </div>
  );
};

export default LoadingAgencyPage;
