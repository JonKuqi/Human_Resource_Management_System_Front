"use client";
import { Chat } from "@/src/components/tenant/HR/Chat"
export const dynamic = 'force-dynamic';
// Using named export instead of default export
export function ChatPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-hr-darker-blue">Team Chat</h1>
      </div>
      <Chat />
    </div>
  )
}

export default ChatPage
