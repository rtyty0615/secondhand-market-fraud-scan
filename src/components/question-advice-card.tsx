import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { QuestionAdvice } from "@/lib/question-advice";

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    try {
      if (!document.execCommand("copy")) throw new Error("Copy failed");
    } finally {
      area.remove();
    }
  }
}

export function QuestionAdviceCard({ advice }: { advice: QuestionAdvice }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  useEffect(() => {
    if (status === "idle") return;
    const timeout = window.setTimeout(() => setStatus("idle"), 2500);
    return () => window.clearTimeout(timeout);
  }, [status]);

  const copy = async () => {
    try {
      await copyText(`${advice.message.zh}\n${advice.message.en}`);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  };

  return (
    <article data-advice-key={advice.key} className="rounded-lg border border-border bg-muted/40 p-4">
      <p className="text-sm font-medium text-destructive">
        {advice.action.zh}
        <span className="mt-1 block text-xs text-destructive/80">{advice.action.en}</span>
      </p>
      <blockquote className="mt-2 border-l-2 border-border pl-3 text-sm leading-relaxed text-foreground">
        {advice.message.zh}
        <span className="mt-2 block text-muted-foreground">{advice.message.en}</span>
      </blockquote>
      <Button type="button" variant="outline" size="sm" className="mt-4" onClick={copy} aria-label={`Copy message 複製訊息：${advice.title.zh}`}>
        {status === "copied" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        {status === "copied" ? "Copied 已複製" : "Copy message 複製訊息"}
      </Button>
      <span className="mt-2 block text-xs text-muted-foreground" role="status" aria-live="polite">
        {status === "copied" && "已複製中英文訊息 / Chinese and English copied"}
        {status === "error" && "無法複製，請手動選取訊息。 / Unable to copy. Please select the message manually."}
      </span>
    </article>
  );
}