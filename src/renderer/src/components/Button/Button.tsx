import React from 'react'
import './Button.css'

interface ButtonProps {
  disabled?: boolean
  className?: string
  primary?: boolean
  children: React.ReactNode
  outlined?: boolean
  onClick?: (e: React.MouseEvent) => void
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled = false,
  className = '',
  primary = false,
  outlined,
  children
}) => {
  const outlinedClassName = outlined ? 'outlined' : ''
  const primaryClassName = primary ? 'primary' : ''

  return (
    <button
      className={`button ${className} ${outlinedClassName} ${primaryClassName}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
