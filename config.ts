import { Configliere } from "configliere";
import { z } from "zod";

export const { parse, describeCLI } = new Configliere({
  jsrToken: {
    description: "Token used to read metadata from JSR",
    schema: jsrToken(),
  },
  githubToken: {
    description: "Auth token used to read Effection docs from GitHub",
    schema: githubToken(),
  },
  repository: {
    description: "Git repository from which to source the documentation",
    schema: z.string(),
    default: "thefrontside/effection",
    cli: {
      alias: "r",
    },
  },
});

function githubToken() {
  return z.string()
    .regex(/gh(p|r|o|s)_[a-zA-Z0-9]{36}$/, {
      message: "invalid GitHub OAuth token",
    });
}

function jsrToken() {
  return z.string()
    .regex(/jsr(p|r|o|s)_[a-zA-Z0-9]{35}$/, {
      message: "invalid JSR token",
    });
}
