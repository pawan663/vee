/**
 * Robust Job Expiry Checker for VEE App
 * Automatically purges any job whose lastDate has passed today's date.
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
