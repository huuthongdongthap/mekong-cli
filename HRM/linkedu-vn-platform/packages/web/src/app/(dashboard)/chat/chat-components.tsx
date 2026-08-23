import { Bot, User, Loader2 } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export function ChatEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-12">
      <Bot className="h-12 w-12 mb-3 text-muted-foreground/50" />
      <p className="text-lg font-medium">Xin chao!</p>
      <p className="text-sm mt-1">
        Toi la tro ly AI cua LinkEduVN. Hoi toi bat ky cau hoi nao ve:
      </p>
      <ul className="text-sm text-muted-foreground mt-3 space-y-1">
        <li>Huong nghiep va tu van cong viec</li>
        <li>Chuong trinh dao tao theo QD788/2020</li>
        <li>Ket noi truong nghiep va doanh nghiep</li>
        <li>Cac quy dinh va hanh chinh</li>
      </ul>
    </div>
  )
}

export function ChatLoadingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-[var(--status-purple)] text-[var(--status-purple-fg)]">
        <Bot className="h-4 w-4" />
      </div>
      <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Đang trả lời...</span>
        </div>
      </div>
    </div>
  )
}

export function ChatMessage({ msg }: { msg: Message }) {
  return (
    <div
      className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          msg.role === "user"
            ? "bg-[var(--status-blue)] text-[var(--status-blue-fg)]"
            : "bg-[var(--status-purple)] text-[var(--status-purple-fg)]"
        }`}
      >
        {msg.role === "user" ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>
      <div
        className={`flex-1 max-w-[80%] rounded-2xl px-4 py-3 ${
          msg.role === "user"
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-muted text-foreground rounded-tl-sm"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
        <p
          className={`text-xs mt-1 ${
            msg.role === "user" ? "text-blue-100" : "text-muted-foreground"
          }`}
        >
          {new Date(msg.timestamp).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  )
}
