import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/dashboard');
  // Or, return a landing page component if preferred
  // return <LandingPage />;
}
