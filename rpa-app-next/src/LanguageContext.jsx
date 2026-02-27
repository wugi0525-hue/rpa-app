"use client";
import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        const savedLang = localStorage.getItem('rpa_language');
        if (savedLang) {
            setLanguage(savedLang);
        } else {
            const browserLang = (navigator.language || navigator.userLanguage || "en").toLowerCase();
            if (browserLang.startsWith('ko')) setLanguage('ko');
            else if (browserLang.startsWith('zh')) setLanguage('zh');
            else if (browserLang.startsWith('ja')) setLanguage('ja');
            else if (browserLang.startsWith('th')) setLanguage('th');
            else setLanguage('en');
        }
    }, []);

    const changeLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('rpa_language', lang);
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
