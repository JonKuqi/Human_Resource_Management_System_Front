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
import axios from "axios"
import { jwtDecode } from "jwt-decode"

enum MessageType {
  Chat = "CHAT",
  Join = "JOIN",
  Leave = "LEAVE"
}

interface UserInfo {
  firstName: string
  lastName: string
}
interface Message {
    sender: string
    content: string
    type: MessageType
    timestamp: Date
    userTenantId?: number  // shto këtë fushë, opsionale nëse nuk ka gjithmonë
  }
  
 interface DecodedToken {
  tenant: string;
  user_tenant_id: number;
  role: string;
}


  const avatarColors = ["bg-blue-600", "bg-green-600", "bg-red-600", "bg-yellow-600", "bg-purple-600"]

function getColorForName(name: string) {
  const index = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % avatarColors.length
  return avatarColors[index]
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
  const [fullName, setFullName] = useState("")
  const [initials, setInitials] = useState("")
 const [userNames, setUserNames] = useState<Record<string, string>>({}) 
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const stompClient = useRef<Client | null>(null)

  const token = localStorage.getItem("token")
const payload = token ? parseJwt(token) : null

const tenantSchema = payload?.tenant // kjo do të jetë "tenant_f3d0afafc21d"
const userTenantId = payload?.user_tenant_id



  
  const fetchUserName = async (tenantId: number | string) => {
    if (!token) return
    try {
      const res = await axios.get(
        `http://localhost:8081/api/v1/tenant/user-tenant/${tenantId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      
      const { firstName, lastName } = res.data
      const full = `${firstName} ${lastName}`
      setFullName(full)
      setInitials((firstName[0] + lastName[0]).toUpperCase())
      setUserNames(prev => ({
        ...prev,
        [tenantId]: full
      }))
      console.log(firstName+lastName)

    } catch (err) {
      console.error("Failed to fetch user name for tenantId:", tenantId, err)
    }
  }

  // Merr emrin e userit bazuar ne userTenantId, nëse nuk e kemi e marrim
 

  useEffect(() => {
    if (userTenantId) {
      fetchUserName(userTenantId)
    }
  }, [userTenantId])

  useEffect(() => {

    if (!fullName) return
    
    

    const socket = new SockJS("http://localhost:8081/ws")

    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Connected to WebSocket")

        client.subscribe(`/topic/tenant-${tenantSchema}`, (message) => {
  if (message.body) {
    const chatMessage = JSON.parse(message.body)
    chatMessage.timestamp = new Date()
    console.log("⏺️ Mesazh i pranuar nga backend:", chatMessage) 
    setMessages(prev => [...prev, chatMessage])
  }
})


     client.publish({
  destination: "/app/chat.addUser",
  body: JSON.stringify({
    sender: fullName,
    type: MessageType.Join,
    content: '',
    tenant: tenantSchema,       // e njëjta fushë këtu
    userTenantId: userTenantId
  })
})



      }
    })

    client.activate()
    stompClient.current = client

    return () => {
      client.deactivate()
    }
  }, [fullName])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim() === "" || !stompClient.current || !stompClient.current.connected) return

   const message = {
  sender: fullName,
  content: newMessage,
  type: MessageType.Chat,
  timestamp: new Date(),
  tenant: tenantSchema,       // ndrysho nga tenantId → tenant
  userTenantId: userTenantId
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
      <CardContent className="flex-1 p-0 overflow-hidden" style={{ height: "500px", width: "100%" }}>
      <ScrollArea className="max-h-[500px] w-full max-w-[600px]" style={{ overflowY: "auto" }}>
      <div className="flex flex-col p-4 space-y-6">
    {messages.map((message, index) => {
      
      const isCurrentUser = message.sender === fullName

      if (message.type === MessageType.Join) {
        // Merr emrin e plotë sipas userTenantId
       
        return (
          <div key={index} className="flex justify-center text-blue-600 italic text-sm">
            {message.sender} joined the chat
          </div>
        )
      }

      if (message.type === MessageType.Leave) {
       

        return (
          <div key={index} className="flex justify-center text-gray-500 italic text-sm">
            {message.sender} left the chat
          </div>
        )
      }

      return (
        <div key={index} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} gap-2`}>
          {!isCurrentUser && (
            <Avatar className="h-8 w-8">
              <AvatarFallback className={`${getColorForName(message.sender)} text-white text-xs`}>

               {message.sender
    .split(" ")
    .map(word => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}

          <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}>
            <div className="flex items-center gap-2">
              {!isCurrentUser && <span className="text-sm font-medium">{message.sender}</span>}
              <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
            </div>
            <div
  className={`max-w-[20rem] rounded-lg px-3 py-2 text-sm ${
    isCurrentUser ? "bg-blue-700 text-white" : "bg-gray-200 text-gray-900"
  }`}
  style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}
>
              {message.content}
            </div>
          </div>

          {isCurrentUser && (
            <Avatar className="h-8 w-8">
              <AvatarFallback className={`${getColorForName(message.sender)} text-white text-xs`}>

                {fullName
    .split(" ")
    .map(word => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()}
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
