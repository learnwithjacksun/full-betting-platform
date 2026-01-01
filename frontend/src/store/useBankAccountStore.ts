import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
  createdAt: string;
}

interface BankAccountStore {
  bankAccounts: BankAccount[];
  addBankAccount: (account: Omit<BankAccount, "id" | "createdAt" | "isDefault">) => void;
  removeBankAccount: (id: string) => void;
  setDefaultAccount: (id: string) => void;
  getDefaultAccount: () => BankAccount | null;
}

const useBankAccountStore = create<BankAccountStore>()(
  persist(
    (set, get) => ({
      bankAccounts: [],

      addBankAccount: (account) => {
        const { bankAccounts } = get();
        const isFirstAccount = bankAccounts.length === 0;
        
        const newAccount: BankAccount = {
          ...account,
          id: `bank-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          isDefault: isFirstAccount,
          createdAt: new Date().toISOString(),
        };

        set({ bankAccounts: [...bankAccounts, newAccount] });
      },

      removeBankAccount: (id) => {
        const { bankAccounts } = get();
        const accountToRemove = bankAccounts.find((acc) => acc.id === id);
        
        if (accountToRemove?.isDefault && bankAccounts.length > 1) {
          // Set first remaining account as default
          const remainingAccounts = bankAccounts.filter((acc) => acc.id !== id);
          if (remainingAccounts.length > 0) {
            remainingAccounts[0].isDefault = true;
            set({ bankAccounts: remainingAccounts });
            return;
          }
        }

        set({ bankAccounts: bankAccounts.filter((acc) => acc.id !== id) });
      },

      setDefaultAccount: (id) => {
        set({
          bankAccounts: get().bankAccounts.map((acc) => ({
            ...acc,
            isDefault: acc.id === id,
          })),
        });
      },

      getDefaultAccount: () => {
        return get().bankAccounts.find((acc) => acc.isDefault) || null;
      },
    }),
    {
      name: "bank-accounts",
      partialize: (state) => ({
        bankAccounts: state.bankAccounts,
      }),
    }
  )
);

export default useBankAccountStore;

