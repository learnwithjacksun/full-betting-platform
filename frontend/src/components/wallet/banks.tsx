import useBank from "@/hooks/useBank";
import { Plus, X, Wallet, Trash2, Building2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { InputWithIcon, ButtonWithLoader, SelectWithIcon } from "../ui";

export default function Banks() {
  const {
    useSupportedBanksQuery,
    useBankAccountsQuery,
    resolveBankAccount,
    addBankAccount,
    deleteBankAccount,
    isResolving,
    isAdding,
    isDeleting,
  } = useBank();

  const { data: supportedBanks = [] } = useSupportedBanksQuery();
  const { data: bankAccounts = [], isLoading: isLoadingAccounts } =
    useBankAccountsQuery();

  const [isAddingBank, setIsAddingBank] = useState(false);
  const [bankForm, setBankForm] = useState({
    bankCode: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
  });
  const [isResolvingAccount, setIsResolvingAccount] = useState(false);

  // Filter banks for search
  const [bankSearch, setBankSearch] = useState("");
  const filteredBanks = supportedBanks.filter((bank) =>
    bank.name.toLowerCase().includes(bankSearch.toLowerCase())
  );

  const handleResolveAccount = async () => {
    if (!bankForm.bankCode || !bankForm.accountNumber) {
      toast.error("Please select a bank and enter account number");
      return;
    }

    if (bankForm.accountNumber.length < 10) {
      toast.error("Account number must be at least 10 digits");
      return;
    }

    setIsResolvingAccount(true);
    try {
      const resolved = await resolveBankAccount({
        accountNumber: bankForm.accountNumber,
        bankCode: bankForm.bankCode,
        bankName: bankForm.bankName,
      });

      setBankForm({
        ...bankForm,
        accountName: resolved.accountName,
      });
      toast.success("Account resolved successfully!");
    } catch {
      // Error handled by API interceptor
    } finally {
      setIsResolvingAccount(false);
    }
  };

  const handleAddBankAccount = async () => {
    if (
      !bankForm.bankCode ||
      !bankForm.bankName ||
      !bankForm.accountNumber ||
      !bankForm.accountName
    ) {
      toast.error("Please fill in all fields and resolve account");
      return;
    }

    try {
      await addBankAccount({
        accountName: bankForm.accountName,
        accountNumber: bankForm.accountNumber,
        bankName: bankForm.bankName,
        bankCode: bankForm.bankCode,
      });

      // Reset form
      setBankForm({
        bankCode: "",
        bankName: "",
        accountNumber: "",
        accountName: "",
      });
      setIsAddingBank(false);
    } catch {
      // Error handled by API interceptor
    }
  };

  const handleRemoveBankAccount = async (id: string) => {
    if (bankAccounts.length === 1) {
      toast.error("You must have at least one bank account");
      return;
    }

    if (!confirm("Are you sure you want to delete this bank account?")) {
      return;
    }

    try {
      await deleteBankAccount(id);
    } catch {
      // Error handled by API interceptor
    }
  };

  const handleBankSelect = (bankCode: string) => {
    const selectedBank = supportedBanks.find((bank) => bank.code === bankCode);
    if (selectedBank) {
      setBankForm({
        ...bankForm,
        bankCode: selectedBank.code,
        bankName: selectedBank.name,
        accountName: "", // Clear resolved name when bank changes
      });
    }
  };
  return (
    <div className="bg-secondary rounded-xl border border-line p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-semibold font-space mb-1">
            Bank Accounts
          </h3>
          <p className="text-sm text-muted">
            Manage your bank accounts for withdrawals
          </p>
        </div>
        {!isAddingBank && (
          <button
            onClick={() => setIsAddingBank(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-line bg-foreground/60 hover:bg-foreground transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            Add Bank
          </button>
        )}
      </div>

      {/* Add Bank Account Form */}
      {isAddingBank && (
        <div className="bg-foreground/60 rounded-lg border border-line p-4 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold">Add New Bank Account</h4>
            <button
              onClick={() => {
                setIsAddingBank(false);
                setBankForm({
                  bankCode: "",
                  bankName: "",
                  accountNumber: "",
                  accountName: "",
                });
              }}
              className="p-1 rounded-full hover:bg-foreground transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Bank Selection */}
         
            
            
            <SelectWithIcon
              icon={<Building2 size={20} />}
              id="bank-select"
              label="Bank Name"
              options={filteredBanks.map((bank) => ({
                label: bank.name,
                value: bank.code,
              }))}
              value={bankForm.bankCode}
              onChange={(e) => handleBankSelect(e.target.value)}
              className="bg-secondary"
            />
         

          {/* Account Number */}
          <div className="space-y-2">
            <InputWithIcon
              icon={<Wallet size={20} />}
              id="account-number"
              label="Account Number"
              type="text"
              placeholder="Enter 10-digit account number"
              value={bankForm.accountNumber}
              onChange={(e) =>
                setBankForm({
                  ...bankForm,
                  accountNumber: e.target.value.replace(/\D/g, ""), // Only numbers
                  accountName: "", // Clear resolved name when number changes
                })
              }
              className="bg-secondary"
              maxLength={10}
            />
            {bankForm.bankCode && bankForm.accountNumber.length === 10 && (
              <ButtonWithLoader
                initialText="Resolve Account"
                loadingText="Resolving..."
                loading={isResolving || isResolvingAccount}
                onClick={handleResolveAccount}
                className="w-full btn-secondary h-9 rounded-full text-xs font-semibold"
              />
            )}
          </div>

          {/* Resolved Account Name (read-only) */}
          {bankForm.accountName && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <p className="text-xs text-muted mb-1">Account Name</p>
              <p className="text-sm font-semibold text-green-600">
                {bankForm.accountName}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <ButtonWithLoader
              initialText="Add Bank Account"
              loadingText="Adding..."
              loading={isAdding}
              onClick={handleAddBankAccount}
              disabled={!bankForm.accountName}
              className="flex-1 btn-primary h-10 rounded-full text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={() => {
                setIsAddingBank(false);
                setBankForm({
                  bankCode: "",
                  bankName: "",
                  accountNumber: "",
                  accountName: "",
                });
                setBankSearch("");
              }}
              className="px-4 py-2 rounded-full border border-line bg-secondary hover:bg-foreground transition-colors text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoadingAccounts && (
        <div className="text-center py-8">
          <Wallet size={48} className="mx-auto text-muted mb-3 animate-pulse" />
          <p className="text-sm font-medium text-main mb-1">Loading accounts...</p>
        </div>
      )}

      {/* Bank Accounts List */}
      {!isLoadingAccounts && bankAccounts.length === 0 && !isAddingBank ? (
        <div className="text-center py-8">
          <Wallet size={48} className="mx-auto text-muted mb-3" />
          <p className="text-sm font-medium text-main mb-1">No bank accounts</p>
          <p className="text-xs text-muted">
            Add a bank account to enable withdrawals
          </p>
        </div>
      ) : (
        !isLoadingAccounts && (
          <div className="space-y-3">
            {bankAccounts.map((account) => (
              <div
                key={account.id}
                className="bg-foreground/60 rounded-lg border border-line p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-sm font-semibold">
                        {account.bankName}
                      </h4>
                      {account.isDefault && (
                        <span className="text-[10px] px-2 py-0.5 bg-primary/20 text-primary rounded-full font-semibold">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted mb-1">
                      {account.accountName}
                    </p>
                    <p className="text-sm font-mono font-semibold">
                      {account.accountNumber.replace(/(.{4})/g, "$1 ").trim()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {bankAccounts.length > 1 && (
                      <button
                        onClick={() => handleRemoveBankAccount(account.id)}
                        disabled={isDeleting}
                        className="p-2 rounded-full border border-line bg-secondary hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Remove account"
                      >
                        <Trash2 size={14} className="text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
