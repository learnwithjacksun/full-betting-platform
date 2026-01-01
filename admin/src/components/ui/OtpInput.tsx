import { useRef, useState } from "react";
import type { KeyboardEvent, ChangeEvent } from "react";

interface OtpInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
  error?: string;
}

export default function OtpInput({ length = 6, onComplete, error }: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete when all fields are filled
    if (newOtp.every((digit) => digit !== "") && onComplete) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle paste
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, "").slice(0, length).split("");
        if (digits.length === length) {
          const newOtp = [...otp];
          digits.forEach((digit, i) => {
            newOtp[i] = digit;
          });
          setOtp(newOtp);
          inputRefs.current[length - 1]?.focus();
          if (onComplete) {
            onComplete(newOtp.join(""));
          }
        }
      });
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (pastedData.length === length) {
      const digits = pastedData.split("");
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        newOtp[i] = digit;
      });
      setOtp(newOtp);
      inputRefs.current[length - 1]?.focus();
      if (onComplete) {
        onComplete(newOtp.join(""));
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2 justify-center">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={`w-12 h-12 text-center text-lg font-semibold rounded-lg border-2 transition-all focus:border-primary focus:ring-4 focus:ring-primary/20 bg-foreground ${
              error ? "border-red-500" : "border-line"
            }`}
          />
        ))}
      </div>
      {error && <p className="text-red-500 text-xs font-medium text-center">{error}</p>}
    </div>
  );
}

