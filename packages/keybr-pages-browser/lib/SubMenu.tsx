import { Pages } from "@keybr/pages-shared";
import { Link as StaticLink } from "@keybr/widget";
import { useIntl } from "react-intl";
import { Link as RouterLink } from "react-router";
import * as styles from "./SubMenu.module.less";

export function SubMenu(_props: { readonly currentPath?: string } = {}) {
  const { formatMessage } = useIntl();
  return (
    <div className={styles.root}>
      <GithubLink />
      <KeybrLink />
      <RouterLink to={Pages.termsOfService.path}>
        {formatMessage(Pages.termsOfService.link.label)}
      </RouterLink>
      <RouterLink to={Pages.privacyPolicy.path}>
        {formatMessage(Pages.privacyPolicy.link.label)}
      </RouterLink>
    </div>
  );
}

function GithubLink() {
  const { formatMessage } = useIntl();
  return (
    <StaticLink
      href="https://github.com/congyuemao/hangulbr"
      target="github"
      title={formatMessage({
        id: "footer.githubLink.description",
        defaultMessage:
          "The source code of Hangul Typing Trainer is available on GitHub.",
      })}
    >
      Github
    </StaticLink>
  );
}

function KeybrLink() {
  const { formatMessage } = useIntl();
  return (
    <StaticLink
      href="https://www.keybr.com/"
      target="keybr"
      title={formatMessage({
        id: "footer.keybrLink.description",
        defaultMessage:
          "For other languages and keyboard layouts, use keybr.com.",
      })}
    >
      keybr.com
    </StaticLink>
  );
}
