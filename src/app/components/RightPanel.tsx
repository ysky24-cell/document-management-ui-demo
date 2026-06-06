import {
  ExternalLink,
  Files,
  MessageSquare,
  History,
  CheckCircle,
  Download,
  Shield,
  X,
  Link,
  Send,
  Lock,
} from "lucide-react";
import { type Document } from "../data/documents";
import { StatusBadge, AccessBadge, ApprovalBadge } from "./StatusBadge";
import { AuditHierarchyView } from "./DocumentHierarchyNav";

type Mode = "worker" | "admin" | "auditor";

interface RightPanelProps {
  doc: Document | null;
  mode: Mode;
  onClose: () => void;
}

export function RightPanel({ doc, mode, onClose }: RightPanelProps) {
  if (!doc) {
    return (
      <div className="bg-card border border-border rounded flex flex-col items-center justify-center h-full min-h-[300px] text-center p-8">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <Files size={20} className="text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">文書を選択すると詳細が表示されます</p>
      </div>
    );
  }

  const isRestricted = doc.access !== "全社公開" && mode === "worker";
  const isAuditRestricted = doc.access === "監査限定" && mode !== "auditor";

  return (
    <div className="bg-card border border-border rounded flex flex-col overflow-hidden">
      {/* header */}
      <div className="flex items-start justify-between gap-2 p-4 border-b border-border bg-muted/30">
        <div className="min-w-0">
          <p className="text-[11px] font-mono text-muted-foreground mb-0.5">{doc.id}</p>
          <h2 className="text-sm font-semibold text-foreground leading-snug">{doc.title}</h2>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-0.5"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* badges */}
        <div className="flex flex-wrap gap-1.5">
          <StatusBadge status={doc.status} />
          <AccessBadge access={doc.access} />
          {mode === "admin" && <ApprovalBadge status={doc.approvalStatus} />}
        </div>

        {/* common meta */}
        <Section title="文書情報">
          <Grid>
            <MetaItem label="文書種別" value={doc.type} />
            <MetaItem label="文書階層" value={doc.hierarchy} />
            <MetaItem label="所管部署" value={doc.dept} />
            <MetaItem label="文書オーナー" value={doc.owner} />
            <MetaItem label="現行版数" value={doc.version} />
            <MetaItem label="最終改定日" value={doc.lastRevised} />
            {doc.process && <MetaItem label="関連業務" value={doc.process} />}
          </Grid>
        </Section>

        {/* admin section */}
        {mode === "admin" && (
          <Section title="管理情報">
            <Grid>
              <MetaItem label="承認者" value={doc.approver || "—"} />
              <MetaItem label="次回レビュー" value={doc.nextReview} />
              <MetaItem label="利用頻度" value={doc.usageFreq} />
            </Grid>
            {doc.relatedDocs.length > 0 && (
              <div className="mt-2">
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
          </Section>
        )}

        {/* auditor section */}
        {mode === "auditor" && (
          <>
            <Section title="承認・適用情報">
              <Grid>
                <MetaItem label="承認日" value={doc.approvalDate} />
                <MetaItem label="適用開始日" value={doc.effectiveDate} />
                <MetaItem label="改定理由" value={doc.changeReason} />
                <MetaItem label="監査対象期間" value={doc.auditPeriod} />
              </Grid>
            </Section>
            {doc.evidence.length > 0 && (
              <Section title="関連証跡">
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
              </Section>
            )}
            <AuditHierarchyView currentDocId={doc.id} />
          </>
        )}
      </div>

      {/* action footer */}
      <div className="p-4 border-t border-border bg-muted/20">
        {isAuditRestricted || (isRestricted && doc.access === "監査限定") ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 rounded bg-muted border border-border">
              <Lock size={13} className="text-muted-foreground" />
              <p className="text-xs text-muted-foreground">この文書は監査者のみ閲覧できます</p>
            </div>
            <button className="w-full flex items-center justify-center gap-1.5 py-2 border border-border text-foreground text-xs rounded hover:bg-muted transition-colors">
              <MessageSquare size={12} />
              管理者に問い合わせる
            </button>
          </div>
        ) : isRestricted ? (
          <div className="space-y-2">
            <button className="w-full flex items-center justify-center gap-1.5 py-2 bg-primary text-primary-foreground text-xs rounded hover:bg-primary/90 transition-colors font-medium">
              <Lock size={12} />
              閲覧権限を申請する
            </button>
            <button className="w-full flex items-center justify-center gap-1.5 py-2 border border-border text-foreground text-xs rounded hover:bg-muted transition-colors">
              <MessageSquare size={12} />
              管理者に問い合わせる
            </button>
          </div>
        ) : mode === "worker" ? (
          <div className="flex flex-col gap-2">
            <button className="w-full flex items-center justify-center gap-1.5 py-2 bg-primary text-primary-foreground text-xs rounded hover:bg-primary/90 transition-colors font-medium">
              <ExternalLink size={12} />
              最新版を開く
            </button>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1 py-1.5 border border-border text-foreground text-xs rounded hover:bg-muted transition-colors">
                <Files size={11} />
                関連文書
              </button>
              <button className="flex-1 flex items-center justify-center gap-1 py-1.5 border border-border text-foreground text-xs rounded hover:bg-muted transition-colors">
                <MessageSquare size={11} />
                問い合わせ
              </button>
            </div>
          </div>
        ) : mode === "admin" ? (
          <div className="flex flex-col gap-2">
            <button className="w-full flex items-center justify-center gap-1.5 py-2 bg-primary text-primary-foreground text-xs rounded hover:bg-primary/90 transition-colors font-medium">
              管理情報を確認
            </button>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: History, label: "版履歴" },
                { icon: CheckCircle, label: "承認状況" },
                { icon: Send, label: "レビュー依頼" },
                { icon: Link, label: "リンク確認" },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  className="flex items-center justify-center gap-1 py-1.5 border border-border text-foreground text-xs rounded hover:bg-muted transition-colors"
                >
                  <Icon size={11} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <button className="w-full flex items-center justify-center gap-1.5 py-2 bg-primary text-primary-foreground text-xs rounded hover:bg-primary/90 transition-colors font-medium">
              <Shield size={12} />
              証跡を確認
            </button>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: History, label: "改定履歴" },
                { icon: CheckCircle, label: "承認ログ" },
                { icon: Link, label: "関連証跡" },
                { icon: Download, label: "監査用出力" },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  className="flex items-center justify-center gap-1 py-1.5 border border-border text-foreground text-xs rounded hover:bg-muted transition-colors"
                >
                  <Icon size={11} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide border-b border-border pb-1">
        {title}
      </p>
      {children}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-1.5">{children}</div>;
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-[11px] text-muted-foreground w-24 shrink-0">{label}</span>
      <span className="text-xs text-foreground">{value}</span>
    </div>
  );
}
