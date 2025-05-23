"use client"

import { useState, useEffect, useRef } from "react"
import { Send, User, Users } from 'lucide-react'
import axios from "axios"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "react-toastify"

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: string
  isCurrentUser: boolean
}

interface ChatUser {
  id: string
  name: string
  avatar?: string
  status: "online" | "offline" | "away"
  lastSeen?: string
}

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState("team")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<ChatUser[]>([])
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock data for demonstration
  useEffect(() => {
    // Simulate fetching users
    const mockUsers: ChatUser[] = [
      { id: "1", name: "Sarah Johnson", status: "online", avatar: "/placeholder.svg?height=40&width=40" },
      { id: "2", name: "Michael Chen", status: "online", avatar: "/placeholder.svg?height=40&width=40" },
      { id: "3", name: "Emily Rodriguez", status: "away", lastSeen: "10 minutes ago" },
      { id: "4", name: "David Kim", status: "offline", lastSeen: "1 hour ago" },
      { id: "5", name: "Jessica Taylor", status: "online", avatar: "/placeholder.svg?height=40&width=40" },
    ]
    setUsers(mockUsers)

    // Simulate fetching team messages
    const mockTeamMessages: Message[] = [
      {
        id: "1",
        senderId: "1",
        senderName: "Sarah Johnson",
        senderAvatar: "/placeholder.svg?height=40&width=40",
        content: "Good morning team! Don't forget we have a meeting at 10 AM today.",
        timestamp: "08:45 AM",
        isCurrentUser: false,
      },
      {
        id: "2",
        senderId: "current",
        senderName: "John Doe",
        senderAvatar: "/placeholder.svg?height=40&width=40",
        content: "Thanks for the reminder, Sarah. I'll prepare my progress report.",
        timestamp: "08:47 AM",
        isCurrentUser: true,
      },
      {
        id: "3",
        senderId: "2",
        senderName: "Michael Chen",
        senderAvatar: "/placeholder.svg?height=40&width=40",
        content: "I've finished the design mockups. I'll present them during the meeting.",
        timestamp: "08:50 AM",
        isCurrentUser: false,
      },
      {
        id: "4",
        senderId: "5",
        senderName: "Jessica Taylor",
        senderAvatar: "/placeholder.svg?height=40&width=40",
        content: "Great work, Michael! Looking forward to seeing them.",
        timestamp: "08:52 AM",
        isCurrentUser: false,
      },
    ]
    setMessages(mockTeamMessages)
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim()) return
    
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "current",
      senderName: "John Doe",
      senderAvatar: "/placeholder.svg?height=40&width=40",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCurrentUser: true,
    }
    
    setMessages([...messages, newMessage])
    setMessage("")
    
    // In a real app, you would send the message to the server here
  }

  const handleUserSelect = (user: ChatUser) => {
    setSelectedUser(user)
    setActiveTab("direct")
    
    // In a real app, you would fetch direct messages with this user
    const mockDirectMessages: Message[] = [
      {
        id: "1",
        senderId: user.id,
        senderName: user.name,
        senderAvatar: user.avatar,
        content: `Hi John, how are you doing today?`,
        timestamp: "Yesterday, 4:30 PM",
        isCurrentUser: false,
      },
      {
        id: "2",
        senderId: "current",
        senderName: "John Doe",
        senderAvatar: "/placeholder.svg?height=40&width=40",
        content: `I'm doing well, thanks for asking! How about you?`,
        timestamp: "Yesterday, 4:35 PM",
        isCurrentUser: true,
      },
      {
        id: "3",
        senderId: user.id,
        senderName: user.name,
        senderAvatar: user.avatar,
        content: `I'm good too. Do you have time to discuss the project later today?`,
        timestamp: "Yesterday, 4:40 PM",
        isCurrentUser: false,
      },
    ]
    setMessages(mockDirectMessages)
  }

  return (
    <div className="h-[calc(100vh-8rem)]">
      <h1 className="text-3xl font-bold text-employee-darker-blue mb-6">Team Chat</h1>
      
      <div className="grid grid-cols-4 gap-6 h-[calc(100%-4rem)]">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Contacts</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="px-4 py-2">
                {users.map((user) => (
                  <div key={user.id}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-2 py-6"
                      onClick={() => handleUserSelect(user)}
                    >
                      <div className="flex items-center w-full">
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span
                            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                              user.status === "online"
                                ? "bg-green-500"
                                : user.status === "away"
                                ? "bg-yellow-500"
                                : "bg-gray-400"
                            }`}
                          />
                        </div>
                        <div className="ml-3 text-left">
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.status === "online"
                              ? "Online"
                              : user.status === "away"
                              ? "Away"
                              : `Last seen ${user.lastSeen}`}
                          </p>
                        </div>
                      </div>
                    </Button>
                    <Separator className="my-1" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader className="pb-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="team" className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    Team Chat
                  </TabsTrigger>
                  <TabsTrigger value="direct" className="flex items-center" disabled={!selectedUser}>
                    <User className="mr-2 h-4 w-4" />
                    {selectedUser ? selectedUser.name : "Direct Message"}
                  </TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col h-[calc(100vh-20rem)]">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.isCurrentUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex max-w-[80%] ${
                          msg.isCurrentUser ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        <Avatar className={msg.isCurrentUser ? "ml-2" : "mr-2"}>
                          <AvatarImage src={msg.senderAvatar || "/placeholder.svg"} alt={msg.senderName} />
                          <AvatarFallback>{msg.senderName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div
                            className={`rounded-lg px-4 py-2 ${
                              msg.isCurrentUser
                                ? "bg-employee-dark-blue text-white"
                                : "bg-muted"
                            }`}
                          >
                            {!msg.isCurrentUser && (
                              <p className="text-xs font-medium mb-1">{msg.senderName}</p>
                            )}
                            <p>{msg.content}</p>
                          </div>
                          <p
                            className={`text-xs text-muted-foreground mt-1 ${
                              msg.isCurrentUser ? "text-right" : "text-left"
                            }`}
                          >
                            {msg.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}