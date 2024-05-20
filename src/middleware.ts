import { authMiddleware } from "@clerk/nextjs";
export { auth as middleware } from "./auth";

export default authMiddleware({});

export const config = { matcher: ["/(admin)(.*)"] };
