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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Logo from "../imgs/livefitlogo.png";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

const navItems = [
  { label: "Khách hàng", path: "/customers", roles: ["ALL"] },
  { label: "Hợp đồng", path: "/hopdong", roles: ["ALL"] },
  { label: "Đặt lịch tập", path: "/lichtap", roles: ["ALL"] },
  { label: "Nhân sự", path: "/nhansu", roles: ["ADMIN", "MANAGER"] },
  { label: "Cơ sở", path: "/coso", roles: ["ALL"] },
  { label: "Báo cáo", path: "/baocao", roles: ["ADMIN", "MANAGER"] },
  { label: "Tính lương", path: "/tinhluong", roles: ["ADMIN", "MANAGER"] },
];

export default function Navbar() {
  const { user } = useUser();
  const pathname = usePathname();

  // Giả sử role được lưu trong user.publicMetadata.role
  const role = user?.publicMetadata?.role as string;
  const isManager = role === "MANAGER" || role === "ADMIN";

  const isAllowed = (roles: string[]) => {
    if (roles.includes("ALL")) return true;
    return role && roles.includes(role.toUpperCase());
  };

  return (
    <div className="flex items-center justify-between bg-[#ffc634ff] shadow px-12">
      {/* Links */}
      <div className="flex justify-between items-center gap-6">
        <Link href="/">
          <Image
            src={Logo}
            alt="logo"
            width={40}
            height={40}
            className="py-2"
          />
        </Link>
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
        {isManager && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={pathname.startsWith("/manage") ? "default" : "ghost"}
              >
                Quản lý <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <Link href="/manage/customers">Sửa thông tin khách hàng</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/manage/contracts">Sửa hợp đồng</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/manage/kpi">Giao KPI</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
