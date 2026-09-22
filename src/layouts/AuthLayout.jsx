export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col lg:flex-row">
        {/* Branding section */}
        <section className="hidden bg-emerald-700 p-10 text-white lg:flex lg:w-1/2 lg:flex-col lg:justify-between">
          <div>
            <div className="mb-10">
              <h1 className="text-3xl font-bold">Campus Marketplace</h1>
              <p className="mt-2 text-emerald-100">
                Your campus marketplace, all in one place.
              </p>
            </div>

            <div className="max-w-md">
              <h2 className="text-4xl font-bold leading-tight">
                Buy and sell within your campus community.
              </h2>

              <p className="mt-6 text-lg leading-8 text-emerald-100">
                Discover products and services from members of your campus
                community through one organized marketplace.
              </p>
            </div>
          </div>

          <p className="text-sm text-emerald-100">
            Campus-Based Marketplace System
          </p>
        </section>

        {/* Form section */}
        <section className="flex min-h-screen w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-1/2 lg:px-12">
          <div className="w-full max-w-md">{children}</div>
        </section>
      </div>
    </div>
  );
}
