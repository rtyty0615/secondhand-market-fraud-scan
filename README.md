# Can I Trust This Person? 這人可信嗎

**二手交易詐騙檢測** — a bilingual (English / 繁體中文) checklist that helps people in Taiwan spot fake accounts and scams when buying or selling secondhand items on Facebook Marketplace and buy/sell groups.

**Live app:** https://secondhand-market-fraud-scan.lovable.app

---

## How it works

Answer a short checklist about the other person's profile and behaviour, press **Check 檢測**, and get:

- a **fraud risk percentage** with a traffic-light rating,
- an instant **Stop transaction 暫停交易** warning when a critical sign is present,
- **handling advice and a ready-to-send reply** (copy with one tap) under every item you ticked.

Nothing is uploaded or stored — all scoring runs in the browser.

## Questions & scoring

| Section | Items | Weight |
|---|---|---|
| **0. Your age 您的年齡** (optional) | Age of the person using the site | Used only for extra safety advice |
| **1. Facebook Profile 臉書個人檔案** | Fewer than 10 friends · Account created within 1 month · Name or photo doesn't look like a real person · Profile is empty | 10% each, max 40% |
| **2. Seller Behaviour 賣家行為** | Cannot meet in person, must deliver · Proposes meeting at a private location · Asks for your bank account | 30% each, max 70% |
| **3. Critical warning signs 一票否決警訊** | Online banking / ATM instructions · Customer-service link · External link · Add LINE / transfer to other support · Shares a 賣貨便 link · Asks for any account password · Asks for private ID documents or information | Any one → **Stop transaction 暫停交易** |

The total score is capped at 100%.

### Risk lights

| Score | Light | Meaning |
|---|---|---|
| < 10% | 🟢 Green | Looks normal |
| 10–29% | 🟡 Yellow | Some caution signs — stay alert if you continue |
| 30–70% | 🟠 Orange | High risk |
| > 70% | 🔴 Red | Very likely a scam |

### Extra care for seniors

If the user is **over 70** and the score is **30% or more**, or any critical warning sign is ticked, a red message recommends talking with family or someone they trust before continuing.

### Wording principles

- Every question is shown in English and 繁體中文.
- Identity questions ask whether a profile looks like a **real person** — never whether a name sounds foreign or non-Taiwanese.

## Tech stack

- [TanStack Start](https://tanstack.com/start) v1 + React 19
- Vite 7, Tailwind CSS v4
- Vitest for unit tests

Key files:

- `src/lib/fraud-score.ts` — pure scoring, risk bands, veto rules
- `src/lib/question-advice.ts` — advice and reply text per item
- `src/components/question-advice-card.tsx` — copyable advice card
- `src/routes/index.tsx` — the checklist page

## Run locally

Requires Node.js 18+ (or Bun).

```sh
git clone <this-repository-url>
cd <repository-name>
npm install
npm run dev
```

Run tests:

```sh
npx vitest run
```

## Contributing

Built with [Lovable](https://lovable.dev/projects/4a23ec4c-ac41-4d13-9918-82d7c8959567). Changes pushed to `main` sync back into the Lovable editor automatically.
