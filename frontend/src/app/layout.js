import Header from './components/header'
import Footer from './components/footer'
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col min-h-screen">
        <Header />
        {children}
        <div className="flex-grow"></div>
        <Footer />
        </div>
      </body>
    </html>
  )
}
