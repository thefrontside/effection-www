// @ts-nocheck Property 'svg' does not exist on type 'JSX.IntrinsicElements'.deno-ts(2339)
import { JSXComponentProps } from "revolution/jsx-runtime";

export const IconExternal = (props: JSXComponentProps = {}) => (
  <svg
    class={props.class ?? "inline"}
    width={props.width ?? "13.5"}
    height={props.height ?? "13.5"}
    aria-hidden="true"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"
    >
    </path>
  </svg>
);
