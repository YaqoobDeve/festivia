"use client"
import { SessionProvider } from "next-auth/react"
export default function AuthProvider({
  childern,
}) {
  return (
    <SessionProvider >
      <childern/>
    </SessionProvider>
  )
}