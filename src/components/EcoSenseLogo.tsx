/** Inline mark: sonar / depth — matches Techno-Oceanic palette */
export function EcoSenseLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="36"
      height="36"
      viewBox="0 0 36 36"
      aria-hidden
    >
      <defs>
        <linearGradient id="ecosense-logo-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8aebff" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <rect
        x="2.5"
        y="2.5"
        width="31"
        height="31"
        rx="5"
        fill="none"
        stroke="url(#ecosense-logo-fill)"
        strokeWidth="1.25"
        opacity="0.9"
      />
      <path
        d="M10 12c3.5 0 6.5 2.2 7.5 5.2M10 24c3.5 0 6.5-2.2 7.5-5.2M18 10v16M22 14h6M22 22h6"
        fill="none"
        stroke="url(#ecosense-logo-fill)"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
