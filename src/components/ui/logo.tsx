'use client'

import React from 'react'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export function Logo({ className = '', size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon - CEPIN Logo */}
      <div className={`${sizeClasses[size]} relative`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Background circle */}
          <circle cx="50" cy="50" r="45" fill="#4A90E2"/>
          
          {/* Letter C */}
          <text
            x="50"
            y="65"
            fontSize="50"
            fontWeight="bold"
            fill="white"
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
          >
            C
          </text>
          
          {/* Decorative dots around the circle - Green */}
          <circle cx="70" cy="30" r="3" fill="#7ED321" />
          <circle cx="80" cy="35" r="3" fill="#7ED321" />
          <circle cx="75" cy="45" r="3" fill="#7ED321" />
          
          {/* Yellow */}
          <circle cx="30" cy="30" r="3" fill="#F5A623" />
          <circle cx="20" cy="35" r="3" fill="#F5A623" />
          <circle cx="25" cy="45" r="3" fill="#F5A623" />
          
          {/* Red */}
          <circle cx="70" cy="70" r="3" fill="#D0021B" />
          <circle cx="80" cy="65" r="3" fill="#D0021B" />
          <circle cx="75" cy="55" r="3" fill="#D0021B" />
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-cepin-blue ${textSizeClasses[size]}`}>
            CEPIN
          </span>
          <span className={`text-xs text-cepin-blue ${size === 'lg' ? 'text-sm' : ''}`}>
            Academia para bebês, crianças e adolescentes
          </span>
        </div>
      )}
    </div>
  )
}
