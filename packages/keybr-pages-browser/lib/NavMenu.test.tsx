import { equal } from "node:assert/strict";
import { test } from "node:test";
import { FakeIntlProvider, PreferredLocaleContext } from "@keybr/intl";
import { PageDataContext } from "@keybr/pages-shared";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { isNotNull } from "rich-assert";
import { NavMenu } from "./NavMenu.tsx";

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
            <NavMenu currentPath="/page" />
          </MemoryRouter>
        </FakeIntlProvider>
      </PreferredLocaleContext.Provider>
    </PageDataContext.Provider>,
  );

  equal(r.queryByText("userName"), null);
  isNotNull(r.queryByText("Practice"));
  isNotNull(r.queryByText("Help"));
  isNotNull(r.queryByText("English"));
  isNotNull(r.queryByText("中文"));
  isNotNull(r.queryByText("keybr.com"));

  r.unmount();
});
