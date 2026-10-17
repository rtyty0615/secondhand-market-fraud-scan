export type ProfileAnswers = {
  friendCount: number | null;
  newAccount: boolean;
  fakeIdentity: boolean;
  emptyProfile: boolean;
};

export type SellerAnswers = {
  cannotMeet: boolean;
  privateLocationMeetup: boolean;
  externalLink: boolean;
  lineRedirect: boolean;
  bankAccount: boolean;
  maiHuoBian: boolean;
  onlineBankingOrAtm?: boolean;
  customerServiceLink?: boolean;
  accountPasswords?: boolean;
  privateDocuments?: boolean;
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
  externalLink: {
    en: "Asked you to go to an external link",
    zh: "要求您點擊外部連結",
  },
  lineRedirect: {
    en: "Asked you to add them on LINE or redirected you to other customer service",
    zh: "要求您加 LINE 或轉接其他客服",
  },
  maiHuoBian: {
    en: "Shared a 賣貨便 link with you",
    zh: "向您分享賣貨便連結",
  },
  accountPasswords: {
    en: "Asked for any account password",
    zh: "要求提供任何帳號密碼",
  },
  privateDocuments: {
    en: "Asked for any private ID document or personal information",
    zh: "要求提供任何私人證件及資訊",
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

export const MEETUP_ADVICE = {
  lead: {
    en: "Ask to meet somewhere public instead. You can send this message:",
    zh: "請改約在人多的公共場所面交，您可以把下面這句話傳給對方：",
  },
  message: {
    en: "Sorry, I would prefer to meet at a busy public place, such as a convenience store or an MRT station.",
    zh: "不好意思，我希望能夠到超商或捷運站等等人多的地方進行交易",
  },
} as const;

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
  const flags = [a.cannotMeet, a.privateLocationMeetup, a.bankAccount];
  return Math.min(SELLER_MAX, flags.filter(Boolean).length * SELLER_POINTS_PER_FLAG);
}

export function scoreTotal(p: ProfileAnswers, s: SellerAnswers): number {
  return Math.min(100, scoreProfile(p) + scoreSeller(s));
}

export function shouldRecommendAdvice(
  age: number | null,
  score: number,
  hasHighRisk = false,
): boolean {
  if (age === null || !Number.isFinite(age) || age <= 70) return false;
  return score >= 30 || hasHighRisk;
}

export type RiskLevel = "green" | "yellow" | "orange" | "red";

export const RISK_LEVELS: Record<RiskLevel, { title: { en: string; zh: string }; message: { en: string; zh: string } }> = {
  green: {
    title: { en: "Green light — Low risk", zh: "綠燈 — 低風險" },
    message: {
      en: "No warning signs found. This profile looks like a real person. Stay alert as usual and trade through safe channels.",
      zh: "沒有發現可疑警訊，看起來像真實帳號。請照常保持警覺，並透過安全的交易方式進行。",
    },
  },
  yellow: {
    title: { en: "Yellow light — Caution", zh: "黃燈 — 留意" },
    message: {
      en: "A few caution signs. You may continue, but double-check the item and the person, and avoid risky payment steps.",
      zh: "出現一些警訊。可以繼續交易，但請再次確認商品與對方身分，避免風險較高的付款方式。",
    },
  },
  orange: {
    title: { en: "Orange light — High risk", zh: "橘燈 — 高風險" },
    message: {
      en: "Many warning signs. We recommend pausing this transaction and verifying the seller before making any payment.",
      zh: "警訊較多，風險偏高。建議先暫停交易，付款前再次查證對方是否可信。",
    },
  },
  red: {
    title: { en: "Red light — Very likely a scam", zh: "紅燈 — 非常可能是詐騙" },
    message: {
      en: "Do not proceed. Stop this transaction, and do not send money or any personal information.",
      zh: "請勿繼續交易。請立即停止，不要匯款或提供任何個人資料。",
    },
  },
};

export function getRiskLevel(score: number): RiskLevel {
  if (score > 70) return "red";
  if (score >= 30) return "orange";
  if (score >= 10) return "yellow";
  return "green";
}
