import Providers from './Providers'

export const metadata = {
  title: 'MovieMatch',
  description: 'Find your next favorite movie',
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
