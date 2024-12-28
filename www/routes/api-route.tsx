import denoJson from "../../deno.json" with { type: "json" };

import type { JSXElement } from "revolution";
import { call } from "effection";

import { useAppHtml } from "./app.html.tsx";
import { SitemapRoute } from "../plugins/sitemap.ts";
import {
  createPackage,
  initPackageContext,
} from "effection-contrib/www/hooks/use-package.tsx";
import { API } from "effection-contrib/www/components/api.tsx";

import { navLinks } from "./index-route.tsx";

function* effectionPkgConfig() {
  return {
    workspace: "effection",
    workspacePath: new URL("./../../", import.meta.url),
    readme: yield* call(() => Deno.readTextFile("../README.md")),
    denoJson,
  };
}

export function apiRoute(): SitemapRoute<JSXElement> {
  return {
    *routemap(generate) {
      const config = yield* effectionPkgConfig();
      const pkg = yield* createPackage(config);

      return pkg.docs["."]
        .map((node) => node.name)
        .filter((value, index, array) => array.indexOf(value) === index)
        .flatMap((symbol) => {
          return [
            {
              pathname: generate({ symbol }),
            },
          ];
        });
    },
    handler: function* () {
      const AppHtml = yield* useAppHtml({ title: "API Reference " });

      yield* initPackageContext(yield* effectionPkgConfig());

      return (
        <AppHtml navLinks={navLinks}>
          <>{yield* API()()}</>
        </AppHtml>
      );
    },
  };
}
