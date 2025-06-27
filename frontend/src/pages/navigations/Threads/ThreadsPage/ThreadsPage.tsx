import React, { useMemo, useState, useCallback, useEffect } from "react";
import PageContainer from "@/pages/components/pagecontainer/PageContainer";
import ThreadDetailModal from "../ThreadModal/ThreadDetailModal";
import ThreadCard from "../ThreadCard/ThreadCard";
import api from "@/axiosInstance";

// --- TYPE DEFINITIONS (Corrected 'salesId') ---
export interface DailySalesReport {
  salesId: number; // CORRECTED: from 'Salesid' to 'salesId' to match API response
  data: DailySalesItem[];
  merchandiserId: number;
  retailPartnerId: number;
  totalQuantity: number;
  totalSales: number;
  finalValue: number;
  reportDate: string;
  status: 'submitted' | 'pending' | 'approved' | 'rejected';
  notes: string;
  submittedAt: string;
}

export interface DailySalesItem {
  productId: number;
  productName: string;
  quantitySold: number;
  salesPrice: number;
  discountPercent: number;
  finalPrice: number;
}

const ThreadsPage: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [transitionDirection, setTransitionDirection] = useState<"left" | "right">("right");
  const [submittedReports, setSubmittedReports] = useState<DailySalesReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- DATA FETCHING (Optimized to get only 'submitted' reports) ---
  useEffect(() => {
    setLoading(true);
    // Let the backend do the filtering for efficiency
    api.get("/sales/daily-sales-reports", {
        params: { status: 'submitted' }
    })
      .then(response => {
        setSubmittedReports(response.data);
      })
      .catch(err => {
        console.error("Failed to fetch threads:", err);
        setError(err.response?.data?.detail || err.message || "An unknown error occurred.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); // Runs once on component mount

  const goToNextOrClose = useCallback(() => {
    setSelectedIndex((prevIndex) => {
      if (prevIndex === null) return null;
      // If there are still items left after this one, go to the next. Otherwise, close.
      const nextIndex = prevIndex < submittedReports.length - 1 ? prevIndex : null;
      setTransitionDirection("right");
      return nextIndex;
    });
  }, [submittedReports]);

  // --- API INTERACTION LOGIC ---
  const updateReportStatus = async (reportId: number, status: 'approved' | 'rejected') => {
    try {
      await api.patch(`/sales/daily-sales-reports/${reportId}`, { status });
      // On success, remove the report from the local state to update the UI
      setSubmittedReports(prevReports => prevReports.filter(report => report.salesId !== reportId));
      goToNextOrClose();
    } catch (err: any) {
      console.error(`Failed to ${status} report:`, err);
      // Let the user know something went wrong
      alert(`Error: Could not ${status} the report. Please try again.`);
    }
  };
  
  const handleApprove = useCallback(() => {
    if (selectedIndex === null) return;
    const reportToUpdate = submittedReports[selectedIndex];
    if (reportToUpdate) {
      updateReportStatus(reportToUpdate.salesId, 'approved');
    }
  }, [selectedIndex, submittedReports]);

  const handleReject = useCallback(() => {
    if (selectedIndex === null) return;
    const reportToUpdate = submittedReports[selectedIndex];
    if (reportToUpdate) {
      updateReportStatus(reportToUpdate.salesId, 'rejected');
    }
  }, [selectedIndex, submittedReports]);

  const handleCardClick = useCallback((index: number) => {
    setTransitionDirection(index < (selectedIndex ?? -1) ? "left" : "right");
    setSelectedIndex(index);
  }, [selectedIndex]);

  if (loading) {
    return <div className="p-4 text-center">Loading sales reports...</div>;
  }
  if (error) {
    return <div className="p-4 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <PageContainer title="Today's Threads">
      <div>
        <span className="border-l-2 border-green-500 bg-gradient-to-r from-gray-300/30 py-2 pl-2 to-transparent rounded text-md text-neutral-700 font-medium">
          Your Daily Catch-Up
        </span>
      </div>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 p-4">
        {submittedReports.map((report, index) => (
          <ThreadCard
            key={report.salesId} // CORRECTED: Use corrected salesId
            report={report}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>

      {selectedIndex !== null && submittedReports[selectedIndex] && (
        <ThreadDetailModal
          key={submittedReports[selectedIndex].salesId} // CORRECTED: Use corrected salesId
          report={submittedReports[selectedIndex]}
          direction={transitionDirection}
          onClose={() => setSelectedIndex(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </PageContainer>
  );
};

export default ThreadsPage;