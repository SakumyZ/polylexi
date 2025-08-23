import React from 'react'
import Flags from '@renderer/components/svgIcons/flags'

interface FlagProps {
  lang: string
  className?: string
}

const Flag: React.FC<FlagProps> = ({ lang, className }) => {
  const key = `Flag${lang.split('-')[1]}` as keyof typeof Flags
  const Flag = Flags[key]

  return <Flag className={className} />
}

export default Flag
