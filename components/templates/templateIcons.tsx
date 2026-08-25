import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function BaseIcon({
  children,
  viewBox = "0 0 24 24",
  ...props
}: IconProps & { viewBox?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function Sparkles(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3z" />
      <path d="M19 2v4" />
      <path d="M21 4h-4" />
      <path d="M4 16v3" />
      <path d="M5.5 17.5h-3" />
    </BaseIcon>
  );
}

export function GraduationCap(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M2 8l10-5 10 5-10 5-10-5z" />
      <path d="M6 10.5v4.5c0 1.8 2.7 3.5 6 3.5s6-1.7 6-3.5v-4.5" />
      <path d="M22 9v6" />
    </BaseIcon>
  );
}

export function BriefcaseBusiness(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 12h18" />
    </BaseIcon>
  );
}

export function Banknote(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 9h.01" />
      <path d="M18 15h.01" />
    </BaseIcon>
  );
}

export function BookOpenCheck(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M20 22V5a2 2 0 0 0-2-2H6.5A2.5 2.5 0 0 0 4 5.5v14" />
      <path d="m9 10 2 2 4-4" />
    </BaseIcon>
  );
}

export function Hammer(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m14 12-8.5 8.5a1.5 1.5 0 0 1-2-2L12 10" />
      <path d="M15 3h5v5" />
      <path d="m10 8 5-5" />
      <path d="m12 6 6 6" />
    </BaseIcon>
  );
}

export function Award(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="8" r="5" />
      <path d="m8.5 13.5-1 7 4.5-2.5 4.5 2.5-1-7" />
    </BaseIcon>
  );
}

export function BookOpen(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M2 6.5C2 5.1 3.1 4 4.5 4H20v15H4.5A2.5 2.5 0 0 0 2 21.5v-15Z" />
      <path d="M12 6v13" />
    </BaseIcon>
  );
}

export function CalendarDays(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4" />
      <path d="M8 3v4" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
    </BaseIcon>
  );
}

export function Clock(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6l4 2" />
    </BaseIcon>
  );
}

export function Monitor(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8" />
      <path d="M12 16v4" />
    </BaseIcon>
  );
}

export function Globe(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18" />
      <path d="M12 3a15 15 0 0 0 0 18" />
    </BaseIcon>
  );
}

export function Languages(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M5 8h8" />
      <path d="M9 4v4c0 4-2 7-5 9" />
      <path d="M7 12c1.5 2 3.5 3.5 6 4" />
      <path d="M14 6h7" />
      <path d="m18 6-3 8" />
      <path d="m16 11 4 0" />
    </BaseIcon>
  );
}

export function MapPin(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 21s-6-5.3-6-11a6 6 0 1 1 12 0c0 5.7-6 11-6 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </BaseIcon>
  );
}

export function Headphones(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 13a8 8 0 0 1 16 0" />
      <rect x="3" y="12" width="4" height="8" rx="2" />
      <rect x="17" y="12" width="4" height="8" rx="2" />
      <path d="M7 20a3 3 0 0 0 3 3h4" />
    </BaseIcon>
  );
}

export function BadgeCheck(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 3 14.2 5l3-.2.8 2.9 2.5 1.7-1.2 2.8 1.2 2.8-2.5 1.7-.8 2.9-3-.2L12 21l-2.2-2-3 .2-.8-2.9L3.5 15l1.2-2.8-1.2-2.8L6 7.7l.8-2.9 3 .2L12 3Z" />
      <path d="m9 12 2 2 4-4" />
    </BaseIcon>
  );
}

export function ChevronDown(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m6 9 6 6 6-6" />
    </BaseIcon>
  );
}

export function ArrowUp(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m18 15-6-6-6 6" />
      <path d="M12 9v12" />
    </BaseIcon>
  );
}
