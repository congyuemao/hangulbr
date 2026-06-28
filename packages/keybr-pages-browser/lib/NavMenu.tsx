import { type PageInfo, Pages } from "@keybr/pages-shared";
import { Icon } from "@keybr/widget";
import { clsx } from "clsx";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";
import { NavLink, useLocation } from "react-router";
import * as styles from "./NavMenu.module.less";
import { SubMenu } from "./SubMenu.tsx";
import { ThemeSwitcher } from "./themes/ThemeSwitcher.tsx";

export function NavMenu(_props: { readonly currentPath?: string } = {}) {
  return (
    <div className={styles.root}>
      <MenuItem>
        <ThemeSwitcher />
      </MenuItem>

      <MenuItem>
        <MenuItemLink page={Pages.practice} />
      </MenuItem>

      <MenuItem>
        <MenuItemLink page={Pages.help} />
      </MenuItem>

      <MenuItem>
        <LanguageSwitcher />
      </MenuItem>

      <MenuItem>
        <SubMenu />
      </MenuItem>
    </div>
  );
}

function MenuItem({ children }: { readonly children: ReactNode }) {
  return <div className={styles.item}>{children}</div>;
}

function MenuItemLink({
  page: {
    path,
    link: { label, title, icon },
  },
}: {
  readonly page: PageInfo;
}) {
  const { formatMessage } = useIntl();
  return (
    <NavLink
      className={({ isActive }) =>
        clsx(styles.link, isActive && styles.isActive)
      }
      to={path}
      title={title && formatMessage(title)}
    >
      <Icon className={styles.icon} shape={icon ?? ""} />
      <span className={styles.label}>{formatMessage(label)}</span>
    </NavLink>
  );
}

const languageLinks = [
  { locale: "en", label: "English", title: "English" },
  { locale: "zh-hans", label: "中文", title: "简体中文" },
];

function LanguageSwitcher() {
  const { locale } = useIntl();
  const { pathname, search, hash } = useLocation();
  const path = pathname === "" ? "/" : pathname;

  return (
    <div className={styles.languageSwitcher} aria-label="Language">
      {languageLinks.map(({ locale: targetLocale, label, title }) => {
        const isActive =
          targetLocale === "en" ? locale === "en" : locale.startsWith("zh");
        return (
          <a
            key={targetLocale}
            className={clsx(
              styles.languageLink,
              isActive && styles.isActive,
            )}
            href={`${Pages.intlPath(path, targetLocale)}${search}${hash}`}
            hrefLang={targetLocale}
            lang={targetLocale}
            title={title}
            aria-current={isActive ? "true" : undefined}
          >
            {label}
          </a>
        );
      })}
    </div>
  );
}
