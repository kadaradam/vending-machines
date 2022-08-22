import {
  QueryCache,
  QueryClient,
  QueryClientProvider as OriginalQueryClientProvider,
} from "@tanstack/react-query";

type QueryClientProviderProps = {
  children?: React.ReactNode;
};

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      // The type is literally unknown
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const unknownError = error as any;
      // Axios errors has message prop
      const errorToDisplay = unknownError?.message
        ? unknownError.message
        : error;

      console.error(`Something went wrong: ${errorToDisplay}`);
    },
  }),
});

export const QueryClientProvider = ({ children }: QueryClientProviderProps) => (
  <OriginalQueryClientProvider client={queryClient}>
    {children}
  </OriginalQueryClientProvider>
);
