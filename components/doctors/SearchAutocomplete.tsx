"use client";

/**
 * SearchAutocomplete
 *
 * Replaces the plain <Input> in DoctorFilters for the name-search field.
 *
 * Behaviour:
 *  - Debounce: 300 ms
 *  - Min 3 chars before hitting the autocomplete API
 *  - Shows up to 5 suggestions in a floating dropdown
 *  - Highlights the matched substring (graceful fallback if Arabic normalization
 *    makes an exact position mapping impossible)
 *  - Keyboard: ↑ ↓ to navigate, Enter to select, Escape to close
 *  - Click outside closes the dropdown
 *  - Clicking a suggestion navigates to /doctors/{id}
 *  - Pressing the Search button or Enter (without selecting) applies the full
 *    search filter via the parent's onApply callback (unchanged behaviour)
 */

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import { Search, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { normalizeArabic } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Suggestion {
  id: number;
  name: string;
  specialty: string;
  image_url: string | null;
  verified: boolean;
  governorate: { name_ar: string };
  city: { name_ar: string } | null;
}

interface Props {
  value: string;
  onChange: (val: string) => void;
  onApply: () => void;
  isPending?: boolean;
}

// ─── Highlight helper ─────────────────────────────────────────────────────────

/**
 * Returns an array of text segments. Each segment has `text` and `highlight`.
 * If the match position cannot be determined precisely (e.g. آية vs ايه),
 * falls back to a single non-highlighted segment with the original text.
 */
function buildSegments(
  originalName: string,
  query: string
): { text: string; highlight: boolean }[] {
  if (!query.trim()) return [{ text: originalName, highlight: false }];

  const normalizedName = normalizeArabic(originalName);
  const normalizedQuery = normalizeArabic(query);

  const idx = normalizedName.indexOf(normalizedQuery);
  if (idx === -1) {
    // Normalization changed the sequence — graceful fallback, no highlight
    return [{ text: originalName, highlight: false }];
  }

  // Map the normalized index back to the original string.
  // We walk through both strings simultaneously.
  // originalName[i] might map to a different char count in normalizedName,
  // so we need a character-level mapping.
  const normToOrig: number[] = []; // normToOrig[j] = i means normalizedName[j] came from originalName[i]
  let j = 0;
  for (let i = 0; i < originalName.length; i++) {
    const norm = normalizeArabic(originalName[i]);
    for (let k = 0; k < norm.length; k++) {
      normToOrig[j++] = i;
    }
  }

  const origStart = normToOrig[idx];
  const origEnd =
    normToOrig[idx + normalizedQuery.length - 1] !== undefined
      ? normToOrig[idx + normalizedQuery.length - 1] + 1
      : origStart + normalizedQuery.length;

  if (origStart === undefined || origEnd === undefined || origStart >= origEnd) {
    return [{ text: originalName, highlight: false }];
  }

  const before = originalName.slice(0, origStart);
  const match = originalName.slice(origStart, origEnd);
  const after = originalName.slice(origEnd);

  return [
    ...(before ? [{ text: before, highlight: false }] : []),
    { text: match, highlight: true },
    ...(after ? [{ text: after, highlight: false }] : []),
  ];
}

// ─── Avatar initials ──────────────────────────────────────────────────────────

function getInitials(name: string): string {
  const parts = name.replace(/^(د\.|دكتورة|أ\.د\.)\s*/i, "").split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0] ?? "")
    .join("")
    .slice(0, 2);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SearchAutocomplete({
  value,
  onChange,
  onApply,
  isPending,
}: Props) {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // ── Fetch suggestions ──────────────────────────────────────────────────────

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 3) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    // Cancel previous request
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/search/autocomplete?q=${encodeURIComponent(q)}`,
        { signal: abortRef.current.signal }
      );
      if (!res.ok) throw new Error("Autocomplete failed");
      const data = await res.json();
      setSuggestions(data.suggestions ?? []);
      setIsOpen((data.suggestions ?? []).length > 0);
      setActiveIdx(-1);
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        setSuggestions([]);
        setIsOpen(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Debounce on value change ───────────────────────────────────────────────

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, fetchSuggestions]);

  // ── Click outside ──────────────────────────────────────────────────────────

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Keyboard navigation ────────────────────────────────────────────────────

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "Enter") onApply();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx >= 0 && suggestions[activeIdx]) {
        selectSuggestion(suggestions[activeIdx]);
      } else {
        setIsOpen(false);
        onApply();
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setActiveIdx(-1);
    }
  };

  // ── Select suggestion ──────────────────────────────────────────────────────

  const selectSuggestion = (s: Suggestion) => {
    setIsOpen(false);
    setSuggestions([]);
    router.push(`/doctors/${s.id}`);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div ref={containerRef} className="relative flex gap-2 sm:gap-3">
      {/* Input */}
      <div className="relative flex-grow">
        <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        {isLoading && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
        )}
        <Input
          ref={inputRef}
          id="search-input"
          placeholder="ابحثي باسم الطبيبة"
          value={value}
          autoComplete="off"
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          className="pr-10 h-12 rounded-xl text-sm border-purple-100 focus-visible:ring-purple-400 bg-gray-50/10"
          dir="rtl"
        />
      </div>

      {/* Search button */}
      <Button
        variant="pink"
        onClick={() => { setIsOpen(false); onApply(); }}
        disabled={isPending}
        className="h-12 px-5 sm:px-8 font-bold rounded-xl shadow-sm hover:shadow transition-all shrink-0"
        id="apply-filters-btn"
      >
        <Search className="w-4 h-4" />
        {isPending ? (
          <span>جاري...</span>
        ) : (
          <>
            <span className="hidden sm:inline">بحث بالاسم</span>
            <span className="inline sm:hidden">بحث</span>
          </>
        )}
      </Button>

      {/* Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div
          className="absolute top-[calc(100%+6px)] right-0 left-0 z-50 bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden"
          dir="rtl"
          role="listbox"
          aria-label="اقتراحات البحث"
        >
          {suggestions.map((s, idx) => {
            const segments = buildSegments(s.name, value);
            const isActive = idx === activeIdx;
            const location = [s.governorate.name_ar, s.city?.name_ar]
              .filter(Boolean)
              .join(" - ");

            return (
              <button
                key={s.id}
                role="option"
                aria-selected={isActive}
                className={`w-full flex items-center gap-3 px-4 py-3 text-right transition-colors ${
                  isActive
                    ? "bg-purple-50"
                    : "hover:bg-gray-50"
                } ${idx !== suggestions.length - 1 ? "border-b border-gray-100" : ""}`}
                onMouseDown={(e) => {
                  e.preventDefault(); // prevent blur before click registers
                  selectSuggestion(s);
                }}
                onMouseEnter={() => setActiveIdx(idx)}
              >
                {/* Avatar */}
                <div className="shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden">
                  {s.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={s.image_url}
                      alt={s.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-purple-600 text-xs font-bold">
                      {getInitials(s.name)}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  {/* Name with highlight */}
                  <p className="text-sm font-semibold text-gray-900 leading-snug">
                    {segments.map((seg, i) =>
                      seg.highlight ? (
                        <mark
                          key={i}
                          className="bg-pink-100 text-pink-800 rounded-sm not-italic font-bold"
                        >
                          {seg.text}
                        </mark>
                      ) : (
                        <span key={i}>{seg.text}</span>
                      )
                    )}
                  </p>

                  {/* Subtitle */}
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {s.specialty}
                    {location && (
                      <>
                        <span className="mx-1 text-gray-300">•</span>
                        {location}
                      </>
                    )}
                  </p>
                </div>

                {/* Verified badge */}
                {s.verified && (
                  <CheckCircle
                    className="shrink-0 w-4 h-4 text-emerald-500"
                    aria-label="موثقة"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
