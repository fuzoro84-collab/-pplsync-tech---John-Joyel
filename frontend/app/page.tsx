import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-soft-white">
      <nav className="fixed top-0 left-0 right-0 bg-soft-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-calm-teal">
              DAsh
            </Link>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="px-6 py-2 rounded-lg font-semibold text-calm-teal hover:bg-calm-teal hover:bg-opacity-10 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-6 py-2 rounded-lg font-semibold bg-calm-teal text-white hover:bg-opacity-90 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-deep-charcoal mb-6">
            The pen is the tongue of the mind
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Welcome to DAsh — your space to think, write, and create.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-3 rounded-lg font-semibold bg-calm-teal text-white hover:bg-opacity-90 transition-colors shadow-lg"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-8 py-3 rounded-lg font-semibold border-2 border-calm-teal text-calm-teal hover:bg-calm-teal hover:text-white transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
