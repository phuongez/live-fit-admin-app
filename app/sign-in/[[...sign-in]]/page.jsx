import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center pt-10 bg-white">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-[#FFC300] hover:bg-[#e6b100] text-black font-semibold rounded-lg transition-all duration-200",
            formFieldInput:
              "border-gray-300 focus:border-[#FFC300] focus:ring-[#FFC300]",
            card: "shadow-xl border border-gray-100",
          },
          variables: {
            colorPrimary: "#FFC300", // màu chủ đạo vàng LiveFit
            colorBackground: "white",
            colorText: "#000000",
            fontSize: "16px",
          },
        }}
        localization={{
          signIn: {
            start: {
              title: "Đăng nhập LiveFit",
              subtitle: "Chào mừng bạn trở lại hệ thống",
              actionText: "Đăng nhập",
            },
          },
        }}
      />
    </div>
  );
}
