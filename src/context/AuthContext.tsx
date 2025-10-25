import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {signInWithPopup, onAuthStateChanged,signOut as firebaseSignOut} from "firebase/auth";
import type { AuthState } from "../types/auth";
import { firebaseAuth, googleAuthProvider } from "../config/firebase";

interface AuthContextProps{
    authState: AuthState,
    signWithGoogle: () => Promise<void>,
    signOut: () => Promise<void>,
}

const AuthContext = createContext <AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [authState, setAuthState] = useState<AuthState>({
   
        user: null,
        isLoading: false,
        error: null
    });

    useEffect(() => {

        
        const unsubscribe = onAuthStateChanged(
            firebaseAuth,
            (user) => {
                console.log(user);
                if (user) {
                    setAuthState({
                        user: {
                            uid: user.uid,
                            email: user.email,
                            displayName: user.displayName,
                            photoURL: user.photoURL
                        },
                        isLoading: false,
                        error: null
                    });
                } else {
                    setAuthState({
                        user: null,
                        isLoading: false,
                        error: null
                    });
                }
            },
            (error) => {
                console.error("Error authenticating user:", error);
                setAuthState({
                    user: null,
                    isLoading: false,
                    error: error.message
                });
            }
        );
        return () => unsubscribe();
    }, []);

    const signWithGoogle = async (): Promise<void> => {
        setAuthState((prevState) => ({
                ...prevState,
                isLoading: true,
                
            }));
        try {
            await signInWithPopup(firebaseAuth, googleAuthProvider);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error signing in with Google";
            setAuthState((prevState) => ({
                ...prevState,
                isLoading: false,
                error: message
            }));
            
        }
    };

    const signOut = async () => {
        setAuthState((prevState) => ({
                ...prevState,
                isLoading: true,
                
            }));
        try {
            await firebaseSignOut(firebaseAuth);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error signing out";
            setAuthState((prevState) => ({
                ...prevState,
                isLoading: false,
                error: message
            }));
        }
    };

    return (
        <AuthContext.Provider value={{ authState, signWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}