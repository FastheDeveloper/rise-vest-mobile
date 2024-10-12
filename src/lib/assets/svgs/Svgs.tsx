import * as React from "react"
import Svg, { SvgProps, Rect, Path } from "react-native-svg"
export const ApprovedIcon = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Rect
      width={90}
      height={90}
      x={0.5}
      fill="#71879C"
      fillOpacity={0.1}
      rx={45}
    />
    <Path
      stroke="#0898A0"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
      d="m28.365 46.663 10.133 8.707 24.138-20.74"
    />
  </Svg>
)

