# IELTS Kerala Pro Coach

A static HTML/CSS/JavaScript IELTS learning website for Malayalam speakers moving from A1/basic English to professional communication.

## What works in this version

- Four IELTS modules: Listening, Reading, Writing and Speaking
- Working browser audio using `speechSynthesis`
- Microphone speaking practice using Web Speech API in Chrome/Edge
- Actual answer checking for listening and reading
- Writing feedback with band-style scoring and model answers
- Speaking feedback based on transcript structure, length, connectors, formal vocabulary, idioms and task coverage
- Accent drills for common Malayalam-speaker pronunciation patterns
- Formal English transformer
- Idiom practice with Malayalam meaning
- Conference presentation builder
- Mini mock test with report
- XP, streak and local progress saving
- Mobile responsive UI
- GitHub Pages ready

## How to run

Open `index.html` in Chrome or Edge. For microphone features, allow microphone access. For best results, publish through GitHub Pages so the site runs on HTTPS.

## Important limitation

This is a static front-end app. It gives educational feedback using local JavaScript rules. Full AI scoring, real accent recognition and acoustic pronunciation scoring require a backend speech/AI service.

## GitHub Pages

Upload these files to the root of your GitHub repository:

- `index.html`
- `styles.css`
- `data.js`
- `app.js`
- `README.md`

Then enable Pages from Settings → Pages → Deploy from branch → main → root.
