import GoogleLoginButton from "../components/GoogleLoginButton";

import { useAuth } from "../context/AuthContext";
import {useNavigate} from "react-router-dom";
import { useEffect } from "react";


const Login = () => {
  const { signWithGoogle, authState } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signWithGoogle();
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
    
  };

  useEffect(() => {
    if (authState.user && !authState.isLoading) {
      navigate("/dashboard");
    }}, [authState.user, authState.isLoading, navigate]);
  



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className= "max-w-md w-full space-y-8">
        <header>
          <h1 className="text-center text-3xl font-extrabold text-gray-900">DevBills</h1>
          <p className="mt-2 text-center text-sm text-gray-600">Gerencia suas finanças de forma simples e eficiente</p>
        </header>
        <main className="mt-8 bg-white py-8 px-4 shadow-md rounded-lg sm:px-10 space-y-6">
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 ">Faça login para continuar</h2>
            <p className="mt-1 text-sm text-gray-600">Acesse sua conta para começar a gerenciar sua finanças</p>
          </section>
          <GoogleLoginButton  onClick={handleLogin} isLoading={false} />
          <div className="bg-red-50 text-red-700 mt-4">
            <p>{authState.error}</p>
          </div>

          <footer className="">
            <p className="mt-1 text-sm  text-center text-gray-600">Ao fazer login, você concorda com nossos termos de uso e política de privacidade.</p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Login;
