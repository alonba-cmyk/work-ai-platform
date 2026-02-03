import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./app/App.tsx";
import AdminApp from "./admin/AdminApp.tsx";
import { BusinessValuesProvider } from "./contexts/BusinessValuesContext.tsx";
import { VibeThemeProvider } from "./contexts/VibeThemeContext.tsx";
import "./styles/index.css";

// Note: SidekickThemeProvider is now inside App.tsx and AdminApp.tsx
// so it can receive themes from Supabase site settings
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <BusinessValuesProvider>
      <VibeThemeProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/admin" element={<AdminApp />} />
        </Routes>
      </VibeThemeProvider>
    </BusinessValuesProvider>
  </BrowserRouter>
);
