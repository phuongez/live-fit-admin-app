"use client";

import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Image from "next/image";
import Logo from "../imgs/livefitlogo.png";
import { Button } from "./ui/button";

const navItems = [
  { label: "Khách hàng", path: "/khachhang", roles: ["ALL"] },
  { label: "Hợp đồng", path: "/hopdong", roles: ["ALL"] },
  { label: "Đặt lịch tập", path: "/lichtap", roles: ["ALL"] },
  { label: "Nhân sự", path: "/nhansu", roles: ["ADMIN", "MANAGER"] },
  { label: "Cơ sở", path: "/coso", roles: ["ALL"] },
  { label: "Báo cáo", path: "/baocao", roles: ["ADMIN", "MANAGER"] },
  { label: "Tính lương", path: "/tinhluong", roles: ["ADMIN", "MANAGER"] },
];

export default function Navbar() {
  const { user } = useUser();

  // Giả sử role được lưu trong user.publicMetadata.role
  const role = user?.publicMetadata?.role as string;

  const isAllowed = (roles: string[]) => {
    if (roles.includes("ALL")) return true;
    return role && roles.includes(role.toUpperCase());
  };

  return (
    <div className="flex items-center justify-between bg-[#ffc634ff] shadow px-4">
      {/* Links */}
      <div className="flex justify-between items-center gap-6">
        <Image src={Logo} alt="logo" width={40} height={40} className="py-2" />
        <div className="flex space-x-6">
          {navItems
            .filter((item) => isAllowed(item.roles))
            .map((item) => (
              <Button className="bg-primary hover:bg-amber-50" key={item.path}>
                <Link
                  href={item.path}
                  className="text-black font-medium text-sm "
                >
                  {item.label}
                </Link>
              </Button>
            ))}
        </div>
        {user && (
          <Button className="bg-primary hover:bg-amber-50">
            <Link
              href={`/members/${user.id}`}
              className="text-black font-medium text-sm "
            >
              Hồ sơ của tôi
            </Link>
          </Button>
        )}
      </div>
      <header className="flex self justify-end items-center p-2 gap-4 h-fit">
        <SignedOut>
          <SignInButton />
          <SignUpButton>
            <button className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
    </div>
  );
}
