export type MediaItem = {
  id: string
  title: string
  type: 'Film' | 'Serie'
  year: number
  duration: string
  rating: string
  tags: string[]
  synopsis: string
  accent: string
  art: string
  progress?: number
}

export const catalog: MediaItem[] = [
  {
    id: 'helix-drift',
    title: 'Helix Drift',
    type: 'Serie',
    year: 2025,
    duration: '8 x 45m',
    rating: '16+',
    tags: ['Sci-Fi', 'Thriller', 'Neo-noir'],
    synopsis:
      "Une capitaine en exil traque un signal quantique qui plie le temps et expose les secrets de sa flotte.",
    accent: 'text-cyan-200',
    art: 'from-cyan-500/70 via-blue-700/60 to-slate-950',
    progress: 0.68,
  },
  {
    id: 'fable-76',
    title: 'Fable 76',
    type: 'Film',
    year: 2024,
    duration: '1h 52m',
    rating: '12+',
    tags: ['Aventure', 'Mystere'],
    synopsis:
      "Une archiviste infiltre un palais flottant ou chaque souvenir est mis aux enchere en direct.",
    accent: 'text-amber-200',
    art: 'from-amber-400/70 via-orange-600/70 to-rose-900',
    progress: 0.24,
  },
  {
    id: 'neon-ridge',
    title: 'Neon Ridge',
    type: 'Serie',
    year: 2023,
    duration: '10 x 50m',
    rating: '18+',
    tags: ['Crime', 'Drama', 'Action'],
    synopsis:
      "Deux soeurs detectives naviguent entre gangs et corporations dans une megaville alimentee au soleil.",
    accent: 'text-fuchsia-200',
    art: 'from-fuchsia-500/70 via-purple-700/70 to-indigo-950',
  },
  {
    id: 'emberline',
    title: 'Emberline',
    type: 'Film',
    year: 2022,
    duration: '2h 04m',
    rating: '13+',
    tags: ['Drama', 'Romance'],
    synopsis:
      "Une cheffe de train apprend a ralentir la fin du monde en orchestrant un dernier voyage.",
    accent: 'text-rose-200',
    art: 'from-rose-500/70 via-red-700/70 to-slate-950',
  },
  {
    id: 'aurora-district',
    title: 'Aurora District',
    type: 'Serie',
    year: 2025,
    duration: '6 x 55m',
    rating: '16+',
    tags: ['Tech', 'Mystere'],
    synopsis:
      "Dans un district polaire, une analyste anticipe les crimes avant qu'ils ne se produisent.",
    accent: 'text-emerald-200',
    art: 'from-emerald-500/70 via-teal-700/70 to-slate-950',
  },
  {
    id: 'tide-keepers',
    title: 'Tide Keepers',
    type: 'Film',
    year: 2021,
    duration: '1h 38m',
    rating: '10+',
    tags: ['Famille', 'Aventure'],
    synopsis:
      "Une fratrie construit un phare nomade pour guider des baleines perdues.",
    accent: 'text-sky-200',
    art: 'from-sky-400/70 via-indigo-600/60 to-slate-950',
  },
]

export const featured = catalog[0]

export const continueWatching = catalog.filter((item) => item.progress)

export const trending = catalog.slice(0, 4)
