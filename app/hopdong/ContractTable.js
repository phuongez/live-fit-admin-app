"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ContractTable({ filters }) {
    const [contracts, setContracts] = useState([]);

    useEffect(() => {
        // Gọi API thật trong dự án
        const fetchContracts = async () => {
            const params = new URLSearchParams(filters);
            const res = await fetch(`/api/contracts?${params}`);
            const data = await res.json();
            setContracts(data);
        };
        fetchContracts();
    }, [filters]);

    return (
        <Card className="flex-1 border-0 shadow-none">
            <div className="flex justify-between items-center p-4 ">
                <h2 className="text-xl font-semibold">Danh sách hợp đồng</h2>
                <Button size="sm" onClick={() => window.dispatchEvent(new CustomEvent("open-create-contract"))}>
                    + Tạo hợp đồng mới
                </Button>
            </div>

            <CardContent className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Số HĐ</TableHead>
                            <TableHead>Ngày tạo</TableHead>
                            <TableHead>Khách hàng</TableHead>
                            <TableHead>Điện thoại</TableHead>
                            <TableHead>Tổng giá trị</TableHead>
                            <TableHead>Tổng buổi</TableHead>
                            <TableHead>Còn lại</TableHead>
                            <TableHead>Ngày hết hạn</TableHead>
                            <TableHead>Phân loại</TableHead>
                            <TableHead>Người chăm sóc</TableHead>
                            <TableHead>Dư nợ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contracts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={11} className="text-center text-muted-foreground">
                                    Không có dữ liệu
                                </TableCell>
                            </TableRow>
                        ) : (
                            contracts.map((c) => (
                                <TableRow key={c.id} className="cursor-pointer hover:bg-muted/30">
                                    <TableCell>{c.code}</TableCell>
                                    <TableCell>{new Date(c.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>{c.primaryCustomer?.fullName}</TableCell>
                                    <TableCell>{c.primaryCustomer?.zaloPhone || "-"}</TableCell>
                                    <TableCell>
                                        {(Number(c.pricePerSession) * c.totalSessions).toLocaleString()}₫
                                    </TableCell>
                                    <TableCell>{c.totalSessions}</TableCell>
                                    <TableCell>{c.remaining}</TableCell>
                                    <TableCell>
                                        {c.endDate ? new Date(c.endDate).toLocaleDateString() : "-"}
                                    </TableCell>
                                    <TableCell>{c.orderType || "-"}</TableCell>
                                    <TableCell>{c.serviceCoach?.fullName || "-"}</TableCell>
                                    <TableCell>{c.debt?.toLocaleString() || "0"}₫</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
