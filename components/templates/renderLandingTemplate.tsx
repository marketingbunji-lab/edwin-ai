import type { Brand, Landing } from "@/lib/data";
import type { LandingLiveEditConfig } from "@/components/editor/LiveEditableText";
import DefaultLanding from "./DefaultLanding";

type RenderLandingTemplateProps = {
  brand: Brand;
  landing: Landing;
  mode?: "preview" | "export";
  liveEdit?: LandingLiveEditConfig;
};

export function renderLandingTemplate({
  brand,
  landing,
  mode = "preview",
  liveEdit,
}: RenderLandingTemplateProps) {
  return (
    <DefaultLanding
      brand={brand}
      landing={landing}
      mode={mode}
      liveEdit={liveEdit}
    />
  );
}
