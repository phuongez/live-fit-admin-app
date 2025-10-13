"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useUser } from "@clerk/nextjs";

export default function CustomerEditModal({
  selectedCustomer,
  setSelectedCustomer,
}) {
  const { user } = useUser();
  const memberId = user?.publicMetadata?.memberId;
  const [form, setForm] = useState({});
  const [phones, setPhones] = useState([]);
  const [note, setNote] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [branches, setBranches] = useState([]);
  const [branch, setBranch] = useState("ALL");

  const [coaches, setCoaches] = useState([]);
  useEffect(() => {
    async function fetchCoaches() {
      const res = await fetch(`/api/members?branchId=${form.branch || "ALL"}`);
      const data = await res.json();
      setCoaches(data);
    }
    if (form.branch) fetchCoaches();
  }, [form.branch]);

  useEffect(() => {
    const fetchBranches = async () => {
      const res = await fetch("/api/branches");
      const data = await res.json();
      setBranches(data);
    };
    fetchBranches();
  }, []);

  // ✅ load dữ liệu khách hàng
  useEffect(() => {
    if (selectedCustomer) {
      setForm({
        fullName: selectedCustomer.fullName || "",
        dateOfBirth: selectedCustomer.dateOfBirth?.slice(0, 10) || "",
        gender: selectedCustomer.gender || "",
        type: selectedCustomer.type || "ADULT",
        customerCode: selectedCustomer.code || "",
        zaloPhone: selectedCustomer.zaloPhone || "",
        needs: selectedCustomer.needs || "",
        branch: selectedCustomer.branchId || "",
        source: selectedCustomer.source || "",
        guardianName: selectedCustomer.guardianName || "",
        guardianPhone: selectedCustomer.guardianPhone || "",
        guardianZalo: selectedCustomer.guardianZalo || "",
        avatarUrl: selectedCustomer.avatarUrl || "",
      });
      setPhones(
        selectedCustomer.phones?.length
          ? selectedCustomer.phones.map((p) => ({
              phone: p.phone,
              label: p.label || (p.isPrimary ? "Chính" : "Phụ"),
              isPrimary: p.isPrimary || false,
            }))
          : [{ phone: "", label: "Chính", isPrimary: true }]
      );
      setPreviewUrl(selectedCustomer.avatarUrl || null);
      setIsEditing(false);
    }
  }, [selectedCustomer]);

  const handleChange = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_upload");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/ds30pv4oa/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    setForm((prev) => ({ ...prev, avatarUrl: data.secure_url }));
  }

  // Thêm 1 số mới
  function handleAddPhone() {
    setPhones((prev) => [
      ...prev,
      { phone: "", label: "Phụ", isPrimary: false },
    ]);
  }

  // Sửa giá trị số theo index
  function handleChangePhone(index, value) {
    setPhones((prev) =>
      prev.map((p, i) => (i === index ? { ...p, phone: value } : p))
    );
  }

  // Xóa số
  function handleRemovePhone(index) {
    setPhones((prev) => prev.filter((_, i) => i !== index));
  }

  // Đặt số chính
  function handleSetPrimary(index) {
    setPhones((prev) => prev.map((p, i) => ({ ...p, isPrimary: i === index })));
  }

  const handleSubmit = async () => {
    if (!selectedCustomer) return;

    const changes = {};
    Object.entries(form).forEach(([key, val]) => {
      const oldVal =
        selectedCustomer[key] ||
        selectedCustomer?.phones?.[0]?.phone ||
        selectedCustomer?.branchId;
      if (val?.toString() !== (oldVal?.toString() || "")) {
        changes[key] = val;
      }
    });

    if (
      JSON.stringify(
        phones.map((p) => ({ phone: p.phone, isPrimary: p.isPrimary }))
      ) !==
      JSON.stringify(
        (selectedCustomer.phones || []).map((p) => ({
          phone: p.phone,
          isPrimary: p.isPrimary,
        }))
      )
    ) {
      changes.phones = phones;
    }

    if (Object.keys(changes).length === 0) {
      alert("Không có thay đổi nào để gửi phê duyệt.");
      return;
    }

    setSubmitting(true);
    const correctedChanges = { ...changes };

    // 1️⃣ Chuyển branch → branchId
    if (correctedChanges.branch) {
      correctedChanges.branchId = correctedChanges.branch;
      delete correctedChanges.branch;
    }

    // 2️⃣ Chuyển careCoach → careCoachId
    if (correctedChanges.careCoach) {
      correctedChanges.careCoachId = correctedChanges.careCoach;
      delete correctedChanges.careCoach;
    }

    // 3️⃣ Chuyển customerCode → code
    if (correctedChanges.customerCode) {
      correctedChanges.code = correctedChanges.customerCode;
      delete correctedChanges.customerCode;
    }

    // Gửi đúng format
    await fetch("/api/customer-edits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: selectedCustomer.id,
        changes: correctedChanges,
        note,
        requestedById: memberId,
      }),
    });

    setSubmitting(false);

    if (res.ok) {
      alert("Đã gửi yêu cầu chỉnh sửa, chờ quản lý phê duyệt.");
      setSelectedCustomer(null);
    } else {
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  if (!selectedCustomer) return null;

  return (
    <Dialog
      open={!!selectedCustomer}
      onOpenChange={() => setSelectedCustomer(null)}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl p-6 scrollbar-thin scrollbar-track-transparent">
        <DialogHeader>
          <DialogTitle>Thông tin khách hàng</DialogTitle>
        </DialogHeader>

        {/* Nút Edit */}
        <div className="flex justify-end mb-2 pr-4">
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Chỉnh sửa
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-2">
          {/* ======= Họ tên ======= */}
          <div>
            <Label className="mb-2">Họ và tên</Label>
            <Input
              value={form.fullName}
              disabled={!isEditing}
              onChange={(e) => handleChange("fullName", e.target.value)}
            />
          </div>

          {/* ======= Ngày sinh ======= */}
          <div>
            <Label className="mb-2">Ngày sinh</Label>
            <Input
              type="date"
              value={form.dateOfBirth}
              disabled={!isEditing}
              onChange={(e) => handleChange("dateOfBirth", e.target.value)}
            />
          </div>

          {/* ======= Giới tính ======= */}
          <div>
            <Label className="mb-2">Giới tính</Label>
            <Select
              disabled={!isEditing}
              value={form.gender}
              onValueChange={(v) => handleChange("gender", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn giới tính" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Nam</SelectItem>
                <SelectItem value="female">Nữ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ======= Loại khách hàng ======= */}
          <div>
            <Label className="mb-2">Loại khách hàng</Label>
            <Select
              disabled={!isEditing}
              value={form.type}
              onValueChange={(v) => handleChange("type", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Loại khách hàng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADULT">Người lớn</SelectItem>
                <SelectItem value="CHILD">Trẻ em</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ======= Chi nhánh ======= */}
          <div>
            <Label className="mb-2">Chi nhánh</Label>
            <Select
              disabled={!isEditing}
              value={form.branch}
              onValueChange={(v) => handleChange("branch", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn chi nhánh" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2">HLV phụ trách</Label>
            <Select
              disabled={!isEditing}
              value={form.careCoach || ""}
              onValueChange={(v) => handleChange("careCoach", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn HLV phụ trách" />
              </SelectTrigger>
              <SelectContent>
                {coaches.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.fullName} ({c.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ======= Mã KH ======= */}
          <div>
            <Label className="mb-2">Mã khách hàng</Label>
            <Input value={form.customerCode} readOnly disabled />
          </div>

          {/* ======= Ảnh đại diện ======= */}
          <div className="col-span-2 space-y-2">
            <Label className="mb-2">Ảnh đại diện hiện tại</Label>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Avatar"
                className="w-32 h-32 rounded-md object-cover"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-100 rounded-md flex items-center justify-center text-sm text-gray-500">
                Không có ảnh
              </div>
            )}
            {isEditing && (
              <div>
                <Label className="mb-2">Đổi ảnh đại diện</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </div>
            )}
          </div>

          {/* ======= Liên hệ ======= */}
          <div className="col-span-2 space-y-2">
            <Label className="mb-2">Số điện thoại</Label>
            {phones.map((p, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder={`Số ${index + 1}`}
                  value={p.phone}
                  disabled={!isEditing}
                  onChange={(e) => handleChangePhone(index, e.target.value)}
                />
                {isEditing && (
                  <>
                    <input
                      type="radio"
                      name="primaryPhone"
                      checked={p.isPrimary}
                      onChange={() => handleSetPrimary(index)}
                      disabled={!isEditing}
                    />
                    <span className="text-xs">
                      {p.isPrimary ? "Chính" : "Phụ"}
                    </span>
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemovePhone(index)}
                      >
                        Xóa
                      </Button>
                    )}
                  </>
                )}
              </div>
            ))}
            {isEditing && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddPhone}
              >
                + Thêm số điện thoại
              </Button>
            )}
          </div>

          <div>
            <Label className="mb-2">Số điện thoại Zalo</Label>
            <Input
              value={form.zaloPhone}
              disabled={!isEditing}
              onChange={(e) => handleChange("zaloPhone", e.target.value)}
            />
          </div>

          <div className="col-span-2">
            <Label className="mb-2">Nhu cầu</Label>
            <Input
              value={form.needs}
              disabled={!isEditing}
              onChange={(e) => handleChange("needs", e.target.value)}
            />
          </div>

          {/* ======= Nguồn khách hàng ======= */}
          <div>
            <Label className="mb-2">Nguồn khách hàng</Label>
            <Select
              disabled={!isEditing}
              value={form.source}
              onValueChange={(v) => handleChange("source", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Nguồn khách hàng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="REFERRAL">Referral</SelectItem>
                <SelectItem value="HOTLINE">Hotline</SelectItem>
                <SelectItem value="CARE">Care</SelectItem>
                <SelectItem value="COACH">Coach</SelectItem>
                <SelectItem value="UID">UID</SelectItem>
                <SelectItem value="GOOGLE_ADS">Google Ads</SelectItem>
                <SelectItem value="TIKTOK_ADS">Tiktok Ads</SelectItem>
                <SelectItem value="WEBSITE">Website</SelectItem>
                <SelectItem value="FANPAGE">Fanpage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ======= Giám hộ (nếu trẻ em) ======= */}
          {form.type === "CHILD" && (
            <>
              <div>
                <Label className="mb-2">Tên giám hộ</Label>
                <Input
                  value={form.guardianName}
                  disabled={!isEditing}
                  onChange={(e) => handleChange("guardianName", e.target.value)}
                />
              </div>
              <div>
                <Label className="mb-2">Điện thoại giám hộ</Label>
                <Input
                  value={form.guardianPhone}
                  disabled={!isEditing}
                  onChange={(e) =>
                    handleChange("guardianPhone", e.target.value)
                  }
                />
              </div>
              <div>
                <Label className="mb-2">Zalo giám hộ</Label>
                <Input
                  value={form.guardianZalo}
                  disabled={!isEditing}
                  onChange={(e) => handleChange("guardianZalo", e.target.value)}
                />
              </div>
            </>
          )}

          {isEditing && (
            <div className="col-span-2">
              <Label className="mb-2">Ghi chú lý do chỉnh sửa</Label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ví dụ: cập nhật số điện thoại mới, đổi chi nhánh..."
              />
            </div>
          )}
        </div>

        {/* ======= Nút hành động ======= */}
        <div className="col-span-2 flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={() => setSelectedCustomer(null)}>
            Đóng
          </Button>

          {isEditing && (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-[#ffc634ff] text-black hover:opacity-90"
            >
              {submitting ? "Đang gửi..." : "Gửi phê duyệt"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
