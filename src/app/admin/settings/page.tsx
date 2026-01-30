"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your admin panel settings
        </p>
      </div>

      <Card className="shadow-lg border-border">
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Manage your store settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8 text-muted-foreground">
            Settings configuration coming soon
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



