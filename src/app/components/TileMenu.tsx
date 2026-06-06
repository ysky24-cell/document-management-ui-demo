import {
  Briefcase,
  FileText,
  Building2,
  Layers,
  Clock,
  Star,
  AlertCircle,
  Lock,
} from "lucide-react";
import { type DocHierarchy } from "../data/documents";

interface TileMenuProps {
  onSelect?: (category: string, value: string) => void;
}

const BROWSE_TILES = [
  {
    icon: Briefcase,
    label: "業務プロセスから探す",
    items: ["インシデント対応", "経費精算", "入退社", "情報セキュリティ管理"],
    color: "#0078D4",
  },
  {
    icon: FileText,
    label: "文書種別から探す",
    items: ["マニュアル / Playbook", "規程 / スタンダード", "プロセス定義", "RACI"],
    color: "#107C10",
  },
  {
    icon: Building2,
    label: "所管部署から探す",
    items: ["情報システム部", "経理部", "人事部", "法務部"],
    color: "#8764B8",
  },
  {
    icon: Layers,
    label: "文書階層から探す",
    items: ["ポリシー", "スタンダード / 規程類", "マニュアル / Playbook", "証跡類"],
    color: "#FF8C00",
  },
];

export function TileMenu({ onSelect }: TileMenuProps) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">カテゴリから探す</p>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {BROWSE_TILES.map((tile) => {
          const Icon = tile.icon;
          return (
            <div
              key={tile.label}
              className="bg-card border border-border rounded p-4 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-7 h-7 rounded flex items-center justify-center"
                  style={{ background: tile.color + "18" }}
                >
                  <Icon size={15} style={{ color: tile.color }} />
                </div>
                <p className="text-xs font-semibold text-foreground leading-tight">{tile.label}</p>
              </div>
              <div className="flex flex-col gap-1">
                {tile.items.map((item) => (
                  <button
                    key={item}
                    onClick={() => onSelect?.(tile.label, item)}
                    className="text-left text-xs text-primary hover:underline truncate"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface ShortcutCardsProps {
  onSelect?: (type: string) => void;
}

const SHORTCUTS = [
  {
    icon: Star,
    label: "最新版",
    desc: "現在有効な最新の文書",
    color: "#107C10",
    bg: "#F1FAF1",
    type: "最新版",
  },
  {
    icon: Clock,
    label: "よく使う文書",
    desc: "利用頻度が高い文書",
    color: "#0078D4",
    bg: "#EFF6FC",
    type: "よく使う",
  },
  {
    icon: FileText,
    label: "最近改定された文書",
    desc: "直近3ヶ月に改定された文書",
    color: "#8764B8",
    bg: "#FAF0FC",
    type: "最近改定",
  },
  {
    icon: AlertCircle,
    label: "承認待ち・改定中",
    desc: "対応が必要な文書",
    color: "#FF8C00",
    bg: "#FFF4E6",
    type: "要対応",
  },
  {
    icon: Lock,
    label: "権限申請が必要",
    desc: "閲覧に権限が必要な文書",
    color: "#605E5C",
    bg: "#F5F5F5",
    type: "権限申請",
  },
];

export function ShortcutCards({ onSelect }: ShortcutCardsProps) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">ショートカット</p>
      <div className="flex flex-wrap gap-2">
        {SHORTCUTS.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.type}
              onClick={() => onSelect?.(s.type)}
              className="flex items-center gap-2 px-3 py-2 border border-border rounded bg-card hover:border-primary/40 transition-colors text-left"
              style={{ minWidth: 140 }}
            >
              <div
                className="w-7 h-7 rounded flex items-center justify-center shrink-0"
                style={{ background: s.bg }}
              >
                <Icon size={14} style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">{s.label}</p>
                <p className="text-[11px] text-muted-foreground leading-tight">{s.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
