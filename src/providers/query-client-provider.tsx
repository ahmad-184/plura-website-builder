"use client";

import {
  QueryClient,
  QueryClientProvider as Provider,
} from "@tanstack/react-query";

type Props = {
  children: React.ReactNode;
};

const queryClient = new QueryClient();

const QueryClientProvider = ({ children }: Props) => {
  return <Provider client={queryClient}>{children}</Provider>;
};

export default QueryClientProvider;
