import { describe, it, expect } from "vitest";
import { scoreProfile, scoreSeller, scoreTotal } from "@/lib/fraud-score";

const base = { friendCount: 200, newAccount: false, fakeIdentity: false, emptyProfile: false };
const sellerBase = {
  cannotMeet: false,
  externalLink: false,
  lineRedirect: false,
  bankAccount: false,
  maiHuoBian: false,
};

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
