import { useState } from "react";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import CustomerDetailModal from "./CustomerDetailModal";

export default function CustomerTable({ customers, page, setPage, totalPages }) {
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Tên khách hàng</TableHead>
                        <TableHead>Số điện thoại</TableHead>
                        <TableHead>Chi nhánh</TableHead>
                        <TableHead>HLV phụ trách</TableHead>
                        <TableHead>Ngày tạo</TableHead>
                        <TableHead>Trạng thái</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {customers.map((c) => (
                        <TableRow
                            key={c.id}
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => setSelectedCustomer(c)}
                        >
                            <TableCell className="font-semibold text-blue-600">
                                {c.fullName}
                            </TableCell>
                            <TableCell>{c.zaloPhone || "-"}</TableCell>
                            <TableCell>{c.branch?.name}</TableCell>
                            <TableCell>{c.careCoach?.fullName || "-"}</TableCell>
                            <TableCell>
                                {new Date(c.createdAt).toLocaleDateString("vi-VN")}
                            </TableCell>
                            <TableCell>
                                <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded">
                                    {c.stage}
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Phân trang */}
            <div className="flex justify-between mt-4">
                <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    Trang trước
                </Button>
                <span>
                    Trang {page} / {totalPages}
                </span>
                <Button
                    variant="outline"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                >
                    Trang sau
                </Button>
            </div>

            {/* Modal chi tiết khách hàng */}
            {/* <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogTitle>Chi tiết khách hàng</DialogTitle>
                    {selectedCustomer && (
                        <div className="space-y-3 mt-4">
                            <p><strong>Họ tên:</strong> {selectedCustomer.fullName}</p>
                            <p><strong>Ngày sinh:</strong> {selectedCustomer.dateOfBirth}</p>
                            <p><strong>Giới tính:</strong> {selectedCustomer.gender}</p>
                            <p><strong>Địa chỉ:</strong> {selectedCustomer.currentAddress}</p>
                            <p><strong>Chi nhánh:</strong> {selectedCustomer.branch?.name}</p>
                            <p><strong>Trạng thái:</strong> {selectedCustomer.stage}</p>
                        </div>
                    )}
                </DialogContent>
            </Dialog> */}
            <CustomerDetailModal
                selectedCustomer={selectedCustomer}
                setSelectedCustomer={setSelectedCustomer}
            />
        </>
    );
}
