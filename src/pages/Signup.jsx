export default function Signup() {
  return (
    <section className="mx-auto flex min-h-screen max-w-md items-center px-4 pb-32">
      <div className="w-full rounded-[35px] border border-white/5 bg-black/40 p-6">
        <h1 className="text-center text-4xl font-black text-lime-300">
          Signup
        </h1>

        <div className="mt-8 space-y-4">
          <input
            placeholder="Full Name"
            className="w-full rounded-2xl border border-white/5 bg-black/50 p-4 outline-none"
          />

          <input
            placeholder="Email"
            className="w-full rounded-2xl border border-white/5 bg-black/50 p-4 outline-none"
          />

          <input
            placeholder="Password"
            type="password"
            className="w-full rounded-2xl border border-white/5 bg-black/50 p-4 outline-none"
          />

          <button className="w-full rounded-full bg-lime-400 py-4 font-black text-black">
            CREATE ACCOUNT
          </button>
        </div>
      </div>
    </section>
  );
}