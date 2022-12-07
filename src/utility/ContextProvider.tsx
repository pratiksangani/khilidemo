import React, { createContext, PropsWithChildren, useState } from "react";

type Props = PropsWithChildren & {};

export const MyContext = createContext({
  isUser: false,
  isAdmin: false,
  setIsAdmin: (v: boolean) => {},
  setIsUser: (v: boolean) => {},
});

const ContextProvider = ({ children }: Props) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(
    !!localStorage.getItem("ADMIN_LOGIN_DETAIL")
  );
  const [isUser, setIsUser] = useState<boolean>(
    !!localStorage.getItem("USER_LOGIN_DETAIL")
  );
  return (
    <MyContext.Provider
      value={{
        isUser,
        isAdmin,
        setIsAdmin,
        setIsUser,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export default ContextProvider;
