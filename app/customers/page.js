"use client";

import { useState, useEffect } from "react";
import CustomerFilters from "./components/CustomerFilters";
import CustomerTable from "./components/CustomerTable";
import { Input } from "@/components/ui/input";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    gender: "ALL",
    status: "ALL",
    serviceStatus: "ALL",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchCustomers = async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        gender: filters.gender,
        status: filters.status,
        serviceStatus: filters.serviceStatus,
      });
      const res = await fetch(`/api/customers?${params}`);
      const data = await res.json();
      setCustomers(data.customers || []);
      setTotalPages(data.totalPages || 1);
    };

    fetchCustomers();
  }, [page, search, filters]);

  return (
    <div className="flex">
      {/* Bộ lọc bên trái */}
      <div className="w-64 border-r bg-gray-50 p-4">
        <CustomerFilters filters={filters} setFilters={setFilters} />
      </div>

      {/* Bảng danh sách khách hàng */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Danh sách khách hàng</h1>
          <Input
            placeholder="Tìm theo tên hoặc số điện thoại..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-80"
          />
        </div>

        <CustomerTable
          customers={customers}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}



// "use client";

// import { useEffect, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { format } from "date-fns";

// export default function CustomerPage() {
//   const [customers, setCustomers] = useState([]);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // Fetch danh sách khách hàng
//   useEffect(() => {
//     const fetchCustomers = async () => {
//       const res = await fetch("/api/customers");
//       const data = await res.json();
//       setCustomers(data);
//       setLoading(false);
//     };
//     fetchCustomers();
//   }, []);

//   const handleChange = (field, value) => {
//     setSelectedCustomer((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSave = async () => {
//     if (!selectedCustomer) return;

//     const confirmed = window.confirm("Bạn có chắc muốn lưu thay đổi?");
//     if (!confirmed) return;

//     await fetch(`/api/customers/${selectedCustomer.id}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(selectedCustomer),
//     });

//     alert("✅ Cập nhật thành công!");
//     setShowModal(false);
//   };

//   if (loading) return <p className="p-6">Đang tải dữ liệu...</p>;

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-2xl font-bold mb-4">Danh sách khách hàng</h1>

//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Mã KH</TableHead>
//             <TableHead>Họ tên</TableHead>
//             <TableHead>Chi nhánh</TableHead>
//             <TableHead>Trạng thái</TableHead>
//             <TableHead>Người phụ trách</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {customers.map((c) => (
//             <TableRow key={c.id}>
//               <TableCell>{c.code}</TableCell>
//               <TableCell>
//                 <button
//                   onClick={() => {
//                     setSelectedCustomer(c);
//                     setShowModal(true);
//                   }}
//                   className="text-blue-600 hover:underline"
//                 >
//                   {c.fullName}
//                 </button>
//               </TableCell>
//               <TableCell>{c.branch?.name}</TableCell>
//               <TableCell>{c.stage}</TableCell>
//               <TableCell>{c.careCoach?.fullName || "—"}</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       {/* Modal chi tiết khách hàng */}
//       <Dialog open={showModal} onOpenChange={setShowModal}>
//         <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Chi tiết khách hàng</DialogTitle>
//           </DialogHeader>

//           {selectedCustomer && (
//             <div className="grid grid-cols-2 gap-4 mt-4">
//               {/* Cột 1 */}
//               <div className="flex flex-col gap-3">
//                 <div>
//                   <Label>Họ và tên</Label>
//                   <Input
//                     value={selectedCustomer.fullName || ""}
//                     onChange={(e) => handleChange("fullName", e.target.value)}
//                   />
//                 </div>

//                 <div>
//                   <Label>Ngày sinh</Label>
//                   <Input
//                     type="date"
//                     value={
//                       selectedCustomer.dateOfBirth
//                         ? selectedCustomer.dateOfBirth.split("T")[0]
//                         : ""
//                     }
//                     onChange={(e) =>
//                       handleChange("dateOfBirth", e.target.value)
//                     }
//                   />
//                 </div>

//                 <div>
//                   <Label>Giới tính</Label>
//                   <Select
//                     value={selectedCustomer.gender || ""}
//                     onValueChange={(val) => handleChange("gender", val)}
//                   >
//                     <SelectTrigger>
//                       {selectedCustomer.gender || "Chọn giới tính"}
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="male">Nam</SelectItem>
//                       <SelectItem value="female">Nữ</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div>
//                   <Label>Số CCCD</Label>
//                   <Input
//                     value={selectedCustomer.nationalId || ""}
//                     onChange={(e) => handleChange("nationalId", e.target.value)}
//                   />
//                 </div>

//                 <div>
//                   <Label>Chiều cao (cm)</Label>
//                   <Input
//                     type="number"
//                     value={selectedCustomer.height || ""}
//                     onChange={(e) => handleChange("height", e.target.value)}
//                   />
//                 </div>

//                 <div>
//                   <Label>Cân nặng (kg)</Label>
//                   <Input
//                     type="number"
//                     value={selectedCustomer.weight || ""}
//                     onChange={(e) => handleChange("weight", e.target.value)}
//                   />
//                 </div>
//               </div>

//               {/* Cột 2 */}
//               <div className="flex flex-col gap-3">
//                 <div>
//                   <Label>Số điện thoại Zalo</Label>
//                   <Input
//                     value={selectedCustomer.zaloPhone || ""}
//                     onChange={(e) => handleChange("zaloPhone", e.target.value)}
//                   />
//                 </div>

//                 <div>
//                   <Label>Nhu cầu</Label>
//                   <Input
//                     value={selectedCustomer.needs || ""}
//                     onChange={(e) => handleChange("needs", e.target.value)}
//                   />
//                 </div>

//                 <div>
//                   <Label>Nguồn khách hàng</Label>
//                   <Select
//                     value={selectedCustomer.source || ""}
//                     onValueChange={(val) => handleChange("source", val)}
//                   >
//                     <SelectTrigger>
//                       {selectedCustomer.source || "Chọn nguồn"}
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="REFERRAL">Giới thiệu</SelectItem>
//                       <SelectItem value="WALKIN">Khách vãng lai</SelectItem>
//                       <SelectItem value="ONLINE">Online</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div>
//                   <Label>Địa chỉ hiện tại</Label>
//                   <Textarea
//                     value={selectedCustomer.currentAddress || ""}
//                     onChange={(e) =>
//                       handleChange("currentAddress", e.target.value)
//                     }
//                   />
//                 </div>

//                 <div>
//                   <Label>Ghi chú</Label>
//                   <Textarea
//                     value={selectedCustomer.notes || ""}
//                     onChange={(e) => handleChange("notes", e.target.value)}
//                   />
//                 </div>

//                 <div className="pt-2">
//                   <Button
//                     onClick={handleSave}
//                     className="bg-[#ffc634ff] text-black hover:opacity-90"
//                   >
//                     Lưu thay đổi
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
