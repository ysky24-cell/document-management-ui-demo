export type DocStatus =
  | "最新版"
  | "改定中"
  | "承認待ち"
  | "差戻し"
  | "レビュー期限切れ"
  | "廃止予定"
  | "証跡あり"
  | "所有者未設定"
  | "リンク切れ";

export type AccessLevel =
  | "全社公開"
  | "部署限定"
  | "管理者限定"
  | "監査限定"
  | "非公開";

export type DocHierarchy =
  | "ポリシー"
  | "スタンダード / 規程類"
  | "プロセス定義"
  | "RACI"
  | "マニュアル / Playbook"
  | "Agent Instruction"
  | "実行ログ / 判断ログ / 証跡";

export interface Document {
  id: string;
  title: string;
  type: string;
  hierarchy: DocHierarchy;
  dept: string;
  owner: string;
  version: string;
  status: DocStatus;
  lastRevised: string;
  nextReview: string;
  access: AccessLevel;
  approver: string;
  approvalStatus: string;
  relatedDocs: string[];
  usageFreq: "高" | "中" | "低";
  // auditor fields
  approvalDate: string;
  effectiveDate: string;
  changeReason: string;
  evidence: string[];
  auditPeriod: string;
  parentDoc?: string;
  childDocs?: string[];
  process?: string;
}

export const DOCUMENTS: Document[] = [
  {
    id: "SEC-IR-PLB-001",
    title: "情報セキュリティインシデント対応Playbook",
    type: "マニュアル / Playbook",
    hierarchy: "マニュアル / Playbook",
    dept: "情報システム部",
    owner: "セキュリティ管理責任者",
    version: "v2.3",
    status: "最新版",
    lastRevised: "2026/05/20",
    nextReview: "2026/11/20",
    access: "全社公開",
    approver: "情報システム部長",
    approvalStatus: "承認済",
    relatedDocs: ["SEC-GOV-STD-001", "SEC-IR-LOG-001"],
    usageFreq: "高",
    approvalDate: "2026/05/25",
    effectiveDate: "2026/06/01",
    changeReason: "ランサムウェア初動対応手順の見直し",
    evidence: ["インシデント対応訓練ログ", "承認ログ", "教育受講記録"],
    auditPeriod: "2026年度",
    parentDoc: "SEC-IR-PROC-001",
    process: "インシデント対応",
  },
  {
    id: "FIN-EXP-MAN-001",
    title: "経費精算マニュアル",
    type: "マニュアル",
    hierarchy: "マニュアル / Playbook",
    dept: "経理部",
    owner: "経理部長",
    version: "v1.8",
    status: "改定中",
    lastRevised: "2026/04/10",
    nextReview: "2026/10/10",
    access: "全社公開",
    approver: "CFO",
    approvalStatus: "未承認",
    relatedDocs: [],
    usageFreq: "高",
    approvalDate: "—",
    effectiveDate: "—",
    changeReason: "消費税率変更に伴う手順改訂",
    evidence: [],
    auditPeriod: "2026年度",
    process: "経費精算",
  },
  {
    id: "HR-JOIN-PROC-001",
    title: "入退社プロセス定義",
    type: "プロセス定義",
    hierarchy: "プロセス定義",
    dept: "人事部",
    owner: "人事部長",
    version: "v1.4",
    status: "承認待ち",
    lastRevised: "2026/05/01",
    nextReview: "2026/11/01",
    access: "部署限定",
    approver: "人事部長 / CHRO",
    approvalStatus: "承認待ち",
    relatedDocs: [],
    usageFreq: "中",
    approvalDate: "—",
    effectiveDate: "—",
    changeReason: "入社フローのデジタル化対応",
    evidence: [],
    auditPeriod: "2026年度",
    process: "入退社",
  },
  {
    id: "SEC-GOV-STD-001",
    title: "情報セキュリティ管理規程",
    type: "スタンダード / 規程類",
    hierarchy: "スタンダード / 規程類",
    dept: "情報システム部",
    owner: "CISO",
    version: "v3.1",
    status: "最新版",
    lastRevised: "2026/01/15",
    nextReview: "2027/01/15",
    access: "全社公開",
    approver: "CISO / 取締役会",
    approvalStatus: "承認済",
    relatedDocs: ["SEC-IR-PLB-001"],
    usageFreq: "中",
    approvalDate: "2026/01/10",
    effectiveDate: "2026/02/01",
    changeReason: "外部認証要件への対応",
    evidence: ["取締役会議事録", "承認ログ"],
    auditPeriod: "2026年度",
    childDocs: ["SEC-IR-PLB-001"],
    process: "情報セキュリティ管理",
  },
  {
    id: "SEC-IR-LOG-001",
    title: "インシデント対応判断ログ",
    type: "実行ログ / 判断ログ / 証跡",
    hierarchy: "実行ログ / 判断ログ / 証跡",
    dept: "情報システム部",
    owner: "セキュリティ管理責任者",
    version: "—",
    status: "証跡あり",
    lastRevised: "2026/05/30",
    nextReview: "—",
    access: "監査限定",
    approver: "—",
    approvalStatus: "—",
    relatedDocs: ["SEC-IR-PLB-001"],
    usageFreq: "低",
    approvalDate: "—",
    effectiveDate: "—",
    changeReason: "—",
    evidence: ["インシデント対応ログ", "判断記録"],
    auditPeriod: "2026年度",
    parentDoc: "SEC-IR-PLB-001",
    process: "インシデント対応",
  },
];

export const HIERARCHY_STEPS: DocHierarchy[] = [
  "ポリシー",
  "スタンダード / 規程類",
  "プロセス定義",
  "RACI",
  "マニュアル / Playbook",
  "Agent Instruction",
  "実行ログ / 判断ログ / 証跡",
];

export const ADMIN_FILTERS = [
  "承認待ち",
  "改定中",
  "レビュー期限切れ",
  "廃止予定",
  "所有者未設定",
  "リンク切れ",
  "権限不整合",
] as const;
