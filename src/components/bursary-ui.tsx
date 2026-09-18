import { Link, useRouterState } from '@tanstack/react-router'
import { Bell, Bookmark, BriefcaseBusiness, CalendarDays, ChevronRight, CircleUserRound, Compass, GraduationCap, Home, Menu, Search, ShieldCheck, Sparkles, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import type { Bursary } from '@/lib/bursary-data'
import { useAppState } from '@/lib/app-state'

export function Logo({ compact = false }: { compact?: boolean }) {
  return <div className="flex items-center gap-2.5"><span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-brand"><GraduationCap size={22} strokeWidth={2.3} /></span>{!compact && <span className="font-display text-xl font-bold text-foreground">Bursary<span className="text-primary">Buddy</span></span>}</div>
}

const nav = [
  { to: '/home', label: 'Home', icon: Home }, { to: '/discover', label: 'Discover', icon: Compass }, { to: '/applications', label: 'Applications', icon: BriefcaseBusiness }, { to: '/saved', label: 'Saved', icon: Bookmark }, { to: '/profile', label: 'Profile', icon: CircleUserRound },
] as const

export function AppShell({ children, title, subtitle }: { children: ReactNode; title?: string; subtitle?: string }) {
  const path = useRouterState({ select: s => s.location.pathname })
  const [menu, setMenu] = useState(false)
  return <div className="min-h-screen bg-background text-foreground">
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-surface px-5 py-6 lg:flex lg:flex-col">
      <Logo />
      <nav className="mt-10 space-y-1">{nav.map(({to,label,icon:Icon}) => <Link key={to} to={to} className="nav-item" activeProps={{className:'nav-item nav-item-active'}}><Icon size={20}/><span>{label}</span></Link>)}</nav>
      <div className="mt-auto rounded-lg bg-primary-soft p-4"><ShieldCheck className="text-primary" size={22}/><p className="mt-3 text-sm font-semibold">Stay safe online</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Always verify opportunities on the official provider website.</p><Link to="/help" className="mt-3 inline-flex text-xs font-semibold text-primary">Read safety guide <ChevronRight size={14}/></Link></div>
    </aside>
    <div className="lg:pl-64">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"><div className="lg:hidden"><Logo /></div><div className="hidden lg:block"><p className="text-sm font-semibold">{title ?? 'BursaryBuddy'}</p>{subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}</div><div className="flex items-center gap-2"><Link to="/notifications" aria-label="Notifications" className="icon-button relative"><Bell size={20}/><span className="absolute right-2 top-2 size-2 rounded-full bg-warning ring-2 ring-background"/></Link><button className="icon-button lg:hidden" aria-label="Open menu" onClick={() => setMenu(true)}><Menu size={20}/></button></div></div>
      </header>
      {menu && <div className="fixed inset-0 z-50 bg-overlay lg:hidden"><div className="ml-auto h-full w-72 bg-surface p-5 shadow-2xl"><div className="flex items-center justify-between"><Logo/><button className="icon-button" aria-label="Close menu" onClick={() => setMenu(false)}><X size={20}/></button></div><nav className="mt-8 space-y-1">{nav.map(({to,label,icon:Icon}) => <Link key={to} to={to} onClick={() => setMenu(false)} className="nav-item"><Icon size={20}/>{label}</Link>)}<Link to="/deadlines" onClick={() => setMenu(false)} className="nav-item"><CalendarDays size={20}/>Deadlines</Link><Link to="/help" onClick={() => setMenu(false)} className="nav-item"><Sparkles size={20}/>Application Help</Link></nav></div></div>}
      <main className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12">{children}</main>
    </div>
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-surface/95 px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur lg:hidden">{nav.map(({to,label,icon:Icon}) => { const active = path === to || (to === '/discover' && path.startsWith('/bursary/')); return <Link key={to} to={to} className={`bottom-nav ${active ? 'bottom-nav-active' : ''}`}><Icon size={20}/><span>{label}</span></Link>})}</nav>
  </div>
}

export function PageTitle({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) { return <div className="mb-6 flex items-end justify-between gap-4"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1 className="font-display text-2xl font-bold sm:text-3xl">{title}</h1>{description && <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>}</div>{action}</div> }
export function ProgressBar({ value }: { value: number }) { return <div className="h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}><div className="h-full rounded-full bg-accent transition-all" style={{ width: `${value}%` }}/></div> }

export function OpportunityCard({ item, compact = false }: { item: Bursary; compact?: boolean }) {
  const { saved, toggleSaved } = useAppState(); const isSaved = saved.includes(item.id)
  return <article className="opportunity-card group">
    <div className="flex items-start justify-between gap-3"><span className="demo-badge">DEMO OPPORTUNITY</span><button onClick={() => toggleSaved(item.id)} aria-label={isSaved ? `Remove ${item.name} from saved` : `Save ${item.name}`} className={`save-button ${isSaved ? 'save-button-active' : ''}`}><Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'}/></button></div>
    <div className="mt-4"><p className="text-xs font-semibold text-primary">{item.provider}</p><h2 className="mt-1 font-display text-lg font-bold leading-snug">{item.name}</h2></div>
    <div className="mt-3 flex flex-wrap gap-2"><span className="chip">{item.category}</span><span className="chip">{item.studyLevel}</span><span className="chip">{item.fundingType}</span></div>
    {!compact && <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted-foreground">{item.description}</p>}
    <div className="mt-5 flex items-center justify-between border-t border-border pt-4"><div><p className="text-xs text-muted-foreground">Closes {item.closes}</p><p className={`mt-1 text-xs font-bold ${item.daysLeft <= 7 ? 'text-danger' : item.daysLeft <= 21 ? 'text-warning' : 'text-success'}`}>{item.daysLeft} days left</p></div><div className="match-ring"><span>{item.match}%</span><small>match</small></div></div>
    <Link to="/bursary/$bursaryId" params={{ bursaryId: item.id }} className="primary-button mt-5 w-full">View details <ChevronRight size={17}/></Link>
  </article>
}

export function SearchField({ value, onChange }: { value: string; onChange: (value: string) => void }) { return <label className="search-field"><Search size={20}/><span className="sr-only">Search bursaries</span><input value={value} onChange={e => onChange(e.target.value)} placeholder="Search bursaries, companies or fields..."/></label> }

export function EmptyState({ icon, title, text, action }: { icon: ReactNode; title: string; text: string; action: ReactNode }) { return <div className="empty-state"><div className="mx-auto grid size-14 place-items-center rounded-full bg-primary-soft text-primary">{icon}</div><h2 className="mt-4 font-display text-xl font-bold">{title}</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{text}</p><div className="mt-5">{action}</div></div> }