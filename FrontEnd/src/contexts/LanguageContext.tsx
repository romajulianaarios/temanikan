import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from '../translations';

type Language = 'id' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Load from localStorage or default to 'id'
    const savedLanguage = localStorage.getItem('temanikan_language') as Language;
    return savedLanguage === 'en' || savedLanguage === 'id' ? savedLanguage : 'id';
  });

  useEffect(() => {
    // Save to localStorage whenever language changes
    localStorage.setItem('temanikan_language', language);
    
    // Trigger a re-render for all components using translations
    window.dispatchEvent(new Event('languagechange'));
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    let text = translations[language]?.[key] || translations['id']?.[key] || key;
    
    // Replace parameters like {name} with actual values
    if (params) {
      Object.keys(params).forEach(param => {
        text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), String(params[param]));
      });
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Alias for convenience
export function useTranslation() {
  const { t } = useLanguage();
  return t;
}
