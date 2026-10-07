import { Airport } from '../../types';

export const COMPREHENSIVE_AIRPORTS: Airport[] = [
  // =========================================================================
  // IRAN - ALL PROVINCES, INTERNATIONAL, DOMESTIC, FREE ZONES & ISLANDS
  // =========================================================================
  // Tehran Province
  { id: 'ir-1', code: 'THR', name: 'Mehrabad International Airport', city: 'Tehran', country: 'Iran' },
  { id: 'ir-2', code: 'IKA', name: 'Imam Khomeini International Airport', city: 'Tehran', country: 'Iran' },
  { id: 'ir-3', code: 'PYK', name: 'Payam International Airport', city: 'Karaj', country: 'Iran' },

  // Razavi Khorasan Province
  { id: 'ir-4', code: 'MHD', name: 'Mashhad Shahid Hasheminejad International Airport', city: 'Mashhad', country: 'Iran' },
  { id: 'ir-5', code: 'AFZ', name: 'Sabzevar Airport', city: 'Sabzevar', country: 'Iran' },
  { id: 'ir-6', code: 'GNA', name: 'Gonabad Shahid Salari Airport', city: 'Gonabad', country: 'Iran' },
  { id: 'ir-7', code: 'CKT', name: 'Sarakhs Airport', city: 'Sarakhs', country: 'Iran' },
  { id: 'ir-8', code: 'KSM', name: 'Kashmar Airport', city: 'Kashmar', country: 'Iran' },

  // Fars Province
  { id: 'ir-9', code: 'SYZ', name: 'Shiraz Shahid Dastgheib International Airport', city: 'Shiraz', country: 'Iran' },
  { id: 'ir-10', code: 'LRR', name: 'Lar Ayatollah Ayatollahi Airport', city: 'Lar', country: 'Iran' },
  { id: 'ir-11', code: 'LFM', name: 'Lamerd International Airport', city: 'Lamerd', country: 'Iran' },
  { id: 'ir-12', code: 'JAR', name: 'Jahrom Airport', city: 'Jahrom', country: 'Iran' },
  { id: 'ir-13', code: 'FAZ', name: 'Fasa Airport', city: 'Fasa', country: 'Iran' },
  { id: 'ir-14', code: 'DAR', name: 'Darab Airport', city: 'Darab', country: 'Iran' },
  { id: 'ir-15', code: 'ZBR2', name: 'Zarrindasht Airport', city: 'Zarrindasht', country: 'Iran' },

  // Isfahan Province
  { id: 'ir-16', code: 'IFN', name: 'Isfahan Shahid Beheshti International Airport', city: 'Isfahan', country: 'Iran' },
  { id: 'ir-17', code: 'KKS', name: 'Kashan Airport', city: 'Kashan', country: 'Iran' },

  // Khuzestan Province
  { id: 'ir-18', code: 'AWZ', name: 'Ahvaz Shahid Soleimani International Airport', city: 'Ahvaz', country: 'Iran' },
  { id: 'ir-19', code: 'ABD', name: 'Abadan Ayatollah Jami International Airport', city: 'Abadan', country: 'Iran' },
  { id: 'ir-20', code: 'DEF', name: 'Dezful Airport', city: 'Dezful', country: 'Iran' },
  { id: 'ir-21', code: 'MRX', name: 'Mahshahr Airport', city: 'Mahshahr', country: 'Iran' },
  { id: 'ir-22', code: 'AKW', name: 'Aghajari Airport', city: 'Aghajari', country: 'Iran' },
  { id: 'ir-23', code: 'MIS', name: 'Masjed Soleyman Airport', city: 'Masjed Soleyman', country: 'Iran' },
  { id: 'ir-24', code: 'OMI', name: 'Omidiyeh Airport', city: 'Omidiyeh', country: 'Iran' },

  // Hormozgan Province & Persian Gulf Islands
  { id: 'ir-25', code: 'BND', name: 'Bandar Abbas International Airport', city: 'Bandar Abbas', country: 'Iran' },
  { id: 'ir-26', code: 'KIH', name: 'Kish Island International Airport', city: 'Kish Island', country: 'Iran' },
  { id: 'ir-27', code: 'GSM', name: 'Qeshm Island Dayrestan International Airport', city: 'Qeshm Island', country: 'Iran' },
  { id: 'ir-28', code: 'BDH', name: 'Bandar Lengeh Airport', city: 'Bandar Lengeh', country: 'Iran' },
  { id: 'ir-29', code: 'JSK', name: 'Jask Airport', city: 'Jask', country: 'Iran' },
  { id: 'ir-30', code: 'AEU', name: 'Abumusa Island Airport', city: 'Abumusa', country: 'Iran' },
  { id: 'ir-31', code: 'LVP', name: 'Lavan Island Airport', city: 'Lavan Island', country: 'Iran' },
  { id: 'ir-32', code: 'SXI', name: 'Sirri Island Airport', city: 'Sirri Island', country: 'Iran' },
  { id: 'ir-33', code: 'TNB', name: 'Tonb-e Bozorg Airport', city: 'Greater Tunb', country: 'Iran' },
  { id: 'ir-34', code: 'BJA', name: 'Bandar Jask Airport', city: 'Jask', country: 'Iran' },

  // Bushehr Province
  { id: 'ir-35', code: 'BUZ', name: 'Bushehr Airport', city: 'Bushehr', country: 'Iran' },
  { id: 'ir-36', code: 'PGU', name: 'Persian Gulf International Airport (Asaluyeh)', city: 'Asaluyeh', country: 'Iran' },
  { id: 'ir-37', code: 'KHK', name: 'Khark Island Airport', city: 'Khark Island', country: 'Iran' },
  { id: 'ir-38', code: 'KNR', name: 'Tohid Jam Airport', city: 'Jam', country: 'Iran' },
  { id: 'ir-39', code: 'IAQ', name: 'Bahregan Airport', city: 'Bahregan', country: 'Iran' },

  // East & West Azerbaijan, Ardabil
  { id: 'ir-40', code: 'TBZ', name: 'Tabriz Shahid Madani International Airport', city: 'Tabriz', country: 'Iran' },
  { id: 'ir-41', code: 'ACP', name: 'Sahand Airport (Maragheh)', city: 'Maragheh', country: 'Iran' },
  { id: 'ir-42', code: 'OMH', name: 'Urmia Shahid Bakeri International Airport', city: 'Urmia', country: 'Iran' },
  { id: 'ir-43', code: 'KHY', name: 'Khoy Airport', city: 'Khoy', country: 'Iran' },
  { id: 'ir-44', code: 'IMQ', name: 'Maku International Airport', city: 'Maku', country: 'Iran' },
  { id: 'ir-45', code: 'ADU', name: 'Ardabil International Airport', city: 'Ardabil', country: 'Iran' },
  { id: 'ir-46', code: 'PFQ', name: 'Parsabad Moghan Airport', city: 'Parsabad', country: 'Iran' },

  // Northern Provinces (Mazandaran, Gilan, Golestan)
  { id: 'ir-47', code: 'RAS', name: 'Rasht Sardar Jangal Airport', city: 'Rasht', country: 'Iran' },
  { id: 'ir-48', code: 'SRY', name: 'Sari Dasht-e Naz International Airport', city: 'Sari', country: 'Iran' },
  { id: 'ir-49', code: 'RZR', name: 'Ramsar International Airport', city: 'Ramsar', country: 'Iran' },
  { id: 'ir-50', code: 'NSH', name: 'Noshahr Airport', city: 'Noshahr', country: 'Iran' },
  { id: 'ir-51', code: 'GBT', name: 'Gorgan International Airport', city: 'Gorgan', country: 'Iran' },
  { id: 'ir-52', code: 'KLM', name: 'Kalaleh Airport', city: 'Kalaleh', country: 'Iran' },

  // Kerman Province
  { id: 'ir-53', code: 'KER', name: 'Kerman Ayatollah Hashemi Rafsanjani International Airport', city: 'Kerman', country: 'Iran' },
  { id: 'ir-54', code: 'RJN', name: 'Rafsanjan Airport', city: 'Rafsanjan', country: 'Iran' },
  { id: 'ir-55', code: 'SYJ', name: 'Sirjan Airport', city: 'Sirjan', country: 'Iran' },
  { id: 'ir-56', code: 'BXR', name: 'Bam Airport', city: 'Bam', country: 'Iran' },
  { id: 'ir-57', code: 'JYR', name: 'Jiroft Airport', city: 'Jiroft', country: 'Iran' },

  // Sistan & Baluchestan Province
  { id: 'ir-58', code: 'ZAH', name: 'Zahedan International Airport', city: 'Zahedan', country: 'Iran' },
  { id: 'ir-59', code: 'ZBR', name: 'Chabahar Konarak International Airport', city: 'Chabahar', country: 'Iran' },
  { id: 'ir-60', code: 'ACZ', name: 'Zabol Airport', city: 'Zabol', country: 'Iran' },
  { id: 'ir-61', code: 'IHR', name: 'Iranshahr Airport', city: 'Iranshahr', country: 'Iran' },
  { id: 'ir-62', code: 'SXV', name: 'Saravan Airport', city: 'Saravan', country: 'Iran' },

  // Yazd, Kermanshah, Kurdistan, Lorestan, Ilam, Hamadan
  { id: 'ir-63', code: 'AZD', name: 'Yazd Shahid Sadooghi International Airport', city: 'Yazd', country: 'Iran' },
  { id: 'ir-64', code: 'KSH', name: 'Kermanshah Shahid Ashrafi Esfahani Airport', city: 'Kermanshah', country: 'Iran' },
  { id: 'ir-65', code: 'SDG', name: 'Sanandaj Airport', city: 'Sanandaj', country: 'Iran' },
  { id: 'ir-66', code: 'TQZ', name: 'Saqqez Airport', city: 'Saqqez', country: 'Iran' },
  { id: 'ir-67', code: 'KHD', name: 'Khorramabad Airport', city: 'Khorramabad', country: 'Iran' },
  { id: 'ir-68', code: 'IIL', name: 'Ilam Shohada Airport', city: 'Ilam', country: 'Iran' },
  { id: 'ir-69', code: 'HDM', name: 'Hamadan Airport', city: 'Hamadan', country: 'Iran' },

  // Central & Eastern (Semnan, Zanjan, Markazi, Chaharmahal, Kohgiluyeh, North/South Khorasan)
  { id: 'ir-70', code: 'JWN', name: 'Zanjan Airport', city: 'Zanjan', country: 'Iran' },
  { id: 'ir-71', code: 'AJK', name: 'Arak Airport', city: 'Arak', country: 'Iran' },
  { id: 'ir-72', code: 'SNX', name: 'Semnan Airport', city: 'Semnan', country: 'Iran' },
  { id: 'ir-73', code: 'RUD', name: 'Shahroud Airport', city: 'Shahroud', country: 'Iran' },
  { id: 'ir-74', code: 'CQD', name: 'Shahrekord International Airport', city: 'Shahrekord', country: 'Iran' },
  { id: 'ir-75', code: 'YES', name: 'Yasuj Airport', city: 'Yasuj', country: 'Iran' },
  { id: 'ir-76', code: 'GCH', name: 'Gachsaran Airport', city: 'Gachsaran', country: 'Iran' },
  { id: 'ir-77', code: 'XBJ', name: 'Birjand International Airport', city: 'Birjand', country: 'Iran' },
  { id: 'ir-78', code: 'TCX', name: 'Tabas Airport', city: 'Tabas', country: 'Iran' },
  { id: 'ir-79', code: 'BJB', name: 'Bojnord Airport', city: 'Bojnord', country: 'Iran' },

  // =========================================================================
  // MIDDLE EAST - IRAQ
  // =========================================================================
  { id: 'iq-1', code: 'NJF', name: 'Al Najaf International Airport', city: 'Najaf', country: 'Iraq' },
  { id: 'iq-2', code: 'BGW', name: 'Baghdad International Airport', city: 'Baghdad', country: 'Iraq' },
  { id: 'iq-3', code: 'EBL', name: 'Erbil International Airport', city: 'Erbil', country: 'Iraq' },
  { id: 'iq-4', code: 'ISU', name: 'Sulaimaniyah International Airport', city: 'Sulaimaniyah', country: 'Iraq' },
  { id: 'iq-5', code: 'BSR', name: 'Basra International Airport', city: 'Basra', country: 'Iraq' },
  { id: 'iq-6', code: 'KIK', name: 'Kirkuk International Airport', city: 'Kirkuk', country: 'Iraq' },
  { id: 'iq-7', code: 'XNH', name: 'Nasiriyah International Airport', city: 'Nasiriyah', country: 'Iraq' },

  // =========================================================================
  // MIDDLE EAST - UAE
  // =========================================================================
  { id: 'ae-1', code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates' },
  { id: 'ae-2', code: 'DWC', name: 'Al Maktoum International Airport', city: 'Dubai', country: 'United Arab Emirates' },
  { id: 'ae-3', code: 'AUH', name: 'Zayed International Airport (Abu Dhabi)', city: 'Abu Dhabi', country: 'United Arab Emirates' },
  { id: 'ae-4', code: 'SHJ', name: 'Sharjah International Airport', city: 'Sharjah', country: 'United Arab Emirates' },
  { id: 'ae-5', code: 'RKT', name: 'Ras Al Khaimah International Airport', city: 'Ras Al Khaimah', country: 'United Arab Emirates' },
  { id: 'ae-6', code: 'FJR', name: 'Fujairah International Airport', city: 'Fujairah', country: 'United Arab Emirates' },
  { id: 'ae-7', code: 'AAN', name: 'Al Ain International Airport', city: 'Al Ain', country: 'United Arab Emirates' },

  // =========================================================================
  // MIDDLE EAST - TURKEY
  // =========================================================================
  { id: 'tr-1', code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey' },
  { id: 'tr-2', code: 'SAW', name: 'Istanbul Sabiha Gokcen Airport', city: 'Istanbul', country: 'Turkey' },
  { id: 'tr-3', code: 'AYT', name: 'Antalya Airport', city: 'Antalya', country: 'Turkey' },
  { id: 'tr-4', code: 'ESB', name: 'Ankara Esenboga Airport', city: 'Ankara', country: 'Turkey' },
  { id: 'tr-5', code: 'ADB', name: 'Izmir Adnan Menderes Airport', city: 'Izmir', country: 'Turkey' },
  { id: 'tr-6', code: 'VAN', name: 'Van Ferit Melen Airport', city: 'Van', country: 'Turkey' },
  { id: 'tr-7', code: 'TZX', name: 'Trabzon Airport', city: 'Trabzon', country: 'Turkey' },
  { id: 'tr-8', code: 'BJV', name: 'Milas-Bodrum Airport', city: 'Bodrum', country: 'Turkey' },
  { id: 'tr-9', code: 'DLM', name: 'Dalaman Airport', city: 'Dalaman', country: 'Turkey' },
  { id: 'tr-10', code: 'ADA', name: 'Cukurova International Airport (Adana/Mersin)', city: 'Adana', country: 'Turkey' },
  { id: 'tr-11', code: 'GZT', name: 'Gaziantep Airport', city: 'Gaziantep', country: 'Turkey' },
  { id: 'tr-12', code: 'ASR', name: 'Kayseri Airport', city: 'Kayseri', country: 'Turkey' },
  { id: 'tr-13', code: 'KYA', name: 'Konya Airport', city: 'Konya', country: 'Turkey' },
  { id: 'tr-14', code: 'NAV', name: 'Nevsehir Cappadocia Airport', city: 'Nevsehir', country: 'Turkey' },
  { id: 'tr-15', code: 'DNZ', name: 'Denizli Cardak Airport', city: 'Denizli', country: 'Turkey' },
  { id: 'tr-16', code: 'ERZ', name: 'Erzurum Airport', city: 'Erzurum', country: 'Turkey' },

  // =========================================================================
  // MIDDLE EAST - SAUDI ARABIA
  // =========================================================================
  { id: 'sa-1', code: 'JED', name: 'King Abdulaziz International Airport', city: 'Jeddah', country: 'Saudi Arabia' },
  { id: 'sa-2', code: 'MED', name: 'Prince Mohammad Bin Abdulaziz Airport', city: 'Medina', country: 'Saudi Arabia' },
  { id: 'sa-3', code: 'RUH', name: 'King Khalid International Airport', city: 'Riyadh', country: 'Saudi Arabia' },
  { id: 'sa-4', code: 'DMM', name: 'King Fahd International Airport', city: 'Dammam', country: 'Saudi Arabia' },
  { id: 'sa-5', code: 'TIF', name: 'Taif Regional Airport', city: 'Taif', country: 'Saudi Arabia' },
  { id: 'sa-6', code: 'AHB', name: 'Abha Regional Airport', city: 'Abha', country: 'Saudi Arabia' },
  { id: 'sa-7', code: 'TUU', name: 'Tabuk Regional Airport', city: 'Tabuk', country: 'Saudi Arabia' },
  { id: 'sa-8', code: 'ELQ', name: 'Prince Naif Bin Abdulaziz Airport (Gassim)', city: 'Buraidah', country: 'Saudi Arabia' },
  { id: 'sa-9', code: 'YNB', name: 'Yanbu Prince Abdul Mohsin Airport', city: 'Yanbu', country: 'Saudi Arabia' },
  { id: 'sa-10', code: 'ULH', name: 'Al Ula International Airport', city: 'Al Ula', country: 'Saudi Arabia' },
  { id: 'sa-11', code: 'HAS', name: 'Hail Airport', city: 'Hail', country: 'Saudi Arabia' },
  { id: 'sa-12', code: 'GIZ', name: 'Jizan Regional Airport', city: 'Jizan', country: 'Saudi Arabia' },
  { id: 'sa-13', code: 'EAM', name: 'Najran Airport', city: 'Najran', country: 'Saudi Arabia' },

  // =========================================================================
  // MIDDLE EAST - QATAR, KUWAIT, BAHRAIN, OMAN
  // =========================================================================
  { id: 'qa-1', code: 'DOH', name: 'Hamad International Airport', city: 'Doha', country: 'Qatar' },
  { id: 'kw-1', code: 'KWI', name: 'Kuwait International Airport', city: 'Kuwait City', country: 'Kuwait' },
  { id: 'bh-1', code: 'BAH', name: 'Bahrain International Airport', city: 'Manama', country: 'Bahrain' },
  { id: 'om-1', code: 'MCT', name: 'Muscat International Airport', city: 'Muscat', country: 'Oman' },
  { id: 'om-2', code: 'SLL', name: 'Salalah International Airport', city: 'Salalah', country: 'Oman' },
  { id: 'om-3', code: 'OHS', name: 'Sohar Airport', city: 'Sohar', country: 'Oman' },
  { id: 'om-4', code: 'KHS', name: 'Khasab Airport', city: 'Khasab', country: 'Oman' },
  { id: 'om-5', code: 'DQM', name: 'Duqm International Airport', city: 'Duqm', country: 'Oman' },

  // =========================================================================
  // MIDDLE EAST - LEVANT & CAUCASUS
  // =========================================================================
  { id: 'lb-1', code: 'BEY', name: 'Beirut-Rafic Hariri International Airport', city: 'Beirut', country: 'Lebanon' },
  { id: 'jo-1', code: 'AMM', name: 'Queen Alia International Airport', city: 'Amman', country: 'Jordan' },
  { id: 'jo-2', code: 'AQJ', name: 'King Hussein International Airport', city: 'Aqaba', country: 'Jordan' },
  { id: 'sy-1', code: 'DAM', name: 'Damascus International Airport', city: 'Damascus', country: 'Syria' },
  { id: 'sy-2', code: 'ALP', name: 'Aleppo International Airport', city: 'Aleppo', country: 'Syria' },
  { id: 'sy-3', code: 'LTK', name: 'Bassel Al-Assad International Airport (Latakia)', city: 'Latakia', country: 'Syria' },
  { id: 'am-1', code: 'EVN', name: 'Zvartnots International Airport', city: 'Yerevan', country: 'Armenia' },
  { id: 'am-2', code: 'LWN', name: 'Shirak Airport', city: 'Gyumri', country: 'Armenia' },
  { id: 'ge-1', code: 'TBS', name: 'Tbilisi International Airport', city: 'Tbilisi', country: 'Georgia' },
  { id: 'ge-2', code: 'BUS', name: 'Batumi International Airport', city: 'Batumi', country: 'Georgia' },
  { id: 'ge-3', code: 'KUT', name: 'David the Builder Kutaisi Airport', city: 'Kutaisi', country: 'Georgia' },
  { id: 'az-1', code: 'GYD', name: 'Heydar Aliyev International Airport', city: 'Baku', country: 'Azerbaijan' },
  { id: 'az-2', code: 'GNJ', name: 'Ganja International Airport', city: 'Ganja', country: 'Azerbaijan' },
  { id: 'az-3', code: 'NAJ', name: 'Nakhchivan International Airport', city: 'Nakhchivan', country: 'Azerbaijan' }
];
