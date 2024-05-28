"use client";

import React, { createContext, useState, useEffect, useContext } from "react";

type DisplayNavContextType = {
  displayNav: string[];
  setDisplayNav: (items: string[]) => void;
};

const DisplayNavContext = createContext<DisplayNavContextType | undefined>(
  undefined
);

export const DisplayNavProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [displayNav, setDisplayNav] = useState<string[]>([]);

  useEffect(() => {
    // Check if window is defined (we are on client)
    if (typeof window !== "undefined") {
      let savedSettings = localStorage.getItem("displayNav");
      if (!savedSettings) {
        // Default values
        savedSettings = JSON.stringify(["overview", "documents", "favorites"]);
        localStorage.setItem("displayNav", savedSettings);
      }
      setDisplayNav(JSON.parse(savedSettings) as string[]);
    }
  }, []);

  const updateDisplayNav = (items: string[]) => {
    setDisplayNav(items);
    // Check if window is defined (we are on client)
    if (typeof window !== "undefined") {
      localStorage.setItem("displayNav", JSON.stringify(items));
    }
  };

  return (
    <DisplayNavContext.Provider
      value={{ displayNav, setDisplayNav: updateDisplayNav }}
    >
      {children}
    </DisplayNavContext.Provider>
  );
};

export const useDisplayNav = () => {
  const context = useContext(DisplayNavContext);
  if (context === undefined) {
    throw new Error("useDisplayNav must be used within a DisplayNavProvider");
  }
  return context;
};
