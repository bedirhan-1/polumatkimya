import Image from 'next/image'

type LogoSize = 'small' | 'medium' | 'large'
type LogoSurface = 'dark' | 'light'

type PolumatLogoProps = {
  alt: string
  className?: string
  eager?: boolean
  size?: LogoSize
  surface?: LogoSurface
}

const dimensions: Record<LogoSize, {width: number; height: number}> = {
  small: {width: 400, height: 104},
  medium: {width: 800, height: 205},
  large: {width: 1248, height: 320},
}

export function PolumatLogo({
  alt,
  className,
  eager = false,
  size = 'medium',
  surface = 'dark',
}: PolumatLogoProps) {
  const {width, height} = dimensions[size]

  return (
    <Image
      src={`/brand/polumat-logo-${size}-${surface}.webp`}
      alt={alt}
      width={width}
      height={height}
      className={className}
      draggable={false}
      fetchPriority={eager ? 'high' : 'auto'}
      loading={eager ? 'eager' : 'lazy'}
    />
  )
}
