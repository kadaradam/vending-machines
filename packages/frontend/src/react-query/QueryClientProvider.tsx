import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider as OriginalQueryClientProvider,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

type QueryClientProviderProps = {
  children?: React.ReactNode;
};

type BackendError = {
  message: string;
  statusCode: number;
};

const handleError = (error: unknown) => {
  console.log(error);

  if (error instanceof AxiosError) {
    const typedError: AxiosError<BackendError> = error;

    const errorMessage = typedError?.response?.data?.message;

    if (!errorMessage) {
      toast.error("Unexpected error");
      return;
    }

    toast.error(errorMessage);
  } else {
    // The type is literally unknown
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const unknownError = error as any;
    // Axios errors has message prop
    const errorToDisplay = unknownError?.message ? unknownError.message : error;

    // TODO: Update to use error codes
    if (
      errorToDisplay === "There is already an active session using your account"
    ) {
      // logout user
    }

    toast.error(errorToDisplay);
  }
};

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: handleError,
  }),
  queryCache: new QueryCache({
    onError: handleError,
  }),
});

export const QueryClientProvider = ({ children }: QueryClientProviderProps) => (
  <OriginalQueryClientProvider client={queryClient}>
    {children}
  </OriginalQueryClientProvider>
);
