import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider as OriginalQueryClientProvider,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import axiosService from "src/axiosService";
import { STORAGE_AUTH_TOKEN_KEY } from "src/constants";

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

    if (
      errorMessage === "There is already an active session using your account"
    ) {
      // logout user
      window.localStorage.removeItem(STORAGE_AUTH_TOKEN_KEY);
      axiosService.refreshRequestHandler(null);
    }

    toast.error(errorMessage);
  } else {
    // The type is literally unknown
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const unknownError = error as any;
    // Axios errors has message prop
    const errorToDisplay = unknownError?.message ? unknownError.message : error;

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
