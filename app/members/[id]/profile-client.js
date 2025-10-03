// "use client";

// import { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { useUser } from "@clerk/nextjs";

// export default function MemberProfile({ id }) {
//   // dùng id để fetch dữ liệu
//   const [member, setMember] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [file, setFile] = useState(null);
//   const { user } = useUser();
//   const role = member?.role || "SERVICE"; // fallback
//   const isManagerOrAdmin = role === "MANAGER" || role === "ADMIN";

//   // fetch dữ liệu từ API
//   useEffect(() => {
//     const fetchData = async () => {
//       const res = await fetch(`/api/members/${id}`);
//       const data = await res.json();
//       setMember(data);
//       setLoading(false);
//     };
//     fetchData();
//   }, [id]);

//   //   Upload avatar
//   const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     setFile(file);
//     // upload lên Cloudinary
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET);

//     const uploadRes = await fetch(
//       `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
//       { method: "POST", body: formData }
//     );
//     const data = await uploadRes.json();
//     handleChange("avatarUrl", data.secure_url);
//   };

//   const handleChange = (field, value) => {
//     setMember((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSave = async () => {
//     await fetch(`/api/members/${id}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(member),
//     });
//     alert("Cập nhật thành công!");
//   };

//   if (loading) return <p>Đang tải...</p>;
//   if (!member) return <p>Không tìm thấy nhân sự</p>;

//   return (
//     <div className="max-w-4xl mx-auto p-6 space-y-4">
//       <h1 className="text-2xl font-bold mb-4">Thông tin cá nhân</h1>

//       <div className="grid grid-cols-2 gap-4">
//         <div className="flex gap-2">
//           <Label htmlFor="fullName" className="w-32">
//             Họ và tên
//           </Label>
//           <Input
//             id="fullName"
//             value={member.fullName || ""}
//             onChange={(e) => handleChange("fullName", e.target.value)}
//             placeholder="Họ và tên"
//           />
//         </div>
//         <div className="flex gap-2">
//           <Label htmlFor="role" className="w-32">
//             Vị trí
//           </Label>
//           {isManagerOrAdmin ? (
//             <Select
//               id="role"
//               value={member.role || ""}
//               onValueChange={(val) => handleChange("role", val)}
//             >
//               <SelectTrigger>{member.role || "Vị trí"}</SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="JUNIOR">Junior</SelectItem>
//                 <SelectItem value="SENIOR">Senior</SelectItem>
//                 <SelectItem value="SERVICE">Service</SelectItem>
//                 <SelectItem value="MANAGER">Manager</SelectItem>
//                 <SelectItem value="ADMIN">Admin</SelectItem>
//               </SelectContent>
//             </Select>
//           ) : (
//             <Input value={member.role || ""} readOnly />
//           )}
//         </div>
//         <div className="flex flex-col gap-2">
//           <Input type="file" accept="image/*" onChange={handleFileUpload} />
//           <Input
//             placeholder="Dán URL ảnh..."
//             value={member.avatarUrl || ""}
//             onChange={(e) => handleChange("avatarUrl", e.target.value)}
//           />
//         </div>

//         <Select
//           value={member.status || ""}
//           onValueChange={(val) => handleChange("status", val)}
//         >
//           <SelectTrigger>{member.status || "Trạng thái"}</SelectTrigger>
//           <SelectContent>
//             <SelectItem value="FULLTIME">Full time</SelectItem>
//             <SelectItem value="PARTTIME">Part time</SelectItem>
//             <SelectItem value="INACTIVE">Đã nghỉ</SelectItem>
//           </SelectContent>
//         </Select>

//         <Input
//           type="date"
//           value={member.dateOfBirth ? member.dateOfBirth.split("T")[0] : ""}
//           onChange={(e) => handleChange("dateOfBirth", e.target.value)}
//         />
//         <Input
//           value={member.nationalId || ""}
//           onChange={(e) => handleChange("nationalId", e.target.value)}
//           placeholder="Số CCCD"
//         />
//         <Input
//           value={member.email || ""}
//           onChange={(e) => handleChange("email", e.target.value)}
//           placeholder="Email"
//         />
//         <Input
//           value={member.phone || ""}
//           onChange={(e) => handleChange("phone", e.target.value)}
//           placeholder="Số điện thoại"
//         />
//         <Input
//           value={member.bankAccount || ""}
//           onChange={(e) => handleChange("bankAccount", e.target.value)}
//           placeholder="Số tài khoản ngân hàng"
//         />
//         <Input
//           value={member.bankName || ""}
//           onChange={(e) => handleChange("bankName", e.target.value)}
//           placeholder="Tên ngân hàng"
//         />
//         <Input
//           value={member.bankHolder || ""}
//           onChange={(e) => handleChange("bankHolder", e.target.value)}
//           placeholder="Tên chủ tài khoản"
//         />
//         <Input
//           type="date"
//           value={member.startDate ? member.startDate.split("T")[0] : ""}
//           onChange={(e) => handleChange("startDate", e.target.value)}
//         />
//       </div>

//       <Textarea
//         value={member.currentAddress || ""}
//         onChange={(e) => handleChange("currentAddress", e.target.value)}
//         placeholder="Địa chỉ hiện tại"
//       />
//       <Textarea
//         value={member.permanentAddress || ""}
//         onChange={(e) => handleChange("permanentAddress", e.target.value)}
//         placeholder="Địa chỉ thường trú"
//       />
//       <Textarea
//         value={member.achievements || ""}
//         onChange={(e) => handleChange("achievements", e.target.value)}
//         placeholder="Thành tích"
//       />
//       <Textarea
//         value={member.experience || ""}
//         onChange={(e) => handleChange("experience", e.target.value)}
//         placeholder="Kinh nghiệm"
//       />
//       <Textarea
//         value={member.certificates || ""}
//         onChange={(e) => handleChange("certificates", e.target.value)}
//         placeholder="Bằng cấp - chứng chỉ"
//       />

//       <div className="flex justify-end">
//         <Button
//           className="bg-[#ffc634ff] text-black hover:opacity-90"
//           onClick={handleSave}
//         >
//           Lưu thay đổi
//         </Button>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

export default function MemberProfile({ id }) {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const { user } = useUser();

  const role = member?.role || "SERVICE";
  const isManagerOrAdmin = role === "MANAGER" || role === "ADMIN";

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/members/${id}`);
      const data = await res.json();

      // nếu chưa có avatarUrl thì lấy từ Clerk (Google image)
      if (!data.avatarUrl && user?.imageUrl) {
        data.avatarUrl = user.imageUrl;
      }

      setMember(data);
      setLoading(false);
    };
    fetchData();
  }, [id, user]);

  // Upload avatar lên Cloudinary
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFile(file);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );

    const data = await uploadRes.json();
    handleChange("avatarUrl", data.secure_url);
  };

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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Thông tin cá nhân</h1>

      {/* Avatar */}
      <div className="flex flex-col gap-2">
        <Label className="hidden">Ảnh đại diện</Label>
        {member.avatarUrl && (
          <img
            src={member.avatarUrl}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover"
          />
        )}
        <div>
          <Input
            id="avatar"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          {/* Label hoặc Button sẽ trigger input file */}
          <Label htmlFor="avatar" className="cursor-pointer">
            <Button variant="outline">Chọn ảnh đại diện khác</Button>
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Họ và tên */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="fullName">Họ và tên</Label>
          <Input
            id="fullName"
            value={member.fullName || ""}
            onChange={(e) => handleChange("fullName", e.target.value)}
          />
        </div>

        {/* Vị trí */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="role">Vị trí</Label>
          {isManagerOrAdmin ? (
            <Select
              value={member.role || ""}
              onValueChange={(val) => handleChange("role", val)}
            >
              <SelectTrigger>{member.role || "Vị trí"}</SelectTrigger>
              <SelectContent>
                <SelectItem value="JUNIOR">Junior</SelectItem>
                <SelectItem value="SENIOR">Senior</SelectItem>
                <SelectItem value="SERVICE">Service</SelectItem>
                <SelectItem value="MANAGER">Manager</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Input value={member.role || ""} readOnly />
          )}
        </div>

        {/* Trạng thái */}
        <div className="flex flex-col gap-2">
          <Label>Trạng thái</Label>
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
        </div>

        {/* Ngày sinh */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="dateOfBirth">Ngày sinh</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={member.dateOfBirth ? member.dateOfBirth.split("T")[0] : ""}
            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
          />
        </div>

        {/* CCCD */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="nationalId">Số CCCD</Label>
          <Input
            id="nationalId"
            value={member.nationalId || ""}
            onChange={(e) => handleChange("nationalId", e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={member.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>

        {/* Số điện thoại */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Số điện thoại</Label>
          <Input
            id="phone"
            value={member.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>

        {/* Ngân hàng */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="bankAccount">Số tài khoản</Label>
          <Input
            id="bankAccount"
            value={member.bankAccount || ""}
            onChange={(e) => handleChange("bankAccount", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="bankName">Tên ngân hàng</Label>
          <Input
            id="bankName"
            value={member.bankName || ""}
            onChange={(e) => handleChange("bankName", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="bankHolder">Chủ tài khoản</Label>
          <Input
            id="bankHolder"
            value={member.bankHolder || ""}
            onChange={(e) => handleChange("bankHolder", e.target.value)}
          />
        </div>

        {/* Ngày bắt đầu */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="startDate">Ngày bắt đầu</Label>
          <Input
            id="startDate"
            type="date"
            value={member.startDate ? member.startDate.split("T")[0] : ""}
            onChange={(e) => handleChange("startDate", e.target.value)}
          />
        </div>
      </div>

      {/* Textarea fields */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label>Địa chỉ hiện tại</Label>
          <Textarea
            value={member.currentAddress || ""}
            onChange={(e) => handleChange("currentAddress", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Địa chỉ thường trú</Label>
          <Textarea
            value={member.permanentAddress || ""}
            onChange={(e) => handleChange("permanentAddress", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Thành tích</Label>
          <Textarea
            value={member.achievements || ""}
            onChange={(e) => handleChange("achievements", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Kinh nghiệm</Label>
          <Textarea
            value={member.experience || ""}
            onChange={(e) => handleChange("experience", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Bằng cấp - chứng chỉ</Label>
          <Textarea
            value={member.certificates || ""}
            onChange={(e) => handleChange("certificates", e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          className="bg-[#ffc634ff] text-black hover:bg-black hover:text-white cursor-pointer"
          onClick={handleSave}
        >
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
}
