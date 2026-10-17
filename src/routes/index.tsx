import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { scoreTotal } from "@/lib/fraud-score";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FB Market Fraud Checker | 二手交易詐騙檢測" },
      {
        name: "description",
        content:
          "Answer a few questions to estimate if a Facebook Marketplace buyer may be a fake account.",
      },
      { property: "og:title", content: "FB Market Fraud Checker" },
      {
        property: "og:description",
        content: "Estimate the fraud risk of a Facebook buyer in Taiwan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const profileQuestions = [
  {
    key: "newAccount",
    label: "Account was created within the last month",
    zh: "帳號建立未滿一個月",
  },
  {
    key: "nonLocalName",
    label: "Profile name is not a local Taiwanese name",
    zh: "名稱不像台灣本地人",
  },
  {
    key: "emptyProfile",
    label: "Profile content is empty",
    zh: "個人檔案內容空白",
  },
] as const;

const sellerQuestions = [
  {
    key: "cannotMeet",
    label: "Cannot meet in person, must deliver",
    zh: "無法面交，必須宅配",
  },
  {
    key: "externalLink",
    label: "Asks you to go to an external link",
    zh: "要求你點擊外部連結",
  },
  {
    key: "lineRedirect",
    label: "Asks you to add them on LINE or redirect you to other customer service",
    zh: "要求加 LINE 或轉接其他客服",
  },
  {
    key: "bankAccount",
    label: "Asks for your bank account",
    zh: "詢問你的銀行帳號",
  },
  {
    key: "maiHuoBian",
    label: "Asks you to use 賣貨便",
    zh: "要求使用賣貨便",
  },
] as const;

type ProfileKey = (typeof profileQuestions)[number]["key"];
type SellerKey = (typeof sellerQuestions)[number]["key"];

function Index() {
  const [friends, setFriends] = useState("");
  const [profileFlags, setProfileFlags] = useState<Record<ProfileKey, boolean>>({
    newAccount: false,
    nonLocalName: false,
    emptyProfile: false,
  });
  const [sellerFlags, setSellerFlags] = useState<Record<SellerKey, boolean>>({
    cannotMeet: false,
    externalLink: false,
    lineRedirect: false,
    bankAccount: false,
    maiHuoBian: false,
  });
  const [result, setResult] = useState<number | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(
      scoreTotal(
        {
          friendCount: friends === "" ? null : Number(friends),
          ...profileFlags,
        },
        sellerFlags,
      ),
    );
  };

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-bold text-foreground">二手交易詐騙檢測</h1>
        <p className="mt-2 text-muted-foreground">
          Check if a Facebook Marketplace buyer might be a fake account.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-card-foreground">
              1. Facebook Profile 臉書個人檔案
            </h2>
            <p className="text-xs text-muted-foreground">每項 10%，最高 40%</p>

            <label className="block">
              <span className="text-sm font-medium text-foreground">
                How many friends? 朋友人數
              </span>
              <input
                type="number"
                min={0}
                value={friends}
                onChange={(e) => setFriends(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
                placeholder="e.g. 120"
              />
              <span className="mt-1 block text-xs text-muted-foreground">
                Fewer than 10 counts 少於 10 位算一項
              </span>
            </label>

            {profileQuestions.map((q) => (
              <label key={q.key} className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={profileFlags[q.key]}
                  onChange={(e) =>
                    setProfileFlags({ ...profileFlags, [q.key]: e.target.checked })
                  }
                  className="mt-1 h-4 w-4 accent-primary"
                />
                <span className="text-sm text-foreground">
                  {q.label}
                  <span className="block text-muted-foreground">{q.zh}</span>
                </span>
              </label>
            ))}
          </section>

          <hr className="border-border" />

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-card-foreground">
              2. Seller Behaviour 賣家行為
            </h2>
            <p className="text-xs text-muted-foreground">
              每項 20%，最高 40% · Each choice adds 20%, capped at 40%
            </p>

            {sellerQuestions.map((q) => (
              <label key={q.key} className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={sellerFlags[q.key]}
                  onChange={(e) => setSellerFlags({ ...sellerFlags, [q.key]: e.target.checked })}
                  className="mt-1 h-4 w-4 accent-primary"
                />
                <span className="text-sm text-foreground">
                  {q.label}
                  <span className="block text-muted-foreground">{q.zh}</span>
                </span>
              </label>
            ))}
          </section>

          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90"
          >
            Check 檢測
          </button>
        </form>

        {result !== null && (
          <div className="mt-6 rounded-xl border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">Fraud likelihood 詐騙可能性</p>
            <p
              className={`mt-2 text-5xl font-bold ${
                result >= 40 ? "text-destructive" : "text-foreground"
              }`}
            >
              {result}%
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
