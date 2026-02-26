// app/routes/register.jsx

export default function Register() {
  return (
    <div className="bg-slate-100 min-h-screen flex flex-col items-center justify-center p-4">
      {/* Card */}
      <div className="w-full max-w-[440px] bg-white shadow-xl rounded-xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="pt-8 px-8 pb-6 text-center">
          <h1 className="text-slate-900 text-3xl font-bold tracking-tight mb-2">
            Create your account
          </h1>
          <p className="text-slate-500 text-sm">
            Join us to start organizing your daily tasks efficiently.
          </p>
        </div>

        {/* Form */}
        <div className="px-8 pb-8 space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-4 h-11 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full px-4 h-11 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 h-11 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5 pb-2">
            <label className="text-sm font-medium text-slate-700">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 h-11 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Submit */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11 rounded-lg transition-all active:scale-[0.98]">
            Create Account
          </button>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 h-11 px-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 text-sm font-medium">
              Google
            </button>
            <button className="flex items-center justify-center gap-2 h-11 px-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 text-sm font-medium">
              GitHub
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="py-6 bg-slate-50 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 font-semibold hover:underline underline-offset-4"
            >
              Sign in instead
            </a>
          </p>
        </div>
      </div>

      {/* Legal */}
      <div className="mt-8 text-center text-xs text-slate-500 max-w-xs leading-relaxed">
        By creating an account, you agree to our{" "}
        <a href="/terms" className="underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy" className="underline">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}
