import { Redirect } from "expo-router";
import { MAIN_ROUTES } from "@/src/constant/routes";
import { useAppSelector } from "@/src/hooks/hooks";
import { useEffect, useState } from "react";

export default function Index() {
  const accessToken = useAppSelector((state) => state.user.accessToken);
  const [isReady, setIsReady] = useState(false);

  console.log("accessToken", accessToken);

  useEffect(() => {
    // Small delay to ensure Redux state is hydrated
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return null;
  }

  // If access token exists, redirect to dashboard home
  if (accessToken) {
    return <Redirect href={`/(main)/${MAIN_ROUTES.DASHBOARD}/(home)` as any} />;
    // return <Redirect href={`/${MAIN_ROUTES.COMPLETE_PROFILE}`} />;
  }

  // Otherwise, redirect to role screen
  return <Redirect href={`/${MAIN_ROUTES.ROLE}`} />;
  // return <Redirect href={`/${MAIN_ROUTES.DASHBOARD}`} />;
}
