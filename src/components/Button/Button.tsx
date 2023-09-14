import React from 'react'
import './Button.css'

type Color = 'primary' | 'secondary' | 'success' | 'danger' | 'warning'

interface ButtonProps {
  disabled?: boolean
  className?: string
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning'
  children: React.ReactNode
  outlined?: boolean
  onClick?: (e: React.MouseEvent) => void
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled = false,
  className = '',
  color = 'primary',
  outlined,
  children
}) => {
  const colors: Record<Color, string> = {
    primary: 'var(--color-primary)',
    secondary: 'var(--color-secondary)',
    success: 'var(--color-success)',
    danger: 'var(--color-danger)',
    warning: 'var(--color-warning)'
  }

  const outlinedClassName = outlined ? 'outlined' : ''

  return (
    <button
      className={`button ${className} ${outlinedClassName}`}
      onClick={onClick}
      disabled={disabled}
      style={{ '--button-color': colors[color] } as React.CSSProperties}
    >
      {children}
    </button>
  )
}


export default Button
