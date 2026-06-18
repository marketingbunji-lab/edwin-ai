import type {
  ElementType,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from "react";

export type LandingLiveEditConfig = {
  enabled: boolean;
  onTextChange: (path: string, value: string) => void;
  onAddItem?: (path: string) => void;
};

type Props = {
  as?: ElementType;
  path: string;
  value: string;
  liveEdit?: LandingLiveEditConfig;
  className?: string;
  children?: ReactNode;
  singleLine?: boolean;
};

export default function LiveEditableText({
  as: Component = "span",
  path,
  value,
  liveEdit,
  className = "",
  children,
  singleLine = false,
}: Props) {
  const isEditable = Boolean(liveEdit?.enabled);
  const editableClass = isEditable
    ? "rounded-lg outline outline-2 outline-dashed outline-[var(--bunji-primary,#6d5dfc)]/45 outline-offset-4 transition hover:bg-[var(--bunji-primary,#6d5dfc)]/10 focus:bg-[var(--bunji-primary,#6d5dfc)]/12 focus:outline-solid"
    : "";

  const commitValue = (text: string) => {
    const nextValue = singleLine ? text.replace(/\s+/g, " ").trim() : text.trim();

    if (nextValue !== value.trim()) {
      liveEdit?.onTextChange(path, nextValue);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!singleLine || event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    event.currentTarget.blur();
  };

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (!isEditable) return;

    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Component
      className={`${className} ${editableClass}`.trim()}
      contentEditable={isEditable}
      suppressContentEditableWarning
      data-live-edit-path={isEditable ? path : undefined}
      title={isEditable ? "Click para editar este texto" : undefined}
      onBlur={
        isEditable
          ? (event: FocusEvent<HTMLElement>) =>
              commitValue(event.currentTarget.innerText)
          : undefined
      }
      onClick={isEditable ? handleClick : undefined}
      onKeyDown={isEditable ? handleKeyDown : undefined}
    >
      {children ?? value}
    </Component>
  );
}
