const App = (() => {
  const STORAGE_KEY = "ieltsKeralaTeacherStateV2";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const defaultState = {
    xp: 0,
    streak: 1,
    completed: {},
    lastStudyDate: null,
    theme: "light",
    mock: { listening: null, reading: null, writing: null, speaking: null },
    notes: []
  };

  let state = loadState();
  let currentRecognition = null;
  let lastTranscript = "";

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return { ...defaultState, ...saved, mock: { ...defaultState.mock, ...(saved?.mock || {}) } };
    } catch (error) {
      return { ...defaultState };
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function escapeHTML(value = "") {
    return String(value).replace(/[&<>'"]/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#039;",
      '"': "&quot;"
    }[char]));
  }

  function slug(value = "") {
    return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function todayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function markStudy(action = "practice", xp = 10) {
    const today = todayKey();
    if (state.lastStudyDate !== today) {
      state.streak = state.lastStudyDate ? state.streak + 1 : Math.max(1, state.streak);
      state.lastStudyDate = today;
    }
    state.completed[action] = true;
    state.xp += xp;
    saveState();
    toast(`+${xp} XP earned. Good work!`);
    updateProgressUI();
  }

  function toast(message, type = "success") {
    const area = $("#toastArea");
    if (!area) return;
    const item = document.createElement("div");
    item.className = `toast ${type}`;
    item.textContent = message;
    area.appendChild(item);
    setTimeout(() => item.classList.add("show"), 20);
    setTimeout(() => {
      item.classList.remove("show");
      setTimeout(() => item.remove(), 260);
    }, 3200);
  }

  function setPage(page) {
    const renderer = pages[page] || pages.home;
    const app = $("#app");
    app.innerHTML = renderer();
    app.focus();
    $$(".side-nav a").forEach((a) => a.classList.toggle("active", a.dataset.page === page));
    bindPage(page);
    updateProgressUI();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function init() {
    document.body.dataset.theme = state.theme;
    const hash = location.hash.replace("#", "") || "home";
    setPage(hash);

    window.addEventListener("hashchange", () => setPage(location.hash.replace("#", "") || "home"));

    $("#menuBtn")?.addEventListener("click", () => $("#sidebar")?.classList.toggle("open"));
    $("#themeBtn")?.addEventListener("click", toggleTheme);
    $("#audioTestBtn")?.addEventListener("click", () => speak("Audio is working. Welcome to IELTS Kerala Pro Coach.", "en-IN", 0.92));
    $("#coachToggle")?.addEventListener("click", () => $("#coachPanel")?.classList.toggle("hidden"));
    $("#globalSearch")?.addEventListener("input", handleSearch);

    const mission = IELTS_DATA.missions[new Date().getDate() % IELTS_DATA.missions.length];
    $("#sideMission").textContent = mission;

    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
  }

  function toggleTheme() {
    state.theme = state.theme === "dark" ? "light" : "dark";
    document.body.dataset.theme = state.theme;
    saveState();
  }

  function updateProgressUI() {
    const xpEls = $$("[data-xp]");
    xpEls.forEach((el) => el.textContent = state.xp);
    const streakEls = $$("[data-streak]");
    streakEls.forEach((el) => el.textContent = state.streak);
    const level = Math.floor(state.xp / 100) + 1;
    $$('[data-level]').forEach((el) => el.textContent = level);
    const bar = $("#xpBar");
    if (bar) bar.style.width = `${state.xp % 100}%`;
  }

  function handleSearch(event) {
    const q = event.target.value.trim().toLowerCase();
    if (!q) return;
    const pool = [
      ...IELTS_DATA.formalWords.map(x => ({type:"Formal word", title:`${x.simple} → ${x.formal}`, content:x.example, page:"formal"})),
      ...IELTS_DATA.idioms.map(x => ({type:"Idiom", title:x.idiom, content:`${x.meaning}. ${x.example}`, page:"idioms"})),
      ...IELTS_DATA.resources.map(x => ({type:"Resource", title:x.title, content:x.content, page:"resources"})),
      ...IELTS_DATA.speakingTasks.map(x => ({type:"Speaking", title:x.part, content:x.prompt, page:"speaking"})),
      ...IELTS_DATA.listeningTasks.map(x => ({type:"Listening", title:x.title, content:x.transcript, page:"listening"})),
      ...(IELTS_DATA.karaokeTracks || []).map(x => ({type:"Karaoke", title:x.title, content:`${x.level} ${x.accent} ${x.lyrics}`, page:"karaoke"}))
    ];
    const match = pool.find(item => `${item.title} ${item.content}`.toLowerCase().includes(q));
    if (match) {
      toast(`${match.type}: ${match.title}. Opened ${match.page}.`, "info");
      location.hash = match.page;
    }
  }

  function randomCoachTip() {
    const tip = IELTS_DATA.coachTips[Math.floor(Math.random() * IELTS_DATA.coachTips.length)];
    $("#coachTip").textContent = tip;
  }

  function getVoice(lang = "en-AU") {
    const voices = window.speechSynthesis?.getVoices?.() || [];
    return voices.find(v => v.lang === lang) ||
      voices.find(v => v.lang?.toLowerCase().startsWith("en-GB")) ||
      voices.find(v => v.lang?.toLowerCase().startsWith("en-AU")) ||
      voices.find(v => v.lang?.toLowerCase().startsWith("en-US")) ||
      voices.find(v => v.lang?.toLowerCase().startsWith("en"));
  }

  function speak(text, lang = "en-AU", rate = 1.15) {
    if (!("speechSynthesis" in window)) {
      toast("Audio is not supported in this browser. Use Chrome or Edge.", "error");
      return;
    }
    if (!text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;
    const voice = getVoice(lang);
    if (voice) utterance.voice = voice;
    utterance.onstart = () => toast("Audio playing. Listen for keywords and stress.", "info");
    utterance.onerror = () => toast("Audio could not play. Click again or use Chrome/Edge.", "error");
    window.speechSynthesis.speak(utterance);
  }

  function stopAudio() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }

  function startRecognition(targetId, lang = "en-IN") {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const target = targetId ? document.getElementById(targetId) : null;
    if (!SpeechRecognition) {
      toast("Speech recognition is not supported. Please use Chrome or Edge.", "error");
      return;
    }
    if (currentRecognition) {
      currentRecognition.stop();
      currentRecognition = null;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.continuous = true;
    currentRecognition = recognition;

    let interim = "";
    recognition.onstart = () => toast("Listening... speak clearly and naturally.", "info");
    recognition.onresult = (event) => {
      interim = Array.from(event.results).map(result => result[0].transcript).join(" ");
      lastTranscript = interim;
      if (target) target.value = interim;
    };
    recognition.onerror = (event) => toast(`Microphone error: ${event.error}. Allow microphone and try again.`, "error");
    recognition.onend = () => {
      currentRecognition = null;
      if (interim) toast("Recording captured. Now check your feedback.", "success");
    };
    recognition.start();
  }

  function statCards() {
    return `
      <div class="stats-grid">
        <div class="stat-card"><span>XP</span><strong data-xp>${state.xp}</strong><small>Earned through active practice</small></div>
        <div class="stat-card"><span>Streak</span><strong><span data-streak>${state.streak}</span> days</strong><small>Return daily to build confidence</small></div>
        <div class="stat-card"><span>Level</span><strong>Level <span data-level>${Math.floor(state.xp / 100) + 1}</span></strong><small>A1 learner → Pro communicator</small></div>
      </div>
      <div class="xp-track"><span id="xpBar" style="width:${state.xp % 100}%"></span></div>
    `;
  }

  function hero() {
    return `
      <section class="hero-card">
        <div>
          <span class="pill">Malayalam speakers → professional English</span>
          <h1>Learn IELTS by doing, not by only reading instructions.</h1>
          <p>This app teaches, asks, listens, checks answers, gives feedback and rewards daily practice. It is built for Kerala learners who want professional communication, not just an exam shortcut.</p>
          <div class="hero-actions">
            <a class="primary-btn" href="#classroom">Start today’s class</a>
            <a class="ghost-btn" href="#mock">Take a working mock test</a>
            <button class="ghost-btn" onclick="App.speak('Welcome. Today we will practise listening, speaking, writing and professional English. Start small, but practise every day.', 'en-IN', .9)">🔊 Hear welcome</button>
          </div>
        </div>
        <div class="hero-widget">
          <span class="eyebrow">Today’s learning loop</span>
          <ol class="steps-list">
            <li><b>Teach</b><small>See model answers and Malayalam support.</small></li>
            <li><b>Try</b><small>Speak, write, listen or answer questions.</small></li>
            <li><b>Feedback</b><small>Get score, corrections and next action.</small></li>
            <li><b>Repeat</b><small>Earn XP and keep your streak alive.</small></li>
          </ol>
        </div>
      </section>
    `;
  }

  const pages = {
    home: () => `
      ${hero()}
      ${statCards()}
      <section class="section-grid three">
        ${featureCard("🎧", "Listening that works", "Browser audio reads full scripts aloud. After listening, you answer questions and see explanations.", "#listening")}
        ${featureCard("🎙", "Speaking with feedback", "Record in Chrome or Edge. The coach checks structure, clarity, formal words, fillers and missing ideas.", "#speaking")}
        ${featureCard("✍️", "Writing teacher", "Write emails and paragraphs. The app gives band-style feedback, corrections and model answers.", "#writing")}
      </section>
      <section class="panel-grid">
        <div class="panel">
          <h2>Why this app feels different</h2>
          <p>Most IELTS apps show lessons and ask students to study alone. This app behaves like a mini teacher: it explains, gives an example, asks you to try, then responds with feedback.</p>
          <div class="tag-row">
            <span>Malayalam support</span><span>Professional words</span><span>Idioms</span><span>Accent drills</span><span>Daily XP</span>
          </div>
        </div>
        <div class="panel gradient-panel">
          <h2>Mini challenge</h2>
          <p>Say this sentence clearly:</p>
          <blockquote>“Good morning everyone. Today, I would like to introduce myself and explain my professional goal.”</blockquote>
          <button class="primary-btn" onclick="location.hash='accent'">Practise pronunciation</button>
        </div>
      </section>
    `,

    dashboard: () => `
      <section class="page-head"><span class="pill">Your progress</span><h1>Dashboard</h1><p>Build a habit. One complete practice per day is more powerful than ten saved videos.</p></section>
      ${statCards()}
      <section class="section-grid four">
        ${moduleProgress("Listening", "listen-campus", "🎧")}
        ${moduleProgress("Reading", "reading-workplace", "📖")}
        ${moduleProgress("Writing", "writing-task1-email", "✍️")}
        ${moduleProgress("Speaking", "speak-self-intro", "🎙")}
      </section>
      <section class="panel">
        <h2>Teacher recommendation</h2>
        ${recommendation()}
      </section>
    `,

    classroom: () => {
      const lesson = IELTS_DATA.dailyLesson;
      return `
        <section class="page-head"><span class="pill">Daily classroom</span><h1>${lesson.title}</h1><p>${lesson.goal}</p></section>
        <section class="lesson-layout">
          <div class="panel teacher-card">
            <h2>Teacher explanation</h2>
            <p class="malayalam">${lesson.malayalam}</p>
            ${lesson.teacher.map((line, index) => `<div class="example-line ${index === 0 ? 'weak' : index === 1 ? 'better' : 'best'}"><span>${index === 0 ? 'Weak' : index === 1 ? 'Better' : 'Professional'}</span><p>${escapeHTML(line)}</p><button onclick="App.speak('${escapeAttr(line)}')">🔊</button></div>`).join("")}
          </div>
          <div class="panel practice-card">
            <h2>Your turn</h2>
            <p>${lesson.practicePrompt}</p>
            <textarea id="dailyAnswer" rows="7" placeholder="Write your self introduction here..."></textarea>
            <div class="button-row">
              <button class="primary-btn" onclick="App.evaluateDailyIntro()">Check my answer</button>
              <button class="ghost-btn" onclick="App.speak(document.getElementById('dailyAnswer').value || '${escapeAttr(lesson.modelAnswer)}')">🔊 Read aloud</button>
            </div>
            <div id="dailyFeedback" class="feedback-box"></div>
          </div>
        </section>
        <section class="panel model-box">
          <h2>Model answer</h2>
          <p>${escapeHTML(lesson.modelAnswer)}</p>
          <button class="mini-btn" onclick="App.speak('${escapeAttr(lesson.modelAnswer)}')">Listen to model answer</button>
        </section>
      `;
    },

    listening: () => `
      <section class="page-head"><span class="pill">IELTS Listening</span><h1>Listen, answer, learn from mistakes</h1><p>The audio uses browser speech synthesis. Click Play Audio, then answer the questions. You will get answers and explanations.</p></section>
      <div class="audio-help panel">
        <b>Audio fix:</b> Use Chrome or Edge. Click “Test audio” in the top bar first. If the voice stops, click Stop and Play again.
      </div>
      ${IELTS_DATA.listeningTasks.map(renderListeningTask).join("")}
    `,

    reading: () => `
      <section class="page-head"><span class="pill">IELTS Reading</span><h1>Read actively, not passively</h1><p>Each passage teaches a strategy, then checks your answer and explains why.</p></section>
      ${IELTS_DATA.readingTasks.map(renderReadingTask).join("")}
    `,

    writing: () => `
      <section class="page-head"><span class="pill">IELTS Writing</span><h1>Write, check, correct, improve</h1><p>The writing coach looks at structure, word count, formal tone, connectors, common Kerala-English mistakes and gives a practical score.</p></section>
      ${IELTS_DATA.writingTasks.map(renderWritingTask).join("")}
    `,

    speaking: () => `
      <section class="page-head"><span class="pill">IELTS Speaking</span><h1>Record answers and get feedback</h1><p>Use Chrome or Edge for microphone practice. The app checks your transcript for structure, fluency signals and professional vocabulary.</p></section>
      ${IELTS_DATA.speakingTasks.map(renderSpeakingTask).join("")}
    `,

    conference: () => `
      <section class="page-head"><span class="pill">Professional speaking</span><h1>Conference presentation mode</h1><p>Learn to present to a crowd with a clear opening, roadmap, examples and closing.</p></section>
      <section class="lesson-layout">
        <div class="panel">
          <h2>Presentation formula</h2>
          ${IELTS_DATA.conference.structure.map((item, i) => `<div class="formula-row"><span>${i + 1}</span><div><b>${item.step}</b><p>${escapeHTML(item.phrase)}</p></div><button onclick="App.speak('${escapeAttr(item.phrase)}')">🔊</button></div>`).join("")}
        </div>
        <div class="panel">
          <h2>Build your presentation</h2>
          <label>Topic <input id="confTopic" placeholder="Example: My career goal" /></label>
          <label>Point 1 <input id="confP1" placeholder="Example: confidence" /></label>
          <label>Point 2 <input id="confP2" placeholder="Example: daily practice" /></label>
          <label>Point 3 <input id="confP3" placeholder="Example: professional growth" /></label>
          <button class="primary-btn" onclick="App.buildConferenceScript()">Create my script</button>
          <textarea id="conferenceScript" rows="10" placeholder="Your script will appear here..."></textarea>
          <div class="button-row"><button class="ghost-btn" onclick="App.speak(document.getElementById('conferenceScript').value || '${escapeAttr(IELTS_DATA.conference.model)}')">🔊 Practise audio</button><button class="ghost-btn" onclick="App.startRecognition('conferenceScript')">🎙 Record instead</button><button class="primary-btn" onclick="App.evaluateSpeakingText('conferenceScript','conferenceFeedback')">Check presentation</button></div>
          <div id="conferenceFeedback" class="feedback-box"></div>
        </div>
      </section>
      <section class="panel model-box"><h2>Model conference speech</h2><p>${escapeHTML(IELTS_DATA.conference.model)}</p><button class="mini-btn" onclick="App.speak('${escapeAttr(IELTS_DATA.conference.model)}')">Listen to model</button></section>
    `,

    accent: () => `
      <section class="page-head"><span class="pill">Accent improvement</span><h1>Be clear, global and professional</h1><p>This static app cannot do full acoustic accent recognition like a paid AI backend. It checks speech transcript accuracy, target words and common Malayalam-speaker pronunciation patterns.</p></section>
      <section class="section-grid two">
        ${IELTS_DATA.accentDrills.map(renderAccentDrill).join("")}
      </section>
    `,

    formal: () => `
      <section class="page-head"><span class="pill">Formal English lab</span><h1>Change regular English into professional English</h1><p>Practise polite, precise and formal language for IELTS, interviews, emails and conferences.</p></section>
      <section class="lesson-layout">
        <div class="panel">
          <h2>Try the transformer</h2>
          <textarea id="formalInput" rows="8" placeholder="Example: I want details about the class. Give me the fee and time."></textarea>
          <button class="primary-btn" onclick="App.transformFormal()">Upgrade my English</button>
          <div id="formalOutput" class="feedback-box"></div>
        </div>
        <div class="panel">
          <h2>Formal word bank</h2>
          <div class="word-bank">${IELTS_DATA.formalWords.map(w => `<button onclick="App.speak('${escapeAttr(w.formal + '. ' + w.example)}')"><b>${w.simple}</b> → ${w.formal}<small>${w.example}</small></button>`).join("")}</div>
        </div>
      </section>
      <section class="panel"><h2>Common Kerala-English corrections</h2>${IELTS_DATA.keralaErrors.map(e => `<div class="correction-row"><span class="bad">${escapeHTML(e.wrong)}</span><span class="arrow">→</span><span class="good">${escapeHTML(e.better)}</span><small>${escapeHTML(e.why)}</small></div>`).join("")}</section>
    `,

    idioms: () => `
      <section class="page-head"><span class="pill">Idiom gym</span><h1>Use idioms naturally, not forcefully</h1><p>Idioms help speaking and presentations when they fit the situation. Learn meaning, Malayalam support and professional use.</p></section>
      <section class="section-grid two">${IELTS_DATA.idioms.map(renderIdiomCard).join("")}</section>
    `,

    mock: () => `
      <section class="page-head"><span class="pill">Working mock test</span><h1>Mini IELTS mock test</h1><p>This mock test now has playable audio, answer checking, explanations and score feedback for all four modules.</p></section>
      <section class="mock-tabs">
        <button class="active" data-mock-tab="mock-listening">Listening</button>
        <button data-mock-tab="mock-reading">Reading</button>
        <button data-mock-tab="mock-writing">Writing</button>
        <button data-mock-tab="mock-speaking">Speaking</button>
        <button data-mock-tab="mock-report">Report</button>
      </section>
      <section id="mock-listening" class="mock-panel active">${renderMockListening()}</section>
      <section id="mock-reading" class="mock-panel">${renderMockReading()}</section>
      <section id="mock-writing" class="mock-panel">${renderMockWriting()}</section>
      <section id="mock-speaking" class="mock-panel">${renderMockSpeaking()}</section>
      <section id="mock-report" class="mock-panel">${renderMockReport()}</section>
    `,

    karaoke: () => `
      <section class="page-head">
        <span class="pill">Karaoke Accent Lab</span>
        <h1>Sing your way to Band 7</h1>
        <p>Listen to the model voice, watch each word light up, then speak along and get word-by-word feedback.</p>
      </section>
      <section class="karaoke-card">
        <div class="karaoke-header">
          <p class="eyebrow">Pronunciation Trainer</p>
          <h2>Karaoke IELTS Speaking Practice</h2>
          <p>Read or sing along. The app compares your transcript with the target track and shows what to practise again.</p>
        </div>
        <div class="karaoke-controls">
          <label for="karaokeTrackSelect">Choose practice track</label>
          <select id="karaokeTrackSelect"></select>
        </div>
        <div class="karaoke-info">
          <h3 id="karaokeTitle">Track title</h3>
          <p><strong>Level:</strong> <span id="karaokeLevel"></span></p>
          <p><strong>Accent goal:</strong> <span id="karaokeAccent"></span></p>
          <p class="malayalam-tip" id="karaokeMalayalamTip"></p>
        </div>
        <div id="karaokeLyrics" class="karaoke-lyrics"></div>
        <textarea id="karaokeTranscript" rows="5" placeholder="Click Start Reading, or type what you said here..."></textarea>
        <div class="karaoke-buttons">
          <button id="karaokeModelBtn" class="primary-btn">Listen Model Voice</button>
          <button id="karaokeStartBtn" class="primary-btn">Start Reading</button>
          <button id="karaokeStopBtn" class="ghost-btn">Stop & Score</button>
          <button id="karaokeResetBtn" class="ghost-btn">Reset</button>
        </div>
        <div class="karaoke-report">
          <h3>Your Pronunciation Report</h3>
          <div class="score-grid">
            <div><span class="score-label">Accuracy</span><strong id="karaokeAccuracy">0%</strong></div>
            <div><span class="score-label">Speed</span><strong id="karaokeWpm">0 WPM</strong></div>
            <div><span class="score-label">Formal Words</span><strong id="karaokeFormalScore">0 / 0</strong></div>
          </div>
          <h4>Words to practise again</h4>
          <p id="karaokeMissedWords">No words yet.</p>
          <h4>Teacher feedback</h4>
          <p id="karaokeTeacherFeedback">Start reading to receive feedback.</p>
        </div>
      </section>
    `,

    resources: () => `
      <section class="page-head"><span class="pill">Resources</span><h1>Quick formulas and study plan</h1><p>Use these formulas every day until they become automatic.</p></section>
      <section class="section-grid two">${IELTS_DATA.resources.map(r => `<div class="panel"><h2>${escapeHTML(r.title)}</h2><p>${escapeHTML(r.content)}</p><button class="mini-btn" onclick="App.speak('${escapeAttr(r.content)}')">Listen</button></div>`).join("")}</section>
      <section class="panel"><h2>7-day habit plan</h2><ol class="habit-plan"><li>Day 1: Self introduction + V/W drill</li><li>Day 2: Listening details + formal email</li><li>Day 3: Reading main idea + idioms</li><li>Day 4: Speaking Part 2 story structure</li><li>Day 5: Conference opening + final consonants</li><li>Day 6: Mock test + correction review</li><li>Day 7: Repeat your weakest module</li></ol></section>
    `
  };

  function featureCard(icon, title, text, href) {
    return `<a class="feature-card" href="${href}"><span>${icon}</span><h3>${title}</h3><p>${text}</p></a>`;
  }

  function moduleProgress(name, key, icon) {
    const done = state.completed[key] ? "done" : "pending";
    return `<div class="progress-card ${done}"><span>${icon}</span><h3>${name}</h3><p>${done === "done" ? "Completed" : "Pending"}</p><small>${done === "done" ? "Great. Now repeat for fluency." : "Open the module and finish one task."}</small></div>`;
  }

  function recommendation() {
    if (!state.completed["listen-campus"]) return `<p>Start with <b>Listening 1</b>. It is short and gives instant answer explanations.</p><a class="primary-btn" href="#listening">Go to Listening</a>`;
    if (!state.completed["speak-self-intro"]) return `<p>Next, record your <b>professional self introduction</b>. Speaking daily will build confidence faster.</p><a class="primary-btn" href="#speaking">Go to Speaking</a>`;
    if (!state.completed["writing-task1-email"]) return `<p>Now write one <b>formal email</b>. This improves IELTS Writing and professional communication together.</p><a class="primary-btn" href="#writing">Go to Writing</a>`;
    return `<p>You are building a strong habit. Try the mock test and check your full report.</p><a class="primary-btn" href="#mock">Open Mock Test</a>`;
  }

  function renderListeningTask(task) {
    return `
      <section class="task-card" id="${task.id}">
        <div class="task-head"><div><span class="pill">${task.level}</span><h2>${task.title}</h2></div><div class="button-row"><button class="primary-btn" onclick="App.speakTask('${task.id}')">▶ Play audio</button><button class="ghost-btn" onclick="App.stopAudio()">Stop</button></div></div>
        <p class="teacher-note"><b>Teacher:</b> ${task.teacher}</p>
        <details><summary>Show transcript after trying</summary><p>${escapeHTML(task.transcript)}</p></details>
        <form class="quiz" data-task="${task.id}">
          ${task.questions.map((q, qi) => renderQuestion(task.id, q, qi)).join("")}
        </form>
        <button class="primary-btn" onclick="App.checkQuiz('${task.id}', 'listening')">Check answers</button>
        <div id="${task.id}-feedback" class="feedback-box"></div>
      </section>
    `;
  }

  function renderReadingTask(task) {
    return `
      <section class="task-card" id="${task.id}">
        <div class="task-head"><div><span class="pill">Reading practice</span><h2>${task.title}</h2></div><button class="ghost-btn" onclick="App.speak('${escapeAttr(task.passage)}', 'en-IN', .86)">🔊 Read aloud</button></div>
        <p class="teacher-note"><b>Teacher:</b> ${task.teacher}</p>
        <article class="reading-passage">${escapeHTML(task.passage)}</article>
        <form class="quiz" data-task="${task.id}">${task.questions.map((q, qi) => renderQuestion(task.id, q, qi)).join("")}</form>
        <button class="primary-btn" onclick="App.checkQuiz('${task.id}', 'reading')">Check answers</button>
        <div id="${task.id}-feedback" class="feedback-box"></div>
      </section>
    `;
  }

  function renderQuestion(taskId, q, qi) {
    return `<fieldset class="question-block"><legend>${qi + 1}. ${escapeHTML(q.q)}</legend>${q.options.map((option, oi) => `<label><input type="radio" name="${taskId}-${qi}" value="${oi}"> ${escapeHTML(option)}</label>`).join("")}</fieldset>`;
  }

  function renderWritingTask(task) {
    return `
      <section class="task-card" id="${task.id}">
        <div class="task-head"><div><span class="pill">Writing teacher</span><h2>${task.title}</h2></div><button class="ghost-btn" onclick="App.speak('${escapeAttr(task.prompt + ' ' + task.teacher)}')">🔊 Hear task</button></div>
        <p class="prompt-box"><b>Task:</b> ${escapeHTML(task.prompt)}</p>
        <p class="teacher-note"><b>Teacher:</b> ${escapeHTML(task.teacher)}</p>
        <details><summary>Need a starter?</summary><pre>${escapeHTML(task.starter)}</pre></details>
        <textarea id="${task.id}-answer" rows="10" placeholder="Write your answer here. Then click Check writing."></textarea>
        <div class="button-row"><button class="primary-btn" onclick="App.evaluateWriting('${task.id}')">Check writing</button><button class="ghost-btn" onclick="App.insertStarter('${task.id}')">Insert starter</button><button class="ghost-btn" onclick="App.showModel('${task.id}')">Show model</button></div>
        <div id="${task.id}-feedback" class="feedback-box"></div>
      </section>
    `;
  }

  function renderSpeakingTask(task) {
    return `
      <section class="task-card" id="${task.id}">
        <div class="task-head"><div><span class="pill">${escapeHTML(task.part)}</span><h2>${escapeHTML(task.prompt)}</h2></div><button class="ghost-btn" onclick="App.speak('${escapeAttr(task.model)}')">🔊 Model</button></div>
        <p class="teacher-note"><b>Teacher:</b> ${escapeHTML(task.teach)}</p>
        <p class="malayalam">${escapeHTML(task.malayalam)}</p>
        <textarea id="${task.id}-transcript" rows="7" placeholder="Click Record, or type your spoken answer here..."></textarea>
        <div class="button-row"><button class="primary-btn" onclick="App.startRecognition('${task.id}-transcript')">🎙 Record answer</button><button class="primary-btn" onclick="App.evaluateSpeakingTask('${task.id}')">Get speaking feedback</button><button class="ghost-btn" onclick="App.speak(document.getElementById('${task.id}-transcript').value)">🔊 Hear my answer</button></div>
        <details><summary>Show model answer</summary><p>${escapeHTML(task.model)}</p></details>
        <div id="${task.id}-feedback" class="feedback-box"></div>
      </section>
    `;
  }

  function renderAccentDrill(drill) {
    return `
      <div class="panel drill-card" id="accent-${drill.id}">
        <span class="pill">Accent drill</span><h2>${escapeHTML(drill.title)}</h2>
        <p>${escapeHTML(drill.issue)}</p>
        <p class="teacher-note"><b>Coach tip:</b> ${escapeHTML(drill.tip)}</p>
        <blockquote>${escapeHTML(drill.drill)}</blockquote>
        <textarea id="accent-${drill.id}-text" rows="4" placeholder="Record or type what Chrome heard..."></textarea>
        <div class="button-row"><button class="ghost-btn" onclick="App.speak('${escapeAttr(drill.drill)}', 'en-IN', .78)">🔊 Listen slowly</button><button class="primary-btn" onclick="App.startRecognition('accent-${drill.id}-text')">🎙 Record</button><button class="primary-btn" onclick="App.checkAccent('${drill.id}')">Check clarity</button></div>
        <div id="accent-${drill.id}-feedback" class="feedback-box"></div>
      </div>
    `;
  }

  function renderIdiomCard(item) {
    return `
      <div class="idiom-card panel">
        <span class="pill">${escapeHTML(item.use)}</span>
        <h2>${escapeHTML(item.idiom)}</h2>
        <p><b>Meaning:</b> ${escapeHTML(item.meaning)}</p>
        <p class="malayalam">${escapeHTML(item.malayalam)}</p>
        <blockquote>${escapeHTML(item.example)}</blockquote>
        <label>Make your own sentence <input id="idiom-${slug(item.idiom)}" placeholder="Write one sentence using this idiom" /></label>
        <div class="button-row"><button class="mini-btn" onclick="App.speak('${escapeAttr(item.idiom + '. ' + item.example)}')">🔊 Listen</button><button class="mini-btn" onclick="App.checkIdiom('${slug(item.idiom)}','${escapeAttr(item.idiom)}')">Check sentence</button></div>
        <div id="idiom-${slug(item.idiom)}-feedback" class="feedback-box compact"></div>
      </div>
    `;
  }

  function renderMockListening() {
    const task = IELTS_DATA.mock.listening;
    return `<div class="task-card"><h2>Mock Listening</h2><p>Click Play, listen once or twice, then answer.</p><div class="button-row"><button class="primary-btn" onclick="App.speak('${escapeAttr(task.transcript)}')">▶ Play mock audio</button><button class="ghost-btn" onclick="App.stopAudio()">Stop</button></div><form class="quiz" data-task="mockListening">${task.questions.map((q, qi) => renderQuestion("mockListening", q, qi)).join("")}</form><button class="primary-btn" onclick="App.checkMockQuiz('listening')">Submit listening</button><div id="mockListening-feedback" class="feedback-box"></div></div>`;
  }

  function renderMockReading() {
    const task = IELTS_DATA.mock.reading;
    return `<div class="task-card"><h2>Mock Reading</h2><article class="reading-passage">${escapeHTML(task.passage)}</article><form class="quiz" data-task="mockReading">${task.questions.map((q, qi) => renderQuestion("mockReading", q, qi)).join("")}</form><button class="primary-btn" onclick="App.checkMockQuiz('reading')">Submit reading</button><div id="mockReading-feedback" class="feedback-box"></div></div>`;
  }

  function renderMockWriting() {
    return `<div class="task-card"><h2>Mock Writing</h2><p class="prompt-box"><b>Task:</b> ${escapeHTML(IELTS_DATA.mock.writingPrompt)}</p><textarea id="mockWritingText" rows="10" placeholder="Write your formal email..."></textarea><button class="primary-btn" onclick="App.evaluateMockWriting()">Submit writing</button><div id="mockWriting-feedback" class="feedback-box"></div></div>`;
  }

  function renderMockSpeaking() {
    return `<div class="task-card"><h2>Mock Speaking</h2><p class="prompt-box"><b>Task:</b> ${escapeHTML(IELTS_DATA.mock.speakingPrompt)}</p><textarea id="mockSpeakingText" rows="8" placeholder="Record or type your speaking answer..."></textarea><div class="button-row"><button class="primary-btn" onclick="App.startRecognition('mockSpeakingText')">🎙 Record</button><button class="primary-btn" onclick="App.evaluateMockSpeaking()">Submit speaking</button></div><div id="mockSpeaking-feedback" class="feedback-box"></div></div>`;
  }

  function renderMockReport() {
    const m = state.mock;
    const scores = [m.listening, m.reading, m.writing, m.speaking].filter(x => typeof x === "number");
    const avg = scores.length ? (scores.reduce((a,b) => a+b, 0) / scores.length).toFixed(1) : "--";
    return `<div class="panel"><h2>Your mini mock report</h2><div class="report-grid"><div><span>Listening</span><b>${m.listening ?? "--"}</b></div><div><span>Reading</span><b>${m.reading ?? "--"}</b></div><div><span>Writing</span><b>${m.writing ?? "--"}</b></div><div><span>Speaking</span><b>${m.speaking ?? "--"}</b></div><div class="avg"><span>Average</span><b>${avg}</b></div></div><p>${scores.length < 4 ? "Finish all four modules to get a full report." : "Good. Now repeat the weakest module and compare your result."}</p><button class="primary-btn" onclick="App.refreshMockReport()">Refresh report</button></div>`;
  }

  function renderKaraokeTrack(index = 0) {
    const tracks = IELTS_DATA.karaokeTracks || [];
    const track = tracks[index] || tracks[0];
    if (!track) return;
    $("#karaokeTitle").textContent = track.title;
    $("#karaokeLevel").textContent = track.level;
    $("#karaokeAccent").textContent = track.accent;
    $("#karaokeMalayalamTip").textContent = track.malayalamTip || "";
    $("#karaokeLyrics").innerHTML = lyricWords(track.lyrics)
      .map((word, i) => `<span class="karaoke-word" data-karaoke-word="${i}">${escapeHTML(word)}</span>`)
      .join(" ");
    $("#karaokeAccuracy").textContent = "0%";
    $("#karaokeWpm").textContent = "0 WPM";
    $("#karaokeFormalScore").textContent = `0 / ${(track.focusWords || []).length}`;
    $("#karaokeMissedWords").textContent = "No words yet.";
    $("#karaokeTeacherFeedback").textContent = "Start reading to receive feedback.";
    const transcript = $("#karaokeTranscript");
    if (transcript) transcript.value = "";
  }

  function lyricWords(text = "") {
    return text.trim().split(/\s+/).filter(Boolean);
  }

  function normaliseWords(text = "") {
    return text.toLowerCase().replace(/[^a-z0-9'\s]/g, " ").split(/\s+/).filter(Boolean);
  }

  function bindKaraoke() {
    const tracks = IELTS_DATA.karaokeTracks || [];
    const select = $("#karaokeTrackSelect");
    if (!select || !tracks.length) return;
    select.innerHTML = tracks.map((track, i) => `<option value="${i}">${escapeHTML(track.title)}</option>`).join("");
    renderKaraokeTrack(0);
    select.addEventListener("change", () => renderKaraokeTrack(Number(select.value)));
    $("#karaokeModelBtn")?.addEventListener("click", playKaraokeModel);
    $("#karaokeStartBtn")?.addEventListener("click", () => startRecognition("karaokeTranscript", "en-IN"));
    $("#karaokeStopBtn")?.addEventListener("click", scoreKaraoke);
    $("#karaokeResetBtn")?.addEventListener("click", () => renderKaraokeTrack(Number(select.value)));
  }

  function currentKaraokeTrack() {
    const tracks = IELTS_DATA.karaokeTracks || [];
    const index = Number($("#karaokeTrackSelect")?.value || 0);
    return tracks[index];
  }

  function playKaraokeModel() {
    const track = currentKaraokeTrack();
    if (!track) return;
    speak(track.lyrics, "en-GB", 0.86);
    const words = $$("[data-karaoke-word]");
    let index = 0;
    words.forEach(word => word.classList.remove("active", "correct", "missed"));
    const timer = setInterval(() => {
      words.forEach(word => word.classList.remove("active"));
      words[index]?.classList.add("active");
      index += 1;
      if (index > words.length) clearInterval(timer);
    }, 360);
  }

  function scoreKaraoke() {
    if (currentRecognition) {
      currentRecognition.stop();
      currentRecognition = null;
    }
    const track = currentKaraokeTrack();
    if (!track) return;
    const target = normaliseWords(track.lyrics);
    const spokenText = $("#karaokeTranscript")?.value || lastTranscript || "";
    const spoken = normaliseWords(spokenText);
    const spokenSet = new Set(spoken);
    const matched = target.filter(word => spokenSet.has(word));
    const missed = [...new Set(target.filter(word => !spokenSet.has(word)))].slice(0, 18);
    const accuracy = target.length ? Math.round((matched.length / target.length) * 100) : 0;
    const focusWords = track.focusWords || [];
    const focusHits = focusWords.filter(word => spokenSet.has(word.toLowerCase()));
    const estimatedMinutes = Math.max(1, Math.round(target.length / 120));

    $$("[data-karaoke-word]").forEach((el) => {
      const word = normaliseWords(el.textContent)[0];
      el.classList.toggle("correct", spokenSet.has(word));
      el.classList.toggle("missed", !spokenSet.has(word));
      el.classList.remove("active");
    });

    $("#karaokeAccuracy").textContent = `${accuracy}%`;
    $("#karaokeWpm").textContent = `${Math.round(spoken.length / estimatedMinutes)} WPM`;
    $("#karaokeFormalScore").textContent = `${focusHits.length} / ${focusWords.length}`;
    $("#karaokeMissedWords").textContent = missed.length ? missed.join(", ") : "Excellent. No key words missed.";
    $("#karaokeTeacherFeedback").textContent = karaokeFeedback(accuracy, focusHits.length, focusWords.length);
    markStudy(`karaoke-${track.id}`, accuracy >= 70 ? 18 : 8);
  }

  function karaokeFeedback(accuracy, focusHits, focusTotal) {
    if (accuracy >= 90) return "Excellent shadowing. Keep the same pace and now focus on natural stress.";
    if (accuracy >= 70) return `Good attempt. You captured ${focusHits}/${focusTotal} focus words. Repeat once more and slow down the missed words.`;
    if (accuracy >= 45) return "Useful first attempt. Listen to the model again, then read line by line with stronger final consonants.";
    return "Start slower. Speak one sentence at a time, then click Stop & Score after the transcript appears.";
  }

  function bindPage(page) {
    if (page === "mock") {
      $$("[data-mock-tab]").forEach(btn => btn.addEventListener("click", () => {
        $$("[data-mock-tab]").forEach(b => b.classList.remove("active"));
        $$(".mock-panel").forEach(panel => panel.classList.remove("active"));
        btn.classList.add("active");
        $(`#${btn.dataset.mockTab}`)?.classList.add("active");
        if (btn.dataset.mockTab === "mock-report") refreshMockReport();
      }));
    }
    if (page === "karaoke") bindKaraoke();
  }

  function findTask(taskId) {
    return [...IELTS_DATA.listeningTasks, ...IELTS_DATA.readingTasks].find(t => t.id === taskId);
  }

  function speakTask(taskId) {
    const task = findTask(taskId);
    if (task) speak(task.transcript, "en-IN", 0.88);
  }

  function checkQuiz(taskId, type) {
    const task = findTask(taskId);
    if (!task) return;
    const result = scoreQuestions(task.questions, taskId);
    const html = buildQuizFeedback(result, task.questions);
    $(`#${taskId}-feedback`).innerHTML = html;
    if (result.score === task.questions.length) markStudy(taskId, 20); else markStudy(`${taskId}-attempt`, 8);
  }

  function scoreQuestions(questions, prefix) {
    let score = 0;
    const details = questions.map((q, i) => {
      const selected = $(`input[name="${prefix}-${i}"]:checked`);
      const value = selected ? Number(selected.value) : null;
      const correct = value === q.answer;
      if (correct) score++;
      return { q, value, correct };
    });
    return { score, total: questions.length, details };
  }

  function buildQuizFeedback(result, questions) {
    const percent = Math.round((result.score / result.total) * 100);
    return `<h3>${result.score}/${result.total} correct (${percent}%)</h3>${result.details.map((d, i) => `<div class="answer-feedback ${d.correct ? 'right' : 'wrong'}"><b>Q${i + 1}: ${d.correct ? 'Correct' : 'Needs review'}</b><p>Your answer: ${d.value === null ? 'Not answered' : escapeHTML(d.q.options[d.value])}</p><p>Correct answer: ${escapeHTML(d.q.options[d.q.answer])}</p><small>${escapeHTML(d.q.why)}</small></div>`).join("")}<p class="next-step"><b>Next step:</b> ${result.score === result.total ? 'Repeat the audio and shadow the speaker.' : 'Read the explanations, replay the audio, and try again.'}</p>`;
  }

  function insertStarter(taskId) {
    const task = IELTS_DATA.writingTasks.find(t => t.id === taskId);
    const area = $(`#${taskId}-answer`);
    if (task && area && !area.value.trim()) area.value = task.starter;
  }

  function showModel(taskId) {
    const task = IELTS_DATA.writingTasks.find(t => t.id === taskId);
    const box = $(`#${taskId}-feedback`);
    if (task && box) box.innerHTML = `<h3>Model answer</h3><pre>${escapeHTML(task.model)}</pre><button class="mini-btn" onclick="App.speak('${escapeAttr(task.model)}')">Listen to model</button>`;
  }

  function evaluateWriting(taskId) {
    const task = IELTS_DATA.writingTasks.find(t => t.id === taskId);
    const text = $(`#${taskId}-answer`)?.value || "";
    const report = analyseWriting(text, task?.prompt || "");
    $(`#${taskId}-feedback`).innerHTML = writingReportHTML(report, task?.model);
    state.mock.writing = report.band;
    markStudy(taskId, 25);
  }

  function analyseWriting(text, prompt = "") {
    const clean = text.trim();
    const words = clean ? clean.split(/\s+/).filter(Boolean) : [];
    const lower = clean.toLowerCase();
    const connectors = ["because", "therefore", "however", "although", "moreover", "for example", "as a result", "in addition", "finally", "firstly", "secondly"];
    const formal = IELTS_DATA.formalWords.map(w => w.formal.toLowerCase());
    const connectorCount = connectors.filter(c => lower.includes(c)).length;
    const formalCount = formal.filter(w => lower.includes(w)).length;
    const hasGreeting = /dear|sir|madam|hello|good morning/i.test(clean);
    const hasClosing = /yours faithfully|yours sincerely|thank you|regards|kind regards/i.test(clean);
    const hasSuggestion = /suggest|recommend|could|would|please|request/i.test(clean);
    const commonMistakes = IELTS_DATA.keralaErrors.filter(e => lower.includes(e.wrong.toLowerCase().replace(/[.]/g,"").slice(0, 12).trim()));
    const grammarFlags = [];
    if (/myself\s+[a-z]/i.test(clean)) grammarFlags.push("Use 'My name is...' instead of 'Myself...'.");
    if (/coming from/i.test(clean)) grammarFlags.push("For origin, use 'I come from...' or 'I am from...'.");
    if (/discuss about/i.test(clean)) grammarFlags.push("Use 'discuss the topic', not 'discuss about the topic'.");
    if (/cope up/i.test(clean)) grammarFlags.push("Use 'cope with', not 'cope up with'.");
    if (/passed out/i.test(clean)) grammarFlags.push("Use 'graduated', not 'passed out'.");

    let band = 4.0;
    if (words.length >= 60) band += 0.5;
    if (words.length >= 120) band += 0.5;
    if (connectorCount >= 2) band += 0.5;
    if (connectorCount >= 4) band += 0.5;
    if (formalCount >= 2) band += 0.5;
    if (hasGreeting && hasClosing) band += 0.5;
    if (hasSuggestion) band += 0.5;
    if (grammarFlags.length > 0) band -= 0.5;
    if (words.length < 30) band -= 1;
    band = Math.max(3.5, Math.min(7.5, Math.round(band * 2) / 2));

    const positives = [];
    if (words.length >= 80) positives.push("You wrote enough to develop ideas.");
    if (connectorCount) positives.push(`You used ${connectorCount} linking expression(s).`);
    if (formalCount) positives.push(`You used ${formalCount} formal word(s).`);
    if (hasGreeting && hasClosing) positives.push("Your email has a polite opening and closing.");

    const next = [];
    if (words.length < 80) next.push("Write more detail: add reason, example and result.");
    if (connectorCount < 2) next.push("Add connectors such as because, however, for example and therefore.");
    if (formalCount < 2) next.push("Use more formal words: assist, request, provide, beneficial, significant.");
    if (!hasSuggestion && /email|organiser|manager|workshop/i.test(prompt)) next.push("Add one polite request or suggestion using 'could' or 'would'.");
    if (!grammarFlags.length && next.length === 0) next.push("Now improve sentence variety and accuracy for a higher band.");

    return { band, wordCount: words.length, connectorCount, formalCount, grammarFlags, commonMistakes, positives, next };
  }

  function writingReportHTML(report, model = "") {
    return `<h3>Writing feedback: estimated band ${report.band}</h3><div class="band-row"><span style="width:${Math.min(100, report.band / 9 * 100)}%"></span></div><div class="criteria-grid"><div><b>Task response</b><p>${report.wordCount >= 80 ? 'Developing' : 'Too short'}</p></div><div><b>Coherence</b><p>${report.connectorCount >= 2 ? 'Good linking' : 'Needs linking words'}</p></div><div><b>Lexical resource</b><p>${report.formalCount >= 2 ? 'Formal tone emerging' : 'Add formal words'}</p></div><div><b>Grammar</b><p>${report.grammarFlags.length ? 'Check common errors' : 'No major local-pattern error detected'}</p></div></div><h4>What you did well</h4><ul>${(report.positives.length ? report.positives : ["You made an attempt. Now expand it."]).map(x => `<li>${escapeHTML(x)}</li>`).join("")}</ul><h4>Corrections / next steps</h4><ul>${[...report.grammarFlags, ...report.next].map(x => `<li>${escapeHTML(x)}</li>`).join("")}</ul>${model ? `<details open><summary>Compare with model answer</summary><pre>${escapeHTML(model)}</pre></details>` : ""}`;
  }

  function evaluateDailyIntro() {
    const text = $("#dailyAnswer")?.value || "";
    const report = analyseSpeaking(text, ["name", "from", "background", "goal", "strength"]);
    $("#dailyFeedback").innerHTML = speakingReportHTML(report, "Daily intro feedback") + `<details open><summary>Model answer</summary><p>${escapeHTML(IELTS_DATA.dailyLesson.modelAnswer)}</p></details>`;
    markStudy("daily-class", 20);
  }

  function evaluateSpeakingTask(taskId) {
    const text = $(`#${taskId}-transcript`)?.value || lastTranscript || "";
    const task = IELTS_DATA.speakingTasks.find(t => t.id === taskId);
    const targets = taskId.includes("intro") ? ["name", "from", "background", "goal", "strength"] : ["skill", "because", "example", "future", "stepping stone"];
    const report = analyseSpeaking(text, targets);
    $(`#${taskId}-feedback`).innerHTML = speakingReportHTML(report, "Speaking feedback") + `<details><summary>Model answer</summary><p>${escapeHTML(task?.model || "")}</p></details>`;
    state.mock.speaking = report.band;
    markStudy(taskId, 25);
  }

  function evaluateSpeakingText(textAreaId, outputId) {
    const text = $(`#${textAreaId}`)?.value || "";
    const report = analyseSpeaking(text, ["good morning", "today", "first", "second", "finally", "example", "thank"]);
    $(`#${outputId}`).innerHTML = speakingReportHTML(report, "Presentation feedback");
    markStudy("conference-practice", 25);
  }

  function analyseSpeaking(text, targets = []) {
    const clean = text.trim();
    const lower = clean.toLowerCase();
    const words = clean ? clean.split(/\s+/).filter(Boolean) : [];
    const fillers = ["um", "uh", "like", "actually actually", "you know"].filter(f => lower.includes(f));
    const formal = IELTS_DATA.formalWords.map(w => w.formal.toLowerCase()).filter(w => lower.includes(w));
    const idioms = IELTS_DATA.idioms.map(i => i.idiom.toLowerCase()).filter(i => lower.includes(i));
    const hitTargets = targets.filter(t => lower.includes(t));
    const connectors = ["because", "for example", "therefore", "first", "second", "finally", "in a nutshell", "however"].filter(c => lower.includes(c));

    let band = 4;
    if (words.length >= 25) band += 0.5;
    if (words.length >= 55) band += 0.5;
    if (connectors.length >= 2) band += 0.5;
    if (formal.length >= 1) band += 0.5;
    if (idioms.length >= 1) band += 0.5;
    if (hitTargets.length >= Math.min(3, targets.length)) band += 0.5;
    if (fillers.length >= 2) band -= 0.5;
    if (words.length < 15) band -= 1;
    band = Math.max(3.5, Math.min(8, Math.round(band * 2) / 2));

    const feedback = [];
    if (words.length < 30) feedback.push("Speak longer. Aim for at least 45-60 seconds.");
    if (connectors.length < 2) feedback.push("Add structure words: first, because, for example, therefore, in a nutshell.");
    if (!formal.length) feedback.push("Add one professional word such as significant, beneficial, responsible, contribute or objective.");
    if (!idioms.length) feedback.push("Add one natural idiom only if it fits, such as 'a stepping stone' or 'raise the bar'.");
    if (hitTargets.length < targets.length) feedback.push(`Missing ideas: ${targets.filter(t => !lower.includes(t)).slice(0, 4).join(", ") || "none"}.`);
    if (fillers.length) feedback.push("Reduce fillers. Pause silently instead of saying um/like repeatedly.");
    if (!feedback.length) feedback.push("Strong attempt. Now improve pronunciation, stress and sentence variety.");

    return { band, wordCount: words.length, connectors, formal, idioms, hitTargets, targets, fillers, feedback };
  }

  function speakingReportHTML(report, title) {
    return `<h3>${title}: estimated band ${report.band}</h3><div class="band-row"><span style="width:${Math.min(100, report.band / 9 * 100)}%"></span></div><div class="criteria-grid"><div><b>Fluency</b><p>${report.wordCount} words</p></div><div><b>Structure</b><p>${report.connectors.length} connectors</p></div><div><b>Vocabulary</b><p>${report.formal.length} formal, ${report.idioms.length} idiom</p></div><div><b>Task coverage</b><p>${report.hitTargets.length}/${report.targets.length} key points</p></div></div><h4>Coach feedback</h4><ul>${report.feedback.map(x => `<li>${escapeHTML(x)}</li>`).join("")}</ul><p class="next-step"><b>Next attempt:</b> Record again and try to improve one thing only. Do not try to fix everything at once.</p>`;
  }

  function transformFormal() {
    const input = $("#formalInput")?.value || "";
    if (!input.trim()) {
      $("#formalOutput").innerHTML = `<p>Please write a simple sentence first.</p>`;
      return;
    }
    let upgraded = input;
    IELTS_DATA.formalRules.forEach(rule => {
      upgraded = upgraded.replace(new RegExp(`\\b${rule.from}\\b`, "gi"), rule.to);
    });
    upgraded = upgraded.replace(/\bgive details\b/gi, "provide the relevant details")
      .replace(/\bfast\b/gi, "as soon as possible")
      .replace(/\bthanks\b/gi, "Thank you for your assistance")
      .replace(/\bclass\b/gi, "session")
      .replace(/\bteacher\b/gi, "instructor");
    if (!/[.!?]$/.test(upgraded.trim())) upgraded += ".";
    const polished = upgraded.charAt(0).toUpperCase() + upgraded.slice(1);
    $("#formalOutput").innerHTML = `<h3>Professional version</h3><p class="upgraded-text">${escapeHTML(polished)}</p><h4>Why it is better</h4><ul><li>It uses polite request language.</li><li>It sounds suitable for email, interview or IELTS formal writing.</li><li>It avoids direct command style.</li></ul><button class="mini-btn" onclick="App.speak('${escapeAttr(polished)}')">Listen</button>`;
    markStudy("formal-transform", 10);
  }

  function checkIdiom(id, idiom) {
    const text = $(`#idiom-${id}`)?.value || "";
    const lower = text.toLowerCase();
    const idiomLower = idiom.toLowerCase();
    const hasIdiom = lower.includes(idiomLower);
    const enough = text.trim().split(/\s+/).length >= 7;
    const box = $(`#idiom-${id}-feedback`);
    if (hasIdiom && enough) {
      box.innerHTML = `<p class="right-text">Good. You used the idiom in a complete sentence.</p><p>Next: say it aloud naturally, not like a memorised phrase.</p>`;
      markStudy(`idiom-${id}`, 8);
    } else {
      box.innerHTML = `<p class="wrong-text">Try again. Use the exact idiom and make a full sentence.</p><p>Example: This course can be ${escapeHTML(idiom)} for my career.</p>`;
    }
  }

  function checkAccent(drillId) {
  const drill = IELTS_DATA.accentDrills.find(d => d.id === drillId);
  const text = $(`#accent-${drillId}-text`)?.value || "";
  const lower = text.toLowerCase();
  const heard = drill.targetWords.filter(w => lower.includes(w.toLowerCase()));
  const missing = drill.targetWords.filter(w => !lower.includes(w.toLowerCase()));
  const score = Math.round((heard.length / drill.targetWords.length) * 100);

  // Build IPA reference block if the drill has IPA data
  let ipaBlock = "";
  if (drill.ipa) {
    const ipaRows = Object.entries(drill.ipa)
      .map(([word, pron]) => `<tr><td><b>${escapeHTML(word)}</b></td><td class="ipa-cell">/${escapeHTML(pron)}/</td></tr>`)
      .join("");
    ipaBlock = `
      <details class="ipa-reference">
        <summary>🇬🇧 British IPA pronunciation guide (click to expand)</summary>
        <table class="ipa-table"><thead><tr><th>Word</th><th>British RP pronunciation</th></tr></thead>
        <tbody>${ipaRows}</tbody></table>
        <p class="teacher-note">IPA = International Phonetic Alphabet. British RP (Received Pronunciation) is the accent used by IELTS examiners. Listen to the model, check the IPA, then record again.</p>
      </details>`;
  }

  // Band-level feedback message
  let bandMsg = "";
  if (score === 100) bandMsg = "Excellent. Every target word was clear. You are ready for IELTS Band 7+ pronunciation.";
  else if (score >= 80) bandMsg = "Very good. Most words were clear. Practise the missing ones slowly, then re-record.";
  else if (score >= 60) bandMsg = "Good attempt. Focus on the missing words. Listen to the British model 3 times, then speak again.";
  else if (score >= 40) bandMsg = "Keep going. Try slowing down by 30% and finishing every final consonant clearly.";
  else bandMsg = "This is a hard drill. Listen to the model carefully, mouth the words silently, then record again.";

  $(`#accent-${drillId}-feedback`).innerHTML = `
    <h3>Clarity score: ${score}%</h3>
    <div class="band-row"><span style="width:${score}%"></span></div>
    <p><b>Chrome heard:</b> ${escapeHTML(text || "Nothing captured")}</p>
    <p><b>Clear words:</b> ${heard.length ? heard.map(escapeHTML).join(", ") : "None yet"}</p>
    <p><b>Practise again:</b> ${missing.length ? missing.map(escapeHTML).join(", ") : "✅ All target words captured"}</p>
    <p class="teacher-note"><b>🎯 Coach:</b> ${escapeHTML(drill.tip)}</p>
    <p><b>📊 Examiner note:</b> ${bandMsg}</p>
    ${ipaBlock}
  `;
  markStudy(`accent-${drillId}`, score >= 70 ? 15 : 6);

  }

  function buildConferenceScript() {
    const topic = $("#confTopic")?.value || "my professional growth";
    const p1 = $("#confP1")?.value || "confidence";
    const p2 = $("#confP2")?.value || "daily practice";
    const p3 = $("#confP3")?.value || "career opportunities";
    const script = `Good morning everyone. Thank you for being here today. Today, I would like to speak about ${topic}. I will cover three main points: first, ${p1}; second, ${p2}; and finally, ${p3}. The first point I would like to highlight is ${p1}. This is important because it helps learners communicate without fear. For example, many students in Kerala understand English, but they hesitate to speak in front of a crowd. The second point is ${p2}. Regular practice is a game changer because it turns English into a daily habit. Finally, ${p3} matters because professional communication can open doors to international study and work. In a nutshell, ${topic} is not only about passing an exam; it is about raising the bar for our future. Thank you for listening.`;
    $("#conferenceScript").value = script;
    markStudy("conference-build", 10);
  }

  function checkMockQuiz(kind) {
    const prefix = kind === "listening" ? "mockListening" : "mockReading";
    const task = IELTS_DATA.mock[kind];
    const result = scoreQuestions(task.questions, prefix);
    $(`#${prefix}-feedback`).innerHTML = buildQuizFeedback(result, task.questions);
    const band = Math.round((result.score / result.total) * 9 * 2) / 2;
    state.mock[kind] = Math.max(3, band);
    saveState();
    markStudy(`mock-${kind}`, 20);
  }

  function evaluateMockWriting() {
    const text = $("#mockWritingText")?.value || "";
    const report = analyseWriting(text, IELTS_DATA.mock.writingPrompt);
    state.mock.writing = report.band;
    saveState();
    $("#mockWriting-feedback").innerHTML = writingReportHTML(report, "Dear Sir or Madam,\n\nI am writing to request information about your IELTS speaking workshop. Could you please inform me of the date, fee and available practice opportunities? I would also like to know whether participants receive individual feedback after the session.\n\nThank you for your assistance.\n\nYours faithfully,\nAnu Thomas");
    markStudy("mock-writing", 25);
  }

  function evaluateMockSpeaking() {
    const text = $("#mockSpeakingText")?.value || "";
    const report = analyseSpeaking(text, ["english", "communication", "because", "career", "future"]);
    state.mock.speaking = report.band;
    saveState();
    $("#mockSpeaking-feedback").innerHTML = speakingReportHTML(report, "Mock speaking feedback");
    markStudy("mock-speaking", 25);
  }

  function refreshMockReport() {
    const panel = $("#mock-report");
    if (panel) panel.innerHTML = renderMockReport();
  }

  function resetProgress() {
    if (!confirm("Reset all local progress and scores?")) return;
    state = { ...defaultState };
    saveState();
    toast("Progress reset.", "info");
    setPage(location.hash.replace("#", "") || "home");
  }

  function escapeAttr(value = "") {
    return String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, " ").replace(/\r/g, " ");
  }

  return {
    init,
    speak,
    stopAudio,
    speakTask,
    startRecognition,
    checkQuiz,
    evaluateWriting,
    insertStarter,
    showModel,
    evaluateDailyIntro,
    evaluateSpeakingTask,
    evaluateSpeakingText,
    transformFormal,
    checkIdiom,
    checkAccent,
    buildConferenceScript,
    checkMockQuiz,
    evaluateMockWriting,
    evaluateMockSpeaking,
    refreshMockReport,
    randomCoachTip,
    resetProgress
  };
})();

document.addEventListener("DOMContentLoaded", App.init);
