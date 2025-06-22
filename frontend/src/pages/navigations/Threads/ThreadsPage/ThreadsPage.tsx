import React, { useMemo, useState, useCallback } from "react";
import PageContainer from "@/pages/components/pagecontainer/PageContainer";
import { dailySalesReports } from "../../../../../data";
import ThreadDetailModal from "../ThreadModal/ThreadDetailModal";
import ThreadCard from "../ThreadCard/ThreadCard";

const ThreadsPage: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [transitionDirection, setTransitionDirection] = useState<"left" | "right">("right");

  const submittedReports = useMemo(
    () => dailySalesReports.filter((report) => report.status === "submitted"),
    []
  );

  const goToNextOrClose = useCallback(() => {
    setSelectedIndex((prevIndex) => {
      if (prevIndex === null) return null;
      const nextIndex = prevIndex + 1;
      if (nextIndex < submittedReports.length) {
        setTransitionDirection("right");
        return nextIndex;
      }
      return null;
    });
  }, [submittedReports]);

  const handleApprove = useCallback(() => {
    goToNextOrClose();
  }, [goToNextOrClose]);

  const handleReject = useCallback(() => {
    goToNextOrClose();
  }, [goToNextOrClose]);

  const handleCardClick = useCallback((index: number) => {
    setTransitionDirection(index < selectedIndex! ? "left" : "right");
    setSelectedIndex(index);
  }, [selectedIndex]);

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
            key={report.Salesid}
            report={report}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>

      {selectedIndex !== null && submittedReports[selectedIndex] && (
        <ThreadDetailModal
          key={submittedReports[selectedIndex].Salesid}
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
