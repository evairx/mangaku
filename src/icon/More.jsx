import * as React from "react"
const SvgComponent = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={64}
    height={64}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <g fill="currentColor">
      <circle cx={12} cy={6} r={1.5} />
      <circle cx={12} cy={12} r={1.5} />
      <circle cx={12} cy={18} r={1.5} />
    </g>
  </svg>
)
export default SvgComponent
