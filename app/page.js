"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Badge } from "@/components/ui/badge";

export default function CustomerIndex() {
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
  const [phone, setPhone] = useState("");
  const [zaloPhone, setZaloPhone] = useState("");
  const [needs, setNeeds] = useState("");
  const [source, setSource] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [guardianZalo, setGuardianZalo] = useState("");

  const [previewUrl, setPreviewUrl] = useState("");

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
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
      phone,
      zaloPhone,
      needs,
      source,
      guardianName,
      guardianPhone,
      guardianZalo,
      branch,
      customerCode,
      avatarUrl: previewUrl,
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
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi tạo khách hàng");
    }
  }

  return (
    <div className="flex w-full h-full bg-gray-50">
      {/* Sidebar filter */}
      <div className="w-64 bg-white border-r p-4 space-y-6">
        <h2 className="font-semibold text-lg">Bộ lọc tìm kiếm</h2>

        <div>
          <p className="text-sm font-medium mb-2">Công nợ</p>
          <Select defaultValue="all">
            <SelectTrigger>
              <span>Tất cả</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="done">Hoàn thành</SelectItem>
              <SelectItem value="debt">Còn nợ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Giới tính</p>
          <Select defaultValue="all">
            <SelectTrigger>
              <span>Tất cả</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="male">Nam</SelectItem>
              <SelectItem value="female">Nữ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Trạng thái khách hàng</p>
          <Select defaultValue="active">
            <SelectTrigger>
              <span>Hoạt động</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="stopped">Dừng</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 space-y-4">
        {/* Header actions */}
        <div className="flex items-center justify-between">
          <Input placeholder="Nhập nội dung tìm kiếm" className="w-96" />
          <div className="space-x-2">
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
                <form
                  className="grid grid-cols-2 gap-4 mt-4"
                  onSubmit={handleSubmit}
                >
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
                  <Select
                    onValueChange={(val) => setType(val)}
                    defaultValue={type}
                  >
                    <SelectTrigger>
                      <span>{type === "ADULT" ? "Người lớn" : "Trẻ em"}</span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADULT">Người lớn</SelectItem>
                      <SelectItem value="CHILD">Trẻ em</SelectItem>
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
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
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
                  <Input
                    placeholder="Số điện thoại"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
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

            <Button variant="outline">Xuất file</Button>
            <Button variant="outline">Tùy chọn cột</Button>
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Tên khách hàng</TableHead>
                  <TableHead>Điện thoại</TableHead>
                  <TableHead>Dịch vụ</TableHead>
                  <TableHead>Còn lại</TableHead>
                  <TableHead>Ngày bắt đầu</TableHead>
                  <TableHead>Hết hạn</TableHead>
                  <TableHead>Công nợ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3].map((id) => (
                  <TableRow key={id}>
                    <TableCell>{id}</TableCell>
                    <TableCell className="font-medium text-blue-600">
                      Nguyễn Văn Thắng
                    </TableCell>
                    <TableCell>0901234567</TableCell>
                    <TableCell>Gói PT 50 buổi</TableCell>
                    <TableCell>47/50</TableCell>
                    <TableCell>15/09/2025</TableCell>
                    <TableCell>11/06/2026</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500 text-white">
                        Đang hoạt động
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
