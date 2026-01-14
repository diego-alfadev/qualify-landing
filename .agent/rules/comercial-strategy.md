---
trigger: model_decision
description: When working on commercial planning accomodations and design, presenting features, call to actions for billing, and feature and value ladder. Commercial decissions.
---

## 1. Acquisition Strategy: Product-Led Growth (PLG)
We prioritize **low friction** entry. The goal is to get the user to the "Aha! Moment" (processing their first lead) as quickly as possible, delaying the "Sales Ask" until value is proven.

### The "Orphan User" Journey (Organic Signup)
* **Concept:** Any user registering via Landing or SSO without an invitation token is treated as an **"Orphan User"**.
* **Assumption:** An Orphan User is the **Owner/Admin** of a new Agency.
* **Flow:**
    1.  **Identity (SSO):** Frictionless login (Google). No credit card required.
    2.  **Onboarding Wizard (The Setup):**
        * **Profile:** Confirm identity.
        * **Agency Creation:** User names their digital workspace.
        * **Segmentation (KYC):** We ask *Usage Intent* ("Just browsing" vs "High volume") and *Role* ("Freelance" vs "Franchise").
    3.  **Activation (Tier 1):** User lands in the Dashboard with a generic "Digital" plan active.

### The "Invited User" Journey
* **Concept:** Staff members invited by an existing Agency Admin.
* **Flow:**
    1.  **Invitation:** User receives email with token.
    2.  **Identity:** SSO or Password setup.
    3.  **Skip Wizard:** Agency creation and segmentation steps are bypassed. User is dropped directly into the Agency context.

## 2. Value Ladder (Tiers)

### Tier 1: "Digital" (The Free Entry)
* **Target:** Solopreneurs, Freelancers, Curious Agents.
* **Price:** **Free / Freemium**.
* **Capabilities:**
    * **Input:** Manual Entry + Email Forwarding (Parsing).
    * **Intelligence:** Full AI Profiling + Scoring.
    * **Output:** Dashboard Visualization + Email Notifications.
* **Restrictions:** **No bidirectional channels** (No WhatsApp, No Phone Number).
* **Strategy:** Build habit and dependence on the Scoring logic. Cost is subsidized via "Hacker" LLM strategies.

### Tier 2: "Pro" (The Monetization Layer)
* **Target:** Established Agencies, High Volume.
* **Price:** Monthly Subscription + Usage.
* **Trigger:** User attempts to activate a **"Pro Channel"** (WhatsApp or Virtual Number) in settings.
* **Capabilities:**
    * All Tier 1 features.
    * **Connectivity:** Dedicated Twilio Number (Calls & WhatsApp).
    * **Automation:** 24/7 Call Deflection & Auto-Replies.
* **Cost Structure:** Subscription covers platform; variable costs (Twilio) are billed or capped.

### Tier 3: "Enterprise"
* **Target:** Franchises, Multi-office.
* **Capabilities:** API Access, CRM Sync, Custom Scoring Rules, White Labeling.

## 3. Segmentation & Data Strategy
The Onboarding Wizard is our primary source of **Customer Intelligence**. We categorize users to tailor the in-app experience:

* **"Freelance":** Show simplified UI, hide team management features.
* **"Agency":** Prompt to invite team members early.
* **"High Intent":** If user selects "High Volume" objective, offer proactive support or a "Pro" trial.

## 4. Privacy & Data Governance
* **Scope:** Data belongs to the **Agency**, not the individual User (unless Freelance).
* **Isolation:** Lead data and behavioral insights are siloed per Agency. Global scoring rules (e.g., "Financial Reliability") can use aggregate anonymized data.

## 5. Costs and Reporting
The system must track costs to ensure the Freemium model remains sustainable.

* **Agency View:** Reports "Value Delivered" (Leads Qualified, Hours Saved).
* **Admin View:** Reports "Cost to Serve" (LLM Tokens, Storage).
    * *Alert:* Flag agencies with high usage but no conversion to Tier 2 (Abuse prevention).
