import { JSXChild, useParams, type JSXElement } from "revolution";

import { SitemapRoute } from "../plugins/sitemap.ts";
import { useAppHtml } from "./app.html.tsx";
import { Repository } from "../resources/repository.ts";
import { DocPage } from "../hooks/use-deno-doc.tsx";
import { compare, extractVersion } from "../lib/semver.ts";
import { fetchMinorVersions } from "./api-index-route.tsx";
import { ResolveLinkFunction } from "../hooks/use-markdown.tsx";
import { createChildURL } from "./links-resolvers.ts";

export function apiMinorIndexRoute({
  library,
}: {
  library: Repository;
}): SitemapRoute<JSXElement> {
  return {
    *routemap(generate) {
      // skip the first version because it's covered by /api/v3 route
      const [, ...minors] = yield* fetchMinorVersions({
        repository: library,
        pattern: "effection-v3",
      });

      return minors.map(([minor]) => ({
        pathname: generate({
          minor,
        }),
      }));
    },
    handler: function* () {
      let { minor } = yield* useParams<{ minor: string }>();

      try {
        const latest = yield* library.getLatestSemverTag("effection-v3");

        if (!latest)
          throw new Error(
            `Failed to retrieve latest version for "effection-v3" tag`,
          );

        const tag = yield* library.getLatestSemverTag(minor);

        if (!tag) throw new Error(`Failed to retrieve latest tag for ${minor}`);

        const ref = yield* library.loadRef(`tags/${tag.name}`);

        const pkg = yield* ref.loadRootPackage();

        if (!pkg) throw new Error(`Failed to load root package for ${minor}`);

        const pages = (yield* pkg.docs())["."];

        const version = extractVersion(tag.name);
        const latestVersion = extractVersion(latest.name);

        const AppHtml = yield* useAppHtml({
          title: `${version} | API Reference | Effection`,
          description: `API Reference for Effection v${version}`,
        });

        const outdated = compare(version, latestVersion) < 0;

        return (
          <AppHtml>
            <article class="prose m-auto">
              {outdated ? (
                <Alert level="info" class="mb-6">
                  <p>
                    Version {version} is behind the current release:{" "}
                    <a class="underline font-bold" href={`/api/v3`}>
                      jump to latest version
                    </a>{" "}
                    ({latestVersion}).
                  </p>
                </Alert>
              ) : (
                <></>
              )}
              <h1>{version}</h1>
              <section>
                <h2>API Reference</h2>
                <p>This release includes the following exports:</p>
                <ul class="columns-3">
                  {
                    yield* listPages({
                      pages,
                      linkResolver: createChildURL(),
                    })
                  }
                </ul>
              </section>
            </article>
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

export function* listPages({
  pages,
  linkResolver,
}: {
  pages: DocPage[];
  linkResolver: ResolveLinkFunction;
}) {
  const elements = [];

  for (const page of pages.sort((a, b) => a.name.localeCompare(b.name))) {
    const link = yield* linkResolver(page.name);
    elements.push(
      <li>
        <a href={link}>{page.name}</a>
      </li>,
    );
  }
  return <>{elements}</>;
}

const ALERT_LEVELS = {
  warning: "bg-orange-100 border-orange-500 text-orange-700",
  error: "bg-red-100 border-red-400 text-red-700",
  info: "bg-blue-100 border-blue-500 text-blue-700",
} as const;

export function Alert({
  title,
  children,
  class: className,
  level,
}: {
  title?: string;
  level: "info" | "warning" | "error";
  children: JSXChild;
  class?: string;
}) {
  return (
    <div
      class={`${className ?? ""} ${ALERT_LEVELS[level]} border-l-4 p-4 [&>p]:my-1`}
      role="alert"
    >
      {title ? <p class="font-bold">{title}</p> : <></>}
      {children}
    </div>
  );
}