import { FaUserCircle } from "react-icons/fa";

export default function Profile() {
  return (
    <section className="mx-auto max-w-md px-4 pb-32 pt-6">
      <div className="rounded-[35px] border border-white/5 bg-black/40 p-6">
        <div className="flex flex-col items-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-lime-400/20 text-7xl text-lime-300">
            <FaUserCircle />
          </div>

          <h2 className="mt-5 text-3xl font-black text-lime-300">
            Rahul Gamer
          </h2>

          <p className="mt-1 text-sm text-white/40">
            Premium VIP Member
          </p>
        </div>
      </div>
    </section>
  );
}