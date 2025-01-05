import { all } from "effection";
import { type JSXElement } from "revolution";

import { SitemapRoute } from "../plugins/sitemap.ts";
import { useAppHtml } from "./app.html.tsx";
import { ApiReference, getApiForLatestTag } from "./api-reference-route.tsx";
import { extractVersion, Repository } from "../resources/repository.ts";
import { PackageExports } from "../components/package/exports.tsx";
import { DocPage } from "../hooks/use-deno-doc.tsx";

export function apiIndexRoute({
  library,
}: {
  library: Repository;
}): SitemapRoute<JSXElement> {
  return {
    handler: function* () {
      try {
        const [[v3ref, v3docs], [v4ref, v4docs]] = yield* all([
          getApiForLatestTag(library, "effection-v3"),
          getApiForLatestTag(library, "effection-v4"),
        ]);

        if (!v3ref)
          throw new Error(`Could not retrieve a tag for "effection-v3"`);
        if (!v3docs)
          throw new Error(`Cound not retrieve docs for "effection-v3"`);

        const v3pkg = yield* v3ref.loadRootPackage();

        if (!v3pkg)
          throw new Error(`Could not retrieve root package from ${v3ref.ref}`);

        const AppHtml = yield* useAppHtml({
          title: `API Reference | Effection`,
          description: `API Reference for Effection`,
        });

        const version = extractVersion(v3ref.name);

        return (
          <AppHtml>
            <>
              {
                yield* ApiReference({
                  pages: v3docs["."],
                  current: "",
                  ref: v3ref,
                  linkResolver: linkResolver("v3"),
                  content: (
                    <>
                      <h1>API Reference</h1>
                      <h2>Current: v{version}</h2>
                      <>
                        {
                          yield* PackageExports({
                            pkg: v3pkg,
                            linkResolver: linkResolver("v3"),
                          })
                        }
                      </>
                    </>
                  ),
                })
              }
            </>
          </AppHtml>
        );
      } catch (e) {
        console.error(e);
        const AppHTML = yield* useAppHtml({
          title: `Encountered an error fetching API reference.`,
          description: `Encountered an error fetching API reference.`,
        });
        return (
          <AppHTML>
            <p>Failed to load due to an error.</p>
          </AppHTML>
        );
      }
    },
  };
}

function linkResolver(version: string) {
  return function* (doc: DocPage) {
    return `/api/${version}/${doc.name}`;
  };
}