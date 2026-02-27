import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Ban, X } from 'lucide-react';

/**
 * incidentType: "WARNING" | "BLOCKED" | "BANNED"
 * attemptCount: number
 * message: string from backend
 * onDismiss: () => void  (only shown for WARNING)
 */
export default function SecurityWarningBanner({ incidentType, attemptCount, message, onDismiss }) {
  if (!incidentType) return null;

  const isBanned  = incidentType === 'BANNED'  || incidentType === 'BLOCKED';
  const isWarning = incidentType === 'WARNING';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0,   scale: 1     }}
        exit={{    opacity: 0, y: -12, scale: 0.98  }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`relative rounded-2xl border p-5 mb-6
          ${isBanned
            ? 'bg-red-950/60 border-red-700 shadow-lg shadow-red-900/30'
            : 'bg-amber-950/50 border-amber-600 shadow-lg shadow-amber-900/20'}`}
      >
        <div className="flex items-start gap-4">

          {/* Icon */}
          <div className={`shrink-0 rounded-xl p-2.5
            ${isBanned ? 'bg-red-700/40' : 'bg-amber-600/30'}`}>
            {isBanned
              ? <Ban      className="w-6 h-6 text-red-400" />
              : <ShieldAlert className="w-6 h-6 text-amber-400" />
            }
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className={`font-bold text-sm mb-1
              ${isBanned ? 'text-red-300' : 'text-amber-300'}`}>
              {isBanned
                ? '🚫 Account Suspended'
                : `⚠️ Security Warning — Attempt ${attemptCount} of 3`}
            </p>
            <p className={`text-sm leading-relaxed
              ${isBanned ? 'text-red-400' : 'text-amber-400/90'}`}>
              {message}
            </p>

            {/* Attempt progress bar (warning only) */}
            {isWarning && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-amber-500/70">Violation count</span>
                  <span className="text-xs font-bold text-amber-400">{attemptCount} / 3</span>
                </div>
                <div className="h-1.5 bg-amber-900/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(attemptCount / 3) * 100}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className={`h-full rounded-full
                      ${attemptCount >= 2 ? 'bg-red-500' : 'bg-amber-500'}`}
                  />
                </div>
                <p className="text-xs text-amber-600/70 mt-1.5">
                  {3 - attemptCount} more violation{3 - attemptCount !== 1 ? 's' : ''} will result in account suspension.
                </p>
              </div>
            )}

            {/* Ban: contact support link */}
            {isBanned && (
              <p className="text-xs text-red-500/80 mt-2">
                If you believe this is a mistake, please contact{' '}
                <a href="mailto:support@hardwareai.org"
                  className="text-red-400 underline hover:text-red-300 transition">
                  support@hardwareai.org
                </a>
              </p>
            )}
          </div>

          {/* Dismiss (warning only) */}
          {isWarning && onDismiss && (
            <button
              onClick={onDismiss}
              className="shrink-0 text-amber-600 hover:text-amber-400 transition mt-0.5"
              aria-label="Dismiss warning"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}