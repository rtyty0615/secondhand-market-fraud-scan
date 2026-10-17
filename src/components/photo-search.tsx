import { useState } from "react";
import { ExternalLink, ScanSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PhotoSearch() {
  const [photoUrl, setPhotoUrl] = useState("");
  const [expanded, setExpanded] = useState(false);
  const trimmed = photoUrl.trim();
  let validUrl = "";
  if (trimmed) {
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol === "https:" || parsed.protocol === "http:") validUrl = parsed.href;
    } catch {
      // Keep invalid links out of the search-provider URL.
    }
  }
  const invalid = Boolean(trimmed && !validUrl);

  return (
    <div className="border-l-2 border-border pl-4">
      <Button
        type="button"
        variant="ghost"
        className="h-auto max-w-full justify-start whitespace-normal px-0 text-left"
        aria-expanded={expanded}
        aria-controls="photo-search-options"
        onClick={() => setExpanded((value) => !value)}
      >
        <ScanSearch aria-hidden="true" />
        <span>Check for reused photos<span className="block text-xs text-muted-foreground">搜尋照片是否被盜用</span></span>
      </Button>
      {expanded && (
        <div id="photo-search-options" className="mt-3 space-y-3">
          <label className="block text-sm text-foreground" htmlFor="profile-photo-url">
            Photo URL (optional)
            <span className="block text-muted-foreground">照片網址（選填）</span>
          </label>
          <input
            id="profile-photo-url"
            type="url"
            value={photoUrl}
            onChange={(event) => setPhotoUrl(event.target.value)}
            placeholder="https://…"
            aria-invalid={invalid}
            aria-describedby="photo-search-note"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
          />
          {invalid && <p role="alert" className="text-xs text-destructive">Enter a full http:// or https:// photo URL.<br />請輸入完整的 http:// 或 https:// 照片網址。</p>}
          <div className="flex flex-wrap gap-2">
            {[
              { name: "Google Lens", href: validUrl ? `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(validUrl)}` : "https://lens.google/" },
              { name: "TinEye", href: validUrl ? `https://tineye.com/search?url=${encodeURIComponent(validUrl)}` : "https://tineye.com/" },
            ].map((provider) => invalid ? (
              <Button key={provider.name} type="button" variant="outline" disabled>{provider.name}<ExternalLink aria-hidden="true" /></Button>
            ) : (
              <Button key={provider.name} asChild variant="outline">
                <a href={provider.href} target="_blank" rel="noopener noreferrer">{provider.name}<ExternalLink aria-hidden="true" /></a>
              </Button>
            ))}
          </div>
          <p id="photo-search-note" className="text-xs text-muted-foreground">
            Searches open in a new tab. Without a URL, upload the photo on the search website. A supplied URL is shared with the selected service.
            <span className="mt-1 block">搜尋會在新分頁開啟。沒有網址時，可在搜尋網站上傳照片。輸入的網址會傳送至你選擇的服務。</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Public photos from Instagram, Facebook, Threads, TikTok and other websites may appear if indexed. Private or unindexed photos are not covered. No match does not prove an account is genuine; a match alone does not prove fraud.
            <span className="mt-1 block">Instagram、Facebook、Threads、TikTok 等網站的公開照片若已被收錄，可能出現在結果中；私人或未收錄的照片無法涵蓋。沒有結果不代表帳號真實，找到相同照片也不代表一定是詐騙。</span>
          </p>
        </div>
      )}
    </div>
  );
}