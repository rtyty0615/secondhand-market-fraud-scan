import { describe, it, expect } from "vitest";
import {
  getHighRiskReasons,
  getRiskLevel,
  MEETUP_ADVICE,
  RISK_LEVELS,
  scoreProfile,
  scoreSeller,
  scoreTotal,
  shouldRecommendAdvice,
  type RiskLevel,
} from "@/lib/fraud-score";

const base = { friendCount: 200, newAccount: false, fakeIdentity: false, emptyProfile: false };
const sellerBase = {
  cannotMeet: false,
  privateLocationMeetup: false,
  externalLink: false,
  lineRedirect: false,
  bankAccount: false,
  maiHuoBian: false,
};

describe("shouldRecommendAdvice", () => {
  it("requires the user's age to be strictly greater than 70", () => {
    expect(shouldRecommendAdvice(70, 60)).toBe(false);
    expect(shouldRecommendAdvice(71, 60)).toBe(true);
  });
  it("requires the score to be strictly greater than 50", () => {
    expect(shouldRecommendAdvice(71, 50)).toBe(false);
    expect(shouldRecommendAdvice(71, 51)).toBe(true);
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
  it("any account password alone triggers high risk", () => {
    expect(getHighRiskReasons({ ...sellerBase, accountPasswords: true })).toEqual(["accountPasswords"]);
  });
  it("any private ID document or personal information alone triggers high risk", () => {
    expect(getHighRiskReasons({ ...sellerBase, privateDocuments: true })).toEqual(["privateDocuments"]);
  });
  it("an external link alone triggers high risk", () => {
    expect(getHighRiskReasons({ ...sellerBase, externalLink: true })).toEqual(["externalLink"]);
  });
  it("a LINE or customer-service redirect alone triggers high risk", () => {
    expect(getHighRiskReasons({ ...sellerBase, lineRedirect: true })).toEqual(["lineRedirect"]);
  });
  it("a shared 賣貨便 link alone triggers high risk", () => {
    expect(getHighRiskReasons({ ...sellerBase, maiHuoBian: true })).toEqual(["maiHuoBian"]);
  });
  it("ordinary flags do not trigger the veto", () => {
    expect(getHighRiskReasons({ ...sellerBase, cannotMeet: true, bankAccount: true })).toEqual([]);
  });
  it("a private-location meetup is advice, not a veto", () => {
    expect(getHighRiskReasons({ ...sellerBase, privateLocationMeetup: true })).toEqual([]);
  });
  it("returns every selected veto and clears when deselected", () => {
    expect(getHighRiskReasons({ ...sellerBase, onlineBankingOrAtm: true, customerServiceLink: true, externalLink: true, lineRedirect: true, maiHuoBian: true, accountPasswords: true, privateDocuments: true })).toHaveLength(7);
    expect(getHighRiskReasons({ ...sellerBase, onlineBankingOrAtm: false, customerServiceLink: false, externalLink: false, lineRedirect: false, maiHuoBian: false, accountPasswords: false, privateDocuments: false })).toEqual([]);
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
  it("external link, LINE redirect and 賣貨便 link are vetoes and add no score", () =>
    expect(
      scoreSeller({ ...sellerBase, externalLink: true, lineRedirect: true, maiHuoBian: true }),
    ).toBe(0));
  it("a private-location meetup adds 20", () =>
    expect(scoreSeller({ ...sellerBase, privateLocationMeetup: true })).toBe(20));
  it("all three seller flags stay capped at 40", () =>
    expect(
      scoreSeller({
        ...sellerBase,
        cannotMeet: true,
        privateLocationMeetup: true,
        bankAccount: true,
      }),
    ).toBe(40));
});

describe("MEETUP_ADVICE", () => {
  it("keeps the exact message to send the other person", () => {
    expect(MEETUP_ADVICE.message.zh).toBe(
      "不好意思，我希望能夠到超商或捷運站等等人多的地方進行交易",
    );
  });
  it("explains the advice in English too", () => {
    expect(MEETUP_ADVICE.message.en).toContain("convenience store");
    expect(MEETUP_ADVICE.lead.en).toBeTruthy();
    expect(MEETUP_ADVICE.lead.zh).toBeTruthy();
  });
});

describe("scoreTotal", () => {
  it("combines both sections", () =>
    expect(
      scoreTotal({ ...base, friendCount: 5 }, { ...sellerBase, cannotMeet: true }),
    ).toBe(30));
  it("counts a private-location meetup in the total", () =>
    expect(
      scoreTotal({ ...base, friendCount: 5 }, { ...sellerBase, privateLocationMeetup: true }),
    ).toBe(30));
  it("caps at 100", () =>
    expect(
      scoreTotal(
        { friendCount: 1, newAccount: true, fakeIdentity: true, emptyProfile: true },
        { ...sellerBase, cannotMeet: true, bankAccount: true },
      ),
    ).toBe(80));
});

describe("getRiskLevel", () => {
  it("below 10% is a green light", () => {
    expect(getRiskLevel(0)).toBe("green");
  });
  it("10% to under 30% is a yellow light", () => {
    expect(getRiskLevel(10)).toBe("yellow");
    expect(getRiskLevel(20)).toBe("yellow");
  });
  it("30% to 70% is an orange light", () => {
    expect(getRiskLevel(30)).toBe("orange");
    expect(getRiskLevel(70)).toBe("orange");
  });
  it("above 70% is a red light", () => {
    expect(getRiskLevel(80)).toBe("red");
    expect(getRiskLevel(100)).toBe("red");
  });
  it("every level has a bilingual title and message", () => {
    for (const level of Object.keys(RISK_LEVELS) as RiskLevel[]) {
      expect(RISK_LEVELS[level].title.en).toBeTruthy();
      expect(RISK_LEVELS[level].title.zh).toBeTruthy();
      expect(RISK_LEVELS[level].message.en).toBeTruthy();
      expect(RISK_LEVELS[level].message.zh).toBeTruthy();
    }
  });
});
