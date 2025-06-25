import React, { useState } from "react";
import PageContainer from "@/pages/components/pagecontainer/PageContainer";
import { retailPartners } from "../../../../data";
import type { RetailPartner } from "../../../../data";
import { useNavigate } from "react-router-dom";
import Modal from "@/pages/components/Modal/Modal";

const Units: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate( );
  const handleRowClick = (partner: RetailPartner)=>{
    navigate(`/units/merchandiser/${partner.id}/sales`)
  }

  return (
    <PageContainer title="Retail Partner">
      <div className="p-4">
        <div className="flex py-2 rounded-xl mb-4 justify-between">
          <div className="text-lg font-semibold text-neutral-800 tracking-tight border-l-2 border-green-500 bg-gradient-to-r from-gray-500/5 to-transparent rounded-lg py-2 pl-4">
            All Partners {" "}
            <span className="">
              # {retailPartners.length}
            </span>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-0.5 border bg-black text-white rounded-lg hover:bg-gray-200 hover:text-black"
          >
            Add
          </button>
        </div>

        {/* Modal Section */}
        <Modal
         isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 className="text-lg font-semibold mb-4">Add New Partner</h2>
          {/* Your form inputs can go here */}
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Merchandiser"
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Store Name"
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Location"
              className="w-full border px-3 py-2 rounded"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
          </form>
        </Modal>
      </div>
        <div className="mt-6 overflow-auto shadow-md rounded-md shadow-blue-500/15 hidden md:block">
          <table className="w-full">
            <thead className="bg-neutral-900 text-white shadow-red-600">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Merchandiser
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Retail Store
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Location
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {retailPartners.map((partner: RetailPartner) => (
                <tr
                  key={partner.id}
                  className="hover:bg-gray-100 transition-colors"
                  onClick={() => handleRowClick(partner)}
                >
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {partner.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {partner.merchandiser}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {partner.store}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {partner.location}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          {/* Mobile View*/}
        <div className="md:hidden mt-6 space-y-5">
          {retailPartners.map((partner: RetailPartner) => (
            <div
              key={partner.id}
              onClick={() => handleRowClick(partner)}
              className="bg-gradient-to-br from-white to-blue-50/35 rounded-2xl p-4 shadow-sm shadow-red-500/10 hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              {/* Header Section */}
              <div className="flex items-center justify-between mb-3 py-2 border-b ">
                <div className="text-xs text-blue-600 font-semibold bg-blue-100 px-2 py-1 rounded-full">
                  Store ID: {partner.id}
                </div>
                <div className="text-sm font-bold text-gray-800 truncate">
                  {partner.store}
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-700">
                {/* Merchandiser */}
                <div>
                  <div className="text-gray-500 font-medium"> Merchandiser</div>
                  <div className="font-semibold truncate">{partner.merchandiser}</div>
                </div>

                {/* Location */}
                <div>
                  <div className="text-gray-500 font-medium">📍 Location</div>
                  <div className="font-semibold">{partner.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

    </PageContainer>
  );
};

export default Units;
