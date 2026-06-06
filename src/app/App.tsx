import { useState } from "react";
import {
  FileText,
  Users,
  Shield,
  ChevronRight,
  Bell,
  Settings,
  HelpCircle,
  Search,
  LayoutGrid,
  List,
  RefreshCw,
} from "lucide-react";
import { DOCUMENTS, type Document, type DocHierarchy } from "./data/documents";
import { SearchBar } from "./components/SearchBar";
import { TileMenu, ShortcutCards } from "./components/TileMenu";
import { DocumentHierarchyNav } from "./components/DocumentHierarchyNav";
import { WorkerDocCard } from "./components/WorkerDocCard";
import { AdminDocTable } from "./components/AdminDocTable";
import { AuditorDocCard } from "./components/AuditorDocCard";
import { RightPanel } from "./components/RightPanel";
import { StatusBadge } from "./components/StatusBadge";

type Mode = "worker" | "admin" | "auditor";
type ViewLayout = "card" | "table";

const MODE_CONFIG = {
  worker: {
    label: "作業者モード",
    icon: FileText,
    desc: "必要な最新版文書をすばやく探すための表示です。",
    color: "#0078D4",
  },
  admin: {
    label: "管理者モード",
    icon: Users,
    desc: "文書の棚卸し、版管理、承認状況、レビュー期限を確認するための表示です。",
    color: "#107C10",
  },
  auditor: {
    label: "監査者モード",
    icon: Shield,
    desc: "文書階層、改定履歴、承認ログ、関連証跡を確認するための表示です。",
    color: "#8764B8",
  },
};

export default function App() {
  const [mode, setMode] = useState<Mode>("worker");
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [activeHierarchy, setActiveHierarchy] = useState<DocHierarchy | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [layout, setLayout] = useState<ViewLayout>("card");

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setSelectedDoc(null);
  };

  const filteredDocs = DOCUMENTS.filter((doc) => {
    if (activeHierarchy && doc.hierarchy !== activeHierarchy) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.id.toLowerCase().includes(q) ||
        doc.dept.toLowerCase().includes(q) ||
        doc.type.toLowerCase().includes(q) ||
        doc.status.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const modeIcon = MODE_CONFIG[mode];
  const ModeIcon = modeIcon.icon;

  const stats = {
    total: DOCUMENTS.length,
    latest: DOCUMENTS.filter((d) => d.status === "最新版").length,
    pending: DOCUMENTS.filter(
      (d) => d.status === "承認待ち" || d.status === "改定中"
    ).length,
    restricted: DOCUMENTS.filter(
      (d) => d.access !== "全社公開"
    ).length,
  };

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      {/* top bar */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 h-11">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
              {[0,1,2,3].map(i => (
                <div key={i} className="bg-white/80 rounded-[1px]" />
              ))}
            </div>
            <span className="text-sm font-semibold tracking-tight">規程・文書管理ハブ</span>
            <ChevronRight size={14} className="opacity-50" />
            <span className="text-sm opacity-80">社内ポータル</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-1.5 rounded hover:bg-white/10 transition-colors">
              <Bell size={16} />
            </button>
            <button className="p-1.5 rounded hover:bg-white/10 transition-colors">
              <HelpCircle size={16} />
            </button>
            <button className="p-1.5 rounded hover:bg-white/10 transition-colors">
              <Settings size={16} />
            </button>
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-semibold ml-1">
              田中
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-5 space-y-5">

        {/* page header */}
        <div className="bg-card border border-border rounded p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-foreground mb-1">規程・文書管理ハブ</h1>
              <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
                社内規程、標準、プロセス定義、RACI、マニュアル、Playbook、Agent Instruction、証跡へここからアクセスできます。
              </p>
              <SearchBar onSearch={handleSearch} />
            </div>
            {/* stats */}
            <div className="hidden lg:flex gap-3 shrink-0">
              {[
                { label: "総文書数", value: stats.total, color: "#0078D4" },
                { label: "最新版", value: stats.latest, color: "#107C10" },
                { label: "要対応", value: stats.pending, color: "#FF8C00" },
                { label: "権限制限", value: stats.restricted, color: "#8764B8" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-muted/60 border border-border rounded px-4 py-2.5 text-center min-w-[72px]"
                >
                  <p
                    className="text-xl font-bold leading-none mb-1"
                    style={{ color: s.color }}
                  >
                    {s.value}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* mode tabs */}
        <div className="bg-card border border-border rounded">
          <div className="flex border-b border-border">
            {(["worker", "admin", "auditor"] as Mode[]).map((m) => {
              const cfg = MODE_CONFIG[m];
              const Icon = cfg.icon;
              const isActive = mode === m;
              return (
                <button
                  key={m}
                  onClick={() => { setMode(m); setSelectedDoc(null); }}
                  className={`flex items-center gap-2 px-5 py-3 text-sm transition-colors border-b-2 relative ${
                    isActive
                      ? "border-primary text-primary font-semibold"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  }`}
                >
                  <Icon size={15} />
                  {cfg.label}
                </button>
              );
            })}
          </div>
          <div className="px-5 py-2.5 flex items-center gap-2">
            <ModeIcon size={14} style={{ color: modeIcon.color }} />
            <p className="text-xs text-muted-foreground">{modeIcon.desc}</p>
          </div>
        </div>

        {/* main layout */}
        <div className="flex gap-4 items-start">
          {/* left sidebar — hierarchy nav */}
          <aside className="hidden xl:block w-52 shrink-0 sticky top-16">
            <DocumentHierarchyNav
              activeLevel={activeHierarchy}
              onSelect={(level) =>
                setActiveHierarchy((prev) => (prev === level ? undefined : level))
              }
            />
          </aside>

          {/* main content */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* tile menu and shortcuts */}
            {mode === "worker" && (
              <div className="space-y-4">
                <TileMenu />
                <ShortcutCards />
              </div>
            )}

            {/* document list header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-foreground">文書一覧</h2>
                {activeHierarchy && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded border border-border">
                    {activeHierarchy}
                    <button
                      onClick={() => setActiveHierarchy(undefined)}
                      className="ml-1 opacity-60 hover:opacity-100"
                    >
                      ×
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded border border-border">
                    「{searchQuery.slice(0, 20)}…」
                    <button
                      onClick={() => setSearchQuery("")}
                      className="ml-1 opacity-60 hover:opacity-100"
                    >
                      ×
                    </button>
                  </span>
                )}
                <span className="text-xs text-muted-foreground">{filteredDocs.length} 件</span>
              </div>
              {mode !== "admin" && (
                <div className="flex gap-1 border border-border rounded overflow-hidden">
                  <button
                    onClick={() => setLayout("card")}
                    className={`p-1.5 transition-colors ${
                      layout === "card"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                    title="カード表示"
                  >
                    <LayoutGrid size={14} />
                  </button>
                  <button
                    onClick={() => setLayout("table")}
                    className={`p-1.5 transition-colors ${
                      layout === "table"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                    title="リスト表示"
                  >
                    <List size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* document list */}
            {mode === "worker" && (
              <div className={`grid gap-3 ${layout === "card" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
                {filteredDocs.map((doc) => (
                  <WorkerDocCard
                    key={doc.id}
                    doc={doc}
                    isSelected={selectedDoc?.id === doc.id}
                    onClick={() => setSelectedDoc(doc.id === selectedDoc?.id ? null : doc)}
                  />
                ))}
              </div>
            )}

            {mode === "admin" && (
              <AdminDocTable
                docs={filteredDocs}
                selectedId={selectedDoc?.id}
                onDocClick={(doc) =>
                  setSelectedDoc(doc.id === selectedDoc?.id ? null : doc)
                }
              />
            )}

            {mode === "auditor" && (
              <div className="space-y-3">
                {/* hierarchy reminder for auditor */}
                <div className="bg-card border border-border rounded p-3 xl:hidden">
                  <p className="text-xs text-muted-foreground mb-2">文書階層でフィルター</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["ポリシー", "スタンダード / 規程類", "プロセス定義", "RACI", "マニュアル / Playbook", "実行ログ / 判断ログ / 証跡"].map((h) => (
                      <button
                        key={h}
                        onClick={() => setActiveHierarchy(activeHierarchy === h as DocHierarchy ? undefined : h as DocHierarchy)}
                        className={`px-2 py-0.5 text-xs rounded border transition-colors ${
                          activeHierarchy === h
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card border-border hover:border-primary/50"
                        }`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-3 grid-cols-1 lg:grid-cols-2">
                  {filteredDocs.map((doc) => (
                    <AuditorDocCard
                      key={doc.id}
                      doc={doc}
                      isSelected={selectedDoc?.id === doc.id}
                      onClick={() => setSelectedDoc(doc.id === selectedDoc?.id ? null : doc)}
                    />
                  ))}
                </div>
              </div>
            )}

            {filteredDocs.length === 0 && (
              <div className="bg-card border border-border rounded py-16 text-center">
                <Search size={24} className="text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">該当する文書がありません</p>
                <button
                  onClick={() => { setSearchQuery(""); setActiveHierarchy(undefined); }}
                  className="mt-3 flex items-center gap-1 mx-auto text-xs text-primary hover:underline"
                >
                  <RefreshCw size={11} />
                  フィルターをリセット
                </button>
              </div>
            )}
          </div>

          {/* right panel */}
          <aside className="hidden lg:block w-72 xl:w-80 shrink-0 sticky top-16">
            <RightPanel
              doc={selectedDoc}
              mode={mode}
              onClose={() => setSelectedDoc(null)}
            />
          </aside>
        </div>

        {/* mobile selected doc panel */}
        {selectedDoc && (
          <div className="lg:hidden">
            <RightPanel
              doc={selectedDoc}
              mode={mode}
              onClose={() => setSelectedDoc(null)}
            />
          </div>
        )}

        {/* footer */}
        <footer className="border-t border-border pt-4 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                {[0,1,2,3].map(i => (
                  <div key={i} className="bg-primary rounded-[1px]" />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">規程・文書管理ハブ | 情報システム部</span>
            </div>
            <div className="flex gap-4">
              <button className="text-xs text-muted-foreground hover:text-primary">利用規約</button>
              <button className="text-xs text-muted-foreground hover:text-primary">プライバシー</button>
              <button className="text-xs text-muted-foreground hover:text-primary">お問い合わせ</button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
