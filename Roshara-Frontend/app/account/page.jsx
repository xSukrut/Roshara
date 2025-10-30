"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AccountIndex() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/account/orders"); 
  }, [router]);
  return null;
}
