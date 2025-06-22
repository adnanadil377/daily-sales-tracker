import axios from 'axios';
import { useEffect, useState, useCallback, createContext } from 'react';
import type { ReactNode } from 'react'; // Correct type-only import

// Define the shape of your decoded JWT payload
interface DecodedToken {
    sub: string; // Subject (usually username or user ID)
    exp: number; // Expiration time
    iat?: number; // Issued at
    role?: string; // Or a more specific role type e.g., 'admin' | 'user'
    user_role?: string; // Alternative role claim
    // Add any other claims you expect
    [user_id: string]: any;
}

interface AuthContextType {
    token: string | null;
    user: DecodedToken | null;
    role: string; // Or your specific role type
    loading: boolean;
    login: (username: string, password: string) => Promise<{ success: boolean; user?: DecodedToken | null; error?: string }>;
    logout: () => void;
    isAuthenticated: boolean;
}

// Initialize context with a default value or undefined
// Using undefined and checking in useContext is common.
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
// Or with a default that makes sense if you don't want to check for undefined consumers
// export const AuthContext = createContext<AuthContextType>({
//   token: null,
//   user: null,
//   role: '',
//   loading: true,
//   login: async () => ({ success: false, error: "Provider not ready" }),
//   logout: () => {},
// });


const decodeJwt = (token: string): DecodedToken | null => {
    try {
        return JSON.parse(atob(token.split('.')[1])) as DecodedToken;
    } catch (e) {
        console.error("Failed to decode JWT:", e);
        return null;
    }
};

interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<DecodedToken | null>(null);
    const [role, setRole] = useState<string>(''); // Or your specific role type
    const [loading, setLoading] = useState<boolean>(true);

    const logout = useCallback(() => {
        localStorage.removeItem('authToken');
        delete axios.defaults.headers.common['Authorization'];
        setToken(null);
        console.log("User logged out.");
    }, []); // setToken is stable

    useEffect(() => {
        if (token) {
            const decodedUser = decodeJwt(token);
            if (decodedUser && decodedUser.exp * 1000 > Date.now()) {
                setUser(decodedUser);
                setRole(decodedUser.role || decodedUser.user_role || '');
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setLoading(false);
            } else {
                if (decodedUser) {
                    console.log("Token was expired.");
                } else if (token) {
                    console.log("Token was malformed or could not be decoded.");
                }
                logout(); // This will re-trigger this effect with token=null
            }
        } else {
            setUser(null);
            setRole('');
            delete axios.defaults.headers.common['Authorization'];
            setLoading(false);
        }
    }, [token, logout]); // setUser and setRole are stable setters, can be omitted if preferred

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            setToken(storedToken);
        } else {
            setLoading(false);
        }
    }, []);

    const login = useCallback(async (username: string, password: string): Promise<{ success: boolean; user?: DecodedToken | null; error?: string }> => {
        setLoading(true);
        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            const response = await axios.post<{ access_token: string }>( // Type the expected response
                "http://localhost:8000/auth/login", // Consider making this an env variable
                formData,
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            );

            const { access_token: newToken } = response.data;
            if (newToken) {
                localStorage.setItem('authToken', newToken);
                setToken(newToken);
                const decoded = decodeJwt(newToken);
                // setLoading(false) is handled by the main useEffect
                return { success: true, user: decoded };
            }
            setLoading(false);
            return { success: false, error: 'Login successful, but no token received.' };
        } catch (error: any) { // Type error as any or unknown then check
            console.error("Login error:", error.response || error.message);
            const errorMessage = error.response?.data?.detail || error.message || 'Login failed due to an unknown error.';
            setLoading(false);
            return { success: false, error: errorMessage };
        }
    }, []); // setLoading and setToken are stable

    useEffect(() => {
        const responseInterceptor = axios.interceptors.response.use(
            response => response,
            error => {
                if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
                    // Using axios.isAxiosError for better type safety
                    if (error.config && error.config.url !== "http://localhost:8000/auth/login") {
                        console.log("Axios interceptor: 401 Unauthorized. Logging out.");
                        logout();
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, [logout]);

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'authToken') {
                // Only update if the value is different
                setToken(prev => (prev !== event.newValue ? event.newValue : prev));
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <AuthContext.Provider value={{ token, user, role, login, logout, loading, isAuthenticated: !!token, }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

// Optional: Custom hook for consuming the context
// import { useContext } from 'react';
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };