import { forwardRef } from 'react';
import { TicketData, Flight } from '../types';
import { Plane, Phone, QrCode, Luggage, ShieldCheck, Clock, Calendar, CheckCircle2, AlertCircle, FileText, ArrowRight } from 'lucide-react';
import { getReliableAirlineLogo } from '../src/utils/airlineEmblems';

const THEMES: Record<string, { 
  bg: string; 
  headerBg: string; 
  text: string; 
  accent: string; 
  border: string; 
  badgeBg: string; 
  badgeText: string;
  gradient: string;
}> = {
  '1': { 
    bg: 'bg-blue-600', 
    headerBg: 'bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900', 
    text: 'text-blue-600', 
    accent: 'text-blue-500', 
    border: 'border-blue-200',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    gradient: 'from-blue-600 to-indigo-600'
  },
  '3': { 
    bg: 'bg-rose-600', 
    headerBg: 'bg-gradient-to-r from-rose-700 via-red-700 to-slate-900', 
    text: 'text-rose-600', 
    accent: 'text-rose-500', 
    border: 'border-rose-200',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    gradient: 'from-rose-600 to-red-600'
  },
  '4': { 
    bg: 'bg-amber-600', 
    headerBg: 'bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900', 
    text: 'text-amber-600', 
    accent: 'text-amber-500', 
    border: 'border-amber-200',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    gradient: 'from-amber-500 to-amber-700'
  },
};

// Deterministic barcode pattern for stable print & html2canvas rendering
const BAR_PATTERN = [
  2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1, 4,
  2, 1, 3, 2, 1, 1, 3, 4, 1, 2, 2, 1, 3, 1, 4, 2, 1, 2, 3, 1,
  1, 4, 2, 1, 3, 2, 1, 2, 4, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 4,
  2, 1, 2, 3, 1, 4, 1, 2, 1, 3, 2, 4, 1, 2, 3, 1, 2, 1, 3, 2
];

const DeterministicBarcode = ({ code, height = 'h-10', showCode = true }: { code?: string; height?: string; showCode?: boolean }) => (
  <div className="flex flex-col items-center justify-center">
    <div className={`${height} w-full flex items-end justify-center gap-[2px] opacity-90`}>
      {BAR_PATTERN.map((width, i) => (
        <div 
          key={i} 
          className="bg-slate-900" 
          style={{ 
            width: `${width}px`, 
            height: i % 7 === 0 ? '100%' : i % 3 === 0 ? '88%' : '75%' 
          }} 
        />
      ))}
    </div>
    {showCode && code && (
      <span className="font-mono text-[10px] tracking-[0.25em] text-slate-500 mt-1 uppercase font-semibold">
        * {code} *
      </span>
    )}
  </div>
);

const ModernFlightPath = ({ duration = 'Non-stop' }: { duration?: string }) => (
  <div className="flex flex-col items-center justify-center w-full px-2">
    <div className="flex items-center w-full relative">
      <div className="w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white shadow-xs shrink-0"></div>
      <div className="h-[2px] bg-slate-300 flex-1 relative mx-1">
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white px-1.5 py-0.5 rounded-full border border-slate-200 text-blue-600 shadow-2xs">
          <Plane className="w-3.5 h-3.5 rotate-90" />
        </div>
      </div>
      <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border-2 border-white shadow-xs shrink-0"></div>
    </div>
    <span className="text-[11px] font-semibold text-slate-500 mt-1.5 tracking-tight font-sans">
      {duration}
    </span>
  </div>
);

import { SafeAirlineLogo } from './SafeAirlineLogo';
export { SafeAirlineLogo };

// =========================================================================
// 1. SYSTEM SEPEHR (NEW) - Ultra-Modern Airline Electronic Ticket
// =========================================================================
const SystemSepehrNewLayout = ({ data }: { data: TicketData }) => {
  return (
    <div className="w-[794px] min-h-[1123px] bg-white p-8 font-sans relative text-left flex flex-col justify-between" dir="ltr">
      <div>
        {/* Top Header Card */}
        <div className="bg-slate-900 rounded-2xl p-6 text-white mb-6 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-blue-600/30 to-transparent pointer-events-none" />
          
          <div className="flex justify-between items-center relative z-10">
            {/* Agency Brand */}
            <div className="flex items-center gap-4">
              {data.agency.showLogo && (
                <div className="w-16 h-16 rounded-xl bg-white p-2 flex items-center justify-center shrink-0 shadow-sm border border-white/20">
                  {data.agency.logoUrl ? (
                    <img src={data.agency.logoUrl} className="w-full h-full object-contain" alt={data.agency.name} referrerPolicy="no-referrer" />
                  ) : (
                    <Plane className="text-blue-600 w-8 h-8" />
                  )}
                </div>
              )}
              <div>
                <h1 className="text-xl font-black tracking-tight text-white uppercase">{data.agency.name || 'TRAVEL AGENCY'}</h1>
                <div className="flex items-center gap-2 text-slate-300 text-xs mt-1 font-medium">
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  <span>Support: {data.agency.phone || '24/7 Helpline'}</span>
                </div>
              </div>
            </div>

            {/* Document Header Status */}
            <div className="text-right">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Confirmed / تایید شده</span>
              </div>
              <div className="text-2xl font-black tracking-tight text-white">E-TICKET RECEIPT</div>
              <div className="text-[11px] font-semibold text-slate-400 tracking-wider">ELECTRONIC BOARDING PASS</div>
            </div>
          </div>
        </div>

        {/* Passenger & Ticket Details Card */}
        <div className="border border-slate-200 rounded-2xl p-6 mb-6 shadow-xs bg-slate-50/50">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Passenger & Reservation Details / مشخصات مسافر
            </h2>
            <div className="text-xs font-mono font-bold text-slate-600">
              ISSUE DATE: {data.passenger.issueDate || new Date().toLocaleDateString('en-GB')}{data.passenger.issueTime ? ` ${data.passenger.issueTime}` : ''}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Passenger Name</span>
              <span className="font-extrabold text-slate-900 text-sm block truncate uppercase">
                {data.passenger.firstName} {data.passenger.lastName}
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
                {data.passenger.gender === 'Female' ? 'MS / خانم' : 'MR / آقا'} · Adult
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                {data.passenger.idType === 'NationalID' ? 'National ID / کد ملی' : 'Passport No / گذرنامه'}
              </span>
              <span className="font-extrabold font-mono text-slate-900 text-sm block">
                {data.passenger.passportNumber}
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5 block uppercase">
                {data.passenger.nationality || 'IRAN'}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Booking Ref (PNR)</span>
              <span className="font-black font-mono text-blue-600 text-base block tracking-wider uppercase">
                {data.passenger.pnr}
              </span>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                Ref: {data.passenger.localPnr || data.passenger.pnr}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">E-Ticket Number</span>
              <span className="font-extrabold font-mono text-slate-900 text-sm block truncate">
                {data.passenger.ticketId || '000-0000000000'}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">
                Confirmed Status
              </span>
            </div>

            {data.showPrice && data.passenger.price && (
              <div className="col-span-4 bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-900">Total Fare & Taxes / بهای کل بلیت:</span>
                  <span className="text-[10px] text-blue-600 font-medium">(VAT & Airport fees included)</span>
                </div>
                <div className="text-xl font-black font-mono text-blue-700">
                  {data.passenger.price} <span className="text-xs font-sans font-bold">Rials</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Flight Segments Cards */}
        <div className="space-y-4 mb-6">
          {(data.flights || []).map((flight, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              {/* Flight Top Bar */}
              <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <SafeAirlineLogo logoUrl={flight.airlineLogo} airline={flight.airline} size="w-8 h-8" />
                  <div>
                    <span className="font-extrabold text-slate-800 text-sm">{flight.airline}</span>
                    <span className="text-xs font-mono font-bold text-blue-600 bg-white px-2 py-0.5 rounded-md border border-slate-200 ml-2">
                      {flight.flightNumber}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200 font-mono">
                    Class: {flight.flightClass || 'Economy (Y)'}
                  </span>
                  <span className="font-bold text-white bg-blue-600 px-3 py-1 rounded-md text-[11px] uppercase tracking-wide">
                    {flight.type}
                  </span>
                </div>
              </div>

              {/* Origin to Destination Route */}
              <div className="p-6 grid grid-cols-12 items-center gap-4">
                {/* Origin */}
                <div className="col-span-4">
                  <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">{flight.originTime}</div>
                  <div className="text-sm font-extrabold text-slate-800 mt-1">{flight.originName}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs font-bold font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                      {flight.originCode}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{flight.date}</span>
                  </div>
                </div>

                {/* Flight Path Graphic */}
                <div className="col-span-4">
                  <ModernFlightPath duration="Direct Flight · بدون توقف" />
                </div>

                {/* Destination */}
                <div className="col-span-4 text-right">
                  <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">{flight.destTime}</div>
                  <div className="text-sm font-extrabold text-slate-800 mt-1">{flight.destName}</div>
                  <div className="flex items-center justify-end gap-1.5 mt-0.5">
                    <span className="text-xs text-slate-500 font-medium">{flight.date}</span>
                    <span className="text-xs font-bold font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                      {flight.destCode}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Flight Meta Bar */}
              <div className="bg-slate-50/60 px-6 py-2.5 border-t border-slate-200 flex justify-between items-center text-xs text-slate-600">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 font-medium">
                    <Luggage className="w-3.5 h-3.5 text-blue-600" />
                    بار مجاز (Checked): <strong className="text-slate-800 font-bold">{flight.baggage}</strong>
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <BriefcaseIcon className="w-3.5 h-3.5 text-blue-600" />
                    بار کابین (Cabin): <strong className="text-slate-800 font-bold">{flight.handBaggage || '5 Kg'}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono font-medium text-[11px] text-slate-500">
                  <span>Terminal: 1</span>
                  <span>·</span>
                  <span>Gate: TBA</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Official Rules & Notice Section */}
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 text-[11px] text-slate-600 leading-relaxed mb-4">
          <div className="font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-blue-600" />
            Important Travel Notice & Guidelines / قوانین و مقررات مهم پرواز:
          </div>
          <ul className="list-disc pl-4 space-y-1 text-slate-600">
            <li>حضور مسافر در پروازهای داخلی حداقل ۲ ساعت و پروازهای بین‌المللی حداقل ۴ ساعت قبل از پرواز در فرودگاه الزامی است.</li>
            <li>مسئولیت کنترل اعتبار گذرنامه (حداقل ۶ ماه) و ویزای معتبر کشور مقصد بر عهده مسافر گرامی می‌باشد.</li>
            <li>بلیت حاضر غیرقابل انتقال به غیر بوده و همراه داشتن کارت شناسایی عکس‌دار یا گذرنامه جهت پذیرش الزامی است.</li>
          </ul>
        </div>
      </div>

      {/* Security & Verification Footer */}
      <div className="border-t-2 border-slate-200 pt-4 flex justify-between items-end">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white border border-slate-200 rounded-xl p-1.5 shrink-0 shadow-2xs">
            <QrCode className="w-full h-full text-slate-900" />
          </div>
          <div className="text-xs text-slate-500 space-y-0.5">
            <div className="font-bold text-slate-800 text-xs">OFFICIAL BOARDING PASS & RECEIPT</div>
            <div className="text-[11px]">Scan QR code to verify authenticity and flight status</div>
            <div className="text-[10px] font-mono text-slate-400">Security Hash: {data.passenger.pnr}-{data.passenger.ticketId?.slice(-6) || 'SEC'}</div>
          </div>
        </div>

        <div className="w-56 text-right">
          <DeterministicBarcode code={data.passenger.pnr} height="h-9" />
          <div className="text-[10px] text-slate-400 font-mono mt-1 text-center">ELECTRONIC VERIFIED</div>
        </div>
      </div>

      {!data.isLoggedIn && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
          <div className="transform -rotate-45 text-slate-900/[0.04] text-9xl font-black whitespace-nowrap select-none border-8 border-slate-900/[0.04] p-8 rounded-3xl">
            PREVIEW
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 2. STANDARD BOARDING PASS (Templates 1, 3, 4) - Elevated International
// =========================================================================
const StandardLayout = ({ data }: { data: TicketData }) => {
  const theme = THEMES[data.templateId] || THEMES['1'];

  return (
    <div className="w-[794px] min-h-[1123px] bg-white text-slate-900 relative shadow-2xl overflow-hidden flex flex-col justify-between p-8 font-sans text-left" dir="ltr">
      <div>
        {/* Header Bar with Notch Effect */}
        <div className={`rounded-2xl ${theme.headerBg} p-6 text-white mb-6 shadow-md relative overflow-hidden`}>
          <div className="flex justify-between items-center relative z-10">
            <div className="flex gap-4 items-center">
              {data.agency.showLogo && (
                <div className="w-16 h-16 rounded-xl bg-white p-2 flex items-center justify-center shrink-0 shadow-sm border border-white/20">
                  {data.agency.logoUrl ? (
                    <img src={data.agency.logoUrl} className="w-full h-full object-contain" alt="Agency Logo" referrerPolicy="no-referrer" />
                  ) : (
                    <Plane className={`${theme.text} w-8 h-8`} />
                  )}
                </div>
              )}
              <div>
                <h1 className="text-xl font-black uppercase tracking-tight text-white">{data.agency.name || 'SKYWAYS TRAVEL'}</h1>
                <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1">
                  <Phone size={13} /> {data.agency.phone || '+98 21 0000 0000'}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider rounded-full mb-1 border border-emerald-500/30">
                Confirmed / تایید شده
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Booking Reference</p>
              <p className="text-2xl font-mono font-black text-white tracking-wider">{data.passenger.pnr}</p>
            </div>
          </div>
        </div>

        {/* Passenger Information Banner */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6">
          <div className="flex justify-between items-center mb-3">
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Passenger Information
            </div>
            {(data.passenger.issueDate || data.passenger.issueTime) && (
              <div className="text-[11px] font-mono font-bold text-slate-500">
                ISSUE: {data.passenger.issueDate || ''}{data.passenger.issueTime ? ` ${data.passenger.issueTime}` : ''}
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-4 text-xs">
            <div>
              <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Full Name</p>
              <p className="font-extrabold text-slate-900 text-sm truncate uppercase">
                {data.passenger.firstName} {data.passenger.lastName}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">
                {data.passenger.idType === 'NationalID' ? 'National ID' : 'Passport Number'}
              </p>
              <p className="font-mono font-bold text-slate-800 text-sm">{data.passenger.passportNumber}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Nationality</p>
              <p className="font-semibold text-slate-800 uppercase">{data.passenger.nationality}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Ticket Number</p>
              <p className="font-mono font-bold text-slate-800 text-sm">{data.passenger.ticketId}</p>
            </div>

            {data.showPrice && data.passenger.price && (
              <div className="col-span-4 mt-2 pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">Total Price:</span>
                <span className="font-black font-mono text-lg text-slate-900">{data.passenger.price} Rials</span>
              </div>
            )}
          </div>
        </div>

        {/* Flights Segments */}
        <div className="space-y-4 mb-6">
          {(data.flights || []).map((flight, index) => (
            <div key={index} className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs bg-white">
              {/* Flight segment header */}
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <SafeAirlineLogo logoUrl={flight.airlineLogo} airline={flight.airline} size="w-8 h-8" />
                  <div>
                    <span className="font-extrabold text-slate-900 text-sm">{flight.airline}</span>
                    <span className="text-xs font-mono font-bold text-blue-600 bg-white px-2 py-0.5 rounded border border-slate-200 ml-2">
                      FL {flight.flightNumber}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <span className="flex items-center gap-1 font-medium"><Luggage size={14} className="text-blue-600" /> {flight.baggage}</span>
                  <span className="font-bold text-slate-800 font-mono bg-white px-2 py-0.5 rounded border border-slate-200">{flight.date}</span>
                </div>
              </div>

              {/* Route */}
              <div className="p-6 flex items-center justify-between">
                <div className="text-center w-1/3">
                  <div className="text-3xl font-black text-slate-900 font-mono">{flight.originTime}</div>
                  <div className="text-sm font-extrabold text-slate-700 uppercase tracking-wide mt-1">{flight.originCode}</div>
                  <div className="text-xs text-slate-500 truncate max-w-[150px] mx-auto mt-0.5">{flight.originName}</div>
                </div>

                <div className="flex-1 px-4">
                  <ModernFlightPath duration="Non-stop Direct" />
                </div>

                <div className="text-center w-1/3">
                  <div className="text-3xl font-black text-slate-900 font-mono">{flight.destTime}</div>
                  <div className="text-sm font-extrabold text-slate-700 uppercase tracking-wide mt-1">{flight.destCode}</div>
                  <div className="text-xs text-slate-500 truncate max-w-[150px] mx-auto mt-0.5">{flight.destName}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Terms notice */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 leading-relaxed text-justify mb-4">
          <p className="font-bold text-slate-700 mb-1">Notice to Passengers:</p>
          <p>
            Please be at the boarding gate 45 minutes prior to scheduled departure. Check-in counters close 60 minutes before departure time. 
            All passengers must carry a valid photo ID and this ticket confirmation. Baggage allowance rules apply strictly.
          </p>
        </div>
      </div>

      {/* Footer Barcode */}
      <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-white border border-slate-200 rounded-lg p-1">
            <QrCode className="w-full h-full text-slate-800" />
          </div>
          <div className="text-xs text-slate-500">
            <p className="font-bold text-slate-700">AUTHENTICATED ELECTRONIC TICKET</p>
            <p className="text-[10px]">Issued via Authorized Global Distribution System</p>
          </div>
        </div>
        <div className="w-48 text-right">
          <DeterministicBarcode code={data.passenger.pnr} height="h-8" />
        </div>
      </div>

      {!data.isLoggedIn && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
          <div className="transform -rotate-45 text-slate-900/[0.04] text-9xl font-black whitespace-nowrap select-none border-8 border-slate-900/[0.04] p-8 rounded-3xl">
            PREVIEW
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 3. SIDEBAR LAYOUT (Template 2) - Executive Obsidian & Minimal Dark
// =========================================================================
const SidebarLayout = ({ data }: { data: TicketData }) => {
  return (
    <div className="w-[794px] min-h-[1123px] bg-white flex relative shadow-2xl text-left font-sans" dir="ltr">
      {/* Left Obsidian Sidebar */}
      <div className="w-[270px] bg-slate-950 text-white p-8 flex flex-col justify-between relative overflow-hidden shrink-0 border-r border-slate-800">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-900/30 to-transparent pointer-events-none" />

        {/* Branding */}
        <div className="relative z-10 mb-8">
          <div className="flex items-center gap-3 mb-2">
            {data.agency.showLogo && (
              <div className="w-12 h-12 rounded-xl bg-white p-2 flex items-center justify-center overflow-hidden shrink-0">
                {data.agency.logoUrl ? (
                  <img src={data.agency.logoUrl} className="w-full h-full object-contain" alt="" referrerPolicy="no-referrer" />
                ) : (
                  <Plane className="text-blue-600" size={24} />
                )}
              </div>
            )}
            <div>
              <span className="font-black text-base tracking-wide text-white uppercase block leading-tight">{data.agency.name || 'SKY TRAVEL'}</span>
              <p className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase mt-0.5">Executive Flight Pass</p>
            </div>
          </div>
        </div>

        {/* Passenger Profile */}
        <div className="relative z-10 space-y-6 flex-1">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Passenger</p>
            <h2 className="text-xl font-black text-white leading-tight break-words uppercase">
              {data.passenger.firstName} <br/>
              <span className="text-blue-400">{data.passenger.lastName}</span>
            </h2>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">
                {data.passenger.idType === 'NationalID' ? 'National ID' : 'Passport Number'}
              </p>
              <p className="font-mono text-sm font-bold text-white">{data.passenger.passportNumber}</p>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">Nationality</p>
              <p className="font-semibold text-sm text-white uppercase">{data.passenger.nationality}</p>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">Booking Reference</p>
              <p className="font-mono text-xl font-black text-amber-400 tracking-wider">{data.passenger.pnr}</p>
            </div>
          </div>

          {data.showPrice && data.passenger.price && (
            <div className="pt-4 border-t border-slate-800">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Total Paid</p>
              <p className="text-2xl font-black font-mono text-white">{data.passenger.price}</p>
            </div>
          )}
        </div>

        {/* Footer Support Info */}
        <div className="relative z-10 text-[11px] text-slate-400 pt-6 border-t border-slate-800">
          <p className="font-bold text-white">{data.agency.phone || '24/7 Concierge'}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Official E-Ticket Confirmation</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 flex flex-col justify-between bg-slate-50">
        <div>
          <div className="flex justify-between items-end border-b border-slate-200 pb-5 mb-6">
            <div>
              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">E-Ticket Receipt</h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">Thank you for flying with us.</p>
            </div>
            <div className="text-right">
              <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide inline-block mb-1">
                Confirmed Status
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {data.passenger.issueDate || new Date().toLocaleDateString('en-GB')}{data.passenger.issueTime ? ` ${data.passenger.issueTime}` : ''}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {(data.flights || []).map((flight, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
                  <div className="flex items-center gap-3">
                    <SafeAirlineLogo logoUrl={flight.airlineLogo} airline={flight.airline} size="w-7 h-7" />
                    <span className="font-extrabold text-slate-800 text-sm">{flight.airline}</span>
                    <span className="text-xs bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600 font-mono font-bold">
                      {flight.flightNumber}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-700 font-mono">{flight.date}</div>
                </div>

                <div className="p-6 flex items-center justify-between">
                  <div className="text-center min-w-[80px]">
                    <div className="text-3xl font-black text-slate-900 font-mono">{flight.originTime}</div>
                    <div className="text-sm font-black text-slate-700 mt-1">{flight.originCode}</div>
                    <div className="text-xs text-slate-400 truncate max-w-[120px]">{flight.originName}</div>
                  </div>

                  <div className="flex-1 px-4">
                    <ModernFlightPath duration="Direct Flight" />
                  </div>

                  <div className="text-center min-w-[80px]">
                    <div className="text-3xl font-black text-slate-900 font-mono">{flight.destTime}</div>
                    <div className="text-sm font-black text-slate-700 mt-1">{flight.destCode}</div>
                    <div className="text-xs text-slate-400 truncate max-w-[120px]">{flight.destName}</div>
                  </div>
                </div>

                <div className="px-5 py-2.5 bg-slate-50 flex gap-6 text-xs text-slate-600 border-t border-slate-100">
                  <span>Class: <strong className="text-slate-800 font-bold">{flight.flightClass || 'Economy'}</strong></span>
                  <span>Baggage: <strong className="text-slate-800 font-bold">{flight.baggage}</strong></span>
                  <span>Type: <strong className="text-slate-800 font-bold">{flight.type}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <DeterministicBarcode code={data.passenger.ticketId || data.passenger.pnr} height="h-9" />
          <p className="text-center text-[10px] text-slate-400 mt-2 font-mono tracking-widest">{data.passenger.ticketId}</p>
        </div>
      </div>

      {!data.isLoggedIn && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
          <div className="transform -rotate-45 text-slate-900/[0.04] text-9xl font-black whitespace-nowrap select-none border-8 border-slate-900/[0.04] p-8 rounded-3xl">
            PREVIEW
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 4. VERTICAL BOARDING PASS (Templates 5, 6) - Apple Wallet / Digital Pass
// =========================================================================
const VerticalLayout = ({ data }: { data: TicketData }) => {
  return (
    <div className="w-[794px] min-h-[1123px] bg-slate-100 p-8 flex justify-center items-start text-left font-sans" dir="ltr">
      <div className="w-[440px] bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 relative">
        {/* Pass Header */}
        <div className="bg-slate-900 text-white p-6 relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2.5">
              <div className="bg-blue-600 p-2 rounded-xl text-white">
                <Plane size={18} />
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-wide block uppercase leading-none">{data.agency.name || 'BOARDING PASS'}</span>
                <span className="text-[10px] text-slate-400 font-medium">Digital Flight Pass</span>
              </div>
            </div>
            <QrCode className="opacity-90 text-white" size={28} />
          </div>

          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-0.5">Passenger</p>
              <p className="text-xl font-black tracking-tight">{data.passenger.firstName} {data.passenger.lastName}</p>
            </div>
            {(data.passenger.issueDate || data.passenger.issueTime) && (
              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-0.5">Issue</p>
                <p className="text-xs font-mono font-bold text-slate-200">
                  {data.passenger.issueDate || ''}{data.passenger.issueTime ? ` ${data.passenger.issueTime}` : ''}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Semicircular Ticket Notch Connector */}
        <div className="relative h-6 bg-slate-900 -mb-[1px]">
          <div className="absolute bottom-0 w-full h-6 bg-white rounded-t-3xl border-t border-slate-200"></div>
        </div>

        {/* Pass Body */}
        <div className="px-6 pb-6 space-y-6 bg-white">
          {(data.flights || []).map((flight, idx) => (
            <div key={idx} className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <SafeAirlineLogo logoUrl={flight.airlineLogo} airline={flight.airline} size="w-6 h-6" />
                  <span className="text-xs font-extrabold text-slate-800">{flight.airline}</span>
                </div>
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {flight.flightNumber}
                </span>
              </div>

              <div className="flex justify-between items-end border-b border-dashed border-slate-200 pb-4">
                <div>
                  <p className="text-[11px] text-slate-400 font-semibold mb-1">{flight.date}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900 font-mono">{flight.originCode}</span>
                    <span className="text-slate-300 font-bold">✈</span>
                    <span className="text-3xl font-black text-slate-900 font-mono">{flight.destCode}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{flight.originName} to {flight.destName}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-bold">Departs</p>
                  <p className="text-base font-black text-slate-900 font-mono">{flight.originTime}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-bold">Arrives</p>
                  <p className="text-base font-black text-slate-900 font-mono">{flight.destTime}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-bold">Baggage</p>
                  <p className="text-xs font-extrabold text-slate-800 mt-1">{flight.baggage}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-slate-50 rounded-xl p-4 grid grid-cols-2 gap-4 border border-slate-100">
            <div>
              <p className="text-[10px] uppercase text-slate-400 font-bold">PNR Reference</p>
              <p className="font-mono font-black text-slate-900 text-lg tracking-wider">{data.passenger.pnr}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-slate-400 font-bold">Seat Assignment</p>
              <p className="font-mono font-extrabold text-slate-900 text-sm mt-1">ANY / At Gate</p>
            </div>
          </div>
        </div>

        {/* Footer Barcode */}
        <div className="bg-white px-6 pb-6 border-t border-slate-100 pt-4">
          <DeterministicBarcode code={data.passenger.ticketId || data.passenger.pnr} height="h-9" />
        </div>

        {!data.isLoggedIn && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <div className="bg-rose-600/90 text-white px-8 py-2 font-bold transform -rotate-12 shadow-xl border-2 border-white rounded-lg">
              SAMPLE PASS
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// =========================================================================
// 5. SEPEHR A4 (Template 7) - Official ATA / Sepehr Print Template
// =========================================================================
const SepehrLayout = ({ data }: { data: TicketData }) => {
  const mainFlight = (data.flights && data.flights[0]) || { airline: 'ATA AIRLINES', flightNumber: '7399' };
  const headerAirlineName = mainFlight?.airline || 'ATA AIRLINES';
  const headerAirlineLogo = mainFlight?.airlineLogo;

  return (
    <div className="w-[794px] min-h-[1123px] bg-white p-10 text-slate-900 font-sans relative text-left flex flex-col justify-between" dir="ltr">
      <div>
        {/* Header Bar */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex items-center gap-4">
            <SafeAirlineLogo logoUrl={headerAirlineLogo} airline={headerAirlineName} size="w-16 h-16" />
            <div>
              <h1 className="text-xl font-black uppercase tracking-wider text-slate-900">{headerAirlineName}</h1>
              <p className="text-xs text-slate-500 font-semibold">ELECTRONIC PASSENGER TICKET & RECEIPT</p>
            </div>
          </div>

          <div className="text-center">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ticket Number</div>
            <div className="text-xl font-black font-mono tracking-widest text-slate-900">{data.passenger.ticketId || '0000001108182'}</div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">Date: {data.passenger.issueDate || new Date().toLocaleDateString('en-GB')}{data.passenger.issueTime ? ` ${data.passenger.issueTime}` : ''}</div>
          </div>

          <div className="w-48 text-right">
            <DeterministicBarcode code={data.passenger.ticketId?.slice(-10) || '0000000000'} height="h-8" />
          </div>
        </div>

        {/* Passenger Information */}
        <div className="flex border-b-2 border-slate-900 pb-3 mb-6 items-end">
          <div className="flex-1">
            <span className="block text-[11px] text-slate-400 font-bold uppercase mb-1">Passenger Name</span>
            <div className="text-lg font-black uppercase">
              {data.passenger.firstName} {data.passenger.lastName}{' '}
              <span className="text-xs font-medium text-slate-500">
                ({data.passenger.gender === 'Female' ? 'MS' : 'MR'} - Adult)
              </span>
            </div>
          </div>
          <div className="w-1/3 text-right">
            <span className="block text-[11px] text-slate-400 font-bold uppercase mb-1">
              {data.passenger.idType === 'NationalID' ? 'National ID' : 'Passport No'}
            </span>
            <div className="text-lg font-black font-mono">
              {data.passenger.passportNumber} <span className="text-xs font-sans text-slate-500 ml-1">{data.passenger.nationality}</span>
            </div>
          </div>
        </div>

        {/* Flight Details Table */}
        <div className="space-y-6 mb-6">
          {(data.flights || []).map((flight, idx) => (
            <div key={idx} className="border border-slate-300 rounded-xl p-5 bg-white shadow-2xs">
              <div className="grid grid-cols-3 gap-y-5 gap-x-6">
                <div className="border-b border-slate-200 pb-2">
                  <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Origin</span>
                  <div className="text-lg font-black text-slate-900">{flight.originName || flight.originCode}</div>
                </div>
                <div className="border-b border-slate-200 pb-2">
                  <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Destination</span>
                  <div className="text-lg font-black text-slate-900">{flight.destName || flight.destCode}</div>
                </div>
                <div className="border-b border-slate-200 pb-2">
                  <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Departure Time</span>
                  <div className="text-lg font-black font-mono text-slate-900">{flight.originTime} <span className="text-xs font-sans text-slate-400">LT</span></div>
                </div>

                <div className="border-b border-slate-200 pb-2">
                  <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Flight Date</span>
                  <div className="text-base font-bold text-slate-800 font-mono">{flight.date}</div>
                </div>
                <div className="border-b border-slate-200 pb-2">
                  <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Flight Number</span>
                  <div className="text-base font-black text-slate-800 font-mono">{flight.flightNumber}</div>
                </div>
                <div className="border-b border-slate-200 pb-2">
                  <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Booking Class</span>
                  <div className="text-base font-bold text-slate-800 font-mono">{flight.flightClass || 'Economy (Y)'}</div>
                </div>

                <div className="border-b border-slate-200 pb-2">
                  <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Baggage Allowance</span>
                  <div className="text-sm font-bold text-slate-800">{flight.baggage} (Checked) / {flight.handBaggage || '5 Kg'} (Cabin)</div>
                </div>
                <div className="border-b border-slate-200 pb-2">
                  <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Booking PNR</span>
                  <div className="text-lg font-black font-mono text-blue-600">{data.passenger.pnr}</div>
                </div>
                <div className="border-b border-slate-200 pb-2">
                  <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Fare Amount</span>
                  <div className="text-base font-black font-mono text-slate-900">{data.passenger.price || 'Included'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cancellation Penalty Policy Box */}
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 text-[11px] text-slate-600 leading-relaxed mb-4">
          <p className="font-bold text-slate-800 mb-1">شرایط کنسلی و استرداد بلیت / Cancellation & Refund Rules:</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-slate-600 font-sans">
            <div>• تا ۲۴ ساعت قبل از پرواز: ۲۰٪ جریمه کنسلی</div>
            <div>• از ۲۴ ساعت تا ۳ ساعت قبل از پرواز: ۴۰٪ جریمه کنسلی</div>
            <div>• از ۳ ساعت قبل از پرواز به بعد: ۶۰٪ جریمه کنسلی</div>
            <div>• انصراف پس از انجام پرواز (No-Show): جریمه طبق بخشنامه ایرلاین</div>
          </div>
        </div>
      </div>

      {/* QR Footer */}
      <div className="border-t-2 border-slate-900 pt-4 flex justify-between items-center">
        <div className="text-xs text-slate-500">
          <p className="font-bold text-slate-800">SYSTEM SEPEHR - TICKET ISSUANCE NETWORK</p>
          <p className="text-[10px]">Tashrifat Safar Aran · 24/7 Support: 09029578104</p>
        </div>
        <div className="w-16 h-16 bg-white border border-slate-300 p-1 rounded-lg">
          <QrCode className="w-full h-full text-slate-900" />
        </div>
      </div>

      {!data.isLoggedIn && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
          <div className="transform -rotate-45 text-slate-900/[0.04] text-9xl font-black whitespace-nowrap select-none border-8 border-slate-900/[0.04] p-8 rounded-3xl">
            SAMPLE
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Icon for Cabin Baggage
function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  );
}

// =========================================================================
// 6. DOMESTIC IRANIAN TICKET (Template 9) - Authentic Persian Domestic E-Ticket (Alibaba / Charter118)
// =========================================================================

function toPersianDigits(val?: string | number | null): string {
  if (val === undefined || val === null) return '';
  const str = String(val);
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/[0-9]/g, (w) => persianDigits[+w]);
}

function getPersianFormattedDate(dateStr?: string, offsetDays = 0) {
  let d = new Date();
  if (dateStr) {
    if (/[\u0600-\u06FF]/.test(dateStr)) {
      return {
        fullDate: dateStr,
        shortDate: dateStr
      };
    }
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      d = parsed;
    }
  }

  if (offsetDays !== 0) {
    d = new Date(d.getTime() + offsetDays * 24 * 60 * 60 * 1000);
  }

  try {
    const weekday = new Intl.DateTimeFormat('fa-IR', { weekday: 'long' }).format(d);
    const day = new Intl.DateTimeFormat('fa-IR', { day: 'numeric' }).format(d);
    const month = new Intl.DateTimeFormat('fa-IR', { month: 'long' }).format(d);
    const year = new Intl.DateTimeFormat('fa-IR', { year: 'numeric' }).format(d);
    const shortDate = new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: 'numeric', day: 'numeric' }).format(d);
    return {
      fullDate: `${weekday}، ${day} ${month} ${year}`,
      shortDate
    };
  } catch (e) {
    return {
      fullDate: 'دوشنبه، ۶ مهر ۱۴۰۵',
      shortDate: '۱۴۰۵/۷/۶'
    };
  }
}

function getOrderNumber(pnr?: string, ticketId?: string, localPnr?: string) {
  if (localPnr && localPnr.trim()) {
    return localPnr.trim();
  }
  if (ticketId && /^\d{10}$/.test(ticketId)) {
    return ticketId;
  }
  return '1088398569';
}

function getAirportTerminalFa(destName: string, destCode: string) {
  if (destCode === 'THR' || destName.includes('تهران') || destName.includes('Tehran')) {
    return 'فرودگاه مهرآباد - ترمینال ۱';
  }
  if (destCode === 'IKA') {
    return 'فرودگاه بین‌المللی امام خمینی - ترمینال ۱';
  }
  if (destCode === 'MHD' || destName.includes('مشهد') || destName.includes('Mashhad')) {
    return 'فرودگاه بین‌المللی شهید هاشمی‌نژاد - ترمینال ۱';
  }
  if (destCode === 'SYZ' || destName.includes('شیراز') || destName.includes('Shiraz')) {
    return 'فرودگاه بین‌المللی شهید دستغیب - ترمینال ۱';
  }
  if (destCode === 'ISF' || destName.includes('اصفهان') || destName.includes('Isfahan')) {
    return 'فرودگاه شهید بهشتی - ترمینال ۱';
  }
  if (destCode === 'TBZ' || destName.includes('تبریز') || destName.includes('Tabriz')) {
    return 'فرودگاه بین‌المللی شهید مدنی - ترمینال ۱';
  }
  if (destCode === 'KIH' || destName.includes('کیش')) {
    return 'فرودگاه بین‌المللی کیش - ترمینال ۱';
  }
  if (destCode === 'BND' || destName.includes('بندرعباس')) {
    return 'فرودگاه بین‌المللی بندرعباس - ترمینال ۱';
  }
  if (destCode === 'NJF' || destName.includes('نجف') || destName.includes('Najaf')) {
    return 'فرودگاه بین‌المللی نجف اشرف';
  }
  return `فرودگاه ${destName} - ترمینال ۱`;
}

function formatBaggageFa(baggage?: string) {
  if (!baggage) return '۲۰ کیلوگرم';
  if (baggage.includes('کیلو')) return toPersianDigits(baggage);
  const match = baggage.match(/\d+/);
  if (match) {
    return `${toPersianDigits(match[0])} کیلوگرم`;
  }
  return toPersianDigits(baggage);
}

const REFUND_RULES = [
  { text: 'از زمان صدور بلیط تا ۱۲:۰۰ ظهر ۳ روز قبل از پرواز', penalty: '۶۰٪' },
  { text: 'از ۱۲:۰۰ ظهر ۳ روز قبل از پرواز تا ۱۲:۰۰ ظهر ۲ روز قبل از پرواز', penalty: '۶۰٪' },
  { text: 'از ۱۲:۰۰ ظهر ۲ روز قبل از پرواز تا ۱۲:۰۰ ظهر ۱ روز قبل از پرواز', penalty: '۶۰٪' },
  { text: 'از ۱۲:۰۰ ظهر ۱ روز قبل از پرواز تا ۱۲ ساعت قبل از پرواز', penalty: '۸۵٪' },
  { text: 'از ۱۲ ساعت قبل از پرواز به بعد', penalty: '۱۰۰٪' },
];

const DomesticIranLayout = ({ data }: { data: TicketData }) => {
  const orderNumber = getOrderNumber(data.passenger.pnr, data.passenger.ticketId, data.passenger.localPnr);
  const issueDate = getPersianFormattedDate(undefined);

  return (
    <div className="w-[794px] min-h-[1123px] bg-white px-10 py-10 sm:px-12 sm:py-12 text-slate-900 font-sans relative text-right flex flex-col justify-between" dir="rtl">
      <div>
        {(data.flights || []).map((flight, idx) => {
          const originDate = getPersianFormattedDate(flight.date);
          const isNextDay = flight.originTime && flight.destTime && flight.destTime < flight.originTime;
          const destDate = getPersianFormattedDate(flight.date, isNextDay ? 1 : 0);
          const terminalText = getAirportTerminalFa(flight.destName, flight.destCode);
          const ticketNumber = data.passenger.ticketId || '۵۱۴۷۶۴۱';
          const aircraft = flight.aircraft || 'Boeing 737';
          const cabinClass = flight.flightClass?.toLowerCase().includes('bus') 
            ? 'بیزینس' 
            : flight.flightClass?.toLowerCase().includes('first') 
              ? 'فرست کلاس' 
              : 'اکونومی';
          const rateClass = (flight.flightClass && flight.flightClass.length === 1 ? flight.flightClass : (flight.flightClass?.[0] || 'B')).toUpperCase();

          return (
            <div key={idx} className="mb-6">
              {/* Top Header of the flight */}
              <div className="flex justify-between items-baseline pb-2 mb-1 text-sm">
                <div className="text-right">
                  <span className="font-extrabold text-slate-900 text-[15px]">
                    پرواز {flight.originName} به {flight.destName}
                  </span>
                  <span className="text-slate-400 mx-2">-</span>
                  <span className="text-slate-600 text-xs font-normal">شماره پرواز</span>{' '}
                  <span className="font-bold text-slate-900 text-sm font-mono">{toPersianDigits(flight.flightNumber)}</span>
                </div>
                <div className="text-left text-xs font-medium text-slate-400 flex items-center gap-1.5" dir="ltr">
                  <span className="font-black text-slate-900 text-sm font-mono">{toPersianDigits(orderNumber)}</span>
                  <span className="text-slate-400 text-xs font-normal">شماره سفارش:</span>
                </div>
              </div>

              {/* Main Flight & Passenger Box */}
              <div className="border border-slate-400 rounded-xl overflow-hidden bg-white shadow-none">
                {/* Upper Flight Route & Specs */}
                <div className="grid grid-cols-12 items-stretch">
                  {/* Right Column: Flight Route (Origin & Destination) */}
                  <div className="col-span-8 p-6 flex flex-col justify-between">
                    {/* Top Path Indicator */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                        <span>مبدا</span>
                        <Plane className="w-3.5 h-3.5 text-slate-400 -scale-x-100 rotate-12 inline-block mr-0.5" />
                      </div>
                      <div className="flex-1 mx-3 h-[1px] bg-slate-200"></div>
                      <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                        <span className="w-2.5 h-2.5 rounded-full border border-slate-400 inline-block"></span>
                        <span>مقصد</span>
                      </div>
                    </div>

                    {/* Origin & Destination Information */}
                    <div className="grid grid-cols-2 gap-4 items-start">
                      {/* Origin Details */}
                      <div>
                        <div className="text-lg font-black text-slate-900 mb-6 tracking-tight">
                          {flight.originName} ({flight.originCode})
                        </div>
                        <div className="text-xs text-slate-500 font-medium space-y-1">
                          <div>{originDate.fullDate}</div>
                          <div>ساعت {toPersianDigits(flight.originTime)}</div>
                        </div>
                      </div>

                      {/* Destination Details */}
                      <div>
                        <div className="text-lg font-black text-slate-900 mb-1 tracking-tight">
                          {flight.destName} ({flight.destCode})
                        </div>
                        <div className="text-xs text-sky-600 font-medium mb-3">
                          {terminalText}
                        </div>
                        <div className="text-xs text-slate-500 font-medium space-y-1">
                          <div>{destDate.fullDate}</div>
                          <div>ساعت {toPersianDigits(flight.destTime)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Left Column: Airline Technical Meta */}
                  <div className="col-span-4 border-r border-slate-200 p-5 text-xs flex flex-col justify-between space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-normal text-[11px]">شماره بلیط:</span>
                      <span className="font-bold text-slate-900 font-mono text-xs">{toPersianDigits(ticketNumber)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-normal text-[11px]">ایرلاین:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-xs">{flight.airline}</span>
                        <SafeAirlineLogo logoUrl={flight.airlineLogo} airline={flight.airline} size="w-5 h-5" />
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-normal text-[11px]">هواپیما:</span>
                      <span className="font-bold text-slate-900 font-mono text-xs">{aircraft}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-normal text-[11px]">کلاس کابین:</span>
                      <span className="font-bold text-slate-900 text-xs">{cabinClass}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-normal text-[11px]">شناسه نرخی:</span>
                      <span className="font-bold text-slate-900 font-mono text-xs">{rateClass}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-normal text-[11px]">کد رزرو ایرلاین (PNR):</span>
                      <span className="font-bold text-slate-900 font-mono text-xs tracking-wider">{data.passenger.pnr}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Passenger Row */}
                <div className="border-t border-slate-400 px-6 py-3.5 grid grid-cols-4 gap-4 text-xs bg-white">
                  <div>
                    <div className="text-slate-400 font-normal text-[11px] mb-1">نام و نام خانوادگی مسافر:</div>
                    <div className="font-black text-slate-900 text-xs truncate uppercase font-sans">
                      {data.passenger.firstName} {data.passenger.lastName}
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-400 font-normal text-[11px] mb-1">
                      {data.passenger.idType === 'NationalID' ? 'کد ملی مسافر:' : 'شماره گذرنامه:'}
                    </div>
                    <div className="font-bold text-slate-900 text-xs font-mono">
                      {toPersianDigits(data.passenger.passportNumber)}
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-400 font-normal text-[11px] mb-1">بازه سنی:</div>
                    <div className="font-bold text-slate-900 text-xs">
                      {data.passenger.gender === 'Child' ? 'کودک' : data.passenger.gender === 'Infant' ? 'نوزاد' : 'بزرگسال'}
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-400 font-normal text-[11px] mb-1">مقدار بار مجاز:</div>
                    <div className="font-bold text-slate-900 text-xs">
                      {formatBaggageFa(flight.baggage)}
                    </div>
                  </div>

                  {data.showPrice && data.passenger.price && (
                    <div className="col-span-4 mt-2 pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">مبلغ کل پرداختی:</span>
                      <span className="font-black text-slate-900 text-xs font-mono">
                        {toPersianDigits(data.passenger.price)} ریال
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Refund Policy (شرایط استرداد) */}
        <div className="mt-4 mb-6">
          <div className="flex justify-between items-baseline mb-1">
            <h3 className="text-[15px] font-black text-slate-900">شرایط استرداد</h3>
            <span className="text-xs text-slate-500 font-normal">
              زمان صدور بلیط: <strong className="font-bold text-slate-900 font-mono">{data.passenger.issueDate || issueDate.shortDate}{data.passenger.issueTime ? ` ساعت ${data.passenger.issueTime}` : ''}</strong>
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-3 font-normal leading-relaxed">
            در صورت استرداد بلیط، با توجه به موارد زیر، شما جریمه شده و از مبلغ بازگشتی به شما کاسته می‌شود.
          </p>

          <div className="border border-slate-400 rounded-xl overflow-hidden bg-white mb-2 text-xs">
            <div className="border-b border-slate-200 px-5 py-2 flex justify-between text-slate-400 font-normal text-[11px]">
              <span>زمان ثبت استرداد</span>
              <span>میزان جریمه</span>
            </div>
            {REFUND_RULES.map((rule, idx) => (
              <div 
                key={idx} 
                className="px-5 py-2.5 flex justify-between items-center border-b border-slate-100 last:border-b-0"
              >
                <span className="text-slate-600 font-normal text-xs">{rule.text}</span>
                <span className="font-black text-slate-900 font-sans text-xs">{rule.penalty}</span>
              </div>
            ))}
          </div>

          {/* Charter Info Badge on the left */}
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 text-xs text-slate-800 font-normal">
              <span>بلیت چارتری است.</span>
              <div className="w-3.5 h-3.5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold font-sans">
                i
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer at Bottom */}
      <div className="mt-auto pt-10 flex justify-between items-end border-t border-transparent text-xs text-slate-600">
        <div className="space-y-1.5">
          <div className="font-normal text-slate-500">
            نام آژانس:{' '}
            <strong className="text-slate-900 font-bold">{data.agency.name || 'ارض الرافدین'}</strong>
          </div>
          <div className="font-normal text-slate-500">
            تلفن پشتیبانی:{' '}
            <strong className="text-slate-900 font-bold font-mono">{toPersianDigits(data.agency.phone || '۰۹۳۶۹۸۴۸۹۱۷')}</strong>
          </div>
          <div className="font-normal text-slate-500">
            آدرس آژانس:{' '}
            <strong className="text-slate-900 font-bold">{data.agency.address || 'عراق نجف خیابان جنسیه مرکز لبنانی'}</strong>
          </div>
        </div>

        <div className="text-left font-mono font-bold text-slate-500 text-xs">
          {issueDate.shortDate}
        </div>
      </div>

      {!data.isLoggedIn && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
          <div className="transform -rotate-45 text-slate-900/[0.03] text-9xl font-black whitespace-nowrap select-none border-8 border-slate-900/[0.03] p-8 rounded-3xl font-sans">
            پیش‌نمایش
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 7. EXACT USER TICKET LAYOUT (100% Matching Layout)
// =========================================================================
function toEnglishDigits(str?: string) {
  if (!str) return '';
  return str
    .replace(/[۰-۹]/g, d => '0123456789'['۰۱۲۳۴۵۶۷۸۹'.indexOf(d)])
    .replace(/[٠-٩]/g, d => '0123456789'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)]);
}

function formatAirportEnglish(name?: string, code?: string) {
  const c = (code || '').toUpperCase().trim();
  const n = (name || '').trim();
  if (c === 'NJF' || n.includes('نجف') || n.toLowerCase().includes('najaf')) return 'Najaf (NJF)';
  if (c === 'AWZ' || n.includes('اهواز') || n.includes('سلیمانی') || n.includes('ینامیلس') || n.toLowerCase().includes('ahvaz')) return 'Ahvaz (AWZ)';
  if (c === 'MHD' || n.includes('مشهد') || n.toLowerCase().includes('mashhad')) return 'Mashhad (MHD)';
  if (c === 'THR' || n.includes('مهرآباد') || n.includes('تهران') || n.toLowerCase().includes('mehrabad') || n.toLowerCase().includes('tehran')) return 'Tehran (THR)';
  if (c === 'IKA' || n.includes('خمینی') || n.toLowerCase().includes('imam')) return 'Tehran (IKA)';
  if (c === 'SYZ' || n.includes('شیراز') || n.toLowerCase().includes('shiraz')) return 'Shiraz (SYZ)';
  if (c === 'IFN' || n.includes('اصفهان') || n.toLowerCase().includes('isfahan')) return 'Isfahan (IFN)';
  if (c === 'KIH' || n.includes('کیش') || n.toLowerCase().includes('kish')) return 'Kish (KIH)';
  if (c === 'TBZ' || n.includes('تبریز') || n.toLowerCase().includes('tabriz')) return 'Tabriz (TBZ)';
  if (c === 'DXB' || n.toLowerCase().includes('dubai')) return 'Dubai (DXB)';
  if (c === 'IST' || n.toLowerCase().includes('istanbul')) return 'Istanbul (IST)';
  
  const cleanCity = n.replace(/International\s*Airport/gi, '').replace(/Intl\s*Airport/gi, '').replace(/Airport/gi, '').trim();
  if (c && cleanCity) return `${cleanCity} (${c})`;
  if (c) return c;
  return cleanCity || 'Airport';
}

const ExactUserTicketLayout = ({ data }: { data: TicketData }) => {
  const idLabel = data.passenger.idType === 'NationalID' ? 'National Number' : 'Passport Number';
  const supportPhone = toEnglishDigits(data.agency.phone) || '09369848917';

  return (
    <div className="w-[794px] min-h-[1123px] bg-white p-10 font-sans antialiased text-slate-900 relative text-left flex flex-col justify-between" dir="ltr">
      <div>
        {/* Top Header with Solid Background and No Redundant Title */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm mb-6 flex justify-between items-center">
          {/* Agency Brand & Support */}
          <div className="flex items-center gap-4">
            {data.agency.showLogo && (
              <div className="w-16 h-16 rounded-xl bg-white p-2.5 flex items-center justify-center shrink-0 shadow-sm border border-white/20">
                {data.agency.logoUrl ? (
                  <img src={data.agency.logoUrl} className="w-full h-full object-contain" alt="Logo" referrerPolicy="no-referrer" />
                ) : (
                  <Plane className="w-8 h-8 text-blue-600" />
                )}
              </div>
            )}
            <div>
              <h1 className="text-xl font-black text-white tracking-tight uppercase leading-snug">
                {data.agency.name || 'If You Want To Go Far, Go Together'}
              </h1>
              
              {/* Support Phone Badge */}
              <div className="flex items-center gap-2 mt-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-xs text-blue-100 font-medium">
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  <span>Support: <strong className="font-mono text-white font-bold tracking-wide">{supportPhone}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="text-right">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Confirmed</span>
            </div>
          </div>
        </div>

        {/* Section: Ticket Details */}
        <div className="mb-6">
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2 mb-4">
            <div className="flex items-center gap-2 text-slate-900">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-black uppercase tracking-wider">Ticket Details</h2>
            </div>
            <div className="text-xs font-bold text-slate-400 font-mono tracking-wider">
              OFFICIAL RESERVATION DATA
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3.5 text-xs">
            {/* Issue Time */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 shadow-2xs hover:bg-white transition-colors">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Issue Time</span>
              <span className="font-black font-mono text-slate-900 text-base block">
                {data.passenger.issueTime || '18:11'}
              </span>
            </div>

            {/* Issue Date */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 shadow-2xs hover:bg-white transition-colors">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Issue Date</span>
              <span className="font-black font-mono text-slate-900 text-base block">
                {data.passenger.issueDate || '07/Nov/2025'}
              </span>
            </div>

            {/* Ticket Number */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 shadow-2xs hover:bg-white transition-colors">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Ticket Number</span>
              <span className="font-black font-mono text-slate-900 text-base block truncate min-h-[24px]">
                {data.passenger.ticketId || '-'}
              </span>
            </div>

            {/* PNR */}
            <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3.5 shadow-2xs hover:bg-blue-50 transition-colors">
              <span className="text-[11px] font-extrabold text-blue-600 uppercase tracking-wider block mb-1.5">PNR (Booking Ref)</span>
              <span className="font-black font-mono text-blue-700 text-lg block tracking-widest uppercase">{data.passenger.pnr || 'P2FS5'}</span>
            </div>

            {/* First Name */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 shadow-2xs hover:bg-white transition-colors">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">First Name</span>
              <span className="font-black text-slate-950 text-lg block uppercase truncate min-h-[28px] tracking-wide">
                {data.passenger.firstName || ''}
              </span>
            </div>

            {/* Last Name (Empty if blank, extra bold when filled) */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 shadow-2xs hover:bg-white transition-colors">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Last Name</span>
              <span className="font-black text-slate-950 text-lg block uppercase truncate min-h-[28px] tracking-wide">
                {data.passenger.lastName || ''}
              </span>
            </div>

            {/* Passport Number / National Number (Dynamic based on ID type) */}
            <div className="col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-3.5 shadow-2xs hover:bg-white transition-colors">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{idLabel}</span>
                <span className="text-[11px] font-bold text-slate-500 font-mono uppercase">{data.passenger.nationality || 'IRAN'}</span>
              </div>
              <span className="font-black font-mono text-slate-900 text-base block min-h-[24px]">
                {data.passenger.passportNumber || ''}
              </span>
            </div>
          </div>

          {/* Price Display when enabled (without IRR) */}
          {data.showPrice && data.passenger.price && (
            <div className="mt-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3.5 flex justify-between items-center shadow-2xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                <span className="text-xs font-black text-blue-950 uppercase tracking-wider">Total Ticket Fare & Taxes:</span>
              </div>
              <div className="text-xl font-black font-mono text-blue-700 tracking-tight">
                {data.passenger.price}
              </div>
            </div>
          )}
        </div>

        {/* Section: Flights */}
        <div className="space-y-4 mb-6">
          {(data.flights || []).map((flight, idx) => {
            const originTitle = formatAirportEnglish(flight.originName, flight.originCode);
            const destTitle = formatAirportEnglish(flight.destName, flight.destCode);

            return (
              <div key={idx} className="border border-slate-200 rounded-xl bg-white shadow-2xs overflow-hidden">
                {/* Flight Top Bar with Baggage instead of Direct Flight */}
                <div className="bg-slate-900 text-white px-6 py-3.5 flex justify-between items-center">
                  <span className="text-base font-black tracking-wide">
                    Flight Number: {flight.flightNumber || '7399'}
                  </span>
                  <span className="text-sm font-black text-white tracking-wider font-mono">
                    Baggage: {flight.baggage || '20 KG'}
                  </span>
                </div>

                {/* Timing, Logo First Then Time, Beautiful Route Design */}
                <div className="p-6">
                  <div className="flex items-center justify-between gap-6 mb-4">
                    {/* 1. First: Larger Airline Logo and Name */}
                    <div className="flex flex-col items-center justify-center shrink-0">
                      <div className="w-20 h-20 rounded-2xl bg-white border-2 border-slate-200 p-2 shadow-sm flex items-center justify-center overflow-hidden">
                        <SafeAirlineLogo logoUrl={flight.airlineLogo} airline={flight.airline} size="w-full h-full" border={false} />
                      </div>
                      <span className="font-black text-slate-800 text-xs mt-2 text-center max-w-[120px] truncate block font-sans">
                        {flight.airline || 'Airline'}
                      </span>
                    </div>

                    {/* Vertical Divider centered between Logo and Departure Time */}
                    <div className="h-16 w-[1.5px] bg-slate-200 shrink-0 mx-2"></div>

                    {/* 2. Then: Departure Time, Date & Origin */}
                    <div className="text-left min-w-[160px]">
                      <div className="text-4xl font-black font-mono text-slate-900 tracking-tight leading-none">{flight.originTime || '20:31'}</div>
                      <div className="text-xs font-bold text-slate-500 font-mono mt-1.5">{flight.date || '12/Nov/2025'}</div>
                      <div className="text-base font-black text-slate-800 mt-2">{originTitle}</div>
                    </div>

                    {/* 3. Modern Connecting Route Path */}
                    <div className="flex-1 px-4 flex flex-col items-center justify-center">
                      <div className="w-full flex items-center justify-center relative">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                        <div className="h-[2px] bg-slate-200 flex-1 mx-2"></div>
                        <ArrowRight className="w-4 h-4 text-blue-600 shrink-0" />
                        <div className="h-[2px] bg-slate-200 flex-1 mx-2"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                      </div>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-2">Non-Stop Flight</span>
                    </div>

                    {/* 4. Arrival Time, Date & Destination */}
                    <div className="text-right min-w-[160px]">
                      <div className="text-4xl font-black font-mono text-slate-900 tracking-tight leading-none">{flight.destTime || '20:31'}</div>
                      <div className="text-xs font-bold text-slate-500 font-mono mt-1.5">13/Nov/2025</div>
                      <div className="text-base font-black text-slate-800 mt-2">{destTitle}</div>
                    </div>
                  </div>

                  {/* Flight Footer Details (Clean Barcode Only - Baggage only in top bar) */}
                  <div className="pt-3 flex justify-center items-center text-xs">
                    <DeterministicBarcode height="h-7" showCode={false} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section: Important notes & Airport Check-in Regulations */}
        <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/70">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-blue-600" />
            Important notes & Airport Regulations
          </h2>
          <div className="text-xs text-slate-700 leading-relaxed space-y-1.5 font-sans">
            <p>
              <strong>• Domestic Flights:</strong> Passengers are required to be present at the airport terminal at least <strong>1.5 to 2 hours</strong> prior to scheduled departure. Boarding gates and check-in counters close <strong>30 minutes</strong> before departure.
            </p>
            <p>
              <strong>• International Flights:</strong> Passengers must arrive at the airport at least <strong>3 hours</strong> before flight departure. Check-in counters close <strong>60 minutes</strong> prior to scheduled departure.
            </p>
            <p>
              <strong>• Identification & Travel Documents:</strong> Original and valid photographic identification (National ID card for domestic flights, or valid Passport with requisite entry visas for international flights) matching the name on this ticket is mandatory for check-in and boarding.
            </p>
            <p>
              <strong>• Baggage Policy:</strong> Checked baggage allowance is strictly limited to the weight specified on this ticket. Carry-on hand baggage must adhere to standard aviation safety dimensions and security regulations.
            </p>
          </div>
        </div>
      </div>

      {/* Document Footer */}
      <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-400">
        <div>Official Electronic Passenger Ticket & Receipt</div>
        <div className="font-mono font-medium">Page 1 of 1</div>
      </div>
    </div>
  );
};

// =========================================================================
// Main Ticket Preview Router
// =========================================================================
export const TicketPreview = forwardRef<HTMLDivElement, { data: TicketData }>(({ data }, ref) => {
  return (
    <div ref={ref} className="bg-white fit-content shadow-2xl font-sans text-left" dir="ltr">
      <ExactUserTicketLayout data={data} />
    </div>
  );
});

TicketPreview.displayName = 'TicketPreview';

