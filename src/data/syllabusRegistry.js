// Official Exam Pattern & Syllabus Registry for VEE App
// Provides authentic subject-wise exam pattern, marks, time duration, negative marking, and detailed syllabus topics.
// Language aware: Returns pure English when currentLang === 'en', and authentic Hindi when currentLang === 'hi'.

export function getJobSyllabus(job, currentLang = 'hi') {
  if (!job) return null;

  const isHi = currentLang === 'hi';
  const title = (job.title || '').toLowerCase();
  const dept = (job.dept || '').toLowerCase();
  const qual = (job.qualification || '').toLowerCase();
  const category = (job.category || '').toLowerCase();
  const type = (job.type || '').toLowerCase();
  const allText = `${title} ${dept} ${qual} ${category} ${type}`;

  // =========================================================================
  // 1. MP POLICE CONSTABLE & RADIO (MPESB / PEB)
  // =========================================================================
  if (/mp\s*police|madhya\s*pradesh\s*police|mpesb|peb/i.test(allText)) {
    return {
      examName: isHi
        ? "मध्य प्रदेश पुलिस आरक्षक (GD व रेडियो) परीक्षा - MPESB"
        : "MP Police Constable (GD & Radio) Recruitment Exam (MPESB)",
      mode: isHi ? "ऑनलाइन कंप्यूटर आधारित परीक्षा (Online CBT)" : "Online CBT (Computer Based Test)",
      duration: isHi ? "120 मिनट (2 घंटे)" : "120 Minutes (2 Hours)",
      totalQuestions: isHi ? "100 वस्तुनिष्ठ प्रश्न" : "100 Objective Questions",
      totalMarks: isHi ? "100 अंक (प्रत्येक सही उत्तर 1 अंक)" : "100 Marks (1 Mark each)",
      negativeMarking: isHi ? "कोई नकारात्मक अंकन नहीं (Zero Negative Marking)" : "No Negative Marking (0 Penalty)",
      medium: isHi ? "द्विभाषी (हिंदी व अंग्रेजी)" : "Bilingual (Hindi / English)",
      pattern: [
        {
          subject: isHi ? "सामान्य ज्ञान एवं तार्किक ज्ञान" : "General Knowledge & Logical Reasoning",
          questions: 40,
          marks: 40
        },
        {
          subject: isHi ? "बौद्धिक क्षमता एवं मानसिक अभिरुचि" : "Intellectual Ability & Mental Aptitude",
          questions: 30,
          marks: 30
        },
        {
          subject: isHi ? "विज्ञान एवं सरल अंकगणित" : "Science & Simple Arithmetic",
          questions: 30,
          marks: 30
        }
      ],
      topics: [
        {
          subject: isHi ? "🏛️ सामान्य ज्ञान एवं तार्किक ज्ञान (40 अंक)" : "🏛️ General Knowledge & Logical Reasoning (40 Marks)",
          items: isHi
            ? "मध्य प्रदेश का सामान्य ज्ञान: इतिहास, संस्कृति, प्रमुख जनजातियाँ, मेले, त्योहार, नदियां, वन्यजीव अभयारण्य, राष्ट्रीय उद्यान, खनिज, उद्योग एवं राज्य की प्रशासनिक व्यवस्था। राष्ट्रीय एवं अंतर्राष्ट्रीय समसामयिकी 2026, भारतीय संविधान एवं राजव्यवस्था, खेलकूद एवं प्रमुख पुरस्कार। तार्किक तर्कशक्ति: संख्या एवं अक्षर श्रृंखला, सादृश्यता, वर्गीकरण, कोडिंग-डिकोडिंग, रक्त संबंध, दिशा एवं दूरी, बैठक व्यवस्था।"
            : "Madhya Pradesh General Knowledge: History, Culture, Major Tribes, Fairs, Festivals, Rivers, Wildlife Sanctuaries, National Parks, Minerals, Industries and State Governance. 2026 National & International Current Affairs, Indian Constitution & Polity, Sports, Awards & Honors. Logical Reasoning: Number & Alphabet Series, Analogies, Classification, Coding-Decoding, Blood Relations, Direction & Distance, Seating Arrangements."
        },
        {
          subject: isHi ? "🧠 बौद्धिक क्षमता एवं मानसिक अभिरुचि (30 अंक)" : "🧠 Intellectual Ability & Mental Aptitude (30 Marks)",
          items: isHi
            ? "कथन एवं निष्कर्ष, न्यायवाक्य (Syllogism), वेन आरेख, गैर-मौखिक तर्कशक्ति (चित्र श्रृंखला, सन्निहित आकृतियां, दर्पण एवं जल प्रतिबिंब), निर्णय लेने की क्षमता, समस्या निवारण, भावनात्मक बुद्धिमत्ता, पुलिस प्रणाली एवं जन सुरक्षा के प्रति अभिरुचि।"
            : "Statements & Conclusions, Syllogisms, Venn Diagrams, Non-verbal Reasoning (Figure Series, Embedded Figures, Mirror & Water Images), Decision Making, Problem Solving, Emotional Intelligence, Police System and Aptitude for Public Safety."
        },
        {
          subject: isHi ? "🔬 विज्ञान एवं सरल अंकगणित (30 अंक)" : "🔬 Science & Simple Arithmetic (30 Marks)",
          items: isHi
            ? "10वीं स्तर का सामान्य विज्ञान: भौतिकी (गति, बल, कार्य, ऊर्जा, गुरुत्वाकर्षण, प्रकाश, ध्वनि, विद्युत), रसायन विज्ञान (परमाणु संरचना, रासायनिक अभिक्रियाएं, अम्ल-क्षार-लवण, धातु एवं अधातु), जीव विज्ञान (मानव शरीर के तंत्र, पोषण, स्वास्थ्य, संक्रामक रोग, पादप आकारिकी)। सरल अंकगणित: संख्या पद्धति, सरलीकरण, ल.स. व म.स., प्रतिशत, लाभ-हानि, बट्टा, अनुपात-समानुपात, औसत, समय व कार्य, चाल-समय-दूरी, साधारण व चक्रवृद्धि ब्याज, क्षेत्रमिति (आयत, वर्ग, वृत्त, बेलन)।"
            : "10th Standard General Science: Physics (Motion, Force, Work, Energy, Gravitation, Light, Sound, Electricity), Chemistry (Atomic Structure, Chemical Reactions, Acids-Bases-Salts, Metals and Non-metals), Biology (Human Anatomy, Nutrition, Health & Communicable Diseases, Plant Morphology). Simple Arithmetic: Number Systems, Simplification, LCM & HCF, Percentages, Profit & Loss, Discount, Ratio & Proportion, Averages, Time & Work, Speed-Time-Distance, Simple & Compound Interest, Mensuration (Rectangle, Square, Circle, Cylinder)."
        }
      ],
      physicalStandards: {
        maleHeight: isHi ? "168 सेमी (सामान्य/ओबीसी/एससी), 160 सेमी (एसटी)" : "168 cm (General/OBC/SC), 160 cm (ST)",
        femaleHeight: isHi ? "155 सेमी (सभी वर्गों की महिलाओं हेतु)" : "155 cm (All Female Categories)",
        maleChest: isHi ? "81 सेमी बिना फुलाए, 86 सेमी फुलाकर (न्यूनतम 5 सेमी फुलाव)" : "81 cm unexpanded, 86 cm expanded (Min 5 cm expansion)",
        runningMale: isHi ? "800 मीटर दौड़ (अधिकतम 2 मिनट 45 सेकंड - समय के अनुसार मेरिट अंक)" : "800m Run in 2 Min 45 Sec (Scored for physical merit)",
        runningFemale: isHi ? "800 मीटर दौड़ (अधिकतम 3 मिनट 40 सेकंड - समय के अनुसार मेरिट अंक)" : "800m Run in 3 Min 40 Sec (Scored for physical merit)",
        shotPut: isHi ? "गोला फेंक: पुरुष 7.26 किग्रा (19 फीट) | महिला 4 किग्रा (15 फीट)" : "Shot Put: Male 7.26 kg (19 Feet) | Female 4 kg (15 Feet)",
        longJump: isHi ? "लंबी कूद: पुरुष 13 फीट | महिला 10 फीट" : "Long Jump: Male 13 Feet | Female 10 Feet"
      },
      selectionStages: isHi ? [
        "चरण 1: ऑनलाइन लिखित परीक्षा CBT (100 अंक - 100 प्रश्न, 120 मिनट)",
        "चरण 2: शारीरिक दक्षता परीक्षा PET (100 अंक मेरिट आधारित: 800m दौड़ + गोला फेंक + लंबी कूद)",
        "चरण 3: मूल दस्तावेज सत्यापन (DV) एवं बायोमेट्रिक मिलान",
        "चरण 4: राज्य मेडिकल बोर्ड द्वारा स्वास्थ्य परीक्षण"
      ] : [
        "Stage 1: Online Written CBT Examination (100 Questions - 100 Marks, 120 Mins)",
        "Stage 2: Physical Efficiency Test PET (100 Marks Merit: 800m Run + Shot Put + Long Jump)",
        "Stage 3: Original Document Verification (DV) & Biometric Matching",
        "Stage 4: State Medical Board Fitness Examination"
      ],
      mockSubject: "Police Exams"
    };
  }

  // =========================================================================
  // 2. UP POLICE CONSTABLE & SI (UPPRPB)
  // =========================================================================
  if (/up\s*police|uttar\s*pradesh\s*police|upprpb/i.test(allText)) {
    return {
      examName: isHi
        ? "उत्तर प्रदेश पुलिस आरक्षक लिखित परीक्षा - UPPRPB"
        : "UP Police Constable Recruitment Written Exam (UPPRPB)",
      mode: isHi ? "ऑफलाइन OMR आधारित लिखित परीक्षा" : "Offline OMR Based Written Examination",
      duration: isHi ? "120 मिनट (2 घंटे)" : "120 Minutes (2 Hours)",
      totalQuestions: isHi ? "150 वस्तुनिष्ठ बहुविकल्पीय प्रश्न" : "150 Multiple Choice Questions",
      totalMarks: isHi ? "300 अंक (प्रत्येक सही उत्तर 2 अंक)" : "300 Marks (2 Marks each)",
      negativeMarking: isHi ? "0.50 अंक (1/4th) की नेगेटिव मार्किंग" : "-0.50 Mark (1/4th penalty) for each wrong answer",
      medium: isHi ? "द्विभाषी (हिंदी व अंग्रेजी)" : "Bilingual (Hindi / English)",
      pattern: [
        {
          subject: isHi ? "सामान्य ज्ञान" : "General Knowledge",
          questions: 38,
          marks: 76
        },
        {
          subject: isHi ? "सामान्य हिंदी" : "General Hindi",
          questions: 37,
          marks: 74
        },
        {
          subject: isHi ? "संख्यात्मक व मानसिक योग्यता" : "Numerical & Mental Ability",
          questions: 38,
          marks: 76
        },
        {
          subject: isHi ? "मानसिक अभिरुचि, बुद्धिलब्धि व तार्किक क्षमता" : "Mental Aptitude, IQ & Reasoning",
          questions: 37,
          marks: 74
        }
      ],
      topics: [
        {
          subject: isHi ? "🏛️ सामान्य ज्ञान (38 प्रश्न / 76 अंक)" : "🏛️ General Knowledge (38 Qs / 76 Marks)",
          items: isHi
            ? "सामान्य विज्ञान, भारत का इतिहास, भारतीय संविधान, भारतीय अर्थव्यवस्था एवं संस्कृति, भारतीय कृषि, वाणिज्य एवं व्यापार, जनसंख्या, पर्यावरण एवं नगरीकरण, भारत एवं विश्व का भूगोल, उत्तर प्रदेश की शिक्षा संस्कृति और सामाजिक प्रथाओं के संबंध में विशिष्ट जानकारी, उत्तर प्रदेश में राजस्व, पुलिस व सामान्य प्रशासनिक व्यवस्था, मानवाधिकार, आंतरिक सुरक्षा तथा आतंकवाद, भारत और उसके पड़ोसी देशों के बीच संबंध, राष्ट्रीय तथा अंतर्राष्ट्रीय महत्व के समसामयिक विषय, राष्ट्रीय तथा अंतर्राष्ट्रीय संगठन, विमुद्रीकरण और उसका प्रभाव, साइबर क्राइम, वस्तु एवं सेवाकर (GST), पुरस्कार और सम्मान, देश/राजधानियां/मुद्राएं, महत्वपूर्ण दिवस, अनुसंधान एवं खोज, पुस्तक और उनके लेखक, सोशल मीडिया कम्युनिकेशन।"
            : "General Science, Indian History, Indian Constitution, Indian Economy & Culture, Indian Agriculture, Commerce & Trade, Population, Environment & Urbanization, Geography of India & World, Uttar Pradesh Culture, Revenue & Police Administration, Human Rights, Internal Security, Cyber Crime, GST, Awards & Honors, Countries/Capitals/Currencies, Important Days, Research & Books, Social Media Communication, 2026 Current Affairs."
        },
        {
          subject: isHi ? "📖 सामान्य हिंदी (37 प्रश्न / 74 अंक)" : "📖 General Hindi (37 Qs / 74 Marks)",
          items: isHi
            ? "हिंदी और अन्य भारतीय भाषाएं, हिंदी व्याकरण का मौलिक ज्ञान- हिंदी वर्णमाला, तद्भव-तत्सम, पर्यायवाची, विलोम, अनेकार्थक, वाक्यांशों के लिए एक शब्द, समरूपी भिन्नार्थक शब्द, अशुद्ध वाक्यों को शुद्ध करना, लिंग, वचन, कारक, सर्वनाम, विशेषण, क्रिया, काल, वाच्य, अव्यय, उपसर्ग, प्रत्यय, संधि, समास, विराम चिन्ह, मुहावरे एवं लोकोक्तियां, रस, छंद, अलंकार, अपठित बोध, प्रसिद्ध कवि/लेखक एवं उनकी रचनाएं, हिंदी भाषा में पुरस्कार।"
            : "Hindi Grammar Fundamentals: Alphabet, Tadbhav-Tatsam, Synonyms & Antonyms, One Word Substitutions, Sentence Correction, Gender, Number, Case, Pronouns, Adjectives, Verbs, Tenses, Voice, Prefixes & Suffixes, Sandhi & Samas, Punctuation, Idioms & Phrases, Rasa, Chhanda, Alankara, Comprehension Passage, Famous Hindi Authors & Awards."
        },
        {
          subject: isHi ? "📐 संख्यात्मक व मानसिक योग्यता (38 प्रश्न / 76 अंक)" : "📐 Numerical & Mental Ability (38 Qs / 76 Marks)",
          items: isHi
            ? "संख्या पद्धति, सरलीकरण, दशमलव और भिन्न, महत्तम समापवर्तक और लघुत्तम समापवर्त्य, अनुपात और समानुपात, प्रतिशतता, लाभ और हानि, छूट (डिस्काउंट), साधारण ब्याज, चक्रवृद्धि ब्याज, साझेदारी, औसत, समय और कार्य, समय और दूरी, सारणी और ग्राफ का प्रयोग, मेंसुरेशन, अंकगणितीय संगणना व अन्य विश्लेषणात्मक कार्य।"
            : "Number System, Simplification, Decimals & Fractions, HCF & LCM, Ratio & Proportion, Percentage, Profit & Loss, Discount, Simple & Compound Interest, Partnership, Average, Time & Work, Time & Distance, Use of Tables & Graphs, Mensuration, Arithmetical Computations."
        },
        {
          subject: isHi ? "🧠 मानसिक अभिरुचि, बुद्धिलब्धि व तार्किक क्षमता (37 प्रश्न / 74 अंक)" : "🧠 Mental Aptitude, IQ & Reasoning (37 Qs / 74 Marks)",
          items: isHi
            ? "मानसिक अभिरुचि: जनहित, कानून एवं शांति व्यवस्था, सांप्रदायिक सद्भाव, अपराध नियंत्रण, विधि का शासन, अनुकूलन की क्षमता, व्यवसायिक सूचना, पुलिस प्रणाली, समकालीन पुलिस मुद्दे। बुद्धिलब्धि: संबंध व सादृश्य परीक्षण, असमान को चिन्हित करना, श्रृंखला पूरी करने का परीक्षण, संकेत लिपि और सांकेतिक लिपि को समझना, दिशा ज्ञान, रक्त संबंध, वर्णमाला पर आधारित प्रश्न, समय-क्रम परीक्षण। तार्किक क्षमता: समरूपता, समानता, भिन्नता, खाली स्थान भरना, समस्या को सुलझाना, विश्लेषण निर्णय, दृश्य स्मृति, विभेदन क्षमता, पर्यवेक्षण।"
            : "Public Interest, Law and Order, Communal Harmony, Crime Control, Rule of Law, Professional Information, Police System, Contemporary Police Issues. IQ: Relationship & Analogy Test, Spotting Odd Man Out, Series Completion, Coding-Decoding, Direction Sense, Blood Relations, Alphabet Test. Reasoning: Similarities, Differences, Space Visualization, Problem Solving, Analysis & Judgment, Visual Memory, Discriminating Observation."
        }
      ],
      physicalStandards: {
        maleHeight: isHi ? "168 सेमी (सामान्य/ओबीसी/एससी), 160 सेमी (एसटी)" : "168 cm (General/OBC/SC), 160 cm (ST)",
        femaleHeight: isHi ? "152 सेमी (सामान्य/ओबीसी/एससी), 147 सेमी (एसटी)" : "152 cm (General/OBC/SC), 147 cm (ST)",
        maleChest: isHi ? "79 सेमी बिना फुलाए, 84 सेमी फुलाकर (एसटी: 77-82 सेमी)" : "79 cm unexpanded, 84 cm expanded (Min 5 cm expansion)",
        runningMale: isHi ? "4.8 किमी दौड़ 25 मिनट में" : "4.8 km Run in 25 Minutes",
        runningFemale: isHi ? "2.4 किमी दौड़ 14 मिनट में" : "2.4 km Run in 14 Minutes"
      },
      selectionStages: isHi ? [
        "चरण 1: ऑफलाइन लिखित परीक्षा (150 प्रश्न - 300 अंक, 2 घंटे)",
        "चरण 2: शारीरिक मानक परीक्षण (PST) व मूल दस्तावेज सत्यापन (DV)",
        "चरण 3: शारीरिक दक्षता परीक्षा (PET - रनिंग क्वालिफाइंग)",
        "चरण 4: अंतिम चयन सूची व मेडिकल परीक्षा"
      ] : [
        "Stage 1: Offline Written Exam (150 Qs - 300 Marks, 2 Hours)",
        "Stage 2: Physical Standard Test (PST) & Document Verification (DV)",
        "Stage 3: Physical Efficiency Test (PET - Qualifying Run)",
        "Stage 4: Final Merit List & Medical Examination"
      ],
      mockSubject: "Police Exams"
    };
  }

  // =========================================================================
  // 3. RAJASTHAN POLICE CONSTABLE
  // =========================================================================
  if (/rajasthan\s*police/i.test(allText)) {
    return {
      examName: isHi
        ? "राजस्थान पुलिस आरक्षक भर्ती परीक्षा"
        : "Rajasthan Police Constable Recruitment Exam",
      mode: isHi ? "कंप्यूटर आधारित परीक्षा (CBT)" : "Computer Based Test (CBT)",
      duration: isHi ? "120 मिनट (2 घंटे)" : "120 Minutes (2 Hours)",
      totalQuestions: isHi ? "150 वस्तुनिष्ठ प्रश्न" : "150 Objective Questions",
      totalMarks: isHi ? "150 अंक (प्रत्येक सही उत्तर 1 अंक)" : "150 Marks (1 Mark each)",
      negativeMarking: isHi ? "0.25 (1/4th) की नेगेटिव मार्किंग" : "-0.25 (1/4th) Negative Marking",
      medium: isHi ? "द्विभाषी (हिंदी व अंग्रेजी)" : "Bilingual (Hindi / English)",
      pattern: [
        {
          subject: isHi ? "तर्कशक्ति, तार्किक योग्यता व बेसिक कंप्यूटर" : "Reasoning, Logic & Basic Computer",
          questions: 60,
          marks: 60
        },
        {
          subject: isHi ? "सामान्य ज्ञान, सामान्य विज्ञान, समसामयिकी व महिला/बाल अधिकार नियम" : "General Knowledge, Science, Current Affairs & Women/Child Rules",
          questions: 45,
          marks: 45
        },
        {
          subject: isHi ? "राजस्थान का इतिहास, कला, संस्कृति, भूगोल व अर्थव्यवस्था" : "Rajasthan History, Art, Culture, Geography & Economy",
          questions: 45,
          marks: 45
        }
      ],
      topics: [
        {
          subject: isHi ? "💻 तर्कशक्ति व बेसिक कंप्यूटर (60 अंक)" : "💻 Reasoning & Basic Computer (60 Marks)",
          items: isHi
            ? "कम्प्यूटर का परिचय, हार्डवेयर, सॉफ्टवेयर, ऑपरेटिंग सिस्टम, MS Office (Word, Excel, PowerPoint), इंटरनेट व साइबर सुरक्षा। रीजनिंग: कोडिंग-डिकोडिंग, रक्त संबंध, दिशा परीक्षण, रैंकिंग, वेन आरेख, श्रृंखला, सादृश्यता, बैठक व्यवस्था, कथन-निष्कर्ष।"
            : "Introduction to Computers, Hardware, Software, Operating Systems, MS Office, Internet & Cyber Security. Reasoning: Coding-Decoding, Blood Relations, Direction Test, Ranking, Venn Diagrams, Series, Seating Arrangement, Statement & Assumptions."
        },
        {
          subject: isHi ? "🏛️ सामान्य ज्ञान, विज्ञान व महिला-बाल सुरक्षा (45 अंक)" : "🏛️ General Knowledge, Science & Women/Child Safety (45 Marks)",
          items: isHi
            ? "भारत का इतिहास, भूगोल, भारतीय संविधान व राज्य व्यवस्था, सामान्य विज्ञान (दैनिक जीवन का विज्ञान), 2026 की महत्वपूर्ण समसामयिकी। महिलाओं एवं बच्चों के विरुद्ध अपराध तथा उनसे संबंधित कानूनी प्रावधान व नियम (POCSO, घरेलू हिंसा अधिनियम, दहेज निषेध)।"
            : "Indian History, Geography, Indian Constitution & Polity, Daily Life General Science, 2026 National Current Affairs. Crimes against Women & Children: Legal Provisions & Rules (POCSO Act, Domestic Violence Act, Dowry Prohibition Act)."
        },
        {
          subject: isHi ? "🏰 राजस्थान का इतिहास, कला व संस्कृति (45 अंक)" : "🏰 Rajasthan History, Art, Culture & Geography (45 Marks)",
          items: isHi
            ? "राजस्थान का प्राचीन इतिहास, प्रमुख राजवंश, 1857 की क्रांति में योगदान, प्रजामंडल आंदोलन व राजस्थान का एकीकरण। कला एवं संस्कृति: मेले, त्योहार, लोक देवता, लोक देवियां, लोक नृत्य, लोक संगीत, हस्तकला, प्रमुख किले, महल एवं बावड़ियां। भूगोल: जलवायु, नदियां, झीलें, वन संपदा, खनिज, कृषि व पशुपालन।"
            : "Ancient History of Rajasthan, Major Dynasties, 1857 Revolt, Prajamandal Movement & Integration of Rajasthan. Art & Culture: Fairs, Festivals, Folk Deities, Dances, Music, Forts, Palaces & Handicrafts. Geography: Climate, Rivers, Lakes, Forests, Minerals, Agriculture & Livestock."
        }
      ],
      physicalStandards: {
        maleHeight: isHi ? "168 सेमी (टीएसपी/सहरिया: 160 सेमी)" : "168 cm (TSP/Sahariya: 160 cm)",
        femaleHeight: isHi ? "152 सेमी (वजन न्यूनतम 47.5 किग्रा)" : "152 cm (Weight Min 47.5 kg)",
        maleChest: isHi ? "81 सेमी बिना फुलाए, 86 सेमी फुलाकर (न्यूनतम 5 सेमी फुलाव)" : "81 cm unexpanded, 86 cm expanded",
        runningMale: isHi ? "5 किलोमीटर दौड़ 25 मिनट में" : "5 km Run in 25 Minutes",
        runningFemale: isHi ? "5 किलोमीटर दौड़ 35 मिनट में" : "5 km Run in 35 Minutes"
      },
      selectionStages: isHi ? [
        "चरण 1: शारीरिक दक्षता व मानक परीक्षा (PET / PST)",
        "चरण 2: कंप्यूटर आधारित लिखित परीक्षा (CBT - 150 प्रश्न, 150 अंक)",
        "चरण 3: प्रोफिशिएंसी टेस्ट (चालक, घुड़सवार व श्वान दल हेतु)",
        "चरण 4: मूल दस्तावेज सत्यापन व चिकित्सा परीक्षण"
      ] : [
        "Stage 1: Physical Efficiency & Standard Test (PET / PST)",
        "Stage 2: Computer Based Written Examination (CBT - 150 Qs, 150 Marks)",
        "Stage 3: Proficiency Test (For Driver, Band, Mounted & Dog Squad)",
        "Stage 4: Document Verification & Medical Examination"
      ],
      mockSubject: "Police Exams"
    };
  }

  // =========================================================================
  // 4. BIHAR POLICE CONSTABLE (CSBC)
  // =========================================================================
  if (/bihar\s*police|csbc/i.test(allText)) {
    return {
      examName: isHi
        ? "बिहार पुलिस सिपाही भर्ती परीक्षा - CSBC"
        : "Bihar Police Constable Recruitment Exam (CSBC)",
      mode: isHi ? "ऑफलाइन OMR लिखित परीक्षा (मैट्रिक स्तर)" : "Offline OMR Written Exam (10th Standard)",
      duration: isHi ? "120 मिनट (2 घंटे)" : "120 Minutes (2 Hours)",
      totalQuestions: isHi ? "100 वस्तुनिष्ठ प्रश्न" : "100 Objective Questions",
      totalMarks: isHi ? "100 अंक (प्रत्येक सही उत्तर 1 अंक)" : "100 Marks (1 Mark each)",
      negativeMarking: isHi ? "कोई नकारात्मक अंकन नहीं (Zero Penalty)" : "No Negative Marking (0 Penalty)",
      medium: isHi ? "द्विभाषी (हिंदी व अंग्रेजी)" : "Bilingual (Hindi / English)",
      pattern: [
        {
          subject: isHi ? "हिंदी एवं अंग्रेजी भाषा" : "Hindi & English Languages",
          questions: 15,
          marks: 15
        },
        {
          subject: isHi ? "सामाजिक अध्ययन (इतिहास, भूगोल, नागरिक शास्त्र व अर्थशास्त्र)" : "Social Studies (History, Geography, Civics, Economics)",
          questions: 30,
          marks: 30
        },
        {
          subject: isHi ? "सामान्य विज्ञान (भौतिकी, रसायन व जीव विज्ञान)" : "General Science (Physics, Chemistry, Biology)",
          questions: 30,
          marks: 30
        },
        {
          subject: isHi ? "गणित एवं समसामयिक घटनाएं" : "Mathematics & Current Affairs",
          questions: 25,
          marks: 25
        }
      ],
      topics: [
        {
          subject: isHi ? "📖 हिंदी एवं अंग्रेजी (15 अंक)" : "📖 Hindi & English (15 Marks)",
          items: isHi
            ? "हिंदी: ध्वनि, शब्द, पद, वाक्य, संज्ञा, सर्वनाम, क्रिया, विशेषण, काल, संधि, समास, पर्यायवाची, विलोम, मुहावरे। अंग्रेजी: Grammar, Parts of Speech, Tenses, Synonyms, Antonyms, Spellings, Error Detection, Comprehension."
            : "Hindi: Grammar, Parts of Speech, Sandhi, Samas, Synonyms, Antonyms, Idioms. English: Grammar, Parts of Speech, Tenses, Vocabulary, Synonyms & Antonyms, Comprehension."
        },
        {
          subject: isHi ? "🏛️ सामाजिक अध्ययन (30 अंक)" : "🏛️ Social Studies (30 Marks)",
          items: isHi
            ? "इतिहास (प्राचीन, मध्यकालीन व आधुनिक भारत का इतिहास, स्वतंत्रता संग्राम), भूगोल (भारत एवं विश्व का भूगोल, प्राकृतिक संसाधन, जलवायु), नागरिक शास्त्र (भारतीय संविधान, मौलिक अधिकार, संसदीय व्यवस्था), अर्थशास्त्र (भारतीय अर्थव्यवस्था, कृषि, उद्योग)।"
            : "History (Ancient, Medieval & Modern Indian History, Freedom Struggle), Geography (Indian & World Geography, Climate, Resources), Civics (Indian Constitution, Fundamental Rights, Governance), Economics (Indian Economy, Agriculture, Industry)."
        },
        {
          subject: isHi ? "🔬 सामान्य विज्ञान (30 अंक)" : "🔬 General Science (30 Marks)",
          items: isHi
            ? "10वीं कक्षा स्तर की भौतिकी (गति, बल, गुरुत्वाकर्षण, कार्य व ऊर्जा, प्रकाश, ध्वनि), रसायन विज्ञान (पदार्थ की अवस्थाएं, परमाणु संरचना, रासायनिक अभिक्रियाएं, धातु-अधातु, कार्बन), जीव विज्ञान (कोशिका, ऊतक, मानव अंग तंत्र, पादप, स्वास्थ्य व पोषण, पर्यावरण)।"
            : "10th Standard Physics (Motion, Force, Gravitation, Work & Energy, Light, Sound), Chemistry (States of Matter, Atomic Structure, Chemical Reactions, Metals/Non-metals, Carbon), Biology (Cell, Tissues, Human Body Systems, Health & Nutrition, Environment)."
        },
        {
          subject: isHi ? "📐 गणित व समसामयिकी (25 अंक)" : "📐 Mathematics & Current Affairs (25 Marks)",
          items: isHi
            ? "संख्या पद्धति, लघुत्तम समापवर्त्य व महत्तम समापवर्तक, प्रतिशत, लाभ-हानि, अनुपात, साधारण व चक्रवृद्धि ब्याज, समय-दूरी, औसत, क्षेत्रमिति। समसामयिकी: राष्ट्रीय व अंतर्राष्ट्रीय घटनाएं, खेल, पुरस्कार 2026।"
            : "Number System, LCM & HCF, Percentages, Profit & Loss, Ratio, Simple & Compound Interest, Time & Distance, Averages, Mensuration. Current Affairs: 2026 National & International News, Sports, Awards."
        }
      ],
      physicalStandards: {
        maleHeight: isHi ? "165 सेमी (सामान्य/पिछड़ा), 160 सेमी (अत्यंत पिछड़ा/एससी/एसटी)" : "165 cm (General/BC), 160 cm (EBC/SC/ST)",
        femaleHeight: isHi ? "155 सेमी (सभी वर्गों की महिलाओं हेतु, वजन न्यूनतम 48 किग्रा)" : "155 cm (All Female categories, Min 48 kg weight)",
        maleChest: isHi ? "81 सेमी बिना फुलाए, 86 सेमी फुलाकर (एससी/एसटी: 79-84 सेमी)" : "81 cm unexpanded, 86 cm expanded",
        runningMale: isHi ? "1.6 किमी दौड़ अधिकतम 6 मिनट में (5 मिनट से कम में पूरे 50 अंक)" : "1.6 km Run in Max 6 Min (Full 50 Marks if under 5 Min)",
        runningFemale: isHi ? "1 किमी दौड़ अधिकतम 5 मिनट में (4 मिनट से कम में पूरे 50 अंक)" : "1 km Run in Max 5 Min (Full 50 Marks if under 4 Min)",
        shotPut: isHi ? "गोला फेंक (अधिकतम 25 अंक): पुरुष 16 पाउंड (16 से 20 फीट) | महिला 12 पाउंड (12 से 16 फीट)" : "Shot Put (25 Marks): Male 16 lb (16-20 ft) | Female 12 lb (12-16 ft)",
        highJump: isHi ? "ऊंची कूद (अधिकतम 25 अंक): पुरुष न्यूनतम 4 फीट (5 फीट पर 25 अंक) | महिला न्यूनतम 3 फीट" : "High Jump (25 Marks): Male Min 4 ft (Full 25 Marks at 5 ft) | Female Min 3 ft"
      },
      selectionStages: isHi ? [
        "चरण 1: लिखित परीक्षा (क्वालिफाइंग प्रकृति - न्यूनतम 30% अंक आवश्यक)",
        "चरण 2: शारीरिक दक्षता परीक्षा PET (कुल 100 अंक - दौड़ 50 अंक, गोला फेंक 25 अंक, ऊंची कूद 25 अंक - इसी से मेरिट बनती है)",
        "चरण 3: मूल प्रमाण पत्र सत्यापन (Document Verification)",
        "चरण 4: चिकित्सीय परीक्षण (Medical Checkup)"
      ] : [
        "Stage 1: Written Examination (Screening / Qualifying - Min 30% to qualify for PET)",
        "Stage 2: Physical Efficiency Test PET (100 Marks Merit: 50M Run + 25M Shot Put + 25M High Jump)",
        "Stage 3: Document Verification (DV)",
        "Stage 4: Medical Examination"
      ],
      mockSubject: "Police Exams"
    };
  }

  // =========================================================================
  // 5. DELHI POLICE CONSTABLE (EXECUTIVE)
  // =========================================================================
  if (/delhi\s*police/i.test(allText)) {
    return {
      examName: isHi
        ? "दिल्ली पुलिस आरक्षक (एग्जीक्यूटिव) भर्ती परीक्षा - SSC"
        : "Delhi Police Constable (Executive) CBT Exam - SSC",
      mode: isHi ? "ऑनलाइन कंप्यूटर आधारित परीक्षा (Online CBT)" : "Online CBT (Computer Based Examination)",
      duration: isHi ? "90 मिनट (1 घंटा 30 मिनट)" : "90 Minutes",
      totalQuestions: isHi ? "100 वस्तुनिष्ठ प्रश्न" : "100 Objective Questions",
      totalMarks: isHi ? "100 अंक (प्रत्येक सही उत्तर 1 अंक)" : "100 Marks (1 Mark each)",
      negativeMarking: isHi ? "0.25 (1/4th) की नेगेटिव मार्किंग" : "-0.25 (1/4th) Negative Marking",
      medium: isHi ? "द्विभाषी (हिंदी व अंग्रेजी)" : "Bilingual (Hindi / English)",
      pattern: [
        {
          subject: isHi ? "सामान्य ज्ञान व समसामयिक विषय" : "General Knowledge & Current Affairs",
          questions: 50,
          marks: 50
        },
        {
          subject: isHi ? "तर्कशक्ति (रीजनिंग)" : "Reasoning Ability",
          questions: 25,
          marks: 25
        },
        {
          subject: isHi ? "संख्यात्मक योग्यता (गणित)" : "Numerical Ability",
          questions: 15,
          marks: 15
        },
        {
          subject: isHi ? "कंप्यूटर फंडामेंटल्स, MS Excel, Word व इंटरनेट" : "Computer Fundamentals, MS Office & Internet",
          questions: 10,
          marks: 10
        }
      ],
      topics: [
        {
          subject: isHi ? "🏛️ सामान्य ज्ञान व समसामयिक विषय (50 अंक)" : "🏛️ General Knowledge & Current Affairs (50 Marks)",
          items: isHi
            ? "भारतीय इतिहास, संस्कृति, भूगोल, भारतीय अर्थव्यवस्था, सामान्य राजनीति, भारतीय संविधान, वैज्ञानिक अनुसंधान, 2026 की राष्ट्रीय एवं अंतर्राष्ट्रीय समसामयिकी घटनाएं, खेलकूद, पुरस्कार एवं महत्वपूर्ण पुस्तकें।"
            : "Indian History, Culture, Geography, Indian Economy, General Polity, Indian Constitution, Scientific Research, 2026 National & International Current Affairs, Sports, Awards and Important Books."
        },
        {
          subject: isHi ? "🧠 तर्कशक्ति (25 अंक)" : "🧠 Reasoning Ability (25 Marks)",
          items: isHi
            ? "सादृश्यता, समानता और अंतर, स्थानिक दृश्यीकरण, स्थानिक उन्मुखीकरण, दृश्य स्मृति, भेदभाव, अवलोकन, संबंध अवधारणाएं, अंकगणितीय तर्क, चित्रात्मक वर्गीकरण, कोडिंग-डिकोडिंग।"
            : "Analogies, Similarities & Differences, Spatial Visualization, Spatial Orientation, Visual Memory, Discrimination, Observation, Relationship Concepts, Arithmetical Reasoning, Figural Classification, Coding-Decoding."
        },
        {
          subject: isHi ? "📐 संख्यात्मक योग्यता (15 अंक)" : "📐 Numerical Ability (15 Marks)",
          items: isHi
            ? "संख्या पद्धति, पूर्ण संख्याओं की गणना, दशमलव और भिन्न, प्रतिशत, अनुपात और समानुपात, औसत, ब्याज (साधारण व चक्रवृद्धि), लाभ और हानि, छूट, क्षेत्रमिति, समय और दूरी, समय और कार्य।"
            : "Number Systems, Computation of Whole Numbers, Decimals & Fractions, Percentages, Ratio and Proportion, Averages, Interest (Simple & Compound), Profit and Loss, Discount, Mensuration, Time and Distance, Time and Work."
        },
        {
          subject: isHi ? "💻 कंप्यूटर फंडामेंटल्स (10 अंक)" : "💻 Computer Fundamentals (10 Marks)",
          items: isHi
            ? "वर्ड प्रोसेसिंग के मूल तत्व (Text Formatting, Creation), MS Excel (Spreadsheet, Functions, Formulas), ई-मेल, इंटरनेट, WWW एवं वेब ब्राउजर्स, URL, Search Engines।"
            : "Elements of Word Processing (Text Creation, Formatting), MS Excel (Spreadsheet Basics, Functions, Formulas), Communication (E-mail), Internet, WWW and Web Browsers, URL, Search Engines."
        }
      ],
      physicalStandards: {
        maleHeight: isHi ? "170 सेमी (पहाड़ी/एसटी/पुलिस वार्ड: 165 सेमी)" : "170 cm (Hill Areas/ST: 165 cm)",
        femaleHeight: isHi ? "157 सेमी (पहाड़ी/एससी/एसटी: 155 सेमी)" : "157 cm (Hill Areas/SC/ST: 155 cm)",
        maleChest: isHi ? "81 सेमी से 85 सेमी (न्यूनतम 4 सेमी फुलाव)" : "81 cm to 85 cm (Min 4 cm expansion)",
        runningMale: isHi ? "1,600 मीटर दौड़ 6 मिनट में" : "1,600m Run in 6 Minutes",
        runningFemale: isHi ? "1,600 मीटर दौड़ 8 मिनट में" : "1,600m Run in 8 Minutes",
        longJump: isHi ? "लंबी कूद: पुरुष 14 फीट | महिला 10 फीट" : "Long Jump: Male 14 Feet | Female 10 Feet",
        highJump: isHi ? "ऊंची कूद: पुरुष 3 फीट 9 इंच | महिला 3 फीट" : "High Jump: Male 3 Feet 9 Inches | Female 3 Feet"
      },
      selectionStages: isHi ? [
        "चरण 1: कंप्यूटर आधारित परीक्षा (CBT - 100 प्रश्न, 100 अंक)",
        "चरण 2: शारीरिक मानक एवं दक्षता परीक्षा (PE&MT)",
        "चरण 3: वैध LMV ड्राइविंग लाइसेंस व मूल दस्तावेज सत्यापन",
        "चरण 4: चिकित्सा परीक्षण (Medical Examination)"
      ] : [
        "Stage 1: Computer Based Examination (CBT - 100 Qs, 100 Marks)",
        "Stage 2: Physical Endurance & Measurement Test (PE&MT)",
        "Stage 3: Valid LMV Driving License & Document Verification",
        "Stage 4: Medical Examination"
      ],
      mockSubject: "Police Exams"
    };
  }

  // =========================================================================
  // 6. SSC GD CONSTABLE (GENERAL DUTY)
  // =========================================================================
  if (/ssc\s*gd|constable\s*\(?gd\)?|general\s*duty/i.test(allText)) {
    return {
      examName: isHi
        ? "एसएससी जीडी कांस्टेबल कंप्यूटर आधारित परीक्षा (SSC GD CBT)"
        : "SSC GD Constable Computer Based Examination (SSC GD CBT)",
      mode: isHi ? "ऑनलाइन कंप्यूटर आधारित परीक्षा (Online CBT)" : "Online CBT (Computer Based Test)",
      duration: isHi ? "60 मिनट (1 घंटा)" : "60 Minutes (1 Hour)",
      totalQuestions: isHi ? "80 बहुविकल्पीय प्रश्न" : "80 Multiple Choice Questions",
      totalMarks: isHi ? "160 अंक (प्रत्येक सही उत्तर 2 अंक)" : "160 Marks (2 Marks each)",
      negativeMarking: isHi ? "0.25 (1/8th) प्रत्येक गलत उत्तर पर नकारात्मक अंकन" : "-0.25 Mark for each wrong answer",
      medium: isHi ? "हिंदी, अंग्रेजी और 13 क्षेत्रीय भाषाएं" : "English, Hindi & 13 Regional Languages",
      pattern: [
        {
          subject: isHi ? "सामान्य बुद्धिमत्ता व तर्कशक्ति" : "General Intelligence & Reasoning",
          questions: 20,
          marks: 40
        },
        {
          subject: isHi ? "सामान्य ज्ञान व सामान्य जागरूकता" : "General Knowledge & General Awareness",
          questions: 20,
          marks: 40
        },
        {
          subject: isHi ? "प्रारंभिक गणित" : "Elementary Mathematics",
          questions: 20,
          marks: 40
        },
        {
          subject: isHi ? "अंग्रेजी अथवा हिंदी भाषा" : "General English or General Hindi",
          questions: 20,
          marks: 40
        }
      ],
      topics: [
        {
          subject: isHi ? "🧠 सामान्य बुद्धिमत्ता व तर्कशक्ति (20 प्रश्न / 40 अंक)" : "🧠 General Intelligence & Reasoning (20 Qs / 40 Marks)",
          items: isHi
            ? "सादृश्यता, समानताएं और भेद, स्थानिक दृश्यीकरण, स्थानिक उन्मुखीकरण, दृश्य स्मृति, भेदभाव, अवलोकन, संबंध अवधारणाएं, अंकगणितीय तर्क और चित्रात्मक वर्गीकरण, अंकगणितीय संख्या श्रृंखला, गैर-मौखिक श्रृंखला, कोडिंग और डिकोडिंग।"
            : "Analogies, Similarities and Differences, Spatial Visualization, Spatial Orientation, Visual Memory, Discrimination, Observation, Relationship Concepts, Arithmetical Reasoning and Figural Classification, Arithmetic Number Series, Non-verbal Series, Coding and Decoding."
        },
        {
          subject: isHi ? "🏛️ सामान्य ज्ञान व सामान्य जागरूकता (20 प्रश्न / 40 अंक)" : "🏛️ General Knowledge & Awareness (20 Qs / 40 Marks)",
          items: isHi
            ? "भारत और उसके पड़ोसी देश, खेल, इतिहास, संस्कृति, भूगोल, आर्थिक परिदृश्य, सामान्य राजनीति, भारतीय संविधान, वैज्ञानिक अनुसंधान, 2026 की ताजा समसामयिक घटनाएं।"
            : "India and its neighboring countries, Sports, History, Culture, Geography, Economic Scene, General Polity, Indian Constitution, Scientific Research, Current Events 2026."
        },
        {
          subject: isHi ? "📐 प्रारंभिक गणित (20 प्रश्न / 40 अंक)" : "📐 Elementary Mathematics (20 Qs / 40 Marks)",
          items: isHi
            ? "संख्या प्रणाली से संबंधित समस्याएं, पूर्ण संख्याओं की गणना, दशमलव और भिन्न, संख्याओं के बीच संबंध, मौलिक अंकगणितीय संचालन, प्रतिशत, अनुपात और समानुपात, औसत, ब्याज, लाभ और हानि, छूट, क्षेत्रमिति, समय और दूरी, अनुपात और समय, समय और कार्य।"
            : "Number Systems, Computation of Whole Numbers, Decimals and Fractions, Fundamental Arithmetical Operations, Percentages, Ratio and Proportion, Averages, Interest, Profit and Loss, Discount, Mensuration, Time and Distance, Ratio and Time, Time and Work."
        },
        {
          subject: isHi ? "📖 अंग्रेजी अथवा हिंदी (20 प्रश्न / 40 अंक)" : "📖 English / Hindi Language (20 Qs / 40 Marks)",
          items: isHi
            ? "उम्मीदवारों की सही हिंदी/अंग्रेजी समझने की क्षमता और उनकी बुनियादी समझ का परीक्षण: व्याकरण, शब्दावली, पर्यायवाची, विलोम शब्द, त्रुटि पहचान, रिक्त स्थान भरें, मुहावरे, अपठित गद्यांश।"
            : "Testing candidate's ability to understand correct English/Hindi: Vocabulary, Grammar, Sentence Structure, Synonyms, Antonyms, Error Recognition, Fill in the Blanks, Idioms & Phrases, Reading Comprehension."
        }
      ],
      physicalStandards: {
        maleHeight: isHi ? "170 सेमी (सामान्य/ओबीसी/एससी), 162.5 सेमी (एसटी)" : "170 cm (General/OBC/SC), 162.5 cm (ST)",
        femaleHeight: isHi ? "157 सेमी (सामान्य/ओबीसी/एससी), 150 सेमी (एसटी)" : "157 cm (General/OBC/SC), 150 cm (ST)",
        maleChest: isHi ? "80 सेमी बिना फुलाए, 5 सेमी फुलाव अनिवार्य (एसटी: 76 सेमी)" : "80 cm unexpanded with min 5 cm expansion (ST: 76 cm)",
        runningMale: isHi ? "5 किलोमीटर दौड़ 24 मिनट में" : "5 km Run in 24 Minutes",
        runningFemale: isHi ? "1.6 किलोमीटर दौड़ 8 मिनट 30 सेकंड में" : "1.6 km Run in 8 Minutes 30 Seconds"
      },
      selectionStages: isHi ? [
        "चरण 1: कंप्यूटर आधारित परीक्षा (CBE - 80 प्रश्न, 160 अंक, 60 मिनट)",
        "चरण 2: शारीरिक मानक परीक्षण (PST) व शारीरिक दक्षता परीक्षा (PET)",
        "चरण 3: विस्तृत चिकित्सा परीक्षण (DME) व समीक्षा चिकित्सा (RME)",
        "चरण 4: मूल दस्तावेज सत्यापन (Document Verification)"
      ] : [
        "Stage 1: Computer Based Examination (CBE - 80 Qs, 160 Marks, 60 Mins)",
        "Stage 2: Physical Standard Test (PST) & Physical Efficiency Test (PET)",
        "Stage 3: Detailed Medical Examination (DME) & Review Medical",
        "Stage 4: Document Verification (DV)"
      ],
      mockSubject: "SSC & Police"
    };
  }

  // =========================================================================
  // 7. RAILWAY (ALP & TECHNICIAN)
  // =========================================================================
  if (/alp|technician|loco\s*pilot/i.test(allText)) {
    return {
      examName: isHi
        ? "आरआरबी सहायक लोको पायलट (ALP) व तकनीशियन CBT परीक्षा"
        : "RRB Assistant Loco Pilot (ALP) & Technician CBT Exam",
      mode: isHi ? "ऑनलाइन कंप्यूटर आधारित परीक्षा (Online CBT)" : "Online CBT (Computer Based Test)",
      duration: isHi ? "60 मिनट (CBT-1) | 90 मिनट (CBT-2 Part A)" : "60 Mins (CBT-1) | 90 Mins (CBT-2 Part A)",
      totalQuestions: isHi ? "75 प्रश्न (CBT-1 स्क्रीनिंग)" : "75 Questions (CBT-1 Screening)",
      totalMarks: isHi ? "75 अंक (प्रत्येक सही उत्तर 1 अंक)" : "75 Marks (1 Mark each)",
      negativeMarking: isHi ? "1/3rd अंक प्रत्येक गलत उत्तर पर" : "-0.33 (1/3rd) Negative Marking for each wrong answer",
      medium: isHi ? "द्विभाषी (हिंदी, अंग्रेजी व 13 क्षेत्रीय भाषाएं)" : "English, Hindi & 13 Regional Languages",
      pattern: [
        { subject: isHi ? "गणित (Mathematics)" : "Mathematics", questions: 20, marks: 20 },
        { subject: isHi ? "सामान्य बुद्धिमत्ता व तर्कशक्ति" : "General Intelligence & Reasoning", questions: 25, marks: 25 },
        { subject: isHi ? "सामान्य विज्ञान (भौतिकी, रसायन, जीव विज्ञान)" : "General Science (Physics, Chemistry, Biology)", questions: 20, marks: 20 },
        { subject: isHi ? "सामान्य जागरूकता एवं समसामयिकी" : "General Awareness & Current Affairs", questions: 10, marks: 10 }
      ],
      topics: [
        {
          subject: isHi ? "📐 गणित (20 अंक)" : "📐 Mathematics (20 Marks)",
          items: isHi
            ? "संख्या पद्धति, BODMAS, दशमलव, भिन्न, ल.स. व म.स., अनुपात व समानुपात, प्रतिशत, क्षेत्रमिति, समय और कार्य, समय और दूरी, साधारण और चक्रवृद्धि ब्याज, लाभ और हानि, बीजगणित, ज्यामिति और त्रिकोणमिति, प्राथमिक सांख्यिकी, वर्गमूल, आयु गणना, कैलेंडर व घड़ी, नल और टंकी।"
            : "Number System, BODMAS, Decimals, Fractions, LCM & HCF, Ratio & Proportion, Percentages, Mensuration, Time & Work, Time & Distance, Simple & Compound Interest, Profit & Loss, Algebra, Geometry, Trigonometry, Elementary Statistics, Square Root, Age Calculations, Calendar & Clock, Pipes & Cistern."
        },
        {
          subject: isHi ? "🧠 तर्कशक्ति (25 अंक)" : "🧠 General Intelligence & Reasoning (25 Marks)",
          items: isHi
            ? "सादृश्यता, वर्णमाला और संख्या श्रृंखला, कोडिंग और डिकोडिंग, गणितीय संक्रियाएं, रिश्ते, न्यायवाक्य, वेन आरेख, डेटा व्याख्या और पर्याप्तता, निष्कर्ष और निर्णय लेना, समानताएं और अंतर, विश्लेषणात्मक तर्क, वर्गीकरण, दिशाएं, कथन-तर्क और धारणाएं।"
            : "Analogies, Alphabetical & Number Series, Coding & Decoding, Mathematical Operations, Relationships, Syllogism, Jumbling, Venn Diagrams, Data Interpretation & Sufficiency, Conclusions & Decision Making, Similarities & Differences, Analytical Reasoning, Classification, Directions, Statement-Arguments & Assumptions."
        },
        {
          subject: isHi ? "🔬 सामान्य विज्ञान (20 अंक - 10वीं सीबीएसई स्तर)" : "🔬 General Science (20 Marks - 10th Standard)",
          items: isHi
            ? "भौतिकी (गति, कार्य, ऊर्जा, शक्ति, प्रकाश, ध्वनि, ऊष्मा, विद्युत, चुंबकत्व), रसायन विज्ञान (परमाणु संरचना, आवर्त सारणी, रासायनिक बंधन, अम्ल-क्षार-लवण, धातु-अधातु), जीव विज्ञान (कोशिका, मानव शरीर रचना, आनुवंशिकी, पादप क्रियाविज्ञान, रोग व पोषण)।"
            : "Physics (Motion, Work & Energy, Heat, Light, Sound, Electricity, Magnetism), Chemistry (Atomic Structure, Chemical Reactions, Periodic Table, Acids & Bases, Metals/Non-metals), Life Sciences / Biology (Human Body, Cell Structure, Plant & Animal Kingdom, Health & Diseases, Nutrition)."
        },
        {
          subject: isHi ? "🌍 सामान्य जागरूकता (10 अंक)" : "🌍 General Awareness (10 Marks)",
          items: isHi
            ? "राष्ट्रीय और अंतर्राष्ट्रीय महत्व की समसामयिक घटनाएं 2026, विज्ञान और प्रौद्योगिकी, खेलकूद, भारतीय संस्कृति, प्रमुख हस्तियां, अर्थव्यवस्था, राजनीति और भारतीय रेलवे से संबंधित तथ्य।"
            : "Current Events of National & International Importance, Science & Technology, Sports, Culture, Personalities, Economics, Politics, Indian Railways Milestones."
        }
      ],
      selectionStages: isHi ? [
        "चरण 1: प्रथम चरण CBT (स्क्रीनिंग टेस्ट - 75 प्रश्न, 60 मिनट)",
        "चरण 2: द्वितीय चरण CBT (Part A मेरिट 100 प्रश्न + Part B ट्रेड क्वालिफाइंग 75 प्रश्न)",
        "चरण 3: कंप्यूटर आधारित योग्यता परीक्षा CBAT (केवल ALP पद हेतु)",
        "चरण 4: मूल दस्तावेज सत्यापन एवं रेलवे मेडिकल (A-1 विजन स्तर)"
      ] : [
        "Stage 1: First Stage CBT (Screening Test - 75 Qs, 60 Mins)",
        "Stage 2: Second Stage CBT (Part A Merit 100 Qs + Part B Trade Qualifying 75 Qs)",
        "Stage 3: Computer Based Aptitude Test CBAT (For ALP only)",
        "Stage 4: Document Verification & Railway Medical Examination (A-1 Standard)"
      ],
      mockSubject: "Railways"
    };
  }

  // =========================================================================
  // 8. RAILWAY RPF (CONSTABLE & SUB-INSPECTOR)
  // =========================================================================
  if (/rpf|railway\s*protection\s*force/i.test(allText)) {
    return {
      examName: isHi
        ? "रेलवे सुरक्षा बल (RPF) आरक्षक व उप-निरीक्षक भर्ती CBT"
        : "Railway Protection Force (RPF) Constable & SI CBT Exam",
      mode: isHi ? "ऑनलाइन कंप्यूटर आधारित परीक्षा (Online CBT)" : "Online CBT (Computer Based Test)",
      duration: isHi ? "90 मिनट (1 घंटा 30 मिनट)" : "90 Minutes",
      totalQuestions: isHi ? "120 वस्तुनिष्ठ प्रश्न" : "120 Questions",
      totalMarks: isHi ? "120 अंक (प्रत्येक सही उत्तर 1 अंक)" : "120 Marks (1 Mark each)",
      negativeMarking: isHi ? "1/3rd अंक प्रत्येक गलत उत्तर पर" : "-0.33 (1/3rd) Negative Marking for each wrong answer",
      medium: isHi ? "द्विभाषी (हिंदी, अंग्रेजी व 13 भाषाएं)" : "Hindi, English & Regional Languages",
      pattern: [
        { subject: isHi ? "सामान्य जागरूकता" : "General Awareness", questions: 50, marks: 50 },
        { subject: isHi ? "अंकगणित" : "Arithmetic", questions: 35, marks: 35 },
        { subject: isHi ? "सामान्य बुद्धिमत्ता व तर्कशक्ति" : "General Intelligence & Reasoning", questions: 35, marks: 35 }
      ],
      topics: [
        {
          subject: isHi ? "🏛️ सामान्य जागरूकता (50 अंक)" : "🏛️ General Awareness (50 Marks)",
          items: isHi
            ? "भारतीय इतिहास, कला एवं संस्कृति, भूगोल, अर्थशास्त्र, सामान्य राजनीति, भारतीय संविधान, खेलकूद, सामान्य विज्ञान (10वीं कक्षा तक), 2026 की ताजा समसामयिकी।"
            : "Indian History, Art & Culture, Geography, Economics, General Polity, Indian Constitution, Sports, General Science (Up to 10th Std), Latest 2026 Current Affairs."
        },
        {
          subject: isHi ? "📐 अंकगणित (35 अंक)" : "📐 Arithmetic (35 Marks)",
          items: isHi
            ? "संख्या प्रणाली, पूर्ण संख्याएं, दशमलव और भिन्न, प्रतिशत, अनुपात और समानुपात, औसत, ब्याज (साधारण व चक्रवृद्धि), लाभ और हानि, छूट, सारणी व ग्राफ का उपयोग, क्षेत्रमिति, समय और दूरी।"
            : "Number Systems, Whole Numbers, Decimals & Fractions, Percentages, Ratio & Proportion, Averages, Interest (Simple & Compound), Profit & Loss, Discount, Tables & Graphs, Mensuration, Time & Distance."
        },
        {
          subject: isHi ? "🧠 तर्कशक्ति (35 अंक)" : "🧠 General Intelligence & Reasoning (35 Marks)",
          items: isHi
            ? "सादृश्यता, स्थानिक दृश्यीकरण, समस्या समाधान विश्लेषण, निर्णय लेना, दृश्य स्मृति, भेदभावपूर्ण अवलोकन, संबंध अवधारणाएं, अंकगणितीय तर्क, कोडिंग-डिकोडिंग।"
            : "Analogies, Spatial Visualization, Spatial Orientation, Problem Solving Analysis, Judgment, Decision Making, Visual Memory, Discriminating Observation, Relationship Concepts, Arithmetical Reasoning, Coding-Decoding."
        }
      ],
      physicalStandards: {
        maleHeight: isHi ? "165 सेमी (सामान्य/ओबीसी), 160 सेमी (एससी/एसटी)" : "165 cm (General/OBC), 160 cm (SC/ST)",
        femaleHeight: isHi ? "157 सेमी (सामान्य/ओबीसी), 152 सेमी (एससी/एसटी)" : "157 cm (General/OBC), 152 cm (SC/ST)",
        maleChest: isHi ? "80 सेमी बिना फुलाए, 85 सेमी फुलाकर (न्यूनतम 5 सेमी फुलाव)" : "80 cm unexpanded, 85 cm expanded (Min 5 cm expansion)",
        runningMale: isHi ? "आरक्षक: 1,600m 5 मिनट 45 सेकंड में | SI: 6 मिनट 30 सेकंड में" : "Constable: 1,600m in 5 Min 45 Sec | SI: 1,600m in 6 Min 30 Sec",
        runningFemale: isHi ? "आरक्षक: 800m 3 मिनट 40 सेकंड में | SI: 4 मिनट में" : "Constable: 800m in 3 Min 40 Sec | SI: 800m in 4 Min",
        longJump: isHi ? "लंबी कूद: पुरुष 14 फीट | महिला 9 फीट" : "Long Jump: Male 14 Feet (Constable), 12 Feet (SI) | Female 9 Feet",
        highJump: isHi ? "ऊंची कूद: पुरुष 4 फीट | महिला 3 फीट" : "High Jump: Male 4 Feet (Constable), 3.9 Feet (SI) | Female 3 Feet"
      },
      selectionStages: isHi ? [
        "चरण 1: ऑनलाइन कंप्यूटर आधारित परीक्षा (CBT - 120 प्रश्न, 90 मिनट)",
        "चरण 2: शारीरिक दक्षता परीक्षा (PET) एवं शारीरिक माप परीक्षण (PMT)",
        "चरण 3: मूल दस्तावेज सत्यापन एवं मेडिकल परीक्षण"
      ] : [
        "Stage 1: Computer Based Test (CBT - 120 Qs, 90 Mins)",
        "Stage 2: Physical Efficiency Test (PET) & Physical Measurement Test (PMT)",
        "Stage 3: Document Verification & Medical Checkup"
      ],
      mockSubject: "Railways"
    };
  }

  // =========================================================================
  // 9. RAILWAY NTPC & GROUP D (RRB / RRC)
  // =========================================================================
  if (/railway|rrb|rrc|ntpc|group\s*d|trackman|pointsman/i.test(allText)) {
    return {
      examName: isHi
        ? "रेलवे भर्ती बोर्ड (RRB) गैर-तकनीकी (NTPC) व ग्रुप-D CBT परीक्षा"
        : "RRB NTPC & Group D Computer Based Recruitment Exam",
      mode: isHi ? "ऑनलाइन कंप्यूटर आधारित परीक्षा (Online CBT)" : "Online CBT (Computer Based Test)",
      duration: isHi ? "90 मिनट (1 घंटा 30 मिनट)" : "90 Minutes",
      totalQuestions: isHi ? "100 वस्तुनिष्ठ प्रश्न" : "100 Questions",
      totalMarks: isHi ? "100 अंक (प्रत्येक सही उत्तर 1 अंक)" : "100 Marks (1 Mark each)",
      negativeMarking: isHi ? "1/3rd अंक प्रत्येक गलत उत्तर पर" : "-0.33 (1/3rd) Negative Marking for each wrong answer",
      medium: isHi ? "द्विभाषी (हिंदी, अंग्रेजी व 13 क्षेत्रीय भाषाएं)" : "English, Hindi & 13 Regional Languages",
      pattern: [
        { subject: isHi ? "सामान्य जागरूकता" : "General Awareness", questions: 40, marks: 40 },
        { subject: isHi ? "गणित" : "Mathematics", questions: 30, marks: 30 },
        { subject: isHi ? "सामान्य बुद्धिमत्ता व तर्कशक्ति" : "General Intelligence & Reasoning", questions: 30, marks: 30 }
      ],
      topics: [
        {
          subject: isHi ? "🏛️ सामान्य जागरूकता (40 अंक)" : "🏛️ General Awareness (40 Marks)",
          items: isHi
            ? "राष्ट्रीय और अंतर्राष्ट्रीय महत्व की समसामयिक घटनाएं 2026, खेलकूद, भारत की कला और संस्कृति, भारतीय साहित्य, भारत के स्मारक और स्थान, सामान्य विज्ञान और जीवन विज्ञान (10वीं सीबीएसई तक), भारत का इतिहास और स्वतंत्रता संग्राम, भारत और विश्व का भौतिक, सामाजिक और आर्थिक भूगोल, भारतीय राजनीति और शासन- संविधान और राजनीतिक व्यवस्था।"
            : "Current Events of National & International Importance, Games & Sports, Art & Culture of India, Indian Literature, Monuments and Places of India, General Science & Life Science (up to 10th CBSE), History of India and Freedom Struggle, Physical, Social & Economic Geography of India and World, Indian Polity & Governance."
        },
        {
          subject: isHi ? "📐 गणित (30 अंक)" : "📐 Mathematics (30 Marks)",
          items: isHi
            ? "संख्या पद्धति, दशमलव, भिन्न, ल.स. व म.स., अनुपात और समानुपात, प्रतिशत, क्षेत्रमिति, समय और कार्य, समय और दूरी, साधारण और चक्रवृद्धि ब्याज, लाभ और हानि, प्रारंभिक बीजगणित, ज्यामिति और त्रिकोणमिति, प्राथमिक सांख्यिकी।"
            : "Number System, Decimals, Fractions, LCM, HCF, Ratio and Proportions, Percentage, Mensuration, Time and Work, Time and Distance, Simple and Compound Interest, Profit and Loss, Elementary Algebra, Geometry and Trigonometry, Elementary Statistics."
        },
        {
          subject: isHi ? "🧠 तर्कशक्ति (30 अंक)" : "🧠 General Intelligence & Reasoning (30 Marks)",
          items: isHi
            ? "सादृश्यता, संख्या और वर्णमाला श्रृंखला को पूरा करना, कोडिंग और डिकोडिंग, गणितीय संक्रियाएं, समानताएं और अंतर, संबंध, विश्लेषणात्मक तर्क, न्यायवाक्य, वेन आरेख, पहेली, डेटा पर्याप्तता, कथन-निष्कर्ष।"
            : "Analogies, Completion of Number and Alphabetical Series, Coding and Decoding, Mathematical Operations, Similarities and Differences, Relationships, Analytical Reasoning, Syllogism, Jumbling, Venn Diagrams, Puzzle, Data Sufficiency, Statement-Conclusion."
        }
      ],
      selectionStages: isHi ? [
        "चरण 1: प्रथम चरण CBT (स्क्रीनिंग टेस्ट - 100 प्रश्न)",
        "चरण 2: द्वितीय चरण CBT (मुख्य परीक्षा - 120 प्रश्न)",
        "चरण 3: टाइपिंग स्किल टेस्ट / कंप्यूटर आधारित एप्टीट्यूड टेस्ट (पदानुसार)",
        "चरण 4: मूल दस्तावेज सत्यापन एवं मेडिकल परीक्षण"
      ] : [
        "Stage 1: CBT-1 Computer Based Screening Exam (100 Qs)",
        "Stage 2: CBT-2 Computer Based Mains Exam (120 Qs)",
        "Stage 3: Typing Skill Test / Computer Aptitude Test (as per post)",
        "Stage 4: Document Verification & Medical Examination"
      ],
      mockSubject: "Railways"
    };
  }

  // =========================================================================
  // 10. SSC CGL / CHSL / MTS
  // =========================================================================
  if (/ssc|cgl|chsl|mts|havaldar|combined\s*graduate|combined\s*higher/i.test(allText)) {
    const isMTS = /mts|havaldar|multi\s*tasking/i.test(allText);
    if (isMTS) {
      return {
        examName: isHi
          ? "एसएससी एमटीएस व हवलदार कंप्यूटर आधारित परीक्षा (SSC MTS CBT)"
          : "SSC MTS & Havaldar Computer Based Examination",
        mode: isHi ? "ऑनलाइन कंप्यूटर आधारित परीक्षा (Online CBT)" : "Online CBT (Computer Based Test)",
        duration: isHi ? "90 मिनट (सत्र-1: 45 मिनट + सत्र-2: 45 मिनट)" : "90 Minutes (Session 1: 45 Mins + Session 2: 45 Mins)",
        totalQuestions: isHi ? "90 वस्तुनिष्ठ प्रश्न" : "90 Objective Questions",
        totalMarks: isHi ? "270 अंक (सत्र-1: 120 अंक + सत्र-2: 150 अंक)" : "270 Marks (Session 1: 120 Marks + Session 2: 150 Marks)",
        negativeMarking: isHi ? "सत्र-1 में शून्य | सत्र-2 में प्रत्येक गलत उत्तर पर 1 अंक कटेगा" : "Session 1: No Negative Marking | Session 2: -1 Mark for each wrong answer",
        medium: isHi ? "हिंदी, अंग्रेजी और 13 क्षेत्रीय भाषाएं" : "English, Hindi & 13 Regional Languages",
        pattern: [
          { subject: isHi ? "सत्र I: गणितीय क्षमता व समस्या निवारण" : "Session I: Numerical & Mathematical Ability", questions: 20, marks: 60 },
          { subject: isHi ? "सत्र I: तार्किक क्षमता व समस्या निवारण" : "Session I: Reasoning Ability & Problem Solving", questions: 20, marks: 60 },
          { subject: isHi ? "सत्र II: सामान्य जागरूकता (मेरिट घटक)" : "Session II: General Awareness (Merit Component)", questions: 25, marks: 75 },
          { subject: isHi ? "सत्र II: अंग्रेजी भाषा व समझ (मेरिट घटक)" : "Session II: English Language & Comprehension (Merit)", questions: 25, marks: 75 }
        ],
        topics: [
          {
            subject: isHi ? "📐 सत्र I: गणित एवं तर्कशक्ति (120 अंक - केवल क्वालिफाइंग)" : "📐 Session I: Math & Reasoning (120 Marks - Qualifying Only)",
            items: isHi
              ? "पूर्णांक और पूर्ण संख्याएं, ल.स. व म.स., दशमलव और भिन्न, संख्याओं के बीच संबंध, मौलिक अंकगणितीय संक्रियाएं, BODMAS, प्रतिशत, अनुपात और समानुपात, समय और कार्य, प्रत्यक्ष और व्युत्क्रमानुपाती, औसत, साधारण ब्याज, लाभ और हानि, छूट, बुनियादी ज्यामितीय आकृतियों का क्षेत्र और परिधि, समय और दूरी, रेखाएं और कोण। तर्कशक्ति: अल्फान्यूमेरिक श्रृंखला, कोडिंग और डिकोडिंग, सादृश्यता, दिशाएं, समानताएं और अंतर, वेन आरेख।"
              : "Integers and Whole Numbers, LCM & HCF, Decimals & Fractions, BODMAS, Percentages, Ratio and Proportion, Time and Work, Averages, Simple Interest, Profit and Loss, Discount, Mensuration, Time and Distance. Reasoning: Alphanumeric Series, Coding-Decoding, Analogies, Directions, Similarities & Differences, Venn Diagrams."
          },
          {
            subject: isHi ? "🌍 सत्र II: सामान्य जागरूकता (75 अंक - अंतिम मेरिट इसी से बनेगी)" : "🌍 Session II: General Awareness (75 Marks - Merit Deciding)",
            items: isHi
              ? "सामाजिक अध्ययन (इतिहास, भूगोल, कला और संस्कृति, नागरिक शास्त्र, अर्थशास्त्र), पर्यावरण अध्ययन और सामान्य विज्ञान (10वीं कक्षा स्तर तक), 2026 की महत्वपूर्ण राष्ट्रीय व अंतर्राष्ट्रीय समसामयिक घटनाएं।"
              : "Social Studies (History, Geography, Art and Culture, Civics, Economics), Environmental Studies and General Science up to 10th standard, 2026 National & International Current Affairs."
          },
          {
            subject: isHi ? "📖 सत्र II: अंग्रेजी भाषा व समझ (75 अंक - अंतिम मेरिट घटक)" : "📖 Session II: English Language & Comprehension (75 Marks - Merit Deciding)",
            items: isHi
              ? "अंग्रेजी भाषा की बुनियादी समझ, शब्दावली, व्याकरण, वाक्य संरचना, समानार्थी शब्द, विलोम शब्द और उसका सही उपयोग आदि और समझ का परीक्षण करने के लिए एक सरल गद्यांश दिया जा सकता है।"
              : "Candidates' understanding of the basics of English Language: Vocabulary, Grammar, Sentence Structure, Synonyms, Antonyms and its correct usage, Comprehension Passages."
          }
        ],
        selectionStages: isHi ? [
          "चरण 1: कंप्यूटर आधारित परीक्षा (CBT - दोनों सत्र एक ही दिन अनिवार्य)",
          "चरण 2: शारीरिक दक्षता परीक्षा (PET/PST - केवल हवलदार पद हेतु)",
          "चरण 3: मूल दस्तावेज सत्यापन (Document Verification)"
        ] : [
          "Stage 1: Computer Based Examination (CBT - Both sessions mandatory)",
          "Stage 2: Physical Standard & Efficiency Test (Havaldar post only)",
          "Stage 3: Document Verification (DV)"
        ],
        mockSubject: "SSC & Police"
      };
    }

    // Default SSC CGL / CHSL
    return {
      examName: isHi
        ? "कर्मचारी चयन आयोग (SSC) CGL / CHSL टियर-1 संयुक्त परीक्षा"
        : "SSC CGL / CHSL Tier-1 Computer Based Examination",
      mode: isHi ? "ऑनलाइन कंप्यूटर आधारित परीक्षा (Online CBT)" : "Online CBT (Computer Based Test)",
      duration: isHi ? "60 मिनट (1 घंटा)" : "60 Minutes (1 Hour)",
      totalQuestions: isHi ? "100 बहुविकल्पीय प्रश्न" : "100 Objective Questions",
      totalMarks: isHi ? "200 अंक (प्रत्येक सही उत्तर 2 अंक)" : "200 Marks (2 Marks each)",
      negativeMarking: isHi ? "0.50 अंक प्रत्येक गलत उत्तर पर" : "-0.50 Mark for each wrong answer",
      medium: isHi ? "द्विभाषी (हिंदी व अंग्रेजी)" : "Bilingual (Hindi / English)",
      pattern: [
        { subject: isHi ? "सामान्य बुद्धिमत्ता व तर्कशक्ति" : "General Intelligence & Reasoning", questions: 25, marks: 50 },
        { subject: isHi ? "सामान्य जागरूकता" : "General Awareness", questions: 25, marks: 50 },
        { subject: isHi ? "मात्रात्मक रुझान (Quantitative Aptitude)" : "Quantitative Aptitude", questions: 25, marks: 50 },
        { subject: isHi ? "अंग्रेजी भाषा व समझ (English Comprehension)" : "English Comprehension", questions: 25, marks: 50 }
      ],
      topics: [
        {
          subject: isHi ? "🧠 तर्कशक्ति (25 प्रश्न / 50 अंक)" : "🧠 General Intelligence & Reasoning (25 Qs / 50 Marks)",
          items: isHi
            ? "सादृश्यता, समानताएं और अंतर, अंतरिक्ष दृश्यीकरण, स्थानिक उन्मुखीकरण, समस्या समाधान, विश्लेषण, निर्णय, दृश्य स्मृति, भेदभाव, अवलोकन, संबंध अवधारणाएं, अंकगणितीय तर्क और लाक्षणिक वर्गीकरण, अंकगणितीय संख्या श्रृंखला, गैर-मौखिक श्रृंखला, कोडिंग और डिकोडिंग, कथन निष्कर्ष, न्यायवाक्य।"
            : "Analogies, Similarities & Differences, Space Visualization, Spatial Orientation, Problem Solving, Analysis, Judgment, Visual Memory, Discrimination, Observation, Relationship Concepts, Arithmetical Reasoning and Figural Classification, Arithmetic Number Series, Non-verbal Series, Coding and Decoding, Syllogisms."
        },
        {
          subject: isHi ? "🏛️ सामान्य जागरूकता (25 प्रश्न / 50 अंक)" : "🏛️ General Awareness (25 Qs / 50 Marks)",
          items: isHi
            ? "इतिहास, संस्कृति, भूगोल, आर्थिक परिदृश्य, सामान्य नीति, भारतीय संविधान, वैज्ञानिक अनुसंधान, 2026 की ताजा समसामयिक घटनाएं।"
            : "History, Culture, Geography, Economic Scene, General Policy, Indian Constitution, Scientific Research, Current Events 2026."
        },
        {
          subject: isHi ? "📐 मात्रात्मक रुझान (25 प्रश्न / 50 अंक)" : "📐 Quantitative Aptitude (25 Qs / 50 Marks)",
          items: isHi
            ? "पूर्ण संख्याएं, दशमलव, भिन्न, संख्याओं के बीच संबंध, प्रतिशत, अनुपात और समानुपात, वर्गमूल, औसत, ब्याज, लाभ और हानि, छूट, साझेदारी, मिश्रण, समय और दूरी, समय और कार्य, बुनियादी बीजगणितीय पहचान, रैखिक समीकरण, त्रिभुज, वृत्त, जीवाएं, स्पर्शरेखाएं, त्रिकोणमिति, ऊंचाई और दूरी, हिस्टोग्राम, बार आरेख और पाई चार्ट।"
            : "Whole Numbers, Decimals, Fractions, Percentages, Ratio and Proportion, Square Roots, Averages, Interest, Profit and Loss, Discount, Partnership Business, Mixture and Alligation, Time and Distance, Time and Work, Basic Algebraic Identities, Triangles, Circles, Chords, Tangents, Trigonometry, Heights and Distances, Histograms, Frequency Polygon, Bar Diagram & Pie Chart."
        },
        {
          subject: isHi ? "📖 अंग्रेजी समझ (25 प्रश्न / 50 अंक)" : "📖 English Comprehension (25 Qs / 50 Marks)",
          items: isHi
            ? "व्याकरण, शब्दावली, त्रुटि पहचान, रिक्त स्थान भरें, पर्यायवाची, विलोम शब्द, वर्तनी, मुहावरे और वाक्यांश, एक शब्द प्रतिस्थापन, वाक्यों में सुधार, सक्रिय/निष्क्रिय आवाज, प्रत्यक्ष/अप्रत्यक्ष कथन, वाक्य पुनर्व्यवस्था, क्लोज पैसेज, समझ गद्यांश।"
            : "Grammar, Vocabulary, Spot the Error, Fill in the Blanks, Synonyms, Antonyms, Spellings/Detecting Mis-spelt Words, Idioms & Phrases, One Word Substitution, Improvement of Sentences, Active/Passive Voice, Direct/Indirect Narration, Shuffling of Sentence Parts, Cloze Passage, Comprehension Passage."
        }
      ],
      selectionStages: isHi ? [
        "चरण 1: टियर-1 कंप्यूटर आधारित परीक्षा (100 प्रश्न, 200 अंक - क्वालिफाइंग)",
        "चरण 2: टियर-2 कंप्यूटर आधारित मुख्य परीक्षा (मेरिट आधारित + कंप्यूटर व टाइपिंग टेस्ट)",
        "चरण 3: मूल दस्तावेज सत्यापन एवं पद आवंटन"
      ] : [
        "Stage 1: Tier-1 CBT Examination (100 Qs, 200 Marks - Qualifying)",
        "Stage 2: Tier-2 CBT Mains Exam (Merit Deciding + Computer & Data Entry Speed Test)",
        "Stage 3: Document Verification & Post Allocation"
      ],
      mockSubject: "SSC & Police"
    };
  }

  // =========================================================================
  // 11. TEACHING (CTET, REET, UP TET, BPSC TRE, KVS)
  // =========================================================================
  if (/teacher|teaching|ctet|reet|tet|prt|tgt|pgt|kvs|dsssb|bpsc\s*tre/i.test(allText)) {
    return {
      examName: isHi
        ? "शिक्षक पात्रता व भर्ती परीक्षा (TET / PRT / TGT Pattern)"
        : "Teacher Eligibility & Recruitment Examination",
      mode: isHi ? "ऑफलाइन OMR / ऑनलाइन CBT परीक्षा" : "Offline OMR / Online CBT Examination",
      duration: isHi ? "150 मिनट (2 घंटे 30 मिनट)" : "150 Minutes (2 Hours 30 Mins)",
      totalQuestions: isHi ? "150 वस्तुनिष्ठ बहुविकल्पीय प्रश्न" : "150 Objective Questions",
      totalMarks: isHi ? "150 अंक (प्रत्येक सही उत्तर 1 अंक)" : "150 Marks (1 Mark each)",
      negativeMarking: isHi ? "कोई नकारात्मक अंकन नहीं (Zero Negative Marking)" : "No Negative Marking (0 Penalty)",
      medium: isHi ? "द्विभाषी (हिंदी व अंग्रेजी)" : "Bilingual (Hindi / English)",
      pattern: [
        { subject: isHi ? "बाल विकास एवं शिक्षाशास्त्र (CDP)" : "Child Development & Pedagogy (CDP)", questions: 30, marks: 30 },
        { subject: isHi ? "भाषा I (हिंदी/अनिवार्य भाषा)" : "Language I (Hindi / Mandatory Language)", questions: 30, marks: 30 },
        { subject: isHi ? "भाषा II (अंग्रेजी/संस्कृत)" : "Language II (English / Sanskrit)", questions: 30, marks: 30 },
        { subject: isHi ? "गणित व शिक्षण विधियां" : "Mathematics & Teaching Methods", questions: 30, marks: 30 },
        { subject: isHi ? "पर्यावरण अध्ययन / विषय विशेष (EVS / Subject)" : "Environmental Studies / Subject Domain", questions: 30, marks: 30 }
      ],
      topics: [
        {
          subject: isHi ? "🧠 बाल विकास एवं शिक्षाशास्त्र (30 अंक)" : "🧠 Child Development & Pedagogy (30 Marks)",
          items: isHi
            ? "बाल विकास की अवधारणा और अधिगम के साथ संबंध, बाल विकास के सिद्धांत, आनुवांशिकता और पर्यावरण का प्रभाव, पियाजे, कोहलबर्ग और वाइगोत्स्की के सिद्धांत, बाल-केंद्रित और प्रगतिशील शिक्षा, समावेशी शिक्षा, विशेष आवश्यकता वाले बच्चों की समझ, शिक्षण-अधिगम की बुनियादी प्रक्रियाएं।"
            : "Concept of Development and its Relationship with Learning, Principles of Child Development, Influence of Heredity & Environment, Piaget, Kohlberg and Vygotsky Theories, Child-Centered and Progressive Education, Inclusive Education, Understanding Children with Special Needs, Learning & Pedagogy."
        },
        {
          subject: isHi ? "📖 भाषा I व भाषा II (60 अंक)" : "📖 Language I & Language II (60 Marks)",
          items: isHi
            ? "अपठित गद्यांश एवं पद्यांश (बोध, व्याकरण एवं मौखिक योग्यता), भाषा शिक्षण के सिद्धांत, सुनने और बोलने की भूमिका, भाषा कौशल (सुनना, बोलना, पढ़ना, लिखना), शिक्षण सामग्री (पाठ्यपुस्तक, मल्टीमीडिया), उपचारात्मक शिक्षण।"
            : "Unseen Passages & Poems (Comprehension, Grammar, Verbal Ability), Principles of Language Teaching, Role of Listening and Speaking, Language Skills (LSRW), Teaching-Learning Materials (Textbooks, Multi-media), Remedial Teaching."
        },
        {
          subject: isHi ? "📐 गणित व पर्यावरण अध्ययन (60 अंक)" : "📐 Mathematics & Environmental Studies (60 Marks)",
          items: isHi
            ? "गणित: ज्यामिति, आकार और स्थानिक समझ, संख्याएं, जोड़ना और घटाना, गुणा, विभाजन, मापन, भार, समय, आयतन, डेटा प्रबंधन, पैटर्न, धन, गणितीय शिक्षाशास्त्र। पर्यावरण अध्ययन: परिवार और मित्र, पौधे, पशु, भोजन, आश्रय, जल, यात्रा, वस्तुएं जो हम बनाते हैं और करते हैं, पर्यावरण शिक्षाशास्त्र।"
            : "Mathematics: Geometry, Shapes & Spatial Understanding, Numbers, Addition & Subtraction, Multiplication, Division, Measurement, Weight, Time, Volume, Data Handling, Patterns, Money, Pedagogical Issues. EVS: Family and Friends, Plants, Animals, Food, Shelter, Water, Travel, Things We Make and Do, Environmental Pedagogy."
        }
      ],
      selectionStages: isHi ? [
        "चरण 1: पात्रता परीक्षा (TET Screening / 150 अंक)",
        "चरण 2: शिक्षक भर्ती मुख्य परीक्षा (TRE / Super TET / KVS Written Exam)",
        "चरण 3: कक्षा शिक्षण प्रदर्शन व साक्षात्कार (यदि लागू हो)",
        "चरण 4: मूल दस्तावेज सत्यापन एवं मेरिट सूची"
      ] : [
        "Stage 1: Eligibility Screening Test (TET Screening / 150 Qs)",
        "Stage 2: Main Teacher Recruitment Written Examination",
        "Stage 3: Teaching Demo & Interview (if applicable)",
        "Stage 4: Document Verification & Merit List"
      ],
      mockSubject: "Teaching Exams"
    };
  }

  // =========================================================================
  // 12. DEFENCE & AGNIVEER (ARMY, AIR FORCE, NAVY)
  // =========================================================================
  if (/agniveer|army|navy|air\s*force|iaf|defence|nda|cds/i.test(allText)) {
    return {
      examName: isHi
        ? "भारतीय सेना / वायुसेना / नौसेना अग्निवीर कॉमन एंट्रेंस एग्जाम (CEE)"
        : "Indian Armed Forces Agniveer Common Entrance Exam (CEE)",
      mode: isHi ? "ऑनलाइन कंप्यूटर आधारित परीक्षा (Online CEE)" : "Online Computer Based Examination (CEE)",
      duration: isHi ? "60 मिनट (1 घंटा)" : "60 Minutes (1 Hour)",
      totalQuestions: isHi ? "50 वस्तुनिष्ठ प्रश्न" : "50 Objective Questions",
      totalMarks: isHi ? "100 अंक (प्रत्येक सही उत्तर 2 अंक)" : "100 Marks (2 Marks each)",
      negativeMarking: isHi ? "0.50 अंक प्रत्येक गलत उत्तर पर (1/4th)" : "-0.50 Mark for each wrong answer",
      medium: isHi ? "द्विभाषी (हिंदी व अंग्रेजी)" : "Bilingual (Hindi / English)",
      pattern: [
        { subject: isHi ? "सामान्य ज्ञान" : "General Knowledge", questions: 15, marks: 30 },
        { subject: isHi ? "सामान्य विज्ञान" : "General Science", questions: 15, marks: 30 },
        { subject: isHi ? "गणित" : "Mathematics", questions: 15, marks: 30 },
        { subject: isHi ? "तार्किक तर्कशक्ति" : "Logical Reasoning", questions: 5, marks: 10 }
      ],
      topics: [
        {
          subject: isHi ? "🏛️ सामान्य ज्ञान व विज्ञान (60 अंक)" : "🏛️ General Knowledge & Science (60 Marks)",
          items: isHi
            ? "भारतीय इतिहास, भूगोल, भारतीय सशस्त्र बल, प्रमुख युद्ध, राष्ट्रीय प्रतीक, पुस्तकें व लेखक, खेलकूद, पुरस्कार, 2026 समसामयिकी। विज्ञान: भौतिकी, रसायन और जीव विज्ञान के बुनियादी दैनिक जीवन के सिद्धांत (10वीं स्तर)।"
            : "Indian History, Geography, Armed Forces, Battles, National Symbols, Books & Authors, Sports, Awards, 2026 Current Affairs. General Science: Basics of Physics, Chemistry & Biology of daily life (10th Standard)."
        },
        {
          subject: isHi ? "📐 गणित व तर्कशक्ति (40 अंक)" : "📐 Mathematics & Logical Reasoning (40 Marks)",
          items: isHi
            ? "संख्या पद्धति, ल.स. व म.स., दशमलव, प्रतिशत, अनुपात-समानुपात, लाभ और हानि, साधारण ब्याज, समय और कार्य, गति-दूरी, बीजगणित, क्षेत्रमिति। तर्कशक्ति: संख्या श्रृंखला, कोडिंग-डिकोडिंग, संबंध, दिशा ज्ञान।"
            : "Number System, HCF & LCM, Decimals, Percentages, Ratio-Proportion, Profit & Loss, Simple Interest, Time & Work, Speed & Distance, Algebra, Mensuration. Reasoning: Number Series, Coding-Decoding, Relations, Directions."
        }
      ],
      physicalStandards: {
        maleHeight: isHi ? "170 सेमी (क्षेत्रानुसार 168-170 सेमी)" : "170 cm (Relaxable as per regional standards)",
        femaleHeight: isHi ? "152 सेमी" : "152 cm",
        maleChest: isHi ? "77 सेमी (न्यूनतम 5 सेमी फुलाव अनिवार्य)" : "77 cm (Min 5 cm expansion required)",
        runningMale: isHi ? "1.6 किमी दौड़: ग्रुप-1 (5 मिनट 30 सेकंड - 60 अंक) | ग्रुप-2 (5 मिनट 45 सेकंड - 48 अंक)" : "1.6 km Run: Group-1 (5 Min 30 Sec - 60 Marks) | Group-2 (5 Min 45 Sec - 48 Marks)",
        runningFemale: isHi ? "1.6 किमी दौड़ 8 मिनट में" : "1.6 km Run in 8 Minutes",
        pullUps: isHi ? "बीम (पुल-अप्स): 10 पुल-अप्स (40 अंक) | 9 (33 अंक) | 8 (27 अंक) | 7 (21 अंक) | 6 (16 अंक)" : "Pull-ups: 10 (40 Marks) | 9 (33 Marks) | 8 (27 Marks) | 7 (21 Marks) | 6 (16 Marks)"
      },
      selectionStages: isHi ? [
        "चरण 1: ऑनलाइन कॉमन एंट्रेंस परीक्षा (CEE - 50 प्रश्न, 100 अंक)",
        "चरण 2: फिजिकल फिटनेस टेस्ट (1.6 किमी दौड़ + 10 पुल-अप्स + 9 फीट गड्ढा + जिग-जैग बैलेंस)",
        "चरण 3: शारीरिक माप परीक्षण (PST) व मूल दस्तावेज सत्यापन",
        "चरण 4: विस्तृत सैन्य चिकित्सा परीक्षण (Military Medical Examination)"
      ] : [
        "Stage 1: Online Common Entrance Exam (CEE - 50 Qs, 100 Marks)",
        "Stage 2: Physical Fitness Test PFT (1.6 km Run + 10 Pull-ups + 9-ft Ditch + Zig-zag Balance)",
        "Stage 3: Physical Measurement Test (PMT) & Document Verification",
        "Stage 4: Military Hospital Detailed Medical Examination"
      ],
      mockSubject: "Defence Exams"
    };
  }

  // =========================================================================
  // 13. BANKING & INSURANCE (SBI, IBPS, RBI, LIC)
  // =========================================================================
  if (/bank|ibps|sbi|rbi|clerk|po|officer|lic|insurance|nabard/i.test(allText)) {
    return {
      examName: isHi
        ? "बैंकिंग व वित्तीय संस्थान प्रारंभिक परीक्षा (IBPS / SBI Pattern)"
        : "Banking & Financial Services Preliminary Examination",
      mode: isHi ? "ऑनलाइन कंप्यूटर आधारित परीक्षा (Online CBT - सेक्शनल टाइमिंग)" : "Online CBT (Speed & Accuracy Based)",
      duration: isHi ? "60 मिनट (प्रत्येक सेक्शन 20 मिनट)" : "60 Minutes (Sectional 20 Mins each)",
      totalQuestions: isHi ? "100 वस्तुनिष्ठ प्रश्न" : "100 Questions",
      totalMarks: isHi ? "100 अंक (प्रत्येक सही उत्तर 1 अंक)" : "100 Marks (1 Mark each)",
      negativeMarking: isHi ? "0.25 (1/4th) की नेगेटिव मार्किंग" : "-0.25 (1/4th) Negative Marking",
      medium: isHi ? "द्विभाषी (हिंदी व अंग्रेजी)" : "English & Hindi",
      pattern: [
        { subject: isHi ? "अंग्रेजी भाषा" : "English Language", questions: 30, marks: 30 },
        { subject: isHi ? "संख्यात्मक अभियोग्यता (Quantitative Aptitude)" : "Quantitative Aptitude", questions: 35, marks: 35 },
        { subject: isHi ? "तर्कशक्ति क्षमता (Reasoning Ability)" : "Reasoning Ability", questions: 35, marks: 35 }
      ],
      topics: [
        {
          subject: isHi ? "📖 अंग्रेजी भाषा (30 प्रश्न - 20 मिनट)" : "📖 English Language (30 Qs - 20 Mins)",
          items: isHi
            ? "रीडिंग कॉम्प्रिहेंशन, क्लोज टेस्ट, त्रुटि पहचान, वाक्य पुनर्व्यवस्था, रिक्त स्थान भरें, शब्द स्वैप, वाक्यांश प्रतिस्थापन, शब्दावली।"
            : "Reading Comprehension, Cloze Test, Error Detection, Sentence Rearrangement / Para Jumbles, Fill in the Blanks, Word Swap, Phrase Replacement, Vocabulary."
        },
        {
          subject: isHi ? "📐 संख्यात्मक अभियोग्यता (35 प्रश्न - 20 मिनट)" : "📐 Quantitative Aptitude (35 Qs - 20 Mins)",
          items: isHi
            ? "सरलीकरण व सन्निकटन, संख्या श्रृंखला (मिसिंग व रॉन्ग), द्विघात समीकरण, डेटा व्याख्या (DI: बार ग्राफ, लाइन चार्ट, पाई चार्ट, केसलेट), अंकगणित (प्रतिशत, लाभ-हानि, साधारण व चक्रवृद्धि ब्याज, अनुपात, औसत, समय-कार्य, गति, मिश्रण)।"
            : "Simplification & Approximation, Number Series (Missing & Wrong), Quadratic Equations, Data Interpretation (Bar Graph, Line Chart, Pie Chart, Caselet), Arithmetic Word Problems (Percentage, Profit & Loss, Simple & Compound Interest, Ratio, Average, Time & Work, Speed, Mixture & Alligation)."
        },
        {
          subject: isHi ? "🧠 तर्कशक्ति क्षमता (35 प्रश्न - 20 मिनट)" : "🧠 Reasoning Ability (35 Qs - 20 Mins)",
          items: isHi
            ? "पजल्स व बैठक व्यवस्था (रैखिक, वृत्ताकार, फ्लोर, बॉक्स, माह-दिनांक), न्यायवाक्य, असमानता (Inequality), कोडिंग-डिकोडिंग, रक्त संबंध, दिशा परीक्षण, रैंकिंग, अल्फ़ान्यूमेरिक श्रृंखला।"
            : "Puzzles & Seating Arrangements (Linear, Circular, Floor, Box, Month-Date), Syllogism, Inequality, Coding-Decoding, Blood Relations, Direction Sense, Order & Ranking, Alpha-numeric-symbol Series."
        }
      ],
      selectionStages: isHi ? [
        "चरण 1: ऑनलाइन प्रारंभिक परीक्षा (100 अंक, 60 मिनट)",
        "चरण 2: ऑनलाइन मुख्य परीक्षा व वर्णनात्मक पत्र (225 अंक)",
        "चरण 3: साक्षात्कार / भाषा प्रवीणता परीक्षा (LPT)"
      ] : [
        "Stage 1: Preliminary Online Examination (100 Marks, 60 Mins)",
        "Stage 2: Mains Examination with Descriptive Paper (225 Marks)",
        "Stage 3: Interview / Language Proficiency Test (LPT)"
      ],
      mockSubject: "General Knowledge"
    };
  }

  // =========================================================================
  // 14. METRO RAIL (NMRC, DMRC, UPMRC, BMRCL)
  // =========================================================================
  if (/metro|nmrc|dmrc|upmrc|bmrcl|noida\s*metro|delhi\s*metro/i.test(allText)) {
    return {
      examName: isHi
        ? "मेट्रो रेल (NMRC / DMRC) स्टेशन नियंत्रक, ट्रेन ऑपरेटर व मेंटेनर परीक्षा"
        : "Metro Rail (NMRC/DMRC) Station Controller, Train Operator & Maintainer Exam",
      mode: isHi ? "ऑनलाइन कंप्यूटर आधारित परीक्षा (Online CBT)" : "Online CBT (Computer Based Test)",
      duration: isHi ? "120 मिनट (2 घंटे)" : "120 Minutes (2 Hours)",
      totalQuestions: isHi ? "120 बहुविकल्पीय प्रश्न" : "120 Multiple Choice Questions",
      totalMarks: isHi ? "120 अंक (प्रत्येक सही उत्तर 1 अंक)" : "120 Marks (1 Mark each)",
      negativeMarking: isHi ? "1/3rd अंक प्रत्येक गलत उत्तर पर" : "-0.33 (1/3rd) Negative Marking for each wrong answer",
      medium: isHi ? "द्विभाषी (हिंदी व अंग्रेजी)" : "Bilingual (Hindi / English)",
      pattern: [
        { subject: isHi ? "सेक्शन I: सामान्य अंग्रेजी" : "Section I: General English", questions: 15, marks: 15 },
        { subject: isHi ? "सेक्शन II: सामान्य जागरूकता व समसामयिकी" : "Section II: General Awareness & Current Affairs", questions: 15, marks: 15 },
        { subject: isHi ? "सेक्शन III: तार्किक क्षमता व मात्रात्मक रुझान" : "Section III: Logical Ability & Quantitative Aptitude", questions: 30, marks: 30 },
        { subject: isHi ? "सेक्शन IV: तकनीकी ट्रेड / डोमेन ज्ञान" : "Section IV: Technical Trade / Domain Knowledge", questions: 60, marks: 60 }
      ],
      topics: [
        {
          subject: isHi ? "📖 सेक्शन I: सामान्य अंग्रेजी (15 अंक)" : "📖 Section I: General English (15 Marks)",
          items: isHi
            ? "अपठित गद्यांश, व्याकरण, एक्टिव/पैसिव वॉइस, डायरेक्ट/इनडायरेक्ट स्पीच, मुहावरे और वाक्यांश, एक शब्द प्रतिस्थापन, वाक्य सुधार, पर्यायवाची और विलोम शब्द, वर्तनी त्रुटियां।"
            : "Comprehension passage, Grammar, Active/Passive Voice, Direct/Indirect Speech, Idioms & Phrases, One word substitution, Sentence Correction, Synonyms & Antonyms, Spelling errors."
        },
        {
          subject: isHi ? "🏛️ सेक्शन II: सामान्य जागरूकता (15 अंक)" : "🏛️ Section II: General Awareness (15 Marks)",
          items: isHi
            ? "2026 की महत्वपूर्ण समसामयिकी, खेलकूद, राष्ट्रीय एवं अंतर्राष्ट्रीय पुरस्कार, भारतीय संविधान, सामान्य विज्ञान, इतिहास, भूगोल, भारत में मेट्रो रेल नेटवर्क।"
            : "Current Events of 2026, Sports, National & International Awards, Indian Constitution, General Science (Physics, Chemistry, Biology), History, Geography, Metro Rail operations in India."
        },
        {
          subject: isHi ? "🧠 सेक्शन III: तार्किक क्षमता व गणित (30 अंक)" : "🧠 Section III: Logical Ability & Aptitude (30 Marks)",
          items: isHi
            ? "श्रृंखला, रक्त संबंध, न्यायवाक्य, कोडिंग-डिकोडिंग, वेन आरेख, संख्या पद्धति, सरलीकरण, अनुपात-समानुपात, प्रतिशत, लाभ-हानि, समय-कार्य, चाल-दूरी, क्षेत्रमिति।"
            : "Series, Blood Relations, Syllogisms, Coding-Decoding, Venn Diagrams, Number Systems, Simplification, Ratio & Proportion, Percentage, Profit & Loss, Time & Work, Speed & Distance, Mensuration."
        },
        {
          subject: isHi ? "🛠️ सेक्शन IV: तकनीकी विषय (60 अंक)" : "🛠️ Section IV: Technical Discipline (60 Marks)",
          items: isHi
            ? "डिप्लोमा / आईटीआई ट्रेड सिद्धांत: इलेक्ट्रिकल मशीनें, ट्रांसफॉर्मर, पावर सिस्टम, डिजिटल इलेक्ट्रॉनिक्स, माइक्रोप्रोसेसर, थर्मोडायनामिक्स, फ्लूइड मैकेनिक्स, इंस्ट्रुमेंटेशन और सुरक्षा नियम।"
            : "Circuit Theory, Electrical Machines, Transformers, Power Systems, Control Systems, Digital Electronics, Microprocessors, Basic Electronics, Thermodynamics, Strength of Materials, Machine Design, Fluid Mechanics, Measurements & Instrumentation, Safety Regulations."
        }
      ],
      selectionStages: isHi ? [
        "चरण 1: ऑनलाइन कंप्यूटर आधारित परीक्षा (CBT - 120 प्रश्न)",
        "चरण 2: साइको एप्टीट्यूड टेस्ट (स्टेशन नियंत्रक व ट्रेन ऑपरेटर हेतु)",
        "चरण 3: मूल दस्तावेज सत्यापन",
        "चरण 4: चिकित्सा परीक्षण (कड़े दृष्टि मानकों के साथ Aye-One स्तर)"
      ] : [
        "Stage 1: Computer Based Test (CBT - 120 Questions)",
        "Stage 2: Psycho Aptitude Test (For Station Controller / Train Operator)",
        "Stage 3: Document Verification",
        "Stage 4: Medical Fitness Examination (Aye-One category with strict vision standards)"
      ],
      mockSubject: "Technical / ITI"
    };
  }

  // =========================================================================
  // 15. ITI APPRENTICE & TECHNICIAN (BHEL, IOCL, ONGC, SAIL, LINEMAN)
  // =========================================================================
  if (/iti|apprentice|fitter|electrician|lineman|helper|bhel|sail|iocl|ongc|drdo/i.test(allText)) {
    return {
      examName: isHi
        ? "आईटीआई तकनीशियन व अप्रेंटिस चयन परीक्षा"
        : "ITI Technician / Apprentice Selection Examination",
      mode: isHi ? "ट्रेड CBT / 10वीं + आईटीआई मेरिट सत्यापन" : "Trade CBT / Academic Merit Selection",
      duration: isHi ? "90 से 120 मिनट" : "90 to 120 Minutes",
      totalQuestions: isHi ? "100 वस्तुनिष्ठ प्रश्न" : "100 Objective Questions",
      totalMarks: isHi ? "100 अंक (प्रत्येक सही उत्तर 1 अंक)" : "100 Marks (1 Mark each)",
      negativeMarking: isHi ? "CBT परीक्षा में 1/3rd | मेरिट में कोई नेगेटिव नहीं" : "1/3rd Negative Marking (in CBT) / None (in Merit)",
      medium: isHi ? "द्विभाषी (हिंदी व अंग्रेजी)" : "Bilingual (Hindi / English)",
      pattern: [
        { subject: isHi ? "ट्रेड थ्योरी (फिटर / इलेक्ट्रीशियन / वेल्डर / टर्नर / मशीनिस्ट)" : "Core Trade Theory (Fitter / Electrician / Welder / Machinist)", questions: 50, marks: 50 },
        { subject: isHi ? "कार्यशाला गणना व विज्ञान" : "Workshop Calculation & Science", questions: 20, marks: 20 },
        { subject: isHi ? "इंजीनियरिंग ड्राइंग व तकनीकी सुरक्षा" : "Engineering Drawing & Technical Safety", questions: 15, marks: 15 },
        { subject: isHi ? "सामान्य जागरूकता व एम्प्लॉयबिलिटी स्किल्स" : "General Awareness & Employability Skills", questions: 15, marks: 15 }
      ],
      topics: [
        {
          subject: isHi ? "🛠️ कोर ट्रेड थ्योरी (50 अंक)" : "🛠️ Core Trade Theory (50 Marks)",
          items: isHi
            ? "फिटर: हैंड टूल्स, मापक यंत्र (वर्नियर, माइक्रोमीटर), फिटिंग ऑपरेशंस, खराद कार्य, गेज, ताप उपचार, फास्टनर्स, पाइप फिटिंग, हाइड्रोलिक्स। इलेक्ट्रीशियन: ओम का नियम, डीसी परिपथ, एसी मूल सिद्धांत, चुंबकत्व, ट्रांसफॉर्मर, मोटर व जनरेटर, वाइंडिंग, अर्थिंग, वायरिंग नियम।"
            : "Fitter: Hand Tools, Measuring Instruments (Vernier, Micrometer), Fitting Operations, Lathe Work, Gauges, Heat Treatment, Fasteners, Pipe Fitting, Hydraulics & Pneumatics. Electrician: Ohm's Law, DC Circuits, AC Fundamentals, Magnetism, Transformers, Motors & Generators, 3-Phase Induction Motors, Winding, Earthing, Wiring Regulations."
        },
        {
          subject: isHi ? "📐 कार्यशाला गणना व विज्ञान (20 अंक)" : "📐 Workshop Calculation & Science (20 Marks)",
          items: isHi
            ? "इकाइयां और भिन्न, वर्गमूल, अनुपात-समानुपात, प्रतिशत, पदार्थ विज्ञान, द्रव्यमान, भार और घनत्व, गति और वेग, कार्य, शक्ति और ऊर्जा, ऊष्मा और तापमान, बुनियादी विद्युत, त्रिकोणमिति।"
            : "Units & Fractions, Square Roots, Ratio & Proportion, Percentage, Material Science (Ferrous/Non-ferrous Metals), Mass, Weight & Density, Speed & Velocity, Work, Power & Energy, Heat & Temperature, Basic Electricity, Trigonometry."
        },
        {
          subject: isHi ? "📐 इंजीनियरिंग ड्राइंग व सुरक्षा (30 अंक)" : "📐 Engineering Drawing & Workshop Safety (30 Marks)",
          items: isHi
            ? "ड्राइंग उपकरण, रेखाएं, ज्यामितीय आकृतियां, पैमाना, प्रक्षेप (ऑर्थोग्राफिक व आइसोमेट्रिक), विद्युत/इलेक्ट्रॉनिक प्रतीक। सुरक्षा अभ्यास, प्राथमिक चिकित्सा, बुनियादी कंप्यूटर साक्षरता, गुणवत्ता उपकरण (5S, काइज़न)।"
            : "Drawing Instruments, Lines, Geometrical Figures, Lettering, Scales, Projections (Orthographic & Isometric), Fasteners, Electrical/Electronic Symbols, Workshop Safety, First Aid, Computer Literacy, Quality Tools (5S, Kaizen)."
        }
      ],
      selectionStages: isHi ? [
        "चरण 1: लिखित परीक्षा / CBT अथवा 10वीं + ITI प्राप्तांकों की मेरिट सूची",
        "चरण 2: ट्रेड प्रैक्टिकल स्किल टेस्ट (क्वालिफाइंग प्रकृति)",
        "चरण 3: मूल दस्तावेज सत्यापन (NTC / NAC सर्टिफिकेट जांच)",
        "चरण 4: मेडिकल फिटनेस प्रमाण पत्र"
      ] : [
        "Stage 1: Written CBT or 10th+ITI Academic Merit Score",
        "Stage 2: Trade Practical Skill Test (Qualifying)",
        "Stage 3: Original Document Verification (NTC / NAC Certificate Check)",
        "Stage 4: Medical Fitness Certificate"
      ],
      mockSubject: "Technical / ITI"
    };
  }

  // =========================================================================
  // 16. DEFAULT SARKARI / STATE PSC / GENERAL RECRUITMENT
  // =========================================================================
  return {
    examName: isHi
      ? `${job.dept || 'सरकारी विभाग'} भर्ती परीक्षा पैटर्न`
      : `${job.dept || 'Government'} Recruitment Examination Pattern`,
    mode: isHi ? "वस्तुनिष्ठ बहुविकल्पीय परीक्षा (OMR / CBT)" : "Objective Multiple Choice Test (OMR / CBT)",
    duration: isHi ? "120 मिनट (2 घंटे)" : "120 Minutes (2 Hours)",
    totalQuestions: isHi ? "100 वस्तुनिष्ठ प्रश्न" : "100 Objective Questions",
    totalMarks: isHi ? "100 अंक (प्रत्येक सही उत्तर 1 अंक)" : "100 Marks (1 Mark each)",
    negativeMarking: isHi ? "1/3rd अथवा 1/4th अंक प्रत्येक गलत उत्तर पर" : "1/3rd or 1/4th Mark deducted for each wrong answer",
    medium: isHi ? "द्विभाषी (हिंदी व अंग्रेजी)" : "Bilingual (Hindi / English)",
    pattern: [
      { subject: isHi ? "सामान्य अध्ययन व समसामयिकी" : "General Studies & Current Affairs", questions: 40, marks: 40 },
      { subject: isHi ? "मानसिक योग्यता व तर्कशक्ति" : "Mental Ability & Reasoning", questions: 25, marks: 25 },
      { subject: isHi ? "संख्यात्मक अभियोग्यता (गणित)" : "Quantitative Aptitude / Math", questions: 20, marks: 20 },
      { subject: isHi ? "सामान्य हिंदी अथवा अंग्रेजी" : "Language Comprehension (Hindi / English)", questions: 15, marks: 15 }
    ],
    topics: [
      {
        subject: isHi ? "🏛️ सामान्य अध्ययन व समसामयिकी (40 अंक)" : "🏛️ General Studies & Current Affairs (40 Marks)",
        items: isHi
          ? "भारत का इतिहास, स्वतंत्रता संग्राम, भारत एवं विश्व का भूगोल, भारतीय राजव्यवस्था और संविधान, भारतीय अर्थव्यवस्था, सामान्य विज्ञान (भौतिकी, रसायन, जीव विज्ञान), पर्यावरण एवं पारिस्थितिकी, राष्ट्रीय और अंतर्राष्ट्रीय समसामयिक घटनाएं 2026।"
          : "Indian History, Freedom Struggle, Indian and World Geography, Indian Polity and Constitution, Indian Economy, General Science (Physics, Chemistry, Biology), Environmental Ecology, National and International Current Affairs 2026."
      },
      {
        subject: isHi ? "🧠 तर्कशक्ति व मानसिक योग्यता (25 अंक)" : "🧠 Reasoning & Mental Ability (25 Marks)",
        items: isHi
          ? "मौखिक और गैर-मौखिक तर्कशक्ति, श्रृंखला, सादृश्यता, रक्त संबंध, कोडिंग-डिकोडिंग, दिशाएं, कथन और धारणाएं, आलोचनात्मक सोच।"
          : "Verbal and Non-verbal Reasoning, Series, Analogies, Blood Relations, Coding-Decoding, Directions, Statement and Assumptions, Critical Thinking."
      },
      {
        subject: isHi ? "📐 मात्रात्मक अभियोग्यता (20 अंक)" : "📐 Quantitative Aptitude (20 Marks)",
        items: isHi
          ? "संख्या पद्धति, प्रतिशत, अनुपात और समानुपात, लाभ और हानि, औसत, समय और कार्य, गति और दूरी, साधारण और चक्रवृद्धि ब्याज, बुनियादी क्षेत्रमिति।"
          : "Number Systems, Percentages, Ratio and Proportion, Profit and Loss, Averages, Time and Work, Speed and Distance, Simple and Compound Interest, Basic Mensuration."
      },
      {
        subject: isHi ? "📖 भाषा बोध (15 अंक)" : "📖 Language Comprehension (15 Marks)",
        items: isHi
          ? "व्याकरण, शब्दावली, पर्यायवाची, विलोम शब्द, मुहावरे और लोकोक्तियाँ, अपठित गद्यांश, वाक्य शुद्धि।"
          : "Grammar, Vocabulary, Synonyms, Antonyms, Idioms and Phrases, Comprehension passage, Sentence Correction."
      }
    ],
    selectionStages: isHi ? [
      "चरण 1: प्रतियोगी लिखित परीक्षा / CBT",
      "चरण 2: कौशल परीक्षा / टाइपिंग टेस्ट / शारीरिक परीक्षा (यदि लागू हो)",
      "चरण 3: मूल दस्तावेज सत्यापन एवं मेरिट सूची",
      "चरण 4: चिकित्सा स्वास्थ्य परीक्षण"
    ] : [
      "Stage 1: Written / Computer Based Competitive Examination",
      "Stage 2: Skill Test / Typing Test / Physical Test (if applicable)",
      "Stage 3: Document Verification & Merit List",
      "Stage 4: Medical Fitness Examination"
    ],
    mockSubject: "General Knowledge"
  };
}
