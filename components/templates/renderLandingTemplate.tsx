import type { Brand, Landing } from "@/lib/data";
import DefaultLanding from "./DefaultLanding";
import UamProgramLanding from "./UamProgramLanding";

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
  if (landing.template === "UamProgramLanding") {
    return <UamProgramLanding brand={brand} landing={landing} mode={mode} />;
  }

  return <DefaultLanding brand={brand} landing={landing} mode={mode} />;
}
