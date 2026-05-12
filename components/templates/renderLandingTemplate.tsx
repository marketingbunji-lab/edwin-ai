import type { Brand, Landing } from "@/lib/data";
import DefaultLanding from "./DefaultLanding";

type RenderLandingTemplateProps = {
  brand: Brand;
  landing: Landing;
  mode?: "preview" | "export";
};

export function renderLandingTemplate({
  brand,
  landing,
  mode = "preview",
}: RenderLandingTemplateProps) {
  return <DefaultLanding brand={brand} landing={landing} mode={mode} />;
}
