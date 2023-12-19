import * as React from "react"

const SvgComponent = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={64}
    height={64}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M22 4.5a1 1 0 0 1-1 1h-9a1 1 0 0 1 0-2h9a1 1 0 0 1 1 1Zm-1 4h-7a1 1 0 0 0 0 2h7a1 1 0 0 0 0-2Zm0 5h-5a1 1 0 0 0 0 2h5a1 1 0 0 0 0-2Zm0 5h-3a1 1 0 0 0 0 2h3a1 1 0 0 0 0-2ZM6 2a1 1 0 0 0-1 1v15.586l-1.293-1.293a1 1 0 0 0-1.414 1.414l3 3a1 1 0 0 0 1.416 0l3-3a1 1 0 0 0-1.414-1.414L7 18.586V3a1 1 0 0 0-1-1Z" />
  </svg>
)
export default SvgComponent
