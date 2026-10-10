import { CircleUserRound } from "lucide-react";

export function ProfileUnavailableView() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16 text-center" aria-labelledby="profile-title">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300">
        <CircleUserRound aria-hidden="true" size={28} />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">Account</p>
      <h1 id="profile-title" className="mt-3 text-2xl font-semibold text-white">Profile is not connected</h1>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
        PlayBeat sign-in and account services are not available yet. Your favorites and recently watched channels remain saved in this browser.
      </p>
    </section>
  );
}
