'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, UserPlus, LogIn, X, PlusCircle } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const navItems = useMemo(
    () => SITE_CONFIG.tasks.filter((task) => task.enabled && task.key !== 'listing' && task.key !== 'classified').map((task) => ({ label: task.label, href: task.route })),
    []
  )

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/98 shadow-sm backdrop-blur-xl">
      <nav className="mx-auto flex min-h-[68px] w-full max-w-[var(--editable-container)] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <img src="/fevicon.png" alt={SITE_CONFIG.name} className="h-10 w-10 object-contain" />
          <span className="hidden sm:block">
            <span className="editable-display block text-[17px] font-black leading-none tracking-tight text-slate-900">{SITE_CONFIG.name}</span>
            <span className="mt-0.5 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
              {globalContent.nav?.tagline || SITE_CONFIG.tagline}
            </span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden flex-1 items-center justify-center gap-0.5 lg:flex">
          {navItems.slice(0, 5).map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition duration-150 ${
                  active
                    ? 'bg-[#fff1eb] text-[#F45B26]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden items-center gap-2.5 lg:flex">
          <form action="/search">
            <label className="relative flex items-center">
              <Search className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" />
              <input
                name="q"
                type="search"
                placeholder="Search…"
                className="w-44 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none transition focus:border-[#03AED2] focus:ring-2 focus:ring-[#03AED2]/20 xl:w-52"
              />
            </label>
          </form>

          {session ? (
            <>
              <Link
                href="/create"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#F45B26] px-5 py-2.5 text-sm font-black text-white shadow-[0_2px_8px_rgba(244,91,38,0.35)] transition hover:-translate-y-0.5 hover:brightness-105"
              >
                <PlusCircle className="h-4 w-4" /> Create
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#03AED2] hover:text-[#03AED2]"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#F45B26] px-5 py-2.5 text-sm font-black text-white shadow-[0_2px_8px_rgba(244,91,38,0.35)] transition hover:-translate-y-0.5 hover:brightness-105"
              >
                <UserPlus className="h-4 w-4" /> Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-700 lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-slate-100 bg-white px-4 pb-6 pt-4 lg:hidden">
          <form action="/search" className="mb-4">
            <label className="relative flex items-center">
              <Search className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" />
              <input
                name="q"
                type="search"
                placeholder="Search posts…"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-4 text-sm outline-none focus:border-[#03AED2]"
              />
            </label>
          </form>

          <div className="space-y-0.5">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50"
            >
              Home
            </Link>
            {navItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? 'bg-[#fff1eb] text-[#F45B26]'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div className="mt-4 border-t border-slate-100 pt-4">
            {session ? (
              <>
                <Link
                  href="/create"
                  onClick={() => setOpen(false)}
                  className="mb-2 flex items-center justify-center gap-2 rounded-xl bg-[#F45B26] px-4 py-3 text-sm font-black text-white"
                >
                  <PlusCircle className="h-4 w-4" /> Create post
                </Link>
                <button
                  onClick={logout}
                  className="w-full rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center rounded-xl bg-[#F45B26] px-4 py-3 text-sm font-black text-white"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
