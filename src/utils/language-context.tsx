import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface Translations {
  [key: string]: any;
}

interface LanguageContextType {
  language: string;
  translations: Translations;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  languages: Language[];
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  translations: {},
  setLanguage: () => {},
  t: (key: string) => key,
  languages: []
});

export const useLanguage = () => useContext(LanguageContext);

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '/images/flag-en.svg' },
  { code: 'de', name: 'Deutsch', flag: '/images/flag-de.svg' },
  { code: 'no', name: 'Norsk', flag: '/images/flag-no.svg' },
  { code: 'is', name: 'Íslenska', flag: '/images/flag-is.svg' },
  { code: 'pl', name: 'Polski', flag: '/images/flag-pl.svg' },
  { code: 'ro', name: 'Română', flag: '/images/flag-ro.svg' }
];

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<string>('en');
  const [translations, setTranslations] = useState<Translations>({});

  const loadTranslations = async (lang: string): Promise<void> => {
    try {
      const response = await fetch(`/translations/${lang}.json`);
      const data = await response.json();
      setTranslations(data);
    } catch (error) {
      console.error(`Failed to load translations for ${lang}:`, error);
      // Fallback to English if loading fails
      if (lang !== 'en') {
        const response = await fetch('/translations/en.json');
        const data = await response.json();
        setTranslations(data);
      }
    }
  };

  const setLanguage = (lang: string): void => {
    setLanguageState(lang);
    localStorage.setItem('arctic-workforce-language', lang);
    loadTranslations(lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  useEffect(() => {
    // Load saved language or default to English
    const savedLanguage = localStorage.getItem('arctic-workforce-language') || 'en';
    setLanguageState(savedLanguage);
    loadTranslations(savedLanguage);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, translations, setLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
}