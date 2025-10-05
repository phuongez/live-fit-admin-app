import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors",
            formButtonText: "text-white text-base", // đổi màu chữ
          },
          variables: {
            colorPrimary: "#4F46E5", // màu chính (indigo)
          },
        }}
        localization={{
          signIn: {
            start: {
              title: "Đăng ký LiveFit",
              subtitle: "Đăng ký tài khoản để sử dụng",
              actionText: "Đăng ký",
            },
          },
        }}
      />
    </div>
  );
}
