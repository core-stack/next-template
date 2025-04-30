import { NextRequest } from "next/server";

import { auth } from "../auth";

import { AccessToken } from "./jwt";

export const authorize = async (req: NextRequest) => {
  const accessToken = req.cookies.get("access-token")?.value;
  if (!accessToken) throw new Error("Missing access token");
  return auth.jwt.verifyToken<AccessToken>(accessToken);
}