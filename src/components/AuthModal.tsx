import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, User, AlertCircle, CheckCircle, Shield, ArrowRight, KeyRound, HelpCircle } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    authModalMode, 
    closeAuthModal, 
    signInWithGoogle, 
    signInWithEmail, 
    signUpWithEmail,
    sendResetEmail,
    signInAsDemo
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>(authModalMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [showConsoleHelp, setShowConsoleHelp] = useState(false);

  React.useEffect(() => {
    setMode(authModalMode);
    setError(null);
    setErrorCode(null);
    setSuccessMessage(null);
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrorCode(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!displayName.trim()) {
          setError('Please enter your full name');
          setLoading(false);
          return;
        }
        await signUpWithEmail(email, password, displayName);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err: any) {
      const code = err?.code || '';
      const msg = (err?.message || '').toLowerCase();
      const name = err?.name || '';
      const isAborted = 
        code === 'auth/popup-closed-by-user' || 
        code === 'auth/cancelled-popup-request' || 
        name === 'AbortError' || 
        msg.includes('aborted a request') ||
        msg.includes('user aborted');

      if (isAborted) {
        return;
      }

      setErrorCode(code);

      if (code === 'auth/operation-not-allowed') {
        setError('Firebase Email/Password provider is currently disabled in your Firebase Console. You can use the Quick Demo Logins below or enable Email/Password in Firebase Console.');
        setShowConsoleHelp(true);
      } else if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please verify your credentials, or create an account if you have not registered yet.');
      } else if (code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. You can sign in directly.');
      } else if (code === 'auth/weak-password') {
        setError('Password should be at least 6 characters long.');
      } else if (code === 'auth/too-many-requests') {
        setError('Access temporarily blocked due to multiple failed attempts. Please reset your password or try again in a few minutes.');
      } else {
        setError(err?.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError(null);
    setSuccessMessage(null);
    if (!email || !email.trim()) {
      setError('Please enter your email address in the field above to reset your password.');
      return;
    }

    setResettingPassword(true);
    try {
      await sendResetEmail(email.trim());
      setSuccessMessage(`Password reset link sent to ${email.trim()}. Please check your inbox.`);
    } catch (err: any) {
      const msg = (err?.message || '').toLowerCase();
      if (err?.name === 'AbortError' || msg.includes('aborted a request')) {
        return;
      }
      if (err?.code === 'auth/user-not-found') {
        setError('No account found with this email address. Please create an account instead.');
      } else {
        setError(err?.message || 'Failed to send password reset email. Please try again.');
      }
    } finally {
      setResettingPassword(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setErrorCode(null);
    setSuccessMessage(null);
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      const code = err?.code || '';
      const msg = (err?.message || '').toLowerCase();
      const name = err?.name || '';
      const isAborted = 
        code === 'auth/popup-closed-by-user' || 
        code === 'auth/cancelled-popup-request' || 
        name === 'AbortError' || 
        msg.includes('aborted a request') ||
        msg.includes('user aborted');

      if (isAborted) {
        // User closed or cancelled the popup - no error needed
        return;
      }

      if (code === 'auth/operation-not-allowed') {
        setError('Google Sign-In is not enabled in Firebase Console. Please use Quick Demo Login or enable Google in Firebase Console.');
        setShowConsoleHelp(true);
      } else if (code === 'auth/popup-blocked') {
        setError('Popup was blocked by the browser. Please use the quick demo logins or allow popups.');
      } else {
        setError(err?.message || 'Google sign in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#0c2340] text-white font-bold text-lg mb-3 shadow-xs">
            H
          </div>
          <h3 className="text-2xl font-extrabold text-[#0c2340] tracking-tight">
            {mode === 'signin' ? 'Welcome Back' : 'Join HomeLuxe'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {mode === 'signin' 
              ? 'Sign in to manage listings, save favorites, and book viewings.' 
              : 'Create an account to list properties and schedule viewings.'}
          </p>
        </div>

        {/* Quick Demo Access Bar */}
        <div className="mb-5 bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              Instant 1-Click Access (No Password Needed)
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => signInAsDemo('agent')}
              className="px-3 py-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition-all cursor-pointer group"
            >
              <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700 flex items-center gap-1">
                <span>Agent Demo</span>
                <span className="text-[9px] bg-blue-100 text-blue-800 px-1 py-0.2 rounded">Listings</span>
              </div>
              <div className="text-[10px] text-slate-500 truncate">David Sterling</div>
            </button>
            <button
              type="button"
              onClick={() => signInAsDemo('buyer')}
              className="px-3 py-2 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-left transition-all cursor-pointer group"
            >
              <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 flex items-center gap-1">
                <span>Buyer Demo</span>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded">Bookings</span>
              </div>
              <div className="text-[10px] text-slate-500 truncate">Sarah Connor</div>
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 flex items-start gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span className="leading-relaxed font-medium">{successMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 text-red-700 text-xs border border-red-100 animate-in fade-in space-y-2.5">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span className="leading-relaxed font-medium">{error}</span>
            </div>
            
            {/* Quick Action when email is already registered during Sign Up */}
            {errorCode === 'auth/email-already-in-use' && (
              <div className="pt-2 border-t border-red-200/60 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setError(null);
                    setErrorCode(null);
                  }}
                  className="px-3 py-1.5 bg-[#0c2340] hover:bg-[#16355d] text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>Sign in with this email</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={resettingPassword}
                  className="text-xs text-slate-700 hover:text-blue-700 underline font-medium cursor-pointer"
                >
                  {resettingPassword ? 'Sending...' : 'Reset password?'}
                </button>
              </div>
            )}

            {/* Quick Action when credential is invalid during Sign In */}
            {(errorCode === 'auth/invalid-credential' || errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found') && (
              <div className="pt-2 border-t border-red-200/60 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                    setErrorCode(null);
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>Create account instead</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={resettingPassword}
                  className="text-xs text-slate-700 hover:text-blue-700 underline font-medium cursor-pointer"
                >
                  {resettingPassword ? 'Sending...' : 'Forgot password?'}
                </button>
              </div>
            )}

            {/* Fallback instant guest session button */}
            <div className="pt-2 border-t border-red-200/60 flex items-center justify-between">
              <button
                type="button"
                onClick={() => signInAsDemo('buyer')}
                className="font-bold text-blue-700 hover:underline cursor-pointer"
              >
                Sign in with Instant Guest Session →
              </button>
              <button
                type="button"
                onClick={() => setShowConsoleHelp(!showConsoleHelp)}
                className="text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Need help?</span>
              </button>
            </div>
          </div>
        )}

        {/* Firebase Console Helper Banner */}
        {showConsoleHelp && (
          <div className="mb-5 p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 space-y-1.5 animate-in fade-in">
            <div className="font-bold text-blue-950 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
              <span>How to enable Firebase Authentication:</span>
            </div>
            <ol className="list-decimal list-inside text-blue-800 space-y-1 pl-1">
              <li>Open your project in the <strong className="font-semibold">Firebase Console</strong></li>
              <li>Navigate to <strong className="font-semibold">Build &gt; Authentication &gt; Sign-in method</strong></li>
              <li>Click on <strong className="font-semibold">Email/Password</strong> and toggle <strong className="font-semibold">Enable</strong></li>
              <li>Click <strong className="font-semibold">Save</strong></li>
            </ol>
            <p className="text-[10px] text-blue-600 pt-1">
              Until enabled, you can use the instant Demo buttons above to test all features immediately!
            </p>
          </div>
        )}

        {/* Google Sign-in Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          type="button"
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-700 shadow-2xs hover:shadow transition-all cursor-pointer disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative my-5 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <span className="relative bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            or with email and password
          </span>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Password
              </label>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={resettingPassword}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>{resettingPassword ? 'Sending...' : 'Forgot password?'}</span>
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#0c2340] hover:bg-[#16355d] text-white py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Processing...' : (mode === 'signin' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        {/* Mode Toggle Switch */}
        <div className="mt-5 text-center text-xs text-slate-500">
          {mode === 'signin' ? (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-blue-700 font-bold hover:underline cursor-pointer ml-1"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-blue-700 font-bold hover:underline cursor-pointer ml-1"
              >
                Sign In
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
