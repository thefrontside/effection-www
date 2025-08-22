import { call, type Operation, resource } from "effection";
import { Endpoints, RequestParameters } from "npm:@octokit/types@13.6.2";

import { GithubClientContext } from "../context/github.ts";
import {
  loadRepositoryRef,
  REF_PATTERN,
  RepositoryRef,
} from "./repository-ref.ts";
import { extractVersion, rsort } from "../lib/semver.ts";

export interface Repository {
  name: string;

  owner: string;

  nameWithOwner: string;

  get(): Operation<
    Endpoints["GET /repos/{owner}/{repo}"]["response"]["data"]
  >;

  starCount(): Operation<number>;

  /**
   * Retrieve tags for the current repository.
   *
   * Optionally, filter tags using a glob. It should accept the same arguement as we use to trigger a push event.
   *
   * For example:
   *  - v*
   *  - v3*
   *  - effection-v3*
   *
   * Should are valid glob patterns
   *
   * @returns tag objects
   */
  tags(
    searchQuery?: string,
  ): Operation<
    { name: string }[]
  >;

  /**
   * Find the latest Semver tag that matches a specific search query.
   *
   * @param glob
   * @returns a tag if found or undefined
   */
  getLatestSemverTag(
    searchQuery: string,
  ): Operation<{ name: string } | undefined>;

  /**
   * Get a list of versions from tags matching a major version
   * @param major
   * return list of tags
   */
  getSemverTags(major: string): Operation<string[] | undefined>;

  /**
   * Get contents of a repository
   *
   * @param params.path path to the content
   * @param params.ref optional branch, tag or commit (defaults to default branch when emitted)
   * @returns
   */
  getContent(
    params:
      & Omit<
        Endpoints["GET /repos/{owner}/{repo}/contents/{path}"]["parameters"],
        "owner" | "repo"
      >
      & RequestParameters,
  ): Operation<
    Endpoints["GET /repos/{owner}/{repo}/contents/{path}"]["response"]
  >;

  loadRef(
    ref?: string | undefined,
  ): Operation<RepositoryRef>;
}

export function loadRepository(
  { owner, name }: { owner: string; name: string },
) {
  return resource<Repository>(function* (provide) {
    const github = yield* GithubClientContext.expect();

    const repository: Repository = {
      nameWithOwner: `${owner}/${name}`,
      owner,
      name,

      *get() {
        const result = yield* call(() =>
          github.rest.repos.get({
            repo: name,
            owner: owner,
          })
        );

        return result.data;
      },
      *starCount() {
        const repo = yield* repository.get();

        return repo.stargazers_count;
      },
      *tags(
        searchQuery: string,
      ) {
        const result = yield* call(() =>
          github.graphql<
            { repository: { refs: { nodes: { name: string }[] } } }
          >(
            /* GraphQL */ `
            query RepositoryTags($owner: String!, $name: String!, $searchQuery: String!) {
              repository(owner: $owner, name: $name) {
                refs(query: $searchQuery, refPrefix: "refs/tags/", first: 100) {
                  nodes {
                    name
                  }
                }
              }
            }
            `,
            {
              name: name,
              owner: owner,
              searchQuery,
            },
          )
        );

        return result.repository.refs.nodes;
      },
      *getSemverTags(major: string) {
        const tags = yield* this.tags(`tags/effection-v${major}*`);

        return rsort(
          tags.map((tag) => tag.name).map(extractVersion),
        );
      },
      *getLatestSemverTag(glob: string) {
        const tags = yield* this.tags(glob);

        const [latest] = rsort(
          tags.map((tag) => tag.name).map(extractVersion),
        );

        return tags.find((tag) => tag.name.endsWith(latest));
      },
      *getContent(
        params:
          & Omit<
            Endpoints["GET /repos/{owner}/{repo}/contents/{path}"][
              "parameters"
            ],
            "owner" | "repo"
          >
          & RequestParameters,
      ): Operation<
        Endpoints["GET /repos/{owner}/{repo}/contents/{path}"]["response"]
      > {
        const response = yield* call(() =>
          github.rest.repos.getContent({
            repo: name,
            owner: owner,
            ...params,
          })
        );

        return response;
      },
      *loadRef(ref?: string | undefined): Operation<RepositoryRef> {
        if (!ref) {
          const repository = yield* this.get();
          ref = `heads/${repository.default_branch}`;
        }
        const parts = ref.match(REF_PATTERN);
        if (parts) {
          ref = parts[0];
        } else {
          throw new Error(
            `Expected ref in format heads/<ref> or tags/<ref> (refs/ is ignored) but got ${ref}`,
          );
        }
        return loadRepositoryRef({ ref, repository });
      },
    };

    yield* provide(repository);
  });
}
