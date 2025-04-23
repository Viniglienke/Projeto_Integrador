import { createContext } from "react";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { api } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadingStoreData = () => {
      const storageUser = localStorage.getItem("@Auth:user");
      const storageToken = localStorage.getItem("@Auth:token");

      if (storageUser && storageToken) {
        try {
          // Verifique se o armazenamento contém um JSON válido
          const parsedUser = JSON.parse(storageUser);
          if (parsedUser) {
            setUser(parsedUser);
            api.defaults.headers.common["Authorization"] = `Bearer ${storageToken}`;
          }
        } catch (error) {
          console.error("Erro ao carregar dados do localStorage:", error);
          // Se os dados forem inválidos, limpar o localStorage
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
            alert(response.data.error);
        } else {
            setUser(response.data.user);
            api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
            localStorage.setItem("@Auth:user", JSON.stringify(response.data.user));
            localStorage.setItem("@Auth:token", response.data.token);
        }
    } catch (error) {
        console.error("Erro ao fazer login:", error.response ? error.response.data : error.message);
        alert("Erro no login. Verifique o console para mais detalhes.");
    }
};


  const signOut = () => {
    localStorage.clear();
    setUser(null);
    // Navegação após o logout, utilizando Navigate do React Router
    window.location.href = "/"; // ou use history.push("/"); dependendo da versão do React Router
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