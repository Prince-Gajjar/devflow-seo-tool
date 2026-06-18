import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DevFlow SEO Tool',
    short_name: 'DevFlow SEO',
    description: 'Analyze, optimize, and dominate search rankings with DevFlow\'s professional-grade SEO toolkit.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#a3e635',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
