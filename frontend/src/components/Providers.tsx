"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { I18nProvider } from "@/lib/i18n";

const theme = createTheme({
  palette: { primary: { main: "#0B5D2A", dark: "#063B1F" }, secondary: { main: "#4C9F38" } },
  shape: { borderRadius: 14 },
  typography: { fontFamily: "var(--font-inter), system-ui, sans-serif", button: { textTransform: "none", fontWeight: 800 } },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={theme}><I18nProvider>{children}</I18nProvider></ThemeProvider>;
}
