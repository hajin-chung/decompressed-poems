import { init } from "npm:@paralleldrive/cuid2";

export const createId = init({
  length: 10,
});

export function current() {
  const date = new Date();
  return date.toISOString();
}
