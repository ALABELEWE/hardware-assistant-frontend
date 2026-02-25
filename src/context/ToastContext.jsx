import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

const icons = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  error:   <XCircle    className="w-5 h-5 text-red-500"   />,
  info:    <Info       className="w-5 h-5 text-blue-500"  />,
};

const colors = {
  success: 'border-green-200 dark:border-green-800',
  error:   'border-red-200   dark:border-red-800',
  info:    'border-blue-200  dark:border-blue-800',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);

  const remove = (id) => setToasts(t => t.filter(x => x.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              exit={{    opacity: 0, y: 20, scale: 0.95 }}
              className={`flex items-center gap-3 bg-white dark:bg-gray-900 
                border ${colors[t.type]} rounded-xl shadow-lg px-4 py-3 
                min-w-72 max-w-sm`}
            >
              {icons[t.type]}
              <span className="text-sm text-gray-700 dark:text-gray-200 flex-1">
                {t.message}
              </span>
              <button onClick={() => remove(t.id)}>
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);