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
};

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
