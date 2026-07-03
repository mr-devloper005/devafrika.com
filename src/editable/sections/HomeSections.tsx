import Link from 'next/link'
import {
  ArrowRight, Bookmark, Building2, ChevronRight, FileText, Image as ImageIcon,
  Megaphone, Search, UserRound, Sparkles, TrendingUp, Zap,
} from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditablePostImage, postHref, EditorialFeatureCard, CompactIndexCard, ArticleListCard } from '@/editable/cards/PostCards'
import { EditableHeroCollage } from '@/editable/sections/EditableHeroCollage'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const taskIcon: Record<TaskKey, typeof FileText> = {
  article: FileText,
  listing: Building2,
  classified: Megaphone,
  image: ImageIcon,
  sbm: Bookmark,
  pdf: FileText,
  profile: UserRound,
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8'

function latestPostImages(posts: SitePost[], max = 8) {
  const seen = new Set<string>()
  const out: string[] = []
  for (const post of posts) {
    const img = getEditablePostImage(post)
    if (!img || img.includes('placeholder') || seen.has(img)) continue
    seen.add(img)
    out.push(img)
    if (out.length >= max) break
  }
  return out
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

/* ======================== HERO ======================== */
export function EditableHomeHero({ posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const heroImages = latestPostImages(pool)
  const heroTitle = pagesContent.home.hero.title?.join(' ') || `Discover what's trending on ${SITE_CONFIG.name}`
  const categories = SITE_CONFIG.tasks.filter((task) => task.enabled && task.key !== 'listing' && task.key !== 'classified').slice(0, 6)

  return (
    <section className="relative overflow-hidden bg-[#0c1117]">
      {/* background collage */}
      <div className="absolute inset-0 opacity-30">
        <EditableHeroCollage images={heroImages} />
      </div>
      {/* overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0c1117]/95 via-[#0c1117]/70 to-[#03AED2]/30" />
      {/* decorative circles */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#03AED2]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 left-1/3 h-72 w-72 rounded-full bg-[#F45B26]/20 blur-3xl" />

      <div className={`relative z-10 flex min-h-[580px] flex-col justify-center py-20 ${container} sm:min-h-[640px] lg:min-h-[680px]`}>
        <div className="max-w-3xl">
          {/* badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[#F8DE22]" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/90">
              {pagesContent.home.hero.badge || 'Trending Now'}
            </span>
          </div>

          {/* headline */}
          <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl lg:text-[3.75rem]">
            {heroTitle.split(' ').slice(0, 4).join(' ')}{' '}
            <span className="bg-gradient-to-r from-[#03AED2] to-[#F8DE22] bg-clip-text text-transparent">
              {heroTitle.split(' ').slice(4).join(' ')}
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
            {pagesContent.home.hero.description}
          </p>

          {/* search */}
          <form action="/search" className="mt-8 flex w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/40">
            <div className="flex flex-1 items-center gap-3 px-5">
              <Search className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                name="q"
                placeholder="Search posts, businesses, topics…"
                className="w-full bg-transparent py-4 text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              className="shrink-0 bg-[#F45B26] px-7 text-sm font-black text-white transition hover:bg-[#e04d1e] active:scale-95"
            >
              Search
            </button>
          </form>

          {/* quick links */}
          <div className="mt-7 flex flex-wrap gap-2.5">
            {categories.map((task) => (
              <Link
                key={task.key}
                href={task.route}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/20"
              >
                {task.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ======================== CATEGORY BROWSE ======================== */
export function EditableStoryRail(_props: HomeSectionProps) {
  const categories = SITE_CONFIG.tasks.filter((task) => task.enabled && task.key !== 'listing' && task.key !== 'classified')
  if (!categories.length) return null

  const catBg: Record<string, string> = {
    article: 'bg-[#e0f7ff] text-[#03AED2]',
    listing: 'bg-[#fff1eb] text-[#F45B26]',
    classified: 'bg-[#ffe0e9] text-[#D12052]',
    image: 'bg-[#d1fae5] text-[#10b981]',
    sbm: 'bg-[#ede9fe] text-[#8b5cf6]',
    pdf: 'bg-[#fef3c7] text-[#f59e0b]',
    profile: 'bg-[#cffafe] text-[#06b6d4]',
  }
  return (
    <section className="bg-white py-14 shadow-sm sm:py-16">
      <div className={container}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F45B26]">Explore</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Browse by category</h2>
          </div>
          <Link href="/search" className="hidden shrink-0 items-center gap-1.5 text-sm font-bold text-[#03AED2] hover:underline sm:flex">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {categories.map((task) => {
            const Icon = taskIcon[task.key as TaskKey] || FileText
            const cls = catBg[task.key] || 'bg-slate-100 text-slate-600'
            return (
              <Link
                key={task.key}
                href={task.route}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-100 bg-white p-6 text-center transition duration-300 hover:-translate-y-1.5 hover:border-transparent hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
              >
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl transition duration-300 group-hover:scale-110 ${cls}`}
                >
                  <Icon className="h-7 w-7" />
                </span>
                <span className="text-sm font-black tracking-tight text-slate-900">{task.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ======================== FEATURED + SIDEBAR ======================== */
export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const allPosts = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const featured = allPosts[0]
  const sidebar = allPosts.slice(1, 5)

  if (!featured && !sidebar.length) return null

  return (
    <section className="bg-slate-50 py-14 sm:py-16 lg:py-20">
      <div className={container}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#03AED2]">Hand-picked</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Featured highlights</h2>
          </div>
          <Link href={primaryRoute} className="hidden shrink-0 items-center gap-1.5 text-sm font-bold text-[#03AED2] hover:underline sm:flex">
            See all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_400px]">
          {featured && (
            <EditorialFeatureCard
              post={featured}
              href={postHref(primaryTask, featured, primaryRoute)}
              label="Featured"
            />
          )}

          {/* sidebar */}
          <div className="flex flex-col gap-3">
            <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">More to read</p>
            {sidebar.map((post, idx) => (
              <CompactIndexCard
                key={post.id || post.slug}
                post={post}
                href={postHref(primaryTask, post, primaryRoute)}
                index={idx}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ======================== TRENDING GRID ======================== */
export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const allPosts = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)]).slice(0, 8)
  if (!allPosts.length) return null

  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20">
      <div className={container}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D12052]">Trending</p>
            <h2 className="mt-2 flex items-center gap-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              <TrendingUp className="h-7 w-7 text-[#D12052]" />
              What's hot right now
            </h2>
          </div>
          <Link href={primaryRoute} className="hidden shrink-0 items-center gap-1.5 text-sm font-bold text-[#D12052] hover:underline sm:flex">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {allPosts.map((post, idx) => (
            <ArticleListCard
              key={post.id || post.slug}
              post={post}
              href={postHref(primaryTask, post, primaryRoute)}
              index={idx}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href={primaryRoute}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-8 py-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl"
          >
            Browse all posts <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ======================== STATS STRIP ======================== */
function StatsStrip() {
  const stats = [
    { value: '10K+', label: 'Posts published' },
    { value: '2K+', label: 'Businesses listed' },
    { value: '50K+', label: 'Monthly readers' },
    { value: '4.8★', label: 'Average rating' },
  ]
  return (
    <section className="border-y border-slate-100 bg-white py-10">
      <div className={container}>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm font-medium text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ======================== CTA ======================== */
export function EditableHomeCta() {
  return (
    <>
      <StatsStrip />
      <section className="relative overflow-hidden bg-[#0c1117] py-20 sm:py-24">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -left-16 top-0 h-80 w-80 rounded-full bg-[#03AED2]/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 right-0 h-80 w-80 rounded-full bg-[#F45B26]/20 blur-3xl" />
        <div className="pointer-events-none absolute right-1/3 top-1/2 h-56 w-56 rounded-full bg-[#D12052]/15 blur-2xl" />

        <div className={`relative z-10 ${container}`}>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white/80 backdrop-blur">
              <Zap className="h-3.5 w-3.5 text-[#F8DE22]" />
              Join the community
            </span>
            <h2 className="mt-6 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              Share your story with{' '}
              <span className="bg-gradient-to-r from-[#03AED2] to-[#F8DE22] bg-clip-text text-transparent">
                {SITE_CONFIG.name}
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
              Join thousands of creators and businesses sharing their best work, listings, and stories.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/create"
                className="inline-flex items-center gap-2.5 rounded-2xl bg-[#F45B26] px-8 py-4 text-sm font-black text-white shadow-[0_4px_24px_rgba(244,91,38,0.4)] transition hover:-translate-y-0.5 hover:brightness-110"
              >
                Start creating <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center gap-2.5 rounded-2xl border border-white/20 bg-white/10 px-8 py-4 text-sm font-black text-white backdrop-blur transition hover:bg-white/20"
              >
                Explore posts <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
