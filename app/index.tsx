import { Redirect } from "expo-router";
import { MAIN_ROUTES } from "@/src/constant/routes";

export default function Index() {
  return <Redirect href={`/${MAIN_ROUTES.ROLE}`} />;
  // return <Redirect href={`/${MAIN_ROUTES.COMPLETE_PROFILE}`} />;
}

