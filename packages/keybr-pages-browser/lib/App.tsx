import { ErrorHandler } from "@keybr/debug";
import { defaultLocale } from "@keybr/intl";
import {
  getPageData,
  LoadingProgress,
  PageDataContext,
  Pages,
  Root,
} from "@keybr/pages-shared";
import { SettingsLoader } from "@keybr/settings-loader";
import { querySelector } from "@keybr/widget";
import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { useIntl } from "react-intl";
import { BrowserRouter, Route, Routes } from "react-router";
import { IntlLoader } from "./loader/IntlLoader.tsx";
import { Template } from "./Template.tsx";
import { ThemeProvider } from "./themes/ThemeProvider.tsx";
import { Title } from "./Title.tsx";

export function main() {
  createRoot(querySelector(Root.selector)).render(<App />);
}

const AccountPage = lazy(() => import("./pages/account.tsx"));
const HelpPage = lazy(() => import("./pages/help.tsx"));
const PracticePage = lazy(() => import("./pages/practice.tsx"));
const ProfilePage = lazy(() => import("./pages/profile.tsx"));
const TermsOfServicePage = lazy(() => import("./pages/terms-of-service.tsx"));
const PrivacyPolicyPage = lazy(() => import("./pages/privacy-policy.tsx"));

export function App() {
  return (
    <PageDataContext.Provider value={getPageData()}>
      <ErrorHandler>
        <IntlLoader>
          <SettingsLoader>
            <ThemeProvider>
              <PageRoutes />
            </ThemeProvider>
          </SettingsLoader>
        </IntlLoader>
      </ErrorHandler>
    </PageDataContext.Provider>
  );
}

function PageRoutes() {
  const { locale } = useIntl();
  return (
    <BrowserRouter basename={computeBasename(locale)}>
      <Routes>
        <Route
          index={true}
          path={Pages.practice.path}
          element={
            <Template>
              <Title page={Pages.practice} />
              <Suspense fallback={<LoadingProgress />}>
                <PracticePage />
              </Suspense>
            </Template>
          }
        />
        <Route
          path={Pages.account.path}
          element={
            <Template>
              <Title page={Pages.account} />
              <Suspense fallback={<LoadingProgress />}>
                <AccountPage />
              </Suspense>
            </Template>
          }
        />
        <Route
          path={Pages.help.path}
          element={
            <Template>
              <Title page={Pages.help} />
              <Suspense fallback={<LoadingProgress />}>
                <HelpPage />
              </Suspense>
            </Template>
          }
        />
        <Route
          path={`${Pages.profile.path}`}
          element={
            <Template>
              <Title page={Pages.profile} />
              <Suspense fallback={<LoadingProgress />}>
                <ProfilePage />
              </Suspense>
            </Template>
          }
        />
        <Route
          path={`${Pages.profile.path}/:userId`}
          element={
            <Template>
              <Title page={Pages.profile} />
              <Suspense fallback={<LoadingProgress />}>
                <ProfilePage />
              </Suspense>
            </Template>
          }
        />
        <Route
          path={Pages.termsOfService.path}
          element={
            <Template>
              <Title page={Pages.termsOfService} />
              <Suspense fallback={<LoadingProgress />}>
                <TermsOfServicePage />
              </Suspense>
            </Template>
          }
        />
        <Route
          path={Pages.privacyPolicy.path}
          element={
            <Template>
              <Title page={Pages.privacyPolicy} />
              <Suspense fallback={<LoadingProgress />}>
                <PrivacyPolicyPage />
              </Suspense>
            </Template>
          }
        />
        <Route
          path="*"
          element={
            <Template>
              <Title page={Pages.practice} />
              <Suspense fallback={<LoadingProgress />}>
                <PracticePage />
              </Suspense>
            </Template>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function computeBasename(locale: string): string {
  const base = Pages.intlBase(locale);
  if (base !== "") {
    return base;
  }
  if (typeof window === "undefined") {
    return base;
  }
  const m = /^\/([^/]+)(?:\/|$)/.exec(window.location.pathname);
  if (m != null && decodeURIComponent(m[1]).toLowerCase() === defaultLocale) {
    return `/${defaultLocale}`;
  }
  return base;
}
