import PageContainer from "@/pages/components/pagecontainer/PageContainer";
import { inventories } from "../../../../data";
import { useNavigate } from "react-router-dom";
import type { InventoryItem } from "data";

const InventorySummary = ({ inventories }: { inventories: InventoryItem[] }) => {
  const totalQuantity = inventories.reduce((total, p) => total + p.totalQuantity, 0);
  const totalValue = inventories.reduce((total, p) => total + p.totalValue, 0).toFixed(2);

  return (
    <div className="p-4 text-sm  border-b text-">
      <p >
        Total Quantity: <strong className="text-blue-900">{totalQuantity}</strong>
      </p>
      <p>
        Total Inventory Value: <strong className="text-blue-900">QAR {totalValue}</strong>
      </p>
    </div>
  );
};

const MobileInventoryCard = ({
  item,
  onClick,
}: {
  item: InventoryItem;
  onClick: (retailPartnerId: number) => void;
}) => (
  <div
    className="p-4 rounded-xl shadow shadow-red-500/10 bg-gradient-to-br from-white to-blue-50/30 transition hover:shadow-md cursor-pointer"
    onClick={() => onClick(item.retailPartnerId)}
  >
    <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
      <h3 className="font-semibold text-gray-800 text-base">{item.storeName}</h3>
      <div className="text-sm text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full font-medium">
        QTY: {item.totalQuantity}
      </div>
    </div>

    <div className="text-sm text-gray-700">
      <p className="mb-1">Retail Partner ID:</p>
      <p className="font-semibold text-gray-900">{item.retailPartnerId}</p>

      <p className="mt-2 mb-1">Inventory Value:</p>
      <p className="font-bold text-blue-800">QAR {item.totalValue.toFixed(2)}</p>
    </div>
  </div>
);

const Inventory = () => {
  const navigate = useNavigate();

  const handleRowClick = (retailPartnerId: number) => {
    navigate(`/inventory/retailor/${retailPartnerId}/sales`);
  };

  return (
    <PageContainer title="Inventory">
      {/* Mobile Summary */}
      <div className="mt-6 md:hidden">
        <InventorySummary inventories={inventories} />
      </div>

      {/* Desktop Table */}
      <div className="mt-6 overflow-auto shadow-md rounded-md shadow-blue-500/15 hidden md:block">
        <table className="min-w-full bg-white">
          <thead className="bg-neutral-900 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium">Retail Partner ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Store</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Quantity</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Inventory Value</th>
            </tr>
          </thead>
          <tbody>
            {inventories.map((item) => (
              <tr
                key={item.retailPartnerId}
                className="hover:bg-gray-100 transition-colors border-b cursor-pointer"
                onClick={() => handleRowClick(item.retailPartnerId)}
              >
                <td className="px-6 py-4 text-sm text-gray-700">{item.retailPartnerId}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{item.storeName}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{item.totalQuantity}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{item.totalValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4 mt-6 px-4">
        {inventories.map((item) => (
          <MobileInventoryCard key={item.retailPartnerId} item={item} onClick={handleRowClick} />
        ))}
      </div>

      {/* Desktop Summary */}
      <div className="mt-6 text-right hidden md:block">
        <InventorySummary inventories={inventories} />
      </div>
    </PageContainer>
  );
};

export default Inventory;
