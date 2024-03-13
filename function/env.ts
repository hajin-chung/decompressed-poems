export const S3_ACCESS_KEY = Deno.env.get("S3_ACCESS_KEY");
export const S3_SECRET_KEY = Deno.env.get("S3_SECRET_KEY");
export const PASSWORD = Deno.env.get("PASSWORD");
console.log({ S3_ACCESS_KEY, S3_SECRET_KEY, PASSWORD });
