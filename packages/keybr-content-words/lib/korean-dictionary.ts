import entries from "./data/dictionary-ko.json" with { type: "json" };

export type KoreanDictionaryEntry = {
  readonly word: string;
  readonly jamo: string;
  readonly pos: string;
  readonly level: string | null;
  readonly romanization: string | null;
  readonly zh: readonly string[];
  readonly zhTw: readonly string[];
  readonly en: readonly string[];
  readonly ko: readonly string[];
  readonly examples: readonly KoreanDictionaryExample[];
  readonly sources: readonly string[];
};

export type KoreanDictionaryExample = {
  readonly ko: string;
  readonly en: string | null;
};

export const koreanDictionary: readonly KoreanDictionaryEntry[] =
  entries as readonly KoreanDictionaryEntry[];

const byWord = new Map<string, KoreanDictionaryEntry>();

for (const entry of koreanDictionary) {
  if (!byWord.has(entry.word)) {
    byWord.set(entry.word, entry);
  }
}

export function findKoreanDictionaryEntry(
  word: string,
): KoreanDictionaryEntry | null {
  return byWord.get(word) ?? null;
}

export function formatKoreanDictionaryTooltip(
  entry: KoreanDictionaryEntry,
): string {
  const lines = [entry.word];
  const details = [entry.pos, entry.level, entry.romanization]
    .filter((value) => value != null && value !== "")
    .join(" / ");
  if (details !== "") {
    lines.push(details);
  }
  if (entry.zh.length > 0) {
    lines.push(`简中: ${entry.zh.join("; ")}`);
  }
  if (entry.zhTw.length > 0) {
    lines.push(`繁中: ${entry.zhTw.join("; ")}`);
  }
  if (entry.en.length > 0) {
    lines.push(`EN: ${entry.en.join("; ")}`);
  }
  if (entry.ko.length > 0) {
    lines.push(`KO: ${entry.ko.slice(0, 2).join("; ")}`);
  }
  const [example] = entry.examples;
  if (example != null) {
    lines.push(`例: ${example.ko}`);
    if (example.en != null && example.en !== "") {
      lines.push(`Ex: ${example.en}`);
    }
  }
  return lines.join("\n");
}
