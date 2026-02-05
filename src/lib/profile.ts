import type { UserInfo } from "@/lib/auth-api"

export type ProfileMissingField = "first_name" | "last_name" | "address"

export function getMissingOrderProfileFields(user: UserInfo | null | undefined): ProfileMissingField[] {
  const missing: ProfileMissingField[] = []
  const first = (user?.first_name ?? "").trim()
  const last = (user?.last_name ?? "").trim()
  const address = (user?.address ?? "").trim()

  if (!first) missing.push("first_name")
  if (!last) missing.push("last_name")
  if (!address) missing.push("address")

  return missing
}

export function isOrderProfileComplete(user: UserInfo | null | undefined): boolean {
  return getMissingOrderProfileFields(user).length === 0
}


