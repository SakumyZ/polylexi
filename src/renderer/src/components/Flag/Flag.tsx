import React from 'react'
import Flags from '@renderer/components/svgIcons/flags'

interface FlagProps {
  lang: string
}

const Flag: React.FC<FlagProps> = ({ lang }) => {
  const key = `Flag${lang.split('-')[1]}` as keyof typeof Flags
  const Flag = Flags[key]

  return <Flag className="field-label" />
}

export default Flag
