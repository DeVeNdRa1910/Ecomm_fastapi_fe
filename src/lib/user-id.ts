import type { UserInfo } from "@/lib/auth-api"
import { tokenManager } from "@/lib/cookies"

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".")
    if (parts.length < 2) return null
    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=")
    const json = atob(padded)
    return JSON.parse(json) as Record<string, unknown>
  } catch {
    return null
  }
}

export function getUserId(user?: UserInfo | null): string | null {
  const fromUser =
    (typeof user?._id === "string" && user._id) ||
    (typeof user?.id === "string" && user.id) ||
    (typeof user?.["user_id"] === "string" && String(user["user_id"])) ||
    (typeof user?.["sub"] === "string" && String(user["sub"])) ||
    null

  if (fromUser) return fromUser

  const token = tokenManager.getToken()
  if (!token) return null

  const payload = decodeJwtPayload(token)
  if (!payload) return null

  const fromToken =
    (typeof payload.user_id === "string" && payload.user_id) ||
    (typeof payload.sub === "string" && payload.sub) ||
    (typeof payload.id === "string" && payload.id) ||
    (typeof payload._id === "string" && payload._id) ||
    null

  return fromToken
}


