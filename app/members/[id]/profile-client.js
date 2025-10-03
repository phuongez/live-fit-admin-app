"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function MemberProfile({ id }) {
  // dùng id để fetch dữ liệu
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch dữ liệu từ API
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/members/${id}`);
      const data = await res.json();
      setMember(data);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleChange = (field, value) => {
    setMember((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    await fetch(`/api/members/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(member),
    });
    alert("Cập nhật thành công!");
  };

  if (loading) return <p>Đang tải...</p>;
  if (!member) return <p>Không tìm thấy nhân sự</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Thông tin cá nhân</h1>

      <div className="grid grid-cols-2 gap-4">
        <Input
          value={member.fullName || ""}
          onChange={(e) => handleChange("fullName", e.target.value)}
          placeholder="Họ và tên"
        />
        <Select
          value={member.position || ""}
          onValueChange={(val) => handleChange("position", val)}
        >
          <SelectTrigger>{member.position || "Vị trí"}</SelectTrigger>
          <SelectContent>
            <SelectItem value="JUNIOR">Junior</SelectItem>
            <SelectItem value="SENIOR">Senior</SelectItem>
            <SelectItem value="SERVICE">Service</SelectItem>
            <SelectItem value="MANAGER">Manager</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={member.status || ""}
          onValueChange={(val) => handleChange("status", val)}
        >
          <SelectTrigger>{member.status || "Trạng thái"}</SelectTrigger>
          <SelectContent>
            <SelectItem value="FULLTIME">Full time</SelectItem>
            <SelectItem value="PARTTIME">Part time</SelectItem>
            <SelectItem value="INACTIVE">Đã nghỉ</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="date"
          value={member.dateOfBirth ? member.dateOfBirth.split("T")[0] : ""}
          onChange={(e) => handleChange("dateOfBirth", e.target.value)}
        />
        <Input
          value={member.nationalId || ""}
          onChange={(e) => handleChange("nationalId", e.target.value)}
          placeholder="Số CCCD"
        />
        <Input
          value={member.email || ""}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="Email"
        />
        <Input
          value={member.phone || ""}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="Số điện thoại"
        />
        <Input
          value={member.bankAccount || ""}
          onChange={(e) => handleChange("bankAccount", e.target.value)}
          placeholder="Số tài khoản ngân hàng"
        />
        <Input
          value={member.bankName || ""}
          onChange={(e) => handleChange("bankName", e.target.value)}
          placeholder="Tên ngân hàng"
        />
        <Input
          value={member.bankHolder || ""}
          onChange={(e) => handleChange("bankHolder", e.target.value)}
          placeholder="Tên chủ tài khoản"
        />
        <Input
          type="date"
          value={member.startDate ? member.startDate.split("T")[0] : ""}
          onChange={(e) => handleChange("startDate", e.target.value)}
        />
      </div>

      <Textarea
        value={member.currentAddress || ""}
        onChange={(e) => handleChange("currentAddress", e.target.value)}
        placeholder="Địa chỉ hiện tại"
      />
      <Textarea
        value={member.permanentAddress || ""}
        onChange={(e) => handleChange("permanentAddress", e.target.value)}
        placeholder="Địa chỉ thường trú"
      />
      <Textarea
        value={member.achievements || ""}
        onChange={(e) => handleChange("achievements", e.target.value)}
        placeholder="Thành tích"
      />
      <Textarea
        value={member.experience || ""}
        onChange={(e) => handleChange("experience", e.target.value)}
        placeholder="Kinh nghiệm"
      />
      <Textarea
        value={member.certificates || ""}
        onChange={(e) => handleChange("certificates", e.target.value)}
        placeholder="Bằng cấp - chứng chỉ"
      />

      <div className="flex justify-end">
        <Button
          className="bg-[#ffc634ff] text-black hover:opacity-90"
          onClick={handleSave}
        >
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
}
