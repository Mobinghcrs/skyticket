
import { forwardRef } from 'react';
import { TicketData, TripType, Flight } from '../types';
import { Plane, Phone, ArrowRight, QrCode, Luggage, User } from 'lucide-react';

const THEMES: Record<string, { bg: string, text: string, accent: string, border: string }> = {
  '1': { bg: 'bg-blue-600', text: 'text-blue-600', accent: 'text-blue-500', border: 'border-blue-200' },
  '3': { bg: 'bg-rose-600', text: 'text-rose-600', accent: 'text-rose-500', border: 'border-rose-200' },
  '4': { bg: 'bg-gradient-to-r from-amber-400 to-amber-600', text: 'text-amber-600', accent: 'text-amber-500', border: 'border-amber-200' },
};

const Barcode = () => (
  <div className="h-10 w-full flex items-end justify-center gap-[2px] opacity-80 mix-blend-multiply">
      {[...Array(60)].map((_, i) => (
          <div key={i} className="bg-black" style={{ 
              width: Math.random() > 0.5 ? '2px' : '4px', 
              height: Math.random() > 0.7 ? '100%' : '80%' 
          }}></div>
      ))}
  </div>
);

const FlightPath = ({ duration = '2h 15m' }) => (
    <div className="flex flex-col items-center justify-center w-full px-4">
        <div className="flex items-center w-full text-gray-300 relative">
            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            <div className="h-[2px] bg-gray-300 flex-1 relative">
                <Plane className="w-4 h-4 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-gray-400 rotate-90" />
            </div>
            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
        </div>
        <span className="text-[10px] text-gray-400 mt-1">{duration}</span>
    </div>
);

const SystemSepehrNewLayout = ({ data }: { data: TicketData }) => {
    return (
        <div className="w-[794px] min-h-[1123px] bg-white p-8 font-sans relative text-left" dir="ltr">
            {/* Header: Logo & Phone */}
            <div className="flex justify-between items-center mb-4 border-b-4 border-[#3b82f6] pb-4">
                <div className="flex items-center gap-4">
                     {data.agency.showLogo && (
                         <div className="w-20 h-20 flex items-center justify-center overflow-hidden bg-gray-50 rounded-lg border border-gray-100">
                             {data.agency.logoUrl ? (
                                  <img src={data.agency.logoUrl} className="w-full h-full object-contain" alt="Logo" />
                             ) : (
                                  <Plane className="text-gray-300 w-10 h-10" />
                             )}
                         </div>
                     )}
                     <div>
                         <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">{data.agency.name}</h1>
                         <div className="flex items-center gap-2 text-gray-600 font-bold mt-1">
                             <Phone className="w-4 h-4 text-[#3b82f6]" />
                             <span>Support: {data.agency.phone}</span>
                         </div>
                     </div>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-black text-[#3b82f6] tracking-tighter">E-TICKET</div>
                    <div className="text-sm font-bold text-gray-400 tracking-widest">BOARDING PASS</div>
                </div>
            </div>

            {/* Ticket Detail Box */}
            <div className="border border-gray-200 rounded-xl p-6 mb-6 shadow-sm bg-white">
                <h2 className="text-lg font-bold text-black mb-6">Ticket detail</h2>
                <div className="grid grid-cols-2 gap-y-1 text-sm"> {/* Reduced gap for tighter look */}
                    {/* Row 1 */}
                    <div className="flex justify-between pr-8 border-r border-gray-100 items-center py-1">
                        <span className="text-gray-500">Ticket ID:</span>
                        <span className="font-bold text-gray-800">{data.passenger.ticketId}</span>
                    </div>
                    <div className="flex justify-between pl-8 items-center py-1">
                        <span className="text-gray-500">Nationality:</span>
                        <span className="font-bold text-gray-800 uppercase">{data.passenger.nationality}</span>
                    </div>

                    {/* Row 2 */}
                    <div className="flex justify-between pr-8 border-r border-gray-100 items-center py-1">
                        <span className="text-gray-500">Gender:</span>
                        <span className="font-bold text-gray-800">{data.passenger.gender}</span>
                    </div>
                    <div className="flex justify-between pl-8 items-center py-1">
                        <span className="text-gray-500">PNR:</span>
                        <span className="font-bold text-gray-800 uppercase">{data.passenger.pnr}</span>
                    </div>

                    {/* Row 3 */}
                    <div className="flex justify-between pr-8 border-r border-gray-100 items-center py-1">
                        <span className="text-gray-500">First Name:</span>
                        <span className="font-bold text-gray-800 uppercase">{data.passenger.firstName}</span>
                    </div>
                    <div className="flex justify-between pl-8 items-center py-1">
                         <span className="text-gray-500">Last Name:</span>
                         <span className="font-bold text-gray-800 uppercase">{data.passenger.lastName}</span>
                    </div>

                    {/* Row 4 - items-start prevents shifting of Passport Number when Price is added */}
                    <div className="flex justify-between pr-8 border-r border-gray-100 items-start py-1 pt-2">
                        <span className="text-gray-500">{data.passenger.idType === 'NationalID' ? 'National ID:' : 'Passport Number:'}</span>
                        <span className="font-bold text-gray-800">{data.passenger.passportNumber}</span>
                    </div>
                     <div className="pl-8">
                        {data.showPrice && (
                             <div className="flex justify-between pt-8 items-center border-t border-dashed border-gray-100 mt-2">
                                 <span className="text-gray-500 text-sm font-bold">Total Rate:</span>
                                 <span className="font-bold text-[#3b82f6] text-3xl">{data.passenger.price}</span>
                             </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Flights */}
            <div className="space-y-4">
                {data.flights.map((flight, idx) => (
                    <div key={idx} className="flex bg-gray-50 rounded-xl overflow-hidden shadow-sm border border-gray-200 min-h-[160px]">
                        {/* Blue Vertical Bar */}
                        <div className="w-14 bg-[#3b82f6] flex items-center justify-center text-white relative">
                            <span className="block transform -rotate-90 whitespace-nowrap font-bold tracking-wide text-sm">
                                {flight.type}
                            </span>
                        </div>

                        {/* Flight Content */}
                        <div className="flex-1 p-5 relative">
                            {/* Top Row: Flight No & Class */}
                            <div className="flex justify-between items-start mb-4 border-b border-gray-200 pb-2">
                                <div className="text-gray-800 font-bold text-sm">Flight number: <span className="text-black">{flight.flightNumber}</span></div>
                                <div className="text-gray-800 font-bold text-sm">economy</div>
                            </div>

                            {/* Middle Row: Times & Route */}
                            <div className="flex justify-between items-center mb-6">
                                {/* Origin */}
                                <div>
                                    <div className="text-3xl font-bold text-black">{flight.originTime}</div>
                                    <div className="text-xs text-gray-500 mt-1">{flight.date}</div>
                                    <div className="text-xs text-gray-500 mt-0.5">{flight.originName} ({flight.originCode})</div>
                                </div>

                                {/* Center Icon */}
                                <div className="flex flex-col items-center px-4">
                                    <Plane className="w-6 h-6 text-gray-400 transform rotate-90 mb-1" />
                                    <span className="text-[10px] text-gray-400">nonstop</span>
                                </div>

                                {/* Destination */}
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-black">{flight.destTime}</div>
                                    <div className="text-xs text-gray-500 mt-1">{flight.date}</div>
                                    <div className="text-xs text-gray-500 mt-0.5">{flight.destName} ({flight.destCode})</div>
                                </div>
                            </div>

                            {/* Bottom Row: Logo & Baggage */}
                            <div className="flex justify-between items-end">
                                <div className="flex items-center gap-2">
                                    {data.agency.showLogo ? (
                                       <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white overflow-hidden">
                                           {data.agency.logoUrl ? (
                                                <img src={data.agency.logoUrl} className="w-full h-full object-cover" />
                                           ) : (
                                                // Default Sepehran/Bird logo look
                                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
                                           )}
                                       </div>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                                    )}
                                    <span className="text-sm font-bold text-gray-800">{flight.airline}</span>
                                </div>
                                
                                <div className="flex items-center gap-1 text-xs font-bold text-gray-700">
                                    <span>({flight.baggage} each)</span>
                                    <Luggage className="w-4 h-4 text-gray-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Important Notes */}
            <div className="mt-6 border border-gray-200 rounded-xl p-4 bg-white">
                <h3 className="font-bold text-sm mb-3">Important notes</h3>
                <ul className="text-[8px] md:text-[9px] text-gray-600 space-y-1.5 list-disc pl-3 leading-tight">
                    <li>Wheelchair services can be used at Najaf and Baghdad airports after calculating and receiving the amount from the passenger by the airline representatives.</li>
                    <li>Travel requirements for Iranian travelers to Iraqi destinations from Iran: All travelers over the age of 12 and 14 days after the second dose of approved vaccines must be vaccinated.</li>
                    <li>WHO provided that you carry an English language, digital or physical vaccine card with QR code (available from Vcr.Salamat.gov.ir website) without The need for a PCR test has been confirmed.</li>
                    <li>For travelers who have not been vaccinated or who do not have a valid vaccination card, a negative PCR test must be taken within a maximum of 72 hours.</li>
                    <li>The test until leaving the laboratories accredited by the Ministry of Health is mandatory in English written on a QR code.</li>
                    <li>Entry requirements for Iranian travelers from Iraq to Iran: Hold a valid vaccine card in English with a QR code or a negative answer to a PCR test in English It is valid for 72 hours from the time of the test until the flight, and is mandatory for all passengers aged 12 years and over.</li>
                    <li>On foreign flights, the passenger must be at the airport 4 hours before the flight, and is responsible for checking the ticket, visa and passport due to the ban on leaving the country and the validity date.</li>
                    <li>Passport is the responsibility of the traveler (reserve trustee) and Reeh Balsamman Company is not responsible for these matters, and the amount of baggage allowed for passengers on the Najaf-Baghdad road is 20 kilos.</li>
                </ul>
            </div>
            
            {!data.isLoggedIn && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
                <div className="transform -rotate-45 text-red-500/10 text-9xl font-bold whitespace-nowrap select-none border-4 border-red-500/10 p-4">
                  PREVIEW
                </div>
              </div>
            )}
        </div>
    );
};

const SepehrLayout = ({ data }: { data: TicketData }) => {
    return (
        <div className="w-[794px] min-h-[1123px] bg-white p-12 text-black font-serif relative text-left" dir="ltr">
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
                <div className="flex items-center gap-4">
                    {data.agency.showLogo && (
                        <div className="w-16 h-16 rounded-full border-2 border-red-700 flex items-center justify-center text-red-700 font-bold overflow-hidden p-1">
                            {data.agency.logoUrl ? (
                                <img src={data.agency.logoUrl} className="w-full h-full object-contain" alt="Logo" />
                            ) : (
                                <div className="flex flex-col items-center leading-none">
                                    <span className="text-2xl">ATA</span>
                                </div>
                            )}
                        </div>
                    )}
                    <div>
                        <h1 className="text-xl font-bold uppercase tracking-wider">ATA AIRLINES</h1>
                        <p className="text-xs text-gray-500">Electronic Ticket Receipt</p>
                    </div>
                </div>
                
                <div className="text-center">
                    <div className="text-sm font-bold text-gray-500 uppercase">Ticket Number</div>
                    <div className="text-xl font-bold tracking-widest">{data.passenger.ticketId || '0000001108182'}</div>
                    <div className="text-xs mt-1">Issue Date: {new Date().toLocaleString('en-US')}</div>
                </div>

                <div className="w-48 text-right">
                   <Barcode />
                   <div className="text-[10px] text-center tracking-[0.3em] mt-1">* {data.passenger.ticketId?.slice(-10) || '0000000000'} *</div>
                </div>
            </div>

            {/* Passenger Row */}
            <div className="flex border-b-2 border-black pb-2 mb-6 items-end">
                <div className="flex-1">
                    <span className="block text-xs text-gray-500 font-bold mb-1 ml-1">Passenger Name</span>
                    <div className="text-xl font-bold uppercase pl-2">
                        {data.passenger.firstName} {data.passenger.lastName} <span className="text-sm font-normal text-gray-600">_ {data.passenger.gender === 'Female' ? 'MS' : 'MR'} - Adult</span>
                    </div>
                </div>
                <div className="w-1/3 text-right">
                    <span className="block text-xs text-gray-500 font-bold mb-1">
                        {data.passenger.idType === 'NationalID' ? 'National ID' : 'Passport No'}
                    </span>
                    <div className="text-xl font-bold uppercase">
                        {data.passenger.passportNumber} <span className="text-sm font-normal ml-2">{data.passenger.nationality}</span>
                    </div>
                </div>
            </div>

            {/* Flight Details Grid */}
            <div className="space-y-8">
                {data.flights.map((flight, idx) => (
                    <div key={idx} className="border-b border-gray-300 pb-8 last:border-0">
                        <div className="grid grid-cols-3 gap-y-6 gap-x-8">
                            {/* Row 1 */}
                            <div className="border-b border-black pb-1">
                                <span className="block text-xs text-gray-500 mb-1">Origin</span>
                                <div className="text-xl font-bold">{flight.originName || flight.originCode}</div>
                            </div>
                            <div className="border-b border-black pb-1">
                                <span className="block text-xs text-gray-500 mb-1">Destination</span>
                                <div className="text-xl font-bold">{flight.destName || flight.destCode}</div>
                            </div>
                            <div className="border-b border-black pb-1">
                                <span className="block text-xs text-gray-500 mb-1">Flight time</span>
                                <div className="text-xl font-bold">{flight.originTime} <span className="text-xs font-normal text-gray-500 ml-1">local time</span></div>
                            </div>

                            {/* Row 2 */}
                            <div className="border-b border-black pb-1">
                                <span className="block text-xs text-gray-500 mb-1">Flight Date</span>
                                <div className="text-lg font-bold">{flight.date}</div>
                            </div>
                            <div className="border-b border-black pb-1">
                                <span className="block text-xs text-gray-500 mb-1">Flight Number</span>
                                <div className="text-lg font-bold">{flight.flightNumber} {flight.airline.slice(0,3).toUpperCase()}</div>
                            </div>
                            <div className="border-b border-black pb-1">
                                <span className="block text-xs text-gray-500 mb-1">Class</span>
                                <div className="text-lg font-bold flex justify-between">
                                    Economy <span className="font-mono">{flight.flightClass || 'YYSFF'}</span>
                                </div>
                            </div>

                            {/* Row 3 */}
                            <div className="border-b border-black pb-1 flex gap-4">
                                <div className="flex-1">
                                    <span className="block text-xs text-gray-500 mb-1">Checked Baggage</span>
                                    <div className="font-bold text-sm">1 Bag(s) <span className="text-lg">{flight.baggage}</span> in total</div>
                                </div>
                                <div className="flex-1 border-l pl-4 border-gray-200">
                                    <span className="block text-xs text-gray-500 mb-1">Hand Baggage</span>
                                    <div className="font-bold text-sm">1 Bag(s) <span className="text-lg text-green-700">{flight.handBaggage || '5 Kg'}</span> in total</div>
                                </div>
                            </div>
                            <div className="border-b border-black pb-1">
                                <span className="block text-xs text-gray-500 mb-1">Local PNR</span>
                                <div className="text-xl font-bold">{data.passenger.localPnr || data.passenger.pnr}</div>
                            </div>
                            <div className="border-b border-black pb-1">
                                <span className="block text-xs text-gray-500 mb-1">Payment Amount</span>
                                <div className="text-xl font-bold">{data.passenger.price || '57,000,000'}</div>
                            </div>
                        </div>
                        
                        <div className="mt-4 text-xs text-center text-gray-600">
                            The flight duration is approx 1 hour and 30 minutes and the arrival time is at {flight.destTime} (in destination's local time)
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Text */}
            <div className="mt-auto pt-10 text-right text-xs leading-relaxed text-gray-600 border-t-2 border-black">
                <p className="font-bold mb-2">Cancellation Policy:</p>
                <p>The cancellation penalty until 15 minutes after reservation(only 24 hours before flight): 0%</p>
                <p>The cancellation penalty from the time of ticket issuance until (12:00 noon), 3 days before the flight: 50%</p>
                <p>The cancellation penalty from (12:00 noon), 3 days before the flight until (12:00 noon), 2 days before the flight: 70%</p>
                <p>The cancellation penalty from (12:00 noon), 2 days before the flight until (12:00 noon), 1 days before the flight: 80%</p>
                <p>The cancellation penalty from (12:00 noon), 1 days before the flight until 9 hours before the flight: 90%</p>
                <p>The cancellation penalty from 9 hours before the flight onwards: 100% (No-Show)</p>
                
                <p className="mt-4 text-gray-800 font-medium">
                   * Ticket price includes 9% VAT and airport taxes. Adherence to national aviation protocols and mask usage in all airports and flights is mandatory. *
                </p>
            </div>

            {/* QR Footer */}
            <div className="mt-8 flex justify-end items-center gap-4">
                <div className="text-right">
                    <p className="font-serif italic text-gray-500 mb-1">Please scan QR code to check authenticity of your ticket</p>
                </div>
                <div className="w-24 h-24 bg-white border-2 border-black p-1">
                     <QrCode className="w-full h-full text-black" />
                </div>
            </div>

            <div className="absolute bottom-4 left-0 w-full text-center text-[10px] text-gray-400">
                System Sepehr - Reserve Online Ticket - Tashrifat Safar Aran - 05138887 - Support 24/7 - 09029578104
            </div>

            {!data.isLoggedIn && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
                <div className="transform -rotate-45 text-red-500/20 text-9xl font-bold whitespace-nowrap select-none border-4 border-red-500/20 p-4">
                  HUR TECH TEST
                </div>
              </div>
            )}
        </div>
    );
};

const StandardLayout = ({ data }: { data: TicketData }) => {
  const theme = THEMES[data.templateId] || THEMES['1'];
  return (
      <div className="w-[794px] min-h-[1123px] bg-white text-gray-900 relative shadow-2xl overflow-hidden flex flex-col text-left" dir="ltr">
        {/* Header */}
        <div className="p-8 border-b border-gray-200 flex justify-between items-start relative overflow-hidden">
           <div className={`absolute top-0 right-0 w-64 h-64 ${theme.bg} rounded-bl-full opacity-10 -mr-16 -mt-16`}></div>
           <div className="flex gap-6 items-center z-10">
              {data.agency.showLogo && (
                  <div className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center p-2 shadow-sm">
                      {data.agency.logoUrl ? <img src={data.agency.logoUrl} className="w-full h-full object-contain" /> : <Plane className={theme.text} size={32} />}
                  </div>
              )}
              <div>
                 <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">{data.agency.name}</h1>
                 <p className="text-sm text-gray-500 flex items-center gap-2 mt-1"><Phone size={14} /> {data.agency.phone}</p>
              </div>
           </div>
           <div className="text-right z-10">
              <div className="inline-block px-4 py-1 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full mb-2 border border-green-100">Confirmed</div>
              <p className="text-sm text-gray-400 font-medium">Booking Reference</p>
              <p className="text-3xl font-mono font-bold text-gray-900 tracking-tight">{data.passenger.pnr}</p>
           </div>
        </div>

        {/* Passenger Info - Compact Grid */}
        <div className="p-8 bg-gray-50 border-b border-gray-200">
           <h3 className={`text-xs font-bold uppercase tracking-wider ${theme.text} mb-4 flex items-center gap-2`}>Passenger Information</h3>
           <div className="grid grid-cols-4 gap-6">
              <div><p className="text-[10px] uppercase text-gray-500 font-bold mb-1">Full Name</p><p className="font-bold text-gray-900 truncate">{data.passenger.firstName} {data.passenger.lastName}</p></div>
              <div>
                  <p className="text-[10px] uppercase text-gray-500 font-bold mb-1">
                      {data.passenger.idType === 'NationalID' ? 'National ID' : 'Passport No'}
                  </p>
                  <p className="font-mono text-gray-700">{data.passenger.passportNumber}</p>
              </div>
              <div><p className="text-[10px] uppercase text-gray-500 font-bold mb-1">Nationality</p><p className="text-gray-700">{data.passenger.nationality}</p></div>
              <div>
                  <p className="text-[10px] uppercase text-gray-500 font-bold mb-1">Ticket Number</p>
                  <p className="font-mono text-gray-700 tracking-wide text-xs">{data.passenger.ticketId}</p>
              </div>
              {data.showPrice && (
                  <div className="col-span-4 mt-2 pt-2 border-t border-gray-200">
                      <p className="text-[10px] uppercase text-gray-500 font-bold mb-1">Total Price</p>
                      <p className="font-bold text-lg text-gray-900">{data.passenger.price}</p>
                  </div>
              )}
           </div>
        </div>

        {/* Flights */}
        <div className="flex-1 p-8 bg-white space-y-8">
           {data.flights.map((flight, index) => (
             <div key={index} className="relative">
                <div className="flex items-center gap-4 mb-4">
                   <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${theme.bg}`}>{flight.type}</div>
                   <div className="h-px bg-gray-200 flex-1"></div>
                </div>
                <div className={`flex flex-col border ${theme.border} rounded-2xl overflow-hidden`}>
                    <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-400">{flight.airline.slice(0,2)}</div>
                           <span className="font-bold text-gray-900">{flight.airline}</span>
                           <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200 ml-2 font-mono">FL {flight.flightNumber}</span>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-4">
                           <span className="flex items-center gap-1"><Plane size={12} /> {flight.baggage}</span>
                           <span className="font-medium text-gray-900">{flight.date}</span>
                        </div>
                    </div>
                    <div className="p-6 flex items-center justify-between">
                        <div className="text-center w-1/4">
                           <div className="text-4xl font-bold text-gray-900 mb-1">{flight.originTime}</div>
                           <div className="text-3xl font-black text-gray-200 absolute -mt-10 -ml-4 -z-10 opacity-50">{flight.originCode}</div>
                           <div className="text-sm font-bold text-gray-600 uppercase tracking-wide">{flight.originCode}</div>
                           <div className="text-xs text-gray-400 truncate max-w-[120px] mx-auto">{flight.originName}</div>
                        </div>
                        
                        <div className="flex-1 px-8 flex flex-col items-center justify-center relative">
                           <div className="w-full border-t-2 border-dashed border-gray-300 absolute top-1/2"></div>
                           <Plane className={`text-gray-300 bg-white px-2 relative z-10 rotate-90 ${theme.accent}`} size={32} />
                           <span className="text-[10px] text-gray-400 mt-2 bg-white px-2 relative z-10">Direct Flight</span>
                        </div>

                        <div className="text-center w-1/4">
                           <div className="text-4xl font-bold text-gray-900 mb-1">{flight.destTime}</div>
                           <div className="text-3xl font-black text-gray-200 absolute -mt-10 ml-4 -z-10 opacity-50">{flight.destCode}</div>
                           <div className="text-sm font-bold text-gray-600 uppercase tracking-wide">{flight.destCode}</div>
                           <div className="text-xs text-gray-400 truncate max-w-[120px] mx-auto">{flight.destName}</div>
                        </div>
                    </div>
                </div>
             </div>
           ))}
        </div>

        {/* Footer */}
        <div className="p-8 bg-gray-50 border-t border-gray-200 text-[10px] text-gray-400 leading-relaxed text-justify">
           <p className="mb-2 font-bold text-gray-500">IMPORTANT NOTES</p>
           <p>1. Check-in counters open 3 hours prior to departure and close 60 minutes before scheduled departure time. 2. Passengers must present a valid photo ID and this e-ticket at the check-in counter. 3. Baggage allowance is specified on the ticket; excess baggage will be charged at current rates. 4. Carriage is subject to the carrier's conditions of carriage and related regulations. 5. This ticket is non-transferable and valid only for the passenger named herein.</p>
        </div>

        {!data.isLoggedIn && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
            <div className="transform -rotate-45 text-gray-300/50 text-9xl font-bold whitespace-nowrap select-none">
              HUR TECH TEST
            </div>
          </div>
        )}
      </div>
  );
};

const SidebarLayout = ({ data }: { data: TicketData }) => {
    return (
        <div className="w-[794px] min-h-[1123px] bg-white flex relative shadow-2xl text-left" dir="ltr">
            {/* Left Sidebar */}
            <div className="w-[260px] bg-slate-900 text-white p-8 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent"></div>
                
                {/* Branding */}
                <div className="relative z-10 mb-12">
                    <div className="flex items-center gap-3 mb-2">
                        {data.agency.showLogo && (
                             <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center overflow-hidden">
                                 {data.agency.logoUrl ? <img src={data.agency.logoUrl} className="w-full h-full object-cover" /> : <Plane className="text-white" size={20} />}
                             </div>
                        )}
                         <span className="font-bold text-lg tracking-wide">SKYTRAVEL</span>
                    </div>
                    <p className="text-xs text-slate-400">Premium Booking Service</p>
                </div>

                {/* Passenger Details */}
                <div className="relative z-10 space-y-8 flex-1">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Passenger</p>
                        <h2 className="text-2xl font-bold text-white leading-tight break-words">{data.passenger.firstName}<br/><span className="text-blue-400">{data.passenger.lastName}</span></h2>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                            <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">
                                {data.passenger.idType === 'NationalID' ? 'National ID' : 'Passport Number'}
                            </p>
                            <p className="font-mono text-sm text-white">{data.passenger.passportNumber}</p>
                        </div>
                        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                            <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Nationality</p>
                            <p className="font-medium text-sm text-white">{data.passenger.nationality}</p>
                        </div>
                        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                            <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Reference PNR</p>
                            <p className="font-mono text-xl text-yellow-400 tracking-wider">{data.passenger.pnr}</p>
                        </div>
                    </div>

                    {data.showPrice && (
                        <div className="mt-8 pt-8 border-t border-slate-700">
                             <p className="text-xs text-slate-400 mb-1">Total Paid</p>
                             <p className="text-3xl font-bold text-white">{data.passenger.price}</p>
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                <div className="relative z-10 mt-auto pt-8 text-[10px] text-slate-500">
                    <p>{data.agency.name}</p>
                    <p>{data.agency.phone}</p>
                </div>
            </div>

            {/* Right Content */}
            <div className="flex-1 p-10 flex flex-col bg-slate-50">
                <div className="flex justify-between items-end border-b-2 border-slate-200 pb-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">E-Ticket Receipt</h1>
                        <p className="text-sm text-slate-500 mt-1">Thank you for flying with us.</p>
                    </div>
                    <div className="text-right">
                         <div className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide inline-block mb-1">Confirmed</div>
                         <p className="text-xs text-slate-400">{new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="space-y-6 flex-1">
                    {data.flights.map((flight, idx) => (
                        <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative group">
                             <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-900 group-hover:bg-blue-600 transition-colors"></div>
                             
                             {/* Flight Header */}
                             <div className="px-6 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                 <div className="flex items-center gap-2">
                                     <span className="font-bold text-slate-700">{flight.airline}</span>
                                     <span className="text-xs bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-500">{flight.flightNumber}</span>
                                 </div>
                                 <div className="text-xs font-medium text-slate-500">{flight.date}</div>
                             </div>

                             {/* Flight Route */}
                             <div className="p-6 flex items-center justify-between">
                                  <div className="text-center min-w-[80px]">
                                      <div className="text-3xl font-black text-slate-800">{flight.originTime}</div>
                                      <div className="text-sm font-bold text-slate-500">{flight.originCode}</div>
                                  </div>

                                  <div className="flex-1 px-8">
                                      <FlightPath />
                                  </div>

                                  <div className="text-center min-w-[80px]">
                                      <div className="text-3xl font-black text-slate-800">{flight.destTime}</div>
                                      <div className="text-sm font-bold text-slate-500">{flight.destCode}</div>
                                  </div>
                             </div>

                             {/* Footer Details */}
                             <div className="px-6 py-3 bg-slate-50 flex gap-6 text-xs text-slate-500 border-t border-slate-100">
                                 <span>Class: <strong className="text-slate-700">Economy</strong></span>
                                 <span>Baggage: <strong className="text-slate-700">{flight.baggage}</strong></span>
                                 <span>Type: <strong className="text-slate-700">{flight.type}</strong></span>
                             </div>
                        </div>
                    ))}
                </div>

                <div className="mt-auto">
                    <Barcode />
                    <p className="text-center text-[10px] text-slate-400 mt-2 font-mono tracking-widest">{data.passenger.ticketId}</p>
                </div>
            </div>

            {!data.isLoggedIn && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
                <div className="transform rotate-90 md:rotate-45 text-slate-900/10 text-9xl font-bold whitespace-nowrap select-none border-4 border-slate-900/10 p-10">
                  HUR TECH TEST
                </div>
              </div>
            )}
        </div>
    );
};

const VerticalLayout = ({ data }: { data: TicketData }) => {
    return (
        <div className="w-[794px] min-h-[1123px] bg-slate-100 p-12 flex justify-center items-start text-left" dir="ltr">
            <div className="w-[400px] bg-white rounded-3xl shadow-2xl overflow-hidden relative">
                {/* Header Section */}
                <div className="bg-slate-800 text-white p-6 relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                             <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm"><Plane size={20} /></div>
                             <span className="font-bold tracking-wide">BOARDING PASS</span>
                        </div>
                        <QrCode className="opacity-80" size={32} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Passenger</p>
                        <p className="text-xl font-bold">{data.passenger.firstName} {data.passenger.lastName}</p>
                    </div>
                </div>

                {/* Tear Line */}
                <div className="relative h-8 bg-slate-800 -mb-[1px]">
                     <div className="absolute bottom-0 w-full h-8 bg-white rounded-t-3xl"></div>
                </div>

                {/* Body */}
                <div className="px-6 pb-8 space-y-8 bg-white">
                    {data.flights.map((flight, idx) => (
                        <div key={idx} className="space-y-4">
                            <div className="flex justify-between items-end border-b border-dashed border-gray-200 pb-4">
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">{flight.date}</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-black text-slate-800">{flight.originCode}</span>
                                        <span className="text-gray-300 mx-2">✈</span>
                                        <span className="text-3xl font-black text-slate-800">{flight.destCode}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{flight.originName} to {flight.destName}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4">
                                 <div>
                                     <p className="text-[10px] uppercase text-gray-400 font-bold">Departs</p>
                                     <p className="text-lg font-bold text-slate-800">{flight.originTime}</p>
                                 </div>
                                 <div>
                                     <p className="text-[10px] uppercase text-gray-400 font-bold">Arrives</p>
                                     <p className="text-lg font-bold text-slate-800">{flight.destTime}</p>
                                 </div>
                                 <div>
                                     <p className="text-[10px] uppercase text-gray-400 font-bold">Flight</p>
                                     <p className="text-lg font-bold text-slate-800">{flight.flightNumber}</p>
                                 </div>
                            </div>
                        </div>
                    ))}

                    <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-4">
                         <div>
                             <p className="text-[10px] uppercase text-gray-400 font-bold">PNR</p>
                             <p className="font-mono font-bold text-slate-800">{data.passenger.pnr}</p>
                         </div>
                         <div>
                             <p className="text-[10px] uppercase text-gray-400 font-bold">Seat</p>
                             <p className="font-mono font-bold text-slate-800">ANY</p>
                         </div>
                    </div>
                </div>

                {/* Footer Barcode */}
                <div className="bg-white px-6 pb-6">
                    <Barcode />
                </div>
                
                {!data.isLoggedIn && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                      <div className="bg-red-500/90 text-white px-8 py-2 font-bold transform -rotate-12 shadow-xl border-2 border-white">SAMPLE</div>
                  </div>
                )}
            </div>
        </div>
    );
};

export const TicketPreview = forwardRef<HTMLDivElement, { data: TicketData }>(({ data }, ref) => {
  // Render based on template ID
  // 1,3,4 -> Horizontal Standard
  // 2 -> Horizontal Sidebar
  // 5,6 -> Vertical Card
  // 7 -> Sepehr A4
  // 8 -> Sepehr New (Pixel Perfect)
  
  const isSidebar = data.templateId === '2';
  const isVertical = ['5', '6'].includes(data.templateId);
  const isSepehr = data.templateId === '7';
  const isSepehrNew = data.templateId === '8';

  return (
    <div ref={ref} className="bg-white fit-content shadow-2xl font-sans text-left" dir="ltr">
      {isSepehrNew ? (
          <SystemSepehrNewLayout data={data} />
      ) : isSepehr ? (
          <SepehrLayout data={data} />
      ) : isSidebar ? (
          <SidebarLayout data={data} />
      ) : isVertical ? (
          <VerticalLayout data={data} />
      ) : (
          <StandardLayout data={data} />
      )}
    </div>
  );
});

TicketPreview.displayName = 'TicketPreview';