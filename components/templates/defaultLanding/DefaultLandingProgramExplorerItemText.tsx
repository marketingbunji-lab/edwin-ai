import LiveEditableText, {
  type LandingLiveEditConfig,
} from "@/components/editor/LiveEditableText";

type Props = {
  isSteps: boolean;
  item: string;
  path: string;
  liveEdit?: LandingLiveEditConfig;
};

export default function DefaultLandingProgramExplorerItemText({
  isSteps,
  item,
  path,
  liveEdit,
}: Props) {
  if (!isSteps || liveEdit?.enabled) {
    return <LiveEditableText path={path} value={item} liveEdit={liveEdit} />;
  }

  const separatorIndex = item.indexOf(":");

  if (separatorIndex < 0) {
    return <span>{item}</span>;
  }

  const title = item.slice(0, separatorIndex).trim();
  const description = item.slice(separatorIndex + 1).trim();

  return (
    <span className="block">
      <strong className="block font-semibold text-slate-900">{title}</strong>
      {description ? <span className="mt-1 block">{description}</span> : null}
    </span>
  );
}
