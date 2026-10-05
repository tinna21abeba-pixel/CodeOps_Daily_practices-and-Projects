import { getSession } from "@/app/lib/session";
import { signIn, signOut } from "@/app/actions/auth";

export const dynamic = "force-dynamic";

export default async function SignInPage({ searchParams }) {
  const params = await searchParams;
  const nextDestination = params?.next || "/orders";
  const session = await getSession();

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-900">Sign In</h1>
          <p className="text-xs text-stone-500 mt-1">
            Destination after login: <span className="font-mono text-orange-600">{nextDestination}</span>
          </p>
        </div>

        {session?.user ? (
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-center space-y-3">
            <p className="text-sm text-stone-700">
              Signed in as <span className="font-bold text-stone-900">{session.user.name}</span>
            </p>
            <p className="text-xs text-stone-500">
              ID: <span className="font-mono">{session.user.id}</span> | Role: <span className="font-mono font-semibold uppercase">{session.user.role}</span>
            </p>
            <form action={signOut}>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-stone-200 hover:bg-stone-300 text-stone-800 text-sm font-medium rounded-lg transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </form>
          </div>
        ) : null}

        <div className="space-y-3">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Select Account
          </p>

          <form action={signIn} className="space-y-3">
            <input type="hidden" name="next" value={nextDestination} />
            <input type="hidden" name="accountId" value="user-1" />
            <button
              type="submit"
              className="w-full text-left p-3.5 border border-stone-200 hover:border-orange-400 hover:bg-orange-50/40 rounded-xl transition-all flex items-center justify-between cursor-pointer"
            >
              <div>
                <p className="text-sm font-semibold text-stone-900">Tehesh</p>
                <p className="text-xs text-stone-500">ID: user-1 | Role: customer</p>
              </div>
              <span className="text-xs font-semibold text-orange-600">Sign in</span>
            </button>
          </form>

          <form action={signIn} className="space-y-3">
            <input type="hidden" name="next" value={nextDestination} />
            <input type="hidden" name="accountId" value="user-2" />
            <button
              type="submit"
              className="w-full text-left p-3.5 border border-stone-200 hover:border-orange-400 hover:bg-orange-50/40 rounded-xl transition-all flex items-center justify-between cursor-pointer"
            >
              <div>
                <p className="text-sm font-semibold text-stone-900">Abebe</p>
                <p className="text-xs text-stone-500">ID: user-2 | Role: customer</p>
              </div>
              <span className="text-xs font-semibold text-orange-600">Sign in</span>
            </button>
          </form>

          <form action={signIn} className="space-y-3">
            <input type="hidden" name="next" value={nextDestination} />
            <input type="hidden" name="accountId" value="staff-1" />
            <button
              type="submit"
              className="w-full text-left p-3.5 border border-stone-200 hover:border-orange-400 hover:bg-orange-50/40 rounded-xl transition-all flex items-center justify-between cursor-pointer"
            >
              <div>
                <p className="text-sm font-semibold text-stone-900">Chef Sara</p>
                <p className="text-xs text-stone-500">ID: staff-1 | Role: staff</p>
              </div>
              <span className="text-xs font-semibold text-orange-600">Sign in</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
