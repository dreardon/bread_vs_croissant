import './globals.css';
import Image from 'next/image';
import { AuthProvider } from '@/components/AuthProvider';

export const metadata = {
  title: 'Bread vs Croissant',
  description: 'Bread vs Croissant Game Tracker',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="layout-container">
            <header className="app-header">
              <div className="banner-img-container">
                <Image
                  src="/images/banner.png"
                  alt="Bread vs Croissant Banner"
                  fill
                  style={{ objectFit: 'contain' }}
                  quality={[100, 75]}
                  sizes="100vw"
                  priority
                />
              </div>
            </header>
            <main className="main-content">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
