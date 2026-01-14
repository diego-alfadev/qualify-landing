export interface PersonalInfo {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export interface AgencyInfo {
  name: string;
  website?: string;
}

export interface MarketingInfo {
  referral_source: string;
  referral_detail?: string;
  why_qualify?: string;
}

export interface TrackingInfo {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referral_code?: string;
}

export interface StripeInfo {
  customer_id: string | null;
  subscription_id: string | null;
}

export interface UserSignupPayload {
  personal_info: PersonalInfo;
  agency_info: AgencyInfo;
  marketing_info: MarketingInfo;
  tracking_info: TrackingInfo;
  stripe_info: StripeInfo;
}
