/// <reference path="../.astro/types.d.ts" />
/// <reference types="@astrojs/image/client" />

interface ImportMetaEnv {
  readonly PUBLIC_API_HOST: string;
  readonly GTAG_ID: string;
  readonly PUBLIC_ONBOARDING_MODE: 'legacy' | 'plg';
  readonly PUBLIC_DASHBOARD_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
