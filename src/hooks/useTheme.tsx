import { useContext } from "react";
import { ThemeContext } from "../context/theme.context";

const useTheme = () => {
  const theme = useContext(ThemeContext);
  if (theme === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return theme;
};

export default useTheme;
