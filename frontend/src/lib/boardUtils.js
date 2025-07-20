// src/lib/boardUtils.js
export function extractBoardId(input) {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("Empty input");

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const url = new URL(trimmed);
      const segments = url.pathname.split("/").filter(Boolean);
      const boardIndex = segments.indexOf("board");
      if (boardIndex === -1 || segments.length <= boardIndex + 1) {
        throw new Error("Board ID not found in URL path");
      }
      return segments[boardIndex + 1];
    } catch {
      throw new Error("Invalid URL");
    }
  }

  // Otherwise treat as raw ID
  return trimmed;
}
