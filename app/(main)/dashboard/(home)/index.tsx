import React from "react";
import { useAppSelector } from "@/src/hooks/hooks";
import HomeScreen from "@/src/components/dashboard/home";
import HomeClientScreen from "@/src/components/dashboard/homeClient";

export default function Home() {
  const userRole = useAppSelector((state) => state.user.userRole);

  if (userRole === "staff") {
    return <HomeClientScreen />;
  }

  return <HomeScreen />;
}

