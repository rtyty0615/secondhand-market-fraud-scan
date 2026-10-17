import { MEETUP_ADVICE, type ProfileAnswers, type SellerAnswers } from "@/lib/fraud-score";

type Bilingual = { zh: string; en: string };
export type AdviceKey = keyof Omit<ProfileAnswers, "friendCount"> | "fewFriends" | keyof SellerAnswers;
export type QuestionAdvice = {
  key: AdviceKey;
  title: Bilingual;
  action: Bilingual;
  message: Bilingual;
};

const linkReply: Bilingual = {
  zh: "我不會點擊任何外部連結或非官方的客服網址，請直接在聊天室溝通。",
  en: "I will not click any external links or unofficial customer service URLs. Please communicate directly within this chat.",
};

export const QUESTION_ADVICE: QuestionAdvice[] = [
  {
    key: "fewFriends",
    title: { zh: "朋友人數少於 10 位", en: "Fewer than 10 friends" },
    action: { zh: "朋友少不代表詐騙；先確認交易紀錄，避免提前付款。", en: "Few friends alone do not prove fraud. Check transaction history before paying." },
    message: { zh: "您好，方便在這個聊天室提供過往交易評價或紀錄，讓我確認一下嗎？請勿提供私人證件或敏感資訊，謝謝。", en: "Hello, could you share previous transaction reviews or history in this chat so I can check? Please do not send private ID documents or sensitive information. Thank you." },
  },
  {
    key: "newAccount",
    title: { zh: "帳號建立未滿一個月", en: "Account was created within the last month" },
    action: { zh: "新帳號不一定有問題；先確認商品與交易紀錄，勿急著付款。", en: "A new account is not necessarily fraudulent. Check the item and transaction history before paying." },
    message: { zh: "您好，因為帳號比較新，我想先確認商品與交易紀錄，方便在這個聊天室提供商品實拍或過往交易評價嗎？謝謝。", en: "Hello, since the account is quite new, I would like to check the item and transaction history first. Could you share actual item photos or previous transaction reviews in this chat? Thank you." },
  },
  {
    key: "fakeIdentity",
    title: { zh: "名稱或照片不像真人", en: "Profile name or photo doesn't look like a real person" },
    action: { zh: "不要只憑名稱或照片下結論；在原聊天室確認交易細節，勿要求私人證件。", en: "Do not judge by a name or photo alone. Confirm transaction details in this chat without requesting private ID documents." },
    message: { zh: "您好，我想先確認交易細節，方便在這個聊天室說明商品狀況與交易方式嗎？不需要提供私人證件，謝謝。", en: "Hello, I would like to confirm the transaction details first. Could you describe the item's condition and how we will trade in this chat? No private ID documents are needed. Thank you." },
  },
  {
    key: "emptyProfile",
    title: { zh: "個人檔案內容空白", en: "Profile content is empty" },
    action: { zh: "資訊不足時，先確認商品與交易評價，再決定是否繼續。", en: "When profile information is limited, check the item and transaction reviews before deciding to proceed." },
    message: { zh: "您好，因為個人檔案資訊較少，方便在這個聊天室提供商品實拍與過往交易評價嗎？確認後我再決定是否交易，謝謝。", en: "Hello, since there is little information on your profile, could you share actual item photos and previous transaction reviews in this chat? I will decide whether to proceed after checking. Thank you." },
  },
  {
    key: "cannotMeet",
    title: { zh: "無法面交，必須宅配", en: "Cannot meet in person, must deliver" },
    action: { zh: "若您只接受面交，請明確告知；對方無法配合就停止交易。", en: "If you only accept in-person transactions, state that clearly and decline if they cannot agree." },
    message: { zh: "不好意思，我只接受面交自取，如果無法面交我就不買了/不賣了，謝謝。", en: "Sorry, I only accept face-to-face transactions. If delivery is the only option, I will have to pass. Thank you." },
  },
  {
    key: "privateLocationMeetup",
    title: { zh: "提出在私人場合面交", en: "Proposes meeting at a private location" },
    action: MEETUP_ADVICE.lead,
    message: MEETUP_ADVICE.message,
  },
  {
    key: "bankAccount",
    title: { zh: "詢問你的銀行帳號", en: "Asks for your bank account" },
    action: { zh: "選擇平台官方金流或當面現金交易，不提供私人銀行帳號。", en: "Choose the platform's official payment system or cash in person rather than sharing your private bank account." },
    message: { zh: "交易請直接透過平台的官方金流或當面現金交易，我不提供私人銀行帳號喔。", en: "Please use the platform's official payment system or cash in person. I do not provide my private bank account." },
  },
  {
    key: "onlineBankingOrAtm",
    title: { zh: "要求您操作網銀或 ATM", en: "Asks you to operate online banking or an ATM" },
    action: { zh: "立即停止交易，不依對方指示操作網銀或 ATM。", en: "Stop the transaction and do not follow their instructions to use online banking or an ATM." },
    message: { zh: "我不會去操作 ATM 或網銀，這聽起來像詐騙，交易取消。", en: "I will not operate any ATM or online banking. This sounds suspicious, so I am canceling the transaction." },
  },
  {
    key: "customerServiceLink",
    title: { zh: "要求您點擊客服連結", en: "Asks you to click a customer-service link" },
    action: { zh: "暫停交易，勿點擊對方提供的客服連結；如需客服，從官方平台自行進入。", en: "Pause the transaction. Do not open their customer-service link; access support through the official platform yourself." },
    message: linkReply,
  },
  {
    key: "externalLink",
    title: { zh: "要求您點擊外部連結", en: "Asks you to go to an external link" },
    action: { zh: "暫停交易，不點擊外部連結，也不在連結頁面輸入任何資料。", en: "Pause the transaction. Do not open external links or enter information on linked pages." },
    message: linkReply,
  },
  {
    key: "lineRedirect",
    title: { zh: "要求您加 LINE 或轉接其他客服", en: "Asks you to add them on LINE or redirect you to other customer service" },
    action: { zh: "暫停交易，保留原聊天室紀錄，不轉移到其他通訊軟體或陌生客服。", en: "Pause the transaction and keep records in this chat. Do not move to other apps or unfamiliar support contacts." },
    message: { zh: "我們就在這個聊天室談就好，不需要加 LINE 或轉移其他軟體，謝謝。", en: "Let's keep our conversation right here in this chat. There is no need to add LINE or switch to other apps." },
  },
  {
    key: "maiHuoBian",
    title: { zh: "向您分享賣貨便連結", en: "Shares a 賣貨便 link with you" },
    action: { zh: "暫停交易，不開啟對方提供的賣貨便連結；從平台官方入口自行確認訂單。", en: "Pause the transaction. Do not open the supplied delivery link; check orders through the platform's official entry point." },
    message: { zh: "請直接透過本平台的官方下單機制購買，我不會點您提供的賣貨便連結。", en: "Please place the order directly through the platform's official system. I will not click the delivery link you provided." },
  },
  {
    key: "accountPasswords",
    title: { zh: "要求提供任何帳號密碼", en: "Asks for any account password" },
    action: { zh: "立即停止交易，不提供密碼；若已提供，請從官方入口更改密碼。", en: "Stop the transaction and never share passwords. If already shared, change them through the official service." },
    message: { zh: "帳號密碼是絕對不會提供的，請停止這種要求。", en: "I will never share my account password under any circumstances. Please stop asking." },
  },
  {
    key: "privateDocuments",
    title: { zh: "要求提供任何私人證件及資訊", en: "Asks for any private ID document or personal information" },
    action: { zh: "立即停止交易，不傳送私人證件或個人敏感資訊，並保留對話紀錄。", en: "Stop the transaction. Do not send private ID documents or sensitive personal information, and keep the chat records." },
    message: { zh: "這是個人的敏感隱私與證件，我不可能提供給您。", en: "This is sensitive personal information and ID data, and I will not share it with you." },
  },
];

export function getSelectedAdvice(profile: ProfileAnswers, seller: SellerAnswers): QuestionAdvice[] {
  const selected: Partial<Record<AdviceKey, boolean>> = {
    ...profile,
    ...seller,
    fewFriends: profile.friendCount !== null && profile.friendCount < 10,
  };
  return QUESTION_ADVICE.filter(({ key }) => selected[key] === true);
}