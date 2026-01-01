import Paystack from "@paystack/inline-js";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import api from "@/config/api";
import useAuth from "./useAuth";

const popup = new Paystack();

export default function usePayment() {
    const {checkAuth} = useAuth()
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const initializePayment = async (amount: number, email: string) => {
    popup.newTransaction({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: email,
      amount: amount * 100,
      onSuccess: async (transaction) => {
        try {
          // Call backend to process deposit
          const response = await api.post("/user/deposit/callback", {
            reference: transaction.reference,
            amount: amount,
            email: email,
          });

          if (response.data.success) {
            toast.success("Deposit successful! Your wallet has been credited.");
            await checkAuth()
            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ["auth", "check"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
          }
        } catch (error) {
          // Error handled by API interceptor
          console.error("Deposit callback error:", error);
        }
      },
      onLoad: (response) => {
        console.log("Payment loaded: ", response);
      },
      onCancel: () => {
        toast.error("Payment cancelled");
      },
      onError: (error) => {
        console.error("Payment error: ", error);
        toast.error(error.message || "Payment failed");
      },
    });
  };

  const makeDeposit = async (amount: number, email: string) => {
    setLoading(true);
    try {
      await initializePayment(amount, email);
    } catch (error) {
      console.error("Deposit initialization error: ", error);
      toast.error("Failed to initialize payment");
    } finally {
      setLoading(false);
    }
  };
  
  return {
    loading,
    makeDeposit,
  };
}
