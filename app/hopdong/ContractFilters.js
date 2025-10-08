"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function ContractFilters({ filters, setFilters }) {
    const handleChange = (field, value) =>
        setFilters((prev) => ({ ...prev, [field]: value }));

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold">Bộ lọc hợp đồng</h2>

            {/* Số hợp đồng */}
            <div>
                <Label>Số hợp đồng</Label>
                <Input
                    placeholder="Nhập mã hợp đồng..."
                    value={filters.code || ""}
                    onChange={(e) => handleChange("code", e.target.value)}
                    className="mt-2"
                />
            </div>

            {/* Tên khách hàng */}
            <div>
                <Label>Tên khách hàng</Label>
                <Input
                    placeholder="Nhập tên..."
                    value={filters.customerName || ""}
                    onChange={(e) => handleChange("customerName", e.target.value)}
                    className="mt-2"
                />
            </div>

            {/* Số điện thoại */}
            <div>
                <Label>Số điện thoại</Label>
                <Input
                    placeholder="Nhập số điện thoại..."
                    value={filters.phone || ""}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="mt-2"
                />
            </div>

            {/* Thời gian tạo */}
            <div>
                <Label>Thời gian tạo</Label>
                <div className="flex items-center gap-2 mt-2">
                    <Input
                        type="date"
                        value={filters.startDate || ""}
                        onChange={(e) => handleChange("startDate", e.target.value)}
                    />
                    <span>-</span>
                    <Input
                        type="date"
                        value={filters.endDate || ""}
                        onChange={(e) => handleChange("endDate", e.target.value)}
                    />
                </div>
            </div>

            {/* Trạng thái hợp đồng */}
            <div>
                <Label className="font-semibold">Trạng thái hợp đồng</Label>
                <div className="flex gap-2 mt-2 flex-wrap">
                    {["ALL", "ACTIVE", "FROZEN", "EXHAUSTED", "CANCELLED"].map((val) => (
                        <Button
                            key={val}
                            size="sm"
                            variant={filters.status === val ? "default" : "outline"}
                            onClick={() => handleChange("status", val)}
                        >
                            {val === "ALL"
                                ? "Tất cả"
                                : val === "ACTIVE"
                                    ? "Hoạt động"
                                    : val === "FROZEN"
                                        ? "Bảo lưu"
                                        : val === "EXHAUSTED"
                                            ? "Hết buổi"
                                            : "Huỷ"}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Hình thức thanh toán */}
            <div>
                <Label className="font-semibold">Hình thức thanh toán</Label>
                <div className="flex gap-2 mt-2 flex-wrap">
                    {["ALL", "CASH", "BANK_TRANSFER"].map((val) => (
                        <Button
                            key={val}
                            size="sm"
                            variant={filters.payment === val ? "default" : "outline"}
                            onClick={() => handleChange("payment", val)}
                        >
                            {val === "ALL"
                                ? "Tất cả"
                                : val === "CASH"
                                    ? "Tiền mặt"
                                    : "Chuyển khoản"}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}
