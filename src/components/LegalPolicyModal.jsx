import React, { useState } from 'react';
import { X, Shield, Lock, FileText, Trash2, ExternalLink, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function LegalPolicyModal({ isOpen, initialTab = 'disclaimer', onClose, onClearUserData, t }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isDeletedSuccess, setIsDeletedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDeleteData = () => {
    if (window.confirm("Kya aap apna saara local profile data, saved jobs aur search history delete karna chahte hain?")) {
      if (onClearUserData) {
        onClearUserData();
      } else {
        localStorage.removeItem('vee_user_profile');
        localStorage.removeItem('vee_saved_jobs');
        localStorage.removeItem('vee_applied_jobs');
      }
      setIsDeletedSuccess(true);
      setTimeout(() => {
        setIsDeletedSuccess(false);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div
        className="modal-content legal-policy-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '560px',
          width: '95%',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '16px',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div className="modal-header flex-between p-3 border-bottom" style={{ background: 'var(--card-bg, #FFFFFF)' }}>
          <div className="flex-center-start gap-2">
            <div
              className="p-1.5 rounded-lg flex-center"
              style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}
            >
              <Shield size={18} />
            </div>
            <div>
              <h3 className="modal-title font-bold text-sm m-0" style={{ color: 'var(--text-color, #1E293B)' }}>
                नीति, डिस्क्लेमर व क़ानूनी सुरक्षा
              </h3>
              <p className="text-3xs text-muted m-0">Legal Policies, Government Disclaimer &amp; Privacy</p>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Tab Selector */}
        <div
          className="policy-tabs flex-row border-bottom"
          style={{
            background: 'var(--surface-color, #F8FAFC)',
            overflowX: 'auto',
            padding: '4px 8px',
            gap: '6px'
          }}
        >
          <button
            type="button"
            className={`tab-pill px-3 py-1.5 text-xs font-semibold rounded-lg flex-center gap-1.5 border-none cursor-pointer ${activeTab === 'disclaimer' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('disclaimer')}
            style={{
              background: activeTab === 'disclaimer' ? '#2563EB' : 'transparent',
              color: activeTab === 'disclaimer' ? '#FFFFFF' : 'var(--text-muted, #64748B)',
              whiteSpace: 'nowrap'
            }}
          >
            <Shield size={13} /> डिस्क्लेमर (Govt)
          </button>

          <button
            type="button"
            className={`tab-pill px-3 py-1.5 text-xs font-semibold rounded-lg flex-center gap-1.5 border-none cursor-pointer ${activeTab === 'privacy' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('privacy')}
            style={{
              background: activeTab === 'privacy' ? '#2563EB' : 'transparent',
              color: activeTab === 'privacy' ? '#FFFFFF' : 'var(--text-muted, #64748B)',
              whiteSpace: 'nowrap'
            }}
          >
            <Lock size={13} /> प्राइवेसी पॉलिसी
          </button>

          <button
            type="button"
            className={`tab-pill px-3 py-1.5 text-xs font-semibold rounded-lg flex-center gap-1.5 border-none cursor-pointer ${activeTab === 'fairuse' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('fairuse')}
            style={{
              background: activeTab === 'fairuse' ? '#2563EB' : 'transparent',
              color: activeTab === 'fairuse' ? '#FFFFFF' : 'var(--text-muted, #64748B)',
              whiteSpace: 'nowrap'
            }}
          >
            <FileText size={13} /> फेयर यूज़ व DMCA
          </button>

          <button
            type="button"
            className={`tab-pill px-3 py-1.5 text-xs font-semibold rounded-lg flex-center gap-1.5 border-none cursor-pointer ${activeTab === 'delete' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('delete')}
            style={{
              background: activeTab === 'delete' ? '#DC2626' : 'transparent',
              color: activeTab === 'delete' ? '#FFFFFF' : 'var(--text-muted, #64748B)',
              whiteSpace: 'nowrap'
            }}
          >
            <Trash2 size={13} /> डेटा डिलीट
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div
          className="modal-body p-4"
          style={{
            overflowY: 'auto',
            maxHeight: 'calc(88vh - 125px)',
            fontSize: '13px',
            lineHeight: '1.6',
            color: 'var(--text-color, #334155)'
          }}
        >
          {/* TAB 1: GOVERNMENT DISCLAIMER & SOURCES */}
          {activeTab === 'disclaimer' && (
            <div className="tab-pane space-y-3">
              <div
                className="p-3 rounded-xl border"
                style={{ background: '#FEF3C7', borderColor: '#FCD34D', color: '#78350F' }}
              >
                <div className="flex-center-start gap-1.5 font-bold text-xs mb-1">
                  <AlertTriangle size={15} color="#92400E" />
                  आधिकारिक सरकारी डिस्क्लेमर (Non-Govt Entity Declaration)
                </div>
                <p className="text-2xs m-0 leading-relaxed">
                  <b>Vacancy Era Education (VEE) किसी भी सरकारी संस्था, मंत्रालय या विभाग का आधिकारिक ऐप नहीं है।</b> VEE एक स्वतंत्र निजी शैक्षिक मंच है जो छात्रों की सुविधा के लिए विभिन्न सरकारी पोर्टलों से सार्वजनिक सूचनाएँ एकत्रित करके दिखाता है।
                </p>
              </div>

              <h4 className="font-bold text-xs mt-3 mb-1 text-primary">🏛️ सूचना के मुख्य आधिकारिक सरकारी स्रोत:</h4>
              <p className="text-2xs text-muted m-0 mb-2">
                सभी सरकारी नौकरियों के विवरण नीचे दिए गए आधिकारिक सरकारी पोर्टलों से सीधे लिए जाते हैं:
              </p>

              <div className="space-y-1.5 text-2xs">
                <div className="p-2 rounded bg-light border flex-between">
                  <span><b>SSC (कर्मचारी चयन आयोग):</b> ssc.gov.in</span>
                  <a href="https://ssc.gov.in" target="_blank" rel="noopener noreferrer" className="text-accent flex-center gap-0.5">
                    Visit <ExternalLink size={10} />
                  </a>
                </div>
                <div className="p-2 rounded bg-light border flex-between">
                  <span><b>UPSC (संघ लोक सेवा आयोग):</b> upsc.gov.in</span>
                  <a href="https://upsc.gov.in" target="_blank" rel="noopener noreferrer" className="text-accent flex-center gap-0.5">
                    Visit <ExternalLink size={10} />
                  </a>
                </div>
                <div className="p-2 rounded bg-light border flex-between">
                  <span><b>भारतीय रेलवे (RRB / RRC):</b> rrbapply.gov.in</span>
                  <a href="https://www.rrbapply.gov.in" target="_blank" rel="noopener noreferrer" className="text-accent flex-center gap-0.5">
                    Visit <ExternalLink size={10} />
                  </a>
                </div>
                <div className="p-2 rounded bg-light border flex-between">
                  <span><b>बैंकिंग (IBPS / SBI / RBI):</b> ibps.in, sbi.co.in</span>
                  <a href="https://www.ibps.in" target="_blank" rel="noopener noreferrer" className="text-accent flex-center gap-0.5">
                    Visit <ExternalLink size={10} />
                  </a>
                </div>
                <div className="p-2 rounded bg-light border flex-between">
                  <span><b>रक्षा बल (Army, Navy, Air Force, CAPF):</b> joinindianarmy.nic.in, rect.crpf.gov.in</span>
                  <a href="https://joinindianarmy.nic.in" target="_blank" rel="noopener noreferrer" className="text-accent flex-center gap-0.5">
                    Visit <ExternalLink size={10} />
                  </a>
                </div>
                <div className="p-2 rounded bg-light border flex-between">
                  <span><b>राज्य आयोग (UP, Bihar, Rajasthan, MP):</b> upsssc.gov.in, bpsc.bih.nic.in, rpsc.rajasthan.gov.in</span>
                  <a href="https://upsssc.gov.in" target="_blank" rel="noopener noreferrer" className="text-accent flex-center gap-0.5">
                    Visit <ExternalLink size={10} />
                  </a>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-light border text-2xs text-muted mt-3">
                <b>छात्रों के लिए निर्देश:</b> किसी भी भर्ती का आवेदन करने से पहले संबंधित विभाग की आधिकारिक वेबसाइट से ओरिजिनल नोटिफिकेशन अवश्य पढ़ें। VEE कभी भी किसी सरकारी फॉर्म के लिए अलग से शुल्क नहीं लेता है।
              </div>

              <div className="pt-2 text-center">
                <a
                  href="/terms-and-disclaimer.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-accent font-semibold flex-center gap-1"
                >
                  पूरा विस्तृत नियम व डिस्क्लेमर वेबपेज पर देखें <ExternalLink size={12} />
                </a>
              </div>
            </div>
          )}

          {/* TAB 2: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="tab-pane space-y-3">
              <div className="p-3 rounded-xl border bg-light">
                <h4 className="font-bold text-xs m-0 mb-1 text-primary">🔒 उपयोगकर्ता डेटा व गोपनीयता नीति</h4>
                <p className="text-2xs text-muted m-0">
                  VEE उपयोगकर्ताओं की गोपनीयता का पूर्ण सम्मान करता है। हम कभी भी आपका व्यक्तिगत डेटा किसी तीसरे पक्ष को नहीं बेचते।
                </p>
              </div>

              <div className="space-y-2 text-2xs">
                <div>
                  <b>1. हम क्या जानकारी लेते हैं:</b>
                  <p className="text-muted m-0 mt-0.5">
                    छात्र का नाम, चुनी गई परीक्षा (जैसे SSC, रेलवे) और पसंदीदा राज्य। यह डेटा आपके मोबाइल के लोकल स्टोरेज में ही सुरक्षित रहता है।
                  </p>
                </div>
                <div>
                  <b>2. हम क्या जानकारी कभी नहीं लेते:</b>
                  <p className="text-muted m-0 mt-0.5">
                    हम आपके फोन के कॉन्टैक्ट्स, लोकेशन (GPS), कैमरा, कॉल लॉग्स, एसएमएस या बैंक डिटेल्स को कभी एक्सेस नहीं करते।
                  </p>
                </div>
                <div>
                  <b>3. Google AdMob विज्ञापन नीति:</b>
                  <p className="text-muted m-0 mt-0.5">
                    ऐप को सभी छात्रों के लिए निशुल्क रखने हेतु Google AdMob द्वारा गैर-अवरोधक विज्ञापन दिखाए जा सकते हैं। यह Google Play Families व Ads नीति के 100% अनुकूल है।
                  </p>
                </div>
                <div>
                  <b>4. सुरक्षा एवं एन्क्रिप्शन:</b>
                  <p className="text-muted m-0 mt-0.5">
                    ऐप का पूरा डेटा HTTPS एन्क्रिप्टेड सिक्योर कनेक्शन से ट्रांसफर होता है।
                  </p>
                </div>
              </div>

              <div className="pt-2 text-center">
                <a
                  href="/privacy-policy.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-accent font-semibold flex-center gap-1"
                >
                  आधिकारिक प्राइवेसी पॉलिसी (Google Play Console URL) खोलें <ExternalLink size={12} />
                </a>
              </div>
            </div>
          )}

          {/* TAB 3: FAIR USE & CONTENT TAKEDOWN (DMCA LEGAL SHIELD) */}
          {activeTab === 'fairuse' && (
            <div className="tab-pane space-y-3">
              <div
                className="p-3 rounded-xl border"
                style={{ background: '#EFF6FF', borderColor: '#BFDBFE', color: '#1E40AF' }}
              >
                <h4 className="font-bold text-xs m-0 mb-1">
                  🛡️ क़ानूनी सुरक्षा: फेयर डीलिंग (धारा 52, कॉपीराइट एक्ट) एवं सेफ हार्बर
                </h4>
                <p className="text-2xs m-0 leading-relaxed text-slate-700">
                  सरकारी नौकरियों, परीक्षाओं, तिथियों और सिलेबस की सूचना सार्वजनिक रिकॉर्ड (Public Domain) होती है। इसका शैक्षिक मार्गदर्शन हेतु उपयोग भारतीय कॉपीराइट अधिनियम, 1957 की धारा 52 के तहत पूरी तरह वैध "Fair Dealing" है।
                </p>
              </div>

              <div className="space-y-2 text-2xs">
                <div>
                  <b>1. सर्च इंडेक्सर की भूमिका:</b>
                  <p className="text-muted m-0 mt-0.5">
                    VEE एक शैक्षिक सर्च इंजन/न्यूज़ एग्रीगेटर के रूप में कार्य करता है। हम छात्रों को सीधे आधिकारिक वेबसाइट व ओरिजिनल पीडीएफ तक पहुँचाते हैं।
                  </p>
                </div>
                <div>
                  <b>2. ट्रेडमार्क एवं लोगो डिस्क्लेमर:</b>
                  <p className="text-muted m-0 mt-0.5">
                    सभी विभागों व समाचार पत्रों के ट्रेडमार्क व नाम उनके संबंधित स्वामियों के हैं। इनका उपयोग केवल भर्ती संस्था की पहचान हेतु (Nominative Fair Use) किया गया है।
                  </p>
                </div>
                <div>
                  <b>3. सामग्री निष्कासन नीति (Content Takedown Policy):</b>
                  <p className="text-muted m-0 mt-0.5">
                    यदि किसी वेबसाइट या प्रकाशक को किसी लिंक या सारांश पर आपत्ति है, तो वे सीधे हमारे ग्रीवेंस ऑफिसर को ई-मेल कर सकते हैं:
                  </p>
                  <p className="font-bold text-primary mt-1">
                    📧 ई-मेल: vacancyeraeducation@gmail.com
                  </p>
                  <p className="text-muted m-0">
                    हम बिना किसी विवाद के <b>36 से 48 घंटे</b> के भीतर उस सामग्री को ऐप से हटा देंगे।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ACCOUNT & DATA DELETION */}
          {activeTab === 'delete' && (
            <div className="tab-pane space-y-3">
              <div
                className="p-3 rounded-xl border"
                style={{ background: '#FEF2F2', borderColor: '#FECACA', color: '#991B1B' }}
              >
                <h4 className="font-bold text-xs m-0 mb-1 flex-center-start gap-1">
                  <Trash2 size={14} /> अपना डेटा व अकाउंट स्थायी रूप से हटाएं
                </h4>
                <p className="text-2xs m-0 leading-relaxed text-red-800">
                  Google Play Console की Data Safety नीति के अनुसार, आपको अपना डेटा किसी भी समय पूरी तरह डिलीट करने का पूरा अधिकार है।
                </p>
              </div>

              <p className="text-2xs text-muted m-0">
                नीचे दिए गए बटन पर क्लिक करने से आपके फोन में सहेजा गया आपका प्रोफाइल, सेव की गई नौकरियाँ (Bookmarks), और सभी स्थानीय सेटिंग्स तुरंत हमेशा के लिए हटा दी जाएँगी।
              </p>

              {isDeletedSuccess ? (
                <div className="p-3 rounded-lg bg-success text-white text-center font-bold text-xs flex-center gap-1.5">
                  <CheckCircle2 size={16} /> आपका सारा डेटा सफलतापूर्वक डिलीट कर दिया गया है!
                </div>
              ) : (
                <button
                  type="button"
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs flex-center gap-2 border-none cursor-pointer"
                  onClick={handleDeleteData}
                  style={{ background: '#DC2626', color: '#FFFFFF' }}
                >
                  <Trash2 size={15} /> मेरा सारा डेटा और प्रोफाइल अभी डिलीट करें
                </button>
              )}

              <p className="text-3xs text-muted text-center m-0 mt-2">
                क्लाउड से भी अकाउंट हटाने के लिए <b>vacancyeraeducation@gmail.com</b> पर "Delete Account" लिखकर भेजें। 48 घंटे में प्रक्रिया पूर्ण कर दी जाएगी।
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer p-2.5 border-top flex-between bg-light">
          <span className="text-3xs text-muted">
            🛡️ Vacancy Era Education (VEE) &bull; Verified Safe
          </span>
          <button
            type="button"
            className="btn-accent-xs font-bold px-3 py-1.5 rounded cursor-pointer border-none"
            onClick={onClose}
            style={{ background: '#2563EB', color: '#FFFFFF' }}
          >
            समझ गया (OK)
          </button>
        </div>
      </div>
    </div>
  );
}
