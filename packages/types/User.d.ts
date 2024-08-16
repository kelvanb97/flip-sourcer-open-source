export type LoginRequest = {
  email: string;
  password: string;
};

export type Referrer =
  | "reezy"
  | "catrp"
  | "phoenix-resale"
  | "the-buy-box"
  | "chad";

export type SignUpRequest = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAgreed: boolean;
  referrer: string | null;
};

export interface StripeUserInfo {
  customerId: string;
  defaultPaymentMethodId: string;
}

export interface AmazonSpApiInfo {
  sellerId: string;
  accessToken: string;
  refreshToken: string;
}

export interface GeneralSettings {
  defaultFbaFee: number;
  perUnitCosts: {
    flat: number;
    percent: number;
  };
  shippingCosts: {
    perPound: number;
    perOunce: number;
    perKilogram: number;
    perGram: number;
    perUnit: number;
  };
  cashback: {
    flat: number;
    percent: number;
  };
  measurementSystem: "imperial" | "metric";
}

export interface UserInterface {
  id: number;
  name: string;
  email: string;
  emailVerified: boolean;
  emailVerificationToken: string;
  lastEmailVerificationSent: Date;
  isInfluencer: boolean;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  sessionToken: string;
  sessionExpiration: Date;
  referrer: string | null;
  stripe: StripeUserInfo;
  amazonSpApi: AmazonSpApiInfo;
  generalSettings: GeneralSettings;
  productBlackList: string[];
  superDelete: boolean;
  mailchimpAudiences: string[];
}

export interface UserInterfaceDisplay {
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  sessionToken: string;
  sessionExpiration: Date;
  referrer: string | null;
  generalSettings: GeneralSettings;
  productBlackList: string[];
  superDelete: boolean;
}
