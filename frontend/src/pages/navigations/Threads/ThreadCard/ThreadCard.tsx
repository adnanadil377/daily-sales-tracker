// ThreadCard.tsx
import React from "react";
import type { DailySalesReport } from "../../../../../data";

interface Props {
  report: DailySalesReport;
  onClick: () => void;
}

const ThreadCard: React.FC<Props> = ({ report, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white p-4 rounded-2xl shadow-md shadow-red-500/10 hover:shadow-lg hover:shadow-red-300/20 transition cursor-pointer overflow-hidden"
    >
      <div className="flex justify-between items-center border-b border-gray-600/20 pb-2 mb-2">
        <h3 className="font-bold text-gray-600 text-sm bg-blue-100 rounded-full px-2">Thread #{report.Salesid}</h3>
        <span className="text-xs text-gray-500">
          {new Date(report.reportDate).toLocaleDateString("en-US", {
            year: "2-digit",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>

      <div className="text-gray-600/90 space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Total Qty:</span>
          <span className="font-semibold text-gray-600">{report.totalQuantity}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Sales:</span>
          <span className="font-semibold text-gray-600">QAR {report.totalSales.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Final Value:</span>
          <span className="font-semibold text-blue-900">QAR {report.finalValue.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Status:</span>
          <span className="capitalize text-gray-500">{report.status}</span>
        </div>
      </div>
    </div>
  );
};

export default ThreadCard;
