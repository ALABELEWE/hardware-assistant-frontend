import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Receipt, Package, BookOpen,
  Plus, Trash2, ChevronLeft, ChevronRight, X, Check, AlertCircle
} from 'lucide-react';
import { dataApi } from '../../api/data.api';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';

// ── Constants ─────────────────────────────────────────────────────────────────
const EXPENSE_CATEGORIES = [
  'Rent', 'Salary', 'Transport', 'Restocking', 'Utilities',
  'Marketing', 'Equipment', 'Maintenance', 'Miscellaneous',
];
const PAYMENT_METHODS = ['cash', 'transfer', 'pos', 'credit'];
const UNITS = ['piece', 'bag', 'kg', 'litre', 'metre', 'carton', 'pack', 'roll', 'dozen', 'set'];

const TODAY = new Date().toISOString().split('T')[0];

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) =>
  Number(n || 0).toLocaleString('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 });

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });

// ── Sub-components ────────────────────────────────────────────────────────────

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
      <AlertCircle className="w-3 h-3" /> {message}
    </p>
  );
}

function FormInput({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
        {label}
      </label>
      {children}
      <FieldError message={error} />
    </div>
  );
}

function inputCls(error) {
  return `w-full px-3 py-2.5 text-sm rounded-xl border transition bg-white dark:bg-gray-800 text-gray-800 dark:text-white
    ${error
      ? 'border-red-400 focus:ring-red-400'
      : 'border-gray-200 dark:border-gray-700 focus:border-brand-500 focus:ring-brand-500'}
    focus:outline-none focus:ring-2 focus:ring-opacity-30`;
}

function DeleteButton({ onConfirm, label = 'Delete' }) {
  const [confirm, setConfirm] = useState(false);
  return confirm ? (
    <div className="flex items-center gap-1">
      <button onClick={onConfirm}
        className="text-xs bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition">
        Yes, delete
      </button>
      <button onClick={() => setConfirm(false)}
        className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-lg transition">
        Cancel
      </button>
    </div>
  ) : (
    <button onClick={() => setConfirm(true)}
      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition"
      title={label}>
      <Trash2 className="w-4 h-4" />
    </button>
  );
}

function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-3 mt-4">
      <button onClick={() => onPage(page - 1)} disabled={page === 0}
        className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition">
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="text-sm text-gray-500">Page {page + 1} of {totalPages}</span>
      <button onClick={() => onPage(page + 1)} disabled={page >= totalPages - 1}
        className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function EmptyState({ icon: Icon, message }) {
  return (
    <div className="text-center py-14 text-gray-400">
      <Icon className="w-10 h-10 mx-auto mb-3 opacity-30" />
      <p className="font-medium">{message}</p>
      <p className="text-sm mt-1">Use the form above to add your first entry</p>
    </div>
  );
}

// ── SALES TAB ─────────────────────────────────────────────────────────────────
function SalesTab({ products }) {
  const { toast } = useToast();
  const [loading,  setLoading]  = useState(false);
  const [sales,    setSales]    = useState([]);
  const [page,     setPage]     = useState(0);
  const [total,    setTotal]    = useState(1);
  const [errors,   setErrors]   = useState({});

  const [form, setForm] = useState({
    productId: '', productName: '', quantity: '', unitPrice: '',
    costPrice: '', transactionDate: TODAY, paymentMethod: 'cash', notes: '',
  });

  const loadSales = useCallback(async (p = 0) => {
    try {
      const res = await dataApi.getSales(p);
      setSales(res.data.data.content || []);
      setTotal(res.data.data.totalPages || 1);
      setPage(p);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { loadSales(0); }, [loadSales]);

  const set = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: null }));

    // Auto-fill price from product catalogue
    if (field === 'productId' && val) {
      const p = products.find(p => p.id === val);
      if (p) {
        setForm(f => ({
          ...f,
          productId: val,
          unitPrice:  f.unitPrice  || (p.sellingPrice || ''),
          costPrice:  f.costPrice  || (p.costPrice    || ''),
        }));
      }
    }
  };

  const validate = () => {
    const e = {};
    if (!form.productId && !form.productName.trim()) e.product = 'Select a product or enter a name';
    if (!form.quantity || Number(form.quantity) <= 0)  e.quantity  = 'Enter a valid quantity';
    if (!form.unitPrice || Number(form.unitPrice) < 0) e.unitPrice = 'Enter a valid price';
    if (!form.transactionDate) e.transactionDate = 'Date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        productId:       form.productId   || null,
        productName:     form.productName || null,
        quantity:        Number(form.quantity),
        unitPrice:       Number(form.unitPrice),
        costPrice:       form.costPrice ? Number(form.costPrice) : null,
        transactionDate: form.transactionDate,
        paymentMethod:   form.paymentMethod,
        notes:           form.notes || null,
      };
      await dataApi.recordSale(payload);
      toast('Sale recorded successfully!', 'success');
      setForm({ productId: '', productName: '', quantity: '', unitPrice: '',
                costPrice: '', transactionDate: TODAY, paymentMethod: 'cash', notes: '' });
      loadSales(0);
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to record sale', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteSale = async (id) => {
    try {
      await dataApi.deleteSale(id);
      toast('Sale deleted', 'success');
      loadSales(page);
    } catch { toast('Failed to delete sale', 'error'); }
  };

  const selectedProduct = products.find(p => p.id === form.productId);
  const totalAmount = (Number(form.quantity) || 0) * (Number(form.unitPrice) || 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

      {/* Form */}
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-brand-500" /> Record Sale
          </h3>
          <form onSubmit={submit} className="flex flex-col gap-3">

            <FormInput label="Product" error={errors.product}>
              <select value={form.productId} onChange={e => set('productId', e.target.value)}
                className={inputCls(errors.product)}>
                <option value="">-- Select from catalogue --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.unit})</option>
                ))}
              </select>
              {!form.productId && (
                <input value={form.productName} onChange={e => set('productName', e.target.value)}
                  placeholder="Or type product name"
                  className={`${inputCls(errors.product)} mt-1.5`} />
              )}
            </FormInput>

            <div className="grid grid-cols-2 gap-3">
              <FormInput label="Quantity" error={errors.quantity}>
                <input type="number" step="0.01" min="0.01"
                  value={form.quantity} onChange={e => set('quantity', e.target.value)}
                  placeholder={selectedProduct ? `in ${selectedProduct.unit}` : '0'}
                  className={inputCls(errors.quantity)} />
              </FormInput>
              <FormInput label="Unit Price (₦)" error={errors.unitPrice}>
                <input type="number" step="0.01" min="0"
                  value={form.unitPrice} onChange={e => set('unitPrice', e.target.value)}
                  placeholder="0.00" className={inputCls(errors.unitPrice)} />
              </FormInput>
            </div>

            <FormInput label="Cost Price (₦) — optional">
              <input type="number" step="0.01" min="0"
                value={form.costPrice} onChange={e => set('costPrice', e.target.value)}
                placeholder="For profit calculation" className={inputCls()} />
            </FormInput>

            <div className="grid grid-cols-2 gap-3">
              <FormInput label="Date" error={errors.transactionDate}>
                <input type="date" max={TODAY}
                  value={form.transactionDate} onChange={e => set('transactionDate', e.target.value)}
                  className={inputCls(errors.transactionDate)} />
              </FormInput>
              <FormInput label="Payment">
                <select value={form.paymentMethod} onChange={e => set('paymentMethod', e.target.value)}
                  className={inputCls()}>
                  {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </FormInput>
            </div>

            {totalAmount > 0 && (
              <div className="bg-brand-50 dark:bg-brand-950 rounded-xl px-4 py-3 flex items-center justify-between">
                <span className="text-xs text-brand-600 dark:text-brand-400 font-medium">Total Amount</span>
                <span className="font-bold text-brand-700 dark:text-brand-300">{fmt(totalAmount)}</span>
              </div>
            )}

            <Button type="submit" disabled={loading} fullWidth>
              {loading ? 'Recording...' : 'Record Sale'}
            </Button>
          </form>
        </div>
      </div>

      {/* History */}
      <div className="lg:col-span-3">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Recent Sales</h3>
          {sales.length === 0
            ? <EmptyState icon={ShoppingCart} message="No sales recorded yet" />
            : <>
                <div className="flex flex-col gap-2">
                  {sales.map(s => (
                    <div key={s.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-800 dark:text-white truncate">{s.productName}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {s.quantity} × {fmt(s.unitPrice)} &nbsp;·&nbsp; {fmtDate(s.transactionDate)}
                          &nbsp;·&nbsp; <span className="capitalize">{s.paymentMethod}</span>
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-sm text-green-600 dark:text-green-400">{fmt(s.totalAmount)}</p>
                        <DeleteButton onConfirm={() => deleteSale(s.id)} label="Delete sale" />
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination page={page} totalPages={total} onPage={loadSales} />
              </>
          }
        </div>
      </div>
    </div>
  );
}

// ── EXPENSES TAB ──────────────────────────────────────────────────────────────
function ExpensesTab() {
  const { toast } = useToast();
  const [loading,  setLoading]  = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [page,     setPage]     = useState(0);
  const [total,    setTotal]    = useState(1);
  const [errors,   setErrors]   = useState({});

  const [form, setForm] = useState({
    category: '', description: '', amount: '',
    expenseDate: TODAY, paymentMethod: 'cash', notes: '',
  });

  const loadExpenses = useCallback(async (p = 0) => {
    try {
      const res = await dataApi.getExpenses(p);
      setExpenses(res.data.data.content || []);
      setTotal(res.data.data.totalPages || 1);
      setPage(p);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { loadExpenses(0); }, [loadExpenses]);

  const set = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.category)                           e.category    = 'Category is required';
    if (!form.amount || Number(form.amount) <= 0) e.amount      = 'Enter a valid amount';
    if (!form.expenseDate)                        e.expenseDate = 'Date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await dataApi.recordExpense({
        category:      form.category,
        description:   form.description || null,
        amount:        Number(form.amount),
        expenseDate:   form.expenseDate,
        paymentMethod: form.paymentMethod,
        notes:         form.notes || null,
      });
      toast('Expense recorded!', 'success');
      setForm({ category: '', description: '', amount: '', expenseDate: TODAY, paymentMethod: 'cash', notes: '' });
      loadExpenses(0);
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to record expense', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await dataApi.deleteExpense(id);
      toast('Expense deleted', 'success');
      loadExpenses(page);
    } catch { toast('Failed to delete', 'error'); }
  };

  const CATEGORY_COLORS = {
    Rent: 'bg-purple-100 text-purple-700', Salary: 'bg-blue-100 text-blue-700',
    Transport: 'bg-yellow-100 text-yellow-700', Restocking: 'bg-orange-100 text-orange-700',
    Utilities: 'bg-cyan-100 text-cyan-700', Marketing: 'bg-pink-100 text-pink-700',
    Equipment: 'bg-indigo-100 text-indigo-700', Maintenance: 'bg-red-100 text-red-700',
    Miscellaneous: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-red-500" /> Record Expense
          </h3>
          <form onSubmit={submit} className="flex flex-col gap-3">
            <FormInput label="Category" error={errors.category}>
              <select value={form.category} onChange={e => set('category', e.target.value)}
                className={inputCls(errors.category)}>
                <option value="">-- Select category --</option>
                {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormInput>

            <FormInput label="Description — optional">
              <input value={form.description} onChange={e => set('description', e.target.value)}
                placeholder="e.g. Monthly shop rent" className={inputCls()} />
            </FormInput>

            <div className="grid grid-cols-2 gap-3">
              <FormInput label="Amount (₦)" error={errors.amount}>
                <input type="number" step="0.01" min="0.01"
                  value={form.amount} onChange={e => set('amount', e.target.value)}
                  placeholder="0.00" className={inputCls(errors.amount)} />
              </FormInput>
              <FormInput label="Date" error={errors.expenseDate}>
                <input type="date" max={TODAY}
                  value={form.expenseDate} onChange={e => set('expenseDate', e.target.value)}
                  className={inputCls(errors.expenseDate)} />
              </FormInput>
            </div>

            <FormInput label="Payment Method">
              <select value={form.paymentMethod} onChange={e => set('paymentMethod', e.target.value)}
                className={inputCls()}>
                {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </FormInput>

            <Button type="submit" disabled={loading} fullWidth>
              {loading ? 'Recording...' : 'Record Expense'}
            </Button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-3">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Recent Expenses</h3>
          {expenses.length === 0
            ? <EmptyState icon={Receipt} message="No expenses recorded yet" />
            : <>
                <div className="flex flex-col gap-2">
                  {expenses.map(ex => (
                    <div key={ex.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 transition">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${CATEGORY_COLORS[ex.category] || 'bg-gray-100 text-gray-700'}`}>
                          {ex.category}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{ex.description || ex.category}</p>
                          <p className="text-xs text-gray-400">{fmtDate(ex.expenseDate)}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 flex items-center gap-2">
                        <p className="font-bold text-sm text-red-600 dark:text-red-400">{fmt(ex.amount)}</p>
                        <DeleteButton onConfirm={() => deleteExpense(ex.id)} />
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination page={page} totalPages={total} onPage={loadExpenses} />
              </>
          }
        </div>
      </div>
    </div>
  );
}

// ── INVENTORY TAB ─────────────────────────────────────────────────────────────
function InventoryTab({ products }) {
  const { toast } = useToast();
  const [loading,   setLoading]   = useState(false);
  const [snapshots, setSnapshots] = useState([]);
  const [page,      setPage]      = useState(0);
  const [total,     setTotal]     = useState(1);
  const [errors,    setErrors]    = useState({});

  const [form, setForm] = useState({
    productId: '', productName: '', quantityCounted: '',
    unitCost: '', snapshotDate: TODAY, notes: '',
  });

  const loadSnapshots = useCallback(async (p = 0) => {
    try {
      const res = await dataApi.getInventory(p);
      setSnapshots(res.data.data.content || []);
      setTotal(res.data.data.totalPages || 1);
      setPage(p);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { loadSnapshots(0); }, [loadSnapshots]);

  const set = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: null }));
    if (field === 'productId' && val) {
      const p = products.find(p => p.id === val);
      if (p) setForm(f => ({ ...f, productId: val, unitCost: f.unitCost || (p.costPrice || '') }));
    }
  };

  const validate = () => {
    const e = {};
    if (!form.productId && !form.productName.trim()) e.product = 'Select a product or enter a name';
    if (form.quantityCounted === '' || Number(form.quantityCounted) < 0) e.quantityCounted = 'Enter stock count (0 or more)';
    if (!form.snapshotDate) e.snapshotDate = 'Date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await dataApi.recordInventory({
        productId:      form.productId   || null,
        productName:    form.productName || null,
        quantityCounted: Number(form.quantityCounted),
        unitCost:       form.unitCost ? Number(form.unitCost) : null,
        snapshotDate:   form.snapshotDate,
        notes:          form.notes || null,
      });
      toast('Inventory count saved!', 'success');
      setForm({ productId: '', productName: '', quantityCounted: '', unitCost: '', snapshotDate: TODAY, notes: '' });
      loadSnapshots(0);
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to save inventory', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteSnapshot = async (id) => {
    try {
      await dataApi.deleteInventory(id);
      toast('Snapshot deleted', 'success');
      loadSnapshots(page);
    } catch { toast('Failed to delete', 'error'); }
  };

  const totalValue = (Number(form.quantityCounted) || 0) * (Number(form.unitCost) || 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-500" /> Count Inventory
          </h3>
          <form onSubmit={submit} className="flex flex-col gap-3">
            <FormInput label="Product" error={errors.product}>
              <select value={form.productId} onChange={e => set('productId', e.target.value)}
                className={inputCls(errors.product)}>
                <option value="">-- Select from catalogue --</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              {!form.productId && (
                <input value={form.productName} onChange={e => set('productName', e.target.value)}
                  placeholder="Or type product name"
                  className={`${inputCls(errors.product)} mt-1.5`} />
              )}
            </FormInput>

            <div className="grid grid-cols-2 gap-3">
              <FormInput label="Qty in Stock" error={errors.quantityCounted}>
                <input type="number" step="0.01" min="0"
                  value={form.quantityCounted} onChange={e => set('quantityCounted', e.target.value)}
                  placeholder="0" className={inputCls(errors.quantityCounted)} />
              </FormInput>
              <FormInput label="Unit Cost (₦)">
                <input type="number" step="0.01" min="0"
                  value={form.unitCost} onChange={e => set('unitCost', e.target.value)}
                  placeholder="Optional" className={inputCls()} />
              </FormInput>
            </div>

            <FormInput label="Date" error={errors.snapshotDate}>
              <input type="date" max={TODAY}
                value={form.snapshotDate} onChange={e => set('snapshotDate', e.target.value)}
                className={inputCls(errors.snapshotDate)} />
            </FormInput>

            {totalValue > 0 && (
              <div className="bg-blue-50 dark:bg-blue-950 rounded-xl px-4 py-3 flex items-center justify-between">
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Stock Value</span>
                <span className="font-bold text-blue-700 dark:text-blue-300">{fmt(totalValue)}</span>
              </div>
            )}

            <Button type="submit" disabled={loading} fullWidth>
              {loading ? 'Saving...' : 'Save Count'}
            </Button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-3">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Inventory History</h3>
          {snapshots.length === 0
            ? <EmptyState icon={Package} message="No inventory counts recorded yet" />
            : <>
                <div className="flex flex-col gap-2">
                  {snapshots.map(s => (
                    <div key={s.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-800 dark:text-white truncate">{s.productName}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {s.quantityCounted} units &nbsp;·&nbsp; {fmtDate(s.snapshotDate)}
                          {s.unitCost && <> &nbsp;·&nbsp; {fmt(s.unitCost)}/unit</>}
                        </p>
                      </div>
                      <div className="text-right shrink-0 flex items-center gap-2">
                        {s.totalValue > 0 && (
                          <p className="font-bold text-sm text-blue-600 dark:text-blue-400">{fmt(s.totalValue)}</p>
                        )}
                        <DeleteButton onConfirm={() => deleteSnapshot(s.id)} />
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination page={page} totalPages={total} onPage={loadSnapshots} />
              </>
          }
        </div>
      </div>
    </div>
  );
}

// ── PRODUCTS TAB ──────────────────────────────────────────────────────────────
function ProductsTab({ products, onProductsChange }) {
  const { toast } = useToast();
  const [loading, setLoading]   = useState(false);
  const [editing, setEditing]   = useState(null); // product id being edited
  const [errors,  setErrors]    = useState({});
  const [showForm, setShowForm] = useState(false);

  const blank = { name: '', category: '', unit: 'piece', costPrice: '', sellingPrice: '', currentStock: '', reorderLevel: '' };
  const [form, setForm] = useState(blank);

  const set = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Product name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const startEdit = (product) => {
    setEditing(product.id);
    setForm({
      name: product.name, category: product.category || '',
      unit: product.unit || 'piece',
      costPrice: product.costPrice || '', sellingPrice: product.sellingPrice || '',
      currentStock: product.currentStock || '', reorderLevel: product.reorderLevel || '',
    });
    setShowForm(true);
  };

  const cancelEdit = () => { setEditing(null); setForm(blank); setShowForm(false); };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(), category: form.category || null, unit: form.unit,
        costPrice:    form.costPrice    ? Number(form.costPrice)    : null,
        sellingPrice: form.sellingPrice ? Number(form.sellingPrice) : null,
        currentStock: form.currentStock ? Number(form.currentStock) : 0,
        reorderLevel: form.reorderLevel ? Number(form.reorderLevel) : 0,
      };
      if (editing) {
        await dataApi.updateProduct(editing, payload);
        toast('Product updated!', 'success');
      } else {
        await dataApi.createProduct(payload);
        toast('Product added to catalogue!', 'success');
      }
      cancelEdit();
      onProductsChange();
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to save product', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await dataApi.deleteProduct(id);
      toast('Product removed', 'success');
      onProductsChange();
    } catch { toast('Failed to remove product', 'error'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500">{products.filter(p => p.active).length} active products</p>
        </div>
        <Button onClick={() => { cancelEdit(); setShowForm(s => !s); }} size="sm">
          {showForm ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add Product</>}
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-brand-200 dark:border-brand-800 p-5 mb-4">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
              {editing ? 'Edit Product' : 'Add New Product'}
            </h3>
            <form onSubmit={submit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                <FormInput label="Product Name *" error={errors.name}>
                  <input value={form.name} onChange={e => set('name', e.target.value)}
                    placeholder="e.g. Dangote Cement 50kg" className={inputCls(errors.name)} />
                </FormInput>
                <FormInput label="Category">
                  <input value={form.category} onChange={e => set('category', e.target.value)}
                    placeholder="e.g. Cement, Electrical" className={inputCls()} />
                </FormInput>
                <FormInput label="Unit">
                  <select value={form.unit} onChange={e => set('unit', e.target.value)} className={inputCls()}>
                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </FormInput>
                <FormInput label="Cost Price (₦)">
                  <input type="number" step="0.01" min="0" value={form.costPrice}
                    onChange={e => set('costPrice', e.target.value)} placeholder="0.00" className={inputCls()} />
                </FormInput>
                <FormInput label="Selling Price (₦)">
                  <input type="number" step="0.01" min="0" value={form.sellingPrice}
                    onChange={e => set('sellingPrice', e.target.value)} placeholder="0.00" className={inputCls()} />
                </FormInput>
                <FormInput label="Current Stock">
                  <input type="number" step="0.01" min="0" value={form.currentStock}
                    onChange={e => set('currentStock', e.target.value)} placeholder="0" className={inputCls()} />
                </FormInput>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : editing ? 'Save Changes' : 'Add Product'}
                </Button>
                <button type="button" onClick={cancelEdit}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {products.length === 0
        ? <EmptyState icon={BookOpen} message="Your product catalogue is empty" />
        : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {products.map(p => (
              <div key={p.id} className={`bg-white dark:bg-gray-900 rounded-xl border p-4 transition
                ${!p.active ? 'opacity-50 border-gray-100 dark:border-gray-800' : 'border-gray-100 dark:border-gray-800 hover:border-brand-200'}`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-800 dark:text-white truncate">{p.name}</p>
                    {p.category && (
                      <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
                        {p.category}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => startEdit(p)}
                      className="p-1.5 text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950 rounded-lg transition">
                      ✏️
                    </button>
                    <DeleteButton onConfirm={() => deleteProduct(p.id)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs text-gray-500 mt-2">
                  {p.sellingPrice && <p>Sells: <span className="font-medium text-gray-700 dark:text-gray-300">{fmt(p.sellingPrice)}</span></p>}
                  {p.costPrice    && <p>Cost:  <span className="font-medium text-gray-700 dark:text-gray-300">{fmt(p.costPrice)}</span></p>}
                  <p>Stock: <span className={`font-medium ${Number(p.currentStock) <= Number(p.reorderLevel) ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
                    {p.currentStock} {p.unit}
                    {Number(p.currentStock) <= Number(p.reorderLevel) && Number(p.reorderLevel) > 0 && ' ⚠️'}
                  </span></p>
                  <p>Unit: <span className="font-medium text-gray-700 dark:text-gray-300">{p.unit}</span></p>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'sales',     label: 'Sales',     icon: ShoppingCart },
  { id: 'expenses',  label: 'Expenses',  icon: Receipt      },
  { id: 'inventory', label: 'Inventory', icon: Package      },
  { id: 'products',  label: 'Products',  icon: BookOpen     },
];

export default function DataEntryPage() {
  const [activeTab, setActiveTab] = useState('sales');
  const [products,  setProducts]  = useState([]);

  const loadProducts = useCallback(async () => {
    try {
      const res = await dataApi.getProducts();
      setProducts(res.data.data || []);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Data Entry</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Record your daily sales, expenses, and stock counts
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6 w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
              ${activeTab === id
                ? 'bg-white dark:bg-gray-900 shadow-sm text-gray-800 dark:text-white'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}>
          {activeTab === 'sales'     && <SalesTab     products={products} />}
          {activeTab === 'expenses'  && <ExpensesTab  />}
          {activeTab === 'inventory' && <InventoryTab products={products} />}
          {activeTab === 'products'  && <ProductsTab  products={products} onProductsChange={loadProducts} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}