import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUser } from "@clerk/nextjs";

const CreateCustomerDialog = () => {
  const [open, setOpen] = useState(false);

  const [customerCode, setCustomerCode] = useState("");

  // Cơ sở khách tập
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

  // State của form
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [type, setType] = useState("ADULT");
  const [phones, setPhones] = useState([
    { phone: "", label: "Chính", isPrimary: true },
  ]);
  const [zaloPhone, setZaloPhone] = useState("");
  const [needs, setNeeds] = useState("");
  const [source, setSource] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [guardianZalo, setGuardianZalo] = useState("");

  const [previewUrl, setPreviewUrl] = useState("");

  const [coaches, setCoaches] = useState([]);
  const [careCoach, setCareCoach] = useState("");
  const { user } = useUser();

  useEffect(() => {
    async function fetchCoaches() {
      const res = await fetch(`/api/members?branchId=${branch}`);
      const data = await res.json();
      setCoaches(data);
    }
    if (branch) fetchCoaches();
  }, [branch]);

  // Sau khi load user (người tạo)
  useEffect(() => {
    if (user?.publicMetadata?.memberId) {
      setCareCoach(user.publicMetadata.memberId);
    }
  }, [user]);

  function handleAddPhone() {
    setPhones((prev) => [
      ...prev,
      { phone: "", label: "Phụ", isPrimary: false },
    ]);
  }

  // Sửa giá trị số điện thoại theo index
  function handleChangePhone(index, value) {
    setPhones((prev) =>
      prev.map((p, i) => (i === index ? { ...p, phone: value } : p))
    );
  }

  // Xóa 1 số điện thoại
  function handleRemovePhone(index) {
    setPhones((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_upload");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/ds30pv4oa/image/upload",
      { method: "POST", body: formData }
    );

    const data = await res.json();
    setPreviewUrl(data.secure_url);
  }

  async function captureFromDevice() {
    // Call API đến thiết bị nhận diện, lấy ảnh base64 hoặc URL
    const res = await fetch("/api/device/capture");
    const data = await res.json();
    setPreviewUrl(data.imageUrl);
  }

  // Tạo code tự động cho khách hàng
  useEffect(() => {
    async function fetchNextCode() {
      if (!branch) return;
      const res = await fetch(`/api/customers/next-code?branch=${branch}`);
      const data = await res.json();
      setCustomerCode(data.code);
    }
    fetchNextCode();
  }, [branch]);

  // Xử lí api

  // Submit form
  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      fullName,
      dateOfBirth,
      gender,
      type,
      code: customerCode,
      zaloPhone,
      needs,
      source,
      guardianName,
      guardianPhone,
      guardianZalo,
      branch,
      customerCode,
      avatarUrl: previewUrl,
      phones, // 👈 gửi mảng phones lên API
      careCoachId: careCoach,
    };

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Tạo khách hàng thất bại");

      // Nếu thành công → reset form + đóng dialog
      setOpen(false);
      setFullName("");
      setPhone("");
      setPreviewUrl("");
      // TODO: refresh bảng khách hàng
      console.log("Submitting customer:", body.branchId);
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi tạo khách hàng");
    }
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-[#ffc634ff] text-black hover:opacity-90">
            + Tạo mới khách hàng
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Thêm khách hàng mới</DialogTitle>
          </DialogHeader>
          <form className="grid grid-cols-2 gap-4 mt-4" onSubmit={handleSubmit}>
            <Input
              placeholder="Họ và tên"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <Input
              type="date"
              placeholder="Ngày sinh"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger>
                {gender === "male" ? "Nam" : "Nữ" || "Giới tính"}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Nam</SelectItem>
                <SelectItem value="female">Nữ</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(val) => setType(val)} defaultValue={type}>
              <SelectTrigger>
                <span>{type === "ADULT" ? "Người lớn" : "Trẻ em"}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADULT">Người lớn</SelectItem>
                <SelectItem value="CHILD">Trẻ em</SelectItem>
              </SelectContent>
            </Select>
            <Select value={branch} onValueChange={setBranch}>
              <SelectTrigger>
                {branches.find((b) => b.id === branch)?.name ||
                  "Chọn chi nhánh"}
              </SelectTrigger>
              <SelectContent>
                {branches.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={careCoach} onValueChange={setCareCoach}>
              <SelectTrigger>
                <span>
                  {coaches.find((c) => c.id === careCoach)?.fullName ||
                    "Chọn HLV phụ trách"}
                </span>
              </SelectTrigger>
              <SelectContent>
                {coaches.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.fullName} ({c.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              {/* <label className="text-sm font-medium">Mã KH: </label> */}
              <Input
                value={customerCode}
                readOnly
                placeholder="Mã Khách hàng"
              />
            </div>
            {/* Chọn ảnh đại diện */}
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium">Ảnh đại diện</label>
              <Input type="file" accept="image/*" onChange={handleFileUpload} />
              <Button type="button" onClick={captureFromDevice}>
                Chụp từ thiết bị nhận diện
              </Button>
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-32 h-32 rounded-md"
                />
              )}
            </div>
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium">Số điện thoại</label>
              {phones.map((p, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    placeholder={`Số điện thoại ${index + 1}`}
                    value={p.phone}
                    onChange={(e) => handleChangePhone(index, e.target.value)}
                  />
                  {index === 0 ? (
                    <span className="text-xs text-muted-foreground">
                      (Chính)
                    </span>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemovePhone(index)}
                    >
                      Xóa
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddPhone}
                className="mt-2"
              >
                + Thêm số điện thoại
              </Button>
            </div>
            <Input
              placeholder="Số điện thoại Zalo"
              value={zaloPhone}
              onChange={(e) => setZaloPhone(e.target.value)}
            />
            <Input
              placeholder="Nhu cầu"
              value={needs}
              onChange={(e) => setNeeds(e.target.value)}
            />

            <Select value={source} onValueChange={setSource}>
              <SelectTrigger>
                <span>{source || "Nguồn khách hàng"}</span>
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
            <Input placeholder="Tên giám hộ (nếu khách hàng là trẻ nhỏ)" />
            <Input placeholder="Điện thoại giám hộ" />
            <Input placeholder="Zalo giám hộ" />
            <div className="col-span-2 flex justify-end space-x-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-[#ffc634ff] text-black hover:opacity-90"
              >
                Lưu
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateCustomerDialog;
