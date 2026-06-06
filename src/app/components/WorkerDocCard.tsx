import { ExternalLink, Files, MessageSquare, Lock } from "lucide-react";
import { type Document } from "../data/documents";
import { StatusBadge, AccessBadge } from "./StatusBadge";

interface WorkerDocCardProps {
  doc: Document;
  onClick?: () => void;
  isSelected?: boolean;
}

export function WorkerDocCard({ doc, onClick, isSelected }: WorkerDocCardProps) {
  const isRestricted = doc.access !== "全社公開";
  const isAuditOnly = doc.access === "監査限定";

  return (
    <div
      onClick={onClick}
      className={`bg-card border rounded p-4 cursor-pointer transition-all hover:shadow-sm ${
        isSelected
          ? "border-primary ring-1 ring-primary/30"
          : "border-border hover:border-primary/40"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="text-[11px] font-mono text-muted-foreground mb-0.5">{doc.id}</p>
          <h3 className="text-sm font-semibold text-foreground leading-snug">{doc.title}</h3>
        </div>
        <div className="flex flex-col gap-1 items-end shrink-0">
          <StatusBadge status={doc.status} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3">
        <MetaRow label="文書種別" value={doc.type} />
        <MetaRow label="所管部署" value={doc.dept} />
        <MetaRow label="最終更新日" value={doc.lastRevised} />
        <MetaRow label="現行版" value={doc.version} />
        <div className="col-span-2 flex items-center gap-1.5 mt-0.5">
          <span className="text-[11px] text-muted-foreground">公開区分</span>
          <AccessBadge access={doc.access} size="sm" />
        </div>
      </div>

      {isAuditOnly ? (
        <div className="flex items-center gap-2 py-2 px-3 rounded bg-muted/60 border border-border">
          <Lock size={13} className="text-muted-foreground shrink-0" />
          <p className="text-xs text-muted-foreground">この文書は監査者のみ閲覧できます</p>
          <button className="ml-auto text-xs text-primary hover:underline whitespace-nowrap">
            監査権限を確認する
          </button>
        </div>
      ) : isRestricted ? (
        <div className="flex items-center gap-2 py-2 px-3 rounded bg-muted/60 border border-border">
          <Lock size={13} className="text-muted-foreground shrink-0" />
          <p className="text-xs text-muted-foreground">本文の閲覧には権限が必要です</p>
          <button className="ml-auto text-xs text-primary hover:underline whitespace-nowrap">
            閲覧権限を申請する
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs rounded hover:bg-primary/90 transition-colors font-medium">
            <ExternalLink size={12} />
            最新版を開く
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-foreground text-xs rounded hover:bg-muted transition-colors">
            <Files size={12} />
            関連文書を見る
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-foreground text-xs rounded hover:bg-muted transition-colors">
            <MessageSquare size={12} />
            問い合わせる
          </button>
        </div>
      )}
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-[11px] text-muted-foreground shrink-0">{label}</span>
      <span className="text-xs text-foreground truncate">{value}</span>
    </div>
  );
}
