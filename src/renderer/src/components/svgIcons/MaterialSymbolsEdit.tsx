import React from 'react'

interface MaterialSymbolsEditProps {
  className?: string
}

const MaterialSymbolsEdit: React.FC<MaterialSymbolsEditProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={className}
    >
      <path
        fill="currentColor"
        d="M5 19h1.425L16.2 9.225L14.775 7.8L5 17.575zm12.025-9.425L18.45 8.15L16.225 5.925L14.8 7.35zM5 21q-.825 0-1.412-.587T3 19v-2.575q0-.4.15-.763t.425-.637L16.2 2.4q.3-.275.663-.425t.762-.15q.4 0 .775.15t.65.45L20.425 4.8q.275.3.425.663T21 6.225q0 .4-.137.763t-.438.662L7.8 20.275q-.275.275-.637.425t-.763.15z"
      />
    </svg>
  )
}

export default MaterialSymbolsEdit
