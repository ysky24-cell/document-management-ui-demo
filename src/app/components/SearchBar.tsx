import { useState } from "react";
import { Search } from "lucide-react";

const SEARCH_EXAMPLES = [
  "経費精算の最新版マニュアルを探して",
  "情報セキュリティ規程の改定履歴を見たい",
  "承認待ちの文書を一覧で出して",
  "入退社プロセスに関係するRACIとPlaybookを見たい",
];

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) onSearch?.(query.trim());
  };

  const handleChip = (example: string) => {
    setQuery(example);
    onSearch?.(example);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={16}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="何を確認したいですか？"
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-border rounded text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-5 py-2.5 bg-primary text-primary-foreground text-sm rounded hover:bg-primary/90 transition-colors font-medium whitespace-nowrap"
        >
          検索
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {SEARCH_EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => handleChip(ex)}
            className="px-3 py-1 text-xs bg-white border border-border rounded-full text-foreground hover:border-primary hover:text-primary transition-colors"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
