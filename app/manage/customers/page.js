"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUser } from "@clerk/nextjs";

export default function ManageCustomersPage() {
    const { user } = useUser();
    const approverId = user?.publicMetadata?.memberId; // bạn có thể map Clerk user → Member.id
    const role = user?.publicMetadata?.role;

    const [edits, setEdits] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        fetch("/api/customer-edits")
            .then((res) => res.json())
            .then(setEdits);
    }, []);

    const handleAction = async (action) => {
        if (!selected) return;
        await fetch("/api/customer-edits", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: selected.id,
                action,
                approverId,
            }),
        });
        setSelected(null);
        // reload
        const res = await fetch("/api/customer-edits");
        setEdits(await res.json());
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Yêu cầu chỉnh sửa thông tin khách hàng</h1>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Khách hàng</TableHead>
                                <TableHead>Trường sửa</TableHead>
                                <TableHead>Giá trị cũ</TableHead>
                                <TableHead>Giá trị mới</TableHead>
                                <TableHead>Người đề xuất</TableHead>
                                <TableHead>Thời gian</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {edits.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                                        Không có yêu cầu chờ duyệt
                                    </TableCell>
                                </TableRow>
                            ) : (
                                edits.map((e) => (
                                    <TableRow key={e.id}>
                                        <TableCell>{e.customer.fullName}</TableCell>
                                        <TableCell>{e.field}</TableCell>
                                        <TableCell>{e.oldValue || "-"}</TableCell>
                                        <TableCell className="text-yellow-700 font-medium">{e.newValue}</TableCell>
                                        <TableCell>{e.requestedBy?.fullName || "-"}</TableCell>
                                        <TableCell>{new Date(e.createdAt).toLocaleString()}</TableCell>
                                        <TableCell>
                                            {["MANAGER", "ADMIN"].includes(role) && (
                                                <Button size="sm" onClick={() => setSelected(e)}>
                                                    Xem
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Duyệt chỉnh sửa thông tin</DialogTitle>
                    </DialogHeader>

                    {selected && (
                        <div className="space-y-3">
                            <p><strong>Khách hàng:</strong> {selected.customer.fullName}</p>
                            <p><strong>Trường sửa:</strong> {selected.field}</p>
                            <p><strong>Giá trị cũ:</strong> {selected.oldValue || "-"}</p>
                            <p><strong>Giá trị mới:</strong> {selected.newValue}</p>
                            <p><strong>Ghi chú:</strong> {selected.note || "-"}</p>
                            <div className="flex justify-end gap-2 mt-4">
                                <Button variant="outline" onClick={() => handleAction("reject")}>
                                    Từ chối
                                </Button>
                                <Button onClick={() => handleAction("approve")}>Duyệt</Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
