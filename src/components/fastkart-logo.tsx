import Link from "next/link"

interface FastkartLogoProps {
  className?: string
  showText?: boolean
  size?: "sm" | "md" | "lg"
}

export function FastkartLogo({ 
  className = "", 
  showText = true,
  size = "md" 
}: FastkartLogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  }

  return (
    <Link 
      href="/" 
      className={`flex items-center gap-2 group ${className}`}
      aria-label="Fastkart - Home"
    >
      {/* Logo Icon - Shopping Cart with Speed Lines */}
      <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shopping Cart */}
          <path
            d="M25 30 L75 30 L70 60 L30 60 L25 30 Z"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          />
          <path
            d="M30 60 L30 70 L50 70 L50 60"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          />
          <circle
            cx="40"
            cy="80"
            r="5"
            fill="currentColor"
            className="text-primary"
          />
          <circle
            cx="60"
            cy="80"
            r="5"
            fill="currentColor"
            className="text-primary"
          />
          
          {/* Speed Lines */}
          <path
            d="M75 30 L85 20 L90 25 L80 35"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className="text-primary opacity-70"
          />
          <path
            d="M80 25 L88 17 L92 21 L84 29"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="text-primary opacity-60"
          />
        </svg>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <span className={`font-bold text-primary ${textSizeClasses[size]} group-hover:opacity-80 transition-opacity`}>
          Fastkart
        </span>
      )}
    </Link>
  )
}

