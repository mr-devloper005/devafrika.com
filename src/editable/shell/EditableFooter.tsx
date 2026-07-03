'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled && task.key !== 'listing' && task.key !== 'classified')
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="border-t border-[var(--editable-border)] bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid gap-12 py-16 sm:gap-8 md:grid-cols-2">
          {/* Brand Column */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3 transition hover:opacity-80">
              <img src="/fevicon.png" alt={SITE_CONFIG.name} className="h-12 w-12 object-contain" />
              <span className="editable-display text-lg font-black tracking-tight">{SITE_CONFIG.name}</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/70">{globalContent.footer?.description || SITE_CONFIG.description}</p>
            <div className="mt-6 flex items-center gap-2 text-sm text-white/60">
              <Heart className="h-4 w-4 fill-[var(--slot4-accent)] text-[var(--slot4-accent)]" />
              <span>Made with care for creators</span>
            </div>
          </div>

          {/* Site Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/90">Site</h3>
            <div className="mt-6 space-y-3">
              <Link href="/about" className="block text-sm text-white/70 transition hover:text-white">
                About us
              </Link>
              <Link href="/contact" className="block text-sm text-white/70 transition hover:text-white">
                Contact
              </Link>
              {session ? (
                <>
                  <Link href="/create" className="block text-sm text-white/70 transition hover:text-white">
                    Create
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="block text-sm text-white/70 transition hover:text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block text-sm text-white/70 transition hover:text-white">
                    Login
                  </Link>
                  <Link href="/signup" className="block text-sm text-white/70 transition hover:text-white">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/10 py-8 sm:flex sm:items-center sm:justify-between">
          <p className="text-center text-sm text-white/60 sm:text-left">
            © {year} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <div className="mt-4 flex items-center justify-center gap-6 sm:mt-0">
            <a href="#" className="text-white/60 transition hover:text-white">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20v-7.21H5.93V9.25h2.36V7.07c0-2.33 1.43-3.61 3.48-3.61.99 0 1.84.07 2.09.1v2.42h-1.44c-1.13 0-1.35.53-1.35 1.32v1.73h2.69l-.35 3.54h-2.34V20" />
              </svg>
            </a>
            <a href="#" className="text-white/60 transition hover:text-white">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7" />
              </svg>
            </a>
            <a href="#" className="text-white/60 transition hover:text-white">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16.5 9.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM21 19a4 4 0 00-4-4h-8a4 4 0 00-4 4v1h16v-1z" fill="white" opacity="0.3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
