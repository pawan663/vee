// Official Exam Pattern & Syllabus Registry for VEE App
// Provides authentic subject-wise exam pattern, marks, time duration, negative marking, and detailed syllabus topics.

export function getJobSyllabus(job) {
  if (!job) return null;

  const title = (job.title || '').toLowerCase();
  const dept = (job.dept || '').toLowerCase();
  const qual = (job.qualification || '').toLowerCase();
  const category = (job.category || '').toLowerCase();
  const type = (job.type || '').toLowerCase();

  // 1. RAILWAY (ALP, Technician, NTPC, Group D, RPF)
  if (/railway|rrb|rrc|alp|technician|loco\s*pilot|ntpc|group\s*d|trackman|pointsman|rpf/i.test(title + ' ' + dept)) {
    const isALP = /alp|technician|loco/i.test(title);
    const isGroupD = /group\s*d|trackman/i.test(title);
    const isRPF = /rpf|constable|si/i.test(title);

    if (isALP) {
      return {
        examName: "RRB ALP & Technician CBT (Stage 1 & 2)",
        mode: "Online CBT (Computer Based Test)",
        duration: "60 Mins (CBT-1) | 90 Mins (CBT-2 Part A)",
        totalQuestions: "75 Questions (CBT-1)",
        totalMarks: "75 Marks",
        negativeMarking: "1/3rd Mark (-0.33) for each wrong answer",
        medium: "Bilingual (Hindi / English & 13 Regional Languages)",
        pattern: [
          { subject: "Mathematics / गणित", questions: 20, marks: 20 },
          { subject: "General Intelligence & Reasoning / रीजनिंग", questions: 25, marks: 25 },
          { subject: "General Science (Physics/Chemistry/Bio) / सामान्य विज्ञान", questions: 20, marks: 20 },
          { subject: "General Awareness & Current Affairs / करेंट अफेयर्स", questions: 10, marks: 10 }
        ],
        topics: [
          {
            subject: "📐 Mathematics (गणित)",
            items: "Number System, BODMAS, Decimals, Fractions, LCM & HCF, Ratio & Proportion, Percentages, Mensuration, Time & Work, Time & Distance, Simple & Compound Interest, Profit & Loss, Algebra, Geometry, Trigonometry, Elementary Statistics, Square Root, Age Calculations, Calendar & Clock, Pipes & Cistern."
          },
          {
            subject: "🧠 General Intelligence & Reasoning (तर्कशक्ति)",
            items: "Analogies, Alphabetical & Number Series, Coding & Decoding, Mathematical Operations, Relationships, Syllogism, Jumbling, Venn Diagrams, Data Interpretation & Sufficiency, Conclusions & Decision Making, Similarities & Differences, Analytical Reasoning, Classification, Directions, Statement-Arguments & Assumptions."
          },
          {
            subject: "🔬 General Science (सामान्य विज्ञान - 10th Standard)",
            items: "Physics (Motion, Work & Energy, Heat, Light, Sound, Electricity, Magnetism), Chemistry (Atomic Structure, Chemical Reactions, Periodic Table, Acids & Bases, Metals/Non-metals), Life Sciences / Biology (Human Body, Cell Structure, Plant & Animal Kingdom, Health & Diseases, Nutrition)."
          },
          {
            subject: "🌍 Current Affairs & GK (करेंट अफेयर्स)",
            items: "Current Events of National & International Importance, Science & Technology, Sports, Culture, Personalities, Economics, Politics and any other subject of importance."
          },
          {
            subject: "🛠️ Part-B: Trade Syllabus (ITI / Diploma)",
            items: "Fitter, Electrician, Electronic Mechanic, Machinist, Turner, Welder, Wireman, Motor Mechanic - as per DGET NCVT Standard."
          }
        ],
        selectionStages: [
          "Stage 1: First Stage CBT (Screening Test - 75 Qs)",
          "Stage 2: Second Stage CBT (Part A: Merit 100 Qs + Part B: Trade Qualifying 75 Qs)",
          "Stage 3: Computer Based Aptitude Test (CBAT - For ALP only)",
          "Stage 4: Document Verification & Medical Examination (A-1 Standard for ALP)"
        ],
        mockSubject: "Railways"
      };
    }

    if (isRPF) {
      return {
        examName: "Railway Protection Force (RPF) Constable & SI CBT",
        mode: "Online CBT (Computer Based Test)",
        duration: "90 Minutes",
        totalQuestions: "120 Questions",
        totalMarks: "120 Marks",
        negativeMarking: "1/3rd Mark for each wrong response",
        medium: "Hindi, English & Regional Languages",
        pattern: [
          { subject: "General Awareness (सामान्य ज्ञान)", questions: 50, marks: 50 },
          { subject: "Arithmetic (अंकगणित)", questions: 35, marks: 35 },
          { subject: "General Intelligence & Reasoning (रीजनिंग)", questions: 35, marks: 35 }
        ],
        topics: [
          {
            subject: "🏛️ General Awareness (50 Marks)",
            items: "Indian History, Art & Culture, Geography, Economics, General Polity, Indian Constitution, Sports, General Science (Up to 10th Std), Latest 2026 Current Affairs."
          },
          {
            subject: "📐 Arithmetic (35 Marks)",
            items: "Number Systems, Whole Numbers, Decimals & Fractions, Percentages, Ratio & Proportion, Averages, Interest (Simple & Compound), Profit & Loss, Discount, Use of Tables & Graphs, Mensuration, Time & Distance, Ratio & Proportion."
          },
          {
            subject: "🧠 General Intelligence & Reasoning (35 Marks)",
            items: "Analogies, Spatial Visualization, Spatial Orientation, Problem Solving Analysis, Judgment, Decision Making, Visual Memory, Discriminating Observation, Relationship Concepts, Arithmetical Reasoning, Verbal & Figure Classification, Arithmetic Number Series."
          }
        ],
        physicalStandards: {
          maleHeight: "165 cm (General/OBC), 160 cm (SC/ST)",
          femaleHeight: "157 cm (General/OBC), 152 cm (SC/ST)",
          maleChest: "80 cm unexpanded, 85 cm expanded (Min 5 cm expansion)",
          runningMale: "Constable: 1,600m in 5 Min 45 Sec | SI: 1,600m in 6 Min 30 Sec",
          runningFemale: "Constable: 800m in 3 Min 40 Sec | SI: 800m in 4 Min",
          longJump: "Male: 14 Feet (Constable), 12 Feet (SI) | Female: 9 Feet",
          highJump: "Male: 4 Feet (Constable), 3.9 Feet (SI) | Female: 3 Feet"
        },
        selectionStages: [
          "Stage 1: Computer Based Test (CBT - 120 Qs, 90 Mins)",
          "Stage 2: Physical Efficiency Test (PET) & Physical Measurement Test (PMT)",
          "Stage 3: Document Verification & Medical Checkup"
        ],
        mockSubject: "Railways"
      };
    }

    // Default RRB NTPC / Group D
    return {
      examName: "RRB NTPC & Group D (CBT Exam)",
      mode: "Online CBT (Computer Based Test)",
      duration: "90 Minutes",
      totalQuestions: "100 Questions",
      totalMarks: "100 Marks",
      negativeMarking: "1/3rd Negative Marking",
      medium: "Bilingual (Hindi / English)",
      pattern: [
        { subject: "General Awareness (सामान्य ज्ञान)", questions: 40, marks: 40 },
        { subject: "Mathematics (गणित)", questions: 30, marks: 30 },
        { subject: "General Intelligence & Reasoning", questions: 30, marks: 30 }
      ],
      topics: [
        {
          subject: "🏛️ General Awareness (40 Qs)",
          items: "Current Events of National & International Importance, Games & Sports, Art & Culture of India, Indian Literature, Monuments and Places of India, General Science & Life Science (up to 10th CBSE), History of India and Freedom Struggle, Physical, Social & Economic Geography of India and World, Indian Polity & Governance - Constitution & Political System, General Scientific & Technological Developments including Space & Nuclear Program of India, Environmental Issues Concerning India and World at Large, Basics of Computers and Computer Applications, Common Abbreviations, Transport Systems in India, Indian Economy, Famous Personalities of India and World, Flagship Government Programs, Flora & Fauna of India, Important Government and Public Sector Organizations of India."
        },
        {
          subject: "📐 Mathematics (30 Qs)",
          items: "Number System, Decimals, Fractions, LCM, HCF, Ratio and Proportions, Percentage, Mensuration, Time and Work, Time and Distance, Simple and Compound Interest, Profit and Loss, Elementary Algebra, Geometry and Trigonometry, Elementary Statistics."
        },
        {
          subject: "🧠 General Intelligence & Reasoning (30 Qs)",
          items: "Analogies, Completion of Number and Alphabetical Series, Coding and Decoding, Mathematical Operations, Similarities and Differences, Relationships, Analytical Reasoning, Syllogism, Jumbling, Venn Diagrams, Puzzle, Data Sufficiency, Statement-Conclusion, Statement-Courses of Action, Decision Making, Maps, Interpretation of Graphs."
        }
      ],
      selectionStages: [
        "Stage 1: CBT-1 Computer Based Screening Exam",
        "Stage 2: CBT-2 Computer Based Mains Exam",
        "Stage 3: Typing Skill Test / Computer Aptitude Test (as per post)",
        "Stage 4: Document Verification & Medical Examination"
      ],
      mockSubject: "Railways"
    };
  }

  // 2. METRO RAIL (NMRC, DMRC, UPMRC, BMRCL, Gujarat Metro)
  if (/metro|nmrc|dmrc|upmrc|bmrcl|noida\s*metro|delhi\s*metro/i.test(title + ' ' + dept)) {
    return {
      examName: "Metro Rail (NMRC/DMRC) Station Controller, Train Operator & Maintainer",
      mode: "Online CBT (Computer Based Test)",
      duration: "120 Minutes (2 Hours)",
      totalQuestions: "120 Multiple Choice Questions",
      totalMarks: "120 Marks",
      negativeMarking: "1/3rd Mark deducted for each wrong answer",
      medium: "Bilingual (Hindi / English)",
      pattern: [
        { subject: "Section I: General English (अंग्रेजी)", questions: 15, marks: 15 },
        { subject: "Section II: General Awareness & Current Affairs", questions: 15, marks: 15 },
        { subject: "Section III: Logical Ability & Quantitative Aptitude", questions: 30, marks: 30 },
        { subject: "Section IV: Domain Knowledge / Technical Trade (Diploma/ITI/Degree)", questions: 60, marks: 60 }
      ],
      topics: [
        {
          subject: "📖 Section I: General English",
          items: "Comprehension passage, Grammar, Active/Passive Voice, Direct/Indirect Speech, Idioms & Phrases, One word substitution, Sentence Correction, Synonyms & Antonyms, Spelling errors."
        },
        {
          subject: "🏛️ Section II: General Awareness & Current Affairs",
          items: "Current Events of 2026, Sports, National & International Awards, Indian Constitution, General Science (Physics, Chemistry, Biology), History, Geography, Metro Rail operations in India."
        },
        {
          subject: "🧠 Section III: Logical Ability & Aptitude",
          items: "Series, Blood Relations, Syllogisms, Coding-Decoding, Venn Diagrams, Number Systems, Simplification, Ratio & Proportion, Percentage, Profit & Loss, Time & Work, Speed & Distance, Mensuration."
        },
        {
          subject: "🛠️ Section IV: Technical Discipline (Electrical / Electronics / Mechanical / IT)",
          items: "Circuit Theory, Electrical Machines, Transformers, Power Systems, Control Systems, Digital Electronics, Microprocessors, Basic Electronics, Thermodynamics, Strength of Materials, Machine Design, Fluid Mechanics, Measurements & Instrumentation, Safety Regulations."
        }
      ],
      selectionStages: [
        "Stage 1: Computer Based Test (CBT - 120 Questions)",
        "Stage 2: Psycho Aptitude Test (For Station Controller / Train Operator)",
        "Stage 3: Document Verification",
        "Stage 4: Medical Fitness Examination (Aye-One category with strict vision standards)"
      ],
      mockSubject: "Technical / ITI"
    };
  }

  // 3. SSC & POLICE (SSC GD, Delhi Police, UP Police, Rajasthan Police, Bihar Police)
  if (/ssc|police|gd|constable|sub\s*inspector|si|daroga|delhi\s*police|up\s*police|bihar\s*police|rajasthan\s*police/i.test(title + ' ' + dept)) {
    const isDelhiPolice = /delhi\s*police/i.test(title + ' ' + dept);
    const isUPPolice = /up\s*police|uttar\s*pradesh/i.test(title + ' ' + dept);

    if (isDelhiPolice) {
      return {
        examName: "Delhi Police Constable (Executive) CBT Exam",
        mode: "Online CBT (Computer Based Examination)",
        duration: "90 Minutes",
        totalQuestions: "100 Objective Questions",
        totalMarks: "100 Marks",
        negativeMarking: "0.25 (1/4th) Negative Marking for each wrong answer",
        medium: "Bilingual (Hindi / English)",
        pattern: [
          { subject: "General Knowledge & Current Affairs (सामान्य ज्ञान)", questions: 50, marks: 50 },
          { subject: "Reasoning (तर्कशक्ति)", questions: 25, marks: 25 },
          { subject: "Numerical Ability / Mathematics (संख्यात्मक योग्यता)", questions: 15, marks: 15 },
          { subject: "Computer Fundamentals, MS Excel & Word, Internet", questions: 10, marks: 10 }
        ],
        topics: [
          {
            subject: "🏛️ General Knowledge & Current Affairs (50 Qs)",
            items: "Inventions in the World, Indian Parliament, Basic GK, Indian Economy, Geography, Physics, Chemistry, Biology, Indian History, Indian Culture, Environment, Famous Books & Authors, Important Days, Sports, Indian Constitution, 2026 National & International Current Affairs."
          },
          {
            subject: "🧠 Reasoning (25 Qs)",
            items: "Analogies, Similarities & Differences, Spatial Visualization, Spatial Orientation, Visual Memory, Discrimination, Observation, Relationship Concepts, Arithmetical Reasoning, Figural Classification, Arithmetic Number Series, Non-verbal Series, Coding and Decoding."
          },
          {
            subject: "📐 Numerical Ability (15 Qs)",
            items: "Number Systems, Computation of Whole Numbers, Decimals & Fractions, Fundamental Arithmetical Operations, Percentages, Ratio and Proportion, Averages, Interest, Profit and Loss, Discount, Mensuration, Time and Distance, Ratio and Time, Time and Work."
          },
          {
            subject: "💻 Computer Fundamentals (10 Qs)",
            items: "Elements of Word Processing (Word Processing Basics, Opening and Closing Documents, Text Creation, Formatting), MS Excel (Spreadsheet Basics, Cell Editing, Functions & Formulas), Communication (E-mail Basics, Sending/Receiving), Internet, WWW and Web Browsers (Internet, Services on Internet, URL, HTTP, FTP, Websites, Blogs, Search Engines)."
          }
        ],
        physicalStandards: {
          maleHeight: "170 cm (Relaxable by 5cm for Hill areas/ST/Sons of police staff)",
          femaleHeight: "157 cm (Relaxable by 2cm for Hill areas/SC/ST)",
          maleChest: "81 cm to 85 cm (Minimum 4 cm expansion)",
          runningMale: "Up to 30 Yrs: 1,600m in 6 Minutes | 30-40 Yrs: 7 Minutes",
          runningFemale: "Up to 30 Yrs: 1,600m in 8 Minutes | 30-40 Yrs: 9 Minutes",
          longJump: "Male: 14 Feet | Female: 10 Feet",
          highJump: "Male: 3 Feet 9 Inches | Female: 3 Feet"
        },
        selectionStages: [
          "Stage 1: Computer Based Examination (CBT - 100 Marks)",
          "Stage 2: Physical Endurance & Measurement Test (PE&MT)",
          "Stage 3: Document Verification & Driving License Check (Valid LMV License for Male candidates)",
          "Stage 4: Medical Examination"
        ],
        mockSubject: "SSC & Police"
      };
    }

    // General SSC GD / State Police
    return {
      examName: "SSC GD Constable / State Police Recruitment Exam",
      mode: "Online CBT / Written OMR Exam",
      duration: "60 Minutes (SSC GD) | 120 Minutes (State Police)",
      totalQuestions: "80 Questions (SSC GD) | 150 Questions (UP/State Police)",
      totalMarks: "160 Marks (2 Marks each in SSC GD)",
      negativeMarking: "0.25 (1/4th) Negative Marking",
      medium: "Bilingual (Hindi / English & 13 Regional Languages)",
      pattern: [
        { subject: "General Intelligence & Reasoning (सामान्य बुद्धिमत्ता)", questions: 20, marks: 40 },
        { subject: "General Knowledge & General Awareness (सामान्य ज्ञान)", questions: 20, marks: 40 },
        { subject: "Elementary Mathematics (प्रारंभिक गणित)", questions: 20, marks: 40 },
        { subject: "General English / General Hindi (अंग्रेजी / सामान्य हिंदी)", questions: 20, marks: 40 }
      ],
      topics: [
        {
          subject: "🧠 General Intelligence & Reasoning",
          items: "Analytical aptitude and ability to observe and distinguish patterns will be tested through questions principally of non-verbal type. Analogies, Similarities and Differences, Spatial Visualization, Spatial Orientation, Visual Memory, Discrimination, Observation, Relationship Concepts, Arithmetical Reasoning and Figural Classification, Arithmetic Number Series, Non-verbal Series, Coding and Decoding."
        },
        {
          subject: "🏛️ General Knowledge & Awareness",
          items: "Sports, History, Culture, Geography, Economic Scene, General Polity, Indian Constitution, Scientific Research, General Science, Current Events 2026."
        },
        {
          subject: "📐 Elementary Mathematics",
          items: "Number Systems, Computation of Whole Numbers, Decimals and Fractions, Fundamental Arithmetical Operations, Percentages, Ratio and Proportion, Averages, Interest, Profit and Loss, Discount, Mensuration, Time and Distance, Ratio and Time, Time and Work."
        },
        {
          subject: "📖 Hindi / English (Language)",
          items: "संधि और संधि विच्छेद, समास, उपसर्ग, प्रत्यय, पर्यायवाची शब्द, विलोम शब्द, अनेकार्थक शब्द, वाक्य-शुद्धि, मुहावरे और लोकोक्तियाँ, अपठित गद्यांश (Comprehension)."
        }
      ],
      physicalStandards: {
        maleHeight: "170 cm (General/OBC/SC), 162.5 cm (ST)",
        femaleHeight: "157 cm (General/OBC/SC), 150 cm (ST)",
        maleChest: "80 cm (Unexpanded) with min 5 cm expansion",
        runningMale: "5 Kilometers in 24 Minutes",
        runningFemale: "1.6 Kilometers in 8 Minutes 30 Seconds"
      },
      selectionStages: [
        "Stage 1: Computer Based Examination (CBE / Written Test)",
        "Stage 2: Physical Standard Test (PST) & Physical Efficiency Test (PET)",
        "Stage 3: Detailed Medical Examination (DME) & Review Medical",
        "Stage 4: Document Verification"
      ],
      mockSubject: "SSC & Police"
    };
  }

  // 4. ITI & APPRENTICE (Railway Apprentice, BHEL, IOCL, ONGC, Lineman)
  if (/iti|apprentice|fitter|electrician|lineman|helper|bhel|sail|iocl|ongc|drdo/i.test(title + ' ' + dept + ' ' + qual)) {
    return {
      examName: "ITI Technician / Apprentice Selection & Trade Assessment",
      mode: "Trade CBT / Merit-Based Verification (Direct Recruitment)",
      duration: "90 Minutes to 120 Minutes",
      totalQuestions: "100 Objective Questions",
      totalMarks: "100 Marks",
      negativeMarking: "1/3rd Negative Marking (in CBT exams) / None (in Apprentice Merit)",
      medium: "Bilingual (Hindi / English)",
      pattern: [
        { subject: "Core Trade Theory (Fitter / Electrician / Welder / Turner / Machinist)", questions: 50, marks: 50 },
        { subject: "Workshop Calculation & Science (कार्यशाला गणना व विज्ञान)", questions: 20, marks: 20 },
        { subject: "Engineering Drawing & Technical Safety (इंजीनियरिंग ड्राइंग)", questions: 15, marks: 15 },
        { subject: "General Awareness, Basic IT & Employability Skills", questions: 15, marks: 15 }
      ],
      topics: [
        {
          subject: "🛠️ Core Trade Theory (फिटर, इलेक्ट्रीशियन, वेल्डर व मैकेनिक)",
          items: "Fitter: Hand Tools, Measuring Instruments (Vernier, Micrometer), Fitting Operations, Lathe Work, Gauges, Heat Treatment, Fasteners, Pipe Fitting, Hydraulics & Pneumatics. Electrician: Ohm's Law, DC Circuits, AC Fundamentals, Magnetism, Transformers, DC Motors & Generators, 3-Phase Induction Motors, Winding, Earthing, Wiring Regulations, Illumination, Power Distribution."
        },
        {
          subject: "📐 Workshop Calculation & Science",
          items: "Units & Fractions, Square Roots, Ratio & Proportion, Percentage, Material Science (Ferrous/Non-ferrous Metals), Mass, Weight & Density, Speed & Velocity, Work, Power & Energy, Heat & Temperature, Basic Electricity, Levers & Simple Machines, Trigonometry."
        },
        {
          subject: "📐 Engineering Drawing",
          items: "Drawing Instruments, Lines, Geometrical Figures, Lettering & Numbering, Dimensioning, Scales, Projections (Orthographic & Isometric), Fasteners, Electrical/Electronic Symbols."
        },
        {
          subject: "💡 Employability Skills & Workshop Safety",
          items: "Safety Practices & Fire Fighting, First Aid, Basic Computer Literacy, English Literacy, Communication Skills, Occupational Safety & Health, Environment & Quality Tools (5S, Kaizen)."
        }
      ],
      selectionStages: [
        "Stage 1: Written Examination / CBT or 10th+ITI Academic Merit Score",
        "Stage 2: Trade Practical Skill Test (Qualifying Nature)",
        "Stage 3: Original Document Verification (NTC / NAC Certificate Check)",
        "Stage 4: Medical Fitness Certificate"
      ],
      mockSubject: "Technical / ITI"
    };
  }

  // 5. BANKING & INSURANCE (SBI, IBPS, RBI, LIC)
  if (/bank|ibps|sbi|rbi|clerk|po|officer|lic|insurance|nabard/i.test(title + ' ' + dept)) {
    return {
      examName: "Banking & Financial Services Preliminary Examination",
      mode: "Online CBT (Speed & Accuracy Based)",
      duration: "60 Minutes (Sectional 20 Mins each)",
      totalQuestions: "100 Questions",
      totalMarks: "100 Marks",
      negativeMarking: "0.25 (1/4th) Negative Marking",
      medium: "English & Hindi",
      pattern: [
        { subject: "English Language (अंग्रेजी भाषा)", questions: 30, marks: 30 },
        { subject: "Quantitative Aptitude (संख्यात्मक अभियोग्यता)", questions: 35, marks: 35 },
        { subject: "Reasoning Ability (तर्कशक्ति)", questions: 35, marks: 35 }
      ],
      topics: [
        {
          subject: "📖 English Language (30 Qs - 20 Mins)",
          items: "Reading Comprehension, Cloze Test, Error Detection, Sentence Rearrangement / Para Jumbles, Fill in the Blanks, Word Swap, Phrase Replacement, Vocabulary."
        },
        {
          subject: "📐 Quantitative Aptitude (35 Qs - 20 Mins)",
          items: "Simplification & Approximation, Number Series (Missing & Wrong), Quadratic Equations, Data Interpretation (Bar Graph, Line Chart, Pie Chart, Caselet), Arithmetic Word Problems (Percentage, Profit & Loss, Simple & Compound Interest, Ratio, Average, Time & Work, Speed, Mixture & Alligation)."
        },
        {
          subject: "🧠 Reasoning Ability (35 Qs - 20 Mins)",
          items: "Puzzles & Seating Arrangements (Linear, Circular, Floor, Box, Month-Date), Syllogism, Inequality, Coding-Decoding, Blood Relations, Direction Sense, Order & Ranking, Alpha-numeric-symbol Series."
        }
      ],
      selectionStages: [
        "Stage 1: Preliminary Online Examination (100 Marks)",
        "Stage 2: Mains Examination with Descriptive Paper (200+25 Marks)",
        "Stage 3: Interview / Language Proficiency Test (LPT)"
      ],
      mockSubject: "General Knowledge"
    };
  }

  // 6. DEFAULT SARKARI / STATE PSC / GENERAL RECRUITMENT
  return {
    examName: `${job.dept || 'Government'} Recruitment Examination Pattern`,
    mode: "Objective Multiple Choice Test (OMR / CBT)",
    duration: "120 Minutes (2 Hours)",
    totalQuestions: "100 to 150 Questions",
    totalMarks: "100 to 150 Marks",
    negativeMarking: "1/3rd or 1/4th Mark per wrong answer",
    medium: "Bilingual (Hindi / English)",
    pattern: [
      { subject: "General Studies & Current Affairs (सामान्य अध्ययन)", questions: 40, marks: 40 },
      { subject: "Mental Ability & Reasoning (तर्कशक्ति)", questions: 25, marks: 25 },
      { subject: "Quantitative Aptitude / Math (गणित)", questions: 20, marks: 20 },
      { subject: "Language Comprehension (Hindi & English)", questions: 15, marks: 15 }
    ],
    topics: [
      {
        subject: "🏛️ General Studies & Current Affairs",
        items: "Indian History, Freedom Struggle, Indian and World Geography, Indian Polity and Constitution, Indian Economy, General Science (Physics, Chemistry, Biology), Environmental Ecology, National and International Current Affairs 2026."
      },
      {
        subject: "🧠 Reasoning & Mental Ability",
        items: "Verbal and Non-verbal Reasoning, Series, Analogies, Blood Relations, Coding-Decoding, Directions, Statement and Assumptions, Critical Thinking."
      },
      {
        subject: "📐 Quantitative Aptitude",
        items: "Number Systems, Percentages, Ratio and Proportion, Profit and Loss, Averages, Time and Work, Speed and Distance, Simple and Compound Interest, Basic Mensuration."
      },
      {
        subject: "📖 Hindi & English Language",
        items: "Grammar, Vocabulary, Synonyms, Antonyms, Idioms and Phrases, Comprehension passage, Sentence Correction."
      }
    ],
    selectionStages: [
      "Stage 1: Written / Computer Based Competitive Examination",
      "Stage 2: Skill Test / Typing Test / Physical Test (if applicable)",
      "Stage 3: Document Verification & Merit List",
      "Stage 4: Medical Fitness Examination"
    ],
    mockSubject: "General Knowledge"
  };
}
