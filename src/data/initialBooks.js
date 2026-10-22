const now = new Date();
const hindiMonths = [
  'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
];
const currentMonth = hindiMonths[now.getMonth()];
const currentYear = now.getFullYear();

export const initialBooks = [
  // 1. Current Affairs 2026 (Auto-Updating to Active Month)
  {
    id: "b-speedy",
    title: `Speedy Current Affairs 2026 (${currentMonth} ताज़ा अंक व वार्षिकी)`,
    author: "Speedy Publication Team",
    category: "Current Affairs 2026",
    rating: 4.9,
    reviewsCount: 14800,
    format: "Paperback & Free PDF",
    pages: "240 Pages",
    price: "₹110",
    originalPrice: "₹140",
    discount: "21% OFF",
    badge: `ताज़ा अंक: ${currentMonth} ${currentYear} 🔥`,
    cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80",
    description: `${currentMonth} ${currentYear} तक का संपूर्ण अद्यतन वार्षिकांक। 2500+ वस्तुनिष्ठ वन-लाइनर प्रश्न, ताज़ा नियुक्तियां, पुरस्कार व खेल परिदृश्य।`,
    amazonUrl: `https://www.amazon.in/s?k=Speedy+Current+Affairs+${currentMonth}+${currentYear}`,
    flipkartUrl: `https://www.flipkart.com/search?q=Speedy+Current+Affairs+${currentMonth}+${currentYear}`,
    readUrl: "https://archive.org/details/speedy-current-affairs",
    tags: ["Current Affairs", "Speedy", "Bestseller"]
  },
  {
    id: "b-eduteria",
    title: `Eduteria Current Affairs 2026 (${currentMonth} स्पेशल - प्रवीण सर)`,
    author: "Pravin Kumar (Eduteria)",
    category: "Current Affairs 2026",
    rating: 4.8,
    reviewsCount: 9600,
    format: "Paperback & Free PDF",
    pages: "210 Pages",
    price: "₹130",
    originalPrice: "₹160",
    discount: "19% OFF",
    badge: `${currentMonth} टॉप चॉइस 🌟`,
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
    description: `${currentMonth} ${currentYear} तक का सर्वश्रेष्ठ मासिक संकलन। BPSC, Railway, SSC, Police व State Exams हेतु 10 मॉडल प्रैक्टिस सेट्स।`,
    amazonUrl: `https://www.amazon.in/s?k=Eduteria+Current+Affairs+${currentMonth}+${currentYear}`,
    flipkartUrl: `https://www.flipkart.com/search?q=Eduteria+Current+Affairs+${currentMonth}+${currentYear}`,
    readUrl: "https://eduterias.com/",
    tags: ["Current Affairs", "Eduteria", "Trending"]
  },

  // 2. General Knowledge (GK / GS)
  {
    id: "b-lucent",
    title: "Lucent Samanya Gyan 2026 (ल्यूसेंट सामान्य ज्ञान - हिंदी संस्करण)",
    author: "Dr. Binay Karna & Manwendra Mukul",
    category: "General Knowledge (GK/GS)",
    rating: 4.9,
    reviewsCount: 52000,
    format: "Paperback & Free PDF",
    pages: "410 Pages",
    price: "₹170",
    originalPrice: "₹220",
    discount: "23% OFF",
    badge: "#1 All India Bestseller 🏆",
    cover: "https://images.unsplash.com/photo-1532012164546-f432f2e37b29?auto=format&fit=crop&w=400&q=80",
    description: "भारत की सबसे लोकप्रिय सामान्य ज्ञान पुस्तक। इतिहास, भूगोल, भारतीय संविधान, अर्थव्यवस्था और सामान्य विज्ञान का पूरा निचोड़।",
    amazonUrl: "https://www.amazon.in/s?k=Lucent+Samanya+Gyan+2026",
    flipkartUrl: "https://www.flipkart.com/search?q=Lucent+Samanya+Gyan+2026",
    readUrl: "https://ssc.gov.in/",
    tags: ["Lucent", "GK", "Must Have"]
  },
  {
    id: "b-pinnacle",
    title: "Pinnacle SSC General Studies 6500+ TCS MCQ Solved Papers (3rd Ed)",
    author: "Pinnacle Exam Experts",
    category: "General Knowledge (GK/GS)",
    rating: 4.8,
    reviewsCount: 11200,
    format: "Paperback & E-Book",
    pages: "580 Pages",
    price: "₹380",
    originalPrice: "₹520",
    discount: "27% OFF",
    badge: "TCS Pattern Solved 🎯",
    cover: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80",
    description: "CGL, CHSL, MTS, CPO व Railway के लिए TCS द्वारा 2018-2026 तक पूछे गए सभी प्रश्नों का विषयवार और व्याख्यात्मक हल।",
    amazonUrl: "https://www.amazon.in/s?k=Pinnacle+SSC+General+Studies+6500",
    flipkartUrl: "https://www.flipkart.com/search?q=Pinnacle+SSC+General+Studies+6500",
    readUrl: "https://pinnacle.com/",
    tags: ["TCS", "SSC", "Railway"]
  },
  {
    id: "b-disha",
    title: "Disha 10000+ Objective General Knowledge 2026 (वस्तुनिष्ठ सामान्य ज्ञान)",
    author: "Disha Experts",
    category: "General Knowledge (GK/GS)",
    rating: 4.7,
    reviewsCount: 7400,
    format: "Paperback & Sample",
    pages: "640 Pages",
    price: "₹335",
    originalPrice: "₹495",
    discount: "32% OFF",
    badge: "Flipkart Choice ⚡",
    cover: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=400&q=80",
    description: "UPSC, State PSC, SSC, Police व Railway परीक्षाओं के विगत वर्षों के 10,000 से अधिक महत्वपूर्ण प्रश्नों का वर्गीकरण।",
    amazonUrl: "https://www.amazon.in/s?k=Disha+10000+Objective+General+Knowledge",
    flipkartUrl: "https://www.flipkart.com/search?q=Disha+10000+Objective+General+Knowledge",
    readUrl: "https://disha.in/",
    tags: ["Disha", "Objective GK"]
  },

  // 3. Technical & ITI Trades
  {
    id: "b-rukmini-iti",
    title: "Rukmini Platform ITI Trade Theory Fitter & Electrician Master Guide",
    author: "The Platform / Rukmini Prakashan",
    category: "Technical / ITI",
    rating: 4.8,
    reviewsCount: 8200,
    format: "Paperback & Free PDF",
    pages: "310 Pages",
    price: "₹195",
    originalPrice: "₹260",
    discount: "25% OFF",
    badge: "ITI Aspirants Favorite 🛠️",
    cover: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80",
    description: "Railway ALP/Technician, BHEL, DRDO, ISRO और बिजली विभाग के लिए NIMI NCVT/SCVT पैटर्न पर आधारित पूरी थ्योरी व प्रश्न।",
    amazonUrl: "https://www.amazon.in/s?k=Rukmini+ITI+Trade+Theory",
    flipkartUrl: "https://www.flipkart.com/search?q=Rukmini+ITI+Trade+Theory",
    readUrl: "https://dgt.gov.in/e-books",
    tags: ["ITI Fitter", "Electrician", "ALP"]
  },

  // 4. Mathematics & Reasoning
  {
    id: "b-rs-aggarwal",
    title: "R.S. Aggarwal Naveen Ankganit 2026 (नवीन अंकगणित - पूर्ण हल सहित)",
    author: "Dr. R.S. Aggarwal (S. Chand)",
    category: "Math & Aptitude",
    rating: 4.9,
    reviewsCount: 38000,
    format: "Paperback",
    pages: "860 Pages",
    price: "₹415",
    originalPrice: "₹599",
    discount: "31% OFF",
    badge: "Gold Standard Math 📐",
    cover: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400&q=80",
    description: "प्रतिशत, लाभ-हानि, समय-काम, साधारण व चक्रवृद्धि ब्याज, ज्यामिति, बीजगणित और सांख्यिकी का सबसे संपूर्ण गाइड।",
    amazonUrl: "https://www.amazon.in/s?k=RS+Aggarwal+Naveen+Ankganit",
    flipkartUrl: "https://www.flipkart.com/search?q=RS+Aggarwal+Naveen+Ankganit",
    readUrl: "https://schandpublishing.com/",
    tags: ["Math", "Quantitative Aptitude"]
  },

  // 5. Railways Special
  {
    id: "b-yct-railway",
    title: "YCT Youth Railway ALP, Technician & NTPC Chapterwise Solved Papers",
    author: "Youth Competition Times",
    category: "Railways",
    rating: 4.8,
    reviewsCount: 9100,
    format: "Paperback & Free PDF",
    pages: "420 Pages",
    price: "₹240",
    originalPrice: "₹320",
    discount: "25% OFF",
    badge: "Railway Special 🚆",
    cover: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=400&q=80",
    description: "RRB CBT-1 व CBT-2 के पिछले 32 प्रश्नपत्रों का प्रामाणिक अध्यायवार हल, कट-ऑफ विश्लेषण और शॉर्ट ट्रिक्स।",
    amazonUrl: "https://www.amazon.in/s?k=YCT+Railway+ALP+Technician",
    flipkartUrl: "https://www.flipkart.com/search?q=YCT+Railway+ALP+Technician",
    readUrl: "https://www.rrbapply.gov.in/",
    tags: ["Railway", "RRB ALP", "YCT"]
  }
];

export const initialMocks = [
  // Test 1: Daily Current Affairs & GK 2026 Free Mock Test
  {
    id: "mock-ca-2026",
    title: "⚡ Daily Current Affairs (Drishti IAS & GKToday Edition) 2026 Mock Test",
    totalQuestions: 10,
    durationMinutes: 10,
    attempts: "114.2K Aspirants",
    difficulty: "Official Pattern",
    category: "Current Affairs",
    badge: "100% FREE",
    questions: [
      {
        id: "ca-1",
        question: "हाल ही में भारत के 51वें मुख्य न्यायाधीश (Chief Justice of India - CJI) के रूप में किसने शपथ ली?",
        options: ["न्यायमूर्ति संजीव खन्ना (Justice Sanjiv Khanna)", "न्यायमूर्ति डी. वाई. चंद्रचूड़", "न्यायमूर्ति यू. यू. ललित", "न्यायमूर्ति बी. आर. गवई"],
        correctIndex: 0,
        explanation: "न्यायमूर्ति संजीव खन्ना ने भारत के 51वें मुख्य न्यायाधीश के रूप में शपथ ली। उनका कार्यकाल मई 2025 तक रहेगा।"
      },
      {
        id: "ca-2",
        question: "भारत का पहला पूर्णतः स्वदेशी वाणिज्यिक सेमीकंडक्टर फैब्रिकेशन (Fab) प्लांट किस राज्य में स्थापित हो रहा है?",
        options: ["धोलेरा, गुजरात", "नोएडा, उत्तर प्रदेश", "बेंगलुरु, कर्नाटक", "हैदराबाद, तेलंगाना"],
        correctIndex: 0,
        explanation: "टाटा इलेक्ट्रॉनिक्स और ताइवान की PSMC कंपनी मिलकर गुजरात के धोलेरा में ₹91,000 करोड़ की लागत से पहला सेमीकंडक्टर प्लांट बना रही है।"
      },
      {
        id: "ca-3",
        question: "हाल ही में 'समान नागरिक संहिता' (Uniform Civil Code - UCC) लागू करने वाला आज़ादी के बाद भारत का पहला राज्य कौन सा बना?",
        options: ["उत्तराखंड", "राजस्थान", "मध्य प्रदेश", "असम"],
        correctIndex: 0,
        explanation: "उत्तराखंड विधानसभा ने यूसीसी विधेयक पारित किया और राष्ट्रपति की मंजूरी के बाद इसे लागू करने वाला आज़ादी के बाद पहला राज्य बना।"
      },
      {
        id: "ca-4",
        question: "'पीएम सूर्य घर मुफ्त बिजली योजना' के अंतर्गत पात्र परिवारों को प्रतिमाह कितनी यूनिट तक मुफ्त बिजली देने का लक्ष्य है?",
        options: ["100 यूनिट", "200 यूनिट", "300 यूनिट", "500 यूनिट"],
        correctIndex: 2,
        explanation: "पीएम सूर्य घर मुफ्त बिजली योजना के तहत 1 करोड़ घरों की छतों पर सोलर पैनल लगाकर प्रतिमाह 300 यूनिट तक मुफ्त बिजली दी जा रही है।"
      },
      {
        id: "ca-5",
        question: "इसरो (ISRO) के आगामी 'चंद्रयान-4' मिशन का मुख्य वैज्ञानिक उद्देश्य क्या है?",
        options: ["चंद्रमा के दक्षिणी ध्रुव से मिट्टी के नमूने पृथ्वी पर वापस लाना (Lunar Sample Return)", "मानव को चंद्रमा पर उतारना", "चंद्रमा पर पानी की खोज करना", "चंद्रमा का चक्कर लगाना"],
        correctIndex: 0,
        explanation: "चंद्रयान-4 एक सैंपल-रिटर्न मिशन है, जो चंद्रमा की सतह पर उतरकर वहां से मिट्टी/चट्टान के नमूने एकत्र कर सुरक्षित रूप से पृथ्वी पर वापस लाएगा।"
      },
      {
        id: "ca-6",
        question: "भारत का पहला 'AI शहर' (Artificial Intelligence City) किस शहर में विकसित किया जा रहा है?",
        options: ["लखनऊ (उत्तर प्रदेश)", "पुणे (महाराष्ट्र)", "गुरुग्राम (हरियाणा)", "कोच्चि (केरल)"],
        correctIndex: 0,
        explanation: "उत्तर प्रदेश सरकार लखनऊ को भारत के पहले एआई सिटी (AI City) के रूप में विकसित कर रही है।"
      },
      {
        id: "ca-7",
        question: "अंतर्राष्ट्रीय सौर गठबंधन (International Solar Alliance - ISA) का मुख्यालय भारत के किस शहर में स्थित है?",
        options: ["गुरुग्राम (हरियाणा)", "नई दिल्ली", "अहमदाबाद", "चेन्नई"],
        correctIndex: 0,
        explanation: "ISA का मुख्यालय गुरुग्राम (हरियाणा), भारत में स्थित है। यह भारत और फ्रांस द्वारा शुरू की गई एक वैश्विक पहल है।"
      },
      {
        id: "ca-8",
        question: "भारत रत्न 2024-2026 में मरणोपरांत सम्मानित 'कर्पूरी ठाकुर' किस राज्य के पूर्व मुख्यमंत्री थे?",
        options: ["बिहार", "उत्तर प्रदेश", "मध्य प्रदेश", "झारखंड"],
        correctIndex: 0,
        explanation: "जननायक कर्पूरी ठाकुर बिहार के दो बार मुख्यमंत्री रहे और सामाजिक न्याय के पुरोधा माने जाते हैं।"
      },
      {
        id: "ca-9",
        question: "भारत के 2026-2027 बजट में युवाओं और रोजगार के लिए घोषित 'पीएम इंटर्नशिप योजना' में शीर्ष कितनी कंपनियों को शामिल किया गया है?",
        options: ["शीर्ष 500 कंपनियां (Top 500 Companies)", "शीर्ष 100 कंपनियां", "शीर्ष 250 कंपनियां", "शीर्ष 1000 कंपनियां"],
        correctIndex: 0,
        explanation: "पीएम इंटर्नशिप योजना के तहत भारत की शीर्ष 500 कॉर्पोरेट कंपनियों में युवाओं को ₹5,000 प्रतिमाह भत्ते के साथ 12 महीने की इंटर्नशिप दी जा रही है।"
      },
      {
        id: "ca-10",
        question: "2026 टी-20 पुरुष क्रिकेट विश्व कप (ICC Men's T20 World Cup 2026) की संयुक्त मेजबानी कौन से दो देश करेंगे?",
        options: ["भारत और श्रीलंका", "ऑस्ट्रेलिया और न्यूजीलैंड", "इंग्लैंड और आयरलैंड", "साउथ अफ्रीका और जिम्बाब्वे"],
        correctIndex: 0,
        explanation: "आईसीसी टी20 वर्ल्ड कप 2026 का आयोजन भारत और श्रीलंका द्वारा संयुक्त रूप से किया जाएगा।"
      }
    ]
  },

  // Test 2: Railway RRB ALP, Technician & Group D Science & GK 2026
  {
    id: "mock-rrb-science",
    title: "🚆 Railway RRB ALP, Technician & Group D Science & GK Real Mock Test",
    totalQuestions: 10,
    durationMinutes: 10,
    attempts: "89.1K Aspirants",
    difficulty: "Railway Standard",
    category: "Railways",
    badge: "100% FREE",
    questions: [
      {
        id: "rrb-1",
        question: "प्रकाश वर्ष (Light Year) निम्नलिखित में से किसका मात्रक है?",
        options: ["दूरी का (Distance)", "समय का", "प्रकाश की तीव्रता का", "चाल का"],
        correctIndex: 0,
        explanation: "प्रकाश वर्ष दूरी का मात्रक है। 1 प्रकाश वर्ष = लगभग 9.46 × 10^15 मीटर होता है।"
      },
      {
        id: "rrb-2",
        question: "निकट दृष्टि दोष (Myopia) को ठीक करने के लिए किस प्रकार के लेंस का चश्मा प्रयोग किया जाता है?",
        options: ["अवतल लेंस (Concave Lens)", "उत्तल लेंस (Convex Lens)", "द्वि-फोकल लेंस", "बेलनाकार लेंस"],
        correctIndex: 0,
        explanation: "मायोपिया में दूर की वस्तुएं स्पष्ट नहीं दिखतीं, इसे ठीक करने के लिए अवतल लेंस (Concave Lens) का उपयोग किया जाता है।"
      },
      {
        id: "rrb-3",
        question: "ध्वनि की चाल (Speed of Sound) सर्वाधिक किस माध्यम में होती है?",
        options: ["ठोस में (इस्पात/स्टील)", "जल में", "वायु में", "निर्वात में"],
        correctIndex: 0,
        explanation: "ध्वनि को संचरण के लिए माध्यम चाहिए। ठोस पदार्थों में ध्वनि की चाल सर्वाधिक (स्टील में ~5000 m/s) होती है। निर्वात में ध्वनि नहीं चल सकती।"
      },
      {
        id: "rrb-4",
        question: "भारतीय रेलवे में ट्रेनों की आपस में टक्कर रोकने के लिए स्वदेशी रूप से विकसित स्वचालित सुरक्षा प्रणाली का क्या नाम है?",
        options: ["कवच (KAVACH)", "सुरक्षा (SURAKSHA)", "त्रिनेत्र (TRINETRA)", "वज्र (VAJRA)"],
        correctIndex: 0,
        explanation: "'कवच' (Kavach) भारतीय रेलवे द्वारा विकसित ऑटोमैटिक ट्रेन प्रोटेक्शन (ATP) प्रणाली है जो सिग्नल पार करने या एक ही ट्रैक पर आमने-सामने आने पर ट्रेन रोक देती है।"
      },
      {
        id: "rrb-5",
        question: "मानव शरीर के सामान्य स्वस्थ रक्त का pH मान (pH Value) कितना होता है?",
        options: ["7.4 (हल्का क्षारीय)", "6.5 (हल्का अम्लीय)", "8.2", "7.0 (उदासीन)"],
        correctIndex: 0,
        explanation: "मानव रक्त का सामान्य pH मान 7.35 से 7.45 के बीच (औसतन 7.4) होता है, जो हल्का क्षारीय (Slightly Alkaline) होता है।"
      },
      {
        id: "rrb-6",
        question: "कार्य (Work) और ऊर्जा (Energy) का SI मात्रक क्या होता है?",
        options: ["जूल (Joule)", "वाट (Watt)", "न्यूटन (Newton)", "पास्कल (Pascal)"],
        correctIndex: 0,
        explanation: "कार्य और ऊर्जा दोनों का SI मात्रक 'जूल' (Joule) होता है। शक्ति का मात्रक वाट और बल का मात्रक न्यूटन होता है।"
      },
      {
        id: "rrb-7",
        question: "ट्रांसफार्मर (Transformer) किस सिद्धांत पर कार्य करता है?",
        options: ["अन्योन्य प्रेरण (Mutual Induction)", "स्व-प्रेरण (Self Induction)", "जूल के ऊष्मीय प्रभाव", "कूलॉम के नियम"],
        correctIndex: 0,
        explanation: "ट्रांसफार्मर फैराडे के विद्युत चुम्बकीय प्रेरण के अंतर्गत 'अन्योन्य प्रेरण' (Mutual Induction) के सिद्धांत पर केवल AC सप्लाई पर काम करता है।"
      },
      {
        id: "rrb-8",
        question: "आवर्त सारणी (Modern Periodic Table) का प्रतिपादन किसने किया था?",
        options: ["हेनरी मोसले (Henry Moseley)", "दिमित्री मेंडलीव", "जॉन डाल्टन", "रदरफोर्ड"],
        correctIndex: 0,
        explanation: "आधुनिक आवर्त सारणी 1913 में हेनरी मोसले द्वारा परमाणु क्रमांक (Atomic Number) के आधार पर व्यवस्थित की गई थी।"
      },
      {
        id: "rrb-9",
        question: "भारत का पहला 3D प्रिंटेड रेलवे स्टेशन/पोस्ट ऑफिस कहाँ स्थापित किया गया?",
        options: ["बेंगलुरु (कर्नाटक)", "हैदराबाद", "अहमदाबाद", "पुणे"],
        correctIndex: 0,
        explanation: "लार्सन एंड टुब्रो (L&T) और IIT मद्रास के सहयोग से भारत का पहला 3D प्रिंटेड डाकघर बेंगलुरु के कैम्ब्रिज लेआउट में मात्र 43 दिनों में बनाया गया।"
      },
      {
        id: "rrb-10",
        question: "न्यूटन के किस गति नियम से 'बल की परिभाषा व सूत्र F = m × a' प्राप्त होता है?",
        options: ["द्वितीय नियम (Second Law of Motion)", "प्रथम नियम", "तृतीय नियम", "गुरुत्वाकर्षण नियम"],
        correctIndex: 0,
        explanation: "न्यूटन का दूसरा नियम (संवेग परिवर्तन की दर बल के समानुपाती होती है) से F = m × a प्राप्त होता है।"
      }
    ]
  },

  // Test 3: ITI Fitter & Electrician Trade Theory NCVT Test
  {
    id: "mock-iti-technical",
    title: "🛠️ ITI Fitter, Electrician & Technical Trades Official Pattern Test",
    totalQuestions: 10,
    durationMinutes: 10,
    attempts: "76.5K Aspirants",
    difficulty: "Technical NCVT",
    category: "Technical / ITI",
    badge: "100% FREE",
    questions: [
      {
        id: "iti-1",
        question: "मीट्रिक वर्नियर कैलिपर (Metric Vernier Caliper) का अल्पतमांक (Least Count) कितना होता है?",
        options: ["0.02 mm", "0.01 mm", "0.1 mm", "0.001 mm"],
        correctIndex: 0,
        explanation: "मीट्रिक वर्नियर कैलिपर का लीस्ट काउंट 0.02 मिमी होता है, जबकि माइक्रोमीटर का 0.01 मिमी होता है।"
      },
      {
        id: "iti-2",
        question: "विद्युत हीटर, गीज़र और प्रेस का हीटिंग एलिमेंट किस मिश्रधातु का बना होता है?",
        options: ["नाइक्रोम (Nichrome)", "टंगस्टन (Tungsten)", "तांबा (Copper)", "पीतल (Brass)"],
        correctIndex: 0,
        explanation: "नाइक्रोम (80% निकेल + 20% क्रोमियम) का उच्च प्रतिरोध और उच्च गलनांक होने के कारण हीटिंग एलिमेंट में उपयोग होता है।"
      },
      {
        id: "iti-3",
        question: "विद्युत आग (Class E / Electrical Fire) बुझाने के लिए किस प्रकार के अग्निशामक (Fire Extinguisher) का प्रयोग कभी नहीं करना चाहिए?",
        options: ["पानी और सोडा एसिड (Water)", "सीटीसी (CTC / Halon)", "कार्बन डाइऑक्साइड (CO2)", "ड्राई पाउडर"],
        correctIndex: 0,
        explanation: "बिजली की आग पर पानी डालने से बिजली का झटका (Electric Shock) लगने का भारी खतरा होता है। इसके लिए CTC या CO2 प्रयोग होता है।"
      },
      {
        id: "iti-4",
        question: "घरेलू विद्युत वायरिंग में सभी उपकरण (पंखे, बल्ब, सॉकेट) किस क्रम में जोड़े जाते हैं?",
        options: ["समानांतर क्रम में (Parallel Connection)", "श्रेणी क्रम में (Series Connection)", "मिश्रित क्रम में", "रैंडम क्रम में"],
        correctIndex: 0,
        explanation: "समानांतर क्रम (Parallel) में जोड़ने से सभी उपकरणों को समान 230V वोल्टेज मिलती है और एक उपकरण बंद होने पर दूसरा चालू रहता है।"
      },
      {
        id: "iti-5",
        question: "इलेक्ट्रिक फ्यूज तार (Fuse Wire) की क्या विशेषता होनी चाहिए?",
        options: ["निम्न गलनांक और उच्च प्रतिरोध (Low Melting Point)", "उच्च गलनांक और निम्न प्रतिरोध", "उच्च गलनांक और उच्च चालकता", "बहुत मोटा तार"],
        correctIndex: 0,
        explanation: "शॉर्ट सर्किट या ओवरलोड होने पर फ्यूज जल्दी पिघलकर परिपथ को सुरक्षित कर दे, इसलिए इसका गलनांक निम्न (Low Melting Point) होना चाहिए।"
      },
      {
        id: "iti-6",
        question: "फिटर ट्रेड: हेक्सा फ्रेम (Hacksaw Frame) में ब्लेड की लंबाई कहाँ से नापी जाती है?",
        options: ["दोनों पिन होल्स के सेंटर से सेंटर की दूरी", "ब्लेड के एक सिरे से दूसरे सिरे तक", "काटने वाले दांतों की लंबाई", "फ्रेम की मोटाई"],
        correctIndex: 0,
        explanation: "हेक्सा ब्लेड की मानक लंबाई दोनों सिरों पर बने पिन होलों के केंद्रों के बीच की दूरी से मापी जाती है (आमतौर पर 250 mm या 300 mm)।"
      },
      {
        id: "iti-7",
        question: "शुद्ध जल (Pure Distilled Water) विद्युत का क्या होता है?",
        options: ["विद्युत का कुचालक (Bad Conductor / Insulator)", "उत्कृष्ट सुचालक", "अर्धचालक", "अतिचालक"],
        correctIndex: 0,
        explanation: "शुद्ध आसुत जल में कोई मुक्त आयन (Ions) नहीं होते, इसलिए यह विद्युत का कुचालक होता है। नमक या अशुद्धि मिलाने पर यह सुचालक बनता है।"
      },
      {
        id: "iti-8",
        question: "ओहम के नियम (Ohm's Law) के अनुसार वोल्टेज, करंट और प्रतिरोध के बीच क्या संबंध है?",
        options: ["V = I × R", "I = V × R", "R = V × I", "V = I / R"],
        correctIndex: 0,
        explanation: "ओहम का नियम: V = I × R, जहाँ V = वोल्टेज (Volt), I = करंट (Ampere), और R = प्रतिरोध (Ohm) है।"
      },
      {
        id: "iti-9",
        question: "वर्कशॉप में रेती (File) किस धातु की बनाई जाती है?",
        options: ["उच्च कार्बन इस्पात (High Carbon Steel)", "ढलवा लोहा (Cast Iron)", "हल्का इस्पात (Mild Steel)", "एल्युमिनियम"],
        correctIndex: 0,
        explanation: "रेती (File) हाई कार्बन स्टील या हाई ग्रेड टूल स्टील की बनाई जाती है और इसके काटने वाले दांतों को हार्ड और टेम्पर किया जाता है।"
      },
      {
        id: "iti-10",
        question: "लेड-एसिड बैटरी (Lead Acid Battery) में इलेक्ट्रोलाइट के रूप में कौन सा रासायनिक घोल उपयोग होता है?",
        options: ["तनु सल्फ्यूरिक अम्ल (Dilute H2SO4)", "हाइड्रोक्लोरिक अम्ल (HCl)", "नाइट्रिक अम्ल (HNO3)", "सोडियम हाइड्रोक्साइड"],
        correctIndex: 0,
        explanation: "लेड एसिड स्टोरेज बैटरी में तनु सल्फ्यूरिक अम्ल (H2SO4) और आसुत जल का अनुपात (~1:3) इलेक्ट्रोलाइट के रूप में प्रयोग होता है।"
      }
    ]
  },

  // Test 4: SSC GD Constable & Police Bharti Full Mock Test
  {
    id: "mock-ssc-gd",
    title: "👮 SSC GD Constable & State Police Bharti Complete 10-Question Test",
    totalQuestions: 10,
    durationMinutes: 10,
    attempts: "135.8K Aspirants",
    difficulty: "Police Standard",
    category: "SSC & Police",
    badge: "100% FREE",
    questions: [
      {
        id: "ssc-1",
        question: "भारतीय संविधान की किस अनुसूची (Schedule) में 22 आधिकारिक भाषाओं का उल्लेख किया गया है?",
        options: ["8वीं अनुसूची (8th Schedule)", "7वीं अनुसूची", "9वीं अनुसूची", "11वीं अनुसूची"],
        correctIndex: 0,
        explanation: "भारतीय संविधान की 8वीं अनुसूची में वर्तमान में 22 मान्यता प्राप्त आधिकारिक भाषाओं का उल्लेख है।"
      },
      {
        id: "ssc-2",
        question: "भारत का राष्ट्रीय आदर्श वाक्य 'सत्यमेव जयते' किस प्राचीन उपनिषद से लिया गया है?",
        options: ["मुण्डकोपनिषद (Mundaka Upanishad)", "कठोपनिषद", "छांदोग्य उपनिषद", "केन उपनिषद"],
        correctIndex: 0,
        explanation: "'सत्यमेव जयते' मुण्डकोपनिषद से लिया गया है, जिसका अर्थ है 'सत्य की ही सदा विजय होती है'।"
      },
      {
        id: "ssc-3",
        question: "भारतीय रिज़र्व बैंक (Reserve Bank of India - RBI) की स्थापना किस वर्ष हुई थी?",
        options: ["1 अप्रैल 1935", "15 अगस्त 1947", "26 जनवरी 1950", "1 जनवरी 1949"],
        correctIndex: 0,
        explanation: "आरबीआई की स्थापना 1 अप्रैल 1935 को हिल्टन यंग कमीशन की सिफारिशों पर आरबीआई एक्ट 1934 के तहत हुई थी।"
      },
      {
        id: "ssc-4",
        question: "हिंदी व्याकरण: निम्नलिखित में से 'अमृत' शब्द का सही पर्यायवाची शब्द कौन सा है?",
        options: ["सुधा / पीयूष", "पावक / अनल", "वारिद / तोयद", "मृगांक / शशांक"],
        correctIndex: 0,
        explanation: "'अमृत' के पर्यायवाची सुधा, पीयूष, सोम और अमी हैं। पावक आग का और वारिद बादल का पर्यायवाची है।"
      },
      {
        id: "ssc-5",
        question: "नीति आयोग (NITI Aayog) के पदेन अध्यक्ष (Ex-officio Chairperson) कौन होते हैं?",
        options: ["भारत के प्रधानमंत्री", "भारत के वित्त मंत्री", "राष्ट्रपति", "आरबीआई गवर्नर"],
        correctIndex: 0,
        explanation: "1 जनवरी 2015 को योजना आयोग के स्थान पर बने नीति आयोग के पदेन अध्यक्ष भारत के प्रधानमंत्री होते हैं।"
      },
      {
        id: "ssc-6",
        question: "पानीपत का ऐतिहासिक तृतीय युद्ध (Third Battle of Panipat) किस वर्ष लड़ा गया था?",
        options: ["1761 ईस्वी", "1526 ईस्वी", "1556 ईस्वी", "1757 ईस्वी"],
        correctIndex: 0,
        explanation: "पानीपत का तीसरा युद्ध 14 जनवरी 1761 को अहमद शाह अब्दाली और मराठा सेनापति सदाशिवराव भाऊ के बीच हुआ था।"
      },
      {
        id: "ssc-7",
        question: "भारत के संविधान में नागरिकों के 'मौलिक अधिकार' (Fundamental Rights) किस भाग में वर्णित हैं?",
        options: ["भाग 3 (अनुच्छेद 12 से 35)", "भाग 4 (DPSP)", "भाग 2 (नागरिकता)", "भाग 4A (कर्तव्य)"],
        correctIndex: 0,
        explanation: "संविधान के भाग 3 को 'भारत का मैग्ना कार्टा' कहा जाता है, जिसमें अनुच्छेद 12 से 35 तक मौलिक अधिकार दिए गए हैं।"
      },
      {
        id: "ssc-8",
        question: "विश्व का सबसे बड़ा मैंग्रोव वन 'सुंदरबन राष्ट्रीय उद्यान' भारत के किस राज्य में स्थित है?",
        options: ["पश्चिम बंगाल", "ओडिशा", "असम", "गुजरात"],
        correctIndex: 0,
        explanation: "सुंदरबन पश्चिम बंगाल में गंगा-ब्रह्मपुत्र डेल्टा पर स्थित है और यह रॉयल बंगाल टाइगर के लिए विश्व विख्यात है।"
      },
      {
        id: "ssc-9",
        question: "स्वतंत्र भारत के प्रथम गृह मंत्री और उप-प्रधानमंत्री कौन थे, जिन्हें 'लौह पुरुष' कहा जाता है?",
        options: ["सरदार वल्लभभाई पटेल", "डॉ. राजेंद्र प्रसाद", "मौलाना अबुल कलाम आजाद", "पंडित जवाहरलाल नेहरू"],
        correctIndex: 0,
        explanation: "सरदार वल्लभभाई पटेल ने 562 से अधिक देशी रियासतों का एकीकरण कर अखंड भारत का निर्माण किया था।"
      },
      {
        id: "ssc-10",
        question: "एसएससी जीडी कांस्टेबल शारीरिक परीक्षा (Physical Test) में पुरुष अभ्यर्थियों के लिए दौड़ का मानक क्या है?",
        options: ["24 मिनट में 5 किलोमीटर", "6.5 मिनट में 1.6 किलोमीटर", "30 मिनट में 5 किलोमीटर", "10 मिनट में 2 किलोमीटर"],
        correctIndex: 0,
        explanation: "एसएससी जीडी पुरुष उम्मीदवारों को 24 मिनट में 5 किलोमीटर की दौड़ सफलतापूर्वक पूरी करनी होती है।"
      }
    ]
  },

  // Test 5: All-India General Knowledge & Indian Constitution (Jagran Josh & GKToday Special)
  {
    id: "mock-jagran-gk",
    title: "🏛️ General Knowledge (GK/GS) & Indian Constitution (Jagran Josh & GKToday Special)",
    totalQuestions: 10,
    durationMinutes: 10,
    attempts: "98.4K Aspirants",
    difficulty: "All-India Standard",
    category: "General Knowledge",
    badge: "100% FREE",
    questions: [
      {
        id: "gk-1",
        question: "भारतीय संविधान का 'अनुच्छेद 21' (Article 21) नागरिकों को कौन सा मौलिक अधिकार प्रदान करता है?",
        options: ["प्राण और दैहिक स्वतंत्रता का संरक्षण (Right to Life & Personal Liberty)", "समानता का अधिकार", "धार्मिक स्वतंत्रता का अधिकार", "अस्पृश्यता का अंत"],
        correctIndex: 0,
        explanation: "अनुच्छेद 21 जीवन और व्यक्तिगत स्वतंत्रता के अधिकार की गारंटी देता है, जिसे आपातकाल के दौरान भी निलंबित नहीं किया जा सकता।"
      },
      {
        id: "gk-2",
        question: "ध्वज संहिता (Flag Code of India) के अनुसार, भारतीय राष्ट्रीय ध्वज का लंबाई और चौड़ाई का अनुपात (Ratio) कितना होना चाहिए?",
        options: ["3 : 2", "2 : 3", "4 : 3", "5 : 3"],
        correctIndex: 0,
        explanation: "भारतीय ध्वज संहिता के अनुसार राष्ट्रीय ध्वज की लंबाई और ऊंचाई/चौड़ाई का अनुपात 3:2 होना चाहिए।"
      },
      {
        id: "gk-3",
        question: "भारत की सबसे लंबी स्थलीय अंतरराष्ट्रीय सीमा किस पड़ोसी देश के साथ लगती है?",
        options: ["बांग्लादेश (4,096.7 किमी)", "चीन", "पाकिस्तान", "नेपाल"],
        correctIndex: 0,
        explanation: "भारत की सबसे लंबी अंतरराष्ट्रीय सीमा बांग्लादेश के साथ 4,096.7 किलोमीटर लगती है, जो 5 राज्यों (असम, मेघालय, त्रिपुरा, मिजोरम, प. बंगाल) से होकर गुजरती है।"
      },
      {
        id: "gk-4",
        question: "कंप्यूटर में प्रयुक्त 'IC Chip' (Integrated Circuit) प्रायः किस अर्धचालक तत्व से बनाई जाती है?",
        options: ["सिलिकॉन (Silicon)", "तांबा (Copper)", "सीसा (Lead)", "सोना (Gold)"],
        correctIndex: 0,
        explanation: "इंटीग्रेटेड सर्किट (IC Chips) सिलिकॉन (Si) नामक सेमीकंडक्टर धातु से निर्मित होती हैं।"
      },
      {
        id: "gk-5",
        question: "भारत के किस राज्य को 'टाइगर स्टेट' (Tiger State of India) के नाम से जाना जाता है?",
        options: ["मध्य प्रदेश", "कर्नाटक", "उत्तराखंड", "राजस्थान"],
        correctIndex: 0,
        explanation: "राष्ट्रीय बाघ गणना के अनुसार मध्य प्रदेश में देश में सर्वाधिक बाघ (785) पाए जाते हैं, इसलिए इसे टाइगर स्टेट कहा जाता है।"
      },
      {
        id: "gk-6",
        question: "भारतीय संविधान सभा की प्रारूप समिति (Drafting Committee) के अध्यक्ष कौन थे?",
        options: ["डॉ. भीमराव रामजी अंबेडकर", "डॉ. राजेंद्र प्रसाद", "जवाहरलाल नेहरू", "सरदार पटेल"],
        correctIndex: 0,
        explanation: "29 अगस्त 1947 को गठित 7 सदस्यीय प्रारूप समिति के अध्यक्ष बाबासाहेब डॉ. बी.आर. अंबेडकर थे।"
      },
      {
        id: "gk-7",
        question: "मानव शरीर की सबसे बड़ी ग्रंथि (Largest Gland) कौन सी होती है?",
        options: ["यकृत (Liver)", "अग्न्याशय (Pancreas)", "थायरॉयड (Thyroid)", "पिट्यूटरी (Pituitary)"],
        correctIndex: 0,
        explanation: "मानव शरीर की सबसे बड़ी ग्रंथि यकृत (Liver) है, जिसका भार लगभग 1.5 से 2 किलोग्राम होता है और यह पित्त रस का स्राव करती है।"
      },
      {
        id: "gk-8",
        question: "विटामिन 'C' का रासायनिक नाम (Chemical Name) क्या होता है?",
        options: ["एस्कॉर्बिक एसिड (Ascorbic Acid)", "रेटिनॉल", "थायमिन", "टोकोफेरोल"],
        correctIndex: 0,
        explanation: "विटामिन सी का रासायनिक नाम एस्कॉर्बिक एसिड है। इसकी कमी से स्कर्वी (मसूड़ों से खून आना) रोग होता है।"
      },
      {
        id: "gk-9",
        question: "कर्क रेखा (Tropic of Cancer - 23.5° N) भारत के कितने राज्यों से होकर गुजरती है?",
        options: ["8 राज्यों से", "6 राज्यों से", "7 राज्यों से", "9 राज्यों से"],
        correctIndex: 0,
        explanation: "कर्क रेखा गुजरात, राजस्थान, मध्य प्रदेश, छत्तीसगढ़, झारखंड, पश्चिम बंगाल, त्रिपुरा और मिजोरम - कुल 8 राज्यों से गुजरती है।"
      },
      {
        id: "gk-10",
        question: "गांधी जी ने किस वर्ष ऐतिहासिक 'दांडी मार्च' (नमक सत्याग्रह) की शुरुआत साबरमती आश्रम से की थी?",
        options: ["12 मार्च 1930", "15 अगस्त 1942", "13 अप्रैल 1919", "26 जनवरी 1931"],
        correctIndex: 0,
        explanation: "महात्मा गांधी ने 12 मार्च 1930 को साबरमती आश्रम से 78 अनुयायियों के साथ 240 मील की दांडी यात्रा शुरू की और 6 अप्रैल 1930 को नमक कानून तोड़ा था।"
      }
    ]
  }
];
