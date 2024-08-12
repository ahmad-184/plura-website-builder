"use client";

import { Button } from "@/components/ui/button";
import { CheckCircleIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function SaveWebApp() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [insalled, setInstalled] = useState(false);

  useEffect(() => {
    if (window.localStorage) {
      const status = window.localStorage.getItem("webapp-installed");
      if (status === "true") setInstalled(true);
      else setInstalled(false);
    }
  }, [window]);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      const promptEvent = deferredPrompt as any;
      promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      setDeferredPrompt(null);
    }
  };

  useEffect(() => {
    const handler = () => {
      if (window) {
        window.localStorage.setItem("webapp-installed", "true");
        setInstalled(true);
      }
    };

    window.addEventListener("appinstalled", handler);

    return () => {
      window.removeEventListener("appinstalled", handler);
    };
  }, [window]);

  return (
    <div className="flex justify-between items-center w-full border p-4 rounded-lg gap-2">
      <div className="flex md:items-center gap-4 flex-col md:!flex-row">
        <Image
          src={"/appstore.png"}
          alt="app logo"
          width={80}
          height={80}
          className="rounded-md object-contain"
        />
        <p>Save the website as shortcut on your mobile device</p>
      </div>
      {insalled ? (
        <CheckCircleIcon className="text-primary p-2 flex-shrink-0" size={50} />
      ) : (
        <Button onClick={handleInstallClick}>Start</Button>
      )}
    </div>
  );
}
