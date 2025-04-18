import './globals.css';

export const metadata = {
  title: 'Sentiment Analysis Service',
  description: 'Analyze text sentiment using AI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}