
import React, { useState } from "react";
import PageContainer from "@/pages/components/pagecontainer/PageContainer";

import { dailySalesReports } from "../../../../../data";
import ThreadDetailModal from "../ThreadModal/ThreadDetailModal";
import ThreadCard from "../ThreadCard/ThreadCard";

const ThreadsPage: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleApprove = () => {
    if (selectedIndex !== null && selectedIndex + 1 < filteredReports.length) {
      setSelectedIndex(selectedIndex + 1);
    } else {
      setSelectedIndex(null);
    }
  };

  const handleReject = () => {
    if (selectedIndex !== null && selectedIndex + 1 < filteredReports.length) {
      setSelectedIndex(selectedIndex + 1);
    } else {
      setSelectedIndex(null);
    }
  };

  const filteredReports = dailySalesReports.filter(
    (r) => r.status === "submitted"
  );

  return (
    <PageContainer title="Today's Threads">
        <div>
            <span className="border-l-2 border-green-500 bg-gradient-to-r from-gray-300/30 py-2 pl-2 to-transparent  rounded text-md text-neutral-700 font-medium">Your Daily Catch-Up</span>
        </div>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 p-4">
        {filteredReports.map((report, index) => (
          <ThreadCard
            key={report.Salesid}
            report={report}
            onClick={() => setSelectedIndex(index)}
          />
        ))}
      </div>
      {selectedIndex !== null && (
        <ThreadDetailModal
          key={selectedIndex}
          report={filteredReports[selectedIndex]}
          onClose={() => setSelectedIndex(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </PageContainer>
  );
};

export default ThreadsPage;
