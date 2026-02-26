// app/routes/login.jsx

export default function Login() {
  return (
    <div className="bg-slate-100 min-h-screen flex flex-col items-center justify-center p-4">
      {/* Logo & Title */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="bg-indigo-100 p-4 rounded-2xl">
            <svg
              className="w-8 h-8 text-indigo-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
        </div>
        <h1 className="text-slate-900 text-3xl font-bold mb-1">Todo</h1>
        <p className="text-slate-500 text-sm">
          Welcome back! Please enter your details.
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-[440px] bg-white shadow-sm rounded-2xl border border-slate-200 p-8 space-y-5">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-800">Email</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </span>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full pl-10 pr-4 h-12 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-800">
              Password
            </label>
            <a
              href="/forgot-password"
              className="text-sm text-indigo-600 hover:underline underline-offset-4"
            >
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </span>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full pl-10 pr-4 h-12 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Sign In */}
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-12 rounded-xl transition-all active:scale-[0.98]">
          Sign In
        </button>

        {/* Divider */}
        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-400 tracking-widest">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google */}
        <button className="w-full flex items-center justify-center gap-3 h-12 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-700 text-sm font-medium">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </button>
      </div>

      {/* Sign up link */}
      <p className="mt-6 text-sm text-slate-600">
        Don't have an account?{" "}
        <a
          href="/register"
          className="text-indigo-600 font-semibold hover:underline underline-offset-4"
        >
          Create an account
        </a>
      </p>

      {/* Footer */}
      <div className="mt-auto pt-12 pb-6 text-center border-t border-slate-200 w-full">
        <p className="text-xs text-slate-400 mb-3">
          © 2024 Todo Inc. All rights reserved.
        </p>
        <div className="flex justify-center gap-6 text-xs text-slate-500">
          <a href="/terms" className="hover:underline">
            Terms of Service
          </a>
          <a href="/privacy" className="hover:underline">
            Privacy Policy
          </a>
          <a href="/cookies" className="hover:underline">
            Cookie Policy
          </a>
        </div>
      </div>
    </div>
  );
}
