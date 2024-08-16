import { createContext, useCallback } from "react";

interface PaperCupsProviderProps {
  children: React.ReactNode;
}

/* eslint-disable @typescript-eslint/no-empty-function */
export const PaperCupsContext = createContext({
  openChat: () => {},
});
/* eslint-enable @typescript-eslint/no-empty-function */

export const PaperCupsProvider = ({ children }: PaperCupsProviderProps) => {
  const openChat = useCallback(() => {
    const chat = document.querySelector(".Papercups-toggleButton");
    if (chat) (chat as HTMLElement).click();
    return;
  }, []);

  return (
    <PaperCupsContext.Provider value={{ openChat }}>
      {children}
    </PaperCupsContext.Provider>
  );
};
