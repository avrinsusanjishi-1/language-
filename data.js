const IELTS_DATA = {
  missions: [
    "Speak 60 seconds clearly",
    "Learn 5 formal words",
    "Complete one listening quiz",
    "Write one Task 1 paragraph",
    "Use 2 idioms naturally",
    "Record a conference opening"
  ],
  coachTips: [
    "Malayalam speakers often speak fast when nervous. Slow down, pause after each idea, and stress the important word.",
    "Do not translate word-by-word from Malayalam. Build English using short professional chunks.",
    "For IELTS Speaking, every answer needs: direct answer + reason + example + result.",
    "Formal English is not difficult English. It is clear, polite, precise English.",
    "Use idioms only when they fit naturally. One good idiom is better than five forced idioms.",
    "For presentations, start with purpose: Today I would like to explain..., not Myself Anandhu coming from...",
    "Accent improvement is not about losing your identity. It is about being understood by international listeners."
  ],
  formalWords: [
    {simple:"big", formal:"significant", example:"This is a significant improvement."},
    {simple:"good", formal:"beneficial", example:"This policy is beneficial for students."},
    {simple:"bad", formal:"unfavourable", example:"The results were unfavourable."},
    {simple:"many", formal:"numerous", example:"Numerous students prefer online classes."},
    {simple:"use", formal:"utilise", example:"Companies utilise technology to save time."},
    {simple:"help", formal:"assist", example:"This course assists beginners."},
    {simple:"show", formal:"demonstrate", example:"The chart demonstrates a steady increase."},
    {simple:"start", formal:"commence", example:"The programme will commence next month."},
    {simple:"end", formal:"conclude", example:"The meeting concluded at 5 p.m."},
    {simple:"need", formal:"require", example:"Students require regular feedback."},
    {simple:"get", formal:"obtain", example:"Candidates can obtain higher scores with practice."},
    {simple:"tell", formal:"inform", example:"Please inform the team about the change."},
    {simple:"ask", formal:"request", example:"I would like to request additional details."},
    {simple:"buy", formal:"purchase", example:"Customers purchase products online."},
    {simple:"job", formal:"occupation", example:"Teaching is a respected occupation."},
    {simple:"think about", formal:"contemplate", example:"We must contemplate the long-term consequences of this decision."},
    {simple:"change", formal:"transform", example:"Digital tools have transformed the way professionals communicate."},
    {simple:"very important", formal:"paramount", example:"Clear communication is paramount in an international workplace."},
    {simple:"agree", formal:"concur", example:"I concur with the committee's recommendation."},
    {simple:"disagree", formal:"refute", example:"The researcher refuted the initial hypothesis with new data."},
    {simple:"say again", formal:"reiterate", example:"Allow me to reiterate the key objectives of this proposal."},
    {simple:"make worse", formal:"exacerbate", example:"Poor preparation can exacerbate anxiety before an IELTS test."},
    {simple:"make better", formal:"ameliorate", example:"Regular feedback can ameliorate a student's speaking performance."},
    {simple:"clear/obvious", formal:"evident", example:"It is evident that consistent practice leads to higher band scores."},
    {simple:"spread out", formal:"disseminate", example:"Universities disseminate research findings through academic journals."},
    {simple:"look into", formal:"scrutinise", example:"The committee will scrutinise all submitted applications."},
    {simple:"stop", formal:"cease", example:"The funding for the programme will cease at the end of the year."},
    {simple:"steady/regular", formal:"consistent", example:"Consistent effort is more effective than occasional intense study."},
    {simple:"very different", formal:"disparate", example:"Students come from disparate educational backgrounds."},
    {simple:"reduce", formal:"alleviate", example:"Technology can alleviate the pressure of administrative tasks."},
    {simple:"main/key", formal:"pivotal", example:"Communication skills play a pivotal role in career advancement."},
    {simple:"strange/unusual", formal:"anomalous", example:"The examiner noted an anomalous drop in fluency during Part 3."},
    {simple:"confusing", formal:"ambiguous", example:"Avoid ambiguous language in your IELTS writing tasks."},
    {simple:"accept", formal:"acknowledge", example:"It is important to acknowledge differing perspectives in an essay."},
    {simple:"connected to", formal:"pertinent", example:"Please ensure your examples are pertinent to the question."}

  ],
  idioms: [
    {idiom:"break the ice", meaning:"to make people feel comfortable at the beginning", malayalam:"ആദ്യത്തെ മടിപ്പ് മാറ്റുക", example:"A warm greeting can break the ice before a presentation.", use:"conference opening"},
    {idiom:"on the same page", meaning:"to have the same understanding", malayalam:"ഒരേ ധാരണയിൽ ഇരിക്കുക", example:"Before we begin, let us make sure we are on the same page.", use:"meetings"},
    {idiom:"a stepping stone", meaning:"a stage that helps you reach a bigger goal", malayalam:"വലിയ ലക്ഷ്യത്തിലേക്കുള്ള ഒരു പടി", example:"IELTS can be a stepping stone to global opportunities.", use:"self introduction"},
    {idiom:"raise the bar", meaning:"to improve the standard", malayalam:"നിലവാരം ഉയർത്തുക", example:"Regular speaking practice can raise the bar for your communication skills.", use:"professional development"},
    {idiom:"the bigger picture", meaning:"the overall situation, not only small details", malayalam:"മൊത്തം ചിത്രം / വലിയ ലക്ഷ്യം", example:"When choosing a career, we must look at the bigger picture.", use:"IELTS Speaking Part 3"},
    {idiom:"hit the ground running", meaning:"to start something energetically and effectively", malayalam:"തുടക്കത്തിൽ തന്നെ ശക്തമായി പ്രവർത്തിക്കുക", example:"After joining the course, I want to hit the ground running.", use:"goals"},
    {idiom:"learn the ropes", meaning:"to learn how something works", malayalam:"കാര്യങ്ങൾ മനസ്സിലാക്കുക", example:"At first, beginners need time to learn the ropes of IELTS.", use:"learning"},
    {idiom:"go the extra mile", meaning:"to make more effort than expected", malayalam:"കൂടുതൽ ശ്രമിക്കുക", example:"To improve pronunciation, students must go the extra mile.", use:"motivation"},
    {idiom:"a game changer", meaning:"something that changes a situation greatly", malayalam:"സ്ഥിതി മാറ്റിമറിക്കുന്ന കാര്യം", example:"Daily feedback can be a game changer for A1 learners.", use:"education"},
    {idiom:"in a nutshell", meaning:"in a short summary", malayalam:"ചുരുക്കത്തിൽ", example:"In a nutshell, confidence grows through practice.", use:"closing answers"}
  ],
  dailyLesson: {
    title: "Day 1: Introduce yourself like a professional",
    level: "A1 → B1 bridge",
    goal: "Stop saying only basic sentences and start speaking with purpose, identity and confidence.",
    malayalam: "സ്വയം പരിചയപ്പെടുത്തുമ്പോൾ പേര് മാത്രം പറയാതെ, നിങ്ങളുടെ ലക്ഷ്യം, കഴിവ്, പശ്ചാത്തലം എന്നിവ ചേർത്ത് പറയാൻ പഠിക്കുക.",
    teacher: [
      "Weak: My name is Rahul. I am from Kerala. I studied commerce.",
      "Better: My name is Rahul, and I am from Kerala. I have a background in commerce, and I am currently improving my English to build an international career.",
      "Professional: Good morning. My name is Rahul. I come from Kerala, a state known for education and global migration. I have a background in commerce, and I am developing my English communication skills so that I can work confidently in an international environment."
    ],
    practicePrompt: "Introduce yourself in 4 sentences. Include your name, place, background, goal and one strength.",
    modelAnswer: "Good morning. My name is Anu, and I come from Kerala. I have a background in nursing, and I am preparing for IELTS because I want to work in an international healthcare environment. One of my strengths is that I am patient and willing to learn. In a nutshell, I want to become a confident professional communicator, not just an exam candidate."
  },
  listeningTasks: [
    {
      id:"listen-campus",
      title:"Listening 1: Student support office",
      level:"A1-A2 friendly",
      transcript:"Good morning. Welcome to the student support office. If you are new to the campus, please collect your identity card from room 204. The office is open from nine thirty in the morning until four in the afternoon. Students who need help with accommodation should speak to Ms. Thomas before Friday.",
      teacher:"Listen for names, numbers, time and action words. In IELTS, small details change the answer.",
      questions:[
        {q:"Where should new students collect the identity card?", options:["Room 104","Room 204","Room 402"], answer:1, why:"The speaker says identity card from room 204."},
        {q:"What time does the office close?", options:["3:30 p.m.","4:00 p.m.","4:30 p.m."], answer:1, why:"The office is open until four in the afternoon."},
        {q:"Who should accommodation students speak to?", options:["Ms. Thomas","Mr. Joseph","The campus manager"], answer:0, why:"The speaker says students should speak to Ms. Thomas before Friday."}
      ]
    },
    {
      id:"listen-workshop",
      title:"Listening 2: Professional workshop announcement",
      level:"A2-B1",
      transcript:"The presentation skills workshop will begin at ten on Saturday morning. Participants should bring a notebook and a pen. The first session will focus on opening a speech, and the second session will cover how to answer questions from the audience. Please arrive ten minutes early so that we can start on time.",
      teacher:"For announcements, identify event, time, materials, session topics and instructions.",
      questions:[
        {q:"When will the workshop begin?", options:["9:50 on Saturday","10:00 on Saturday","10:00 on Sunday"], answer:1, why:"It will begin at ten on Saturday morning."},
        {q:"What should participants bring?", options:["Laptop and ID card","Notebook and pen","Certificate and photo"], answer:1, why:"The speaker says bring a notebook and a pen."},
        {q:"What is the second session about?", options:["Opening a speech","Grammar correction","Answering audience questions"], answer:2, why:"The second session covers how to answer questions from the audience."}
      ]
    }
  ],
  readingTasks: [
    {
      id:"reading-workplace",
      title:"Reading 1: Why clear communication matters",
      passage:"In many workplaces, technical knowledge alone is not enough. Employees also need to explain ideas clearly, listen to colleagues, and respond politely to questions. Clear communication reduces mistakes and builds trust. For international workers, English is often used as a bridge between people from different countries. Therefore, students who prepare for IELTS should not focus only on memorising answers. They should develop the ability to think, organise ideas and speak with confidence.",
      teacher:"Read the first sentence of each paragraph carefully. It usually gives the main idea. Underline words like therefore, however and because because they show logic.",
      questions:[
        {q:"What does the passage say is not enough in many workplaces?", options:["Technical knowledge alone","Good salary","Long experience"], answer:0, why:"The first sentence says technical knowledge alone is not enough."},
        {q:"Clear communication helps to...", options:["avoid all exams","reduce mistakes and build trust","replace technical skills"], answer:1, why:"The passage says it reduces mistakes and builds trust."},
        {q:"IELTS students should not only memorise answers because they need to...", options:["write faster only","think, organise ideas and speak confidently","speak without grammar"], answer:1, why:"The final sentence gives this reason."}
      ]
    },
    {
      id:"reading-kerala",
      title:"Reading 2: Kerala learners and global careers",
      passage:"Kerala has a long history of education, migration and professional ambition. Many learners study English because they want to work or study abroad. However, a common challenge is that students know grammar rules but hesitate to speak. Confidence improves when learners practise realistic situations such as interviews, hospital conversations, university seminars and public presentations. A useful English course should therefore connect exam preparation with real professional communication.",
      teacher:"This passage has a contrast: students know grammar but hesitate to speak. IELTS Reading often tests this type of relationship.",
      questions:[
        {q:"According to the passage, why do many learners study English?", options:["To avoid Malayalam","To work or study abroad","To become teachers only"], answer:1, why:"The passage says many want to work or study abroad."},
        {q:"What is a common challenge?", options:["They know grammar but hesitate to speak","They cannot read at all","They dislike education"], answer:0, why:"The passage directly states this challenge."},
        {q:"A useful course should connect IELTS with...", options:["only vocabulary lists","real professional communication","sports training"], answer:1, why:"The final sentence states this."}
      ]
    }
  ],
  writingTasks: [
    {
      id:"writing-task1-email",
      title:"General Training Task 1: Formal email",
      prompt:"You recently attended a training workshop. Write an email to the organiser. Thank them, explain what you learned, and suggest one improvement.",
      teacher:"Use this structure: greeting → reason for writing → appreciation → specific learning → polite suggestion → closing.",
      starter:"Dear Sir or Madam,\n\nI am writing to thank you for organising the recent training workshop. The session was particularly useful because...",
      model:"Dear Sir or Madam,\n\nI am writing to thank you for organising the recent presentation skills workshop. The session was extremely useful because it helped me understand how to open a speech confidently and respond to questions from an audience.\n\nI particularly appreciated the practical examples, as they made the lesson easy to follow. One small suggestion would be to include more speaking practice in pairs, so that participants can receive immediate feedback.\n\nThank you once again for your valuable guidance.\n\nYours faithfully,\nAnu Thomas"
    },
    {
      id:"writing-task2-opinion",
      title:"Task 2: Opinion essay paragraph",
      prompt:"Some people believe that speaking skills are more important than grammar for international workers. To what extent do you agree? Write one body paragraph.",
      teacher:"A strong paragraph needs: topic sentence → explanation → example → result. Do not write only opinion. Prove it.",
      starter:"Speaking skills are extremely important for international workers because...",
      model:"Speaking skills are extremely important for international workers because they allow employees to share ideas clearly in real situations. Although grammar is necessary, communication fails if a worker cannot explain a problem, ask for clarification or respond politely to a client. For example, a nurse working abroad may know medical vocabulary, but she also needs to reassure patients and speak confidently with doctors. Therefore, practical speaking ability can directly affect teamwork, safety and professional growth."
    }
  ],
  speakingTasks: [
    {
      id:"speak-self-intro",
      part:"Professional Self Introduction",
      prompt:"Introduce yourself to a new international team.",
      teach:"Use: greeting + name + place/background + current goal + strength + confident closing.",
      malayalam:"പേര് + സ്ഥലം മാത്രം പറയരുത്. നിങ്ങളുടെ ലക്ഷ്യം, പഠനം/ജോലി, ഒരു ശക്തി എന്നിവ ചേർക്കുക.",
      model:"Good morning everyone. My name is Anu Thomas, and I come from Kerala. I have a background in healthcare, and I am currently improving my English because I want to work confidently in an international environment. One of my strengths is that I am patient and responsible. I look forward to learning from this team and contributing my best."
    },
    {
      id:"speak-ielts-part2",
      part:"IELTS Speaking Part 2",
      prompt:"Describe a skill you want to improve. You should say what the skill is, why you want to improve it, how you are practising it, and how it will help your future.",
      teach:"Speak for 1-2 minutes. Use past, present and future. Add one example and one idiom.",
      malayalam:"ഒരു വിഷയത്തിൽ 1-2 മിനിറ്റ് സംസാരിക്കാൻ answer + reason + example + future benefit എന്ന രീതിയിൽ പറയുക.",
      model:"A skill I would like to improve is public speaking. I want to improve it because I often feel nervous when I speak in front of a group, especially in English. At the moment, I am practising by recording short answers, learning formal phrases and giving small presentations to my friends. For example, last week I spoke for two minutes about my career goals, and I noticed that my confidence improved. I believe public speaking will be a stepping stone in my future because it will help me attend interviews, present ideas and communicate professionally."
    }
  ],
  accentDrills: [
    {
      id:"vw",
      title:"V / W clarity",
      issue:"Malayalam speakers may mix /v/ and /w/ in fast speech.",
      drill:"very well, valuable work, we visited Vienna, world vision",
      targetWords:["very","well","valuable","work","visited","vision"],
      tip:"For V, touch upper teeth to lower lip. For W, round your lips like a small circle."
    },
    {
      id:"pf",
      title:"P / F clarity",
      issue:"Some learners replace F with P or make F too soft.",
      drill:"professional feedback, final performance, first profile, future plan",
      targetWords:["professional","feedback","final","performance","first","future"],
      tip:"For F, let air pass between your upper teeth and lower lip. Do not close both lips like P."
    },
    {
      id:"final",
      title:"Final consonants",
      issue:"Words can sound unclear if final sounds disappear: work, asked, helped, present.",
      drill:"I worked hard. I asked a question. I helped the team. I can present clearly.",
      targetWords:["worked","asked","helped","present","clearly"],
      tip:"Do not swallow the last sound. Finish each word cleanly, especially in professional speech."
    },
    {
      id:"th",
      title:"TH sound",
      issue:"TH may become t, d or s. That can change meaning.",
      drill:"think through this method, three things, they thanked the teacher",
      targetWords:["think","through","this","method","three","things","they","thanked"],
      tip:"Put your tongue lightly between your teeth and push air gently."
    }
    ,
{
  id: "schwa",
  title: "Schwa sound /ə/ — the most common British English sound",
  issue: "Malayalam speakers often pronounce every vowel fully. In British English, unstressed vowels become a short 'uh' sound called schwa.",
  drill: "about, above, photograph, comfortable, temperature, separate, interesting, particular, government, apparently",
  targetWords: ["about","above","photograph","comfortable","temperature","separate","interesting","particular","government","apparently"],
  tip: "In British English: 'comfortable' = COM-f-tuh-bl (4 syllables, not 5). 'temperature' = TEM-pruh-chuh. Reduce unstressed vowels to a lazy 'uh'.",
  ipa: { "about": "əˈbaʊt", "photograph": "ˈfəʊtəɡrɑːf", "comfortable": "ˈkʌmftəbl", "temperature": "ˈtemprətʃə", "apparently": "əˈpærəntli" }
},
{
  id: "longvowels",
  title: "British long vowels — /ɑː/ vs /æ/",
  issue: "British English has a longer 'ah' sound in words like 'can't', 'bath', 'glass'. Many learners use the short American /æ/ instead.",
  drill: "can't, fast, past, last, class, glass, ask, task, path, rather, after, demand, advance, command, example",
  targetWords: ["can't","fast","past","last","class","glass","ask","task","path","rather","after","demand","advance","command","example"],
  tip: "In British RP: 'can't' rhymes with 'cart', not 'cat'. Open your mouth wider and hold the 'ah' longer. 'bath' = /bɑːθ/, not /bæθ/.",
  ipa: { "can't": "kɑːnt", "fast": "fɑːst", "class": "klɑːs", "path": "pɑːθ", "rather": "ˈrɑːðə" }
},
{
  id: "tapping",
  title: "British /t/ — clear T, not flapped",
  issue: "In American English 'better' sounds like 'bedder'. In British English the T is crisp and clear. IELTS examiners use British English norms.",
  drill: "better, bitter, butter, matter,utter, water, little, bottle, battle, Britain, written, button, mitten, cotton,otten",
  targetWords: ["better","bitter","butter","matter","water","little","bottle","battle","Britain","written","button"],
  tip: "Touch the tip of your tongue firmly to the ridge behind your upper teeth for every T. Do not let it become a D sound. 'Water' = WAH-tuh, with a real T click.",
  ipa: { "better": "ˈbetə", "water": "ˈwɔːtə", "little": "ˈlɪtl", "bottle": "ˈbɒtl", "battle": "ˈbætl" }
},
{
  id: "stress-shift",
  title: "Word stress for IELTS vocabulary — advanced nouns and verbs",
  issue: "Many academic IELTS words change stress when used as nouns vs verbs. Stressing the wrong syllable sounds unnatural to British examiners.",
  drill: "record, permit, export, import, project, object, conduct, progress, protest, increase, decrease, contrast, produce, present, convict",
  targetWords: ["record","permit","export","import","project","object","conduct","progress","protest","increase","decrease","contrast","produce","present","convict"],
  tip: "Noun = stress on FIRST syllable. Verb = stress on SECOND syllable. 'A REcord' vs 'to reCORD'. 'A PROgress report' vs 'the project PROgresses'. Practise both forms.",
  ipa: { "record (n)": "ˈrekɔːd", "record (v)": "rɪˈkɔːd", "permit (n)": "ˈpɜːmɪt", "permit (v)": "pəˈmɪt", "progress (n)": "ˈprəʊɡres" }
},
{
  id: "clusters",
  title: "Consonant clusters — IELTS academic words",
  issue: "Malayalam syllable structure is mostly consonant-vowel, so consonant clusters feel difficult. Dropping sounds makes IELTS speech unclear.",
  drill: "strengths, twelfths, texts, sixths, tasks, desks, risks, depths, breadths, sculpts, prompts, glimpsed, scratched, stretched, clenched",
  targetWords: ["strengths","texts","tasks","desks","risks","depths","prompts","glimpsed","scratched","stretched"],
  tip: "Do not add a vowel between consonants: 'strengths' is ONE syllable, not 'str-en-gths'. Say it slowly: str-eŋ-θs. Cluster drills build the muscle memory your mouth needs for IELTS Band 7+.",
  ipa: { "strengths": "streŋθs", "sixths": "sɪksθs", "twelfths": "twelfθs", "depths": "depθs", "breadths": "bredθs" }
},
{
  id: "intonation",
  title: "British intonation — fall-rise for politeness",
  issue: "Flat intonation makes IELTS speech sound robotic or rude. British English uses a falling tone for statements and a rise-fall for polite requests.",
  drill: "Could you explain that again? I would be happy to elaborate. That is a particularly interesting question. I am not entirely certain, but I believe that. To a certain extent, I would agree with that view.",
  targetWords: ["explain","elaborate","particularly","interesting","certainly","extent","agree"],
  tip: "On polite phrases, start mid-pitch, rise slightly in the middle, then fall at the end. 'Could you exPLAIN that aGAIN?' — the italicised syllables go higher. Record and compare with a BBC news presenter.",
  ipa: { "elaborate": "ɪˈlæbəreɪt", "particularly": "pəˈtɪkjʊləli", "certainly": "ˈsɜːtənli", "extent": "ɪkˈstent" }
}
  ],
  conference: {
    title:"Mini conference presentation: From A1 learner to professional speaker",
    structure:[
      {step:"Opening", phrase:"Good morning everyone. Thank you for being here today."},
      {step:"Purpose", phrase:"Today, I would like to speak about..."},
      {step:"Roadmap", phrase:"I will cover three main points: first..., second..., and finally..."},
      {step:"Main point", phrase:"The first point I would like to highlight is..."},
      {step:"Example", phrase:"For example, in Kerala many students..."},
      {step:"Audience connection", phrase:"This matters to all of us because..."},
      {step:"Closing", phrase:"In a nutshell, the key message is... Thank you for listening."}
    ],
    model:"Good morning everyone. Thank you for being here today. My name is Anu Thomas, and today I would like to speak about how daily English practice can transform a beginner into a professional communicator. I will cover three main points: first, why confidence matters; second, how feedback improves fluency; and finally, how professional English opens global opportunities. The first point I would like to highlight is confidence. Many students in Kerala know grammar, but they hesitate to speak. For example, a student may understand an IELTS question but struggle to answer naturally. This matters to all of us because communication is not only an exam skill; it is a career skill. In a nutshell, regular practice, useful feedback and formal vocabulary can raise the bar for every learner. Thank you for listening."
  },
  mock: {
    listening: {
      transcript:"Hello everyone. This is a reminder about tomorrow's career seminar. The seminar will take place in Hall B from two p.m. to four p.m. The first speaker is Dr. Nair, who will discuss interview confidence. The second speaker will explain how to write a professional email. Students are requested to bring their notebooks and arrive fifteen minutes early.",
      questions:[
        {q:"Where will the seminar take place?", options:["Hall A","Hall B","Room 204"], answer:1, why:"The seminar will take place in Hall B."},
        {q:"Who is the first speaker?", options:["Dr. Nair","Ms. Thomas","The principal"], answer:0, why:"The first speaker is Dr. Nair."},
        {q:"What should students bring?", options:["Laptop","Notebook","Passport"], answer:1, why:"Students are requested to bring notebooks."}
      ]
    },
    reading: {
      passage:"Professional English is not simply advanced vocabulary. It is the ability to choose language that is clear, respectful and suitable for the situation. A beginner may say, 'Give me details.' A professional speaker may say, 'Could you please share the relevant details?' The meaning is similar, but the tone is very different. For international careers, this difference can influence interviews, meetings and client communication.",
      questions:[
        {q:"Professional English is mainly about...", options:["using difficult words only","clear and suitable language","speaking with no accent"], answer:1, why:"The passage says it is clear, respectful and suitable language."},
        {q:"Which sentence is more professional?", options:["Give me details.","Could you please share the relevant details?","Tell fast."], answer:1, why:"It is polite and formal."},
        {q:"Professional tone can influence...", options:["interviews and meetings","food choices","weather"], answer:0, why:"The final sentence mentions interviews, meetings and client communication."}
      ]
    },
    writingPrompt:"Write a formal email to a training manager asking for details about an IELTS speaking workshop. Ask about date, fee and practice opportunities.",
    speakingPrompt:"Speak for one minute: Why do you want to improve your English communication?"
  },
  formalRules: [
    {from:"i want", to:"I would like to"},
    {from:"give me", to:"Could you please provide"},
    {from:"tell me", to:"Could you please inform me"},
    {from:"i need", to:"I require"},
    {from:"very good", to:"highly beneficial"},
    {from:"bad", to:"unfavourable"},
    {from:"many", to:"numerous"},
    {from:"help me", to:"assist me"},
    {from:"ask", to:"request"},
    {from:"get", to:"obtain"}
  ],
  keralaErrors: [
    {wrong:"Myself Rahul.", better:"My name is Rahul.", why:"Do not use 'myself' to introduce your name."},
    {wrong:"I am coming from Kerala.", better:"I come from Kerala. / I am from Kerala.", why:"Use present simple for origin."},
    {wrong:"I passed out in 2022.", better:"I graduated in 2022.", why:"'Passed out' can mean fainted in many countries."},
    {wrong:"Discuss about the topic.", better:"Discuss the topic.", why:"Discuss does not need 'about'."},
    {wrong:"Cope up with pressure.", better:"Cope with pressure.", why:"Use 'cope with', not 'cope up with'."},
    {wrong:"I have one doubt.", better:"I have a question.", why:"In professional English, 'question' sounds more natural."}
  ],
  resources: [
    {title:"Self-introduction formula", content:"Good morning + name + place/background + goal + strength + polite closing."},
    {title:"Speaking answer formula", content:"Answer → Reason → Example → Result. Use this for most IELTS Speaking Part 1 answers."},
    {title:"Presentation formula", content:"Opening → Purpose → Roadmap → Point 1 → Example → Point 2 → Audience link → Closing."},
    {title:"Formal email formula", content:"Greeting → Purpose → Details → Request/Suggestion → Thanks → Closing."},
    {title:"Accent practice formula", content:"Slow down → finish final consonants → record → compare with model → repeat."}
  ],

  karaokeTracks: [
  {
    id: "step-by-step-professional",
    title: "Step by Step, I Speak",
    level: "A1 to B1",
    accent: "IELTS clear English",
    malayalamTip:
      "ഓരോ വാക്കും വ്യക്തമായി വായിക്കുക. അവസാനം വരുന്ന sounds മുറിക്കരുത്: developed, confidence, respect.",
    lyrics: `
Step by step, I speak with grace.
I find my voice, I keep my pace.
I introduce myself with pride.
I let my fear move to the side.

Good morning everyone, I am pleased to be here.
My name is Rahul, and my purpose is clear.
I am currently improving my communication.
I want to speak with confidence and preparation.

I believe discipline creates opportunity.
I believe practice builds fluency.
When I speak clearly, people understand.
When I stay calm, I can command.

I may begin with simple words today.
But I will grow in a professional way.
Step by step, I rise and learn.
Every mistake gives me a turn.
    `,
    focusWords: [
      "grace",
      "pace",
      "introduce",
      "purpose",
      "currently",
      "improving",
      "communication",
      "confidence",
      "preparation",
      "discipline",
      "opportunity",
      "fluency",
      "clearly",
      "professional"
    ]
  },
  {
    id: "conference-confidence",
    title: "Conference Confidence Chant",
    level: "B1 Professional",
    accent: "Formal presentation English",
    malayalamTip:
      "Conference speaking-ൽ pause, stress, confidence പ്രധാനമാണ്. വേഗത്തിൽ ഓടിക്കൂടാ.",
    lyrics: `
Ladies and gentlemen, thank you for this opportunity.
It is a privilege to speak to this community.
Today I will present my ideas with clarity.
I will explain my points with confidence and maturity.

First, I will introduce the main situation.
Next, I will describe the important information.
Finally, I will offer a practical conclusion.
Clear speech can create a powerful impression.

I respect the audience in front of me.
I speak with purpose, not anxiety.
My words are formal, focused, and bright.
I practise today, so tomorrow I speak right.
    `,
    focusWords: [
      "ladies",
      "gentlemen",
      "opportunity",
      "privilege",
      "community",
      "present",
      "clarity",
      "confidence",
      "maturity",
      "situation",
      "information",
      "practical",
      "conclusion",
      "impression",
      "anxiety"
    ]
  },
  {
    id: "museum-formal-flow",
    title: "Museum Formal Flow",
    level: "A2 to B2",
    accent: "Academic IELTS style",
    malayalamTip:
      "Museum topic IELTS speaking/writing-ന് നല്ലതാണ്. preserve, heritage, evidence പോലുള്ള formal words ശ്രദ്ധിക്കുക.",
    lyrics: `
I visited a museum on a quiet afternoon.
The halls were calm, and the lights were soft.
I observed historical objects with curiosity.
Each exhibit gave me a sense of responsibility.

A museum does not simply store the past.
It preserves heritage that is meant to last.
It teaches society through evidence and art.
It keeps culture alive in every heart.

At first, I thought the visit would be ordinary.
Later, I found the experience extraordinary.
It improved my vocabulary and observation.
It gave me confidence for public communication.
    `,
    focusWords: [
      "visited",
      "museum",
      "observed",
      "historical",
      "curiosity",
      "exhibit",
      "responsibility",
      "preserves",
      "heritage",
      "society",
      "evidence",
      "ordinary",
      "extraordinary",
      "vocabulary",
      "communication"
    ]
  }
]
};
