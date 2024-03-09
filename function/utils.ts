import { init } from "npm:@paralleldrive/cuid2";

export const createId = init({
  length: 10,
});
