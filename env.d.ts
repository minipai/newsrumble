/// <reference types="react-router" />
/// <reference types="vite/client" />
/// <reference types="@cloudflare/workers-types" />

declare module "virtual:react-router/server-build" {
  const build: import("react-router").ServerBuild;
  export = build;
}
