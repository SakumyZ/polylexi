import React from 'react'
import './Button.css'

interface ButtonProps {
  disabled?: boolean
  className?: string
  primary?: boolean
  children: React.ReactNode
  outlined?: boolean
  onClick?: (e: React.MouseEvent) => void
  htmlType?: 'button' | 'submit' | 'reset'
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled = false,
  className = '',
  primary = false,
  outlined,
  children,
  htmlType
}) => {
  const outlinedClassName = outlined ? 'outlined' : ''
  const primaryClassName = primary ? 'primary' : ''

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClick?.(e)
  }

  return (
    <button
      className={`button ${className} ${outlinedClassName} ${primaryClassName}`}
      onClick={handleClick}
      disabled={disabled}
      type={htmlType}
    >
      {children}
    </button>
  )
}

export default Button
