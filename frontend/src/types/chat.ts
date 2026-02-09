export type MessageRole = 'user' | 'ai' | 'system';

export interface AIMessage {
  id: string;
  conversationId: string;
  role: MessageRole;
  text: string;
  timestamp: string;
  links?: Array<{ label: string; href: string }>;
}

export interface AIConversation {
  id: string;
  title: string;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
  originPage?: string;
}

export interface SuggestionChip {
  label: string;
  query: string;
}

export interface AIResponseMatch {
  keywords: string[];
  response: string;
  links?: Array<{ label: string; href: string }>;
  category: string;
}
