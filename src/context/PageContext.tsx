import { ReactNode, createContext, useContext, useState } from 'react';

interface PageContextType {
  isOpenSideBar: boolean;
  setOpenSideBar: (value: boolean) => void;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export const PageProvider = ({ children }: { children: ReactNode }) => {
  const [isOpenSideBar, setOpenSideBar] = useState<boolean>(false);

  return <PageContext.Provider value={{ isOpenSideBar, setOpenSideBar }}>{children}</PageContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePage = () => {
  const context = useContext(PageContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an PageProvider');
  }
  return context;
};
