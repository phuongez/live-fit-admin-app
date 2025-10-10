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
  const [note, setNote] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [branches, setBranches] = useState([]);
  const [branch, setBranch] = useState("ALL");

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
        phone: selectedCustomer.phones?.[0]?.phone || "",
        zaloPhone: selectedCustomer.zaloPhone || "",
        needs: selectedCustomer.needs || "",
        branch: selectedCustomer.branchId || "",
        source: selectedCustomer.source || "",
        guardianName: selectedCustomer.guardianName || "",
        guardianPhone: selectedCustomer.guardianPhone || "",
        guardianZalo: selectedCustomer.guardianZalo || "",
        avatarUrl: selectedCustomer.avatarUrl || "",
      });
      setPreviewUrl(selectedCustomer.avatarUrl || null);
      setIsEditing(false);
    }
  }, [selectedCustomer]);

  const handleChange = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

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

    if (Object.keys(changes).length === 0) {
      alert("Không có thay đổi nào để gửi phê duyệt.");
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/customer-edits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: selectedCustomer.id,
        changes,
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Thông tin khách hàng</DialogTitle>
        </DialogHeader>

        {/* Nút Edit */}
        <div className="flex justify-end mb-2">
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
            <Label>Họ và tên</Label>
            <Input
              value={form.fullName}
              disabled={!isEditing}
              onChange={(e) => handleChange("fullName", e.target.value)}
            />
          </div>

          {/* ======= Ngày sinh ======= */}
          <div>
            <Label>Ngày sinh</Label>
            <Input
              type="date"
              value={form.dateOfBirth}
              disabled={!isEditing}
              onChange={(e) => handleChange("dateOfBirth", e.target.value)}
            />
          </div>

          {/* ======= Giới tính ======= */}
          <div>
            <Label>Giới tính</Label>
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
            <Label>Loại khách hàng</Label>
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

          {/* ======= Mã KH ======= */}
          <div>
            <Label>Mã khách hàng</Label>
            <Input value={form.customerCode} readOnly disabled />
          </div>

          {/* ======= Ảnh đại diện ======= */}
          <div className="col-span-2 space-y-2">
            <Label>Ảnh đại diện hiện tại</Label>
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
                <Label>Đổi ảnh đại diện</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </div>
            )}
          </div>

          {/* ======= Liên hệ ======= */}
          <div>
            <Label>Số điện thoại</Label>
            <Input
              value={form.phone}
              disabled={!isEditing}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>

          <div>
            <Label>Số điện thoại Zalo</Label>
            <Input
              value={form.zaloPhone}
              disabled={!isEditing}
              onChange={(e) => handleChange("zaloPhone", e.target.value)}
            />
          </div>

          <div className="col-span-2">
            <Label>Nhu cầu</Label>
            <Input
              value={form.needs}
              disabled={!isEditing}
              onChange={(e) => handleChange("needs", e.target.value)}
            />
          </div>

          {/* ======= Chi nhánh ======= */}
          <div>
            <Label>Chi nhánh</Label>
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

          {/* ======= Nguồn khách hàng ======= */}
          <div>
            <Label>Nguồn khách hàng</Label>
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
              </SelectContent>
            </Select>
          </div>

          {/* ======= Giám hộ (nếu trẻ em) ======= */}
          {form.type === "CHILD" && (
            <>
              <div>
                <Label>Tên giám hộ</Label>
                <Input
                  value={form.guardianName}
                  disabled={!isEditing}
                  onChange={(e) => handleChange("guardianName", e.target.value)}
                />
              </div>
              <div>
                <Label>Điện thoại giám hộ</Label>
                <Input
                  value={form.guardianPhone}
                  disabled={!isEditing}
                  onChange={(e) =>
                    handleChange("guardianPhone", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Zalo giám hộ</Label>
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
              <Label>Ghi chú lý do chỉnh sửa</Label>
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
