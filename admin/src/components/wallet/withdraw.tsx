import { Wallet, Building2 } from "lucide-react";
import { InputWithIcon, ButtonWithLoader, SelectWithIcon } from "../ui";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import useBank from "@/hooks/useBank";
import api from "@/config/api";
import Banks from "./banks";

export default function Withdraw() {
  const { useBankAccountsQuery } = useBank();
  const { data: bankAccounts = [] } = useBankAccountsQuery();
  const [amount, setAmount] = useState<string>("");
  const [selectedBankAccount, setSelectedBankAccount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) < 100) {
      toast.error("Minimum withdrawal amount is ₦100");
      return;
    }

    if (!selectedBankAccount) {
      toast.error("Please select a bank account");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("/user/withdraw", {
        amount: parseFloat(amount),
        bankAccountId: selectedBankAccount,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setAmount("");
        setSelectedBankAccount("");
        
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ["auth", "check"] });
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
      }
    } catch {
      // Error handled by API interceptor
    } finally {
      setIsSubmitting(false);
    }
  };
 
  return (
    <div className="space-y-6">
      <div className="bg-secondary rounded-xl border border-line p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold font-space mb-2">
            Withdraw Funds
          </h3>
          <p className="text-sm text-muted">
            Transfer money from your wallet to your bank account
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-muted block mb-2">
              Amount to Withdraw
            </label>
            <InputWithIcon
              icon={<Wallet size={20} />}
              id="withdraw-amount"
              type="number"
              placeholder="Enter amount (minimum ₦100)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-foreground"
            />
            <p className="text-xs text-muted mt-2">Minimum withdrawal: ₦100</p>
          </div>

          {bankAccounts.length === 0 ? (
            <div className="text-sm text-muted">
              Please add a bank account first
            </div>
          ) : (
            <SelectWithIcon
              icon={<Building2 size={20} />}
              id="bank-account"
              label="Bank Account"
              options={bankAccounts.map((account) => ({
                label: `${account.bankName} - ${account.accountNumber.replace(/(.{4})/g, "$1 ").trim()}${account.isDefault ? " (Default)" : ""}`,
                value: account.id,
              }))}
              value={selectedBankAccount}
              onChange={(e) => setSelectedBankAccount(e.target.value)}
            />
          )}

          <ButtonWithLoader
            initialText="Request Withdrawal"
            loadingText="Processing..."
            loading={isSubmitting}
            disabled={!selectedBankAccount || bankAccounts.length === 0}
            type="submit"
            className="w-full btn-primary h-12 rounded-full text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </form>
      </div>

      {/* Bank Accounts Section */}
      <Banks />
    </div>
  );
}
