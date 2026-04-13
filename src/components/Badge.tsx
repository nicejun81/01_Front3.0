interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'muted'
  size?: 'sm' | 'md'
}

const variantStyles = {
  primary: 'bg-primary text-white',
  secondary: 'bg-primary-50 text-primary',
  success: 'bg-semantic-online/15 text-semantic-online',
  danger: 'bg-semantic-like text-white',
  warning: 'bg-semantic-star/15 text-semantic-star',
  muted: 'bg-surface-muted text-ink-secondary',
}

const sizeStyles = {
  sm: 'px-1.5 py-0.5 text-caption',
  md: 'px-2 py-0.5 text-label',
}

export const Badge = ({ children, variant = 'primary', size = 'sm' }: BadgeProps) => {
  return (
    <span className={`inline-flex items-center font-bold rounded ${variantStyles[variant]} ${sizeStyles[size]}`}>
      {children}
    </span>
  )
}
