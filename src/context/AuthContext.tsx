import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface Permission {
  featureName: string;
}

interface Feature {
  isAuthor?: boolean;
  [key: string]: Feature | boolean | undefined;
}

export type Permissions = Record<string, Feature>;

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  permissions: Permissions;
  setAuthor: (perms: Permission[], isFullPermission?: boolean) => void;
  hasAuthority: (authorities: string[][]) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [permissions, setPermissions] = useState<Permissions>({});

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  const setAuthor = useCallback((perms: Permission[]) => {
    if (!perms) {
      setPermissions({ dashboard: {} });
      return;
    }
    const permissions: Permissions = {};
    perms.forEach(({ featureName }) => {
      const featureKeys = featureName.split('.');
      let feature: Feature = permissions;
      featureKeys.forEach((key, index) => {
        if (!feature[key]) feature[key] = {};
        feature = feature[key] as Feature;

        if (index === featureKeys.length - 1) {
          feature.isAuthor = true;
        }
      });
    });
    setPermissions(permissions);
  }, []);

  const checkAuthority = (obj: Feature | null, keys: string[]): boolean => {
    let result: Feature | boolean | null = obj;
    for (const key of keys) {
      result = result?.[key] as Feature | null;
      if (!result) return false; // Không tìm thấy quyền
    }
    return (result as Feature)?.isAuthor ?? false;
  };

  const hasAuthority = (authorities: string[][]): boolean => {
    if (!permissions) return false;
    return authorities.some(authArray => checkAuthority(permissions, authArray));
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, permissions, setAuthor, hasAuthority }}>
      {children}
    </AuthContext.Provider>
  );
};
