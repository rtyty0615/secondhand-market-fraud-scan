import { describe, it, expect } from "vitest";
import { scoreProfile } from "@/lib/fraud-score";

const base = { friendCount: 200, newAccount: false, nonLocalName: false, emptyProfile: false };

describe("scoreProfile", () => {
  it("fewer than 10 friends adds 5", () => expect(scoreProfile({ ...base, friendCount: 9 })).toBe(5));
  it("10 friends adds nothing", () => expect(scoreProfile({ ...base, friendCount: 10 })).toBe(0));
  it("all four flags = 20", () =>
    expect(scoreProfile({ friendCount: 3, newAccount: true, nonLocalName: true, emptyProfile: true })).toBe(20));
});
