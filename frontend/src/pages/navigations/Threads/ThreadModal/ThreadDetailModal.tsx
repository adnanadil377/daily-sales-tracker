import React, { useEffect, useState } from "react";
import type { DailySalesReport } from "../../../../../data";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  report: DailySalesReport;
  direction: "left" | "right";
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}

const slideVariants = {
  enter: (direction: "left" | "right") => ({
    x: direction === "right" ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: "left" | "right") => ({
    x: direction === "right" ? -300 : 300,
    opacity: 0,
  }),
};

const ThreadDetailModal: React.FC<Props> = ({
  report,
  direction,
  onClose,
  onApprove,
  onReject,
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showRejected, setShowRejected] = useState(false);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(timer);
    }
    if (showRejected) {
      const timer = setTimeout(() => setShowRejected(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti, showRejected]);

  const handleApproveClick = () => {
    setShowConfetti(true);
    setTimeout(onApprove, 600);
  };

  const handleRejectClick = () => {
    setShowRejected(true);
    setTimeout(onReject, 600);
  };

  return (
    <div className="fixed inset-0 z-500 bg-gradient-to-b from-blue-50/10 via-purple-300/5 to-blue-600/10 backdrop-blur-[2px] flex items-center justify-center">
      <AnimatePresence custom={direction}>
        <motion.div
          key={report.Salesid}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative bg-white/90 rounded-xl shadow-2xl shadow-red-500/20 max-w-md w-full p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-blue-900 bg-blue-100 rounded-full px-2">Thread #{report.Salesid}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-red-500">
              <X size={20} />
            </button>
          </div>

          <p className="text-sm text-gray-700 mb-4">{report.notes}</p>

          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between"><span>Total Quantity</span><span>{report.totalQuantity}</span></div>
            <div className="flex justify-between"><span>Total Sales</span><span>QAR {report.totalSales.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Final Value</span><span>QAR {report.finalValue.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Submitted At</span><span>{new Date(report.submittedAt).toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Status</span><span className="capitalize">{report.status}</span></div>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold text-blue-800 mb-2"><span className="bg-blue-100 rounded-full px-2 py-1">Product Breakdown:</span></h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {report.data.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-md bg-gradient-to-br from-white my-2 to-blue-50/35 text-sm shadow shadow-blue-500/10 border border-blue-200/10"
                >
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-800">{item.productName}</span>
                    <span className="text-gray-600">x{item.quantitySold}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Sales: QAR {item.salesPrice.toFixed(2)}</span>
                    <span>Discount: {item.discountPercent}%</span>
                    <span>Final: QAR {item.finalPrice.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between gap-2 mt-6">
            <button
              onClick={handleRejectClick}
              className="flex-1 bg-gray-100/30 border border-red-700/20 text-red-700 font-semibold py-2 rounded-lg hover:bg-red-200/50 transition"
            >
              Reject
            </button>
            <button
              onClick={handleApproveClick}
              className="flex-1 border border-green-800/30 bg-gray-100/20 text-green-700 font-semibold py-2 rounded-lg hover:bg-green-200/50 transition"
            >
              Approve
            </button>
          </div>

          {/* Approved Overlay */}
          {showConfetti && (
            <div className="fixed inset-0 bg-radial from-green-300/10 via-transparent to-transparent flex items-center justify-center pointer-events-none">
              <div className="animate-stamp-in text-green-700/50 border-4 border-green-700/50 px-8 py-4 text-4xl font-extrabold uppercase tracking-widest rotate-[-15deg] rounded-md shadow-md bg-white/90">
                Approved
              </div>
            </div>
          )}

          {/* Rejected Overlay */}
          {showRejected && (
            <div className="fixed inset-0 bg-radial from-red-300/10 via-transparent to-transparent flex items-center justify-center pointer-events-none">
              <div className="animate-stamp-in text-red-700/50 border-4 border-red-700/50 px-8 py-4 text-4xl font-extrabold uppercase rotate-[-15deg] rounded-md shadow-md bg-white/90">
                Rejected
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ThreadDetailModal;
