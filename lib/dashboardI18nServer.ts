import { cookies } from "next/headers";
import {
  dashboardLanguageCookieName,
  normalizeDashboardLanguage,
} from "@/lib/dashboardI18n";

export async function getDashboardLanguage() {
  const cookieStore = await cookies();
  return normalizeDashboardLanguage(
    cookieStore.get(dashboardLanguageCookieName)?.value,
  );
}
