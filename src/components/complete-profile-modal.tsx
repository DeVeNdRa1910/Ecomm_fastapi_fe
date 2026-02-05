"use client"

import { Dialog, DialogPanel, DialogTitle, Description } from "@headlessui/react"
import { Button } from "@/components/ui/button"
import type { ProfileMissingField } from "@/lib/profile"

const FIELD_LABEL: Record<ProfileMissingField, string> = {
  first_name: "First name",
  last_name: "Last name",
  address: "Address",
}

export function CompleteProfileModal({
  open,
  onClose,
  missingFields,
  onGoToMyAccount,
}: {
  open: boolean
  onClose: () => void
  missingFields: ProfileMissingField[]
  onGoToMyAccount: () => void
}) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-md" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-full max-w-lg space-y-4 border bg-background/95 backdrop-blur-xl p-6 rounded-lg shadow-2xl">
          <DialogTitle className="font-bold text-xl">Complete your profile to place an order</DialogTitle>
          <Description className="text-sm text-muted-foreground">
            We need a few details before you can continue.
          </Description>

          {missingFields.length > 0 && (
            <div className="rounded-md border bg-secondary/40 p-4">
              <p className="text-sm font-medium mb-2">Missing:</p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {missingFields.map((f) => (
                  <li key={f}>{FIELD_LABEL[f]}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onClose()
                onGoToMyAccount()
              }}
            >
              Go to My Account
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}


