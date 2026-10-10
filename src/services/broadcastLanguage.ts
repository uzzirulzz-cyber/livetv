export type BroadcastLanguage = "Hindi" | "English";

const INDIA_REGIONAL_LANGUAGE = /\b(?:assamese|bangla|bengali|gujarati|kannada|malayalam|marathi|nepal(?:ese)?|oriya|odia|punjabi|tamil|telugu)\b|all regional/i;
const HINDI_MARKER = /\bhindi\b|\bbollywood\b/i;
const ENGLISH_MARKER = /\benglish\b|\beng\b/i;

/** Infer only Hindi or English from channel/group labels; unknown languages are excluded. */
export function languageForBroadcast(name: string, group: string): BroadcastLanguage | null {
  const channelName = name.trim();
  const groupName = group.trim();
  if (HINDI_MARKER.test(channelName)) return "Hindi";
  if (ENGLISH_MARKER.test(channelName)) return "English";
  if (HINDI_MARKER.test(groupName)) return "Hindi";
  if (ENGLISH_MARKER.test(groupName) || /^EN\s*-/i.test(groupName)) return "English";
  if (/^(?:IN|IND)\s*[-:]/i.test(groupName)) {
    return INDIA_REGIONAL_LANGUAGE.test(groupName) ? null : "Hindi";
  }
  if (/^(?:PK|PAK)\s*[-:]/i.test(groupName)) return null;
  return null;
}
