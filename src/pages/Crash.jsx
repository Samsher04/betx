import { FaRocket, FaPlay } from "react-icons/fa";

export default function Crash() {
  return (
    <section className="mx-auto max-w-md px-4 pb-32 pt-6">
      <div className="rounded-[35px] border border-lime-400/10 bg-black/50 p-5">
        <div className="text-center">
          <p className="text-sm text-white/50">Crash Multiplier</p>

          <h1 className="mt-5 text-7xl font-black text-lime-300">
            12.45x
          </h1>

          <div className="mt-10 flex justify-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-lime-400/20 text-5xl text-lime-300">
              <FaRocket />
            </div>
          </div>

          <button className="mt-10 flex w-full items-center justify-center gap-3 rounded-full bg-lime-400 py-4 font-black text-black">
            <FaPlay />
            PLAY NOW
          </button>
        </div>
      </div>
    </section>
  );
}