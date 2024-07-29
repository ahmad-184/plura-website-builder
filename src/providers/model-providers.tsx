"use client";

import { Agency, User } from "@prisma/client";
import { createContext, useContext, useEffect, useState } from "react";

interface ModalData {
  user?: User;
  agency?: Agency;
}

type ContextTypes = {
  data: ModalData;
  isOpen: boolean;
  setOpen: ({
    modal,
    fetchData,
  }: {
    modal: React.ReactNode;
    fetchData?: () => Promise<any>;
  }) => void;
  setClose: () => void;
};

const Context = createContext<ContextTypes>({
  data: {},
  isOpen: false,
  setOpen: () => {},
  setClose: () => {},
});

export const useModal = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useModal must be used within the modal provider");
  }
  return context;
};

const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<ModalData>({});
  const [isMounted, setIsMounted] = useState(false);
  const [showingModal, setShowingModal] = useState<React.ReactNode | null>(
    null
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const setOpen = async ({
    modal,
    fetchData,
  }: {
    modal: React.ReactNode;
    fetchData?: () => Promise<any>;
  }) => {
    if (modal) {
      if (fetchData) {
        const res = await fetchData();
        setData({ ...data, ...res });
      }
      setShowingModal(modal);
      setIsOpen(true);
    }
  };

  const setClose = () => {
    setData({});
    setShowingModal(null);
    setIsOpen(false);
  };

  if (!isMounted) return null;

  return (
    <Context.Provider
      value={{
        setClose,
        setOpen,
        data,
        isOpen,
      }}
    >
      {children}
      {showingModal}
    </Context.Provider>
  );
};

export default ModalProvider;
