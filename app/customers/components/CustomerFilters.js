"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function CustomerFilters({ filters, setFilters }) {
    const [daysUntilExpire, setDaysUntilExpire] = useState(30);

    const handleChange = (field, value) =>
        setFilters((prev) => ({ ...prev, [field]: value }));

    const stageLabels = {
        LEAD: "Lead",
        DATA: "Data",
        APPOINTMENT: "Hẹn tập",
        TRIAL: "Tập thử",
        WON: "Done",
        LOST: "Fail",
    };

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold">Bộ lọc tìm kiếm</h2>

            {/* Giới tính */}
            <div>
                <Label className="font-semibold">Giới tính</Label>
                <div className="flex gap-2 mt-2 flex-wrap">
                    {["ALL", "MALE", "FEMALE"].map((val) => (
                        <Button
                            key={val}
                            size="sm"
                            variant={filters.gender === val ? "default" : "outline"}
                            onClick={() => handleChange("gender", val)}
                        >
                            {val === "ALL" ? "Tất cả" : val === "MALE" ? "Nam" : "Nữ"}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Trạng thái khách hàng */}
            <div>
                <Label className="font-semibold">Trạng thái khách hàng</Label>
                <div className="flex gap-2 mt-2 flex-wrap">
                    {["ALL", "ACTIVE", "INACTIVE"].map((val) => (
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
                                    : "Dừng"}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Customer Stage */}
            <div>
                <Label className="font-semibold">Giai đoạn khách hàng</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                    {["LEAD", "DATA", "APPOINTMENT", "TRIAL", "WON", "LOST"].map((stage) => (
                        <Button
                            key={stage}
                            size="sm"
                            variant={filters.stage === stage ? "default" : "outline"}
                            onClick={() => handleChange("stage", stage)}
                        >
                            {stageLabels[stage]}
                        </Button>
                    ))}
                    <Button
                        size="sm"
                        variant={filters.stage === "ALL" ? "default" : "outline"}
                        onClick={() => handleChange("stage", "ALL")}
                    >
                        Tất cả
                    </Button>
                </div>
            </div>

            {/* Trạng thái hợp đồng */}
            <div>
                <Label className="font-semibold">Trạng thái hợp đồng</Label>
                <RadioGroup
                    value={filters.contractStatus}
                    defaultValue="ALL"
                    onValueChange={(v) => handleChange("contractStatus", v)}
                    className="mt-2 space-y-2"
                >
                    <div className="flex items-center space-x-2 mt-2">
                        <RadioGroupItem value="ALL" id="all" />
                        <Label htmlFor="all">Tất cả</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="EXPIRING" id="expiring" />
                        <Label htmlFor="expiring" className="flex items-center gap-2">
                            Đến hạn trong
                            <Input
                                type="number"
                                className="w-16 h-7 text-center"
                                value={daysUntilExpire}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value) || 0;
                                    setDaysUntilExpire(val);
                                    setFilters((prev) => ({ ...prev, expireInDays: val }));
                                }}
                            />
                            ngày
                        </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="PAUSED" id="paused" />
                        <Label htmlFor="paused">Đang bảo lưu</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="EXPIRED" id="expired" />
                        <Label htmlFor="expired">Hết hợp đồng</Label>
                    </div>
                </RadioGroup>
            </div>
        </div>
    );
}
