// src/app/(app)/customers/new/page.tsx
"use client";
// import { trpc } from "@/utils/trpc";
import { useRouter } from "next/navigation";
import { useState } from "react";
// import { input, Button } from "../components/ui"; // giả sử đã export

export default function Home() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [branchId, setBranchId] = useState("");

  const create = trpc.customers.create.useMutation({
    onSuccess: () => router.push("/customers"),
  });

  return (
    <div className="max-w-md space-y-3">
      <input
        placeholder="Họ tên"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <input
        placeholder="SĐT"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <input
        placeholder="Branch ID"
        value={branchId}
        onChange={(e) => setBranchId(e.target.value)}
      />
      <button
        onClick={() => create.mutate({ fullName, phone, branchId })}
        disabled={create.isLoading}
      >
        Tạo khách hàng
      </button>
    </div>
  );
}
