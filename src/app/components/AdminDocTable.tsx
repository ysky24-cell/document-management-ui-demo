import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  History,
  CheckCircle,
  RefreshCw,
  Link,
  Plus,
  Send,
} from "lucide-react";
import { type Document, ADMIN_FILTERS } from "../data/documents";
import { StatusBadge, AccessBadge, ApprovalBadge } from "./StatusBadge";

interface AdminDocTableProps {
  docs: Document[];
  onDocClick?: (doc: Document) => void;
  selectedId?: string;
}

export function AdminDocTable({ docs, onDocClick, selectedId }: AdminDocTableProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortCol, setSortCol] = useState<string>("id");
  const [sortAsc, setSortAsc] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleFilter = (f: string) =>
    setActiveFilters((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );

  const handleSort = (col: string) => {
    if (sortCol === col) setSortAsc(!sortAsc);
    else { setSortCol(col); setSortAsc(true); }
  };

  const filtered =
    activeFilters.length === 0
      ? docs
      : docs.filter((d) =>
          activeFilters.some(
            (f) =>
              d.status === f ||
              (f === "所有者未設定" && !d.owner) ||
              (f === "リンク切れ" && d.status === "リンク切れ")
          )
        );

  return (
    <div className="space-y-3">
      {/* filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-muted-foreground">フィルター：</span>
        {ADMIN_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => toggleFilter(f)}
            className={`px-2.5 py-1 text-xs rounded border transition-colors ${
              activeFilters.includes(f)
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:border-primary/50"
            }`}
          >
            {f}
          </button>
        ))}
        {activeFilters.length > 0 && (
          <button
            onClick={() => setActiveFilters([])}
            className="text-xs text-muted-foreground hover:text-foreground underline"
          >
            クリア
          </button>
        )}
      </div>

      {/* table */}
      <div className="bg-card border border-border rounded overflow-auto">
        <table className="w-full text-xs border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-muted/70 border-b border-border">
              {[
                ["id", "文書ID"],
                ["title", "文書名"],
                ["hierarchy", "文書階層"],
                ["dept", "所管部署"],
                ["owner", "文書オーナー"],
                ["version", "版数"],
                ["status", "ステータス"],
                ["lastRevised", "最終改定日"],
                ["nextReview", "次回レビュー"],
                ["approvalStatus", "承認状況"],
                ["access", "公開区分"],
              ].map(([col, label]) => (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  className="text-left px-3 py-2.5 text-muted-foreground font-semibold cursor-pointer hover:text-foreground whitespace-nowrap select-none"
                >
                  <span className="flex items-center gap-1">
                    {label}
                    {sortCol === col ? (
                      sortAsc ? (
                        <ChevronUp size={11} />
                      ) : (
                        <ChevronDown size={11} />
                      )
                    ) : null}
                  </span>
                </th>
              ))}
              <th className="text-left px-3 py-2.5 text-muted-foreground font-semibold whitespace-nowrap">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((doc) => {
              const isSelected = doc.id === selectedId;
              const isExpanded = expanded === doc.id;
              return (
                <>
                  <tr
                    key={doc.id}
                    onClick={() => onDocClick?.(doc)}
                    className={`border-b border-border cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-secondary/60"
                        : "hover:bg-muted/40"
                    }`}
                  >
                    <td className="px-3 py-2.5 font-mono text-muted-foreground whitespace-nowrap">
                      {doc.id}
                    </td>
                    <td className="px-3 py-2.5 font-medium text-foreground max-w-[200px]">
                      <div className="truncate" title={doc.title}>{doc.title}</div>
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">
                      {doc.hierarchy}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">{doc.dept}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-muted-foreground">
                      {doc.owner || (
                        <span className="text-destructive">未設定</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 font-mono whitespace-nowrap">{doc.version}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <StatusBadge status={doc.status} size="sm" />
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-muted-foreground">
                      {doc.lastRevised}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-muted-foreground">
                      {doc.nextReview}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <ApprovalBadge status={doc.approvalStatus} />
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <AccessBadge access={doc.access} size="sm" />
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpanded(isExpanded ? null : doc.id);
                        }}
                        className="text-xs text-primary hover:underline"
                      >
                        管理情報を確認
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${doc.id}-expanded`} className="bg-secondary/30">
                      <td colSpan={12} className="px-4 py-3">
                        <AdminCardExpanded doc={doc} />
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground text-sm">
            該当する文書がありません
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{filtered.length} 件表示</p>
    </div>
  );
}

function AdminCardExpanded({ doc }: { doc: Document }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-[11px] text-muted-foreground mb-0.5">承認者</p>
          <p className="text-xs font-medium">{doc.approver || "—"}</p>
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground mb-0.5">利用頻度</p>
          <p className="text-xs font-medium">{doc.usageFreq}</p>
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground mb-0.5">関連文書</p>
          <p className="text-xs font-medium">
            {doc.relatedDocs.length > 0 ? doc.relatedDocs.join(", ") : "—"}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border bg-card text-foreground text-xs rounded hover:bg-muted transition-colors">
          <History size={12} />
          版履歴を見る
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border bg-card text-foreground text-xs rounded hover:bg-muted transition-colors">
          <CheckCircle size={12} />
          承認状況を見る
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border bg-card text-foreground text-xs rounded hover:bg-muted transition-colors">
          <Send size={12} />
          レビュー依頼
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border bg-card text-foreground text-xs rounded hover:bg-muted transition-colors">
          <Link size={12} />
          リンク確認
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border bg-card text-foreground text-xs rounded hover:bg-muted transition-colors">
          <Plus size={12} />
          棚卸し対象に追加
        </button>
      </div>
    </div>
  );
}
