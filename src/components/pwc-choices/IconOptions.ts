import { JSXBase } from "@stencil/core/internal";

export interface IIconOptions
  extends JSXBase.ImgHTMLAttributes<HTMLImageElement> {
  placement: "left" | "right";
}
