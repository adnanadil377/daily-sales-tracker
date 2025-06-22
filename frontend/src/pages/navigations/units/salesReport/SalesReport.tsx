import PageContainer from "@/pages/components/pagecontainer/PageContainer";
import { retailPartners, type RetailPartner } from "../../../../../data";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { dailySalesReports, type DailySalesReport } from "../../../../../data"; // adjust import path

const SalesReport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const merchId = parseInt(id || "", 10);

  const partner: RetailPartner | undefined = retailPartners.find((p) => p.id === merchId);
  const partnerReports: DailySalesReport[] = dailySalesReports.filter(
    (report) => report.retailPartnerId === partner?.id
  );

  const navigate = useNavigate();

const handleRowClick = (report: DailySalesReport) => {
  navigate(`/units/merchandiser/${id}/sales/${report.Salesid}/dailysales`);
};

  if (!partner) {
    return <div className="p-4 text-red-600">No merchandiser found with ID: {id}</div>;
  }

  return (
    <PageContainer title={`Sales Report #${partner.id}`}>
      <div className="p-4">
        <h1 className="text-2xl border-l-2 pl-4 py-1 z-10 border-green-500 bg-gradient-to-r from-green-500/5 via-transparent to-transparent font-semibold rounded"> {partner.merchandiser}</h1>
        <p className="text-lg">
          <span className="text-xs">{partner.store}</span> –{" "}
          <span className="text-xs">{partner.location}</span>
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
            {partnerReports.map((report) => (
                <tr
                key={report.Salesid}
                onClick={() => handleRowClick(report)}
                className="hover:bg-gray-100 transition-colors cursor-pointer"
                >
                <td className="px-6 py-4 text-sm text-gray-700">SO #{report.Salesid}</td>
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
        {partnerReports.map((report) => (
            <div
            key={report.Salesid}
            onClick={() => handleRowClick(report)}
            className="p-4 rounded-xl shadow  shadow-red-500/10 bg-gradient-to-br from-white to-blue-50/35 transition hover:shadow-lg cursor-pointer"
            >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
                <h3 className="font-semibold text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">SO # {report.Salesid}</h3>
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
