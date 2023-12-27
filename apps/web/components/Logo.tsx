export function Logo(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 90 24" aria-hidden="true" {...props}>
      <path
        className="fill-emerald-400"
        d="M0 7C0 5.89543 0.895431 5 2 5H14C15.1046 5 16 5.89543 16 7V15.2984C16 17.189 13.6193 18.0241 12.4383 16.5478L9.56174 12.9522C8.76109 11.9514 7.23891 11.9514 6.43826 12.9522L3.56174 16.5478C2.38072 18.0241 0 17.189 0 15.2984V7Z"
      />

      <text x="26" y="17" className="fill-zinc-900 font-bold tracking-wider">
        Tools
      </text>
    </svg>
  )
}
