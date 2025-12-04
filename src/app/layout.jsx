import './globals.css';

export const metadata = {
  title: 'Logistech - Sistema de Gestão Logística',
  description: 'Sistema de gestão logística para entregas e motoristas',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
      </head>
      <body>{children}</body>
    </html>
  );
}