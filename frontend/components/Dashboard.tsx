import React, { useEffect, useMemo, useState } from 'react';
import { SafeAirlineLogo } from './SafeAirlineLogo';
import {
  LayoutDashboard,
  Users,
  Ticket,
  CreditCard,
  UserCheck,
  TrendingUp,
  DollarSign,
  Plus,
  CheckCircle,
  Coins,
  Trash2,
  Database,
  Edit2,
  Upload,
  Infinity,
  Ban,
  Megaphone,
  Settings,
  BookOpen,
  X,
  Printer,
  Menu,
  Plane,
  MapPin,
  Save,
  FileText,
  Eye,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Search,
  Tag,
} from 'lucide-react';
import {
  Airline,
  Airport,
  BlogPost,
  FooterConfig,
  RevenueConfig,
  SavedFlight,
  SavedPassenger,
  StaticPage,
  TicketHistoryItem,
  TicketTemplate,
  Ad,
  User,
  TicketPricingConfig,
  CustomAirlinePrice
} from '../types';

export interface DashboardProps {
  currentUser: User;
  users: User[];
  tickets: TicketHistoryItem[];
  savedFlights: SavedFlight[];
  setSavedFlights: React.Dispatch<React.SetStateAction<SavedFlight[]>>;
  savedAirports: Airport[];
  setSavedAirports: React.Dispatch<React.SetStateAction<Airport[]>>;
  savedAirlines: Airline[];
  setSavedAirlines: React.Dispatch<React.SetStateAction<Airline[]>>;
  savedPassengers: SavedPassenger[];
  setSavedPassengers: React.Dispatch<React.SetStateAction<SavedPassenger[]>>;
  ads: Ad[];
  setAds: React.Dispatch<React.SetStateAction<Ad[]>>;
  templates: TicketTemplate[];
  setTemplates: React.Dispatch<React.SetStateAction<TicketTemplate[]>>;
  footerConfig: FooterConfig;
  setFooterConfig: React.Dispatch<React.SetStateAction<FooterConfig>>;
  staticPages: StaticPage[];
  setStaticPages: React.Dispatch<React.SetStateAction<StaticPage[]>>;
  blogPosts: BlogPost[];
  setBlogPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  revenueConfig: RevenueConfig;
  setRevenueConfig: React.Dispatch<React.SetStateAction<RevenueConfig>>;
  ticketPricingConfig?: TicketPricingConfig;
  setTicketPricingConfig?: React.Dispatch<React.SetStateAction<TicketPricingConfig>>;
  lang: string;
  t: (key: any) => string;
  onBackToGenerator?: () => void;
  onDownloadTicket: (ticket: TicketHistoryItem) => void;
  onSaveUser: (user: User & { password?: string }) => Promise<void>;
  onDeleteUser: (id: string) => Promise<void>;
  onToggleUserStatus: (id: string) => Promise<void>;
  onSavePassenger: (passenger: SavedPassenger) => Promise<void>;
  onDeletePassenger: (id: string) => Promise<void>;
  onSaveAirline: (airline: Airline) => Promise<void>;
  onDeleteAirline: (id: string) => Promise<void>;
  onSaveAirport: (airport: Airport) => Promise<void>;
  onDeleteAirport: (id: string) => Promise<void>;
  onSaveFlight: (flight: SavedFlight) => Promise<void>;
  onDeleteFlight: (id: string) => Promise<void>;
  onSaveAd: (ad: Ad) => Promise<void>;
  onDeleteAd: (id: string) => Promise<void>;
  onSaveBlogPost: (post: BlogPost) => Promise<void>;
  onDeleteBlogPost: (id: string) => Promise<void>;
  onSaveFooter: (config: FooterConfig) => Promise<void>;
  onSaveStaticPage: (page: StaticPage) => Promise<void>;
  onDeleteStaticPage: (id: string) => Promise<void>;
  onSaveRevenueConfig: (config: RevenueConfig) => Promise<void>;
  onSaveTicketPricing?: (config: TicketPricingConfig) => Promise<void>;
}

type ModalChildProps<T> = {
  initialValue: T;
  onClose: () => void;
  onSubmit: (value: T) => Promise<void>;
  t: (key: any) => string;
};

const ModalShell = ({
  title,
  onClose,
  children
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) => (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 backdrop-blur-sm transition-opacity">
    <div className="w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100">
      <div className="shrink-0 flex items-center justify-between border-b border-slate-100 px-5 py-4 bg-slate-50/60">
        <h3 className="text-base sm:text-lg font-bold text-gray-900">{title}</h3>
        <button
          onClick={onClose}
          className="rounded-xl p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>
    </div>
  </div>
);

const TextInput = ({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
  <label className="block text-sm font-medium text-gray-700">
    <span className="mb-1 block text-xs sm:text-sm font-semibold">{label}</span>
    <input
      {...props}
      className={`w-full rounded-xl border border-gray-200 px-3 py-2 sm:py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
        props.className || ''
      }`}
    />
  </label>
);

const TextArea = ({
  label,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) => (
  <label className="block text-sm font-medium text-gray-700">
    <span className="mb-1 block text-xs sm:text-sm font-semibold">{label}</span>
    <textarea
      {...props}
      className={`w-full rounded-xl border border-gray-200 px-3 py-2 sm:py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
        props.className || ''
      }`}
    />
  </label>
);

function UserModal({ initialValue, onClose, onSubmit, t }: ModalChildProps<User & { password?: string }>) {
  const [form, setForm] = useState<User & { password?: string }>({
    ...initialValue,
    credit: initialValue.creditIrr ?? initialValue.credit ?? 0,
    creditIrr: initialValue.creditIrr ?? initialValue.credit ?? 0,
    creditUsd: initialValue.creditUsd ?? 0,
    giftCredit: initialValue.giftCreditIrr ?? initialValue.giftCredit ?? 0,
    giftCreditIrr: initialValue.giftCreditIrr ?? initialValue.giftCredit ?? 0,
    giftCreditUsd: initialValue.giftCreditUsd ?? 0,
    bonusFreeTickets: initialValue.bonusFreeTickets ?? 0
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');

    const cleanName = (form.name || '').trim();
    const cleanEmail = (form.email || '').trim().toLowerCase();
    const cleanMobile = (form.mobile || '')
      .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString())
      .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
      .replace(/[\s\-\(\)]/g, '')
      .trim();
    const cleanPassword = (form.password || '').trim();

    if (!cleanName || cleanName.length < 2) {
      setError('لطفاً نام کامل کاربر را وارد کنید (حداقل ۲ حرف). / Full name must be at least 2 characters.');
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('لطفاً آدرس ایمیل معتبر وارد کنید (مثال: user@example.com). / Please enter a valid email address.');
      return;
    }

    if (!cleanMobile || cleanMobile.length < 5) {
      setError('لطفاً شماره موبایل را وارد کنید (حداقل ۵ رقم). / Mobile number must be at least 5 digits.');
      return;
    }

    if (!form.id && (!cleanPassword || cleanPassword.length < 4)) {
      setError('رمز عبور برای کاربر جدید الزامی است (حداقل ۴ کاراکتر). / Password is required for new users (min 4 characters).');
      return;
    }

    const cIrr = Number(form.creditIrr ?? form.credit) || 0;
    const cUsd = Number(form.creditUsd) || 0;
    const gIrr = Number(form.giftCreditIrr ?? form.giftCredit) || 0;
    const gUsd = Number(form.giftCreditUsd) || 0;

    setSaving(true);
    try {
      await onSubmit({
        ...form,
        name: cleanName,
        email: cleanEmail,
        mobile: cleanMobile,
        password: cleanPassword || undefined,
        credit: cIrr,
        creditIrr: cIrr,
        creditUsd: cUsd,
        giftCredit: gIrr,
        giftCreditIrr: gIrr,
        giftCreditUsd: gUsd,
        bonusFreeTickets: Number(form.bonusFreeTickets) || 0
      });
      onClose();
    } catch (submitError: any) {
      setError(submitError?.message || 'Failed to save user.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell title={form.id ? t('edit') : t('add')} onClose={onClose}>
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
        <TextInput label={t('fullName')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <TextInput label={t('mobileNumber')} value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
        <TextInput label={t('emailText')} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <div>
          <TextInput
            label={t('password')}
            type="password"
            value={form.password || ''}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder={form.id ? 'Leave blank to keep current' : ''}
          />
          <p className="mt-1 text-xs text-gray-500">
            {form.id ? 'Fill only to change password.' : 'Min 4 characters.'}
          </p>
        </div>
        <label className="block text-sm font-medium text-gray-700">
          <span className="mb-1 block text-xs sm:text-sm font-semibold">Role</span>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as User['role'] })}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 sm:py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="Admin">Admin</option>
            <option value="Agent">Agent</option>
            <option value="User">User</option>
          </select>
        </label>
        <label className="block text-sm font-medium text-gray-700">
          <span className="mb-1 block text-xs sm:text-sm font-semibold">Status</span>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as User['status'] })}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 sm:py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </label>

        {/* Dual Currency - Main Credit */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 sm:col-span-2 space-y-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-blue-600" />
            <span>اعتبار اصلی (Main Credit - قابل کسر پس از هدیه)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextInput
              label="اعتبار اصلی ریالی (IRR)"
              type="number"
              value={form.creditIrr ?? form.credit ?? 0}
              onChange={(e) => {
                const val = Number(e.target.value) || 0;
                setForm({ ...form, creditIrr: val, credit: val });
              }}
            />
            <TextInput
              label="اعتبار اصلی دلاری (USD $)"
              type="number"
              step="0.01"
              value={form.creditUsd ?? 0}
              onChange={(e) => setForm({ ...form, creditUsd: Number(e.target.value) || 0 })}
            />
          </div>
        </div>

        {/* Dual Currency - Gift Credit */}
        <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200 sm:col-span-2 space-y-3">
          <div className="text-xs font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>اعتبار هدیه (Gift Credit - اولویت اول کسر بلیت)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextInput
              label="اعتبار هدیه ریالی (IRR)"
              type="number"
              value={form.giftCreditIrr ?? form.giftCredit ?? 0}
              onChange={(e) => {
                const val = Number(e.target.value) || 0;
                setForm({ ...form, giftCreditIrr: val, giftCredit: val });
              }}
            />
            <TextInput
              label="اعتبار هدیه دلاری (USD $)"
              type="number"
              step="0.01"
              value={form.giftCreditUsd ?? 0}
              onChange={(e) => setForm({ ...form, giftCreditUsd: Number(e.target.value) || 0 })}
            />
          </div>
        </div>

        <TextInput
          label="تعداد بلیت‌های هدیه رایگان (Bonus Free Tickets)"
          type="number"
          value={form.bonusFreeTickets || 0}
          onChange={(e) => setForm({ ...form, bonusFreeTickets: Number(e.target.value) || 0 })}
        />

        <label className="flex items-center gap-2 pt-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={Boolean(form.isUnlimited)}
            onChange={(e) => setForm({ ...form, isUnlimited: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="font-medium">دسترسی صدور نامحدود (Unlimited Access)</span>
        </label>
      </div>
      {error && <div className="mt-3 rounded-xl bg-red-50 p-3 text-xs sm:text-sm text-red-600">{error}</div>}
      <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
        <button
          onClick={onClose}
          className="w-full sm:w-auto rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200"
        >
          {t('cancel')}
        </button>
        <button
          onClick={submit}
          disabled={saving}
          className="w-full sm:w-auto rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? 'Saving...' : t('save')}
        </button>
      </div>
    </ModalShell>
  );
}

function PassengerModal({ initialValue, onClose, onSubmit, t }: ModalChildProps<SavedPassenger>) {
  const [form, setForm] = useState<SavedPassenger>(initialValue);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    try {
      await onSubmit({
        ...form,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        passportNumber: form.passportNumber.trim(),
        nationality: form.nationality.trim(),
        totalFlights: Number(form.totalFlights) || 0
      });
      onClose();
    } catch (err: any) {
      console.warn('PassengerModal save error:', err);
      onClose();
    } finally {
      setSaving(false);
    }
  };


  return (
    <ModalShell title={form.id ? t('edit') : t('add')} onClose={onClose}>
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
        <TextInput label={t('firstName')} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
        <TextInput label={t('lastName')} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
        <label className="block text-sm font-medium text-gray-700">
          <span className="mb-1 block text-xs sm:text-sm font-semibold">{t('gender')}</span>
          <select
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value as SavedPassenger['gender'] })}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 sm:py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="Male">{t('male')}</option>
            <option value="Female">{t('female')}</option>
            <option value="Infant">{t('infant')}</option>
          </select>
        </label>
        <TextInput label={t('passportNumber')} value={form.passportNumber} onChange={(e) => setForm({ ...form, passportNumber: e.target.value })} />
        <TextInput label={t('nationality')} value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} />
        <TextInput label={t('issueDate')} value={form.issueDate || ''} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} placeholder="07/Nov/2025" />
        <TextInput label={t('issueTime')} value={form.issueTime || ''} onChange={(e) => setForm({ ...form, issueTime: e.target.value })} placeholder="18:11" />
        <TextInput
          label="Total Flights"
          type="number"
          value={form.totalFlights}
          onChange={(e) => setForm({ ...form, totalFlights: Number(e.target.value) || 0 })}
        />
      </div>
      <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
        <button onClick={onClose} className="w-full sm:w-auto rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700">
          {t('cancel')}
        </button>
        <button
          onClick={submit}
          disabled={saving}
          className="w-full sm:w-auto rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? 'Saving...' : t('save')}
        </button>
      </div>
    </ModalShell>
  );
}

function AirportModal({ initialValue, onClose, onSubmit, t }: ModalChildProps<Airport>) {
  const [form, setForm] = useState<Airport>(initialValue);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    try {
      await onSubmit({
        ...form,
        name: form.name.trim(),
        code: form.code.trim().toUpperCase(),
        city: form.city.trim(),
        country: form.country.trim()
      });
      onClose();
    } catch (err: any) {
      console.warn('AirportModal save error:', err);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell title={form.id ? t('edit') : t('add')} onClose={onClose}>
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
        <TextInput label={t('code')} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
        <TextInput label={t('city')} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <TextInput label={t('airportName')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <TextInput label={t('country')} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
      </div>
      <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
        <button onClick={onClose} className="w-full sm:w-auto rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700">
          {t('cancel')}
        </button>
        <button
          onClick={submit}
          disabled={saving}
          className="w-full sm:w-auto rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? 'Saving...' : t('save')}
        </button>
      </div>
    </ModalShell>
  );
}

function AirlineModal({ initialValue, onClose, onSubmit, t }: ModalChildProps<Airline>) {
  const [form, setForm] = useState<Airline>(initialValue);
  const [saving, setSaving] = useState(false);
  const [sourceMode, setSourceMode] = useState<'upload' | 'url'>('upload');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('لطفاً یک فایل تصویری (PNG, JPG, SVG) انتخاب کنید.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setForm(prev => ({ ...prev, logoUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUseCharter118Cdn = () => {
    const code = (form.code || '').trim().toUpperCase();
    if (!code) {
      alert('لطفاً ابتدا کد ایرلاین (IATA) را وارد کنید.');
      return;
    }
    const cdnUrl = `https://cdn.charter118.ir/static/img/airlines/${code}.png`;
    setForm(prev => ({ ...prev, logoUrl: cdnUrl }));
  };

  const submit = async () => {
    setSaving(true);
    try {
      await onSubmit({
        ...form,
        name: form.name.trim(),
        code: form.code.trim().toUpperCase(),
        logoUrl: form.logoUrl?.trim() || ''
      });
      onClose();
    } catch (err: any) {
      console.warn('AirlineModal save error:', err);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const isBase64 = form.logoUrl?.startsWith('data:');

  return (
    <ModalShell title={form.id ? t('edit') : t('add')} onClose={onClose}>
      <div className="space-y-4">
        <TextInput 
          label={t('airlineName')} 
          value={form.name} 
          onChange={(e) => setForm({ ...form, name: e.target.value })} 
          placeholder="مثال: ایران‌ایر / Turkish Airlines"
        />
        <TextInput 
          label={t('code')} 
          value={form.code} 
          onChange={(e) => {
            const code = e.target.value.toUpperCase();
            setForm(prev => {
              // If logoUrl was default Alibaba CDN with previous code, optionally update it
              if (prev.logoUrl?.includes('cdn.alibaba.ir/static/img/airlines/Domestic/')) {
                return { ...prev, code, logoUrl: `https://cdn.alibaba.ir/static/img/airlines/Domestic/${code}.png` };
              }
              return { ...prev, code };
            });
          }} 
          placeholder="IATA Code (مثال: IR, W5, TK)"
        />

        {/* Logo Selection Mode */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700">لوگوی ایرلاین (عکس یا لینک)</label>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => setSourceMode('upload')}
                className={`px-2.5 py-1 rounded-md transition ${sourceMode === 'upload' ? 'bg-white text-blue-600 shadow-xs font-semibold' : 'text-slate-600'}`}
              >
                آپلود از دستگاه
              </button>
              <button
                type="button"
                onClick={() => setSourceMode('url')}
                className={`px-2.5 py-1 rounded-md transition ${sourceMode === 'url' ? 'bg-white text-blue-600 shadow-xs font-semibold' : 'text-slate-600'}`}
              >
                لینک اینترنتی
              </button>
            </div>
          </div>

          {sourceMode === 'upload' ? (
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-4 text-center cursor-pointer transition bg-slate-50/50 hover:bg-blue-50/30 flex flex-col items-center justify-center gap-2"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-blue-600">برای انتخاب و آپلود عکس لوگو کلیک کنید</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">فرمت‌های PNG، JPG، SVG و WEBP پشتیبانی می‌شوند</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <TextInput 
                label="آدرس اینترنتی لوگو (URL)" 
                value={form.logoUrl || ''} 
                onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} 
                placeholder="https://cdn.charter118.ir/static/img/airlines/..."
              />
            </div>
          )}

          {/* Quick Charter118 CDN preset button */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleUseCharter118Cdn}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              تنظیم لینک لوگو از سرور چارتری (charter118.ir/static/img/airlines/{form.code || 'CODE'}.png)
            </button>
          </div>

          {/* Logo Live Preview */}
          {form.logoUrl && (
            <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 mt-2">
              <div className="flex items-center gap-3 min-w-0">
                <SafeAirlineLogo logoUrl={form.logoUrl} airline={form.name || form.code} size="w-14 h-14" />
                <div className="text-xs text-slate-500 truncate space-y-0.5">
                  <span className="font-semibold text-slate-800 block truncate">
                    {form.name || 'نام ایرلاین'} ({form.code || 'CODE'})
                  </span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-slate-200 text-slate-700 font-mono">
                    {isBase64 ? 'فایل آپلود شده (Base64)' : 'لینک CDN'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, logoUrl: '' })}
                className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 text-xs font-medium flex items-center gap-1"
                title="حذف لوگو"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">حذف</span>
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
        <button onClick={onClose} className="w-full sm:w-auto rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700">
          {t('cancel')}
        </button>
        <button
          onClick={submit}
          disabled={saving}
          className="w-full sm:w-auto rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? 'در حال ذخیره...' : t('save')}
        </button>
      </div>
    </ModalShell>
  );
}

function FlightModal({
  initialValue,
  airlines,
  airports,
  onClose,
  onSubmit,
  t
}: ModalChildProps<SavedFlight> & { airlines: Airline[]; airports: Airport[] }) {
  const [form, setForm] = useState<SavedFlight>(initialValue);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    try {
      await onSubmit({
        ...form,
        flightNumber: form.flightNumber.trim(),
        airline: form.airline.trim(),
        originCode: form.originCode.trim().toUpperCase(),
        destCode: form.destCode.trim().toUpperCase(),
        departureTime: form.departureTime.trim(),
        arrivalTime: form.arrivalTime.trim(),
        date: form.date.trim()
      });
      onClose();
    } catch (err: any) {
      console.warn('FlightModal save error:', err);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell title={form.id ? t('edit') : t('add')} onClose={onClose}>
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
        <TextInput label={t('flightNumber')} value={form.flightNumber} onChange={(e) => setForm({ ...form, flightNumber: e.target.value })} />
        <TextInput label={t('airline')} value={form.airline} onChange={(e) => setForm({ ...form, airline: e.target.value })} />
        <TextInput label={t('origin')} value={form.originCode} onChange={(e) => setForm({ ...form, originCode: e.target.value.toUpperCase() })} />
        <TextInput label={t('destination')} value={form.destCode} onChange={(e) => setForm({ ...form, destCode: e.target.value.toUpperCase() })} />
        <TextInput label={t('departureTime')} value={form.departureTime} onChange={(e) => setForm({ ...form, departureTime: e.target.value })} />
        <TextInput label={t('arrivalTime')} value={form.arrivalTime} onChange={(e) => setForm({ ...form, arrivalTime: e.target.value })} />
        <TextInput label={t('date')} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="YYYY-MM-DD" />
      </div>
      <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
        <button onClick={onClose} className="w-full sm:w-auto rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700">
          {t('cancel')}
        </button>
        <button
          onClick={submit}
          disabled={saving}
          className="w-full sm:w-auto rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? 'Saving...' : t('save')}
        </button>
      </div>
    </ModalShell>
  );
}

function AdModal({ initialValue, onClose, onSubmit, t }: ModalChildProps<Ad>) {
  const [form, setForm] = useState<Ad>(initialValue);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    try {
      await onSubmit({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        ctaText: form.ctaText.trim(),
        linkUrl: form.linkUrl.trim()
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell title={form.id ? t('edit') : t('add')} onClose={onClose}>
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
        <TextInput label={t('title')} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <label className="block text-sm font-medium text-gray-700">
          <span className="mb-1 block text-xs sm:text-sm font-semibold">Location</span>
          <select
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value as Ad['location'] })}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 sm:py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="spot_bottom_1">Under Ticket - Vertical Banner 1</option>
            <option value="spot_bottom_2">Under Ticket - Vertical Banner 2</option>
            <option value="spot_bottom_3">Under Ticket - Vertical Banner 3</option>
            <option value="spot_popup">Download Popup Modal (10s Ad)</option>
            <option value="spot_1">Spot 1 (Main Header)</option>
            <option value="spot_2">Spot 2 (Sidebar Banner)</option>
            <option value="spot_3">Spot 3 (Form Banner)</option>
            <option value="spot_4">Spot 4 (Bottom Horizontal Banner)</option>
          </select>
        </label>
        <TextInput label="CTA Text" value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} />
        <TextInput label="Target Link URL" value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} />
        <TextInput label="Image URL (Optional)" value={form.imageUrl || ''} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
        <TextInput label="Gradient Color From (e.g. from-pink-500)" value={form.colorFrom || ''} onChange={(e) => setForm({ ...form, colorFrom: e.target.value })} />
        <TextInput label="Gradient Color To (e.g. to-rose-500)" value={form.colorTo || ''} onChange={(e) => setForm({ ...form, colorTo: e.target.value })} />
        <TextInput label="Start Date" type="date" value={form.startDate || ''} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
        <TextInput label="End Date" type="date" value={form.endDate || ''} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
        <div className="sm:col-span-2">
          <TextArea label={t('postContent')} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <label className="sm:col-span-2 flex items-center gap-2 pt-1 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={Boolean(form.isActive)}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="font-medium">Active (Visible in App)</span>
        </label>
      </div>
      <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
        <button onClick={onClose} className="w-full sm:w-auto rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700">
          {t('cancel')}
        </button>
        <button
          onClick={submit}
          disabled={saving}
          className="w-full sm:w-auto rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? 'Saving...' : t('save')}
        </button>
      </div>
    </ModalShell>
  );
}

function BlogModal({ initialValue, onClose, onSubmit, t }: ModalChildProps<BlogPost>) {
  const [form, setForm] = useState<BlogPost>(initialValue);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    try {
      await onSubmit({
        ...form,
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        content: form.content.trim(),
        author: form.author.trim(),
        imageUrl: form.imageUrl?.trim() || ''
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell title={form.id ? t('edit') : t('addPost')} onClose={onClose}>
      <div className="space-y-3 sm:space-y-4">
        <TextInput label={t('title')} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <TextInput label={t('author')} value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
        <TextInput label="Image URL" value={form.imageUrl || ''} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
        <TextArea label="Excerpt (Summary)" rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
        <TextArea label={t('postContent')} rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
      </div>
      <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
        <button onClick={onClose} className="w-full sm:w-auto rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700">
          {t('cancel')}
        </button>
        <button
          onClick={submit}
          disabled={saving}
          className="w-full sm:w-auto rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? 'Saving...' : t('save')}
        </button>
      </div>
    </ModalShell>
  );
}

function StaticPageModal({ initialValue, onClose, onSubmit, t }: ModalChildProps<StaticPage>) {
  const [form, setForm] = useState<StaticPage>(initialValue);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    try {
      await onSubmit({
        ...form,
        slug: form.slug.trim(),
        title: form.title.trim(),
        content: form.content.trim()
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell title={form.id ? t('edit') : 'Add page'} onClose={onClose}>
      <div className="space-y-3 sm:space-y-4">
        <TextInput label="Slug (URL path e.g. about-us)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        <TextInput label={t('title')} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <TextArea label={t('postContent')} rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
      </div>
      <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
        <button onClick={onClose} className="w-full sm:w-auto rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700">
          {t('cancel')}
        </button>
        <button
          onClick={submit}
          disabled={saving}
          className="w-full sm:w-auto rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? 'Saving...' : t('save')}
        </button>
      </div>
    </ModalShell>
  );
}

const card = 'rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50';

const PageHeader = ({
  title,
  description,
  action,
  isRTL = false
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  isRTL?: boolean;
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
    <div className="min-w-0">
      <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 text-start">
        {title}
      </h1>
      {description && (
        <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-slate-500 text-start">
          {description}
        </p>
      )}
    </div>
    {action && <div className="shrink-0 w-full sm:w-auto">{action}</div>}
  </div>
);

export const Dashboard = (props: DashboardProps) => {
  const isRTL = props.lang === 'fa' || props.lang === 'ar';
  const [activeTab, setActiveTab] = useState('overview');
  const [baseDataTab, setBaseDataTab] = useState<'airports' | 'airlines' | 'flights'>('airports');
  const [baseDataSearch, setBaseDataSearch] = useState('');
  const [ticketSearch, setTicketSearch] = useState('');
  const [passengerSearch, setPassengerSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [modal, setModal] = useState<React.ReactNode | null>(null);

  // Close sidebar on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSidebarOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  const totalRevenue = useMemo(() => {
    return props.tickets.reduce((sum, ticket) => {
      const numericValue = Number(ticket.price.replace(/[^0-9.-]+/g, '')) || 0;
      return sum + numericValue;
    }, 0);
  }, [props.tickets]);

  const overviewCards = [
    { label: 'Users', value: props.users.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Tickets', value: props.tickets.length, icon: Ticket, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Passengers', value: props.savedPassengers.length, icon: UserCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const openModal = (node: React.ReactNode) => setModal(node);
  const closeModal = () => setModal(null);

  // Quick navigation items for top/mobile tabs
  const navTabs = [
    { id: 'overview', icon: LayoutDashboard, label: props.t('overview') },
    { id: 'tickets', icon: Ticket, label: props.t('ticketManagement') },
    { id: 'pricing', icon: Tag, label: isRTL ? 'نرخ‌گذاری بلیط‌ها' : 'Ticket Pricing' },
    { id: 'users', icon: Users, label: props.t('userManagement') },
    { id: 'passengers', icon: UserCheck, label: props.t('frequentFlyers') },
    { id: 'basedata', icon: Database, label: props.t('baseData') },
    { id: 'revenue', icon: Coins, label: props.t('revenueModel') },
    { id: 'advertising', icon: Megaphone, label: props.t('advertising') },
    { id: 'transactions', icon: CreditCard, label: props.t('transactions') },
    { id: 'blog', icon: BookOpen, label: props.t('manageBlog') },
    { id: 'settings', icon: Settings, label: props.t('settings') },
  ];

  // ===== RENDER SECTIONS =====

  const renderOverview = () => (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader
        title={props.t('overview')}
        description="Connected view of flight operations, users, tickets, and revenue."
        isRTL={isRTL}
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {overviewCards.map((item) => (
          <div key={item.label} className={`${card} p-4 sm:p-5 flex items-center justify-between`}>
            <div>
              <div className="text-xs sm:text-sm font-medium text-slate-500">{item.label}</div>
              <div className="mt-1 text-lg sm:text-2xl font-black text-slate-900">{item.value}</div>
            </div>
            <div className={`rounded-xl sm:rounded-2xl p-2.5 sm:p-3 ${item.bg}`}>
              <item.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${item.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        {/* Recent Tickets preview */}
        <div className={`${card} p-4 sm:p-5 space-y-3`}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-slate-900">Recent Issued Tickets</h2>
            <button
              onClick={() => setActiveTab('tickets')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              View all ({props.tickets.length})
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {props.tickets.slice(0, 4).map((ticket) => (
              <div key={ticket.id} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                <div>
                  <div className="font-semibold text-gray-900">{ticket.passengerName}</div>
                  <div className="text-gray-500 font-mono text-[11px]">{ticket.ticketId} • {ticket.route}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{ticket.price}</div>
                  <div className="text-[11px] text-gray-400">{ticket.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Operations */}
        <div className={`${card} p-4 sm:p-5 space-y-3`}>
          <h2 className="text-sm sm:text-base font-bold text-slate-900">Quick Operations</h2>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => openModal(<UserModal initialValue={{ id: '', name: '', email: '', mobile: '', role: 'User', status: 'Active', credit: 0, isUnlimited: false, bonusFreeTickets: 0, permissions: [], password: '' }} onClose={closeModal} onSubmit={props.onSaveUser} t={props.t} />)}
              className="flex items-center gap-2 p-3 rounded-2xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition text-xs sm:text-sm font-semibold"
            >
              <Users className="h-4 w-4 shrink-0" />
              <span>{props.t('add')} User</span>
            </button>
            <button
              onClick={() => openModal(<PassengerModal initialValue={{ id: '', firstName: '', lastName: '', gender: 'Male', passportNumber: '', nationality: '', totalFlights: 0 }} onClose={closeModal} onSubmit={props.onSavePassenger} t={props.t} />)}
              className="flex items-center gap-2 p-3 rounded-2xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition text-xs sm:text-sm font-semibold"
            >
              <UserCheck className="h-4 w-4 shrink-0" />
              <span>{props.t('add')} Passenger</span>
            </button>
            <button
              onClick={() => openModal(<AirportModal initialValue={{ id: '', name: '', code: '', city: '', country: '' }} onClose={closeModal} onSubmit={props.onSaveAirport} t={props.t} />)}
              className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition text-xs sm:text-sm font-semibold"
            >
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{props.t('add')} Airport</span>
            </button>
            <button
              onClick={() => openModal(<AirlineModal initialValue={{ id: '', name: '', code: '', logoUrl: '' }} onClose={closeModal} onSubmit={props.onSaveAirline} t={props.t} />)}
              className="flex items-center gap-2 p-3 rounded-2xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition text-xs sm:text-sm font-semibold"
            >
              <Plane className="h-4 w-4 shrink-0" />
              <span>{props.t('add')} Airline</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTickets = () => {
    const q = ticketSearch.toLowerCase().trim();
    const filteredTickets = props.tickets.filter((ticket) =>
      !q ||
      (ticket.ticketId || '').toLowerCase().includes(q) ||
      (ticket.pnr || '').toLowerCase().includes(q) ||
      (ticket.passengerName || '').toLowerCase().includes(q) ||
      (ticket.route || '').toLowerCase().includes(q) ||
      (ticket.date || '').toLowerCase().includes(q) ||
      (ticket.status || '').toLowerCase().includes(q) ||
      (ticket.notes || '').toLowerCase().includes(q)
    );

    return (
    <div className="space-y-4">
      <PageHeader
        title={props.t('ticketManagement')}
        description="Issued tickets, passenger routes, and print actions in one place."
        isRTL={isRTL}
      />

      {/* Ticket Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={ticketSearch}
          onChange={(e) => setTicketSearch(e.target.value)}
          placeholder="جستجو در بلیت‌ها بر اساس شماره بلیت، PNR، نام مسافر، مسیر، تاریخ یا وضعیت..."
          className="w-full rounded-2xl border border-gray-200 pl-10 pr-20 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white shadow-xs"
        />
        {ticketSearch && (
          <button
            onClick={() => setTicketSearch('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500 hover:text-gray-800 bg-gray-100 px-2.5 py-1 rounded-lg"
          >
            Clear
          </button>
        )}
      </div>

      <div className={`${card} overflow-hidden`}>
        {/* Mobile Cards View */}
        <div className="md:hidden divide-y divide-gray-100">
          {filteredTickets.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              {ticketSearch ? `No tickets found matching "${ticketSearch}".` : 'No tickets issued yet.'}
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <div key={ticket.id} className="p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                    {ticket.ticketId}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      ticket.status === 'CONFIRMED'
                        ? 'bg-emerald-50 text-emerald-700'
                        : ticket.status === 'CANCELLED'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{ticket.passengerName}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                      <span className="font-medium text-slate-700">{ticket.route}</span>
                      <span>•</span>
                      <span>{ticket.date}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900 text-sm">{ticket.price}</div>
                    <div className="text-[11px] text-gray-400">{ticket.paymentMethod}</div>
                  </div>
                </div>
                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => props.onDownloadTicket(ticket)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Download / Print PDF</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5 text-start font-bold">{props.t('ticketId')}</th>
                <th className="px-5 py-3.5 text-start font-bold">{props.t('passenger')}</th>
                <th className="px-5 py-3.5 text-start font-bold">{props.t('route')}</th>
                <th className="px-5 py-3.5 text-start font-bold">{props.t('date')}</th>
                <th className="px-5 py-3.5 text-start font-bold">{props.t('price') || 'Price'}</th>
                <th className="px-5 py-3.5 text-end font-bold">{props.t('action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-400">
                    {ticketSearch ? `No tickets found matching "${ticketSearch}".` : 'No tickets issued yet.'}
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4 text-start font-mono font-medium text-blue-600">{ticket.ticketId}</td>
                    <td className="px-5 py-4 text-start font-semibold text-gray-900">{ticket.passengerName}</td>
                    <td className="px-5 py-4 text-start text-slate-600">{ticket.route}</td>
                    <td className="px-5 py-4 text-start text-gray-500">{ticket.date}</td>
                    <td className="px-5 py-4 text-start font-semibold text-gray-900">{ticket.price}</td>
                    <td className="px-5 py-4 text-end">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => props.onDownloadTicket(ticket)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition"
                        >
                          <Printer className="h-3.5 w-3.5" />
                          <span>Print</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

  const renderUsers = () => {
    const q = userSearch.toLowerCase().trim();
    const filteredUsers = props.users.filter((user) =>
      !q ||
      (user.name || '').toLowerCase().includes(q) ||
      (user.email || '').toLowerCase().includes(q) ||
      (user.mobile || '').toLowerCase().includes(q) ||
      (user.role || '').toLowerCase().includes(q) ||
      (user.status || '').toLowerCase().includes(q)
    );

    return (
    <div className="space-y-4">
      <PageHeader
        isRTL={isRTL}
        title={props.t('userManagement')}
        description="Manage admin, agent, and user accounts with credit and permissions."
        action={
          <button
            onClick={() => openModal(<UserModal initialValue={{ id: '', name: '', email: '', mobile: '', role: 'User', status: 'Active', credit: 0, isUnlimited: false, bonusFreeTickets: 0, permissions: [], password: '' }} onClose={closeModal} onSubmit={props.onSaveUser} t={props.t} />)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
          >
            <Plus className="h-4 w-4" /> {props.t('add')} User
          </button>
        }
      />

      {/* User Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
          placeholder="جستجو در کاربران بر اساس نام، ایمیل، موبایل، نقش یا وضعیت..."
          className="w-full rounded-2xl border border-gray-200 pl-10 pr-20 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white shadow-xs"
        />
        {userSearch && (
          <button
            onClick={() => setUserSearch('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500 hover:text-gray-800 bg-gray-100 px-2.5 py-1 rounded-lg"
          >
            Clear
          </button>
        )}
      </div>

      <div className={`${card} overflow-hidden`}>
        {/* Mobile Cards View */}
        <div className="md:hidden divide-y divide-gray-100">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              {userSearch ? `No users found matching "${userSearch}".` : 'No users registered yet.'}
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 font-bold text-gray-900 text-sm truncate">
                      {user.name}
                      {user.isUnlimited && <Infinity className="h-4 w-4 text-blue-600 shrink-0" />}
                    </div>
                    <div className="text-xs text-gray-500 truncate">{user.email}</div>
                    <div className="text-[11px] text-gray-400">{user.mobile}</div>
                  </div>
                  <span
                    className={`shrink-0 text-xs px-2.5 py-1 rounded-xl font-bold ${
                      user.role === 'ADMIN' || user.role === 'Admin'
                        ? 'bg-purple-100 text-purple-700'
                        : user.role === 'AGENT' || user.role === 'Agent'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
                <div className="flex flex-col gap-1 text-xs bg-slate-50 p-2.5 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-medium">اعتبار اصلی: </span>
                    <span className="font-bold text-gray-900">
                      {user.isUnlimited ? 'نامحدود' : `${(user.creditIrr ?? user.credit ?? 0).toLocaleString()} ریال | $${user.creditUsd || 0}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-amber-700 font-medium">اعتبار هدیه: </span>
                    <span className="font-bold text-amber-700">
                      {`${(user.giftCreditIrr ?? user.giftCredit ?? 0).toLocaleString()} ریال | $${user.giftCreditUsd || 0}`}
                    </span>
                  </div>
                  {(user.bonusFreeTickets || 0) > 0 && (
                    <div className="flex items-center justify-between text-[11px] text-emerald-600 font-semibold">
                      <span>بلیت هدیه: </span>
                      <span>{user.bonusFreeTickets} عدد</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                    <span className="text-gray-400">Status: </span>
                    <span
                      className={`font-semibold ${
                        user.status === 'Active' || user.status === 'ACTIVE' ? 'text-emerald-600' : 'text-red-500'
                      }`}
                    >
                      {user.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => props.onToggleUserStatus(user.id)}
                    className={`rounded-xl px-2.5 py-1.5 text-xs font-semibold ${
                      user.status === 'Active' || user.status === 'ACTIVE'
                        ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {user.status === 'Active' || user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => openModal(<UserModal initialValue={{ ...user, password: '' }} onClose={closeModal} onSubmit={props.onSaveUser} t={props.t} />)}
                    className="rounded-xl bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                    aria-label="Edit user"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => props.onDeleteUser(user.id)}
                    className="rounded-xl bg-red-50 p-2 text-red-600 hover:bg-red-100"
                    aria-label="Delete user"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5 text-start font-bold">{props.t('fullName')}</th>
                <th className="px-5 py-3.5 text-start font-bold">Role</th>
                <th className="px-5 py-3.5 text-start font-bold">اعتبار اصلی و هدیه (ریال و دلار)</th>
                <th className="px-5 py-3.5 text-start font-bold">Status</th>
                <th className="px-5 py-3.5 text-end font-bold">{props.t('action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-400">
                    {userSearch ? `No users found matching "${userSearch}".` : 'No users registered yet.'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4 text-start">
                      <div className="flex items-center gap-2 font-semibold text-gray-900">
                        {user.name}
                        {user.isUnlimited && <Infinity className="h-4 w-4 text-blue-600" />}
                      </div>
                      <div className="text-xs text-gray-500">{user.email} • {user.mobile}</div>
                    </td>
                    <td className="px-5 py-4 text-start">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs rounded-xl font-bold ${
                          user.role === 'ADMIN' || user.role === 'Admin'
                            ? 'bg-purple-100 text-purple-700'
                            : user.role === 'AGENT' || user.role === 'Agent'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-start">
                      {user.isUnlimited ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                          <Infinity className="w-3.5 h-3.5" /> نامحدود (Unlimited)
                        </span>
                      ) : (
                        <div className="space-y-1 text-xs">
                          <div className="font-bold text-slate-800">
                            اصلی: {(user.creditIrr ?? user.credit ?? 0).toLocaleString()} ریال | ${user.creditUsd || 0}
                          </div>
                          <div className="font-medium text-amber-700">
                            هدیه: {(user.giftCreditIrr ?? user.giftCredit ?? 0).toLocaleString()} ریال | ${user.giftCreditUsd || 0}
                          </div>
                          {(user.bonusFreeTickets || 0) > 0 && (
                            <div className="text-[11px] text-emerald-600 font-semibold">
                              {user.bonusFreeTickets} بلیت هدیه رایگان
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-start">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs rounded-full font-semibold ${
                          user.status === 'Active' || user.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-end">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => props.onToggleUserStatus(user.id)}
                          className={`rounded-xl px-2.5 py-1.5 text-xs font-semibold ${
                            user.status === 'Active' || user.status === 'ACTIVE'
                              ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {user.status === 'Active' || user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => openModal(<UserModal initialValue={{ ...user, password: '' }} onClose={closeModal} onSubmit={props.onSaveUser} t={props.t} />)}
                          className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                          title="Edit User"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => props.onDeleteUser(user.id)}
                          className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

  const renderPassengers = () => {
    const q = passengerSearch.toLowerCase().trim();
    const filteredPassengers = props.savedPassengers.filter((passenger) =>
      !q ||
      (passenger.firstName || '').toLowerCase().includes(q) ||
      (passenger.lastName || '').toLowerCase().includes(q) ||
      (passenger.passportNumber || '').toLowerCase().includes(q) ||
      (passenger.nationality || '').toLowerCase().includes(q)
    );

    return (
    <div className="space-y-4">
      <PageHeader
        isRTL={isRTL}
        title={props.t('frequentFlyers')}
        description="Saved passenger roster for quicker ticket filling and history tracking."
        action={
          <button
            onClick={() => openModal(<PassengerModal initialValue={{ id: '', firstName: '', lastName: '', gender: 'Male', passportNumber: '', nationality: '', totalFlights: 0, issueDate: '', issueTime: '' }} onClose={closeModal} onSubmit={props.onSavePassenger} t={props.t} />)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
          >
            <Plus className="h-4 w-4" /> {props.t('add')} Passenger
          </button>
        }
      />

      {/* Passenger Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={passengerSearch}
          onChange={(e) => setPassengerSearch(e.target.value)}
          placeholder="جستجو بر اساس نام، نام خانوادگی، شماره پاسپورت یا کد ملی..."
          className="w-full rounded-2xl border border-gray-200 pl-10 pr-20 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white shadow-xs"
        />
        {passengerSearch && (
          <button
            onClick={() => setPassengerSearch('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500 hover:text-gray-800 bg-gray-100 px-2.5 py-1 rounded-lg"
          >
            Clear
          </button>
        )}
      </div>

      <div className={`${card} overflow-hidden`}>
        {/* Mobile Cards View */}
        <div className="md:hidden divide-y divide-gray-100">
          {filteredPassengers.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              {passengerSearch ? `No passengers found matching "${passengerSearch}".` : 'No saved passengers.'}
            </div>
          ) : (
            filteredPassengers.map((passenger) => (
              <div key={passenger.id} className="p-4 space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-gray-900 text-sm">
                      {passenger.firstName} {passenger.lastName}
                    </div>
                    <div className="text-xs text-gray-500">{passenger.gender} • {passenger.nationality}</div>
                  </div>
                  <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded-lg text-slate-700">
                    {passenger.passportNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500">Total Flights: <strong className="text-slate-800">{passenger.totalFlights || 0}</strong></span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(<PassengerModal initialValue={passenger} onClose={closeModal} onSubmit={props.onSavePassenger} t={props.t} />)}
                      className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => props.onDeletePassenger(passenger.id)}
                      className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5 text-start font-bold">{props.t('name')}</th>
                <th className="px-5 py-3.5 text-start font-bold">{props.t('gender')}</th>
                <th className="px-5 py-3.5 text-start font-bold">{props.t('passportNumber')}</th>
                <th className="px-5 py-3.5 text-start font-bold">{props.t('nationality')}</th>
                <th className="px-5 py-3.5 text-start font-bold">Total Flights</th>
                <th className="px-5 py-3.5 text-end font-bold">{props.t('action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPassengers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-400">
                    {passengerSearch ? `No passengers found matching "${passengerSearch}".` : 'No saved passengers.'}
                  </td>
                </tr>
              ) : (
                filteredPassengers.map((passenger) => (
                  <tr key={passenger.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4 text-start font-semibold text-gray-900">{passenger.firstName} {passenger.lastName}</td>
                    <td className="px-5 py-4 text-start">{passenger.gender}</td>
                    <td className="px-5 py-4 text-start font-mono">{passenger.passportNumber}</td>
                    <td className="px-5 py-4 text-start">{passenger.nationality}</td>
                    <td className="px-5 py-4 text-start font-semibold">{passenger.totalFlights || 0}</td>
                    <td className="px-5 py-4 text-end">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal(<PassengerModal initialValue={passenger} onClose={closeModal} onSubmit={props.onSavePassenger} t={props.t} />)}
                          className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                          title="Edit Passenger"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => props.onDeletePassenger(passenger.id)}
                          className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                          title="Delete Passenger"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

  const renderBaseData = () => {
    const q = baseDataSearch.toLowerCase().trim();
    const filteredAirports = props.savedAirports.filter(a =>
      !q || (a.name || '').toLowerCase().includes(q) || (a.code || '').toLowerCase().includes(q) || (a.city || '').toLowerCase().includes(q) || (a.country || '').toLowerCase().includes(q)
    );
    const filteredAirlines = props.savedAirlines.filter(a =>
      !q || (a.name || '').toLowerCase().includes(q) || (a.code || '').toLowerCase().includes(q)
    );
    const filteredFlights = props.savedFlights.filter(f =>
      !q || (f.flightNumber || '').toLowerCase().includes(q) || (f.originCode || '').toLowerCase().includes(q) || (f.destCode || '').toLowerCase().includes(q) || (f.airline || '').toLowerCase().includes(q)
    );

    return (
    <div className="space-y-4">
      <PageHeader
        title={props.t('baseData')}
        description="Airports, airlines, and predefined routes used across ticket forms."
        isRTL={isRTL}
      />
      <div className={`${card} p-3 sm:p-5 space-y-4 sm:space-y-6`}>
        {/* Responsive Segment Tabs */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 p-1 bg-slate-100 rounded-2xl">
          <button
            onClick={() => setBaseDataTab('airports')}
            className={`rounded-xl py-2 sm:py-2.5 text-xs sm:text-sm font-bold transition ${
              baseDataTab === 'airports' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Airports ({filteredAirports.length})
          </button>
          <button
            onClick={() => setBaseDataTab('airlines')}
            className={`rounded-xl py-2 sm:py-2.5 text-xs sm:text-sm font-bold transition ${
              baseDataTab === 'airlines' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Airlines ({filteredAirlines.length})
          </button>
          <button
            onClick={() => setBaseDataTab('flights')}
            className={`rounded-xl py-2 sm:py-2.5 text-xs sm:text-sm font-bold transition ${
              baseDataTab === 'flights' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Flights ({filteredFlights.length})
          </button>
        </div>

        {/* Live Search Bar for all Base Data tabs */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={baseDataSearch}
            onChange={(e) => setBaseDataSearch(e.target.value)}
            placeholder={
              baseDataTab === 'airports'
                ? (isRTL ? 'جستجو در فرودگاه‌ها بر اساس نام، شهر، کد یاتا یا کشور (مثال: تهران، مشهد، IKA، DXB)...' : 'Search airports by name, city, code, or country (e.g. Tehran, IKA, Dubai)...')
                : baseDataTab === 'airlines'
                ? (isRTL ? 'جستجو در ایرلاین‌ها بر اساس نام فارسی/انگلیسی یا کد دوحرفی (مثال: هما، ماهان، سپهران، IR، W5)...' : 'Search airlines by name or code (e.g. Mahan, Iran Air, W5, TK)...')
                : (isRTL ? 'جستجو در پروازها بر اساس شماره پرواز، مسیر، ایرلاین یا تاریخ (مثال: 7300، MHD، NJF)...' : 'Search flights by flight number, airline, or route...')
            }
            className="w-full rounded-xl border border-gray-200 pl-10 pr-16 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-slate-50/50"
          />
          {baseDataSearch && (
            <button 
              onClick={() => setBaseDataSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-700 bg-gray-200 px-2 py-0.5 rounded-md"
            >
              Clear
            </button>
          )}
        </div>

        {baseDataTab === 'airports' && (
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 bg-slate-50/50">
              <h2 className="font-bold text-sm sm:text-base text-gray-900">Airports ({filteredAirports.length})</h2>
              <button
                onClick={() => openModal(<AirportModal initialValue={{ id: '', name: '', code: '', city: '', country: '' }} onClose={closeModal} onSubmit={props.onSaveAirport} t={props.t} />)}
                className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" /> Add Airport
              </button>
            </div>
            <div className="max-h-96 overflow-auto divide-y divide-gray-100">
              {filteredAirports.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-400">No airports found.</div>
              ) : filteredAirports.map((airport) => (
                <div key={airport.id} className="p-3.5 sm:px-5 sm:py-4 flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <div className="font-bold text-gray-900 flex items-center gap-1.5">
                      <span>{airport.city}</span>
                      <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-blue-600 font-semibold">{airport.code}</span>
                    </div>
                    <div className="truncate text-xs text-gray-500 mt-0.5">{airport.name} • {airport.country}</div>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <button
                      onClick={() => openModal(<AirportModal initialValue={airport} onClose={closeModal} onSubmit={props.onSaveAirport} t={props.t} />)}
                      className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => props.onDeleteAirport(airport.id)}
                      className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {baseDataTab === 'airlines' && (
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 bg-slate-50/50">
              <h2 className="font-bold text-sm sm:text-base text-gray-900">Airlines ({filteredAirlines.length})</h2>
              <button
                onClick={() => openModal(<AirlineModal initialValue={{ id: '', name: '', code: '', logoUrl: '' }} onClose={closeModal} onSubmit={props.onSaveAirline} t={props.t} />)}
                className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" /> Add Airline
              </button>
            </div>
            <div className="max-h-96 overflow-auto divide-y divide-gray-100">
              {filteredAirlines.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-400">No airlines found.</div>
              ) : filteredAirlines.map((airline) => (
                <div key={airline.id} className="p-3.5 sm:px-5 sm:py-4 flex items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    <SafeAirlineLogo logoUrl={airline.logoUrl} airline={airline.name || airline.code} size="h-9 w-9 sm:h-10 sm:w-10" />
                    <div className="min-w-0">
                      <div className="truncate font-bold text-gray-900">{airline.name}</div>
                      <div className="text-xs text-gray-500 font-mono font-medium">{airline.code}</div>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <button
                      onClick={() => openModal(<AirlineModal initialValue={airline} onClose={closeModal} onSubmit={props.onSaveAirline} t={props.t} />)}
                      className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => props.onDeleteAirline(airline.id)}
                      className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {baseDataTab === 'flights' && (
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 bg-slate-50/50">
              <h2 className="font-bold text-sm sm:text-base text-gray-900">Predefined Flights ({filteredFlights.length})</h2>
              <button
                onClick={() => openModal(<FlightModal initialValue={{ id: '', airlineId: '', flightNumber: '', airline: '', originCode: '', destCode: '', departureTime: '', arrivalTime: '', date: '' }} airlines={props.savedAirlines} airports={props.savedAirports} onClose={closeModal} onSubmit={props.onSaveFlight} t={props.t} />)}
                className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" /> Add Flight
              </button>
            </div>
            <div className="max-h-96 overflow-auto divide-y divide-gray-100">
              {filteredFlights.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-400">No flights found.</div>
              ) : filteredFlights.map((flight) => (
                <div key={flight.id} className="p-3.5 sm:px-5 sm:py-4 flex items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    <SafeAirlineLogo airline={flight.airline} size="w-9 h-9" />
                    <div className="min-w-0">
                      <div className="truncate font-bold text-gray-900">
                        {flight.flightNumber} • {flight.airline}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {flight.originCode} → {flight.destCode} {flight.date ? `| ${flight.date}` : ''}
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <button
                      onClick={() => openModal(<FlightModal initialValue={flight} airlines={props.savedAirlines} airports={props.savedAirports} onClose={closeModal} onSubmit={props.onSaveFlight} t={props.t} />)}
                      className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => props.onDeleteFlight(flight.id)}
                      className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

  const renderRevenue = () => {
    const [draft, setDraft] = [props.revenueConfig, props.setRevenueConfig];
    return (
      <div className="space-y-4">
        <PageHeader
          isRTL={isRTL}
          title={props.t('revenueModel')}
          description="Control fixed pricing, free limits, and tiered pricing bands from one panel."
          action={
            <button
              onClick={() => props.onSaveRevenueConfig(draft)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
            >
              <Save className="h-4 w-4" /> {props.t('save')} Configuration
            </button>
          }
        />
        <div className={`${card} p-4 sm:p-6 space-y-6`}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Pricing Model Type</label>
              <select
                value={draft.modelType}
                onChange={(e) => setDraft({ ...draft, modelType: e.target.value as any })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="FIXED">Fixed Price per Ticket</option>
                <option value="TIERED">Volume Tiered Pricing</option>
              </select>
            </div>
            <TextInput
              label="Fixed Price ($)"
              type="number"
              step="0.01"
              value={draft.fixedPrice}
              onChange={(e) => setDraft({ ...draft, fixedPrice: Number(e.target.value) || 0 })}
            />
            <TextInput
              label="Global Free Tickets Limit"
              type="number"
              value={draft.globalFreeLimit}
              onChange={(e) => setDraft({ ...draft, globalFreeLimit: Number(e.target.value) || 0 })}
            />
          </div>

          <div className="border-t border-slate-100 pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-sm sm:text-base text-gray-900">Volume Tiered Pricing Bands</h2>
              <button
                type="button"
                onClick={() =>
                  setDraft({
                    ...draft,
                    tiers: [
                      ...draft.tiers,
                      {
                        id: `tier_${Date.now()}`,
                        minQty: (draft.tiers[draft.tiers.length - 1]?.maxQty || 0) + 1,
                        maxQty: null,
                        pricePerTicket: 5
                      }
                    ]
                  })
                }
                className="inline-flex items-center gap-1 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100"
              >
                <Plus className="h-3.5 w-3.5" /> Add Tier
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-start font-bold">Min Qty</th>
                    <th className="px-4 py-3 text-start font-bold">Max Qty</th>
                    <th className="px-4 py-3 text-start font-bold">Price / Ticket</th>
                    <th className="px-4 py-3 text-end font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {draft.tiers.map((tier, index) => (
                    <tr key={tier.id || index} className="hover:bg-slate-50/70">
                      <td className="px-4 py-2.5 text-start">
                        <input
                          type="number"
                          value={tier.minQty}
                          onChange={(e) => {
                            const newTiers = [...draft.tiers];
                            newTiers[index] = { ...tier, minQty: Number(e.target.value) || 0 };
                            setDraft({ ...draft, tiers: newTiers });
                          }}
                          className="w-24 rounded-lg border border-slate-300 px-2.5 py-1 text-xs"
                        />
                      </td>
                      <td className="px-4 py-2.5 text-start">
                        <input
                          type="number"
                          value={tier.maxQty || ''}
                          placeholder="No max"
                          onChange={(e) => {
                            const newTiers = [...draft.tiers];
                            newTiers[index] = { ...tier, maxQty: e.target.value ? Number(e.target.value) : null };
                            setDraft({ ...draft, tiers: newTiers });
                          }}
                          className="w-28 rounded-lg border border-slate-300 px-2.5 py-1 text-xs"
                        />
                      </td>
                      <td className="px-4 py-2.5 text-start">
                        <input
                          type="number"
                          step="0.01"
                          value={tier.pricePerTicket}
                          onChange={(e) => {
                            const newTiers = [...draft.tiers];
                            newTiers[index] = { ...tier, pricePerTicket: Number(e.target.value) || 0 };
                            setDraft({ ...draft, tiers: newTiers });
                          }}
                          className="w-24 rounded-lg border border-slate-300 px-2.5 py-1 text-xs"
                        />
                      </td>
                      <td className="px-4 py-2.5 text-end">
                        <div className="flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              const newTiers = draft.tiers.filter((_, i) => i !== index);
                              setDraft({ ...draft, tiers: newTiers });
                            }}
                            className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 transition"
                            title="Delete Tier"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPricing = () => {
    const defaultPricing: TicketPricingConfig = {
      defaultCurrency: 'IRR',
      domesticPriceIrr: 500000,
      domesticPriceUsd: 10,
      internationalPriceIrr: 1500000,
      internationalPriceUsd: 25,
      exchangeRateUsdToIrr: 900000,
      customAirlinePrices: [
        { id: 'ap_1', airlineCode: 'W5', airlineName: 'Mahan Air (هواپیمایی ماهان)', priceIrr: 600000, priceUsd: 12, isActive: true },
        { id: 'ap_2', airlineCode: 'IR', airlineName: 'Iran Air (هما ایران ایر)', priceIrr: 550000, priceUsd: 11, isActive: true },
        { id: 'ap_3', airlineCode: 'TK', airlineName: 'Turkish Airlines (ترکیش ایرلاینز)', priceIrr: 2000000, priceUsd: 35, isActive: true },
        { id: 'ap_4', airlineCode: 'EK', airlineName: 'Emirates (هواپیمایی امارات)', priceIrr: 2500000, priceUsd: 40, isActive: true },
        { id: 'ap_5', airlineCode: 'FZ', airlineName: 'Flydubai (فلای دبی)', priceIrr: 1800000, priceUsd: 30, isActive: true },
        { id: 'ap_6', airlineCode: 'QR', airlineName: 'Qatar Airways (قطر ایرویز)', priceIrr: 2500000, priceUsd: 40, isActive: true }
      ]
    };

    const currentPricing = props.ticketPricingConfig || defaultPricing;
    const [draft, setDraft] = useState<TicketPricingConfig>(currentPricing);
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [newAirlineCode, setNewAirlineCode] = useState('');
    const [newAirlineName, setNewAirlineName] = useState('');
    const [newPriceIrr, setNewPriceIrr] = useState(700000);
    const [newPriceUsd, setNewPriceUsd] = useState(15);

    useEffect(() => {
      if (props.ticketPricingConfig) {
        setDraft(props.ticketPricingConfig);
      }
    }, [props.ticketPricingConfig]);

    const handleSave = async () => {
      setSaving(true);
      setSaveMessage('');
      try {
        if (props.onSaveTicketPricing) {
          await props.onSaveTicketPricing(draft);
        }
        if (props.setTicketPricingConfig) {
          props.setTicketPricingConfig(draft);
        }
        setSaveMessage('تنظیمات نرخ‌گذاری بلیت‌ها با موفقیت ذخیره شد.');
        setTimeout(() => setSaveMessage(''), 4000);
      } catch (err: any) {
        setSaveMessage('خطا در ذخیره نرخ‌گذاری: ' + (err.message || ''));
      } finally {
        setSaving(false);
      }
    };

    const handleAddAirlineRule = () => {
      if (!newAirlineCode.trim() || !newAirlineName.trim()) return;
      const newRule: CustomAirlinePrice = {
        id: `ap_${Date.now()}`,
        airlineCode: newAirlineCode.trim().toUpperCase(),
        airlineName: newAirlineName.trim(),
        priceIrr: Number(newPriceIrr) || 0,
        priceUsd: Number(newPriceUsd) || 0,
        isActive: true
      };
      setDraft(prev => ({
        ...prev,
        customAirlinePrices: [newRule, ...prev.customAirlinePrices]
      }));
      setNewAirlineCode('');
      setNewAirlineName('');
    };

    return (
      <div className="space-y-6">
        <PageHeader
          isRTL={isRTL}
          title={isRTL ? 'نرخ‌گذاری و قیمت بلیط‌ها' : 'Ticket Pricing & Rates'}
          description={
            isRTL
              ? 'تنظیم بهای بلیت‌ها به ریال و دلار، نرخ تبدیل ارز و اولویت کسر هوشمند از اعتبار هدیه و اصلی'
              : 'Configure ticket prices in IRR and USD, exchange rates, and credit deduction rules.'
          }
          action={
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 shadow-md transition disabled:opacity-60"
            >
              <Save className="h-4 w-4" /> {saving ? 'در حال ذخیره...' : 'ذخیره نرخ‌گذاری بلیت‌ها'}
            </button>
          }
        />

        {saveMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 text-sm font-medium border border-emerald-200 flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{saveMessage}</span>
          </div>
        )}

        {/* Priority Deduction Logic Highlight */}
        <div className="rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 p-5 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-200">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">
                قانون کسر اعتبار: اولویت با اعتبار هدیه و سپس اعتبار اصلی
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-700 leading-relaxed">
                هنگامی که هر کاربر اقدام به صدور یا دانلود بلیت می‌کند:
                <br />
                <span className="font-bold text-amber-900">۱. ابتدا از «اعتبار هدیه» (Gift Credit) کسر می‌شود.</span>
                <br />
                <span className="font-bold text-blue-900">۲. در صورتی که اعتبار هدیه کاربر ناکافی باشد، مابقی هزینه بلیت به صورت خودکار از «اعتبار اصلی» (Main Credit) کسر می‌گردد.</span>
                <br />
                <span>۳. اگر مجموع اعتبار هدیه و اصلی کمتر از قیمت بلیت باشد، صدور بلیت مسدود و پیام افزایش موجودی نمایش داده می‌شود.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`${card} p-4.5 bg-gradient-to-br from-blue-50/50 to-white`}>
            <div className="text-xs text-slate-500 font-semibold mb-1">بلیت پروازهای داخلی (ریال و دلار)</div>
            <div className="text-lg font-black text-blue-700">{draft.domesticPriceIrr.toLocaleString()} ریال</div>
            <div className="text-xs font-bold text-slate-600 mt-0.5">${draft.domesticPriceUsd} USD</div>
          </div>
          <div className={`${card} p-4.5 bg-gradient-to-br from-indigo-50/50 to-white`}>
            <div className="text-xs text-slate-500 font-semibold mb-1">بلیت پروازهای خارجی (ریال و دلار)</div>
            <div className="text-lg font-black text-indigo-700">{draft.internationalPriceIrr.toLocaleString()} ریال</div>
            <div className="text-xs font-bold text-slate-600 mt-0.5">${draft.internationalPriceUsd} USD</div>
          </div>
          <div className={`${card} p-4.5 bg-gradient-to-br from-emerald-50/50 to-white`}>
            <div className="text-xs text-slate-500 font-semibold mb-1">نرخ تبدیل دلار به ریال</div>
            <div className="text-lg font-black text-emerald-700">{draft.exchangeRateUsdToIrr.toLocaleString()} ریال</div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">به ازای هر ۱ دلار آمریکا</div>
          </div>
          <div className={`${card} p-4.5 bg-gradient-to-br from-purple-50/50 to-white`}>
            <div className="text-xs text-slate-500 font-semibold mb-1">واحد پولی پیش‌فرض</div>
            <div className="text-lg font-black text-purple-700">{draft.defaultCurrency === 'IRR' ? 'ریال ایران (IRR)' : 'دلار آمریکا (USD)'}</div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">قابل انتخاب در صدور بلیت</div>
          </div>
        </div>

        {/* Main Price Inputs Card */}
        <div className={`${card} p-5 sm:p-6 space-y-6`}>
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Coins className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-gray-900">تعیین بهای پایه بلیت‌ها (داخلی و بین‌المللی)</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">واحد پولی پیش‌فرض سیستم</label>
              <select
                value={draft.defaultCurrency}
                onChange={(e) => setDraft({ ...draft, defaultCurrency: e.target.value as 'IRR' | 'USD' })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-medium"
              >
                <option value="IRR">ریال ایران (IRR - ریالی)</option>
                <option value="USD">دلار آمریکا (USD - $)</option>
              </select>
            </div>

            <TextInput
              label="نرخ تبدیل دلار به ریال (Exchange Rate)"
              type="number"
              value={draft.exchangeRateUsdToIrr}
              onChange={(e) => setDraft({ ...draft, exchangeRateUsdToIrr: Number(e.target.value) || 0 })}
            />

            <TextInput
              label="قیمت هر بلیت داخلی به ریال (Domestic IRR)"
              type="number"
              value={draft.domesticPriceIrr}
              onChange={(e) => setDraft({ ...draft, domesticPriceIrr: Number(e.target.value) || 0 })}
            />

            <TextInput
              label="قیمت هر بلیت داخلی به دلار (Domestic USD $)"
              type="number"
              step="0.01"
              value={draft.domesticPriceUsd}
              onChange={(e) => setDraft({ ...draft, domesticPriceUsd: Number(e.target.value) || 0 })}
            />

            <TextInput
              label="قیمت هر بلیت خارجی / بین‌المللی به ریال (International IRR)"
              type="number"
              value={draft.internationalPriceIrr}
              onChange={(e) => setDraft({ ...draft, internationalPriceIrr: Number(e.target.value) || 0 })}
            />

            <TextInput
              label="قیمت هر بلیت خارجی / بین‌المللی به دلار (International USD $)"
              type="number"
              step="0.01"
              value={draft.internationalPriceUsd}
              onChange={(e) => setDraft({ ...draft, internationalPriceUsd: Number(e.target.value) || 0 })}
            />
          </div>
        </div>

        {/* Custom Airline Pricing Table */}
        <div className={`${card} p-5 sm:p-6 space-y-5`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-gray-900">قیمت‌گذاری اختصاصی برای ایرلاین‌ها (Custom Airline Pricing)</h2>
              <p className="text-xs text-gray-500 mt-0.5">در صورت تعریف، بلیت پروازهای این ایرلاین بر اساس این نرخ محاسبه می‌شود.</p>
            </div>
          </div>

          {/* Add custom airline row */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">کد ایرلاین (IATA)</label>
              <input
                type="text"
                placeholder="مثال: W5"
                value={newAirlineCode}
                onChange={(e) => setNewAirlineCode(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs font-mono font-bold uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">نام ایرلاین</label>
              <input
                type="text"
                placeholder="مثال: هواپیمایی ماهان"
                value={newAirlineName}
                onChange={(e) => setNewAirlineName(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">قیمت ریالی (IRR)</label>
              <input
                type="number"
                value={newPriceIrr}
                onChange={(e) => setNewPriceIrr(Number(e.target.value) || 0)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">قیمت دلاری (USD $)</label>
              <input
                type="number"
                step="0.01"
                value={newPriceUsd}
                onChange={(e) => setNewPriceUsd(Number(e.target.value) || 0)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs"
              />
            </div>
            <div>
              <button
                type="button"
                onClick={handleAddAirlineRule}
                className="w-full rounded-xl bg-blue-600 text-white font-bold px-3 py-2 text-xs hover:bg-blue-700 transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> افزودن نرخ
              </button>
            </div>
          </div>

          {/* List of custom airline prices */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-start font-bold">ایرلاین</th>
                  <th className="px-4 py-3 text-start font-bold">کد IATA</th>
                  <th className="px-4 py-3 text-start font-bold">قیمت ریالی</th>
                  <th className="px-4 py-3 text-start font-bold">قیمت دلاری</th>
                  <th className="px-4 py-3 text-start font-bold">وضعیت</th>
                  <th className="px-4 py-3 text-end font-bold">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {draft.customAirlinePrices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-xs text-gray-400">
                      هیچ نرخ اختصاصی برای ایرلاین‌ها ثبت نشده است. نرخ پایه اعمال می‌شود.
                    </td>
                  </tr>
                ) : (
                  draft.customAirlinePrices.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 py-2.5 text-start font-semibold text-gray-800 text-xs">
                        <div className="flex items-center gap-2">
                          <SafeAirlineLogo airline={item.airlineName} logoUrl={item.airlineCode} size="w-7 h-7" />
                          <span>{item.airlineName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-start">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 rounded-md">
                          {item.airlineCode}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-start">
                        <input
                          type="number"
                          value={item.priceIrr}
                          onChange={(e) => {
                            const updated = [...draft.customAirlinePrices];
                            updated[idx] = { ...item, priceIrr: Number(e.target.value) || 0 };
                            setDraft({ ...draft, customAirlinePrices: updated });
                          }}
                          className="w-32 rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold"
                        />
                      </td>
                      <td className="px-4 py-2.5 text-start">
                        <input
                          type="number"
                          step="0.01"
                          value={item.priceUsd}
                          onChange={(e) => {
                            const updated = [...draft.customAirlinePrices];
                            updated[idx] = { ...item, priceUsd: Number(e.target.value) || 0 };
                            setDraft({ ...draft, customAirlinePrices: updated });
                          }}
                          className="w-24 rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold"
                        />
                      </td>
                      <td className="px-4 py-2.5 text-start">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...draft.customAirlinePrices];
                            updated[idx] = { ...item, isActive: !item.isActive };
                            setDraft({ ...draft, customAirlinePrices: updated });
                          }}
                          className={`text-xs px-2.5 py-1 rounded-full font-bold transition ${
                            item.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {item.isActive ? 'فعال' : 'غیرفعال'}
                        </button>
                      </td>
                      <td className="px-4 py-2.5 text-end">
                        <button
                          type="button"
                          onClick={() => {
                            setDraft({
                              ...draft,
                              customAirlinePrices: draft.customAirlinePrices.filter((_, i) => i !== idx)
                            });
                          }}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="حذف نرخ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderAds = () => (
    <div className="space-y-4">
      <PageHeader
        title={props.t('advertising')}
        description="Manage sponsor banners and promotional displays across the ticket interface."
        action={
          <button
            onClick={() => openModal(<AdModal initialValue={{ id: '', location: 'spot_1', title: '', description: '', ctaText: 'View', linkUrl: 'https://example.com', iconName: 'Sparkles', isActive: true }} onClose={closeModal} onSubmit={props.onSaveAd} t={props.t} />)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
          >
            <Plus className="h-4 w-4" /> {props.t('add')} Ad
          </button>
        }
      />
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        {props.ads.map((ad) => (
          <div key={ad.id} className={`${card} p-4 sm:p-5 flex flex-col justify-between space-y-3`}>
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">
                  {ad.location}
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    ad.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {ad.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <h3 className="mt-2 text-base font-bold text-gray-900">{ad.title}</h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-600 line-clamp-2">{ad.description}</p>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
              <span className="text-blue-600 font-semibold truncate max-w-[200px]">{ad.linkUrl}</span>
              <div className="flex gap-1.5 shrink-0">
                <button
                  onClick={() => openModal(<AdModal initialValue={ad} onClose={closeModal} onSubmit={props.onSaveAd} t={props.t} />)}
                  className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => props.onDeleteAd(ad.id)}
                  className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBlog = () => (
    <div className="space-y-4">
      <PageHeader
        title={props.t('manageBlog')}
        description="Draft and manage aviation travel guides, policy updates, and news."
        action={
          <button
            onClick={() => openModal(<BlogModal initialValue={{ id: '', title: '', excerpt: '', content: '', author: props.currentUser.name, date: '', imageUrl: '', status: 'Draft' }} onClose={closeModal} onSubmit={props.onSaveBlogPost} t={props.t} />)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
          >
            <Plus className="h-4 w-4" /> {props.t('addPost')}
          </button>
        }
      />
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        {props.blogPosts.map((post) => (
          <div key={post.id} className={`${card} overflow-hidden flex flex-col justify-between`}>
            {post.imageUrl && (
              <img src={post.imageUrl} alt={post.title} className="h-40 w-full object-cover" />
            )}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{post.author}</span>
                  <span>{post.date}</span>
                </div>
                <h3 className="mt-1 text-base font-bold text-gray-900">{post.title}</h3>
                <p className="mt-1 text-xs sm:text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
              </div>
              <div className="flex justify-end gap-1.5 border-t border-slate-100 pt-3">
                <button
                  onClick={() => openModal(<BlogModal initialValue={post} onClose={closeModal} onSubmit={props.onSaveBlogPost} t={props.t} />)}
                  className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => props.onDeleteBlogPost(post.id)}
                  className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-4">
      <PageHeader
        title={props.t('transactions')}
        description="Financial activity generated from issued tickets and payment methods."
        isRTL={isRTL}
      />
      <div className={`${card} p-4 sm:p-5 space-y-3`}>
        <div className="divide-y divide-slate-100">
          {props.tickets.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500">No transactions recorded yet.</div>
          ) : (
            props.tickets.map((ticket) => (
              <div key={ticket.id} className="py-3.5 flex items-center justify-between gap-4 text-sm">
                <div className="min-w-0 text-start">
                  <div className="font-bold text-gray-900 flex items-center gap-2">
                    <span className="font-mono text-blue-600">{ticket.ticketId}</span>
                    <span className="text-xs font-normal text-slate-500">({ticket.passengerName})</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">Payment: {ticket.paymentMethod} • Route: {ticket.route}</div>
                </div>
                <div className="text-end shrink-0">
                  <div className="font-bold text-gray-900 text-sm sm:text-base">{ticket.price}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{ticket.date}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => {
    const [footerDraft, setFooterDraft] = [props.footerConfig, props.setFooterConfig];
    return (
      <div className="space-y-5">
        <PageHeader
          title={props.t('settings')}
          description="Global footer contact info, social handles, and static CMS pages."
          isRTL={isRTL}
        />

        {/* Footer Contact Config */}
        <div className={`${card} p-4 sm:p-6 space-y-4`}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-base text-gray-900">Footer & Contact Settings</h2>
            <button
              onClick={() => props.onSaveFooter(footerDraft)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Save className="h-4 w-4" /> Save Footer
            </button>
          </div>
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            <TextInput label="Company Email" type="email" value={footerDraft.email} onChange={(e) => setFooterDraft({ ...footerDraft, email: e.target.value })} />
            <TextInput label="Phone Number" value={footerDraft.phone} onChange={(e) => setFooterDraft({ ...footerDraft, phone: e.target.value })} />
            <TextInput label="Address" value={footerDraft.address} onChange={(e) => setFooterDraft({ ...footerDraft, address: e.target.value })} />
            <TextInput label="Copyright Text" value={footerDraft.copyright} onChange={(e) => setFooterDraft({ ...footerDraft, copyright: e.target.value })} />
            <TextInput label="Facebook URL" value={footerDraft.facebook || ''} onChange={(e) => setFooterDraft({ ...footerDraft, facebook: e.target.value })} />
            <TextInput label="Twitter / X URL" value={footerDraft.twitter || ''} onChange={(e) => setFooterDraft({ ...footerDraft, twitter: e.target.value })} />
            <TextInput label="Instagram URL" value={footerDraft.instagram || ''} onChange={(e) => setFooterDraft({ ...footerDraft, instagram: e.target.value })} />
            <TextInput label="LinkedIn URL" value={footerDraft.linkedin || ''} onChange={(e) => setFooterDraft({ ...footerDraft, linkedin: e.target.value })} />
          </div>
          <TextArea label="Footer Description" rows={2} value={footerDraft.description} onChange={(e) => setFooterDraft({ ...footerDraft, description: e.target.value })} />
        </div>

        {/* Static Pages */}
        <div className={`${card} p-4 sm:p-6 space-y-4`}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-base text-gray-900">Static CMS Pages</h2>
            <button
              onClick={() => openModal(<StaticPageModal initialValue={{ id: '', slug: '', title: '', content: '' }} onClose={closeModal} onSubmit={props.onSaveStaticPage} t={props.t} />)}
              className="inline-flex items-center gap-1 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100"
            >
              <Plus className="h-4 w-4" /> Add Page
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {props.staticPages.map((page) => (
              <div key={page.id || page.slug} className="rounded-2xl border border-gray-200 p-4 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-bold text-gray-900 text-sm truncate">{page.title}</div>
                  <div className="text-xs text-gray-500 font-mono">/{page.slug}</div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => openModal(<StaticPageModal initialValue={page} onClose={closeModal} onSubmit={props.onSaveStaticPage} t={props.t} />)}
                    className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  {page.id && (
                    <button
                      onClick={() => props.onDeleteStaticPage(page.id!)}
                      className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'tickets':
        return renderTickets();
      case 'users':
        return renderUsers();
      case 'passengers':
        return renderPassengers();
      case 'basedata':
        return renderBaseData();
      case 'revenue':
        return renderRevenue();
      case 'advertising':
        return renderAds();
      case 'transactions':
        return renderTransactions();
      case 'blog':
        return renderBlog();
      case 'settings':
        return renderSettings();
      case 'overview':
      default:
        return renderOverview();
    }
  };

  const activeNav = navTabs.find((t) => t.id === activeTab) || navTabs[0];

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative">
      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden transition-opacity"
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar (Permanent on Desktop, Drawer on Mobile) */}
      <aside
        className={`fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-50 w-72 max-w-[85vw] bg-white border-slate-200 shadow-2xl md:shadow-none transition-transform duration-300 md:static md:translate-x-0 md:h-screen md:sticky md:top-0 flex flex-col ${
          isRTL ? 'md:border-l' : 'md:border-r'
        } ${isSidebarOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'}`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="block text-sm font-black tracking-tight text-slate-900">ADMIN PANEL</span>
              <span className="block text-xs text-slate-400 truncate">{props.currentUser.name}</span>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden rounded-xl p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
            aria-label="Close drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Back to Generator button */}
        {props.onBackToGenerator && (
          <div className="p-3 border-b border-slate-100">
            <button
              onClick={props.onBackToGenerator}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition"
            >
              {isRTL ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
              <span>{isRTL ? 'بازگشت به صدور بلیت' : 'Back to Generator'}</span>
            </button>
          </div>
        )}

        {/* Sidebar Nav Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navTabs.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium transition ${
                  active
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`h-4 w-4 sm:h-5 sm:w-5 shrink-0 ${active ? 'text-white' : 'text-slate-500'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer info */}
        <div className="p-3 border-t border-slate-100 text-[11px] text-slate-400 text-center">
          SkyTicket System v1.0
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Mobile Top App Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:hidden">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm active:scale-95 transition"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <div className="text-sm font-bold text-slate-900 truncate">{activeNav.label}</div>
              <div className="text-[11px] text-slate-400">Admin Control</div>
            </div>
          </div>
          {props.onBackToGenerator && (
            <button
              onClick={props.onBackToGenerator}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 rounded-xl"
            >
              <Plane className="h-3.5 w-3.5" />
              <span>Generator</span>
            </button>
          )}
        </div>

        {/* Quick Horizontal Scroll Nav for Tablet/Mobile */}
        <div className="md:hidden border-b border-slate-200 bg-white/60 px-3 py-2 overflow-x-auto no-scrollbar flex gap-2">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  active ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Content View */}
        <div className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveTabContent()}
        </div>
      </main>

      {/* Render active modal */}
      {modal}
    </div>
  );
};
