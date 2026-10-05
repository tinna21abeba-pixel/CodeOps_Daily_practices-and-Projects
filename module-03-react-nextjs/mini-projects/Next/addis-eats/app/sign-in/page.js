import { getSession, sanitizeNextUrl } from "../lib/session";
import { signIn, signOut } from "../actions/auth";

export const dynamic = "force-dynamic";

export default async function SignInPage({ searchParams }) {
  const params = await searchParams;
  const rawNext = params?.next || "/orders/mine";
  const safeNext = sanitizeNextUrl(rawNext);
  const session = await getSession();

  return (
    <div className="max-w-md mx-auto py-12 px-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-amber-500">Sign In</h1>
          <p className="text-xs text-zinc-400 mt-2">
            Target destination: <span className="font-mono text-amber-400">{safeNext}</span>
          </p>
        </div>

        {session?.user ? (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center space-y-3">
            <p className="text-sm text-zinc-200">
              Signed in as <span className="font-bold text-white">{session.user.name}</span>
            </p>
            <p className="text-xs text-zinc-400">
              ID: <span className="font-mono">{session.user.id}</span> | Role: <span className="font-mono uppercase text-amber-400">{session.user.role}</span>
            </p>
            <form action={signOut}>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium rounded-lg transition"
              >
                Sign Out
              </button>
            </form>
          </div>
        ) : null}

        <div className="space-y-3">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Choose an account
          </p>

          <form action={signIn}>
            <input type="hidden" name="next" value={safeNext} />
            <input type="hidden" name="accountId" value="user-1" />
            <button
              type="submit"
              className="w-full text-left p-4 bg-zinc-950 border border-zinc-800 hover:border-amber-500 hover:bg-zinc-800/50 rounded-xl transition flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-white">Tehesh</p>
                <p className="text-xs text-zinc-400">ID: user-1 | Role: customer</p>
              </div>
              <span className="text-xs font-semibold text-amber-400">Sign in</span>
            </button>
          </form>

          <form action={signIn}>
            <input type="hidden" name="next" value={safeNext} />
            <input type="hidden" name="accountId" value="user-2" />
            <button
              type="submit"
              className="w-full text-left p-4 bg-zinc-950 border border-zinc-800 hover:border-amber-500 hover:bg-zinc-800/50 rounded-xl transition flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-white">Abebe</p>
                <p className="text-xs text-zinc-400">ID: user-2 | Role: customer</p>
              </div>
              <span className="text-xs font-semibold text-amber-400">Sign in</span>
            </button>
          </form>

          <form action={signIn}>
            <input type="hidden" name="next" value={safeNext} />
            <input type="hidden" name="accountId" value="staff-1" />
            <button
              type="submit"
              className="w-full text-left p-4 bg-zinc-950 border border-zinc-800 hover:border-amber-500 hover:bg-zinc-800/50 rounded-xl transition flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-white">Chef Sara</p>
                <p className="text-xs text-zinc-400">ID: staff-1 | Role: staff</p>
              </div>
              <span className="text-xs font-semibold text-amber-400">Sign in</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
