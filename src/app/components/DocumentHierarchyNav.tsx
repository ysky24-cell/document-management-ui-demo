import { type DocHierarchy, HIERARCHY_STEPS } from "../data/documents";

interface DocumentHierarchyNavProps {
  activeLevel?: DocHierarchy;
  onSelect?: (level: DocHierarchy) => void;
  highlightPath?: DocHierarchy[];
}

const LEVEL_ICONS: Record<DocHierarchy, string> = {
  "ポリシー": "P",
  "スタンダード / 規程類": "S",
  "プロセス定義": "Pr",
  "RACI": "R",
  "マニュアル / Playbook": "M",
  "Agent Instruction": "AI",
  "実行ログ / 判断ログ / 証跡": "Log",
};

export function DocumentHierarchyNav({
  activeLevel,
  onSelect,
  highlightPath,
}: DocumentHierarchyNavProps) {
  return (
    <div className="bg-card border border-border rounded p-4">
      <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">文書階層</p>
      <div className="flex flex-col gap-0">
        {HIERARCHY_STEPS.map((step, i) => {
          const isActive = step === activeLevel;
          const isHighlighted = highlightPath?.includes(step);
          const isLast = i === HIERARCHY_STEPS.length - 1;
          return (
            <div key={step} className="flex gap-3 items-start">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => onSelect?.(step)}
                  className={`w-8 h-8 rounded flex items-center justify-center text-[10px] font-bold border transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : isHighlighted
                      ? "bg-secondary text-secondary-foreground border-primary"
                      : "bg-muted text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground"
                  }`}
                  title={step}
                >
                  {LEVEL_ICONS[step]}
                </button>
                {!isLast && (
                  <div
                    className={`w-px h-5 mt-0.5 ${
                      isHighlighted ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
              <div className="pt-1 pb-3">
                <button
                  onClick={() => onSelect?.(step)}
                  className={`text-xs text-left transition-colors hover:text-primary ${
                    isActive
                      ? "text-primary font-semibold"
                      : isHighlighted
                      ? "text-secondary-foreground font-medium"
                      : "text-foreground"
                  }`}
                >
                  {step}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface AuditHierarchyViewProps {
  currentDocId: string;
}

export function AuditHierarchyView({ currentDocId: _ }: AuditHierarchyViewProps) {
  const steps = [
    { label: "情報セキュリティポリシー", id: "SEC-POL-001", level: "ポリシー" },
    { label: "情報セキュリティ管理規程", id: "SEC-GOV-STD-001", level: "規程" },
    { label: "インシデント対応プロセス定義", id: "SEC-IR-PROC-001", level: "プロセス" },
    { label: "インシデント対応RACI", id: "SEC-IR-RACI-001", level: "RACI" },
    { label: "インシデント対応Playbook", id: "SEC-IR-PLB-001", level: "Playbook", current: true },
    { label: "Agent Instruction", id: "SEC-IR-AGT-001", level: "AI" },
    { label: "実行ログ / 判断ログ / 証跡", id: "SEC-IR-LOG-001", level: "証跡" },
  ];

  return (
    <div className="bg-card border border-border rounded p-4">
      <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">文書階層（監査視点）</p>
      <div className="flex flex-col gap-0">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          return (
            <div key={step.id} className="flex gap-3 items-start">
              <div className="flex flex-col items-center shrink-0">
                <div
                  className={`w-6 h-6 rounded-sm flex items-center justify-center text-[9px] font-bold border ${
                    step.current
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {step.level.slice(0, 2)}
                </div>
                {!isLast && <div className="w-px h-4 bg-border mt-0.5" />}
              </div>
              <div className="pb-3 min-w-0">
                <p
                  className={`text-xs leading-snug ${
                    step.current ? "text-primary font-semibold" : "text-foreground"
                  }`}
                >
                  {step.current && (
                    <span className="mr-1 text-primary">▶</span>
                  )}
                  {step.label}
                </p>
                <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{step.id}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
