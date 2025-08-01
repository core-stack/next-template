import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Link href="/auth/login">Login</Link><br />
      <Link href="/auth/create-account">Create Account</Link><br />
      <Link href="/t">Home</Link>
    </div>
  );
}