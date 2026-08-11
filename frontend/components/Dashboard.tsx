import React, { useEffect, useMemo, useState } from 'react';
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
} from 'lucide-react';
import { Airline, Airport, BlogPost, FooterConfig, RevenueConfig, SavedFlight, SavedPassenger, StaticPage, TicketHistoryItem, TicketTemplate, Ad, User } from '../types';

interface DashboardProps {
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
  lang: string;
  t: (key: any) => string;
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
}

type ModalChildProps<T> = {
  initialValue: T;
  onClose: () => void;
  onSubmit: (value: T) => Promise<void>;
  t: (key: any) => string;
};

const ModalShell = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <button onClick={onClose} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <X className="h-5 w-5" />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const TextInput = ({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
  <label className="block text-sm font-medium text-gray-700">
    <span className="mb-1 block">{label}</span>
    <input {...props} className={`w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${props.className || ''}`} />
  </label>
);

const TextArea = ({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) => (
  <label className="block text-sm font-medium text-gray-700">
    <span className="mb-1 block">{label}</span>
    <textarea {...props} className={`w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${props.className || ''}`} />
  </label>
);

function UserModal({ initialValue, onClose, onSubmit, t }: ModalChildProps<User & { password?: string }>) {
  const [form, setForm] = useState<User & { password?: string }>(initialValue);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');

    if (!form.id && !form.password?.trim()) {
      setError('Password is required for new users.');
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim(),
        password: form.password?.trim() || undefined
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
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput label={t('fullName')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <TextInput label={t('mobileNumber')} value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
        <TextInput label={t('emailText')} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <div>
          <TextInput label={t('password')} type="password" value={form.password || ''} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={form.id ? 'Leave blank to keep current password' : ''} />
          <p className="mt-1 text-xs text-gray-500">{form.id ? 'Fill this field only if you want to change the password.' : 'New users must have a password with at least 6 characters.'}</p>
        </div>
        <label className="block text-sm font-medium text-gray-700">
          <span className="mb-1 block">Role</span>
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as User['role'] })} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
            <option value="Admin">Admin</option>
            <option value="Agent">Agent</option>
            <option value="User">User</option>
          </select>
        </label>
        <label className="block text-sm font-medium text-gray-700">
          <span className="mb-1 block">Status</span>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as User['status'] })} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </label>
        <TextInput label={t('credit')} type="number" value={form.credit} onChange={(e) => setForm({ ...form, credit: Number(e.target.value) })} />
        <TextInput label="Bonus Free Tickets" type="number" value={form.bonusFreeTickets || 0} onChange={(e) => setForm({ ...form, bonusFreeTickets: Number(e.target.value) })} />
        <label className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-3 text-sm font-medium text-gray-700">
          <input type="checkbox" checked={Boolean(form.isUnlimited)} onChange={(e) => setForm({ ...form, isUnlimited: e.target.checked })} />
          Unlimited credit access
        </label>
      </div>
      {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onClose} className="rounded-xl bg-gray-100 px-4 py-2 font-semibold text-gray-700">{t('cancel')}</button>
        <button onClick={submit} disabled={saving} className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-60">{saving ? 'Saving...' : t('save')}</button>
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
      await onSubmit(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell title={form.id ? t('edit') : t('add')} onClose={onClose}>
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput label={t('firstName')} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
        <TextInput label={t('lastName')} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
        <label className="block text-sm font-medium text-gray-700">
          <span className="mb-1 block">Gender</span>
          <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </label>
        <TextInput label={t('passport')} value={form.passportNumber} onChange={(e) => setForm({ ...form, passportNumber: e.target.value })} />
        <TextInput label={t('nationality')} value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} />
        <TextInput label="Total Flights" type="number" value={form.totalFlights} onChange={(e) => setForm({ ...form, totalFlights: Number(e.target.value) })} />
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onClose} className="rounded-xl bg-gray-100 px-4 py-2 font-semibold text-gray-700">{t('cancel')}</button>
        <button onClick={submit} disabled={saving} className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-60">{saving ? 'Saving...' : t('save')}</button>
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
      await onSubmit(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell title={form.id ? t('edit') : t('addAirport')} onClose={onClose}>
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput label={t('airportName')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <TextInput label={t('code')} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
        <TextInput label={t('city')} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <TextInput label={t('country')} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onClose} className="rounded-xl bg-gray-100 px-4 py-2 font-semibold text-gray-700">{t('cancel')}</button>
        <button onClick={submit} disabled={saving} className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-60">{saving ? 'Saving...' : t('save')}</button>
      </div>
    </ModalShell>
  );
}

function AirlineModal({ initialValue, onClose, onSubmit, t }: ModalChildProps<Airline>) {
  const [form, setForm] = useState<Airline>(initialValue);
  const [saving, setSaving] = useState(false);
  const upload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((prev) => ({ ...prev, logoUrl: reader.result as string }));
    reader.readAsDataURL(file);
  };
  const submit = async () => {
    setSaving(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell title={form.id ? t('edit') : t('addAirline')} onClose={onClose}>
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput label={t('airlineName')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <TextInput label={t('airlineCode')} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
        <div className="md:col-span-2">
          <TextInput label={t('imageUrl')} value={form.logoUrl || ''} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} />
          <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
            <Upload className="h-4 w-4" />
            <span>Upload logo</span>
            <input type="file" accept="image/*" className="hidden" onChange={upload} />
          </label>
          {form.logoUrl && <img src={form.logoUrl} alt={form.name} className="mt-3 h-20 rounded-xl border border-gray-200 bg-gray-50 p-2" />}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onClose} className="rounded-xl bg-gray-100 px-4 py-2 font-semibold text-gray-700">{t('cancel')}</button>
        <button onClick={submit} disabled={saving} className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-60">{saving ? 'Saving...' : t('save')}</button>
      </div>
    </ModalShell>
  );
}

function FlightModal({ initialValue, onClose, onSubmit, t, airlines, airports }: ModalChildProps<SavedFlight> & { airlines: Airline[]; airports: Airport[] }) {
  const [form, setForm] = useState<SavedFlight>(initialValue);
  const [saving, setSaving] = useState(false);
  const submit = async () => {
    setSaving(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell title={form.id ? t('edit') : t('addFlight')} onClose={onClose}>
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput label={t('flightNumber')} value={form.flightNumber} onChange={(e) => setForm({ ...form, flightNumber: e.target.value })} />
        <label className="block text-sm font-medium text-gray-700">
          <span className="mb-1 block">{t('airline')}</span>
          <select
            value={form.airlineId || ''}
            onChange={(e) => {
              const selected = airlines.find((item) => item.id === e.target.value);
              setForm({ ...form, airlineId: e.target.value, airline: selected?.name || '' });
            }}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Select airline</option>
            {airlines.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
        <label className="block text-sm font-medium text-gray-700">
          <span className="mb-1 block">Origin</span>
          <select value={form.originCode} onChange={(e) => setForm({ ...form, originCode: e.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
            <option value="">Select origin</option>
            {airports.map((item) => <option key={item.id} value={item.code}>{item.city} ({item.code})</option>)}
          </select>
        </label>
        <label className="block text-sm font-medium text-gray-700">
          <span className="mb-1 block">Destination</span>
          <select value={form.destCode} onChange={(e) => setForm({ ...form, destCode: e.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
            <option value="">Select destination</option>
            {airports.map((item) => <option key={item.id} value={item.code}>{item.city} ({item.code})</option>)}
          </select>
        </label>
        <TextInput label={t('departure')} type="time" value={form.departureTime} onChange={(e) => setForm({ ...form, departureTime: e.target.value })} />
        <TextInput label={t('arrival')} type="time" value={form.arrivalTime} onChange={(e) => setForm({ ...form, arrivalTime: e.target.value })} />
        <TextInput label={t('date')} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onClose} className="rounded-xl bg-gray-100 px-4 py-2 font-semibold text-gray-700">{t('cancel')}</button>
        <button onClick={submit} disabled={saving} className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-60">{saving ? 'Saving...' : t('save')}</button>
      </div>
    </ModalShell>
  );
}

function BlogModal({ initialValue, onClose, onSubmit, t }: ModalChildProps<BlogPost>) {
  const [form, setForm] = useState<BlogPost>(initialValue);
  const [saving, setSaving] = useState(false);
  const upload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((prev) => ({ ...prev, imageUrl: reader.result as string }));
    reader.readAsDataURL(file);
  };
  const submit = async () => {
    setSaving(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell title={form.id ? t('edit') : t('addPost')} onClose={onClose}>
      <div className="space-y-4">
        <TextInput label={t('postTitle')} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <TextArea label={t('excerpt')} rows={3} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
        <TextArea label={t('postContent')} rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput label={t('author')} value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
          <label className="block text-sm font-medium text-gray-700">
            <span className="mb-1 block">Status</span>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as BlogPost['status'] })} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </label>
        </div>
        <TextInput label={t('imageUrl')} value={form.imageUrl || ''} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
          <Upload className="h-4 w-4" />
          <span>Upload image</span>
          <input type="file" accept="image/*" className="hidden" onChange={upload} />
        </label>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onClose} className="rounded-xl bg-gray-100 px-4 py-2 font-semibold text-gray-700">{t('cancel')}</button>
        <button onClick={submit} disabled={saving} className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-60">{saving ? 'Saving...' : t('save')}</button>
      </div>
    </ModalShell>
  );
}

function AdModal({ initialValue, onClose, onSubmit, t }: ModalChildProps<Ad>) {
  const [form, setForm] = useState<Ad>(initialValue);
  const [saving, setSaving] = useState(false);
  const upload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((prev) => ({ ...prev, imageUrl: reader.result as string }));
    reader.readAsDataURL(file);
  };
  const submit = async () => {
    setSaving(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell title={form.id ? t('edit') : t('add')} onClose={onClose}>
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          <span className="mb-1 block">Location</span>
          <select value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value as Ad['location'] })} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
            <option value="spot_1">spot_1</option>
            <option value="spot_2">spot_2</option>
            <option value="spot_3">spot_3</option>
            <option value="spot_4">spot_4</option>
            <option value="spot_popup">spot_popup</option>
            <option value="spot_bottom_1">spot_bottom_1</option>
            <option value="spot_bottom_2">spot_bottom_2</option>
            <option value="spot_bottom_3">spot_bottom_3</option>
          </select>
        </label>
        <TextInput label={t('title')} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <TextArea label={t('description')} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput label="CTA" value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} />
          <TextInput label="Link URL" value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} />
          <TextInput label="Gradient From" value={form.colorFrom || ''} onChange={(e) => setForm({ ...form, colorFrom: e.target.value })} />
          <TextInput label="Gradient To" value={form.colorTo || ''} onChange={(e) => setForm({ ...form, colorTo: e.target.value })} />
        </div>
        <TextInput label={t('imageUrl')} value={form.imageUrl || ''} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
          <Upload className="h-4 w-4" />
          <span>Upload image</span>
          <input type="file" accept="image/*" className="hidden" onChange={upload} />
        </label>
        <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
          Active banner
        </label>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onClose} className="rounded-xl bg-gray-100 px-4 py-2 font-semibold text-gray-700">{t('cancel')}</button>
        <button onClick={submit} disabled={saving} className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-60">{saving ? 'Saving...' : t('save')}</button>
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
      await onSubmit(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell title={form.id ? t('edit') : 'Add page'} onClose={onClose}>
      <div className="space-y-4">
        <TextInput label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        <TextInput label={t('title')} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <TextArea label={t('postContent')} rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onClose} className="rounded-xl bg-gray-100 px-4 py-2 font-semibold text-gray-700">{t('cancel')}</button>
        <button onClick={submit} disabled={saving} className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-60">{saving ? 'Saving...' : t('save')}</button>
      </div>
    </ModalShell>
  );
}

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any; label: string; active: boolean; onClick: () => void }) => (
  <button onClick={onClick} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${active ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
    <Icon className="h-5 w-5" />
    <span className="truncate">{label}</span>
  </button>
);

const card = 'rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-200/60';
const tableWrap = 'overflow-x-auto rounded-3xl';
const MOBILE_BREAKPOINT = 768;

const PageHeader = ({ title, description, action, isRTL = false }: { title: string; description?: string; action?: React.ReactNode; isRTL?: boolean }) => (
  <div className={`flex flex-col gap-4 ${isRTL ? 'md:flex-row-reverse' : 'md:flex-row'} md:items-start md:justify-between`}>
    <div className="min-w-0">
      <h1 className={`text-2xl font-black tracking-tight text-slate-900 ${isRTL ? 'text-right' : ''}`}>{title}</h1>
      {description && <p className={`mt-1 text-sm text-slate-500 ${isRTL ? 'text-right' : ''}`}>{description}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

const SectionCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`${card} ${className}`}>{children}</div>
);

export const Dashboard = (props: DashboardProps) => {
  const isRTL = props.lang === 'fa' || props.lang === 'ar';
  const [activeTab, setActiveTab] = useState('overview');
  const [baseDataTab, setBaseDataTab] = useState<'airports' | 'airlines' | 'flights'>('airports');
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [modal, setModal] = useState<React.ReactNode | null>(null);

  useEffect(() => {
    let previousIsMobile: boolean | null = null;

    const syncViewport = (mobile: boolean) => {
      setIsMobile(mobile);
      setIsSidebarOpen((currentValue) => {
        if (previousIsMobile === null || previousIsMobile !== mobile) {
          return !mobile;
        }

        return currentValue;
      });
      previousIsMobile = mobile;
    };

    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const handleViewportChange = (event: MediaQueryListEvent) => syncViewport(event.matches);

    syncViewport(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleViewportChange);

    return () => mediaQuery.removeEventListener('change', handleViewportChange);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const totalRevenue = useMemo(() => props.tickets.reduce((sum, ticket) => {
    const numericValue = Number(ticket.price.replace(/[^0-9.-]+/g, '')) || 0;
    return sum + numericValue;
  }, 0), [props.tickets]);

  const overviewCards = [
    { label: 'Users', value: props.users.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Tickets', value: props.tickets.length, icon: Ticket, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Passengers', value: props.savedPassengers.length, icon: UserCheck, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const openModal = (node: React.ReactNode) => setModal(node);
  const closeModal = () => setModal(null);

  const renderOverview = () => (
    <div className="space-y-6">
      <PageHeader title={props.t('overview')} description="Connected view of admin data, forms, and actions." isRTL={isRTL} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map((item) => (
          <SectionCard key={item.label} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                <h3 className="mt-2 text-2xl font-black text-slate-900">{item.value}</h3>
              </div>
              <div className={`rounded-2xl p-3 ${item.bg} ${item.color}`}>
                <item.icon className="h-6 w-6" />
              </div>
            </div>
          </SectionCard>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard className="p-5">
          <div className="mb-4 flex items-center gap-2 text-slate-900"><TrendingUp className="h-5 w-5 text-green-600" /> <span className="font-semibold">Quick metrics</span></div>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex justify-between"><span>Active ads</span><span className="font-semibold text-gray-900">{props.ads.filter((ad) => ad.isActive).length}</span></div>
            <div className="flex justify-between"><span>Blog posts</span><span className="font-semibold text-gray-900">{props.blogPosts.length}</span></div>
            <div className="flex justify-between"><span>Static pages</span><span className="font-semibold text-gray-900">{props.staticPages.length}</span></div>
            <div className="flex justify-between"><span>Pricing model</span><span className="font-semibold text-gray-900">{props.revenueConfig.modelType}</span></div>
          </div>
        </SectionCard>
        <SectionCard className="p-5">
          <div className="mb-4 flex items-center gap-2 text-slate-900"><Eye className="h-5 w-5 text-blue-600" /> <span className="font-semibold">Latest tickets</span></div>
          <div className="space-y-3">
            {props.tickets.slice(0, 5).map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm">
                <div>
                  <div className="font-semibold text-gray-900">{ticket.passengerName}</div>
                  <div className="text-gray-500">{ticket.route}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{ticket.price}</div>
                  <div className="text-gray-500">{ticket.date}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );

  const renderTickets = () => (
    <div className="space-y-4">
      <PageHeader title={props.t('ticketManagement')} description="Issued tickets, passenger routes, and print actions in one place." isRTL={isRTL} />
      <div className={`${card} ${tableWrap}`}>
        <table className="min-w-[760px] w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-5 py-4">{props.t('ticketId')}</th>
              <th className="px-5 py-4">{props.t('passenger')}</th>
              <th className="px-5 py-4">{props.t('route')}</th>
              <th className="px-5 py-4">{props.t('date')}</th>
              <th className="px-5 py-4 text-right">{props.t('action')}</th>
            </tr>
          </thead>
          <tbody>
            {props.tickets.map((ticket) => (
              <tr key={ticket.id} className="border-t border-gray-100">
                <td className="px-5 py-4 font-mono">{ticket.ticketId}</td>
                <td className="px-5 py-4 font-semibold text-gray-900">{ticket.passengerName}</td>
                <td className="px-5 py-4">{ticket.route}</td>
                <td className="px-5 py-4">{ticket.date}</td>
                <td className="px-5 py-4 text-right">
                  <button onClick={() => props.onDownloadTicket(ticket)} className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100">
                    <Printer className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-4">
      <PageHeader
        isRTL={isRTL}
        title={props.t('userManagement')}
        description="Manage admin, agent, and user accounts with credit and permissions."
        action={<button onClick={() => openModal(<UserModal initialValue={{ id: '', name: '', email: '', mobile: '', role: 'User', status: 'Active', credit: 0, isUnlimited: false, bonusFreeTickets: 0, permissions: [], password: '' }} onClose={closeModal} onSubmit={props.onSaveUser} t={props.t} />)} className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"><Plus className="h-4 w-4" /> {props.t('add')}</button>}
      />
      <div className={`${card} ${tableWrap}`}>
        <table dir={isRTL ? 'rtl' : 'ltr'} className="min-w-[820px] w-full text-sm">
          <thead className={`${isRTL ? 'text-right' : 'text-left'} bg-gray-50 text-gray-500`}><tr><th className="ps-10 pe-6 py-4">{props.t('fullName')}</th><th className="px-5 py-4">Role</th><th className="px-5 py-4">{props.t('credit')}</th><th className="px-5 py-4">Status</th><th className={`ps-6 pe-10 py-4 ${isRTL ? 'text-left' : 'text-right'}`}>{props.t('action')}</th></tr></thead>
          <tbody>
            {props.users.map((user) => (
              <tr key={user.id} className="border-t border-gray-100">
                <td className="ps-10 pe-6 py-4">
                  <div className="flex items-center gap-2 font-semibold text-gray-900">{user.name}{user.isUnlimited && <Infinity className="h-4 w-4 text-blue-600" />}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </td>
                <td className="px-5 py-4">{user.role}</td>
                <td className="px-5 py-4">{user.isUnlimited ? 'Unlimited' : `$${user.credit}`}</td>
                <td className="px-5 py-4">{user.status}</td>
                <td className={`ps-6 pe-10 py-4 ${isRTL ? 'text-left' : 'text-right'}`}>
                  <div className={`flex gap-2 ${isRTL ? 'justify-start' : 'justify-end'}`}>
                    <button onClick={() => openModal(<UserModal initialValue={{ ...user, password: '' }} onClose={closeModal} onSubmit={props.onSaveUser} t={props.t} />)} className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => props.onToggleUserStatus(user.id)} className={`rounded-lg p-2 ${user.status === 'Active' ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'}`}>{user.status === 'Active' ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}</button>
                    <button onClick={() => props.onDeleteUser(user.id)} className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPassengers = () => (
    <div className="space-y-4">
      <PageHeader
        isRTL={isRTL}
        title={props.t('frequentFlyers')}
        description="Saved passenger records for faster ticket creation and edits."
        action={<button onClick={() => openModal(<PassengerModal initialValue={{ id: '', firstName: '', lastName: '', gender: 'Male', passportNumber: '', nationality: '', totalFlights: 0 }} onClose={closeModal} onSubmit={props.onSavePassenger} t={props.t} />)} className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"><Plus className="h-4 w-4" /> {props.t('add')}</button>}
      />
      <div className={`${card} ${tableWrap}`}>
        <table className="min-w-[760px] w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500"><tr><th className="px-5 py-4">{props.t('firstName')}</th><th className="px-5 py-4">{props.t('lastName')}</th><th className="px-5 py-4">{props.t('passport')}</th><th className="px-5 py-4">{props.t('nationality')}</th><th className="px-5 py-4 text-right">{props.t('action')}</th></tr></thead>
          <tbody>
            {props.savedPassengers.map((passenger) => (
              <tr key={passenger.id} className="border-t border-gray-100">
                <td className="px-5 py-4 font-semibold text-gray-900">{passenger.firstName}</td>
                <td className="px-5 py-4 font-semibold text-gray-900">{passenger.lastName}</td>
                <td className="px-5 py-4 font-mono">{passenger.passportNumber}</td>
                <td className="px-5 py-4">{passenger.nationality}</td>
                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openModal(<PassengerModal initialValue={passenger} onClose={closeModal} onSubmit={props.onSavePassenger} t={props.t} />)} className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => props.onDeletePassenger(passenger.id)} className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBaseData = () => (
    <div className="space-y-6">
      <PageHeader title={props.t('baseData')} description="Airports, airlines, and flights are grouped into cleaner tabs for faster management." isRTL={isRTL} />
      <div className={`${card} p-5`}>
        <div className="mb-5 flex flex-wrap gap-3">
          <button onClick={() => setBaseDataTab('airports')} className={`rounded-2xl px-4 py-2.5 text-sm font-semibold ${baseDataTab === 'airports' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>Airports</button>
          <button onClick={() => setBaseDataTab('airlines')} className={`rounded-2xl px-4 py-2.5 text-sm font-semibold ${baseDataTab === 'airlines' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>Airlines</button>
          <button onClick={() => setBaseDataTab('flights')} className={`rounded-2xl px-4 py-2.5 text-sm font-semibold ${baseDataTab === 'flights' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>Flights</button>
        </div>

        {baseDataTab === 'airports' && (
        <div className="overflow-hidden rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4"><h2 className="font-semibold text-gray-900">Airports</h2><button onClick={() => openModal(<AirportModal initialValue={{ id: '', name: '', code: '', city: '', country: '' }} onClose={closeModal} onSubmit={props.onSaveAirport} t={props.t} />)} className="rounded-lg bg-indigo-50 p-2 text-indigo-600"><Plus className="h-4 w-4" /></button></div>
          <div className="max-h-80 overflow-auto">
            {props.savedAirports.map((airport) => <div key={airport.id} className={`flex flex-col gap-3 border-t border-gray-100 px-5 py-4 text-sm md:items-center md:justify-between ${isRTL ? 'md:flex-row-reverse' : 'md:flex-row'}`}><div className={`min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}><div className="font-semibold text-gray-900">{airport.city} ({airport.code})</div><div className="truncate text-gray-500">{airport.name}</div></div><div className={`flex shrink-0 gap-2 ${isRTL ? 'justify-start' : 'justify-end'}`}><button onClick={() => openModal(<AirportModal initialValue={airport} onClose={closeModal} onSubmit={props.onSaveAirport} t={props.t} />)} className="rounded-lg bg-blue-50 p-2 text-blue-600"><Edit2 className="h-4 w-4" /></button><button onClick={() => props.onDeleteAirport(airport.id)} className="rounded-lg bg-red-50 p-2 text-red-600"><Trash2 className="h-4 w-4" /></button></div></div>)}
          </div>
        </div>
        )}

        {baseDataTab === 'airlines' && (
        <div className="overflow-hidden rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4"><h2 className="font-semibold text-gray-900">Airlines</h2><button onClick={() => openModal(<AirlineModal initialValue={{ id: '', name: '', code: '', logoUrl: '' }} onClose={closeModal} onSubmit={props.onSaveAirline} t={props.t} />)} className="rounded-lg bg-indigo-50 p-2 text-indigo-600"><Plus className="h-4 w-4" /></button></div>
          <div className="max-h-80 overflow-auto">
            {props.savedAirlines.map((airline) => <div key={airline.id} className={`flex flex-col gap-3 border-t border-gray-100 px-5 py-4 text-sm md:items-center md:justify-between ${isRTL ? 'md:flex-row-reverse' : 'md:flex-row'}`}><div className={`flex min-w-0 items-center gap-3 ${isRTL ? 'md:flex-row-reverse text-right' : ''}`}><div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-gray-100">{airline.logoUrl && <img src={airline.logoUrl} className="h-full w-full object-cover" />}</div><div className="min-w-0"><div className="truncate font-semibold text-gray-900">{airline.name}</div><div className="text-gray-500">{airline.code}</div></div></div><div className={`flex shrink-0 gap-2 ${isRTL ? 'justify-start' : 'justify-end'}`}><button onClick={() => openModal(<AirlineModal initialValue={airline} onClose={closeModal} onSubmit={props.onSaveAirline} t={props.t} />)} className="rounded-lg bg-blue-50 p-2 text-blue-600"><Edit2 className="h-4 w-4" /></button><button onClick={() => props.onDeleteAirline(airline.id)} className="rounded-lg bg-red-50 p-2 text-red-600"><Trash2 className="h-4 w-4" /></button></div></div>)}
          </div>
        </div>
        )}

        {baseDataTab === 'flights' && (
        <div className="overflow-hidden rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4"><h2 className="font-semibold text-gray-900">Flights</h2><button onClick={() => openModal(<FlightModal initialValue={{ id: '', airlineId: '', flightNumber: '', airline: '', originCode: '', destCode: '', departureTime: '', arrivalTime: '', date: '' }} airlines={props.savedAirlines} airports={props.savedAirports} onClose={closeModal} onSubmit={props.onSaveFlight} t={props.t} />)} className="rounded-lg bg-indigo-50 p-2 text-indigo-600"><Plus className="h-4 w-4" /></button></div>
          <div className="max-h-80 overflow-auto">
            {props.savedFlights.map((flight) => <div key={flight.id} className={`flex flex-col gap-3 border-t border-gray-100 px-5 py-4 text-sm md:items-center md:justify-between ${isRTL ? 'md:flex-row-reverse' : 'md:flex-row'}`}><div className={`min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}><div className="truncate font-semibold text-gray-900">{flight.flightNumber} - {flight.airline}</div><div className="text-gray-500">{flight.originCode} {'->'} {flight.destCode} | {flight.date}</div></div><div className={`flex shrink-0 gap-2 ${isRTL ? 'justify-start' : 'justify-end'}`}><button onClick={() => openModal(<FlightModal initialValue={flight} airlines={props.savedAirlines} airports={props.savedAirports} onClose={closeModal} onSubmit={props.onSaveFlight} t={props.t} />)} className="rounded-lg bg-blue-50 p-2 text-blue-600"><Edit2 className="h-4 w-4" /></button><button onClick={() => props.onDeleteFlight(flight.id)} className="rounded-lg bg-red-50 p-2 text-red-600"><Trash2 className="h-4 w-4" /></button></div></div>)}
          </div>
        </div>
        )}
      </div>
    </div>
  );

  const renderRevenue = () => {
    const [draft, setDraft] = [props.revenueConfig, props.setRevenueConfig];
    return (
      <div className="space-y-4">
        <PageHeader
          isRTL={isRTL}
          title={props.t('revenueModel')}
          description="Control fixed pricing, free limits, and tiered pricing bands from one panel."
          action={<button onClick={() => props.onSaveRevenueConfig(draft)} className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"><Save className="h-4 w-4" /> {props.t('save')}</button>}
        />
        <div className={`${card} p-5`}>
          <div className="mb-4 flex flex-wrap gap-3">
            <button onClick={() => setDraft({ ...draft, modelType: 'FIXED' })} className={`rounded-2xl px-4 py-2.5 text-sm font-semibold ${draft.modelType === 'FIXED' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>FIXED</button>
            <button onClick={() => setDraft({ ...draft, modelType: 'TIERED' })} className={`rounded-2xl px-4 py-2.5 text-sm font-semibold ${draft.modelType === 'TIERED' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>TIERED</button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput label={props.t('pricePerTicket')} type="number" value={draft.fixedPrice} onChange={(e) => setDraft({ ...draft, fixedPrice: Number(e.target.value) })} />
            <TextInput label={props.t('globalFreeLimit')} type="number" value={draft.globalFreeLimit} onChange={(e) => setDraft({ ...draft, globalFreeLimit: Number(e.target.value) })} />
          </div>
          {draft.modelType === 'TIERED' && (
            <div className="mt-5 space-y-3">
              {draft.tiers.map((tier, index) => (
                <div key={tier.id} className="grid gap-3 rounded-xl border border-gray-200 p-4 md:grid-cols-4">
                  <TextInput label={props.t('minQty')} type="number" value={tier.minQty} onChange={(e) => {
                    const next = [...draft.tiers];
                    next[index] = { ...next[index], minQty: Number(e.target.value) };
                    setDraft({ ...draft, tiers: next });
                  }} />
                  <TextInput label={props.t('maxQty')} type="number" value={tier.maxQty ?? ''} onChange={(e) => {
                    const next = [...draft.tiers];
                    next[index] = { ...next[index], maxQty: e.target.value ? Number(e.target.value) : null };
                    setDraft({ ...draft, tiers: next });
                  }} />
                  <TextInput label={props.t('pricePerTicket')} type="number" value={tier.pricePerTicket} onChange={(e) => {
                    const next = [...draft.tiers];
                    next[index] = { ...next[index], pricePerTicket: Number(e.target.value) };
                    setDraft({ ...draft, tiers: next });
                  }} />
                  <div className="flex items-end"><button onClick={() => setDraft({ ...draft, tiers: draft.tiers.filter((_, tierIndex) => tierIndex !== index) })} className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"><Trash2 className="h-4 w-4" /></button></div>
                </div>
              ))}
              <button onClick={() => setDraft({ ...draft, tiers: [...draft.tiers, { id: `${Date.now()}`, minQty: 0, maxQty: null, pricePerTicket: 0 }] })} className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"><Plus className="h-4 w-4" /> Add tier</button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAds = () => (
    <div className="space-y-4">
      <PageHeader
        isRTL={isRTL}
        title={props.t('manageAds')}
        description="Manage banner placements, popup ads, and promotional creatives."
        action={<button onClick={() => openModal(<AdModal initialValue={{ id: '', location: 'spot_1', title: '', description: '', ctaText: 'View', linkUrl: 'https://example.com', iconName: 'Sparkles', isActive: true }} onClose={closeModal} onSubmit={props.onSaveAd} t={props.t} />)} className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"><Plus className="h-4 w-4" /> {props.t('add')}</button>}
      />
      <div className="grid gap-4 xl:grid-cols-2">
        {props.ads.map((ad) => (
          <div key={ad.id} className={`${card} flex flex-col gap-4 p-4 sm:flex-row sm:items-center`}>
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-gray-100">{ad.imageUrl ? <img src={ad.imageUrl} className="h-full w-full object-cover" /> : <div className={`h-full w-full bg-gradient-to-br ${ad.colorFrom || 'from-blue-600'} ${ad.colorTo || 'to-cyan-400'}`} />}</div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-gray-900">{ad.title}</div>
              <div className="truncate text-sm text-gray-500">{ad.description}</div>
              <div className="mt-1 text-xs text-gray-400">{ad.location}</div>
            </div>
            <div className="flex gap-2 self-end sm:self-auto">
              <button onClick={() => openModal(<AdModal initialValue={ad} onClose={closeModal} onSubmit={props.onSaveAd} t={props.t} />)} className="rounded-lg bg-blue-50 p-2 text-blue-600"><Edit2 className="h-4 w-4" /></button>
              <button onClick={() => props.onDeleteAd(ad.id)} className="rounded-lg bg-red-50 p-2 text-red-600"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBlog = () => (
    <div className="space-y-4">
      <PageHeader
        isRTL={isRTL}
        title={props.t('manageBlog')}
        description="Publish, revise, and organize blog content from one editorial table."
        action={<button onClick={() => openModal(<BlogModal initialValue={{ id: '', title: '', excerpt: '', content: '', author: props.currentUser.name, date: '', imageUrl: '', status: 'Draft' }} onClose={closeModal} onSubmit={props.onSaveBlogPost} t={props.t} />)} className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"><Plus className="h-4 w-4" /> {props.t('addPost')}</button>}
      />
      <div className={`${card} ${tableWrap}`}>
        <table className="min-w-[720px] w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500"><tr><th className="px-5 py-4">{props.t('postTitle')}</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">{props.t('date')}</th><th className="px-5 py-4 text-right">{props.t('action')}</th></tr></thead>
          <tbody>
            {props.blogPosts.map((post) => (
              <tr key={post.id} className="border-t border-gray-100">
                <td className="px-5 py-4 font-semibold text-gray-900">{post.title}</td>
                <td className="px-5 py-4">{post.status}</td>
                <td className="px-5 py-4">{post.date}</td>
                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openModal(<BlogModal initialValue={post} onClose={closeModal} onSubmit={props.onSaveBlogPost} t={props.t} />)} className="rounded-lg bg-blue-50 p-2 text-blue-600"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => props.onDeleteBlogPost(post.id)} className="rounded-lg bg-red-50 p-2 text-red-600"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <PageHeader
        isRTL={isRTL}
        title={props.t('settings')}
        description="Control footer content, contact details, and static pages."
        action={<button onClick={() => props.onSaveFooter(props.footerConfig)} className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"><Save className="h-4 w-4" /> {props.t('save')}</button>}
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <div className={`${card} p-5`}>
          <h2 className="mb-4 font-semibold text-gray-900">Footer</h2>
          <div className="space-y-4">
            <TextArea label={props.t('description')} rows={3} value={props.footerConfig.description} onChange={(e) => props.setFooterConfig({ ...props.footerConfig, description: e.target.value })} />
            <TextInput label={props.t('address')} value={props.footerConfig.address} onChange={(e) => props.setFooterConfig({ ...props.footerConfig, address: e.target.value })} />
            <TextInput label={props.t('phone')} value={props.footerConfig.phone} onChange={(e) => props.setFooterConfig({ ...props.footerConfig, phone: e.target.value })} />
            <TextInput label={props.t('emailText')} value={props.footerConfig.email} onChange={(e) => props.setFooterConfig({ ...props.footerConfig, email: e.target.value })} />
            <TextInput label={props.t('copyright')} value={props.footerConfig.copyright} onChange={(e) => props.setFooterConfig({ ...props.footerConfig, copyright: e.target.value })} />
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput label="Facebook" value={props.footerConfig.social.facebook} onChange={(e) => props.setFooterConfig({ ...props.footerConfig, social: { ...props.footerConfig.social, facebook: e.target.value } })} />
              <TextInput label="Twitter" value={props.footerConfig.social.twitter} onChange={(e) => props.setFooterConfig({ ...props.footerConfig, social: { ...props.footerConfig.social, twitter: e.target.value } })} />
              <TextInput label="Instagram" value={props.footerConfig.social.instagram} onChange={(e) => props.setFooterConfig({ ...props.footerConfig, social: { ...props.footerConfig.social, instagram: e.target.value } })} />
              <TextInput label="LinkedIn" value={props.footerConfig.social.linkedin} onChange={(e) => props.setFooterConfig({ ...props.footerConfig, social: { ...props.footerConfig.social, linkedin: e.target.value } })} />
            </div>
          </div>
        </div>
        <div className={`${card} p-5`}>
          <div className="mb-4 flex items-center justify-between"><h2 className="font-semibold text-gray-900">Static pages</h2><button onClick={() => openModal(<StaticPageModal initialValue={{ id: '', slug: '', title: '', content: '' }} onClose={closeModal} onSubmit={props.onSaveStaticPage} t={props.t} />)} className="rounded-lg bg-blue-50 p-2 text-blue-600"><Plus className="h-4 w-4" /></button></div>
          <div className="space-y-3">
            {props.staticPages.map((page) => (
              <div key={page.id || page.slug} className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-gray-900">{page.title}</div>
                    <div className="text-xs text-gray-500">/{page.slug}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openModal(<StaticPageModal initialValue={page} onClose={closeModal} onSubmit={props.onSaveStaticPage} t={props.t} />)} className="rounded-lg bg-blue-50 p-2 text-blue-600"><Edit2 className="h-4 w-4" /></button>
                    {page.id && <button onClick={() => props.onDeleteStaticPage(page.id!)} className="rounded-lg bg-red-50 p-2 text-red-600"><Trash2 className="h-4 w-4" /></button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-4">
      <PageHeader title={props.t('transactions')} description="Financial activity generated from issued tickets and payment methods." isRTL={isRTL} />
      <div className={`${card} p-5`}>
        <p className="mb-4 text-sm text-gray-500">This view is derived from issued tickets because the backend currently exposes ticket history directly.</p>
        <div className="space-y-3">
          {props.tickets.map((ticket) => (
            <div key={ticket.id} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm">
              <div>
                <div className="font-semibold text-gray-900">{ticket.ticketId}</div>
                <div className="text-gray-500">{ticket.paymentMethod}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">{ticket.price}</div>
                <div className="text-gray-500">{ticket.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const content = {
    overview: renderOverview(),
    tickets: renderTickets(),
    users: renderUsers(),
    passengers: renderPassengers(),
    basedata: renderBaseData(),
    revenue: renderRevenue(),
    advertising: renderAds(),
    transactions: renderTransactions(),
    blog: renderBlog(),
    settings: renderSettings(),
  }[activeTab] || renderOverview();

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={`min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef4ff_100%)] md:flex ${isRTL ? 'md:flex-row-reverse' : ''}`}>
      {isMobile && isSidebarOpen && <button onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 z-20 bg-slate-900/35 backdrop-blur-sm" aria-label="Close sidebar" />}
      <aside className={`${isMobile ? `fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-30 w-[88vw] max-w-[320px] shadow-2xl transition-transform duration-300` : 'sticky top-0 h-screen w-76 shrink-0'} ${isRTL ? 'border-l' : 'border-r'} border-slate-200 bg-white/95 ${isMobile ? (isSidebarOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full') : 'translate-x-0'} overflow-y-auto backdrop-blur`}>
        <div className="flex items-center justify-between border-b border-slate-100 p-5 md:sticky md:top-0 md:bg-white/95 md:backdrop-blur">
          <div className="min-w-0">
            <span className="block text-lg font-black tracking-tight text-blue-600">ADMIN</span>
            <span className="text-xs text-slate-500">{props.currentUser.name}</span>
          </div>
          {isMobile && (
            <button onClick={() => setIsSidebarOpen((prev) => !prev)} className="rounded-xl p-2 hover:bg-slate-100">
              <Menu className="h-5 w-5 text-slate-500" />
            </button>
          )}
        </div>
        <nav className="space-y-2 p-4">
          <SidebarItem icon={LayoutDashboard} label={props.t('overview')} active={activeTab === 'overview'} onClick={() => handleTabChange('overview')} />
          <SidebarItem icon={Ticket} label={props.t('ticketManagement')} active={activeTab === 'tickets'} onClick={() => handleTabChange('tickets')} />
          <SidebarItem icon={Users} label={props.t('userManagement')} active={activeTab === 'users'} onClick={() => handleTabChange('users')} />
          <SidebarItem icon={UserCheck} label={props.t('frequentFlyers')} active={activeTab === 'passengers'} onClick={() => handleTabChange('passengers')} />
          <SidebarItem icon={Database} label={props.t('baseData')} active={activeTab === 'basedata'} onClick={() => handleTabChange('basedata')} />
          <SidebarItem icon={Coins} label={props.t('revenueModel')} active={activeTab === 'revenue'} onClick={() => handleTabChange('revenue')} />
          <SidebarItem icon={Megaphone} label={props.t('advertising')} active={activeTab === 'advertising'} onClick={() => handleTabChange('advertising')} />
          <SidebarItem icon={CreditCard} label={props.t('transactions')} active={activeTab === 'transactions'} onClick={() => handleTabChange('transactions')} />
          <SidebarItem icon={BookOpen} label={props.t('manageBlog')} active={activeTab === 'blog'} onClick={() => handleTabChange('blog')} />
          <SidebarItem icon={Settings} label={props.t('settings')} active={activeTab === 'settings'} onClick={() => handleTabChange('settings')} />
        </nav>
      </aside>
      <main className={`min-w-0 flex-1 overflow-x-hidden ${isRTL ? 'md:border-r' : 'md:border-l'} md:border-gray-100 ${isMobile && isSidebarOpen ? 'hidden' : 'block'}`}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/85 px-4 py-4 backdrop-blur md:px-8">
          <div>
            <div className={`text-sm font-semibold text-slate-900 ${isRTL ? 'text-right' : ''}`}>Admin Panel</div>
            <div className={`text-xs text-slate-500 ${isRTL ? 'text-right' : ''}`}>A cleaner workspace for operations, content, and base data.</div>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className={`rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm ${isMobile ? 'block' : 'hidden'}`}>
            <Menu className="h-5 w-5 text-slate-700" />
          </button>
        </div>
        <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 md:p-8">{content}</div>
      </main>
      {modal}
    </div>
  );
};
