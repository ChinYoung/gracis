import { useState } from "react";

export const useIsDarkTheme = () => {
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(true)
  return { isDarkTheme }
}