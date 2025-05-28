import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UrlContext } from "./useUrl";
import Notiflix from "notiflix";
import NProgress from "nprogress";
import { ShowContext } from "./useShow";

export const AuthContext = createContext({});

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { url } = useContext(UrlContext);
  const { setIsACL, setIsAdmin } = useContext(ShowContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  // Configure Axios interceptors
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        // if (error.response?.status === 401) {
        //   localStorage.removeItem("token");
        //   localStorage.removeItem("user");
        //   localStorage.removeItem("region");
        //   localStorage.removeItem("userRole");
        //   setUser(null);
        //   setIsAuthenticated(false);
        //   navigate("/login");
        // }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  const login = async (email, password) => {
    try {
      NProgress.start();
      setIsLoading(true);
      const response = await axios.post(`${url}/api/login`, {
        email,
        password,
      });
                
      const { access_token, region, user } = response.data;
      localStorage.setItem("token", `Bearer ${access_token}`);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("region", JSON.stringify(region));
      localStorage.setItem("userRole", user.role);

      setUser(user);
      setIsAuthenticated(true);
      Notiflix.Notify.success("Connexion réussie !");
      navigate("/gestion-de-stock");
      if (user.role === "admin") {
        setIsACL(false);
        setIsAdmin(true);
      } else if (user.role === "acl") {
        setIsAdmin(false);
        setIsACL(true);
      }
    } catch (error) {
      console.error("Erreur de connexion:", error.response?.data);
      if (error.response?.status === 500) {
        Notiflix.Notify.failure(
          "Erreur serveur: Vérifiez la configuration JWT du backend"
        );
      } else if (error.response?.status === 401) {
        Notiflix.Notify.failure("Email ou mot de passe incorrect");
      } else if (error.response?.data?.message) {
        Notiflix.Notify.failure(error.response.data.message);
      } else {
        Notiflix.Notify.failure("Erreur de connexion. Veuillez réessayer.");
      }
    } finally {
      NProgress.done();
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post(
          `${url}/api/logout`,
          {},
          {
            headers: { Authorization: token },
          }
        );
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("region");
      localStorage.removeItem("userRole");
      setUser(null);
      setIsAuthenticated(false);
      navigate("/login");
      Notiflix.Notify.success("Déconnexion réussie !");
    }
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        // Récupérer les dernières données du serveur
        const response = await axios.get(`${url}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = response.data.user;
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("region", JSON.stringify(response.data.region));
        setIsAuthenticated(true);

        const currentPath = window.location.pathname;
        if (currentPath === "/login") {
          navigate("/gestion-de-stock");
        }
      }
    } catch (error) {
      console.error("Error checking auth:", error);
    } finally {
      setLoading(false);  
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        loading,
        login,
        logout,
        checkAuth,
        isLoading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
