/**
 * Robust Job Expiry & Recruitment Validity Checker for VEE Scraper & App
 * 1. Automatically purges any job whose lastDate has passed today's date.
 * 2. Strictly validates genuine recruitment jobs and blocks news, accidents, crime, tragedies.
 */
export function isJobExpired(lastDateStr, todayStr) {
  if (!lastDateStr) return false;
  const clean = String(lastDateStr).trim();
  if (/active|ongoing|soon|live|open|tracked/i.test(clean)) return false;

  const currentToday = todayStr || new Date().toISOString().split('T')[0];

  // 1. ISO format YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
    return clean < currentToday;
  }

  // 2. DD-MM-YYYY or DD/MM/YYYY
  const dmy = clean.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmy) {
    const iso = `${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}`;
    return iso < currentToday;
  }

  // 3. Text format (e.g. 15 Oct 2026, Oct 15 2026)
  const parsed = Date.parse(clean);
  if (!isNaN(parsed)) {
    try {
      const jobDate = new Date(parsed).toISOString().split('T')[0];
      return jobDate < currentToday;
    } catch (e) {
      return false;
    }
  }

  return false;
}

/**
 * Strict Recruitment Job Validator
 * Blocks any news article, accident, hospital admission, crime, tragedy, or fake cell
 */
export function isValidRecruitmentJob(job) {
  if (!job || !job.title) return false;

  // 1. Genuine private tech/global jobs from verified APIs (RemoteOK, WeWorkRemotely)
  if (job.category === 'Private' && (job.source?.includes('RemoteOK') || job.source?.includes('WeWorkRemotely'))) {
    return true;
  }

  const title = (job.title || '').toLowerCase();
  const dept = (job.dept || '').toLowerCase();
  const combined = `${title} ${dept}`;

  // 2. Reject news articles masquerading as recruitment cards
  if (job.isNewsArticle && !job.applyUrl?.includes('sarkari') && !job.applyUrl?.includes('freejobalert') && !job.applyUrl?.includes('rojgar')) {
    return false;
  }

  // 3. Strictly reject crimes, accidents, hospital admissions, tragedies, scams, protests
  const rejectWords = [
    'हादसा', 'दुर्घटना', 'accident', 'घायल', 'गोली', 'गोलीबारी', 'shoot', 'इलाज',
    'आईसीयू', 'icu', 'अस्पताल', 'hospital', 'मौत', 'मृत्यु',
    'हत्या', 'murder', 'dead', 'death', 'शव', 'police custody', 'गिरफ्तार', 'arrest',
    'fir', 'मुआवजा', 'धरना', 'ज्ञापन', 'strike', 'protest', 'विवाद',
    'फंदे', 'सड़क पार', 'सड़क हादसा', 'बहन को', 'भाई ने', 'दुष्कर्म', 'चोरी',
    'लूट', 'अपराध', 'फर्जीवाड़ा', 'scam', 'धोखाधड़ी'
  ];

  if (rejectWords.some(w => combined.includes(w))) {
    return false;
  }

  // 4. Reject suspicious pseudo-departments invented from headlines
  if (dept.includes('recruitment cell')) {
    const allowedCells = ['railway recruitment cell', 'rrc', 'central recruitment cell', 'government recruitment cell'];
    if (!allowedCells.some(ac => dept.includes(ac))) {
      return false;
    }
  }

  return true;
}
