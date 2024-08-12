"use client";

import { Agency, SubAccount, User } from "@prisma/client";
import { createContext, useContext, useEffect, useState } from "react";

interface ModalData {
  user?: User | null;
  agency?: Agency | null;
  subaccounts?: SubAccount[] | [];
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
  isfetching: boolean;
};

const Context = createContext<ContextTypes>({
  data: {},
  isOpen: false,
  setOpen: () => {},
  setClose: () => {},
  isfetching: false,
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
  const [data, setData] = useState<ModalData>({
    agency: null,
    subaccounts: [],
    user: null,
  });
  const [isMounted, setIsMounted] = useState(false);
  const [showingModal, setShowingModal] = useState<React.ReactNode | null>(
    null
  );
  const [fetchingData, setFechingData] = useState(false);

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
      setShowingModal(modal);
      setIsOpen(true);
      if (fetchData) {
        try {
          setFechingData(true);
          const res = await fetchData();
          if (res) setData(res);
        } catch (err) {
          console.log(err);
          setData({});
        } finally {
          setFechingData(false);
        }
      }
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
        isfetching: fetchingData,
      }}
    >
      {children}
      {showingModal}
    </Context.Provider>
  );
};

export default ModalProvider;
