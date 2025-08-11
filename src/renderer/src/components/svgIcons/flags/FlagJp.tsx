import { SVGProps } from 'react'

export default function FlagJp4x3(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1.34em"
      height="1em"
      viewBox="0 0 640 480"
      {...props}
    >
      <defs>
        <clipPath id="flagJp4x30">
          <path fillOpacity=".7" d="M-88 32h640v480H-88z"></path>
        </clipPath>
      </defs>
      <g
        fillRule="evenodd"
        strokeWidth="1pt"
        clipPath="url(#flagJp4x30)"
        transform="translate(88 -32)"
      >
        <path fill="#fff" d="M-128 32h720v480h-720z"></path>
        <circle
          cx="523.1"
          cy="344.1"
          r="194.9"
          fill="#bc002d"
          transform="translate(-168.4 8.6) scale(.76554)"
        ></circle>
      </g>
    </svg>
  )
}
