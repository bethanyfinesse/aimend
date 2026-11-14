import { Search } from 'lucide-react'

export default function TopBar() {
  return (
    <header className="flex items-center gap-4 px-6 md:px-9 h-14 border-b border-white/[0.07]">
      <div className="text-[14px] whitespace-nowrap">
        <span className="text-muted">Northwind Inc.</span>
        <span className="text-muted/60 mx-2">/</span>
        <span className="text-ink font-medium">Savings</span>
      </div>
      <div className="flex-1 flex justify-center">
        <label className="hidden sm:flex items-center gap-2 w-full max-w-[400px] h-9 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-muted text-[13.5px]">
          <Search size={14} />
          <input className="bg-transparent outline-none flex-1 text-ink placeholder:text-muted" placeholder="Search teams, features, prompts" />
        </label>
      </div>
      <div className="w-9 h-9 rounded-full grid place-items-center text-[12px] font-semibold bg-white/[0.08] border border-white/10">JD</div>
    </header>
  )
}
