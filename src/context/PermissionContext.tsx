import React, { createContext, useContext, useState } from "react";

interface PermissionContextType {
  permissions: string[];
  setPermissions: (perms: string[]) => void;
}

const PermissionContext = createContext<PermissionContextType>({
  permissions: [],
  setPermissions: () => {},
});

export const PermissionProvider = ({
  children,
  initialPermissions = [],
}: {
  children: React.ReactNode;
  initialPermissions?: string[];
}) => {
  const [permissions, setPermissions] = useState<string[]>(initialPermissions);

  return (
    <PermissionContext.Provider value={{ permissions, setPermissions }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = () => useContext(PermissionContext);
