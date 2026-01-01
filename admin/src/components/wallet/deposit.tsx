import { Wallet } from "lucide-react";
import { InputWithIcon, ButtonWithLoader } from "../ui";
import { useState } from "react";
import { toast } from "sonner";
import { usePayment, useAuth } from "@/hooks";

export default function Deposit() {
  const { user } = useAuth();
  const { loading, makeDeposit } = usePayment();
  const [amount, setAmount] = useState<string>("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) < 100) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (parseFloat(amount) < 100) {
      toast.error("Minimum deposit amount is ₦100");
      return;
    }
    makeDeposit(parseFloat(amount), user?.email as string);
  };
  return (
    <div className="bg-secondary rounded-xl border border-line p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold font-space mb-2">Deposit Funds</h3>
        <p className="text-sm text-muted">
          Add money to your wallet using Paystack payment gateway
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-medium text-muted block mb-2">
            Amount to Deposit
          </label>
          <InputWithIcon
            icon={<Wallet size={20} />}
            id="deposit-amount"
            type="number"
            placeholder="Enter amount (minimum ₦100)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-foreground"
          />
          <p className="text-xs text-muted mt-2">Minimum deposit: ₦100</p>
        </div>

        <ButtonWithLoader
          initialText="Proceed to Payment"
          loadingText="Processing..."
          loading={loading}
          type="submit"
          className="w-full btn-primary h-12 rounded-full text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </form>

      <div className="pt-4 border-t border-line">
        <p className="text-xs text-muted">
          💳 Secure payment powered by Paystack. Your payment information is
          encrypted and secure.
        </p>
      </div>
    </div>
  );
}
