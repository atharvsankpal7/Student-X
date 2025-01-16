"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, X } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { BackgroundLines } from "@/components/ui/background-lines";

interface Certificate {
  certificateId: string;
  issueDate: string;
  metadata: {
    fileName: string;
  };
  isValid: boolean;
}

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      delay: 0.2,
    },
  },
};

export default function VerifyPage() {
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    const file = files[0];
    if (file.type !== "application/pdf") {
      setVerificationResult(false);
      setShowModal(true);
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/certificates/verify", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Verification failed");

      const data = await response.json();
      setVerificationResult(data.isValid);
      setShowModal(true);
    } catch (error) {
      setVerificationResult(false);
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => {
      setVerificationResult(null);
    }, 200);
  };

  return (
    <BackgroundLines>
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-4xl border rounded-lg shadow-lg p-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <FileUpload onChange={handleFileUpload} />

          {loading && (
            <div className="flex items-center justify-center mt-6">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          )}

          <AnimatePresence>
            {showModal && verificationResult !== null && (
              <>
                <motion.div
                  variants={overlayVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                  onClick={closeModal}
                />

                <motion.div
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="fixed inset-0 flex items-center justify-center pointer-events-none z-50 p-4"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-10 max-w-md w-full mx-4 pointer-events-auto border dark:border-gray-700">
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -right-2 -top-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                        onClick={closeModal}
                      >
                        <X className="h-5 w-5" />
                      </Button>

                      <div className="text-center mb-8">
                        <motion.div
                          variants={iconVariants}
                          initial="hidden"
                          animate="visible"
                          className="inline-block"
                        >
                          {verificationResult ? (
                            <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
                          ) : (
                            <XCircle className="h-20 w-20 text-red-500 mx-auto" />
                          )}
                        </motion.div>

                        <h3 className="text-3xl font-bold mt-6 mb-3">
                          {verificationResult
                            ? "Certificate Verified"
                            : "Verification Failed"}
                        </h3>

                        <p className="text-gray-600 dark:text-gray-300 text-lg">
                          {verificationResult
                            ? "The certificate is authentic and valid."
                            : "We couldn't verify this certificate. Please try again with a valid certificate."}
                        </p>
                      </div>

                      <div className="flex justify-center">
                        <Button
                          onClick={closeModal}
                          variant={verificationResult ? "default" : "destructive"}
                          className="min-w-40 text-lg py-6"
                        >
                          {verificationResult ? "Great!" : "Try Again"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </BackgroundLines>  );
}
