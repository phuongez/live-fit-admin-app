"use client";

import { useState } from "react";
import ContractFilters from "./ContractFilters";
import ContractTable from "./ContractTable";
import CreateContractModal from "./CreateContractModal";

export default function ContractsPage() {
  const [filters, setFilters] = useState({
    code: "",
    customerName: "",
    phone: "",
    startDate: "",
    endDate: "",
    status: "ALL",
    payment: "ALL",
  });

  return (
    <div className="flex gap-6 ">
      <div className="w-70 max-w-sm p-4 bg-gray-50 border-r min-h-screen">
        <ContractFilters filters={filters} setFilters={setFilters} />
      </div>
      <div className="flex-1">
        <ContractTable filters={filters} />
      </div>

      <CreateContractModal />
    </div>
  );
}
