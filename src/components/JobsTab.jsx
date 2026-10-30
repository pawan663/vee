import React, { useState, useMemo } from 'react';
import { Search, Filter, Sparkles, Building, Briefcase, ExternalLink, Newspaper, Radio, Flame, ChevronRight, LayoutGrid, RefreshCw, Trophy, Ticket } from 'lucide-react';
import JobCard from './JobCard';
import { TOP_INDIAN_COMPANIES } from '../data/indianCompanies';
import { isJobExpired } from '../utils/dateExpiry';

// Strict State Match & Exclude Rules to eliminate cross-state bleeding (e.g. Delhi Police appearing in UP)
const STATE_RULES = {
  'Rajasthan': {
    include: /rajasthan|rvunl|rsmssb|rpsc|jaipur|jodhpur|udaipur|bikaner|ajmer|kota|nwr jaipur/i,
    exclude: /delhi police|bihar police|up police|upsssc|hssc|haryana police|mumbai pharmacist/i
  },
  'Uttar Pradesh': {
    include: /uttar pradesh|upsssc|uppsc|uppcl|upprpb|up police|upmrc|lucknow|prayagraj|allahabad|kanpur|varanasi|noida|ghaziabad|agra|gorakhpur|meerut|ssc-cr|\bup\b/i,
    exclude: /delhi police|bihar police|rajasthan|rvunl|hssc|haryana police|mumbai pharmacist/i
  },
  'Delhi': {
    include: /delhi|dsssb|dmrc|delhi police|\bncr\b/i,
    exclude: /rajasthan bijli|rvunl|bihar police|up police|upsssc|uppcl/i
  },
  'Bihar': {
    include: /bihar|bpsc|bpssc|bssc|patna|muzaffarpur|gaya|bhagalpur/i,
    exclude: /delhi police|up police|upsssc|rajasthan/i
  },
  'Madhya Pradesh': {
    include: /madhya pradesh|mppsc|mpeb|peb|esb|bhopal|indore|vyapam|\bmp\b/i,
    exclude: /delhi police|up police|upsssc|rajasthan/i
  },
  'Maharashtra': {
    include: /maharashtra|mpsc|mumbai|pune|nagpur|nashik/i,
    exclude: /delhi police|up police|rajasthan/i
  },
  'Haryana': {
    include: /haryana|hssc|hpsc|chandigarh|gurugram|faridabad|panchkula/i,
    exclude: /delhi police|up police|rajasthan/i
  },
  'Punjab': {
    include: /punjab|ppsc|psssb|pspcl|ludhiana|amritsar/i,
    exclude: /delhi police|up police/i
  },
  'Gujarat': {
    include: /gujarat|gpsc|gsssb|ahmedabad|gacl|gsecl|surat|vadodara/i,
    exclude: /delhi police|up police/i
  },
  'Jharkhand': {
    include: /jharkhand|jpsc|jssc|ranchi|dhanbad|jamshedpur/i,
    exclude: /delhi police|up police/i
  },
  'West Bengal': {
    include: /west bengal|wbpsc|wbpolice|kolkata/i,
    exclude: /delhi police|up police/i
  },
  'Uttarakhand': {
    include: /uttarakhand|ukpsc|uksssc|dehradun|haridwar/i,
    exclude: /delhi police|up police/i
  },
  'Himachal Pradesh': {
    include: /himachal|hppsc|hpsssb|shimla|dharamshala/i,
    exclude: /delhi police|up police/i
  },
  'Chhattisgarh': {
    include: /chhattisgarh|cgpsc|cgvyapam|raipur|bilaspur/i,
    exclude: /delhi police|up police/i
  },
  'Odisha': {
    include: /odisha|opsc|osssc|bhubaneswar|cuttack/i,
    exclude: /delhi police|up police/i
  },
  'Assam': {
    include: /assam|apsc|guwahati|assam rifles/i,
    exclude: /delhi police|up police/i
  },
  'Andhra Pradesh': {
    include: /andhra|appsc|amaravati|visakhapatnam|vijayawada/i,
    exclude: /delhi police/i
  },
  'Telangana': {
    include: /telangana|tspsc|hyderabad/i,
    exclude: /delhi police/i
  },
  'Karnataka': {
    include: /karnataka|kpsc|kea|bengaluru|bangalore/i,
    exclude: /delhi police/i
  },
  'Tamil Nadu': {
    include: /tamil nadu|tnpsc|chennai|coimbatore/i,
    exclude: /delhi police/i
  },
  'Kerala': {
    include: /kerala|kpsc|thiruvananthapuram|kochi/i,
    exclude: /delhi police/i
  },
  'Jammu & Kashmir': {
    include: /jammu|kashmir|jkpsc|jkssb|srinagar/i,
    exclude: /delhi police/i
  }
};

// Hindi-to-English Synonyms & Keywords Dictionary for Multi-Lingual Search
const HINDI_SYNONYMS = {
  'रेलवे': ['railway', 'rrb', 'rrc', 'alp', 'ntpc', 'rail', 'technician'],
  'रेल': ['railway', 'rrb', 'rrc', 'alp', 'rail'],
  'पुलिस': ['police', 'constable', 'si', 'daroga', 'sub inspector'],
  'दरोगा': ['si', 'sub inspector', 'police'],
  'सिपाही': ['constable', 'police', 'sepoy'],
  'बैंक': ['bank', 'ibps', 'sbi', 'rbi', 'pnb', 'bob', 'clerk', 'po'],
  'बैंकिंग': ['bank', 'ibps', 'sbi', 'banking'],
  'शिक्षक': ['teacher', 'teaching', 'prt', 'tgt', 'pgt', 'tet', 'ctet', 'bed', 'faculty'],
  'टीचर': ['teacher', 'teaching', 'prt', 'tgt', 'pgt'],
  'अप्रेंटिस': ['apprentice', 'apprenticeship', 'training', 'iti apprentice'],
  'पटवारी': ['patwari', 'lekhpal', 'revenue', 'kanungo'],
  'लेखपाल': ['lekhpal', 'patwari', 'revenue'],
  'सेना': ['army', 'navy', 'air force', 'defence', 'military', 'agniveer'],
  'आर्मी': ['army', 'military', 'agniveer', 'soldier'],
  'डिफेंस': ['defence', 'defense', 'army', 'navy', 'military'],
  'डाक': ['post office', 'dak', 'gds', 'postal', 'india post'],
  'डाकघर': ['post office', 'postal', 'gds', 'dak'],
  'जीडीएस': ['gds', 'gramin dak sevak', 'post office'],
  'बिजली': ['electricity', 'power', 'uppcl', 'rvunl', 'discom', 'energy'],
  'स्वास्थ्य': ['health', 'aiims', 'medical', 'nurse', 'hospital'],
  'नर्स': ['nurse', 'nursing', 'gnm', 'anm'],
  'डॉक्टर': ['doctor', 'mbbs', 'medical', 'physician'],
  'क्लर्क': ['clerk', 'assistant', 'ldc', 'udc'],
  'चपरासी': ['peon', 'attendant', 'group d', 'helper', 'sevadar'],
  'असिस्टेंट': ['assistant', 'clerk'],
  'इंजीनियर': ['engineer', 'b.tech', 'polytechnic', 'diploma', 'je', 'ae'],
  'डिप्लोमा': ['diploma', 'polytechnic']
};

function formatSyncTime(date, lang) {
  if (!date) return lang === 'en' ? 'Just Now' : 'अभी-अभी';
  const d = new Date(date);
  if (isNaN(d.getTime())) return lang === 'en' ? 'Just Now' : 'अभी-अभी';
  const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  return `${dateStr}, ${timeStr}`;
}

export default function JobsTab({
  jobs,
  liveNews,
  onOpenDetail,
  onOpenApply,
  onOpenNews,
  savedJobIds,
  onToggleSave,
  onOpenTools,
  lastSyncedTime,
  isSyncing,
  onManualSync,
  currentLang = 'hi',
  t
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL'); // 'ALL' | 'Govt' | 'Private' | 'NEWS' | 'RESULTS' | 'ADMIT'
  const [filterQual, setFilterQual] = useState('ALL'); // Qualification dropdown
  const [filterDept, setFilterDept] = useState('ALL'); // Department dropdown
  const [filterState, setFilterState] = useState('ALL'); // State / UT dropdown
  const [newsSourceFilter, setNewsSourceFilter] = useState('ALL');
  const [isMatcherOpen, setIsMatcherOpen] = useState(false);
  const [matchQual, setMatchQual] = useState('ITI');
  const [matchAge, setMatchAge] = useState(22);

  // Session Open Counter (Increments on every fresh session open so feed is always dynamic!)
  const [sessionCount] = useState(() => {
    try {
      const stored = parseInt(sessionStorage.getItem('vee_session_open_count') || '0', 10);
      const next = stored + 1;
      sessionStorage.setItem('vee_session_open_count', next.toString());
      return next;
    } catch (e) {
      return 1;
    }
  });

  // Dynamic hour seed for hourly spotlight rotation (0-23 hours)
  const currentHour = new Date().getHours();

  // Auto-Expiry check: Filter out any job where lastDate < today
  const todayStr = new Date().toISOString().split('T')[0];

  // Localized Dropdown Option Dictionaries for 5 Languages
  const qualLabels = {
    en: {
      ALL: '🎓 Qualification',
      '8th': '🎓 8th Pass',
      '10th': '🎓 10th Pass (Matric)',
      '12th': '📘 12th Pass (10+2)',
      ITI: '⚡ ITI Pass (NCVT / SCVT)',
      Diploma: '🛠️ Polytechnic Diploma',
      'B.Tech': '💻 B.Tech / B.E (Engineering)',
      Graduate: '🏛️ Graduate (BA / B.Sc / B.Com)',
      'BBA/BCA': '📊 BBA / BCA',
      'Post Graduate': '🎓 Post Graduate (MA / M.Sc)',
      MBA: '💼 MBA / PGDM',
      'MBBS/Medical': '🩺 MBBS / Medical Officer',
      Nursing: '💉 Nursing / Pharmacy (GNM/D.Pharm)',
      Teaching: '📚 B.Ed / Teaching (TET / CTET)',
      Law: '⚖️ Law (LLB / LLM)'
    },
    hi: {
      ALL: '🎓 योग्यता',
      '8th': '🎓 8वीं पास',
      '10th': '🎓 10वीं पास (मैट्रिक)',
      '12th': '📘 12वीं पास (इंटरमीडिएट)',
      ITI: '⚡ आईटीआई पास (NCVT / SCVT)',
      Diploma: '🛠️ पॉलिटेक्निक डिप्लोमा',
      'B.Tech': '💻 बी.टेक / बी.ई (इंजीनियरिंग)',
      Graduate: '🏛️ स्नातक (BA / B.Sc / B.Com)',
      'BBA/BCA': '📊 बीबीए / बीसीए',
      'Post Graduate': '🎓 स्नातकोत्तर (MA / M.Sc / M.Com)',
      MBA: '💼 एमबीए / पीजीडीएम',
      'MBBS/Medical': '🩺 एमबीबीएस / मेडिकल ऑफिसर',
      Nursing: '💉 नर्सिंग / फार्मेसी (GNM / D.Pharm)',
      Teaching: '📚 बी.एड / शिक्षण (TET / CTET)',
      Law: '⚖️ विधि / कानून (LLB)'
    },
    hinglish: {
      ALL: '🎓 Qualification',
      '8th': '🎓 8th Pass',
      '10th': '🎓 10th Pass',
      '12th': '📘 12th Pass',
      ITI: '⚡ ITI Pass (All Trades)',
      Diploma: '🛠️ Diploma (Polytechnic)',
      'B.Tech': '💻 B.Tech / B.E (Engg)',
      Graduate: '🏛️ Graduate (BA/B.Sc/B.Com)',
      'BBA/BCA': '📊 BBA / BCA',
      'Post Graduate': '🎓 Post Graduate (PG)',
      MBA: '💼 MBA / PGDM',
      'MBBS/Medical': '🩺 MBBS / Medical',
      Nursing: '💉 Nursing / Pharma',
      Teaching: '📚 B.Ed / Teaching',
      Law: '⚖️ Law (LLB)'
    },
    mr: {
      ALL: '🎓 सर्व पात्रता',
      '8th': '🎓 ८ वी उत्तीर्ण',
      '10th': '🎓 १० वी उत्तीर्ण (मॅट्रिक)',
      '12th': '📘 १२ वी उत्तीर्ण (HSC)',
      ITI: '⚡ आयटीआय उत्तीर्ण (ITI Pass)',
      Diploma: '🛠️ पॉलिटेक्निक डिप्लोमा',
      'B.Tech': '💻 बी.टेक / बी.ई',
      Graduate: '🏛️ पदवीधर (Graduation)',
      'BBA/BCA': '📊 बीबीए / बीसीए',
      'Post Graduate': '🎓 पदव्युत्तर (Post Graduate)',
      MBA: '💼 एमबीए',
      'MBBS/Medical': '🩺 एमबीबीएस / वैद्यकीय',
      Nursing: '💉 नर्सिंग / फार्मसी',
      Teaching: '📚 डी.टी.एड / बी.एड / शिक्षक',
      Law: '⚖️ विधी / कायदा (LLB)'
    },
    bn: {
      ALL: '🎓 সব যোগ্যতা',
      '8th': '🎓 ৮ম শ্রেণী পাস',
      '10th': '🎓 মাধ্যমিক পাস (১০ম)',
      '12th': '📘 উচ্চমাধ্যমিক পাস (১২তম)',
      ITI: '⚡ আইটিআই পাস (ITI Pass)',
      Diploma: '🛠️ পলিটেকনিক ডিপ্লোমা',
      'B.Tech': '💻 বি.টেক / বি.ই',
      Graduate: '🏛️ স্নাতক (Graduate)',
      'BBA/BCA': '📊 বিবিএ / বিসিএ',
      'Post Graduate': '🎓 স্নাতকোত্তর (PG)',
      MBA: '💼 এমবিএ',
      'MBBS/Medical': '🩺 এমবিবিএস / মেডিকেল',
      Nursing: '💉 নার্সিং / ফার্মাসি',
      Teaching: '📚 বি.এড / শিক্ষকতা',
      Law: '⚖️ আইন (LLB)'
    }
  };

  const deptLabels = {
    en: {
      ALL: '🏛️ Department',
      SSC: '📝 SSC (CGL / CHSL / MTS / GD)',
      RAILWAY: '🚆 Railway (RRB / ALP / Group D)',
      BANK: '🏦 Banking (IBPS / SBI / RBI)',
      POLICE: '👮 Police (SI / Constable)',
      ARMY: '🪖 Defence & Army (Armed Forces)',
      PARAMILITARY: '🛡️ Paramilitary (Assam Rifles / CRPF / BSF)',
      METRO: '🚇 Metro Rail (DMRC / NMRC)',
      BHEL: '⚡ BHEL',
      SAIL: '🏗️ SAIL',
      ONGC: '🛢️ ONGC',
      NTPC: '💡 NTPC',
      IOCL: '⛽ IOCL / GAIL / Petroleum',
      DRDO: '🔬 DRDO (Defence Research)',
      ISRO: '🚀 ISRO (Space Research)',
      BRO: '🛣️ BRO (Border Roads)',
      NMDC: '⛏️ NMDC / Coal India',
      OFB: '⚙️ OFB (Ordnance Factory)',
      FCI: '🌾 FCI (Food Corporation)',
      INCOME_TAX: '💰 Income Tax & Customs',
      GROUP_D: '📋 Group D / Peon / Attendant',
      DSSSB: '🏢 DSSSB (Delhi Subordinate)',
      UPSC: '🏛️ UPSC & State PSC',
      TEACHING: '👨‍🏫 Teaching & Education',
      HEALTH: '🏥 Health & Medical',
      PRIVATE: '💼 Private MNC & Apprentice'
    },
    hi: {
      ALL: '🏛️ विभाग',
      SSC: '📝 एसएससी (CGL / CHSL / MTS / GD)',
      RAILWAY: '🚆 रेलवे (RRB / ALP / ग्रुप डी / NTPC)',
      BANK: '🏦 बैंकिंग (IBPS / SBI / RBI)',
      POLICE: '👮 पुलिस (दरोगा / कॉन्स्टेबल)',
      ARMY: '🪖 सेना और रक्षा (आर्मी / नेवी / एयरफोर्स)',
      PARAMILITARY: '🛡️ अर्धसैनिक (असम राइफल्स / CRPF / BSF)',
      METRO: '🚇 मेट्रो रेल (DMRC / NMRC)',
      BHEL: '⚡ बीएचईएल (BHEL)',
      SAIL: '🏗️ सेल (SAIL)',
      ONGC: '🛢️ ओएनजीसी (ONGC)',
      NTPC: '💡 एनटीपीसी (NTPC)',
      IOCL: '⛽ आईओसीएल / गेल / पेट्रोलियम',
      DRDO: '🔬 डीआरडीओ (DRDO)',
      ISRO: '🚀 इसरो (ISRO)',
      BRO: '🛣️ बीआरओ (Border Roads)',
      NMDC: '⛏️ एनएमडीसी / कोल इंडिया',
      OFB: '⚙️ ओएफबी (ऑर्डनेंस फैक्ट्री)',
      FCI: '🌾 एफसीआई (भारतीय खाद्य निगम)',
      INCOME_TAX: '💰 आयकर व कस्टम विभाग',
      GROUP_D: '📋 ग्रुप डी / चपरासी / सहायक',
      DSSSB: '🏢 डीएसएसएसबी (दिल्ली)',
      UPSC: '🏛️ यूपीएससी और राज्य पीएससी',
      TEACHING: '👨‍🏫 शिक्षक भर्ती (TET / CTET)',
      HEALTH: '🏥 स्वास्थ्य व चिकित्सा (AIIMS)',
      PRIVATE: '💼 प्राइवेट एमएनसी और अप्रेंटिस'
    },
    hinglish: {
      ALL: '🏛️ Department',
      SSC: '📝 SSC (CGL / CHSL / GD / MTS)',
      RAILWAY: '🚆 Railway (RRB / ALP / Group D)',
      BANK: '🏦 Banking (IBPS / SBI / RBI)',
      POLICE: '👮 Police (SI / Constable)',
      ARMY: '🪖 Army & Defence (All Forces)',
      PARAMILITARY: '🛡️ Assam Rifles / CRPF / BSF',
      METRO: '🚇 Metro Rail (DMRC / NMRC)',
      BHEL: '⚡ BHEL',
      SAIL: '🏗️ SAIL',
      ONGC: '🛢️ ONGC',
      NTPC: '💡 NTPC',
      IOCL: '⛽ IOCL / GAIL',
      DRDO: '🔬 DRDO',
      ISRO: '🚀 ISRO',
      BRO: '🛣️ BRO (Border Roads)',
      NMDC: '⛏️ NMDC / Coal India',
      OFB: '⚙️ OFB (Ordnance)',
      FCI: '🌾 FCI (Food Corp)',
      INCOME_TAX: '💰 Income Tax & Customs',
      GROUP_D: '📋 Group D / Peon',
      DSSSB: '🏢 DSSSB (Delhi)',
      UPSC: '🏛️ UPSC & State PSC',
      TEACHING: '👨‍🏫 Teaching (TET / CTET)',
      HEALTH: '🏥 Health & Hospital',
      PRIVATE: '💼 Private MNC'
    }
  };

  const stateLabels = {
    en: {
      ALL: '📍 State',
      'All India': '🇮🇳 Central Govt (All India)',
      Rajasthan: '🏜️ Rajasthan',
      'Uttar Pradesh': '🏛️ Uttar Pradesh',
      Bihar: '🌾 Bihar',
      'Madhya Pradesh': '🌳 Madhya Pradesh',
      Delhi: '🏙️ Delhi (NCR)',
      Maharashtra: '🌊 Maharashtra',
      Haryana: '🚜 Haryana',
      Punjab: '🌾 Punjab',
      Gujarat: '🏭 Gujarat',
      Jharkhand: '⛏️ Jharkhand',
      'West Bengal': '🌉 West Bengal',
      Uttarakhand: '🏔️ Uttarakhand',
      'Himachal Pradesh': '❄️ Himachal Pradesh',
      Chhattisgarh: '🌿 Chhattisgarh',
      Odisha: '🌊 Odisha',
      Assam: '🍃 Assam & North East',
      'Andhra Pradesh': '🏛️ Andhra Pradesh',
      Telangana: '🏙️ Telangana',
      Karnataka: '🌆 Karnataka',
      'Tamil Nadu': '🌴 Tamil Nadu',
      Kerala: '🥥 Kerala',
      'Jammu & Kashmir': '🏔️ Jammu & Kashmir'
    },
    hi: {
      ALL: '📍 राज्य',
      'All India': '🇮🇳 केंद्र सरकार (ऑल इंडिया)',
      Rajasthan: '🏜️ राजस्थान',
      'Uttar Pradesh': '🏛️ उत्तर प्रदेश',
      Bihar: '🌾 बिहार',
      'Madhya Pradesh': '🌳 मध्य प्रदेश',
      Delhi: '🏙️ दिल्ली (एनसीआर)',
      Maharashtra: '🌊 महाराष्ट्र',
      Haryana: '🚜 हरियाणा',
      Punjab: '🌾 पंजाब',
      Gujarat: '🏭 गुजरात',
      Jharkhand: '⛏️ झारखंड',
      'West Bengal': '🌉 पश्चिम बंगाल',
      Uttarakhand: '🏔️ उत्तराखंड',
      'Himachal Pradesh': '❄️ हिमाचल प्रदेश',
      Chhattisgarh: '🌿 छत्तीसगढ़',
      Odisha: '🌊 ओडिशा',
      Assam: '🍃 असम और पूर्वोत्तर',
      'Andhra Pradesh': '🏛️ आंध्र प्रदेश',
      Telangana: '🏙️ तेलंगाना',
      Karnataka: '🌆 कर्नाटक',
      'Tamil Nadu': '🌴 तमिलनाडु',
      Kerala: '🥥 केरल',
      'Jammu & Kashmir': '🏔️ जम्मू और कश्मीर'
    },
    hinglish: {
      ALL: '📍 Sabhi Rajya / All India',
      'All India': '🇮🇳 Central Govt (All India)',
      Rajasthan: '🏜️ Rajasthan',
      'Uttar Pradesh': '🏛️ Uttar Pradesh',
      Bihar: '🌾 Bihar',
      'Madhya Pradesh': '🌳 Madhya Pradesh',
      Delhi: '🏙️ Delhi (NCR)',
      Maharashtra: '🌊 Maharashtra',
      Haryana: '🚜 Haryana',
      Punjab: '🌾 Punjab',
      Gujarat: '🏭 Gujarat',
      Jharkhand: '⛏️ Jharkhand',
      'West Bengal': '🌉 West Bengal',
      Uttarakhand: '🏔️ Uttarakhand',
      'Himachal Pradesh': '❄️ Himachal Pradesh',
      Chhattisgarh: '🌿 Chhattisgarh',
      Odisha: '🌊 Odisha',
      Assam: '🍃 Assam & North East',
      'Andhra Pradesh': '🏛️ Andhra Pradesh',
      Telangana: '🏙️ Telangana',
      Karnataka: '🌆 Karnataka',
      'Tamil Nadu': '🌴 Tamil Nadu',
      Kerala: '🥥 Kerala',
      'Jammu & Kashmir': '🏔️ Jammu & Kashmir'
    }
  };

  const activeQualMap = qualLabels[currentLang] || qualLabels.hi || qualLabels.en;
  const activeDeptMap = deptLabels[currentLang] || deptLabels.hi || deptLabels.en;
  const activeStateMap = stateLabels[currentLang] || stateLabels.hi || stateLabels.en;

  // Real-time Apprentice Vacancies Count
  const apprenticeCount = useMemo(() => {
    return (jobs || []).filter((j) => {
      if (isJobExpired(j.lastDate, todayStr)) return false;
      const combined = `${j.title || ''} ${j.dept || ''} ${j.type || ''} ${j.qualification || ''}`.toLowerCase();
      return /apprentice|अप्रेंटिस/i.test(combined);
    }).length;
  }, [jobs, todayStr]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
    // Expiry check - strictly purge any job whose last date has passed
    if (isJobExpired(job.lastDate, todayStr)) return false;

    // Multi-token Smart Search (matches keywords in any order across all fields with Hindi synonyms)
    if (searchTerm.trim()) {
      const tokens = searchTerm.toLowerCase().trim().split(/\s+/);
      const combinedText = `${job.title || ''} ${job.dept || ''} ${job.qualification || ''} ${job.state || ''} ${job.category || ''} ${job.posts || ''} ${job.type || ''}`.toLowerCase();
      const matchSearch = tokens.every((token) => {
        if (combinedText.includes(token)) return true;
        const syns = HINDI_SYNONYMS[token];
        if (syns && syns.some((s) => combinedText.includes(s))) return true;
        return false;
      });
      if (!matchSearch) return false;
    }

    // Category (Govt vs Private vs Apprentice)
    if (activeCategory === 'APPRENTICE') {
      const isApp = /apprentice|अप्रेंटिस/i.test(`${job.title || ''} ${job.dept || ''} ${job.type || ''} ${job.qualification || ''}`);
      if (!isApp) return false;
    } else if (activeCategory !== 'ALL' && activeCategory !== 'NEWS' && activeCategory !== 'RESULTS' && activeCategory !== 'ADMIT' && job.category !== activeCategory) {
      return false;
    }

    // 1. Qualification Filter Dropdown (Strict Word Boundaries to avoid false positives)
    if (filterQual !== 'ALL') {
      const qText = `${job.qualification || ''} ${job.title || ''} ${job.type || ''}`.toLowerCase();
      let matchQ = false;
      switch (filterQual) {
        case '8th':
          matchQ = /\b8th\b|8वीं|आठवीं/i.test(qText);
          break;
        case '10th':
          matchQ = /\b10th\b|10वीं|मैट्रिक|matric/i.test(qText) || job.type === '10th';
          break;
        case '12th':
          matchQ = /\b12th\b|12वीं|इण्टर|\binter\b|10\+2/i.test(qText) || job.type === '12th';
          break;
        case 'ITI':
          matchQ = /\biti\b|आईटीआई|ncvt|scvt/i.test(qText) || job.type === 'ITI';
          break;
        case 'Diploma':
          matchQ = /diploma|डिप्लोमा|polytechnic|d\.?pharm/i.test(qText) || job.type === 'Diploma';
          break;
        case 'B.Tech':
          matchQ = /b\.?tech|\bb\.?e\b|engineering|अभियांत्रिकी/i.test(qText) || job.type === 'B.Tech';
          break;
        case 'Graduate':
          matchQ = /graduate|graduation|स्नातक|\bdegree\b|\bba\b|\bb\.a\b|\bb\.?com\b|\bb\.?sc\b/i.test(qText) || job.type === 'Graduate';
          break;
        case 'BBA/BCA':
          matchQ = /\bbba\b|\bbca\b|computer/i.test(qText);
          break;
        case 'Post Graduate':
          matchQ = /post\s*graduate|\bpg\b|स्नातकोत्तर|\bm\.?a\b|\bm\.?sc\b|\bm\.?com\b|master/i.test(qText);
          break;
        case 'MBA':
          matchQ = /\bmba\b|\bpgdm\b|management/i.test(qText);
          break;
        case 'MBBS/Medical':
          matchQ = /\bmbbs\b|medical|doctor|चिकित्सा/i.test(qText);
          break;
        case 'Nursing':
          matchQ = /nursing|\bgnm\b|\banm\b|pharmacist|pharma|d\.?pharm|b\.?pharm/i.test(qText);
          break;
        case 'Teaching':
          matchQ = /\bb\.?ed\b|d\.?el\.?ed|\btet\b|\bctet\b|teacher|शिक्षक|\bprt\b|\btgt\b|\bpgt\b/i.test(qText);
          break;
        case 'Law':
          matchQ = /\bllb\b|\bllm\b|\blaw\b|विधि|advocate/i.test(qText);
          break;
        default:
          matchQ = true;
      }
      if (!matchQ) return false;
    }

    // 2. Department Filter Dropdown (Strict Word Boundaries to avoid false positives like assistant matching police SI)
    if (filterDept !== 'ALL') {
      const dText = `${job.dept || ''} ${job.title || ''}`.toLowerCase();
      let matchD = false;
      switch (filterDept) {
        case 'SSC':
          matchD = /\bssc\b|staff selection|\bcgl\b|\bchsl\b|\bmts\b|havaldar|\bgd\b/i.test(dText);
          break;
        case 'RAILWAY':
          matchD = /railway|\brrb\b|\brrc\b|\balp\b|\bntpc\b|\brail\b|trackman|station master/i.test(dText);
          break;
        case 'BANK':
          matchD = /bank|ibps|\bsbi\b|\brbi\b|\bpnb\b|bob|nabard|clerk|\bpo\b/i.test(dText);
          break;
        case 'POLICE':
          matchD = /police|constable|\bsi\b|daroga|sub[\s-]?inspector|पुलिस|सिपाही|दरोगा/i.test(dText);
          break;
        case 'ARMY':
          matchD = /\barmy\b|\bnavy\b|air\s*force|military|सेना|agniveer/i.test(dText);
          break;
        case 'PARAMILITARY':
          matchD = /paramilitary|assam rifles|crpf|bsf|cisf|itbp|ssb|warrant officer|rifleman/i.test(dText);
          break;
        case 'METRO':
          matchD = /metro|dmrc|delhi metro|nmrc|upmrc|bmrcl/i.test(dText);
          break;
        case 'BHEL':
          matchD = /\bbhel\b|bharat heavy/i.test(dText);
          break;
        case 'SAIL':
          matchD = /\bsail\b|steel authority/i.test(dText);
          break;
        case 'ONGC':
          matchD = /\bongc\b|oil and natural gas/i.test(dText);
          break;
        case 'NTPC':
          matchD = /\bntpc\b|thermal power/i.test(dText);
          break;
        case 'IOCL':
          matchD = /\biocl\b|\bgail\b|\bbpcl\b|\bhpcl\b|petroleum|refinery|oil india/i.test(dText);
          break;
        case 'DRDO':
          matchD = /\bdrdo\b|defence research/i.test(dText);
          break;
        case 'ISRO':
          matchD = /\bisro\b|space research/i.test(dText);
          break;
        case 'BRO':
          matchD = /\bbro\b|border roads/i.test(dText);
          break;
        case 'NMDC':
          matchD = /\bnmdc\b|coal india|\bcil\b|mining/i.test(dText);
          break;
        case 'OFB':
          matchD = /\bofb\b|ordnance factory|yantra/i.test(dText);
          break;
        case 'FCI':
          matchD = /\bfci\b|food corporation/i.test(dText);
          break;
        case 'INCOME_TAX':
          matchD = /income tax|customs|excise|\bgst\b|कर|आयकर/i.test(dText);
          break;
        case 'GROUP_D':
          matchD = /group d|peon|chaprasi|sweeper|attendant|helper|सफाई/i.test(dText);
          break;
        case 'DSSSB':
          matchD = /\bdsssb\b|delhi subordinate/i.test(dText);
          break;
        case 'UPSC':
          matchD = /\bupsc\b|\bpsc\b|civil services|\bnda\b|\bcds\b|\brpsc\b|\buppsc\b|\bbpsc\b|\bmppsc\b/i.test(dText);
          break;
        case 'TEACHING':
          matchD = /\bteacher\b|\bprt\b|\btgt\b|\bpgt\b|\btet\b|\bctet\b|professor|faculty|शिक्षा|शिक्षक/i.test(dText);
          break;
        case 'HEALTH':
          matchD = /health|aiims|hospital|nurse|pharmacist|swasthya|चिकित्सा/i.test(dText);
          break;
        case 'PRIVATE':
          matchD = /private|tata|maruti|l&t|reliance|mrf|suzuki|mnc/i.test(dText) || job.category === 'Private';
          break;
        default:
          matchD = true;
      }
      if (!matchD) return false;
    }

    // 3. State Filter Dropdown
    if (filterState !== 'ALL') {
      const sText = `${job.state || ''} ${job.title || ''} ${job.dept || ''} ${job.location || ''}`.toLowerCase();
      if (filterState === 'All India') {
        if (!/all india|central|pan india|kendra/i.test(job.state || '')) return false;
      } else {
        const rule = STATE_RULES[filterState];
        if (rule) {
          // Strictly reject jobs belonging to other states (e.g. Delhi Police when UP is selected)
          if (rule.exclude && rule.exclude.test(sText)) return false;
          // Must match this specific state's rules or text
          if (!rule.include.test(sText) && !sText.includes(filterState.toLowerCase())) return false;
        } else {
          if (!sText.includes(filterState.toLowerCase())) return false;
        }
      }
    }

    // Smart Matcher Filter
    if (isMatcherOpen) {
      if (job.type !== matchQual && matchQual !== 'ALL') return false;
    }

    return true;
    });
  }, [jobs, todayStr, searchTerm, activeCategory, filterQual, filterDept, filterState, isMatcherOpen, matchQual]);

  // Smart Priority Scoring: Major flagship recruitments (Railway, SSC, Police, Army, Apprentice, PSUs, 100+ posts)
  // appear at the top, while small 1-2 post watchman/gardener jobs appear lower down.
  // Dynamic Hourly Spotlight & Session Shuffle guarantees fresh discoveries every time the app is opened!
  const getJobPriorityScore = (job) => {
    let score = 0;
    const title = (job.title || '').toLowerCase();
    const dept = (job.dept || '').toLowerCase();
    const cat = (job.category || '').toLowerCase();
    const postsText = (job.posts || '').toLowerCase();

    // Flagship major government recruiters base weights
    if (/railway|rrb|rrc|irctc|metro/i.test(dept) || /railway|rrb/i.test(title)) score += 45;
    if (/ssc|staff selection/i.test(dept) || /\bssc\b/i.test(title)) score += 42;
    if (/police|constable|daroga|sub inspector/i.test(title) || /police/i.test(dept)) score += 40;
    if (/army|defence|navy|air force|agniveer/i.test(title) || /defence|army/i.test(dept)) score += 40;
    if (/apprentice/i.test(cat) || /apprentice/i.test(title) || /apprentice/i.test(dept)) score += 38;
    if (/bhel|ongc|iocl|ntpc|sail|isro|drdo|hal|bel|power grid/i.test(dept) || /bhel|ongc|iocl/i.test(title)) score += 35;
    if (/bank|sbi|ibps|rbi/i.test(dept) || /sbi|ibps|po\b/i.test(title)) score += 32;

    // Fresh announcement bonus
    if (job.isNew) score += 35;

    // 6-Category Dynamic Hourly & Session Spotlight Rotation:
    // Changes every hour (0-23) & sessionCount so returning users always discover DIFFERENT jobs at the top!
    const rotationSlot = (currentHour + sessionCount) % 6;
    if (rotationSlot === 0 && (/railway|rrb|rrc|metro/i.test(dept) || /railway|rrb/i.test(title))) {
      score += 50; // Theme 0: Railway & Metro Spotlight
    } else if (rotationSlot === 1 && (job.state && job.state !== 'All India')) {
      score += 50; // Theme 1: State Government Jobs Spotlight (UP, MP, Bihar, Rajasthan, Delhi, etc.)
    } else if (rotationSlot === 2 && (/police|constable|sub inspector/i.test(title) || /army|defence|navy|air force|agniveer|itbp|bsf|cisf/i.test(title))) {
      score += 50; // Theme 2: Defence & Police Spotlight
    } else if (rotationSlot === 3 && (/bank|sbi|ibps|rbi|pnb|uco|canara/i.test(dept) || /bank|clerk|po\b|specialist/i.test(title))) {
      score += 50; // Theme 3: Banking & Financial Institutions Spotlight
    } else if (rotationSlot === 4 && (/ssc|cgl|chsl|mts|gd|upsc|india post|gds/i.test(title) || /ssc|upsc/i.test(dept))) {
      score += 50; // Theme 4: Central Govt & SSC Spotlight
    } else if (rotationSlot === 5 && (/apprentice/i.test(cat) || /apprentice|iti|diploma/i.test(title) || /apprentice/i.test(dept))) {
      score += 50; // Theme 5: Apprentice & Technical Skills Spotlight
    }

    // Dynamic Session Shuffle:
    // Guarantees that when a user opens the app 30-60 mins later, the top cards dynamically shift
    // so older, verified gems in the database get spotlighted and user never sees a static feed!
    const idSeed = (job.id ? String(job.id) : title).split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const sessionOffset = ((idSeed * 17) + (sessionCount * 31) + (currentHour * 19)) % 45;
    score += sessionOffset;

    // Post count bonus
    const postNumMatch = postsText.match(/(\d+[\d,]*)/);
    if (postNumMatch) {
      const num = parseInt(postNumMatch[1].replace(/,/g, ''), 10);
      if (!isNaN(num)) {
        if (num >= 5000) score += 35;
        else if (num >= 1000) score += 30;
        else if (num >= 500) score += 25;
        else if (num >= 100) score += 20;
        else if (num >= 20) score += 10;
        else if (num <= 3) score -= 30; // De-prioritize 1-2 post gardener/watchman jobs from hero spot
      }
    }

    // De-prioritize watchman / gardener / peon / mali from #1 hero spot
    if (/gardener|watchman|mali|peon|chaprasi/i.test(title)) {
      score -= 40;
    }

    return score;
  };

  // Sort displayJobs so major, high-impact recruitments appear at the top
  const displayJobs = useMemo(() => {
    return [...filteredJobs].sort((a, b) => {
      // 1. If state filter is active, prioritize that state
      if (filterState !== 'ALL' && filterState !== 'All India') {
        const stateWord = filterState.toLowerCase();
        const aState = `${a.state || ''} ${a.title || ''} ${a.dept || ''} ${a.location || ''}`.toLowerCase().includes(stateWord);
        const bState = `${b.state || ''} ${b.title || ''} ${b.dept || ''} ${b.location || ''}`.toLowerCase().includes(stateWord);
        if (aState && !bState) return -1;
        if (!aState && bState) return 1;
      }

      // 2. High-impact Flagship Major Recruitments first (Railway, SSC, Defence, Apprentice, 100+ posts)
      const scoreA = getJobPriorityScore(a);
      const scoreB = getJobPriorityScore(b);
      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      }

      // 3. Newest / Active forms first
      if (a.isNew && !b.isNew) return -1;
      if (!a.isNew && b.isNew) return 1;

      return 0;
    });
  }, [filteredJobs, filterState, currentHour, sessionCount]);

  const formatHeadline = (title) => {
    if (!title) return '';
    let t = title.replace(/^<img[^>]*alt=["']?/i, '');
    t = t.replace(/<img[^>]*alt=["']?/gi, ' ');
    t = t.replace(/^alt=["']?/i, '');
    t = t.replace(/<[^>]*>/g, ' ');
    t = t.replace(/<[^>]*$/g, '');
    t = t.replace(/^<[^>]*/g, '');
    t = t.replace(/&quot;|&amp;|&lt;|&gt;|&#\d+;/g, '');
    t = t.replace(/\s+/g, ' ').trim();
    t = t.replace(/^["'“”‘’]+|["'“”‘’]+$/g, '').trim();
    return t;
  };

  const isResult = (item) => /result|परिणाम|स्कोर|मेरिट|cut\s*off/i.test(item.title);
  const isAdmit = (item) => /admit\s*card|प्रवेश\s*पत्र|hall\s*ticket|exam\s*date|परीक्षा\s*तिथि/i.test(item.title);

  const resultsList = useMemo(() => {
    return (liveNews || [])
      .filter(isResult)
      .filter((item, index, self) =>
        index === self.findIndex((t) => formatHeadline(t.title).toLowerCase() === formatHeadline(item.title).toLowerCase())
      );
  }, [liveNews]);

  const admitList = useMemo(() => {
    return (liveNews || [])
      .filter(isAdmit)
      .filter((item, index, self) =>
        index === self.findIndex((t) => formatHeadline(t.title).toLowerCase() === formatHeadline(item.title).toLowerCase())
      );
  }, [liveNews]);

  const displayedNews = useMemo(() => {
    return (liveNews || []).filter((n) => {
      if (newsSourceFilter !== 'ALL') {
        const sourceLower = (n.source || '').toLowerCase();
        const catLower = (n.category || '').toLowerCase();
        const tagLower = (n.tag || '').toLowerCase();
        const filterLower = newsSourceFilter.toLowerCase();
        const match = sourceLower.includes(filterLower) || catLower.includes(filterLower) || tagLower.includes(filterLower);
        if (!match) return false;
      }
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        const combined = `${n.title || ''} ${n.source || ''} ${n.category || ''} ${n.tag || ''}`.toLowerCase();
        if (!combined.includes(term)) return false;
      }
      return true;
    });
  }, [liveNews, newsSourceFilter, searchTerm]);

  // Ticker headlines: combine freshest active jobs + breaking news, duplicated for smooth seamless marquee loop
  const tickerItems = useMemo(() => {
    const list = [];
    // 1. Freshest Job Alerts (Top 8 active vacancies)
    (jobs || []).slice(0, 8).forEach((j, i) => {
      const displayTitle = formatHeadline(j.title);
      list.push({
        id: `tick-j-${j.id || i}`,
        source: j.source || 'Job Alert',
        title: `🔥 ${displayTitle} • Last Date: ${j.lastDate || 'Active'}`,
        url: j.applyUrl || j.pdfUrl || ''
      });
    });
    // 2. Breaking News Alerts (Top 10 articles)
    (liveNews || []).slice(0, 10).forEach((n, i) => {
      list.push({
        id: `tick-n-${n.id || i}`,
        source: n.source || 'News Alert',
        title: `📢 ${formatHeadline(n.title)}`,
        url: n.url || ''
      });
    });
    return list.length > 0 ? list : [
      { id: 't1', source: 'FreeJobAlert', title: '🔥 Latest Govt & State Recruitment 2026 Online Forms Active' },
      { id: 't2', source: 'Sarkari Result', title: '📢 New Admit Cards & Exam Schedules Announced' },
      { id: 't3', source: 'Dainik Bhaskar', title: '⚡ Breaking: Police, Railway & Teacher Vacancy Updates' }
    ];
  }, [jobs, liveNews, currentLang]);

  const seamlessTicker = [...tickerItems, ...tickerItems];

  return (
    <div className="jobs-tab-container">

      {/* Live Breaking News Ticker (Continuous TV News Channel Style Marquee) */}
      <div className="live-ticker-marquee mb-2.5">
        <div className="ticker-badge-fixed">
          <span className="ticker-live-dot"></span>
          <span>LIVE TICKER</span>
        </div>
        <div className="ticker-track-container">
          <div className="ticker-track">
            {seamlessTicker.map((item, idx) => (
              <span
                key={`${item.id || idx}-${idx}`}
                className="ticker-item"
                onClick={() => {
                  if (item.url) window.open(item.url, '_blank', 'noopener,noreferrer');
                  if (onOpenNews) onOpenNews(item);
                }}
                title={formatHeadline(item.title)}
              >
                <span className="ticker-source-tag">[{item.source || 'News'}]</span>
                <span className="ticker-headline-text">{formatHeadline(item.title)}</span>
                <span className="ticker-bullet">⚡</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="search-box-wrapper mb-2.5">
        <div className="search-input-group flex-center-start">
          <Search size={16} className="text-muted ml-2" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className="search-input text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-btn text-muted mr-2" onClick={() => setSearchTerm('')}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 3 Pillars Quick Switcher: Compact, Sleek & Colorful */}
      <div className="three-pillars-grid mb-2.5">
        <button
          className={`pillar-card pillar-vacancies ${activeCategory !== 'RESULTS' && activeCategory !== 'ADMIT' && activeCategory !== 'NEWS' ? 'active-pillar' : ''}`}
          onClick={() => setActiveCategory('ALL')}
        >
          <div className="pillar-compact-header">
            <span className="pillar-mini-icon">💼</span>
            <span className="pillar-compact-badge blue-badge">{filteredJobs.length} Live</span>
          </div>
          <span className="pillar-compact-title">{t.tabJobs || 'Jobs'}</span>
        </button>

        <button
          className={`pillar-card pillar-admit ${activeCategory === 'ADMIT' ? 'active-pillar' : ''}`}
          onClick={() => setActiveCategory('ADMIT')}
        >
          <div className="pillar-compact-header">
            <span className="pillar-mini-icon">🎫</span>
            <span className="pillar-compact-badge orange-badge">{admitList.length} Live</span>
          </div>
          <span className="pillar-compact-title">{t.stageAdmitCard || 'Admit Card'}</span>
        </button>

        <button
          className={`pillar-card pillar-results ${activeCategory === 'RESULTS' ? 'active-pillar' : ''}`}
          onClick={() => setActiveCategory('RESULTS')}
        >
          <div className="pillar-compact-header">
            <span className="pillar-mini-icon">🏆</span>
            <span className="pillar-compact-badge green-badge">{resultsList.length} Out</span>
          </div>
          <span className="pillar-compact-title">{t.stageResult || 'Merit / Result'}</span>
        </button>
      </div>

      {/* Sub Sector Switcher (Only visible when Vacancies or News are active) */}
      {activeCategory !== 'RESULTS' && activeCategory !== 'ADMIT' && (
        <div className="sector-switcher-row mb-2">
          <button
            className={`sector-pill sector-all ${activeCategory === 'ALL' ? 'active' : ''}`}
            onClick={() => setActiveCategory('ALL')}
          >
            {t.filterAll || 'All Jobs'}
          </button>
          <button
            className={`sector-pill sector-govt ${activeCategory === 'Govt' ? 'active' : ''}`}
            onClick={() => setActiveCategory('Govt')}
          >
            🏛️ {t.filterGovt || 'Govt'}
          </button>
          <button
            className={`sector-pill sector-private ${activeCategory === 'Private' ? 'active' : ''}`}
            onClick={() => setActiveCategory('Private')}
          >
            🏢 {t.filterPrivate || 'Private'}
          </button>
          <button
            className={`sector-pill sector-news news-pill-btn ${activeCategory === 'NEWS' ? 'active' : ''}`}
            onClick={() => setActiveCategory('NEWS')}
          >
            <span className="relative inline-flex items-center gap-1">
              <span className="live-pill-indicator"></span>
              📰 {t.filterLiveNews || 'News'}
            </span>
          </button>
          <button
            className={`sector-pill sector-apprentice ${activeCategory === 'APPRENTICE' ? 'active' : ''}`}
            onClick={() => setActiveCategory('APPRENTICE')}
          >
            🛠️ {t.filterApprentice || 'Apprentice'}
          </button>
        </div>
      )}

      {/* If Results Tab is chosen */}
      {activeCategory === 'RESULTS' ? (
        <div className="live-results-section mb-3">
          <div className="news-header-banner p-2.5 mb-2.5 flex-between rounded" style={{ background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', border: '1px solid #86EFAC' }}>
            <span className="text-xs font-bold text-success flex-center gap-1.5">
              <Trophy size={16} /> {t.stageResult || 'Results'}: Latest Declared Exams & Cut-Off
            </span>
            <span className="badge-live-sm bg-success text-white text-3xs font-bold">{resultsList.length} Results</span>
          </div>

          <div className="news-cards-list">
            {resultsList.length > 0 ? (
              resultsList.map((r) => (
                <div
                  key={r.id}
                  className="news-card mb-2.5 p-3 card-styled cursor-pointer"
                  style={{ borderLeft: '4px solid #10B981' }}
                  onClick={() => onOpenNews && onOpenNews(r)}
                >
                  <div className="flex-between">
                    <span className="badge-source-sm font-bold text-3xs">📡 {r.source}</span>
                    <span className="badge-live-sm bg-success text-white text-3xs font-bold">🏆 RESULT OUT</span>
                  </div>
                  <h4 className="news-headline font-bold text-xs mt-1.5 leading-snug">{formatHeadline(r.title)}</h4>
                  <div className="flex-between mt-2.5 pt-2 border-top">
                    <span className="text-3xs text-muted">{r.timeAgo || 'Verified Portal Link'}</span>
                    <button
                      className="btn-accent-xs inline-flex flex-center gap-1 text-2xs font-bold"
                      style={{ background: '#10B981', color: '#FFFFFF', border: 'none' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (r.url) window.open(r.url, '_blank', 'noopener,noreferrer');
                        if (onOpenNews) onOpenNews(r);
                      }}
                    >
                      स्कोरकार्ड / रिजल्ट देखें <ExternalLink size={11} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-xs text-muted py-3">Koi result match nahi hua.</p>
            )}
          </div>
        </div>
      ) : activeCategory === 'ADMIT' ? (
        /* If Admit Card Tab is chosen */
        <div className="live-admit-section mb-3">
          <div className="news-header-banner p-2.5 mb-2.5 flex-between rounded" style={{ background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)', border: '1px solid #FDBA74' }}>
            <span className="text-xs font-bold text-warning flex-center gap-1.5">
              <Ticket size={16} /> {t.stageAdmitCard || 'Admit Card'}: Active Hall Tickets & Exam Dates
            </span>
            <span className="badge-live-sm bg-warning text-white text-3xs font-bold">{admitList.length} Live</span>
          </div>

          <div className="news-cards-list">
            {admitList.length > 0 ? (
              admitList.map((a) => (
                <div
                  key={a.id}
                  className="news-card mb-2.5 p-3 card-styled cursor-pointer"
                  style={{ borderLeft: '4px solid #F97316' }}
                  onClick={() => onOpenNews && onOpenNews(a)}
                >
                  <div className="flex-between">
                    <span className="badge-source-sm font-bold text-3xs">📡 {a.source}</span>
                    <span className="badge-live-sm bg-warning text-white text-3xs font-bold">🎫 ADMIT CARD LIVE</span>
                  </div>
                  <h4 className="news-headline font-bold text-xs mt-1.5 leading-snug">{formatHeadline(a.title)}</h4>
                  <div className="flex-between mt-2.5 pt-2 border-top">
                    <span className="text-3xs text-muted">{a.timeAgo || 'Hall Ticket Link'}</span>
                    <button
                      className="btn-accent-xs inline-flex flex-center gap-1 text-2xs font-bold"
                      style={{ background: '#F97316', color: '#FFFFFF', border: 'none' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (a.url) window.open(a.url, '_blank', 'noopener,noreferrer');
                        if (onOpenNews) onOpenNews(a);
                      }}
                    >
                      एडमिट कार्ड डाउनलोड करें <ExternalLink size={11} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-xs text-muted py-3">Koi admit card match nahi hua.</p>
            )}
          </div>
        </div>
      ) : activeCategory === 'NEWS' ? (
        /* If Live News & Current Affairs Tab is chosen */
        <div className="live-news-section mb-3">
          <div className="news-header-banner p-2.5 mb-2.5 flex-between rounded-xl" style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', border: '1px solid #93C5FD' }}>
            <div>
              <span className="text-xs font-bold text-primary flex-center-start gap-1.5">
                <Newspaper size={16} /> {currentLang === 'hi' ? 'दैनिक समसामयिकी (Current Affairs), GK व भर्ती बुलेटिन' : 'Daily Current Affairs, GK & Recruitment Bulletin'}
              </span>
              <p className="text-3xs text-muted m-0 mt-0.5">
                {currentLang === 'hi' ? 'Drishti IAS, GKToday (100+), Jagran GK, अमर उजाला व दैनिक भास्कर' : 'Drishti IAS, GKToday, Jagran GK, Amar Ujala & Dainik Bhaskar'}
              </p>
            </div>
            <span className="badge-live-sm bg-primary text-white text-3xs font-bold px-2 py-0.5 rounded-full">{displayedNews.length} Live</span>
          </div>

          {/* Publisher & Category Filter Bar */}
          <div className="qualification-scroll-bar mb-2.5 flex-row gap-1.5 no-scrollbar" style={{ overflowX: 'auto', display: 'flex', whiteSpace: 'nowrap' }}>
            {['ALL', 'Business', 'Drishti IAS (Hindi)', 'GKToday', 'Jagran Josh GK', 'Sarkari Result', 'Sarkari Result .cm', 'Dainik Bhaskar', 'Amar Ujala', 'Navbharat Times', 'Live Hindustan', 'Times of India'].map((src) => {
              const label = src === 'ALL'
                ? (currentLang === 'hi' ? `सभी आर्टिकल्स (${liveNews.length})` : `All Articles (${liveNews.length})`)
                : (src === 'Business' ? (currentLang === 'hi' ? '💼 बिजनेस व आर्थिकी (Business)' : '💼 Business & Economy') : src);
              return (
                <button
                  key={src}
                  className={`qual-pill-btn text-3xs ${newsSourceFilter === src ? 'active' : ''}`}
                  onClick={() => setNewsSourceFilter(src)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '9999px',
                    fontWeight: newsSourceFilter === src ? 'bold' : '600',
                    background: newsSourceFilter === src ? '#1E3A8A' : 'var(--bg-card)',
                    color: newsSourceFilter === src ? '#FFFFFF' : 'var(--text-primary)',
                    border: '1px solid var(--border)'
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="news-cards-list">
            {displayedNews && displayedNews.length > 0 ? (
              displayedNews.map((n) => {
                const isBusiness = (n.category || '').toLowerCase() === 'business' || (n.tag || '').toLowerCase() === 'business' || (n.source || '').toLowerCase().includes('business');
                const isDrishti = (n.source || '').includes('Drishti');
                const isGKToday = (n.source || '').includes('GKToday');
                const isJagranGK = (n.source || '').includes('Jagran');

                let badgeColor = '#475569';
                let badgeBg = '#F1F5F9';
                let borderLeft = '4px solid #3B82F6';

                if (isBusiness) {
                  badgeColor = '#0F766E';
                  badgeBg = '#CCFBF1';
                  borderLeft = '4px solid #14B8A6';
                } else if (isDrishti) {
                  badgeColor = '#C2410C';
                  badgeBg = '#FFEDD5';
                  borderLeft = '4px solid #EA580C';
                } else if (isGKToday) {
                  badgeColor = '#047857';
                  badgeBg = '#D1FAE5';
                  borderLeft = '4px solid #10B981';
                } else if (isJagranGK) {
                  badgeColor = '#4338CA';
                  badgeBg = '#E0E7FF';
                  borderLeft = '4px solid #6366F1';
                }

                return (
                  <div
                    key={n.id}
                    className="news-card mb-2.5 p-3 card-styled cursor-pointer"
                    style={{ borderLeft: borderLeft, borderRadius: '10px', background: 'var(--bg-card)' }}
                    onClick={() => onOpenNews && onOpenNews(n)}
                  >
                    <div className="flex-between">
                      <span
                        className="badge-source-sm font-bold text-3xs px-2 py-0.5 rounded"
                        style={{ color: badgeColor, background: badgeBg }}
                      >
                        {isBusiness
                          ? (currentLang === 'hi' ? '💼 बिजनेस व आर्थिकी' : '💼 Business')
                          : (isDrishti ? '📖 Drishti IAS' : (isGKToday ? '🌐 GKToday (CA)' : (isJagranGK ? '🧠 Jagran GK' : `📡 ${n.source}`)))}
                      </span>
                      <span className="text-3xs text-muted">
                        {n.timeAgo || (n.category ? `• ${n.category}` : 'Live')}
                      </span>
                    </div>

                    <h4 className="news-headline font-bold text-xs mt-1.5 leading-snug" style={{ color: 'var(--text-color, #1E293B)' }}>
                      {formatHeadline(n.title)}
                    </h4>

                    <div className="flex-between mt-2 pt-2 border-top gap-2 flex-wrap">
                      <span className="text-3xs text-muted flex-center gap-1">
                        ⏱️ {n.date || 'Today'}
                      </span>
                      <div className="flex-center gap-2">
                        <button
                          type="button"
                          className="btn-accent-xs inline-flex flex-center gap-1 text-3xs font-bold px-2.5 py-1 rounded"
                          style={{ background: '#2563EB', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onOpenNews) onOpenNews(n);
                          }}
                        >
                          📖 पूरा लेख पढ़ें (In-App)
                        </button>
                        {n.url && (
                          <a
                            href={n.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-3xs text-muted font-semibold flex-center gap-0.5"
                            onClick={(e) => e.stopPropagation()}
                            style={{ textDecoration: 'none' }}
                          >
                            वेबसाइट <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-xs text-muted py-3">कोई समाचार या करेंट अफेयर्स मैच नहीं हुआ।</p>
            )}
          </div>
        </div>
      ) : (
        /* Otherwise Normal Jobs View */
        <>
          {/* 3 Comprehensive Dropdown Filters: Qualification, Department, State */}
          <div className="filter-dropdowns-grid mb-2">
            {/* 1. Qualification Dropdown */}
            <div className="filter-select-wrapper">
              <select
                className={`filter-pill-select ${filterQual !== 'ALL' ? 'active-filter' : ''}`}
                value={filterQual}
                onChange={(e) => setFilterQual(e.target.value)}
                title={t.dropdownAllQual || "Qualification Filter"}
              >
                {Object.entries(activeQualMap).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
              <span className="select-chevron-icon">▾</span>
            </div>

            {/* 2. Department Dropdown */}
            <div className="filter-select-wrapper">
              <select
                className={`filter-pill-select ${filterDept !== 'ALL' ? 'active-filter' : ''}`}
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                title={t.dropdownAllDept || "Department Filter"}
              >
                {Object.entries(activeDeptMap).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
              <span className="select-chevron-icon">▾</span>
            </div>

            {/* 3. State Dropdown */}
            <div className="filter-select-wrapper">
              <select
                className={`filter-pill-select ${filterState !== 'ALL' ? 'active-filter' : ''}`}
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                title={t.dropdownAllState || "State Filter"}
              >
                {Object.entries(activeStateMap).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
              <span className="select-chevron-icon">▾</span>
            </div>
          </div>

          {/* Active Filter Indicators & Reset Button */}
          {(filterQual !== 'ALL' || filterDept !== 'ALL' || filterState !== 'ALL') && (
            <div className="active-filter-strip flex-between mb-2 px-1">
              <div className="flex-center-start gap-1 flex-wrap">
                <span className="text-3xs text-muted font-bold">{t.filterActiveHeading || 'Active'}:</span>
                {filterQual !== 'ALL' && <span className="badge-active-filter">{activeQualMap[filterQual] || filterQual}</span>}
                {filterDept !== 'ALL' && <span className="badge-active-filter">{activeDeptMap[filterDept] || filterDept}</span>}
                {filterState !== 'ALL' && <span className="badge-active-filter">{activeStateMap[filterState] || filterState}</span>}
              </div>
              <button
                className="btn-clear-filters text-3xs font-bold text-danger cursor-pointer"
                onClick={() => {
                  setFilterQual('ALL');
                  setFilterDept('ALL');
                  setFilterState('ALL');
                }}
              >
                ✕ {t.resetAll || 'Reset All'}
              </button>
            </div>
          )}

          {/* Top Indian Companies Career Directory (Active when Private is selected) */}
          {activeCategory === 'Private' && (
            <div className="companies-directory-container mb-3">
              <div className="companies-banner-header flex-between">
                <div>
                  <h4 className="font-bold text-xs flex-center-start gap-1" style={{ color: '#7C3AED' }}>
                    🏢 Top Indian Companies - Direct Official Career Portals
                  </h4>
                  <p className="text-3xs text-muted mt-0.5">
                    टाटा, बजाज, हीरो, महिंद्रा, होंडा, जियो की आधिकारिक वेबसाइट्स पर सीधे आवेदन करें
                  </p>
                </div>
                <span className="badge-pill" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#6D28D9', fontSize: '9px', fontWeight: 'bold' }}>
                  {TOP_INDIAN_COMPANIES.length} Direct Portals
                </span>
              </div>

              <div className="company-cards-grid">
                {TOP_INDIAN_COMPANIES.map((comp) => (
                  <div key={comp.id} className="company-card">
                    <div className="flex-between">
                      <div className="flex-center-start gap-1.5">
                        <span style={{ fontSize: '20px' }}>{comp.logo}</span>
                        <div>
                          <h5 className="font-bold text-xs leading-tight" style={{ color: comp.color || '#1E293B' }}>{comp.name}</h5>
                          <span className="text-3xs text-muted">{comp.sector}</span>
                        </div>
                      </div>
                      <span className="company-badge-hiring">{comp.hiringBadge}</span>
                    </div>

                    <div className="mt-2 text-3xs text-muted">
                      <div><b>Roles:</b> {comp.roles}</div>
                      <div><b>Locations:</b> {comp.locations}</div>
                    </div>

                    <div className="mt-2.5 pt-2 border-top flex-between gap-1.5 flex-wrap">
                      <a
                        href={comp.careersUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-accent-xs inline-flex flex-center gap-1 font-bold"
                        style={{ background: comp.color || '#2563EB', color: '#FFFFFF', border: 'none', padding: '4px 8px', borderRadius: '6px', fontSize: '10px' }}
                      >
                        Apply on Official Site <ExternalLink size={11} />
                      </a>
                      {comp.tcsUrl && (
                        <a
                          href={comp.tcsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary-xs inline-flex flex-center gap-1 font-semibold"
                          style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '6px' }}
                        >
                          TCS Careers <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Smart AI Job Matcher Banner */}
          <div className="smart-matcher-card mb-3 p-3">
            <div className="flex-between">
              <div className="flex-center gap-2">
                <div className="smart-matcher-icon-glow">
                  <Sparkles size={18} className="text-warning" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-accent leading-tight m-0">
                    {t.smartMatcherTitle || 'Smart Job Matcher (My Job)'}
                  </h4>
                  <p className="text-3xs text-muted m-0 mt-0.5">
                    {currentLang === 'en'
                      ? 'Find 100% verified jobs for your qualification & age'
                      : 'अपनी योग्यता और उम्र के अनुसार बिल्कुल सही नौकरी ढूंढें'}
                  </p>
                </div>
              </div>
              <button
                className="btn-matcher-action"
                onClick={() => setIsMatcherOpen(!isMatcherOpen)}
              >
                {isMatcherOpen
                  ? (t.smartMatcherClose || 'Close ✕')
                  : (currentLang === 'en' ? 'Match 🔍' : 'ढूंढें 🔍')}
              </button>
            </div>

            {isMatcherOpen && (
              <div className="matcher-controls mt-2.5 pt-2.5 border-top">
                <div className="flex-row gap-2">
                  <div className="flex-1">
                    <label className="text-3xs font-semibold text-muted">{t.yourQualification}</label>
                    <select
                      className="form-select-sm w-full text-xs mt-0.5"
                      value={matchQual}
                      onChange={(e) => setMatchQual(e.target.value)}
                    >
                      <option value="10th">{t.filter10th}</option>
                      <option value="12th">{t.filter12th}</option>
                      <option value="ITI">{t.filterITI}</option>
                      <option value="Graduate">{t.filterGraduate}</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-3xs font-semibold text-muted">{t.yourAge}</label>
                    <input
                      type="number"
                      min="18"
                      max="45"
                      value={matchAge}
                      onChange={(e) => setMatchAge(Number(e.target.value))}
                      className="form-input text-xs mt-0.5"
                    />
                  </div>
                </div>
                <p className="text-3xs text-success font-semibold mt-1.5 m-0">
                  ✅ {filteredJobs.length} {t.matchedVacancies}
                </p>
              </div>
            )}
          </div>

          {/* Apprentice Special Highlight Banner */}
          {activeCategory === 'APPRENTICE' && (
            <div className="apprentice-banner p-3 mb-3 rounded-xl border flex-between" style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)', borderColor: '#F59E0B' }}>
              <div>
                <h4 className="text-xs font-bold text-amber-900 flex-center-start gap-1" style={{ margin: 0 }}>
                  {currentLang === 'en'
                    ? '🛠️ All India Apprentice Recruitment Special'
                    : '🛠️ ऑल इंडिया अप्रेंटिसशिप स्पेशल भर्ती'}
                </h4>
                <p className="text-3xs text-amber-800 m-0 mt-0.5">
                  {currentLang === 'en'
                    ? 'Railway, Bank, IOCL & PSU Apprentices — Direct Merit (No Exam) + Stipend (₹7,000 - ₹12,500/mo)'
                    : 'रेलवे, बैंक, IOCL, ONGC, SAIL & PSU अप्रेंटिस — सीधी मेरिट भर्ती (बिना परीक्षा) + मासिक स्टाइपेंड (₹7,000 - ₹12,500/माह)'}
                </p>
              </div>
              <span className="badge-live-sm bg-amber-600 text-white text-3xs font-bold px-2 py-0.5 rounded-full">
                {displayJobs.length} Live
              </span>
            </div>
          )}


          {/* Jobs List */}
          <div className="jobs-list">
            {displayJobs.length > 0 ? (
              displayJobs.map((job, idx) => (
                <React.Fragment key={job.id}>
                  <JobCard
                    job={job}
                    onOpenDetail={onOpenDetail}
                    onOpenApply={onOpenApply}
                    isSaved={savedJobIds.includes(job.id)}
                    onToggleSave={onToggleSave}
                    t={t}
                    currentLang={currentLang}
                  />

                  {/* Native Google AdMob / AdSense Sponsored Banner Unit */}
                  {idx === 2 && (
                    <div
                      className="admob-native-banner my-2.5 p-3 rounded-xl border text-center shadow-xs"
                      style={{
                        background: 'linear-gradient(135deg, rgba(241, 245, 249, 0.95), rgba(226, 232, 240, 0.8))',
                        borderColor: 'rgba(203, 213, 225, 0.8)'
                      }}
                    >
                      <div className="flex-between text-3xs text-muted mb-1 px-0.5">
                        <span
                          className="badge-ad-tag"
                          style={{
                            fontSize: '9px',
                            fontWeight: 'bold',
                            padding: '1px 5px',
                            borderRadius: '4px',
                            background: '#0F172A',
                            color: '#FFFFFF',
                            letterSpacing: '0.4px'
                          }}
                        >
                          SPONSORED • AD
                        </span>
                        <span style={{ fontSize: '9px', color: '#64748B' }}>Google AdSense / AdMob</span>
                      </div>
                      <div
                        className="ad-inner-content p-2.5 rounded-lg flex-between flex-wrap gap-2 text-left"
                        style={{ background: 'var(--card-bg, #FFFFFF)', border: '1px solid rgba(226, 232, 240, 0.8)' }}
                      >
                        <div className="flex-1 min-w-[200px]">
                          <p className="text-xs font-bold text-slate-800 m-0">🎯 Best Books & Test Series for ITI & Railway ALP 2026</p>
                          <p className="text-3xs text-muted mt-0.5 mb-0">Free Practice Mocks + Previous Years Solved Papers</p>
                        </div>
                        <a
                          href="https://play.google.com/store/apps/details?id=com.vacancyera.vee"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-accent-xs font-bold text-3xs px-2.5 py-1.5 rounded inline-flex flex-center gap-1"
                          style={{ background: '#2563EB', color: '#FFFFFF', textDecoration: 'none' }}
                        >
                          Check Offer <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  )}

                  {idx === 8 && (
                    <div
                      className="admob-native-banner my-2.5 p-3 rounded-xl border text-center shadow-xs"
                      style={{
                        background: 'linear-gradient(135deg, rgba(254, 243, 199, 0.6), rgba(253, 230, 138, 0.4))',
                        borderColor: '#FDE68A'
                      }}
                    >
                      <div className="flex-between text-3xs text-muted mb-1 px-0.5">
                        <span
                          className="badge-ad-tag"
                          style={{
                            fontSize: '9px',
                            fontWeight: 'bold',
                            padding: '1px 5px',
                            borderRadius: '4px',
                            background: '#B45309',
                            color: '#FFFFFF',
                            letterSpacing: '0.4px'
                          }}
                        >
                          SPONSORED • AD
                        </span>
                        <span style={{ fontSize: '9px', color: '#92400E' }}>Google AdSense / AdMob</span>
                      </div>
                      <div
                        className="ad-inner-content p-2.5 rounded-lg flex-between flex-wrap gap-2 text-left"
                        style={{ background: 'var(--card-bg, #FFFFFF)', border: '1px solid rgba(253, 230, 138, 0.8)' }}
                      >
                        <div className="flex-1 min-w-[200px]">
                          <p className="text-xs font-bold text-amber-900 m-0">⚡ Live Coaching & Skill Certification: Up to 50% Off</p>
                          <p className="text-3xs text-muted mt-0.5 mb-0">Certified Diplomas for Private MNC Jobs (Tata, Maruti, L&T)</p>
                        </div>
                        <a
                          href="https://play.google.com/store/apps/details?id=com.vacancyera.vee"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-accent-xs font-bold text-3xs px-2.5 py-1.5 rounded inline-flex flex-center gap-1"
                          style={{ background: '#D97706', color: '#FFFFFF', textDecoration: 'none' }}
                        >
                          Learn More <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))
            ) : (
              <div className="empty-state text-center p-4">
                <Briefcase size={36} className="text-muted inline mb-2" />
                <p className="text-xs text-muted">Koi job match nahi hui.</p>
                <button
                  className="btn-secondary-sm mt-2"
                  onClick={() => {
                    setSearchTerm('');
                    setActiveCategory('ALL');
                    setFilterQual('ALL');
                    setFilterDept('ALL');
                    setFilterState('ALL');
                    setIsMatcherOpen(false);
                  }}
                >
                  Filter Reset Karein
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
