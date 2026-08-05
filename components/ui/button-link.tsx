import Link from 'next/link'
import type {ComponentProps} from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant
}

const baseClass =
  'inline-flex min-h-11 items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold tracking-wide transition'

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-white hover:brightness-110 shadow-[0_0_24px_var(--accent-glow)] border border-accent',
  secondary:
    'bg-transparent text-foreground border border-border hover:border-accent hover:text-accent',
  ghost: 'bg-transparent text-muted hover:text-foreground border border-transparent',
}

export function buttonClassName(variant: ButtonVariant = 'primary', className = '') {
  return `${baseClass} ${variantClass[variant]} ${className}`
}

export function ButtonLink({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link {...props} className={buttonClassName(variant, className)}>
      {children}
    </Link>
  )
}
