import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { useCart } from "./hooks/useCart";
import Index from "./pages/Index";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import ResetPassword from "./pages/ResetPassword";
import StripeCheckout from './pages/StripeCheckout';
import StripeReturn from './pages/StripeReturn';
import EmailVerification from "./pages/EmailVerification";
import { useEffect } from "react";

// Component to connect cart clearing with logout
const CartLogoutHandler = ({ children }: { children: React.ReactNode }) => {
  const { setLogoutCallback } = useAuth();
  const { clearCartData } = useCart();

  useEffect(() => {
    setLogoutCallback(() => {
      clearCartData();
    });
  }, [setLogoutCallback, clearCartData]);

  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartLogoutHandler>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/stripe-checkout" element={<StripeCheckout />} />
              <Route path="/stripe-return" element={<StripeReturn />} />
              <Route path="/users/verify" element={<EmailVerification />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartLogoutHandler>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
