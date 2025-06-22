import ComingSoon from "@/pages/components/comingsoon/comingSoon"
import PageContainer from "@/pages/components/pagecontainer/PageContainer"

const Inventory = () => {
  return (
    <PageContainer title="Inventory">
        <div className="mt-6 overflow-auto shadow-md rounded-md ">
          <table className="w-full">
            <thead className=" bg-neutral-900 text-white shadow-red-600">
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Product ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Product Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">QTY</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Selling Price</th>
            </thead>
            <tbody>
              <td className="px-6 py-4 text-sm text-gray-700">10001</td>
              <td className="px-6 py-4 text-sm text-gray-700">10001</td>
              <td className="px-6 py-4 text-sm text-gray-700">10001</td>
              <td className="px-6 py-4 text-sm text-gray-700">10001</td>
            </tbody>
          </table>
        </div>
    </PageContainer>
  )
}

export default Inventory