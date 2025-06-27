import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageContainer from "@/pages/components/pagecontainer/PageContainer";
import api from "@/axiosInstance";


interface StoreInventory {
  retailPartnerId: number;
  storeName: string;
  products: InventoryDetail[];
}
interface InventoryDetail {
  productId: number;
  productName: string;
  category: string;
  quantity: number;
  unitSellingPrice: number;
  totalValue: number;
}

const RetailorInventorySales: React.FC = () => {
  const { retailPartnerId } = useParams<{ retailPartnerId: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [storeInventory, setStoreInventory] = useState<StoreInventory[]>([]);


  useEffect(()=>{
    if(!retailPartnerId){
      setError("Partner ID is missing.");
      setLoading(false);
      return;
    }
    setLoading(true);
    api.get(`/sales/inventory/${retailPartnerId}`)
      .then((response) => {
        console.log(response.data);
        setStoreInventory(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error("Failed to fetch sales reports:", error);
        setError(error.message || "An unknown error occurred.");
      })
      .finally(() => {
        setLoading(false);
      })
  },[])
  if (loading) {
        return <div className="p-4 text-center">Loading sales reports...</div>;
    }
  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }
  return (
    <PageContainer title="Inventory Overview">
      <div className="p-4 space-y-4 ">
        {/* Header */}
        <div className="hidden md:block">
          <h2 className="text-xl font-semibold border-l-2 pl-4 py-1 border-green-500 bg-gradient-to-r from-gray-500/5 to-transparent rounded">
            {storeInventory[0]?.storeName}
          </h2>
          <p className="text-sm text-gray-600 pt-2">Total Products: {storeInventory[0].products.length}</p>
        </div>
        <div className="md:hidden flex justify-between border-l-2 pl-4 pb-4 border-green-500 bg-gradient-to-r from-gray-500/5 to-transparent rounded">
            <div className="mt-6 text-sm text-gray-700">
                <h2 className="text-xl font-semibold">
            {storeInventory[0].storeName}
          </h2>
          <p>
            Total Quantity:{" "}
            <strong>
              {storeInventory[0].products.reduce((total, p) => total + p.quantity, 0)}
            </strong>
          </p>
          <p>
            Total Inventory Value:{" "}
            <strong>
              QAR{" "}
              {storeInventory[0].products
                .reduce((total, p) => total + p.totalValue, 0)
                .toFixed(2)}
            </strong>
          </p>
        </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-auto shadow-md rounded-md shadow-blue-500/15">
          <table className="min-w-full table-auto bg-white divide-y divide-gray-200">
            <thead className="bg-neutral-900 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Qty</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Unit Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Total Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {storeInventory[0].products.map((product, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-sm text-gray-700">{product.productName}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{product.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{product.quantity}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-semibold">QAR {product.unitSellingPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-blue-900 font-bold">QAR {product.totalValue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {storeInventory[0].products.map((product, index) => (
            <div
              key={index}
              className="p-4 rounded-xl shadow shadow-red-500/10 bg-gradient-to-br from-white to-blue-50/30 transition hover:shadow-md"
            >
              <div className="grid grid-cols-2 justify-between items-center border-b border-gray-200 pb-2 mb-2">
                <h3 className="font-semibold text-gray-800 text-base">{product.productName}</h3>
                <div className="text-sm text-blue-700 text-center bg-blue-100 px-2 py-0.5 rounded-full font-medium">
                  QTY: {product.quantity}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <p className="mb-1">Category:</p>
                  <p className="font-semibold text-gray-900">{product.category}</p>

                  <p className="mt-2 mb-1">Unit Price:</p>
                  <p className="font-semibold text-blue-900">QAR {product.unitSellingPrice.toFixed(2)}</p>
                </div>

                <div>
                  <p className="mb-1">Total Value:</p>
                  <p className="font-bold text-green-900">
                    QAR {product.totalValue.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-6 text-right text-sm text-gray-700 hidden md:block">
          <p>
            Total Quantity:{" "}
            <strong>
              {storeInventory[0].products.reduce((total, p) => total + p.quantity, 0)}
            </strong>
          </p>
          <p>
            Total Inventory Value:{" "}
            <strong>
              QAR{" "}
              {storeInventory[0].products
                .reduce((total, p) => total + p.totalValue, 0)
                .toFixed(2)}
            </strong>
          </p>
        </div>
      </div>
    </PageContainer>
  );
};

export default RetailorInventorySales;
