import { describe, expect, it } from "vitest";
import { getSelectedAdvice, type AdviceKey } from "@/lib/question-advice";
import type { ProfileAnswers, SellerAnswers } from "@/lib/fraud-score";

const profile: ProfileAnswers = { friendCount: null, newAccount: false, fakeIdentity: false, emptyProfile: false };
const seller: SellerAnswers = {
  cannotMeet: false, privateLocationMeetup: false, bankAccount: false,
  externalLink: false, lineRedirect: false, maiHuoBian: false,
  onlineBankingOrAtm: false, customerServiceLink: false, accountPasswords: false, privateDocuments: false,
};

describe("selected advice coverage", () => {
  it("shows no advice when nothing is selected", () => {
    expect(getSelectedAdvice(profile, seller)).toEqual([]);
  });
  it("includes the fewer-than-10-friends item but not unanswered or 10 friends", () => {
    expect(getSelectedAdvice({ ...profile, friendCount: 9 }, seller).map(a => a.key)).toEqual(["fewFriends"]);
    expect(getSelectedAdvice({ ...profile, friendCount: 10 }, seller)).toEqual([]);
  });
  const profileKeys = ["newAccount", "fakeIdentity", "emptyProfile"] as const;
  for (const key of profileKeys) {
    it(`includes only the selected profile item: ${key}`, () => {
      expect(getSelectedAdvice({ ...profile, [key]: true }, seller).map(a => a.key)).toEqual([key]);
    });
  }
  const sellerKeys = ["cannotMeet", "privateLocationMeetup", "bankAccount", "onlineBankingOrAtm", "customerServiceLink", "externalLink", "lineRedirect", "maiHuoBian", "accountPasswords", "privateDocuments"] as const;
  for (const key of sellerKeys) {
    it(`includes only the selected transaction item: ${key}`, () => {
      expect(getSelectedAdvice(profile, { ...seller, [key]: true }).map(a => a.key)).toEqual([key]);
    });
  }
  it("returns every selected item in questionnaire order without merging link options", () => {
    const allSeller = { ...seller };
    for (const key of sellerKeys) allSeller[key] = true;
    const keys: AdviceKey[] = getSelectedAdvice({ friendCount: 0, newAccount: true, fakeIdentity: true, emptyProfile: true }, allSeller).map(a => a.key);
    expect(keys).toEqual(["fewFriends", ...profileKeys, ...sellerKeys]);
  });
  it("removes deselected items from the next result", () => {
    expect(getSelectedAdvice(profile, { ...seller, cannotMeet: true, privateDocuments: true }).map(a => a.key)).toEqual(["cannotMeet", "privateDocuments"]);
    expect(getSelectedAdvice(profile, { ...seller, cannotMeet: false, privateDocuments: true }).map(a => a.key)).toEqual(["privateDocuments"]);
  });
});