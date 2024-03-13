import { init } from "npm:@paralleldrive/cuid2";
import { marky } from "https://deno.land/x/marky@v1.1.7/mod.ts";

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
