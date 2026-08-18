'use client'

import {useLayoutEffect, useRef, type CSSProperties, type HTMLAttributes, type ReactNode} from 'react'

import styles from './home-reveal.module.css'

type HomeRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  variant?: 'up' | 'start' | 'end' | 'scale'
  stagger?: boolean
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'children' | 'style'>

export function HomeReveal({
  children,
  className = '',
  delay = 0,
  variant = 'up',
  stagger = false,
  ...rest
}: HomeRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.dataset.visible = 'true'
      return
    }

    const reveal = () => {
      node.dataset.visible = 'true'
    }

    const rect = node.getBoundingClientRect()
    const inView = rect.top < window.innerHeight * 0.9 && rect.bottom > 40
    node.dataset.ready = 'true'

    if (inView) {
      let nested = 0
      const frame = requestAnimationFrame(() => {
        nested = requestAnimationFrame(reveal)
      })
      return () => {
        cancelAnimationFrame(frame)
        cancelAnimationFrame(nested)
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        reveal()
        observer.disconnect()
      },
      {threshold: 0.14, rootMargin: '0px 0px -8% 0px'},
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      {...rest}
      ref={ref}
      className={[
        styles.root,
        styles[variant],
        stagger ? styles.stagger : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={delay ? ({'--home-reveal-delay': `${delay}ms`} as CSSProperties) : undefined}
    >
      {children}
    </div>
  )
}
