export interface FeeDetail {
  FeeType:
    | "ReferralFee"
    | "VariableClosingFee"
    | "PerItemFee"
    | "FBAFees"
    | string;
  FeeAmount: {
    CurrencyCode: string;
    Amount: number;
  };
  FinalFee?: {
    CurrencyCode: string;
    Amount: number;
  };
  FeePromotion?: {
    CurrencyCode: string;
    Amount: number;
  };
}

export interface GetMyFeesEstimateForASINResponse {
  FeesEstimateResult: {
    FeesEstimate: {
      TimeOfFeesEstimation: string;
      TotalFeesEstimate: {
        CurrencyCode: string;
        Amount: string;
      };
      FeeDetailList: Array<FeeDetail>;
    };
  };
}

export interface GetAccessTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}
