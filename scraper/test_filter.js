function getDept(t) {
  if (/railway|rrb|rrc|ntpc|group d/i.test(t)) return "Ministry of Railways (RRB / RRC)";
  if (/ssc|cgl|chsl|mts|havaldar|\bgd\b/i.test(t)) return "Staff Selection Commission (SSC)";
  if (/upsc|\bnda\b|\bcds\b|civil service/i.test(t)) return "Union Public Service Commission (UPSC)";
  if (/bank|ibps|\bsbi\b|\brbi\b|\bpnb\b|canara|uco/i.test(t)) return "Banking Recruitment Board (IBPS / SBI)";
  if (/police|constable|\bsi\b|daroga|sub[\s-]?inspector/i.test(t)) return "State Police Recruitment Board";
  if (/army|navy|airforce|defence|crpf|bsf|cisf|assam rifles/i.test(t)) return "Indian Armed & Paramilitary Forces";
  if (/teacher|\btet\b|\bprt\b|\btgt\b|\bpgt\b|upessc/i.test(t)) return "Education Dept / School Selection Board";
  if (/post office|\bgds\b|\bdak\b/i.test(t)) return "Department of Posts (India Post)";
  if (/bhel|ntpc|ongc|sail|isro|drdo|mpesb/i.test(t)) return "Govt PSU / Engineering Board";
  return "General Govt Cell";
}

const samples = [
  "Mumbai University B.E Result 2026 Out",
  "GSSSB Work Assistant Recruitment 2026",
  "Canara Bank Apprentice Recruitment 2026",
  "UP Police Constable 2026",
  "Delhi Police Sub-Inspector SI 2026",
  "Rajasthan Police SI Daroga 2026",
  "NPCC Jr. Engineer Assistant 2026"
];

samples.forEach(s => console.log(s, "==>", getDept(s.toLowerCase())));
