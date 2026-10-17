export type ProfileAnswers = {
  friendCount: number | null;
  newAccount: boolean;
  nonLocalName: boolean;
  emptyProfile: boolean;
};

export const POINTS_PER_FLAG = 5;

export function scoreProfile(a: ProfileAnswers): number {
  const flags = [
    a.friendCount !== null && a.friendCount < 10,
    a.newAccount,
    a.nonLocalName,
    a.emptyProfile,
  ];
  return Math.min(100, flags.filter(Boolean).length * POINTS_PER_FLAG);
}
