import { equal } from "node:assert/strict";
import { test } from "node:test";
import { FakeIntlProvider, PreferredLocaleContext } from "@keybr/intl";
import { PageDataContext } from "@keybr/pages-shared";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { isNotNull } from "rich-assert";
import { SubMenu } from "./SubMenu.tsx";

test("render", () => {
  const r = render(
    <PageDataContext.Provider
      value={{
        base: "https://www.keybr.com/",
        locale: "en",
        user: null,
        publicUser: {
          id: "userId",
          name: "userName",
          imageUrl: "imageUrl",
          premium: false,
        },
        settings: null,
      }}
    >
      <PreferredLocaleContext.Provider value="pl">
        <FakeIntlProvider>
          <MemoryRouter>
            <SubMenu currentPath="/page" />
          </MemoryRouter>
        </FakeIntlProvider>
      </PreferredLocaleContext.Provider>
    </PageDataContext.Provider>,
  );

  isNotNull(r.queryByText("Github"));
  equal(
    r.getByText("Github").getAttribute("href"),
    "https://github.com/congyuemao/hangulbr",
  );
  isNotNull(r.queryByText("keybr.com"));
  isNotNull(r.queryByText("Terms of Service"));
  isNotNull(r.queryByText("Privacy Policy"));

  r.unmount();
});
