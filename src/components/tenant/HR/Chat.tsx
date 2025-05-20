"use client"

import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'

enum MessageType {
  Chat = "CHAT",
  Join = "JOIN",
  Leave = "LEAVE"
}

interface Message {
  sender: string
  content: string
  type: MessageType
  timestamp: Date
}

function parseJwt(token: string) {
  try {
    const base64Payload = token.split('.')[1]
    const payload = Buffer.from(base64Payload, 'base64')
    return JSON.parse(payload.toString())
  } catch (e) {
    return null
  }
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const stompClient = useRef<Client | null>(null)

  const token = localStorage.getItem("jwt")
  const payload = token ? parseJwt(token) : null
  const email = payload?.sub ?? "Unknown User"
  const initials = email.slice(0, 2).toUpperCase()

  useEffect(() => {
    if (!email) return

    const socket = new SockJS("http://localhost:8081/ws")

    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Connected to WebSocket")

        client.subscribe("/topic/public", (message) => {
          if (message.body) {
            const chatMessage = JSON.parse(message.body)
            chatMessage.timestamp = new Date()
            setMessages(prev => [...prev, chatMessage])
          }
        })

        client.publish({
          destination: "/app/chat.addUser",
          body: JSON.stringify({ sender: email, type: MessageType.Join, content: '' })
        })
      }
    })

    client.activate()
    stompClient.current = client

    return () => {
      client.deactivate()
    }
  }, [email])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim() === "" || !stompClient.current || !stompClient.current.connected) return

    const message = {
      sender: email,
      content: newMessage,
      type: MessageType.Chat,
      timestamp: new Date()
    }

    stompClient.current.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(message)
    })

    setNewMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Unknown"
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)

    try {
      if (date.toDateString() === today.toDateString()) {
        return "Today"
      } else if (date.toDateString() === yesterday.toDateString()) {
        return "Yesterday"
      } else {
        return date.toLocaleDateString()
      }
    } catch {
      return "Invalid date"
    }
  }

  return (
    <Card className="flex flex-col h-[calc(100vh-2rem)] border-hr-light-gray">
      <CardHeader className="px-4 py-3 border-b">
        <CardTitle className="text-xl text-hr-darker-blue">HR Team Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex flex-col p-4 space-y-6">
            {messages.map((message, index) => {
              const isCurrentUser = message.sender === email

              return (
                <div key={index} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} gap-2`}>
                  {!isCurrentUser && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt={message.sender} />
                      <AvatarFallback className="bg-hr-dark-blue text-hr-lightest-gray text-xs">
                        {message.sender.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}>
                    <div className="flex items-center gap-2">
                      {!isCurrentUser && <span className="text-sm font-medium">{message.sender}</span>}
                      <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                    </div>

                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                        isCurrentUser ? "bg-blue-700 text-white" : "bg-gray-200 text-gray-900"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>

                  {isCurrentUser && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt={message.sender} />
                      <AvatarFallback className="bg-hr-dark-blue text-hr-lightest-gray text-xs">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-3 border-t">
        <div className="flex w-full items-center gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="icon"
            className="bg-hr-dark-blue hover:bg-hr-darker-blue"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
