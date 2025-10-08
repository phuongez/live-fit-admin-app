"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateContractModal() {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        code: "",
        primaryCustomerId: "",
        totalSessions: 10,
        pricePerSession: 500000,
        orderType: "MARKETING",
        paymentMethod: "CASH",
    });

    useEffect(() => {
        const handler = () => setOpen(true);
        window.addEventListener("open-create-contract", handler);
        return () => window.removeEventListener("open-create-contract", handler);
    }, []);

    const handleSubmit = async () => {
        const res = await fetch("/api/contracts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        if (res.ok) setOpen(false);
    };

    const handleChange = (k, v) => setForm((p) => ({ ...p, [k]: v }));

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Tạo hợp đồng mới</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div>
                        <Label>Mã hợp đồng</Label>
                        <Input value={form.code} onChange={(e) => handleChange("code", e.target.value)} />
                    </div>
                    <div>
                        <Label>Tổng số buổi</Label>
                        <Input
                            type="number"
                            value={form.totalSessions}
                            onChange={(e) => handleChange("totalSessions", +e.target.value)}
                        />
                    </div>
                    <div>
                        <Label>Giá mỗi buổi</Label>
                        <Input
                            type="number"
                            value={form.pricePerSession}
                            onChange={(e) => handleChange("pricePerSession", +e.target.value)}
                        />
                    </div>
                    <div>
                        <Label>Loại đơn</Label>
                        <select
                            className="w-full border rounded p-2"
                            value={form.orderType}
                            onChange={(e) => handleChange("orderType", e.target.value)}
                        >
                            <option value="MARKETING">Marketing</option>
                            <option value="REFER">Refer</option>
                            <option value="RENEW">Renew</option>
                            <option value="MEMBER">Member</option>
                        </select>
                    </div>
                    <div>
                        <Label>Hình thức thanh toán</Label>
                        <select
                            className="w-full border rounded p-2"
                            value={form.paymentMethod}
                            onChange={(e) => handleChange("paymentMethod", e.target.value)}
                        >
                            <option value="CASH">Tiền mặt</option>
                            <option value="BANK_TRANSFER">Chuyển khoản</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Huỷ
                    </Button>
                    <Button onClick={handleSubmit}>Lưu</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
