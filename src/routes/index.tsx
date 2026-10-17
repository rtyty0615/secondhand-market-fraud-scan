import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { scoreProfile } from "@/lib/fraud-score";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FB Market Fraud Checker | 二手交易詐騙檢測" },
      { name: "description", content: "Answer a few questions to estimate if a Facebook Marketplace buyer may be a fake account." },
      { property: "og:title", content: "FB Market Fraud Checker" },
      { property: "og:description", content: "Estimate the fraud risk of a Facebook buyer in Taiwan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const questions = [
  { key: "newAccount", label: "Account was created within the last month", zh: "帳號建立未滿一個月" },
  { key: "nonLocalName", label: "Profile name is not a local Taiwanese name", zh: "名稱不像台灣本地人" },
  { key: "emptyProfile", label: "Profile content is empty", zh: "個人檔案內容空白" },
] as const;

function Index() {
  const [friends, setFriends] = useState("");
  const [flags, setFlags] = useState({ newAccount: false, nonLocalName: false, emptyProfile: false });
  const [result, setResult] = useState<number | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(scoreProfile({ friendCount: friends === "" ? null : Number(friends), ...flags }));
  };

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-bold text-foreground">二手交易詐騙檢測</h1>
        <p className="mt-2 text-muted-foreground">Check if a Facebook Marketplace buyer might be a fake account.</p>

        <form onSubmit={submit} className="mt-8 space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-card-foreground">1. Facebook Profile 臉書個人檔案</h2>

          <label className="block">
            <span className="text-sm font-medium text-foreground">How many friends? 朋友人數</span>
            <input
              type="number"
              min={0}
              value={friends}
              onChange={(e) => setFriends(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
              placeholder="e.g. 120"
            />
          </label>

          {questions.map((q) => (
            <label key={q.key} className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={flags[q.key]}
                onChange={(e) => setFlags({ ...flags, [q.key]: e.target.checked })}
                className="mt-1 h-4 w-4 accent-primary"
              />
              <span className="text-sm text-foreground">
                {q.label}
                <span className="block text-muted-foreground">{q.zh}</span>
              </span>
            </label>
          ))}

          <button type="submit" className="w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90">
            Check 檢測
          </button>
        </form>

        {result !== null && (
          <div className="mt-6 rounded-xl border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">Fraud likelihood 詐騙可能性</p>
            <p className={`mt-2 text-5xl font-bold ${result >= 15 ? "text-destructive" : "text-foreground"}`}>{result}%</p>
          </div>
        )}
      </div>
    </main>
  );
}
