import type { JSXChild, JSXHandler } from "revolution";

import { useAppHtml } from "./app.html.tsx";
import { Footer } from "../components/footer.tsx";
import { IconTSLogo } from "../components/icons/typescript.tsx";

export function indexRoute(): JSXHandler {
  return function* () {
    let AppHtml = yield* useAppHtml({ title: `Effection` });

    return (
      <AppHtml>
        <>
          <article class="p-4 md:px-12 mb-16">
            <section class="grid grid-cols-1 md:grid-cols-3 md:gap-4">
              <hgroup class="text-center col-span-1 md:col-span-3 my-8">
                <img
                  class="inline max-w-[30%] mb-4"
                  alt="Effection Logo"
                  src="/assets/images/icon-effection.svg"
                  width={144}
                  height={144}
                />
                <h1 class="text-4xl font-bold leading-7">Effection</h1>
                <p class="text-2xl py-4 mb-6">
                  Structured Concurrency and Effects for JavaScript
                </p>
                <div>
                  <a
                    class="inline-block md:inline mt-2 p-2 mr-2 text-md text-white w-full border-blue-900 border-solid border-2 rounded bg-blue-900 hover:bg-blue-800 transition-colors md:px-4"
                    href="/docs/introduction"
                  >
                    Get Started
                  </a>
                  <a
                    class="inline-block md:inline mt-2 p-2 text-md text-blue-900 bg-white hover:bg-blue-100 transition border-blue-900 border-solid border-2 w-full rounded md:px-4"
                    href="https://deno.land/x/effection/mod.ts"
                  >
                    API Reference
                  </a>
                </div>
              </hgroup>
            </section>

            <section class="my-20 mx-auto max-w-7xl px-6 lg:px-8">
              <hgroup class="mx-auto max-w-2xl lg:text-center">
                <h2 class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Stop worrying about asynchrony
                </h2>
                <p class="mt-6 text-lg leading-8 text-gray-600">
                  Effection gives you control over asyncronous operations with{" "}
                  <a href="/docs/thinking-in-effection">
                    Structured Concurrency guarantees
                  </a>
                  . We ensure that all asyncronous operations are well behaved
                  so you can focus on using async instead of managing it.
                </p>
              </hgroup>
              <div class="mx-auto mt-8 max-w-2xl sm:mt-12 lg:mt-16 lg:max-w-4xl grid grid-cols-2 gap-y-4">
                <Feature icon={"🛡️"} summary={"Leak proof"}>
                  Effection code cleans up after itself, and that means never
                  having to remember to manually close a resource or detach a
                  listener.
                </Feature>

                <Feature icon={"🖐️"} summary="Halt any operation">
                  An Effection operation can be shut down at any moment which
                  will not only stop it completely but also stop any other
                  operations that it started.
                </Feature>

                <Feature icon={"🔒"} summary="Race condition free">
                  Unlike Promises and async/await, Effection is fundamentally
                  synchronous in nature, which means you have full control over
                  the event loop and operations requiring synchronous setup
                  remain race condition free.
                </Feature>

                <Feature icon={"🎹"} summary="Seamless composition">
                  Since all Effection code is well behaved, it clicks together
                  easily, and there are no nasty surprises when fitting
                  different pieces together.
                </Feature>
              </div>
            </section>
            <section class="my-20">
              <hgroup class="mx-auto max-w-2xl lg:text-center">
                <h2 class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  It's just JavaScript
                </h2>
                <p class="mt-6 text-lg leading-8 text-gray-600">
                  Effection is a light-weight alternative to{" "}
                  <code>async/await</code> with Structured Concurrency
                  guarantees. It only requires adding a few new JavaScript
                  techniques to the knowledge you already have.
                </p>
              </hgroup>
              {/* No build steps. No esoteric APIs, and no new odd-ball
              paradigms to learn; Effection leans into JavaScript's natural
              constructs at every turn, so code always feels intuitive. */}
              <div class="mx-auto mt-8 max-w-2xl sm:mt-12 lg:mt-16 lg:max-w-4xl grid grid-cols-2 gap-y-4">
                <Feature icon={"😎"} summary="Use familiar language constructs">
                  <>
                    Use <code>let</code>, <code>const</code>, <code>for</code>,{" "}
                    <code>while</code>, <code>switch/case</code> and{" "}
                    <code>try/catch/finally</code> to write asyncrous
                    operations. They work as you'd expect.
                  </>
                </Feature>
                <Feature
                  icon={<IconTSLogo />}
                  summary="First-class TypeScript Support"
                >
                  <>
                    Use in TypeScript or JavaScript projects without modifying
                    your build setup. Effection operations can be used and
                    distributed in pure ESM code.
                  </>
                </Feature>
                <Feature icon={"😵‍💫"} summary="No esoteric APIs">
                  <>
                    Small API focused excusively on what you need to gain
                    Structured Concurrency guarantees in
                    JavaScript and nothing else.
                  </>
                </Feature>
                <Feature icon={"💎"} summary="No build step">
                  <>
                    Use in TypeScript or JavaScript projects without modifying
                    your build setup. Effection operations can be used and
                    distributed in pure ESM code.
                  </>
                </Feature>
                <Feature icon={"💪"} summary="Small but powerful">
                  <>
                    Everything you need comes in one dependency-free package. At
                    less than 5KB minified and gzipped, Effection can be dropped
                    into any project.
                  </>
                </Feature>
              </div>
            </section>
            <Footer />
          </article>
        </>
      </AppHtml>
    );
  };
}

function Feature({
  summary,
  icon,
  children,
}: {
  summary: string;
  icon: JSXChild;
  children: JSXChild;
}) {
  return (
    <div class="relative pl-16">
      <dt class="text-base font-semibold leading-7 text-gray-900">
        <div class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg text-4xl">
          {icon}
        </div>
        {summary}
      </dt>
      <dd class="mt-2 text-base leading-7 text-gray-600">{children}</dd>
    </div>
  );
}
