import {
  // Document & File icons
  FileText,
  File,
  Files,
  FileCheck,
  FileX,
  FileSearch,
  FilePlus,
  Folder,
  FolderOpen,
  Archive,

  // Communication icons
  Mail,
  Phone,
  MessageSquare,
  MessageCircle,
  Send,
  Bell,

  // Activity & Status icons
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  Zap,
  TrendingUp,
  TrendingDown,

  // Business & Commerce icons
  DollarSign,
  ShoppingCart,
  Package,
  Truck,
  Building,
  Briefcase,
  Store,
  Factory,
  Warehouse,

  // User & People icons
  User,
  Users,
  UserPlus,
  UserCheck,
  UserX,

  // UI & Navigation icons
  Search,
  Filter,
  Settings,
  Globe,
  Map,
  MapPin,
  Navigation,
  Home,
  Menu,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Link,

  // Action icons
  Plus,
  Minus,
  Edit,
  Trash,
  Copy,
  Download,
  Upload,
  Save,
  RefreshCw,
  RotateCcw,

  // Data & Analytics icons
  BarChart,
  LineChart,
  PieChart,
  TrendingUp as ChartUp,
  TrendingDown as ChartDown,
  Database,

  // Awards & Achievement icons
  Award,
  Trophy,
  Star,
  Heart,
  ThumbsUp,
  Target,
  Zap as Lightning,

  // Security & Protection icons
  Lock,
  Unlock,
  Shield,
  ShieldCheck,
  Key,

  // Tools & Settings icons
  Wrench,
  Tool,
  Settings as Gear,
  Sliders,

  // Miscellaneous
  Calendar,
  CalendarDays,
  Hash,
  Tag,
  Tags,
  Bookmark,
  Flag,
  Sparkles,
  Gift,
  Crown,
  Rocket,
  Lightbulb,
  HelpCircle,
  Eye,
  EyeOff,
  Percent,
  CreditCard,
  Palette,
  Music,
  Camera,
  Video,
  Mic,
  Headphones,
  Wifi,
  WifiOff,
  Cloud,
  CloudUpload,
  CloudDownload,
  Sun,
  Moon,
  Circle,
  Square,
  Triangle,
  Hexagon,
  Octagon,
  LucideIcon
} from 'lucide-react';

export type IconMapping = {
  [key: string]: LucideIcon;
};

/**
 * Comprehensive emoji to Lucide icon mapping
 * Used to replace emoji characters with professional SVG icons
 */
export const emojiToIcon: IconMapping = {
  // Documents & Files
  '📄': FileText,
  '📝': FileText,
  '📋': FileText,
  '📃': File,
  '📑': Files,
  '📊': BarChart,
  '📈': ChartUp,
  '📉': ChartDown,
  '📁': Folder,
  '📂': FolderOpen,
  '🗂️': Archive,
  '📦': Package,

  // Communication
  '✉️': Mail,
  '📧': Mail,
  '📨': Send,
  '📬': Mail,
  '📞': Phone,
  '💬': MessageSquare,
  '💭': MessageCircle,
  '🔔': Bell,

  // Status & Alerts
  '✅': CheckCircle,
  '✓': CheckCircle,
  '❌': XCircle,
  '⚠️': AlertTriangle,
  '❗': AlertCircle,
  '❓': HelpCircle,
  'ℹ️': Info,
  '⚡': Zap,
  '🔥': Zap,

  // Business & Commerce
  '💰': DollarSign,
  '💵': DollarSign,
  '💸': DollarSign,
  '💳': CreditCard,
  '🛒': ShoppingCart,
  '🏪': Store,
  '🏢': Building,
  '🏭': Factory,
  '🏗️': Building,
  '💼': Briefcase,

  // Transportation & Logistics
  '🚚': Truck,
  '🚛': Truck,
  '✈️': Navigation,
  '🚢': Navigation,
  '📍': MapPin,
  '🗺️': Map,
  '🌍': Globe,
  '🌎': Globe,
  '🌏': Globe,
  '🌐': Globe,

  // People & Users
  '👤': User,
  '👥': Users,
  '👨': User,
  '👩': User,
  '🤝': Users,

  // Actions & Controls
  '➕': Plus,
  '➖': Minus,
  '✏️': Edit,
  '🖊️': Edit,
  '🗑️': Trash,
  '📥': Download,
  '📤': Upload,
  '💾': Save,
  '🔄': RefreshCw,
  '↻': RotateCcw,
  '🔍': Search,
  '🔎': Search,
  '⚙️': Settings,
  '🛠️': Tool,
  '🔧': Wrench,

  // Awards & Achievements
  '🏆': Trophy,
  '🥇': Award,
  '🥈': Award,
  '🥉': Award,
  '⭐': Star,
  '🌟': Star,
  '✨': Sparkles,
  '💎': Star,
  '👑': Crown,
  '🎁': Gift,
  '🎯': Target,
  '🚀': Rocket,

  // Time & Calendar
  '📅': Calendar,
  '📆': CalendarDays,
  '🗓️': Calendar,
  '⏰': Clock,
  '⏱️': Clock,
  '🕐': Clock,

  // Security
  '🔒': Lock,
  '🔓': Unlock,
  '🛡️': Shield,
  '🔐': Key,
  '🔑': Key,

  // UI Elements
  '▶️': ChevronRight,
  '▼': ChevronDown,
  '➡️': ArrowRight,
  '⬅️': ArrowLeft,
  '🔗': Link,
  '↗️': ExternalLink,

  // Miscellaneous
  '💡': Lightbulb,
  '❤️': Heart,
  '👍': ThumbsUp,
  '🎨': Palette,
  '🎵': Music,
  '🎶': Music,
  '📷': Camera,
  '📹': Video,
  '🎤': Mic,
  '🎧': Headphones,
  '#️⃣': Hash,
  '🏷️': Tag,
  '🔖': Bookmark,
  '🚩': Flag,
  '📌': MapPin,
  '💬': MessageSquare,
  '💭': MessageCircle,
  '👁️': Eye,
  '🌞': Sun,
  '🌙': Moon,
  '%': Percent
};

/**
 * Get icon component by emoji or fallback to default
 */
export function getIconForEmoji(emoji: string, defaultIcon: LucideIcon = FileText): LucideIcon {
  return emojiToIcon[emoji] || defaultIcon;
}

/**
 * Replace emoji in text with icon component name
 */
export function replaceEmojiWithIconName(text: string): string {
  let result = text;
  Object.entries(emojiToIcon).forEach(([emoji, icon]) => {
    // Get the icon component name from the function
    const iconName = icon.name || 'Icon';
    result = result.replace(new RegExp(emoji, 'g'), `<${iconName} />`);
  });
  return result;
}

/**
 * Check if a string contains any emoji
 */
export function containsEmoji(text: string): boolean {
  const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
  return emojiRegex.test(text);
}

/**
 * Common icon size presets
 */
export const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 48
};

/**
 * Icon wrapper component props helper
 */
export interface IconWrapperProps {
  icon: LucideIcon;
  size?: keyof typeof iconSizes | number;
  className?: string;
  color?: string;
}