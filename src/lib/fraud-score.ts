export type ProfileAnswers = {
  friendCount: number | null;
  newAccount: boolean;
  fakeIdentity: boolean;
  emptyProfile: boolean;
};

export type SellerAnswers = {
  cannotMeet: boolean;
  externalLink: boolean;
  lineRedirect: boolean;
  bankAccount: boolean;
  maiHuoBian: boolean;
  onlineBankingOrAtm?: boolean;
  customerServiceLink?: boolean;
  unrelatedPrivateInfo?: boolean;
};

export const HIGH_RISK_REASONS = {
  onlineBankingOrAtm: {
    en: "Asked to operate online banking or an ATM",
    zh: "要求操作網銀或 ATM",
  },
  customerServiceLink: {
    en: "Asked to click a customer-service link",
    zh: "要求點擊客服連結",
  },
  unrelatedPrivateInfo: {
    en: "Asked for account passwords or private information unrelated to the transaction",
    zh: "要求提供帳號密碼或其他與交易無關的私人資訊",
  },
} as const;

export type HighRiskKey = keyof typeof HIGH_RISK_REASONS;

export function getHighRiskReasons(answers: SellerAnswers): HighRiskKey[] {
  return (Object.keys(HIGH_RISK_REASONS) as HighRiskKey[]).filter((key) => answers[key] === true);
}

export const PROFILE_POINTS_PER_FLAG = 10;
export const PROFILE_MAX = 40;

export const SELLER_POINTS_PER_FLAG = 20;
export const SELLER_MAX = 40;

export function scoreProfile(a: ProfileAnswers): number {
  const flags = [
    a.friendCount !== null && a.friendCount < 10,
    a.newAccount,
    a.fakeIdentity,
    a.emptyProfile,
  ];
  return Math.min(PROFILE_MAX, flags.filter(Boolean).length * PROFILE_POINTS_PER_FLAG);
}

export function scoreSeller(a: SellerAnswers): number {
  const flags = [
    a.cannotMeet,
    a.externalLink,
    a.lineRedirect,
    a.bankAccount,
    a.maiHuoBian,
  ];
  return Math.min(SELLER_MAX, flags.filter(Boolean).length * SELLER_POINTS_PER_FLAG);
}

export function scoreTotal(p: ProfileAnswers, s: SellerAnswers): number {
  return Math.min(100, scoreProfile(p) + scoreSeller(s));
}

export function shouldRecommendAdvice(age: number | null, score: number): boolean {
  return age !== null && Number.isFinite(age) && age > 60 && score > 50;
}
