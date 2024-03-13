import { init } from "cuid2";
import { marky } from "marky";

export const createId = init({
  length: 10,
});

export function current() {
  const date = new Date();
  return date.toISOString();
}

export function render(markdown: string) {
  return marky(markdown);
}
