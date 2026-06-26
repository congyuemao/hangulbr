import { type CodePoint, toCodePoints } from "@keybr/unicode";

const SBase = 0xac00;
const LCount = 19;
const VCount = 21;
const TCount = 28;
const NCount = VCount * TCount;
const SCount = LCount * NCount;

const codePoints = (text: string): CodePoint[] => [...toCodePoints(text)];

const initials = codePoints("ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ");

const medials = [
  "ㅏ",
  "ㅐ",
  "ㅑ",
  "ㅒ",
  "ㅓ",
  "ㅔ",
  "ㅕ",
  "ㅖ",
  "ㅗ",
  "ㅗㅏ",
  "ㅗㅐ",
  "ㅗㅣ",
  "ㅛ",
  "ㅜ",
  "ㅜㅓ",
  "ㅜㅔ",
  "ㅜㅣ",
  "ㅠ",
  "ㅡ",
  "ㅡㅣ",
  "ㅣ",
].map(codePoints);

const finals = [
  "",
  "ㄱ",
  "ㄲ",
  "ㄱㅅ",
  "ㄴ",
  "ㄴㅈ",
  "ㄴㅎ",
  "ㄷ",
  "ㄹ",
  "ㄹㄱ",
  "ㄹㅁ",
  "ㄹㅂ",
  "ㄹㅅ",
  "ㄹㅌ",
  "ㄹㅍ",
  "ㄹㅎ",
  "ㅁ",
  "ㅂ",
  "ㅂㅅ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
].map(codePoints);

const initialSet = new Set(initials);
const medialStarters = new Set(medials.map(([codePoint]) => codePoint));
const finalStarters = new Set(finals.flat());

export function isHangulSyllable(codePoint: CodePoint): boolean {
  return codePoint >= SBase && codePoint < SBase + SCount;
}

export function isHangulJamo(codePoint: CodePoint): boolean {
  return (
    initialSet.has(codePoint) ||
    medialStarters.has(codePoint) ||
    finalStarters.has(codePoint)
  );
}

export function decomposeHangulSyllable(
  codePoint: CodePoint,
): readonly CodePoint[] | null {
  if (!isHangulSyllable(codePoint)) {
    return null;
  }
  const sIndex = codePoint - SBase;
  const lIndex = Math.floor(sIndex / NCount);
  const vIndex = Math.floor((sIndex % NCount) / TCount);
  const tIndex = sIndex % TCount;
  return [initials[lIndex], ...medials[vIndex], ...finals[tIndex]];
}

export function composeHangulSyllable(
  codePoints: readonly CodePoint[],
): CodePoint | null {
  if (codePoints.length < 2) {
    return null;
  }
  const lIndex = initials.indexOf(codePoints[0]);
  if (lIndex < 0) {
    return null;
  }
  for (const [vIndex, medial] of medials.entries()) {
    if (!startsWithAt(codePoints, medial, 1)) {
      continue;
    }
    const rest = codePoints.slice(1 + medial.length);
    const tIndex = finals.findIndex((final) => same(final, rest));
    if (tIndex >= 0) {
      return (SBase + (lIndex * VCount + vIndex) * TCount + tIndex) as CodePoint;
    }
  }
  return null;
}

export function decomposeHangulText(text: string): string {
  const out: CodePoint[] = [];
  for (const codePoint of toCodePoints(text)) {
    out.push(...(decomposeHangulSyllable(codePoint) ?? [codePoint]));
  }
  return String.fromCodePoint(...out);
}

export function composeHangulText(text: string): string {
  const codePoints = [...toCodePoints(text)];
  const out: CodePoint[] = [];
  for (let i = 0; i < codePoints.length; ) {
    const match = matchHangulSyllable(codePoints, i);
    if (match != null) {
      out.push(match.codePoint);
      i = match.end;
    } else {
      out.push(codePoints[i]);
      i += 1;
    }
  }
  return String.fromCodePoint(...out);
}

export function hangulKeystream(codePoints: readonly CodePoint[]): CodePoint[] {
  const out: CodePoint[] = [];
  for (const codePoint of codePoints) {
    out.push(...(decomposeHangulSyllable(codePoint) ?? [codePoint]));
  }
  return out;
}

function matchHangulSyllable(
  codePoints: readonly CodePoint[],
  start: number,
): { readonly codePoint: CodePoint; readonly end: number } | null {
  const lIndex = initials.indexOf(codePoints[start]);
  if (lIndex < 0) {
    return null;
  }
  const medialMatch = findMedial(codePoints, start + 1);
  if (medialMatch == null) {
    return null;
  }
  let tIndex = 0;
  let end = medialMatch.end;
  const finalMatch = findFinal(codePoints, end);
  if (
    finalMatch != null &&
    !isLikelyNextSyllable(codePoints, finalMatch.start, finalMatch.end)
  ) {
    tIndex = finalMatch.index;
    end = finalMatch.end;
  }
  return {
    codePoint: (SBase +
      (lIndex * VCount + medialMatch.index) * TCount +
      tIndex) as CodePoint,
    end,
  };
}

function findMedial(
  codePoints: readonly CodePoint[],
  start: number,
): { readonly index: number; readonly end: number } | null {
  for (let i = medials.length - 1; i >= 0; i--) {
    const medial = medials[i];
    if (startsWithAt(codePoints, medial, start)) {
      return { index: i, end: start + medial.length };
    }
  }
  return null;
}

function findFinal(
  codePoints: readonly CodePoint[],
  start: number,
): { readonly index: number; readonly start: number; readonly end: number } | null {
  for (let i = finals.length - 1; i > 0; i--) {
    const final = finals[i];
    if (startsWithAt(codePoints, final, start)) {
      return { index: i, start, end: start + final.length };
    }
  }
  return null;
}

function isLikelyNextSyllable(
  codePoints: readonly CodePoint[],
  start: number,
  end: number,
): boolean {
  return end < codePoints.length && findMedial(codePoints, end) != null;
}

function startsWithAt(
  codePoints: readonly CodePoint[],
  prefix: readonly CodePoint[],
  start: number,
): boolean {
  if (start + prefix.length > codePoints.length) {
    return false;
  }
  for (let i = 0; i < prefix.length; i++) {
    if (codePoints[start + i] !== prefix[i]) {
      return false;
    }
  }
  return true;
}

function same(a: readonly CodePoint[], b: readonly CodePoint[]): boolean {
  return a.length === b.length && startsWithAt(a, b, 0);
}
