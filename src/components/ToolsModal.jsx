import React, { useState } from 'react';
import { X, Image, Calendar, Download, RefreshCw, CheckCircle2, AlertCircle, Edit3, Save, Check } from 'lucide-react';

export default function ToolsModal({ isOpen, onClose, t, onPhotoSaved }) {
  const [activeTool, setActiveTool] = useState('photo'); // 'photo' | 'signature' | 'age'

  // Photo / Signature Resizer State
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [targetSizeKB, setTargetSizeKB] = useState(30); // 30KB default for photo, 15KB for sign
  const [resizedBlobUrl, setResizedBlobUrl] = useState(null);
  const [resizedBlob, setResizedBlob] = useState(null);
  const [resizedSizeKB, setResizedSizeKB] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSavedToVault, setIsSavedToVault] = useState(false);

  // Age Calculator State
  const [dob, setDob] = useState('2003-05-15');
  const [asOnDate, setAsOnDate] = useState('2026-08-01');
  const [ageResult, setAgeResult] = useState(null);

  if (!isOpen) return null;

  // Handle Tab Change
  const handleTabChange = (tool) => {
    setActiveTool(tool);
    setSelectedFile(null);
    setPreviewUrl(null);
    setResizedBlobUrl(null);
    setResizedBlob(null);
    setResizedSizeKB(null);
    setIsSavedToVault(false);
    if (tool === 'signature') {
      setTargetSizeKB(15);
    } else if (tool === 'photo') {
      setTargetSizeKB(30);
    }
  };

  // Handle Image selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResizedBlobUrl(null);
      setResizedBlob(null);
      setResizedSizeKB(null);
      setIsSavedToVault(false);
    }
  };

  // Iterative binary-search compression
  const processResize = async () => {
    if (!previewUrl) return;
    setIsProcessing(true);
    setIsSavedToVault(false);

    try {
      const img = new window.Image();
      img.src = previewUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Dimension presets
      const isSign = activeTool === 'signature';
      let targetWidth = isSign ? 350 : 350;
      let targetHeight = isSign ? 150 : 450;

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Helper to test blob quality
      const getBlobAtQuality = (cnv, quality) => {
        return new Promise((res) => {
          cnv.toBlob((b) => res(b), 'image/jpeg', quality);
        });
      };

      let minQ = 0.05;
      let maxQ = 0.96;
      let bestBlob = null;
      let bestSizeKB = Infinity;

      // Binary search over 8 iterations for pinpoint accuracy
      for (let i = 0; i < 8; i++) {
        const midQ = (minQ + maxQ) / 2;
        const b = await getBlobAtQuality(canvas, midQ);
        if (!b) break;
        const kb = b.size / 1024;

        if (kb <= targetSizeKB) {
          bestBlob = b;
          bestSizeKB = kb;
          minQ = midQ; // Try higher quality while under limit
        } else {
          maxQ = midQ; // Over limit, reduce quality
        }
      }

      // If still over target, scale down canvas dimensions slightly
      if (!bestBlob || bestSizeKB > targetSizeKB) {
        const scaledCanvas = document.createElement('canvas');
        scaledCanvas.width = Math.round(targetWidth * 0.85);
        scaledCanvas.height = Math.round(targetHeight * 0.85);
        const sctx = scaledCanvas.getContext('2d');
        sctx.fillStyle = '#FFFFFF';
        sctx.fillRect(0, 0, scaledCanvas.width, scaledCanvas.height);
        sctx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);

        const fallbackBlob = await getBlobAtQuality(scaledCanvas, 0.45);
        if (fallbackBlob) {
          bestBlob = fallbackBlob;
          bestSizeKB = fallbackBlob.size / 1024;
        }
      }

      if (bestBlob) {
        setResizedBlob(bestBlob);
        setResizedSizeKB(bestSizeKB.toFixed(1));
        setResizedBlobUrl(URL.createObjectURL(bestBlob));
      }
    } catch (err) {
      console.error("Resize failed:", err);
      alert("Image resize karne me dikkt aayi. Kripya dusri photo chunein.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Save resized photo/signature directly to Document Vault in Profile
  const handleSaveToVault = () => {
    if (!resizedBlob) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result;
      try {
        const profileRaw = localStorage.getItem('vee_user_profile');
        const profile = profileRaw ? JSON.parse(profileRaw) : {};
        if (activeTool === 'signature') {
          profile.signature = {
            name: 'Govt_Form_Signature.jpg',
            size: `${resizedSizeKB} KB`,
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            dataUrl: base64data
          };
        } else {
          profile.photo = {
            name: 'Govt_Form_Passport_Photo.jpg',
            size: `${resizedSizeKB} KB`,
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            dataUrl: base64data
          };
        }
        localStorage.setItem('vee_user_profile', JSON.stringify(profile));
        setIsSavedToVault(true);
        if (onPhotoSaved) onPhotoSaved(profile);
      } catch (e) {
        console.error("Vault save error:", e);
      }
    };
    reader.readAsDataURL(resizedBlob);
  };

  // Handle Age calculation
  const calculateAge = () => {
    if (!dob || !asOnDate) return;
    const birth = new Date(dob);
    const target = new Date(asOnDate);

    if (birth > target) {
      alert("Date of birth cut-off date se pehle ki honi chahiye!");
      return;
    }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    setAgeResult({ years, months, days });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content bottom-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sheet-header">
          <div className="sheet-grabber"></div>
          <div className="flex-between">
            <h3 className="sheet-title">{t.tools || 'Sarkari Exam Tools'}</h3>
            <button className="icon-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          {/* Tool Selector Tabs */}
          <div className="pill-row mt-2 flex-row gap-1.5 flex-wrap">
            <button
              className={`pill-btn text-2xs ${activeTool === 'photo' ? 'active' : ''}`}
              onClick={() => handleTabChange('photo')}
            >
              <Image size={14} /> 📷 Photo Resizer
            </button>
            <button
              className={`pill-btn text-2xs ${activeTool === 'signature' ? 'active' : ''}`}
              onClick={() => handleTabChange('signature')}
            >
              <Edit3 size={14} /> ✍️ Sign Resizer
            </button>
            <button
              className={`pill-btn text-2xs ${activeTool === 'age' ? 'active' : ''}`}
              onClick={() => handleTabChange('age')}
            >
              <Calendar size={14} /> 🎂 Age Calculator
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="sheet-body">
          {activeTool === 'photo' || activeTool === 'signature' ? (
            <div className="tool-box">
              <p className="text-muted text-xs mb-3">
                {activeTool === 'photo'
                  ? '📷 Sarkari Passport Photo (350x450 px): SSC, Railway, Police bhartiyon ke liye 20KB-50KB me convert karein.'
                  : '✍️ Sarkari Signature (350x150 px): White paper par scan sign ko 10KB-20KB me convert karein.'}
              </p>

              {/* Upload Dropzone */}
              <div className="upload-dropzone">
                <input
                  type="file"
                  id="tool-file-input"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="tool-file-input" className="btn-secondary w-full cursor-pointer text-center block p-2.5 rounded border">
                  📁 {selectedFile ? selectedFile.name : (activeTool === 'photo' ? "Apne Phone Se Photo Chunein" : "Apna Sign Chunein")}
                </label>
              </div>

              {previewUrl && (
                <div className="resize-control mt-3">
                  <div className="flex-center mb-3">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="preview-thumb"
                      style={activeTool === 'signature' ? { width: '180px', height: '80px', objectFit: 'contain', background: '#fff', padding: '4px', border: '1px solid #ccc' } : { width: '120px', height: '150px', objectFit: 'cover' }}
                    />
                  </div>

                  <label className="text-xs font-semibold block mb-1">
                    🎯 Target Size Chunein: <b>{targetSizeKB} KB</b>
                  </label>
                  <div className="flex-row gap-2 mt-1">
                    {(activeTool === 'signature' ? [10, 15, 20, 30] : [20, 30, 50, 100]).map((size) => (
                      <button
                        key={size}
                        className={`pill-sm ${targetSizeKB === size ? 'active' : ''}`}
                        onClick={() => setTargetSizeKB(size)}
                      >
                        {size} KB
                      </button>
                    ))}
                  </div>

                  <button
                    className="btn-primary w-full mt-3 flex-center gap-1.5"
                    onClick={processResize}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" /> Compress ho raha hai...
                      </>
                    ) : (
                      <>⚡ 1-Click Me Exact {targetSizeKB} KB Convert Karein</>
                    )}
                  </button>
                </div>
              )}

              {resizedBlobUrl && (
                <div className="success-box mt-3 text-center p-3 rounded" style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid #86EFAC' }}>
                  <CheckCircle2 size={24} className="text-success inline mb-1" />
                  <p className="font-bold text-success text-xs">
                    ✅ {activeTool === 'photo' ? 'Photo' : 'Signature'} Taiyar Hai: <b>{resizedSizeKB} KB</b> (Target: {targetSizeKB} KB)
                  </p>

                  <div className="flex-column gap-2 mt-2">
                    <a
                      href={resizedBlobUrl}
                      download={activeTool === 'photo' ? "Sarkari_Passport_Photo.jpg" : "Sarkari_Signature.jpg"}
                      className="btn-accent w-full inline-flex flex-center gap-1 text-decoration-none text-xs font-bold"
                    >
                      <Download size={14} /> Download {activeTool === 'photo' ? 'Photo' : 'Sign'} ({resizedSizeKB} KB)
                    </a>

                    <button
                      className="btn-secondary w-full inline-flex flex-center gap-1 text-xs font-bold"
                      onClick={handleSaveToVault}
                      disabled={isSavedToVault}
                    >
                      {isSavedToVault ? (
                        <>
                          <Check size={14} className="text-success" /> Profile & CV Locker Me Save Ho Gaya!
                        </>
                      ) : (
                        <>
                          <Save size={14} /> 📁 Profile / CV Locker Me Save Karein
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="tool-box">
              <p className="text-muted text-xs mb-3">
                Notification ke hisaab se apni exact age (saal, mahina, din) calculate karein:
              </p>

              <div className="form-group mb-2">
                <label className="form-label text-xs">Aapki Janm Tareekh (Date of Birth):</label>
                <input
                  type="date"
                  className="form-input text-xs"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>

              <div className="form-group mb-3">
                <label className="form-label text-xs">Form Me Cut-off Date (As On Date):</label>
                <input
                  type="date"
                  className="form-input text-xs"
                  value={asOnDate}
                  onChange={(e) => setAsOnDate(e.target.value)}
                />
              </div>

              <button className="btn-primary w-full text-xs font-bold" onClick={calculateAge}>
                Calculate Sarkari Age
              </button>

              {ageResult && (
                <div className="result-card mt-3">
                  <div className="result-badge font-bold text-3xs">Cut-off Date Tak Aapki Age</div>
                  <div className="age-stats-grid mt-2">
                    <div className="stat-card p-2 text-center">
                      <span className="stat-val font-extrabold text-lg text-accent block">{ageResult.years}</span>
                      <span className="stat-lbl text-3xs text-muted">Saal (Years)</span>
                    </div>
                    <div className="stat-card p-2 text-center">
                      <span className="stat-val font-extrabold text-lg text-accent block">{ageResult.months}</span>
                      <span className="stat-lbl text-3xs text-muted">Mahine (Months)</span>
                    </div>
                    <div className="stat-card p-2 text-center">
                      <span className="stat-val font-extrabold text-lg text-accent block">{ageResult.days}</span>
                      <span className="stat-lbl text-3xs text-muted">Din (Days)</span>
                    </div>
                  </div>
                  <div className="eligibility-hint mt-2.5 text-center text-xs p-2 rounded bg-light border">
                    {ageResult.years >= 18 && ageResult.years <= 30 ? (
                      <span className="text-success font-semibold">
                        ✅ Aap 18-30 saal ki sabhi general bhartiyon ke liye eligible hain!
                      </span>
                    ) : (
                      <span className="text-warning font-semibold">
                        ℹ️ Category relaxation (OBC +3 saal, SC/ST +5 saal) check karein.
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
