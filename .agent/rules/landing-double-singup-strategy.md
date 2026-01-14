---
trigger: model_decision
description: When working on the double singup/onboarding flows for the landing page
---

# Antigravity Rules: Landing Workspace

## 1. Context & Architecture
* **Stack:** Astro + TailwindCSS + React Islands.
* **Role:** Top of Funnel (Acquisition) & SEO.
* **Strategy:** Product-Led Growth (PLG).

## 2. Onboarding Dual-Mode Strategy (Strict Separation)
We maintain two distinct onboarding flows controlled by `PUBLIC_ONBOARDING_MODE`.

### Mode A: "legacy" (The Classic Wizard)
* **Trigger:** `PUBLIC_ONBOARDING_MODE='legacy'`
* **Behavior:** Render the **existing, full-featured `SignupWizard.tsx`** component directly on the landing page.
* **Constraint:** Do NOT attempt to refactor this component to match the Dashboard's new "Typeform" style. Keep it as a functional fallback for "Sales-Led" flows (collecting data upfront).

### Mode B: "plg" (The Redirect Flow) - DEFAULT
* **Trigger:** `PUBLIC_ONBOARDING_MODE='plg'`
* **Behavior:**
    * **No Forms:** The Landing Page must NOT ask for user details (no name, no email inputs).
    * **Action:** All "Start" / "Sign Up" buttons are simple **Links** (`<a>`).
    * **Destination:** `https://app.qualifyinmo.com/auth/register` (The Dashboard).
* **Data Handoff:**
    * You must append URL Query Parameters (`utm_source`, `ref`, etc.) to the destination link so the Dashboard can capture attribution.

## 3. Implementation Notes
* **File Structure:** Keep `SignupWizard.tsx` in the project for Legacy use, even if unused in PLG mode.
* **Environment:** Ensure the Astro build respects the `PUBLIC_ONBOARDING_MODE` flag to conditionally render the UI islands.
