import { Link } from "react-router-dom";
import { Home, ArrowLeft, SearchX } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className=" flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md w-full space-y-6"
      >
        {/* 404 Illustration */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center"
        >
          <div className="relative">
            <div className="w-32 h-32 bg-foreground rounded-full flex items-center justify-center">
              <SearchX size={64} className="text-muted" />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="absolute -top-2 -right-2 w-16 h-16 bg-primary/20 rounded-full blur-xl"
            />
          </div>
        </motion.div>

        {/* Error Code */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-8xl font-bold font-space bg-gradient-to-r from-primary to-green-500 bg-clip-text text-transparent">
            404
          </h1>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-2"
        >
          <h2 className="text-2xl font-bold font-space text-main">
            Page Not Found
          </h2>
          <p className="text-muted text-sm leading-relaxed">
            Oops! The page you're looking for doesn't exist. It might have been
            moved, deleted, or you entered the wrong URL.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4"
        >
          <Link
            to="/"
            className="btn-primary px-6 py-3 btn rounded-lg font-semibold flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <Home size={18} />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="bg-foreground px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-foreground/80 transition-colors"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </motion.div>

        {/* Additional Help */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="pt-6 border-t border-line"
        >
          <p className="text-xs text-muted">
            Need help?{" "}
            <Link to="/contacts" className="text-primary hover:underline">
              Contact Support
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

