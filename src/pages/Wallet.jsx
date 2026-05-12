export default function Wallet() {
  return (
    <section className="mx-auto max-w-md px-4 pb-32 pt-6">
      <div className="rounded-[35px] bg-gradient-to-br from-lime-400 to-green-700 p-6 text-black">
        <p className="text-sm font-semibold">Total Balance</p>

        <h1 className="mt-2 text-5xl font-black">₹24,580</h1>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button className="rounded-2xl bg-black py-4 font-black text-lime-300">
            Deposit
          </button>

          <button className="rounded-2xl bg-black py-4 font-black text-lime-300">
            Withdraw
          </button>
        </div>
      </div>
    </section>
  );
}