import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { getHighRiskReasons, HIGH_RISK_REASONS, scoreTotal, shouldRecommendAdvice, type HighRiskKey } from "@/lib/fraud-score";
import { Button } from "@/components/ui/button";

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

type ProfileKey = "newAccount" | "fakeIdentity" | "emptyProfile";
type SellerKey =
  | "cannotMeet"
  | "externalLink"
  | "lineRedirect"
  | "bankAccount"
  | "maiHuoBian"
  | HighRiskKey;

const profileQuestions: {
  key: ProfileKey;
  label: string;
  zh: string;
  hint?: string;
}[] = [
  {
    key: "newAccount",
    label: "Account was created within the last month",
    zh: "帳號建立未滿一個月",
  },
  {
    key: "fakeIdentity",
    label: "Profile name or photo doesn't look like a real person",
    zh: "名稱或照片不像真人",
    hint: "e.g. random letters, a stock or model photo, or a photo that doesn't match the name",
  },
  {
    key: "emptyProfile",
    label: "Profile content is empty",
    zh: "個人檔案內容空白",
  },
];

const sellerQuestions: { key: SellerKey; label: string; zh: string }[] = [
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
];

const highRiskQuestions: { key: HighRiskKey; label: string; zh: string }[] = [
  { key: "onlineBankingOrAtm", label: "Asks you to operate online banking or an ATM", zh: "要求您操作網銀或 ATM" },
  { key: "customerServiceLink", label: "Asks you to click a customer-service link", zh: "要求您點擊客服連結" },
  { key: "accountPasswords", label: "Asks for any account password", zh: "要求提供任何帳號密碼" },
  { key: "privateDocuments", label: "Asks for any private ID document or personal information", zh: "要求提供任何私人證件及資訊" },
];

function Index() {
  const [age, setAge] = useState("");
  const [friends, setFriends] = useState("");
  const [profileFlags, setProfileFlags] = useState<Record<ProfileKey, boolean>>({
    newAccount: false,
    fakeIdentity: false,
    emptyProfile: false,
  });
  const [sellerFlags, setSellerFlags] = useState<Record<SellerKey, boolean>>({
    cannotMeet: false,
    externalLink: false,
    lineRedirect: false,
    bankAccount: false,
    maiHuoBian: false,
    onlineBankingOrAtm: false,
    customerServiceLink: false,
    accountPasswords: false,
    privateDocuments: false,
  });
  const [result, setResult] = useState<number | null>(null);
  const [highRiskReasons, setHighRiskReasons] = useState<HighRiskKey[]>([]);
  const [recommendAdvice, setRecommendAdvice] = useState(false);

  const clearResult = () => {
    setResult(null);
    setHighRiskReasons([]);
    setRecommendAdvice(false);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const score = scoreTotal(
        {
          friendCount: friends === "" ? null : Number(friends),
          ...profileFlags,
        },
        sellerFlags,
    );
    setResult(score);
    setHighRiskReasons(getHighRiskReasons(sellerFlags));
    setRecommendAdvice(shouldRecommendAdvice(age === "" ? null : Number(age), score));
  };

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-bold text-foreground">二手交易詐騙檢測</h1>
        <p className="mt-2 text-muted-foreground">
          Check if a Facebook Marketplace buyer might be a fake account.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <label className="block">
            <span className="text-sm font-medium text-foreground">
              How old are you? 您的年齡？
            </span>
            <input
              type="number"
              min={0}
              step={1}
              value={age}
              onChange={(e) => {
                setAge(e.target.value);
                clearResult();
              }}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
              placeholder="e.g. 65"
            />
            <span className="mt-1 block text-xs text-muted-foreground">
              Your age, not the other person's. Optional.
              <span className="block">請填寫您自己的年齡，不是交易對象的年齡。可不填。</span>
            </span>
          </label>

          <hr className="border-border" />

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
                onChange={(e) => { setFriends(e.target.value); clearResult(); }}
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
                  onChange={(e) => {
                    setProfileFlags({ ...profileFlags, [q.key]: e.target.checked });
                    clearResult();
                  }}
                  className="mt-1 h-4 w-4 accent-primary"
                />
                <span className="text-sm text-foreground">
                  {q.label}
                  <span className="block text-muted-foreground">{q.zh}</span>
                  {q.hint && (
                    <span className="mt-1 block text-xs italic text-muted-foreground">
                      {q.hint}
                    </span>
                  )}
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
                  onChange={(e) => { setSellerFlags({ ...sellerFlags, [q.key]: e.target.checked }); clearResult(); }}
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
            <h2 className="text-lg font-semibold text-destructive">
              3. Critical warning signs 一票否決警訊
            </h2>
            <p className="text-xs text-muted-foreground">
              Any one of these means high risk, regardless of the score.
              <span className="block">符合任一項即判定高風險，不受累加分數影響。</span>
            </p>
            {highRiskQuestions.map((q) => (
              <label key={q.key} className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={sellerFlags[q.key]}
                  onChange={(e) => { setSellerFlags({ ...sellerFlags, [q.key]: e.target.checked }); clearResult(); }}
                  className="mt-1 h-4 w-4 accent-destructive"
                />
                <span className="text-sm text-foreground">
                  {q.label}
                  <span className="block text-muted-foreground">{q.zh}</span>
                </span>
              </label>
            ))}
          </section>

          <Button
            type="submit"
            variant={recommendAdvice || highRiskReasons.length > 0 ? "destructive" : "default"}
            className="h-auto min-h-9 w-full flex-col whitespace-normal px-4 py-3"
          >
            <span>Check 檢測</span>
            {recommendAdvice && (
              <span role="alert" className="mt-2 block text-sm font-medium leading-relaxed">
                We strongly recommend pausing this transaction and seeking advice from a trusted family member, friend, or someone experienced with online transactions.
                <span className="mt-1 block">
                  強烈建議您先暫停交易，向信任的家人、朋友或熟悉網路交易的人諮詢，再決定是否繼續。
                </span>
              </span>
            )}
          </Button>
        </form>

        {result !== null && (
          <div className="mt-6 rounded-xl border bg-card p-6 text-center">
            {highRiskReasons.length > 0 ? (
              <div role="alert" className="space-y-4">
                <h2 className="text-3xl font-bold text-destructive">Stop transaction 暫停交易</h2>
                <p className="text-sm text-foreground">
                  A critical warning sign overrides the score. Pause this transaction; do not follow links, operate banking services, or share private information.
                  <span className="mt-2 block">已觸發一票否決，無論累加分數多少都屬高風險。請暫停交易，勿點擊連結、操作網銀或 ATM，或提供私人資訊。</span>
                </p>
                <ul className="space-y-2 text-left text-sm text-destructive">
                  {highRiskReasons.map((key) => (
                    <li key={key}>
                      {HIGH_RISK_REASONS[key].en}
                      <span className="block">{HIGH_RISK_REASONS[key].zh}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground">High risk is not proof of fraud. 高風險不代表已證實詐騙。</p>
              </div>
            ) : (
              <>
            <p className="text-sm text-muted-foreground">Fraud likelihood 詐騙可能性</p>
            <p
              className={`mt-2 text-5xl font-bold ${
                result >= 40 ? "text-destructive" : "text-foreground"
              }`}
            >
              {result}%
            </p>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
