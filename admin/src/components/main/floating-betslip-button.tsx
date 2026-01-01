import { Ticket } from "lucide-react";
import { useBetslipStore } from "@/store";
import { motion } from "framer-motion";

interface FloatingBetslipButtonProps {
  onClick: () => void;
}

export default function FloatingBetslipButton({
  onClick,
}: FloatingBetslipButtonProps) {
  const { bets } = useBetslipStore();

  if (bets.length === 0) return null;

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 lg:hidden w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
    >
      <div className="relative">
        <Ticket size={24} />
        {bets.length > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-4 -right-4 bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center font-space text-xs font-bold"
          >
            {bets.length}
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}

