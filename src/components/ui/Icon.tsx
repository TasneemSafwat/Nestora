import {
  Accessibility,
  Baby,
  Bath,
  Building2,
  CalendarCheck,
  Car,
  Circle,
  Clapperboard,
  ClipboardList,
  Compass,
  Cpu,
  DoorClosed,
  DoorOpen,
  Dumbbell,
  Flame,
  Home,
  KeyRound,
  Mail,
  Moon,
  MoveVertical,
  Package,
  PawPrint,
  Sailboat,
  ShieldCheck,
  Sun,
  SunMedium,
  Thermometer,
  Trees,
  TrendingUp,
  UserRound,
  Waves,
  Wind,
  Zap,
  type LucideIcon,
} from 'lucide-react';

/**
 * Data files reference icons by name (e.g. `icon: 'Waves'`) so content stays
 * free of JSX. This registry resolves those names in the presentation layer.
 */
const registry: Record<string, LucideIcon> = {
  Accessibility,
  Baby,
  Bath,
  Building2,
  CalendarCheck,
  Car,
  Clapperboard,
  ClipboardList,
  Compass,
  Cpu,
  DoorClosed,
  DoorOpen,
  Dumbbell,
  Flame,
  Home,
  KeyRound,
  Mail,
  Moon,
  MoveVertical,
  Package,
  PawPrint,
  Sailboat,
  ShieldCheck,
  Sun,
  SunMedium,
  Thermometer,
  Trees,
  TrendingUp,
  UserRound,
  Waves,
  Wind,
  Zap,
};

export interface IconProps {
  name: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 18, className, strokeWidth = 1.6 }: IconProps) {
  const Component = registry[name] ?? Circle;
  return <Component size={size} className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}

export function hasIcon(name: string): boolean {
  return name in registry;
}
