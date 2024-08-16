import { createContext } from "react";
import useSWR from "swr";
import { UserInterfaceDisplay } from "../../types/User";
import { apiCall } from "../utils/apiCall";

function useUser() {
  const { data, error, mutate } = useSWR(
    "/user",
    async () =>
      await apiCall<{ user: UserInterfaceDisplay; status: number }>("/user", {
        method: "GET",
        isSessionRequest: true,
        softError: true,
      })
  );

  return {
    user: data?.user,
    loading: !error && !data,
    error,
    mutate,
  };
}

/* eslint-disable @typescript-eslint/no-empty-function */
export const UserContext = createContext({
  user: undefined as UserInterfaceDisplay | undefined,
  loadingUser: false,
  errorUser: null,
  refetchUser: () => {},
});
/* eslint-enable @typescript-eslint/no-empty-function */

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const { user, loading, error, mutate } = useUser();

  return (
    <UserContext.Provider
      value={{
        user,
        loadingUser: loading,
        errorUser: error,
        refetchUser: mutate,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
