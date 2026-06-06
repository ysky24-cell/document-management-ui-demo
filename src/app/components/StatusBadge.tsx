import { type DocStatus, type AccessLevel } from "../data/documents";

const STATUS_CONFIG: Record<
  DocStatus,
  { label: string; bg: string; text: string; border: string; icon: string }
> = {
  最新版: {
    label: "最新版",
    bg: "#F1FAF1",
    text: "#107C10",
    border: "#C8E6C9",
    icon: "✓",
  },
  改定中: {
    label: "改定中",
    bg: "#FFF4E6",
    text: "#8A4B00",
    border: "#FFE0B2",
    icon: "✎",
  },
  承認待ち: {
    label: "承認待ち",
    bg: "#FFF9E6",
    text: "#8A6200",
    border: "#FFE9A0",
    icon: "⏳",
  },
  差戻し: {
    label: "差戻し",
    bg: "#FDF3F3",
    text: "#D13438",
    border: "#FFCDD2",
    icon: "↩",
  },
  レビュー期限切れ: {
    label: "期限切れ",
    bg: "#FDF3F3",
    text: "#D13438",
    border: "#FFCDD2",
    icon: "!",
  },
  廃止予定: {
    label: "廃止予定",
    bg: "#F5F5F5",
    text: "#605E5C",
    border: "#D2D0CE",
    icon: "✕",
  },
  証跡あり: {
    label: "証跡あり",
    bg: "#EFF6FC",
    text: "#004578",
    border: "#C7E0F4",
    icon: "🔗",
  },
  所有者未設定: {
    label: "所有者未設定",
    bg: "#FAF0FC",
    text: "#5C2D91",
    border: "#E1D5F5",
    icon: "?",
  },
  リンク切れ: {
    label: "リンク切れ",
    bg: "#FDF3F3",
    text: "#D13438",
    border: "#FFCDD2",
    icon: "⚠",
  },
};

const ACCESS_CONFIG: Record<
  AccessLevel,
  { label: string; bg: string; text: string; border: string }
> = {
  全社公開: { label: "全社公開", bg: "#EFF6FC", text: "#004578", border: "#C7E0F4" },
  部署限定: { label: "部署限定", bg: "#FFF4E6", text: "#8A4B00", border: "#FFE0B2" },
  管理者限定: { label: "管理者限定", bg: "#FAF0FC", text: "#5C2D91", border: "#E1D5F5" },
  監査限定: { label: "監査限定", bg: "#F3F0FA", text: "#32145A", border: "#C8BEED" },
  非公開: { label: "非公開", bg: "#F5F5F5", text: "#605E5C", border: "#D2D0CE" },
};

interface StatusBadgeProps {
  status: DocStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];
  const px = size === "sm" ? "px-1.5 py-0.5 text-[11px]" : "px-2 py-0.5 text-xs";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded ${px} font-medium border`}
      style={{ background: cfg.bg, color: cfg.text, borderColor: cfg.border }}
    >
      <span aria-hidden="true" style={{ fontSize: "10px" }}>{cfg.icon}</span>
      {cfg.label}
    </span>
  );
}

interface AccessBadgeProps {
  access: AccessLevel;
  size?: "sm" | "md";
}

export function AccessBadge({ access, size = "md" }: AccessBadgeProps) {
  const cfg = ACCESS_CONFIG[access];
  const px = size === "sm" ? "px-1.5 py-0.5 text-[11px]" : "px-2 py-0.5 text-xs";
  return (
    <span
      className={`inline-flex items-center rounded ${px} font-medium border`}
      style={{ background: cfg.bg, color: cfg.text, borderColor: cfg.border }}
    >
      {cfg.label}
    </span>
  );
}

export function ApprovalBadge({ status }: { status: string }) {
  const isOk = status === "承認済";
  const isPending = status === "承認待ち";
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded border font-medium"
      style={{
        background: isOk ? "#F1FAF1" : isPending ? "#FFF9E6" : "#F5F5F5",
        color: isOk ? "#107C10" : isPending ? "#8A6200" : "#605E5C",
        borderColor: isOk ? "#C8E6C9" : isPending ? "#FFE9A0" : "#D2D0CE",
      }}
    >
      {isOk ? "✓ " : isPending ? "⏳ " : ""}{status}
    </span>
  );
}
