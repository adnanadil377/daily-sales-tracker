import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageContainer from "@/pages/components/pagecontainer/PageContainer";
import api from "@/axiosInstance";
interface RetailPartner {
  name: string;
  location: string;
}
interface DailySalesReport {
  Salesid: number;
  data:DailySalesItem[];
  merchandiserId: number;
  merchandiserName: string;
  retailPartnerId: number;
  totalQuantity: number;
  totalSales: number;
  finalValue: number;
  reportDate: Date; // ISO date string: "YYYY-MM-DD"
  status: 'submitted' | 'pending' | 'approved';
  notes: string;
  submittedAt: string; // ISO date-time string
}

interface DailySalesItem {
  productId: number;
  productName: string;
  quantitySold: number;
  salesPrice: number;
  discountPercent: number;
  finalPrice: number;
}


const DailySalesPage: React.FC = () => {
  const { partnerId, reportId } = useParams<{ partnerId: string; reportId: string }>();
  const [reports, setReports] = useState<DailySalesReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retail, setRetail] = useState<RetailPartner[]>([]);
  
  useEffect(()=>{
    if(!partnerId || !reportId){
        setError("Partner ID is missing.");
        setLoading(false);
        return;
    }
    api.get("/sales/daily-sales-reports", {
        params: {
            saleid: reportId,
        },
    })
      .then(response=>{
        console.log(response.data)
        setReports(response.data);
        setError(null);
      })
      .catch(error=>{
        console.error("Failed to fetch sales reports:", error);
        setError(error.message || "An unknown error occurred.");
      })
      .finally(()=>{
        setLoading(false);
    })
    api.get(`/sales/retail-partners/${partnerId}`)
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
  },[])
  if (loading) {
        return <div className="p-4 text-center">Loading sales reports...</div>;
    }
  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  const formattedDate = new Date(reports[0]?.reportDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <PageContainer title={`Sales Report – ${formattedDate}`}>
      <div className="p-4 space-y-4">
        <div>
          <h2 className="text-xl font-semibold border-l-2 pl-4 py-1 border-green-500 bg-gradient-to-r from-gray-500/5 to-transparent rounded">
            {reports[0]?.merchandiserName}
          </h2>
          <p className="text-sm text-gray-600">{retail[0]?.name} – {retail[0]?.location}</p>
          <p className="text-sm text-gray-500">
            Status: <span className="capitalize">{reports[0]?.status}</span>
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-auto shadow-md rounded-md shadow-blue-500/15">
          <table className="min-w-full table-auto bg-white divide-y divide-gray-200">
            <thead className="bg-neutral-900 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Qty</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Discount %</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Final SP</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Total Sales</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports[0]?.data.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-sm text-gray-700">{item.productName}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{item.quantitySold}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">QAR {item.salesPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{item.discountPercent}%</td>
                  <td className="px-6 py-4 text-sm text-gray-700">QAR {item.finalPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">QAR {(item.salesPrice * item.quantitySold * (1 - item.discountPercent / 100)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-4">
          {reports[0]?.data.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-xl shadow shadow-red-500/10 bg-gradient-to-br from-white to-blue-50/35 transition hover:shadow-lg"
            >
              <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
                <h3 className="font-semibold text-gray-800 text-base">{item.productName}</h3>
                <div className="text-sm text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full font-medium">
                  QTY: {item.quantitySold}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <p className="mb-1">Price:</p>
                  <p className="font-semibold text-gray-900">QAR {item.salesPrice.toFixed(2)}</p>

                  <p className="mt-2 mb-1">Final SP:</p>
                  <p className="font-semibold text-gray-900">QAR {item.finalPrice.toFixed(2)}</p>
                </div>

                <div>
                  <p className="mb-1">Discount:</p>
                  <p className="font-semibold text-amber-600">{item.discountPercent}%</p>

                  <p className="mt-2 mb-1">Total Sales:</p>
                  <p className="font-semibold text-blue-800">
                    QAR {(item.salesPrice * item.quantitySold * (1 - item.discountPercent / 100)).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>


        {/* Totals */}
        <div className="mt-6 text-right text-sm text-gray-700">
          <p>
            Total Quantity: <strong>{reports[0]?.data.reduce((total, item) => total + item.quantitySold, 0)}</strong>
          </p>
          <p>
            Total Sales: <strong>QAR {reports[0]?.data.reduce((total, item) => total + item.quantitySold * item.salesPrice, 0).toFixed(2)}</strong>
          </p>
          <p>
            Final Value: <strong>QAR {reports[0]?.data.reduce((total, item) => total + item.quantitySold * item.salesPrice * (1 - item.discountPercent / 100), 0).toFixed(2)}</strong>
          </p>
        </div>
      </div>
    </PageContainer>
  );
};

export default DailySalesPage;