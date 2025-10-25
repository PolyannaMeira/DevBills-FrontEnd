import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home.tsx";
import Login from "../pages/Login.tsx";
import { AuthProvider } from "../context/AuthContext.tsx";
import Dashboard from "../pages/Dashboard.tsx";
import PrivateRoutes from "./PrivateRoutes.tsx";
import AppLayout from "../layout/AppLayout.tsx";
import Transactions from "../pages/Transactions.tsx";
import TransactionsForm from "../pages/TransactionsForm.tsx";
import { ToastContainer, type ToastContainerProps } from "react-toastify";

const AppRoutes = () => {
 const toastConfig: ToastContainerProps = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  newestOnTop: true,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  theme: "colored"
 }

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          <Route element={<PrivateRoutes />}>
            <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/transactions/nova" element={<TransactionsForm />} />
            </Route>
          </Route>

          <Route path="*" element={<h2>404 Not Found</h2>} />
        </Routes>
        <ToastContainer {...toastConfig} />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default AppRoutes;
