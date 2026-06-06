import { Download, History, CheckCircle, Link, Shield, Lock } from "lucide-react";
import { type Document } from "../data/documents";
import { StatusBadge, AccessBadge } from "./StatusBadge";
import { AuditHierarchyView } from "./DocumentHierarchyNav";

interface AuditorDocCardProps {
  doc: Document;
  onClick?: () => void;
  isSelected?: boolean;
}

export function AuditorDocCard({ doc, onClick, isSelected }: AuditorDocCardProps) {
  const isRestricted = doc.access === "監査限定" || doc.access === "非公開";

  return (
    <div
      onClick={onClick}
      className={`bg-card border rounded p-4 cursor-pointer transition-all hover:shadow-sm ${
        isSelected
          ? "border-primary ring-1 ring-primary/30"
          : "border-border hover:border-primary/40"
      }`}
    >
      {/* header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="text-[11px] font-mono text-muted-foreground mb-0.5">{doc.id}</p>
          <h3 className="text-sm font-semibold text-foreground leading-snug">{doc.title}</h3>
        </div>
        <div className="flex flex-col gap-1 items-end shrink-0">
          <StatusBadge status={doc.status} />
          <AccessBadge access={doc.access} size="sm" />
        </div>
      </div>

      {/* meta grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-3 pb-3 border-b border-border">
        <MetaRow label="所管部署" value={doc.dept} />
        <MetaRow label="文書オーナー" value={doc.owner} />
        <MetaRow label="承認者" value={doc.approver || "—"} />
        <MetaRow label="承認日" value={doc.approvalDate} />
        <MetaRow label="適用開始日" value={doc.effectiveDate} />
        <MetaRow label="現行版" value={doc.version} />
        <div className="col-span-2">
          <MetaRow label="最終改定理由" value={doc.changeReason} />
        </div>
        <div className="col-span-2">
          <MetaRow label="監査対象期間" value={doc.auditPeriod} />
        </div>
      </div>

      {/* evidence */}
      {doc.evidence.length > 0 && (
        <div className="mb-3 pb-3 border-b border-border">
          <p className="text-[11px] text-muted-foreground mb-1.5">関連証跡</p>
          <div className="flex flex-wrap gap-1.5">
            {doc.evidence.map((e) => (
              <span
                key={e}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] bg-secondary text-secondary-foreground border border-border rounded"
              >
                <Link size={10} />
                {e}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* related docs */}
      {doc.relatedDocs.length > 0 && (
        <div className="mb-3 pb-3 border-b border-border">
          <p className="text-[11px] text-muted-foreground mb-1.5">関連文書</p>
          <div className="flex flex-wrap gap-1.5">
            {doc.relatedDocs.map((id) => (
              <span
                key={id}
                className="text-[11px] font-mono px-2 py-0.5 bg-muted text-muted-foreground rounded border border-border"
              >
                {id}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* actions */}
      {isRestricted ? (
        <div className="flex items-center gap-2 py-2 px-3 rounded bg-muted/60 border border-border">
          <Lock size={13} className="text-muted-foreground shrink-0" />
          <p className="text-xs text-muted-foreground">監査権限が必要です</p>
          <button className="ml-auto text-xs text-primary hover:underline whitespace-nowrap">
            監査権限を確認する
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs rounded hover:bg-primary/90 transition-colors font-medium">
            <Shield size={12} />
            証跡を確認
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-foreground text-xs rounded hover:bg-muted transition-colors">
            <History size={12} />
            改定履歴を見る
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-foreground text-xs rounded hover:bg-muted transition-colors">
            <CheckCircle size={12} />
            承認ログを見る
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-foreground text-xs rounded hover:bg-muted transition-colors">
            <Download size={12} />
            監査用に出力
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
      <span className="text-xs text-foreground">{value}</span>
    </div>
  );
}
