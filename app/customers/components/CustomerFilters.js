import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function CustomerFilters({ filters, setFilters }) {
    const handleChange = (field, value) =>
        setFilters((prev) => ({ ...prev, [field]: value }));

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold">Bộ lọc tìm kiếm</h2>

            {/* Giới tính */}
            <div>
                <Label className="font-semibold">Giới tính</Label>
                <div className="flex gap-2 mt-2">
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
                <div className="flex gap-2 mt-2">
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

            {/* Trạng thái dịch vụ */}
            <div>
                <Label className="font-semibold">Trạng thái dịch vụ</Label>
                <RadioGroup
                    value={filters.serviceStatus}
                    onValueChange={(v) => handleChange("serviceStatus", v)}
                >
                    {[
                        { value: "ALL", label: "Tất cả" },
                        { value: "ACTIVE", label: "Đang hoạt động" },
                        { value: "EXPIRED", label: "Hết hạn" },
                        { value: "PAUSED", label: "Tạm dừng" },
                    ].map((item) => (
                        <div key={item.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={item.value} id={item.value} />
                            <Label htmlFor={item.value}>{item.label}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>
        </div>
    );
}
