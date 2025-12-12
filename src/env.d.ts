/// <reference path="../.astro/types.d.ts" />
/// <reference types="@astrojs/image/client" />

interface ImportMetaEnv {
  readonly PUBLIC_API_HOST: string;
  readonly GTAG_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
