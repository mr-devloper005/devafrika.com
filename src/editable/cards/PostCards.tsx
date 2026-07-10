import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

/* Big featured card — full image bleed with strong overlay */
export function EditorialFeatureCard({ post, href, label = 'Featured' }: { post: SitePost; href: string; label?: string }) {
  const img = getEditablePostImage(post)
  const excerpt = getEditableExcerpt(post, 160)
  const cat = getEditableCategory(post)
  return (
    <Link
      href={href}
      className="group relative flex min-h-[480px] w-full flex-col overflow-hidden rounded-3xl lg:min-h-[560px]"
    >
      <img
        src={img}
        alt={post.title}
        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />
      <div className="relative z-10 mt-auto flex flex-col p-7 sm:p-10">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-[#F45B26] px-3 py-1 text-[11px] font-black uppercase tracking-widest text-white">
            {label}
          </span>
          <span className="rounded-full border border-white/25 px-3 py-1 text-[11px] font-bold text-white/80">
            {cat}
          </span>
        </div>
        <h3 className="mt-4 text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
          {post.title}
        </h3>
        {excerpt && (
          <p className="mt-3 line-clamp-2 text-sm leading-7 text-white/75 sm:text-base">{excerpt}</p>
        )}
        <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-white/15 px-5 py-2.5 text-sm font-bold text-white backdrop-blur transition group-hover:bg-white/25">
          Read more <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}

/* Compact rail card */
export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const img = getEditablePostImage(post)
  const cat = getEditableCategory(post)
  const accent = ['#03AED2', '#F45B26', '#D12052', '#10b981', '#f59e0b', '#8b5cf6'][index % 6]
  return (
    <Link
      href={href}
      className="group block w-[160px] shrink-0 snap-start overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-[180px]"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
        <img src={img} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <span
          className="absolute bottom-3 left-3 flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-black text-white"
          style={{ backgroundColor: accent }}
        >
          {index + 1}
        </span>
      </div>
      <div className="p-3">
        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: accent }}>{cat}</p>
        <h3 className="mt-1.5 line-clamp-2 text-sm font-bold leading-tight text-slate-900">{post.title}</h3>
      </div>
    </Link>
  )
}

/* Compact numbered sidebar card */
export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const img = getEditablePostImage(post)
  const cat = getEditableCategory(post)
  return (
    <Link
      href={href}
      className="group flex min-w-0 items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4 transition hover:border-[#03AED2] hover:shadow-md"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
        <img src={img} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#03AED2]">{cat}</p>
        <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-slate-900">{post.title}</h3>
      </div>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center self-center rounded-full bg-slate-100 text-[11px] font-black text-slate-500">
        {index + 1}
      </span>
    </Link>
  )
}

/* Horizontal article card */
export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const img = getEditablePostImage(post)
  const cat = getEditableCategory(post)
  const excerpt = getEditableExcerpt(post, 140)
  const accent = ['#F45B26', '#03AED2', '#D12052', '#10b981'][index % 4]
  return (
    <Link
      href={href}
      className="group grid min-w-0 gap-0 overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:grid-cols-[220px_minmax(0,1fr)]"
    >
      <div className="relative aspect-video overflow-hidden bg-slate-100 sm:aspect-auto sm:min-h-[180px]">
        <img src={img} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent sm:bg-gradient-to-r" />
      </div>
      <div className="flex flex-col justify-center p-5 sm:p-6">
        <span className="inline-block rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white" style={{ backgroundColor: accent }}>
          {cat}
        </span>
        <h2 className="mt-3 line-clamp-2 text-lg font-bold leading-snug tracking-tight text-slate-900 sm:text-xl">
          {post.title}
        </h2>
        {excerpt && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{excerpt}</p>
        )}
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold transition" style={{ color: accent }}>
          Read more <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}

/* Business / listing card */
export function BusinessListCard({ post, href }: { post: SitePost; href: string }) {
  const img = getEditablePostImage(post)
  const content = post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const cat = getEditableCategory(post)
  const location = typeof content.location === 'string' ? content.location : typeof content.address === 'string' ? content.address : ''
  return (
    <Link href={href} className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        <img src={img} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-[#03AED2] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">{cat}</span>
      </div>
      <div className="p-5">
        <h3 className="line-clamp-1 text-base font-black tracking-tight text-slate-900">{post.title}</h3>
        {location && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#F45B26]" /> {location}
          </p>
        )}
        <p className="mt-2.5 line-clamp-2 text-xs leading-5 text-slate-500">{getEditableExcerpt(post, 100)}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-black text-[#F45B26]">
          View details <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  )
}
