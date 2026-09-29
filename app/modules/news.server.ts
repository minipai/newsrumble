import { micromark } from "micromark";

export function renderNewsContent(content: string) {
  return micromark(content.replace(/\r\n?|\n/g, "\n\n"));
}
