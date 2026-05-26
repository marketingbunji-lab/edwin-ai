"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  dashboardLanguageChangeEvent,
  dashboardLanguageCookieName,
  type DashboardLanguage,
  getDashboardTranslator,
  normalizeDashboardLanguage,
} from "@/lib/dashboardI18n";

type DashboardLanguageContextValue = {
  language: DashboardLanguage;
  setLanguage: (language: DashboardLanguage) => void;
  t: ReturnType<typeof getDashboardTranslator>;
};

const DashboardLanguageContext =
  createContext<DashboardLanguageContextValue | null>(null);

type Props = {
  children: React.ReactNode;
  initialLanguage: DashboardLanguage;
};

function persistDashboardLanguage(language: DashboardLanguage) {
  window.localStorage.setItem(dashboardLanguageCookieName, language);
  document.cookie = `${dashboardLanguageCookieName}=${language}; path=/; max-age=31536000; SameSite=Lax`;
  window.dispatchEvent(new Event(dashboardLanguageChangeEvent));
}

function readStoredLanguage() {
  return normalizeDashboardLanguage(
    window.localStorage.getItem(dashboardLanguageCookieName),
  );
}

export default function DashboardLanguageProvider({
  children,
  initialLanguage,
}: Props) {
  const [language, setLanguageState] = useState<DashboardLanguage>(
    initialLanguage,
  );

  useEffect(() => {
    const syncLanguage = () => {
      const nextLanguage = readStoredLanguage();

      setLanguageState((currentLanguage) =>
        currentLanguage === nextLanguage ? currentLanguage : nextLanguage,
      );
    };

    syncLanguage();
    window.addEventListener("storage", syncLanguage);
    window.addEventListener(dashboardLanguageChangeEvent, syncLanguage);

    return () => {
      window.removeEventListener("storage", syncLanguage);
      window.removeEventListener(dashboardLanguageChangeEvent, syncLanguage);
    };
  }, []);

  const value = useMemo<DashboardLanguageContextValue>(
    () => ({
      language,
      setLanguage: (nextLanguage) => {
        setLanguageState(nextLanguage);
        persistDashboardLanguage(nextLanguage);
      },
      t: getDashboardTranslator(language),
    }),
    [language],
  );

  return (
    <DashboardLanguageContext.Provider value={value}>
      {children}
    </DashboardLanguageContext.Provider>
  );
}

export function useDashboardLanguage() {
  const context = useContext(DashboardLanguageContext);

  if (!context) {
    throw new Error(
      "useDashboardLanguage must be used within DashboardLanguageProvider",
    );
  }

  return context;
}
