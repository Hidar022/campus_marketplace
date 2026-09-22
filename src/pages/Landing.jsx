import { Link } from "react-router-dom";

const categories = [
  {
    name: "Electronics",
    description: "Phones, laptops, accessories and more.",
    icon: "💻",
  },
  {
    name: "Books",
    description: "Textbooks, novels and study materials.",
    icon: "📚",
  },
  {
    name: "Fashion",
    description: "Clothes, shoes, bags and accessories.",
    icon: "👕",
  },
  {
    name: "Food",
    description: "Food, snacks and drinks around campus.",
    icon: "🍔",
  },
  {
    name: "Services",
    description: "Useful services offered by students.",
    icon: "🛠️",
  },
  {
    name: "Others",
    description: "Everything else you need on campus.",
    icon: "✨",
  },
];

const benefits = [
  {
    number: "01",
    title: "Discover Easily",
    description:
      "Find products and services from members of your campus community in one organized marketplace.",
  },
  {
    number: "02",
    title: "Sell With Ease",
    description:
      "Create your own listings and reach other members of your campus without relying on scattered platforms.",
  },
  {
    number: "03",
    title: "Connect Directly",
    description:
      "View seller information and contact them directly to arrange your purchase.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-900">
      {/* =========================
          NAVBAR
      ========================== */}
      <header className="absolute inset-x-0 top-0 z-50">
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-lg font-black text-white shadow-lg shadow-emerald-700/20">
                C
              </div>

              <div>
                <span className="block text-base font-bold tracking-tight text-slate-950">
                  Campus
                </span>
                <span className="block -mt-1 text-xs font-semibold text-emerald-700">
                  Marketplace
                </span>
              </div>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden items-center gap-8 md:flex">
              <a
                href="#how-it-works"
                className="text-sm font-medium text-slate-600 transition hover:text-emerald-700"
              >
                How it works
              </a>

              <a
                href="#categories"
                className="text-sm font-medium text-slate-600 transition hover:text-emerald-700"
              >
                Categories
              </a>

              <a
                href="#why-us"
                className="text-sm font-medium text-slate-600 transition hover:text-emerald-700"
              >
                Why us
              </a>
            </div>

            {/* Auth buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/login"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:px-4"
              >
                Sign in
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 sm:px-5"
              >
                Get started
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* =========================
          HERO
      ========================== */}
      <main>
        <section className="relative overflow-hidden bg-slate-50">
          {/* Decorative background */}
          <div className="absolute -left-32 top-24 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-emerald-100/60 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-6 sm:pb-20 sm:pt-36 lg:px-8 lg:pb-24 lg:pt-44">
            <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
              {/* Hero text */}
              <div className="max-w-2xl">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Built for your campus community
                </div>

                <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                  Your campus.
                  <span className="block text-emerald-700">
                    Your marketplace.
                  </span>
                </h1>

                <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                  Discover products and services from people around your campus,
                  or create your own listing and reach the community that
                  matters.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-700/20 transition hover:-translate-y-0.5 hover:bg-emerald-800"
                  >
                    Start selling
                    <span className="ml-2">→</span>
                  </Link>

                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700"
                  >
                    Explore marketplace
                  </Link>
                </div>

                {/* Trust indicators */}
                <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600">✓</span>
                    Campus-focused
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600">✓</span>
                    Easy listings
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600">✓</span>
                    Direct contact
                  </div>
                </div>
              </div>

              {/* Hero visual */}
              <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
                <div className="relative rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/10 sm:p-6">
                  {/* Fake marketplace header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        CAMPUS MARKETPLACE
                      </p>
                      <h3 className="mt-1 text-lg font-bold text-slate-900">
                        Discover something useful
                      </h3>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                      🔎
                    </div>
                  </div>

                  {/* Search */}
                  <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <span>⌕</span>
                      Search products and services...
                    </div>
                  </div>

                  {/* Product cards */}
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                      <div className="flex h-28 items-center justify-center bg-emerald-50 text-4xl">
                        💻
                      </div>

                      <div className="p-3">
                        <p className="truncate text-sm font-bold text-slate-800">
                          Laptop
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Electronics
                        </p>
                        <p className="mt-2 font-bold text-emerald-700">
                          ₦250,000
                        </p>
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                      <div className="flex h-28 items-center justify-center bg-amber-50 text-4xl">
                        📚
                      </div>

                      <div className="p-3">
                        <p className="truncate text-sm font-bold text-slate-800">
                          Study Books
                        </p>
                        <p className="mt-1 text-xs text-slate-400">Books</p>
                        <p className="mt-2 font-bold text-emerald-700">
                          ₦8,500
                        </p>
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                      <div className="flex h-28 items-center justify-center bg-blue-50 text-4xl">
                        👟
                      </div>

                      <div className="p-3">
                        <p className="truncate text-sm font-bold text-slate-800">
                          Sneakers
                        </p>
                        <p className="mt-1 text-xs text-slate-400">Fashion</p>
                        <p className="mt-2 font-bold text-emerald-700">
                          ₦35,000
                        </p>
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                      <div className="flex h-28 items-center justify-center bg-purple-50 text-4xl">
                        🛠️
                      </div>

                      <div className="p-3">
                        <p className="truncate text-sm font-bold text-slate-800">
                          Graphic Design
                        </p>
                        <p className="mt-1 text-xs text-slate-400">Services</p>
                        <p className="mt-2 font-bold text-emerald-700">
                          From ₦5,000
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Floating notification */}
                  <div className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-slate-100 bg-white p-3 shadow-xl sm:block">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm">
                        ✓
                      </div>

                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          New listing
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Just added to campus
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative circle */}
                <div className="absolute -right-5 -top-5 -z-10 h-24 w-24 rounded-full border-8 border-emerald-100 sm:-right-8 sm:-top-8 sm:h-32 sm:w-32" />
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            STATS
        ========================== */}
        <section className="border-y border-slate-100 bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-100 sm:grid-cols-4">
            <div className="px-4 py-7 text-center sm:py-9">
              <p className="text-2xl font-black text-slate-900 sm:text-3xl">
                1
              </p>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Central marketplace
              </p>
            </div>

            <div className="px-4 py-7 text-center sm:py-9">
              <p className="text-2xl font-black text-slate-900 sm:text-3xl">
                6+
              </p>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Product categories
              </p>
            </div>

            <div className="border-t border-slate-100 px-4 py-7 text-center sm:border-t-0 sm:py-9">
              <p className="text-2xl font-black text-slate-900 sm:text-3xl">
                24/7
              </p>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Access to listings
              </p>
            </div>

            <div className="border-t border-slate-100 px-4 py-7 text-center sm:border-t-0 sm:py-9">
              <p className="text-2xl font-black text-slate-900 sm:text-3xl">
                1:1
              </p>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Buyer-seller contact
              </p>
            </div>
          </div>
        </section>

        {/* =========================
            BENEFITS / HOW IT WORKS
        ========================== */}
        <section
          id="how-it-works"
          className="bg-white px-5 py-20 sm:px-6 sm:py-24 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-wider text-emerald-700">
                Simple by design
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Everything you need to trade on campus.
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-600">
                Campus Marketplace brings discovery, selling and direct
                communication together in one organized platform.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {benefits.map((benefit) => (
                <div
                  key={benefit.number}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-emerald-200 hover:bg-emerald-50/40 hover:shadow-lg hover:shadow-slate-900/5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-emerald-700">
                      {benefit.number}
                    </span>

                    <span className="text-2xl text-emerald-600">→</span>
                  </div>

                  <h3 className="mt-10 text-xl font-bold text-slate-900">
                    {benefit.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================
            CATEGORIES
        ========================== */}
        <section
          id="categories"
          className="bg-slate-50 px-5 py-20 sm:px-6 sm:py-24 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div className="max-w-2xl">
                <p className="text-sm font-bold uppercase tracking-wider text-emerald-700">
                  Browse categories
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  Find what you need faster.
                </h2>
              </div>

              <p className="max-w-sm text-sm leading-6 text-slate-500">
                From study materials to electronics and services, keep campus
                buying and selling organized.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-slate-900/5 sm:p-5"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl transition group-hover:bg-emerald-100">
                    {category.icon}
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-slate-900">
                    {category.name}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {category.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================
            WHY US
        ========================== */}
        <section id="why-us" className="px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-24">
            {/* Visual */}
            <div className="relative">
              <div className="rounded-3xl bg-emerald-700 p-6 shadow-2xl shadow-emerald-900/10 sm:p-8">
                <div className="rounded-2xl bg-white p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-400">
                        YOUR LISTING
                      </p>

                      <h3 className="mt-1 font-bold text-slate-900">
                        Sell something today
                      </h3>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                      +
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <div className="flex justify-between">
                        <span className="text-xs text-slate-400">
                          Product name
                        </span>

                        <span className="text-xs font-semibold text-emerald-700">
                          Required
                        </span>
                      </div>

                      <p className="mt-2 text-sm font-semibold text-slate-800">
                        Enter your product
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <span className="text-xs text-slate-400">Category</span>

                      <p className="mt-2 text-sm font-semibold text-slate-800">
                        Select a category
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-slate-50 p-4">
                        <span className="text-xs text-slate-400">Price</span>

                        <p className="mt-2 text-sm font-semibold text-slate-800">
                          ₦0.00
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-4">
                        <span className="text-xs text-slate-400">
                          Condition
                        </span>

                        <p className="mt-2 text-sm font-semibold text-slate-800">
                          New / Used
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 -right-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl sm:-right-6">
                <p className="text-xs text-slate-400">Simple</p>
                <p className="mt-1 font-bold text-slate-900">
                  Create. List. Connect.
                </p>
              </div>
            </div>

            {/* Text */}
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-emerald-700">
                Built around campus life
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Stop searching through scattered messages.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600">
                A campus marketplace gives buyers and sellers one organized
                place to discover products, manage listings and connect
                directly.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                    ✓
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Organized listings
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Browse products through categories instead of searching
                      through unrelated messages.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                    ✓
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Search and filtering
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Find relevant products and services quickly using search
                      and categories.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                    ✓
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Direct buyer-seller contact
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Access seller information and arrange purchases directly
                      between members.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            CTA
        ========================== */}
        <section className="px-5 pb-20 sm:px-6 sm:pb-24 lg:px-8">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-emerald-700 px-6 py-14 text-center shadow-2xl shadow-emerald-900/10 sm:px-10 sm:py-16">
            <p className="text-sm font-bold uppercase tracking-wider text-emerald-200">
              Ready to get started?
            </p>

            <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-black tracking-tight text-white sm:text-4xl">
              Make buying and selling on campus simpler.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-emerald-100 sm:text-base">
              Create your account and become part of your campus marketplace
              community.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/register"
                className="rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
              >
                Create an account
              </Link>

              <Link
                to="/login"
                className="rounded-xl border border-emerald-500 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-800"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* =========================
          FOOTER
      ========================== */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="font-bold text-slate-900">Campus Marketplace</p>
            <p className="mt-1 text-xs text-slate-500">
              A centralized marketplace for the campus community.
            </p>
          </div>

          <div className="flex items-center gap-5 text-sm text-slate-500">
            <Link to="/login" className="transition hover:text-emerald-700">
              Sign in
            </Link>

            <Link to="/register" className="transition hover:text-emerald-700">
              Register
            </Link>
          </div>

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Campus Marketplace
          </p>
        </div>
      </footer>
    </div>
  );
}
