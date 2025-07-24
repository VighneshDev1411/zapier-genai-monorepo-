"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginSuccessRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token"); // ✅ fix here
    if (token) {
      localStorage.setItem("zapier_token", token);
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-black text-lg">
      Redirecting...
    </div>
  );
}
