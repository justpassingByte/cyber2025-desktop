import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { User } from "lucide-react"
import { useTheme } from "../../components/ThemeProvider"

const publicRooms = [
  { id: 1, name: "General Chat", members: 45, active: true },
  { id: 2, name: "CS:GO Discussion", members: 23, active: false },
  { id: 3, name: "Tournament Talk", members: 18, active: false },
  { id: 4, name: "Tech Support", members: 12, active: false },
]

const friends = [
  { id: 1, name: "Alex Chen", status: "online", lastSeen: "now", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 2, name: "Sarah Kim", status: "away", lastSeen: "5 min ago", avatar: "/placeholder.svg?height=40&width=40" },
  {
    id: 3,
    name: "Mike Johnson",
    status: "offline",
    lastSeen: "2 hours ago",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  { id: 4, name: "Emma Wilson", status: "online", lastSeen: "now", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 5, name: "David Lee", status: "busy", lastSeen: "1 hour ago", avatar: "/placeholder.svg?height=40&width=40" },
]

const messages = [
  {
    id: 1,
    user: "Alex Chen",
    message: "Hey everyone! Anyone up for a CS:GO match?",
    time: "10:30 AM",
    avatar: "/placeholder.svg?height=32&width=32",
    isOwn: false,
  },
  {
    id: 2,
    user: "You",
    message: "I'm in! What rank are we playing at?",
    time: "10:31 AM",
    avatar: "/placeholder.svg?height=32&width=32",
    isOwn: true,
  },
  {
    id: 3,
    user: "Sarah Kim",
    message: "Count me in too! I've been practicing my aim all week 🎯",
    time: "10:32 AM",
    avatar: "/placeholder.svg?height=32&width=32",
    isOwn: false,
  },
  {
    id: 4,
    user: "Mike Johnson",
    message: "Let's do it! I'll create a lobby in 5 minutes",
    time: "10:33 AM",
    avatar: "/placeholder.svg?height=32&width=32",
    isOwn: false,
  },
  {
    id: 5,
    user: "You",
    message: "Perfect! See you all there 🚀",
    time: "10:34 AM",
    avatar: "/placeholder.svg?height=32&width=32",
    isOwn: true,
  },
]

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState("public")
  const [selectedRoom, setSelectedRoom] = useState(publicRooms[0])
  const [selectedFriend, setSelectedFriend] = useState<typeof friends[0] | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [chatMessages, setChatMessages] = useState(messages)
  const [isMuted, setIsMuted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const { theme } = useTheme()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: chatMessages.length + 1,
        user: "You",
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        avatar: "/placeholder.svg?height=32&width=32",
        isOwn: true,
      }
      setChatMessages([...chatMessages, message])
      setNewMessage("")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-400"
      case "away":
        return "bg-yellow-400"
      case "busy":
        return "bg-red-400"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-2`}>Chat & Community</h1>
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>Connect with fellow gamers</p>
      </motion.div>

      {/* Chat Interface */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className={`${theme === 'dark' 
              ? 'bg-slate-900/50 border-white/10' 
              : 'bg-white/80 border-slate-200'} 
              backdrop-blur-lg h-full`}>
              <CardHeader className="pb-3">
                <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} text-lg`}>Chats</CardTitle>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search chats..."
                    className={`pl-10 ${theme === 'dark' 
                      ? 'bg-white/10 border-white/20 text-white placeholder:text-gray-400' 
                      : 'bg-slate-100 border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className={`grid w-full grid-cols-2 ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-100'} mx-4 mb-4`}>
                    <TabsTrigger value="public" className="data-[state=active]:bg-cyan-500">
                      <User className="w-4 h-4 mr-1" />
                      Rooms
                    </TabsTrigger>
                    <TabsTrigger value="private" className="data-[state=active]:bg-cyan-500">
                      <User className="w-4 h-4 mr-1" />
                      Friends
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="public" className="mt-0">
                    <div className="space-y-1 px-4">
                      {publicRooms.map((room) => (
                        <motion.div
                          key={room.id}
                          whileHover={{ x: 4 }}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedRoom?.id === room.id
                              ? theme === 'dark' 
                                ? "bg-cyan-500/20 border border-cyan-500/30" 
                                : "bg-cyan-500/10 border border-cyan-500/20"
                              : theme === 'dark'
                                ? "hover:bg-white/10"
                                : "hover:bg-slate-100"
                          }`}
                          onClick={() => setSelectedRoom(room)}
                        >
                          <div className={`w-10 h-10 ${theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-500/10'} rounded-full flex items-center justify-center`}>
                            <User className={`w-5 h-5 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
                          </div>
                          <div className="flex-1">
                            <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium text-sm`}>{room.name}</p>
                            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-xs`}>{room.members} members</p>
                          </div>
                          {room.active && <div className="w-2 h-2 bg-green-400 rounded-full"></div>}
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="private" className="mt-0">
                    <div className="space-y-1 px-4">
                      {friends.map((friend) => (
                        <motion.div
                          key={friend.id}
                          whileHover={{ x: 4 }}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedFriend?.id === friend.id
                              ? theme === 'dark' 
                                ? "bg-cyan-500/20 border border-cyan-500/30" 
                                : "bg-cyan-500/10 border border-cyan-500/20"
                              : theme === 'dark'
                                ? "hover:bg-white/10"
                                : "hover:bg-slate-100"
                          }`}
                          onClick={() => setSelectedFriend(friend)}
                        >
                          <div className="relative">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={friend.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-cyan-500 text-white text-sm">
                                {friend.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(friend.status)} rounded-full border-2 ${theme === 'dark' ? 'border-slate-900' : 'border-white'}`}
                            ></div>
                          </div>
                          <div className="flex-1">
                            <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium text-sm`}>{friend.name}</p>
                            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-xs`}>{friend.lastSeen}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className={`${theme === 'dark' 
              ? 'bg-slate-900/50 border-white/10' 
              : 'bg-white/80 border-slate-200'} 
              backdrop-blur-lg h-full flex flex-col`}>
              {/* Chat Header */}
              <CardHeader className={`border-b ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'} pb-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-500/10'} rounded-full flex items-center justify-center`}>
                      {activeTab === "public" ? (
                        <User className={`w-5 h-5 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
                      ) : (
                        <User className={`w-5 h-5 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
                      )}
                    </div>
                    <div>
                      <h3 className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>
                        {activeTab === "public" ? selectedRoom?.name : selectedFriend?.name || "Select a friend"}
                      </h3>
                      <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-sm`}>
                        {activeTab === "public"
                          ? `${selectedRoom?.members} members`
                          : selectedFriend
                            ? selectedFriend.status
                            : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {activeTab === "private" && selectedFriend && (
                      <>
                        <Button variant="ghost" size="icon" className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>
                          <User className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>
                          <User className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? <User className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>
                      <User className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                  {chatMessages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${message.isOwn ? "flex-row-reverse" : ""}`}
                    >
                      {!message.isOwn && (
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={message.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-cyan-500 text-white text-xs">
                            {message.user
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`flex flex-col ${message.isOwn ? "items-end" : ""}`}>
                        {!message.isOwn && <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-xs mb-1`}>{message.user}</p>}
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.isOwn 
                            ? "bg-cyan-500 text-white" 
                            : theme === 'dark'
                              ? "bg-white/10 text-white"
                              : "bg-slate-100 text-slate-900"
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                        </div>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-xs mt-1`}>{message.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Message Input */}
              <div className={`border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'} p-4`}>
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>
                    <User className="w-4 h-4" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className={`${theme === 'dark' 
                        ? 'bg-white/10 border-white/20 text-white placeholder:text-gray-400' 
                        : 'bg-slate-100 border-slate-200 text-slate-900 placeholder:text-slate-400'} pr-10`}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`absolute right-1 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}
                    >
                      <User className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50"
                  >
                    <User className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>

      {/* Online Users */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className={`${theme === 'dark' 
          ? 'bg-slate-900/50 border-white/10' 
          : 'bg-white/80 border-slate-200'} 
          backdrop-blur-lg`}>
          <CardHeader>
            <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
              <User className={`w-5 h-5 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
              Online Now ({friends.filter((f) => f.status === "online").length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {friends
                .filter((friend) => friend.status === "online")
                .map((friend) => (
                  <div
                    key={friend.id}
                    className={`flex items-center gap-2 ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200'} rounded-full px-3 py-2 transition-colors cursor-pointer`}
                  >
                    <div className="relative">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={friend.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-cyan-500 text-white text-xs">
                          {friend.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-2 h-2 bg-green-400 rounded-full border ${theme === 'dark' ? 'border-slate-900' : 'border-white'}`}></div>
                    </div>
                    <span className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} text-sm`}>{friend.name}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
