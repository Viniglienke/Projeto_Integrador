import { createContext, useState, useEffect } from "react";
import { api } from "../services/api";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadingStoreData = () => {
      const storageUser = localStorage.getItem("@Auth:user");
      const storageToken = localStorage.getItem("@Auth:token");

      if (storageUser && storageToken) {
        try {
          const parsedUser = JSON.parse(storageUser);
          if (parsedUser) {
            setUser(parsedUser);
            api.defaults.headers.common["Authorization"] = `Bearer ${storageToken}`;
          }
        } catch (error) {
          console.error("Erro ao carregar dados do localStorage:", error);
          localStorage.removeItem("@Auth:user");
          localStorage.removeItem("@Auth:token");
        }
      }
    };
    loadingStoreData();
  }, []);

  const signIn = async ({ email, password }) => {
    try {
      const response = await api.post("/login", { email, password });

      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        setUser(response.data.user);
        api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
        localStorage.setItem("@Auth:user", JSON.stringify(response.data.user));
        localStorage.setItem("@Auth:token", response.data.token);
        toast.success("Login realizado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error.response ? error.response.data : error.message);
      toast.error("Erro no login. Verifique seus dados.");
    }
  };

  const signOut = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        signed: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};