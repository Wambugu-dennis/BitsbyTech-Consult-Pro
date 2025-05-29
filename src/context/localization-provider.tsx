
// src/context/localization-provider.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { format as formatDateFns } from 'date-fns';
// For full date-fns localization:
// import { enUS, es } from 'date-fns/locale';
// const dateFnsLocales = { en: enUS, es: es };

import {
  languagePacks,
  defaultLanguage,
  defaultRegion,
  type SupportedLanguage,
  type SupportedRegion,
  type LanguagePack,
} from '@/lib/i18n-config';

interface LocalizationContextState {
  language: SupportedLanguage;
  region: SupportedRegion;
  setLanguage: (language: SupportedLanguage) => void;
  setRegion: (region: SupportedRegion) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
  formatDate: (date: Date) => string;
  currentLanguagePack: LanguagePack;
}

const LocalizationContext = createContext<LocalizationContextState | undefined>(undefined);

const LANG_STORAGE_KEY = 'consult-vista-lang';
const REGION_STORAGE_KEY = 'consult-vista-region';

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    if (typeof window !== 'undefined') {
      const storedLang = localStorage.getItem(LANG_STORAGE_KEY) as SupportedLanguage | null;
      return storedLang && languagePacks[storedLang] ? storedLang : defaultLanguage;
    }
    return defaultLanguage;
  });

  const [region, setRegionState] = useState<SupportedRegion>(() => {
    if (typeof window !== 'undefined') {
      const storedRegion = localStorage.getItem(REGION_STORAGE_KEY) as SupportedRegion | null;
      return storedRegion || defaultRegion;
    }
    return defaultRegion;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANG_STORAGE_KEY, language);
    }
  }, [language]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(REGION_STORAGE_KEY, region);
    }
  }, [region]);

  const setLanguage = (lang: SupportedLanguage) => {
    if (languagePacks[lang]) {
      setLanguageState(lang);
    }
  };

  const setRegion = (reg: SupportedRegion) => {
    setRegionState(reg);
  };

  const currentLanguagePack = languagePacks[language] || languagePacks[defaultLanguage];

  const t = (key: string, replacements?: Record<string, string | number>): string => {
    let translation = currentLanguagePack.translations[key] || languagePacks[defaultLanguage].translations[key] || key;
    if (replacements) {
      Object.keys(replacements).forEach((placeholder) => {
        translation = translation.replace(
          new RegExp(`\\{${placeholder}\\}`, 'g'),
          String(replacements[placeholder])
        );
      });
    }
    return translation;
  };

  const formatDate = (date: Date): string => {
    // const locale = currentLanguagePack.dateFnsLocale || dateFnsLocales[defaultLanguage];
    // For a simpler simulation without dynamic locale imports for date-fns:
    try {
      return formatDateFns(date, currentLanguagePack.dateFormat /*, { locale }*/);
    } catch (error) {
      console.error("Error formatting date, falling back to default:", error);
      return formatDateFns(date, languagePacks[defaultLanguage].dateFormat);
    }
  };

  return (
    <LocalizationContext.Provider
      value={{ language, region, setLanguage, setRegion, t, formatDate, currentLanguagePack }}
    >
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
}

    