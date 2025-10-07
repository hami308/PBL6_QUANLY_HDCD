import { createContext, useState } from "react";
import Login from "./Login.jsx";

const LoginContext = createContext();

export function LoginProvider({ children }) {
  const [showLogin, setShowLogin] = useState(false);

  const openLogin = () => setShowLogin(true);
  const closeLogin = () => setShowLogin(false);

  return (
    <LoginContext.Provider value={{ openLogin, closeLogin }}>
      {children}
      {showLogin && <Login onClose={closeLogin} />}
    </LoginContext.Provider>
  );
}

export { LoginContext };
