import PageContainer from "@/pages/components/pagecontainer/PageContainer";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/axiosInstance";

type SalesReportData = {
  salesId: number;
  retailPartnerId: number;
  merchandiserName: string;
  reportDate: string;
  totalQuantity: number;
  totalSales: number;
  finalValue: number;
  status: 'pending' | 'approved' | 'rejected'; // Example statuses
};

type RetailPartner = {
  name: string;
  location: string;
};

const SalesReport: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

        // State for data, loading, and error handling
    const [reports, setReports] = useState<SalesReportData[]>([]);
    const [retail, setRetail] = useState<RetailPartner[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(()=>{
        if (!id) {
            setError("Partner ID is missing.");
            setLoading(false);
            return;
        }
        api.get("/sales/daily-sales-reports", {
        params: {
            retail_partner_id: id,
        },
        })
        .then(response => {
            setReports(response.data);
            setError(null);
        })
        .catch(error => {
            console.error("Failed to fetch sales reports:", error);
            setError(error.message || "An unknown error occurred.");
        })
        .finally(() => {
            setLoading(false);
        });
        api.get(`/sales/retail-partners/${id}`)
        .then(response => {
            setRetail(response.data);
            console.log(response.data);
            setError(null);
        })
        .catch(error => {
            console.error("Failed to fetch sales reports:", error);
            setError(error.message || "An unknown error occurred.");
        })
        .finally(() => {
            setLoading(false);
        });

    }, [id]);
    if (loading) {
        return <div className="p-4 text-center">Loading sales reports...</div>;
    }

    // 2. Handle Error State
    if (error) {
        return <div className="p-4 text-red-600 text-center">Error: {error}</div>;
    }

    // 3. Handle Empty State (No reports found for this partner)
    if (reports.length === 0) {
        return <div className="p-4 text-gray-600 text-center">No sales reports found for partner ID: {id}</div>;
    }
    
    // Navigate to the detailed view for a specific report
    const handleRowClick = (report: SalesReportData) => {
        // Use the `id` from the URL params for consistency
        navigate(`/units/merchandiser/${id}/sales/${report.salesId}/dailysales`);
    };
  return (
    <PageContainer title={`Sales Report #${reports[0]?.retailPartnerId}`}>
      <div className="p-4">
        <h1 className="text-2xl border-l-2 pl-4 py-1 z-10 border-green-500 bg-gradient-to-r from-gray-500/5 via-transparent to-transparent font-semibold rounded"> {reports[0].merchandiserName}</h1>
        <p className="text-lg">
          <span className="text-xs">{retail[0]?.name}</span> –{" "}
          <span className="text-xs">{retail[0]?.location}</span>
        </p>

        {/*Desktop Table */}
        <div className="mt-6 overflow-auto shadow-md rounded-md shadow-blue-500/15 hidden md:block">
        <table className="min-w-full">
            <thead className="bg-neutral-900 text-white">
            <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Sales ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Total QTY</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Total Sale</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Final Value</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
            {reports.map((report) => (
                <tr
                key={report.salesId}
                onClick={() => handleRowClick(report)}
                className="hover:bg-gray-100 transition-colors cursor-pointer"
                >
                <td className="px-6 py-4 text-sm text-gray-700">SO #{report.salesId}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                    {new Date(report.reportDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    })}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{report.totalQuantity}</td>
                <td className="px-6 py-4 text-sm text-gray-700">QAR {report.totalSales.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-700">QAR {report.finalValue.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-700 capitalize">{report.status}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
        {/*mobile view*/}
        <div className="md:hidden mt-6 space-y-4">
        {reports.map((report) => (
            <div
            key={report.salesId}
            onClick={() => handleRowClick(report)}
            className="p-4 rounded-xl shadow  shadow-red-500/10 bg-gradient-to-br from-white to-blue-50/35 transition hover:shadow-lg cursor-pointer"
            >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
                <h3 className="font-semibold text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">SO # {report.salesId}</h3>
                <span className="text-xs text-gray-500">
                {new Date(report.reportDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                })}
                </span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                <p className="mb-1">Total Qty:</p>
                <p className="font-semibold text-blue-700">{report.totalQuantity}</p>

                <p className="mt-2 mb-1">Total Sales:</p>
                <p className="font-semibold text-emerald-700">
                    QAR {report.totalSales.toFixed(2)}
                </p>
                </div>

                <div>
                <p className="mb-1">Final Value:</p>
                <p className="font-semibold text-gray-900">
                    QAR {report.finalValue.toFixed(2)}
                </p>

                <p className="mt-2 mb-1">Status:</p>
                <p className='capitalize'>
                    {report.status}
                </p>
                </div>
            </div>
            </div>
        ))}
        </div>


      </div>
    </PageContainer>
  );
};

export default SalesReport;
