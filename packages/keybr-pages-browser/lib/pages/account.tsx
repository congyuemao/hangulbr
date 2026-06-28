import { AccountPage } from "@keybr/page-account";
import { Pages } from "@keybr/pages-shared";
import { KEYBR_STATIC } from "../static.ts";
import { StaticNotice } from "../StaticNotice.tsx";

export default function Page() {
  if (KEYBR_STATIC) {
    return <StaticNotice feature={Pages.account.title} />;
  }
  return <AccountPage />;
}
