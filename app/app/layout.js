import './globals.css'
import dynamic from 'next/dynamic'

const BootSequence = dynamic(() => import('./components/BootSequence'), { ssr: false })

export const metadata = {
  title: 'Diptangkush Das - Multiverse of Systems',
  description: 'A cinematic 3D portfolio. Digital vigilante engineer operating across AI, cybersecurity, trading systems and data intelligence.',
  openGraph: {
    title: 'Diptangkush Das - Multiverse of Systems',
    description: 'A cinematic 3D portfolio across AI, cybersecurity, trading systems and data intelligence.',
    url: 'https://YOUR-DOMAIN.vercel.app',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased overflow-x-hidden bg-[#03050a] text-white selection:bg-cyan-500/40 selection:text-white">
        <BootSequence />
        {children}
      </body>
    </html>
  )
}
