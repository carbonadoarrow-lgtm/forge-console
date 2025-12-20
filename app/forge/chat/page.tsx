"use client";

import { useState, useEffect, useRef } from "react";
import {
  useConsoleChatSessions,
  useCreateConsoleChatSession,
  useConsoleChatMessages,
  useSendConsoleChatMessage,
  useMarkConsoleChatRead,
} from "@/lib/hooks/use-console-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Plus, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { formatTimeAgo } from "@/lib/utils/time";

export default function ChatPage() {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: sessions, isLoading: sessionsLoading } = useConsoleChatSessions();
  const { data: messages, isLoading: messagesLoading } = useConsoleChatMessages(selectedSessionId);
  const createSession = useCreateConsoleChatSession();
  const sendMessage = useSendConsoleChatMessage();
  const markRead = useMarkConsoleChatRead();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Mark session as read when selected
  useEffect(() => {
    if (selectedSessionId) {
      markRead.mutate(selectedSessionId);
    }
  }, [selectedSessionId]);

  const handleCreateSession = async () => {
    const newSession = await createSession.mutateAsync({
      title: "New operator chat",
      sphere: "forge",
    });
    setSelectedSessionId(newSession.id);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedSessionId) return;

    const content = messageInput;
    setMessageInput("");

    await sendMessage.mutateAsync({
      sessionId: selectedSessionId,
      content,
    });
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Sort sessions by updated_at descending
  const sortedSessions = sessions
    ? [...sessions].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    : [];

  return (
    <div className="container mx-auto p-6 h-screen flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MessageCircle className="h-8 w-8" />
          Midas Cercle Chat
        </h1>
        <p className="text-muted-foreground mt-2">
          Operator chat with Forge OS for troubleshooting and advisory conversations
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 overflow-hidden">
        {/* Sessions Sidebar */}
        <Card className="col-span-3 flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Sessions</CardTitle>
              <Button
                size="sm"
                onClick={handleCreateSession}
                disabled={createSession.isPending}
              >
                {createSession.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full px-4">
              {sessionsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : sortedSessions && sortedSessions.length > 0 ? (
                <div className="space-y-2 pb-4">
                  {sortedSessions.map((session) => (
                    <div
                      key={session.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedSessionId === session.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedSessionId(session.id)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium truncate flex-1">{session.title}</div>
                        {session.unread_count > 0 && (
                          <Badge variant="destructive" className="ml-2 text-xs">
                            {session.unread_count}
                          </Badge>
                        )}
                      </div>
                      {session.last_message_preview && (
                        <div className="text-xs opacity-70 truncate mb-1">
                          {session.last_message_preview}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <div className="text-xs opacity-60">
                          {formatTimeAgo(session.updated_at)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">No sessions yet</p>
                  <p className="text-sm mt-1">Start a new operator chat</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="col-span-9 flex flex-col">
          {selectedSessionId ? (
            <>
              <CardHeader>
                <CardTitle>
                  {sessions?.find((s) => s.id === selectedSessionId)?.title}
                </CardTitle>
                <CardDescription>
                  Console chat with Forge OS • Stubbed responses for testing
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
                {/* Messages */}
                <ScrollArea className="flex-1 px-6" ref={scrollRef}>
                  {messagesLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : messages && messages.length > 0 ? (
                    <div className="space-y-4 pb-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.role === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[75%] rounded-lg p-3 ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            {message.role === "assistant" ? (
                              <div className="prose prose-sm dark:prose-invert max-w-none">
                                <ReactMarkdown>{message.content}</ReactMarkdown>
                              </div>
                            ) : (
                              <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                            )}
                            <div className="text-xs opacity-60 mt-2">
                              {formatTimestamp(message.created_at)}
                            </div>
                          </div>
                        </div>
                      ))}
                      {sendMessage.isPending && (
                        <div className="flex justify-start">
                          <div className="max-w-[75%] rounded-lg p-3 bg-muted">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Forge is thinking…
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="font-medium">No messages yet</p>
                        <p className="text-sm mt-2">Send the first message to Forge.</p>
                      </div>
                    </div>
                  )}
                </ScrollArea>

                <Separator />

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask Forge OS for insights or troubleshooting..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      disabled={sendMessage.isPending}
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      disabled={sendMessage.isPending || !messageInput.trim()}
                    >
                      {sendMessage.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Select a session or create a new one</p>
                <p className="text-sm mt-2">
                  Chat with Forge OS for operator-level troubleshooting and advisory insights
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
