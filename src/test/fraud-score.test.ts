import { describe, it, expect } from "vitest";
import { getHighRiskReasons, scoreProfile, scoreSeller, scoreTotal, shouldRecommendAdvice } from "@/lib/fraud-score";

const base = { friendCount: 200, newAccount: false, fakeIdentity: false, emptyProfile: false };
const sellerBase = {
  cannotMeet: false,
  externalLink: false,
  lineRedirect: false,
  bankAccount: false,
  maiHuoBian: false,
};

describe("shouldRecommendAdvice", () => {
  it("requires the user's age to be strictly greater than 60", () => {
    expect(shouldRecommendAdvice(60, 60)).toBe(false);
    expect(shouldRecommendAdvice(61, 60)).toBe(true);
  });
  it("requires the score to be strictly greater than 50", () => {
    expect(shouldRecommendAdvice(61, 50)).toBe(false);
    expect(shouldRecommendAdvice(61, 51)).toBe(true);
  });
  it("does not recommend age-based advice when age is unanswered", () => {
    expect(shouldRecommendAdvice(null, 80)).toBe(false);
  });
});

describe("high-risk veto", () => {
  it("online banking or ATM alone triggers high risk even with a zero score", () => {
    const answers = { ...sellerBase, onlineBankingOrAtm: true };
    expect(scoreTotal(base, answers)).toBe(0);
    expect(getHighRiskReasons(answers)).toEqual(["onlineBankingOrAtm"]);
  });
  it("a customer-service link alone triggers high risk", () => {
    expect(getHighRiskReasons({ ...sellerBase, customerServiceLink: true })).toEqual(["customerServiceLink"]);
  });
  it("passwords or unrelated private information alone trigger high risk", () => {
    expect(getHighRiskReasons({ ...sellerBase, unrelatedPrivateInfo: true })).toEqual(["unrelatedPrivateInfo"]);
  });
  it("ordinary flags do not trigger the veto", () => {
    expect(getHighRiskReasons({ ...sellerBase, externalLink: true, lineRedirect: true, bankAccount: true })).toEqual([]);
  });
  it("returns every selected veto and clears when deselected", () => {
    expect(getHighRiskReasons({ ...sellerBase, onlineBankingOrAtm: true, customerServiceLink: true, unrelatedPrivateInfo: true })).toHaveLength(3);
    expect(getHighRiskReasons({ ...sellerBase, onlineBankingOrAtm: false, customerServiceLink: false, unrelatedPrivateInfo: false })).toEqual([]);
  });
});

describe("scoreProfile", () => {
  it("fewer than 10 friends adds 10", () => expect(scoreProfile({ ...base, friendCount: 9 })).toBe(10));
  it("10 friends adds nothing", () => expect(scoreProfile({ ...base, friendCount: 10 })).toBe(0));
  it("all four flags = 40", () =>
    expect(scoreProfile({ friendCount: 3, newAccount: true, fakeIdentity: true, emptyProfile: true })).toBe(40));
});

describe("scoreSeller", () => {
  it("one flag adds 20", () => expect(scoreSeller({ ...sellerBase, cannotMeet: true })).toBe(20));
  it("two flags add 40", () =>
    expect(scoreSeller({ ...sellerBase, cannotMeet: true, bankAccount: true })).toBe(40));
  it("all five flags capped at 40", () =>
    expect(
      scoreSeller({
        cannotMeet: true,
        externalLink: true,
        lineRedirect: true,
        bankAccount: true,
        maiHuoBian: true,
      }),
    ).toBe(40));
});

describe("scoreTotal", () => {
  it("combines both sections", () =>
    expect(
      scoreTotal({ ...base, friendCount: 5 }, { ...sellerBase, cannotMeet: true }),
    ).toBe(30));
  it("caps at 100", () =>
    expect(
      scoreTotal(
        { friendCount: 1, newAccount: true, fakeIdentity: true, emptyProfile: true },
        {
          cannotMeet: true,
          externalLink: true,
          lineRedirect: true,
          bankAccount: true,
          maiHuoBian: true,
        },
      ),
    ).toBe(80));
});
