KKK Timer 3.0
A free, professional, browser-based speedcubing timer built for desktop and mobile. No install, no account, no tracking. Just open the page and start solving.

Live Demo: https://krameshece-ctrl.github.io/KKK-TIMER-3.0/

Table of Contents
About the Project

Features

Built With

Getting Started

Usage

Project Structure

Contributing

License

Contact

Acknowledgments

About the Project
KKK Timer 3.0 is a speedcubing timer designed for the modern web. It was built out of a simple frustration: most existing cubing timers are either too cluttered, require an account, or don't work well on mobile. This timer aims to fix that.

The core experience is intentionally minimal. You hold the spacebar (or touch the screen on mobile), release to start the timer, and press any key (or tap) to stop. Your solve is recorded instantly, and a new scramble is generated for the next attempt. The interface is clean, dark by default, and designed to stay out of your way while you solve.

But beneath that simplicity, KKK Timer 3.0 packs the features that cubers actually need. It tracks WCA-style averages (Ao5, Ao12, Ao50, Ao100), maintains separate sessions for different puzzles, supports 2x2 through 7x7 and Skewb, and includes optional 15-second inspection with automatic penalty enforcement. There's also a built-in cube assistant that analyzes your scrambles, a library of 50 synthesized focus music tracks, and 25 color themes to customize your environment.

The project is entirely static. It runs on GitHub Pages, stores all data locally in your browser, and never sends your solves to a server. This means it's fast, private, and free—but it also means your solve history lives only on the device and browser you used. If you want to back up your data, the share/copy feature lets you export your session as plain text.

KKK Timer 3.0 is not trying to replace csTimer or any of the other excellent, feature-rich timers out there. It's trying to be the timer you reach for when you want to solve right now, without configuring a hundred settings first. Over time, if you find you need deeper analytics or more customization, you can move on. In the meantime, this timer will help you track your progress, break personal bests, and enjoy the process of getting faster.

Features
Core Timing
Precision Timing: Records solve times to the millisecond using performance.now(), with a display that matches WCA competition format.

Hold-to-Start Controls: Prevents accidental starts. Hold spacebar (desktop) or touch the timer area (mobile) for half a second until it turns green, then release to start.

Instant Stop: Press any key on desktop, or tap anywhere on mobile, to stop the timer immediately.

Statistics & Tracking
WCA-Style Averages: Calculates Mo3, Ao5, Ao12, Ao50, and Ao100 using the standard trimmed-mean method (fastest and slowest solves are dropped).

Personal Best Tracking: Displays your best single solve in the current session.

Trend Graph: A visual chart of your last twenty solves, making it easy to spot improvement or fatigue.

Detailed Breakdowns: Tap any average card to see exactly which solves contributed and which were trimmed.

Sessions & Puzzles
Multiple Sessions: Create separate sessions for different puzzles, practice modes, or cubes. Sessions don't share statistics, so a bad week on a new cube can't drag down your main averages.

Seven Puzzle Types: Supports 2x2, 3x3, 4x4, 5x5, 6x6, 7x7, and Skewb, with WCA-standard scramble lengths for each.

Automatic Session Switching: When you switch puzzles, the timer automatically switches to that puzzle's session (creating one if needed).

Inspection & Penalties
Optional 15-Second Inspection: Enable in Settings. During inspection, you can start the solve early with no penalty. If the countdown reaches zero, a +2 penalty is applied automatically.

Manual Penalties: Click any solve to apply a +2 penalty or mark it as DNF. Remove penalties at any time.

Assistant & Customization
Built-in Cube Assistant: A chat-style helper that analyzes your scrambles and offers tips on cross, F2L, OLL, PLL, finger tricks, look-ahead, and more. Runs entirely locally—no AI API, no network calls.

50 Focus Music Tracks: Synthesized in real-time using the Web Audio API. No downloads, no streaming.

25 Color Themes: Customize the entire interface. Your choice is saved automatically.

Sharing & Data
Session Sharing: Share your solves and scrambles via WhatsApp, Telegram, email, SMS, or copy to clipboard.

100% Local Storage: All data lives in your browser's localStorage. No accounts, no cookies, no analytics, no tracking.

Built With
HTML5 — Semantic markup and structure.

Tailwind CSS (via CDN) — Utility-first styling for a responsive, modern interface.

Vanilla JavaScript — No frameworks, no build step. The entire application is a single HTML file with embedded logic.

Web Audio API — Real-time music synthesis.

Canvas API — Trend graph rendering.

localStorage — Client-side persistence for solves, sessions, and preferences.

Getting Started
KKK Timer 3.0 is designed to run with zero setup. There is no build step, no package manager, and no dependencies to install.

Option 1: Use the Live Version
The simplest way to get started is to open the live site:

text
https://krameshece-ctrl.github.io/KKK-TIMER-3.0/
That's it. The timer is ready to use immediately.

Option 2: Run Locally
If you want to run the timer on your own machine (for development, customization, or offline use):

Clone the repository:

bash
git clone https://github.com/krameshece-ctrl/KKK-TIMER-3.0.git
cd KKK-TIMER-3.0
Open the timer:
Simply open index.html in any modern browser. There is no server required for the core timer to function.

If you prefer to serve it locally (recommended for testing mobile interactions over your network):

bash
# Using Python (available on most systems)
python3 -m http.server 8000

# Or using Node.js (if you have npx)
npx serve
Access the timer:
Open http://localhost:8000 (or whichever port your server reports) in your browser.

Option 3: Deploy Your Own Copy
Because this is a static site, you can host it anywhere that serves HTML files:

GitHub Pages: Push the files to a repository and enable Pages in Settings.

Netlify / Vercel: Drag and drop the folder, or connect your repo.

Any static host: Upload the HTML files to any web server.

No server-side code is required.

Usage
Starting a Solve
On Desktop:

Hold the Spacebar for about half a second. The timer turns red, then green.

When it's green, release the spacebar to start the timer.

Solve your cube.

Press any key to stop the timer.

On Mobile:

Touch and hold the large timer number in the center of the screen.

When it turns green, release to start.

Solve your cube.

Tap once anywhere on the timer area to stop.

Understanding the Statistics
Best: Your fastest single solve in the current session (DNFs excluded).

Mo3 (Mean of 3): Straight average of your last three solves. No trimming. Sensitive to bad solves.

Ao5 / Ao12 / Ao50 / Ao100: Trimmed averages. The fastest and slowest solves in the window are dropped, and the rest are averaged. This is the standard WCA method and the best measure of your actual skill level.

Applying Penalties
Click or tap any solve in the session list to open the penalty menu:

OK: Removes any existing penalty.

+2: Adds two seconds to the solve.

DNF: Marks the solve as Did Not Finish. It will be excluded from averages (but still counts toward the "two DNFs in a window" rule).

Enabling Inspection
Go to Settings → Features → 15s Inspection Time. When enabled, every solve begins with a 15-second countdown. You can start early without penalty. If the countdown reaches zero, a +2 is applied and the timer starts automatically.

Using the Assistant
Click the chat icon in the header to open the cube assistant. It reacts to each new scramble with analysis and can answer questions about solving technique, statistics, and practice strategy. The assistant runs entirely in your browser—no data is sent anywhere.

Project Structure
text
KKK-TIMER-3.0/
├── index.html          # Main timer application (HTML + CSS + JS)
├── about.html          # Project overview and philosophy
├── help.html           # Detailed usage guide
├── faq.html            # 100 frequently asked questions
├── privacy.html        # Privacy policy
├── terms.html          # Terms and conditions
├── cube-finder.html    # Cube recommendation tool
├── rate-us.html        # Feature rating page
├── robots.txt          # Search engine directives
├── sitemap.xml         # Sitemap for search engines
└── README.md           # This file
The entire timer application is contained in index.html. All other HTML files are supplementary documentation pages. There are no external JavaScript or CSS files—everything is embedded for maximum portability.

Contributing
Contributions are welcome. Whether you've found a bug, want to suggest a feature, or have improved the code, here's how to get involved.

Reporting Issues
If you find a bug or have a suggestion:

Check the existing issues to see if it's already been reported.

If not, open a new issue with:

A clear description of the problem or suggestion.

Steps to reproduce (for bugs).

Your browser and device (e.g., "Chrome on Android" or "Safari on iPhone 13").

Submitting Changes
Fork the repository.

Create a feature branch:

bash
git checkout -b feature/your-feature-name
Make your changes. Since the project is a single HTML file, most changes will be in index.html.

Test your changes on both desktop and mobile.

Commit your changes:

bash
git commit -m "Add: brief description of your change"
Push to your branch:

bash
git push origin feature/your-feature-name
Open a pull request with a clear description of what you changed and why.

Code Style
Use vanilla JavaScript (no frameworks).

Keep the single-file architecture unless there's a compelling reason to split.

Match the existing code style (2-space indentation, clear variable names).

Comment complex logic, especially around timing and statistics calculations.

License
This project is open source and available under the MIT License. You are free to use, modify, and distribute the code, provided you include the original copyright notice.

See the LICENSE file for details.

Contact
Project Maintainer: Krameshece

GitHub: @krameshece-ctrl

Issues: Project Issues Page

For questions about the timer, the best place to ask is the GitHub Issues page. For private matters, you can reach out through GitHub.

Acknowledgments
The speedcubing community — for inspiration, feedback, and the endless pursuit of faster times.

WCA (World Cube Association) — for establishing the standards around scrambles, inspection, and averages that this timer follows.

Tailwind CSS — for making it possible to build a polished interface without a build step.

Google Fonts — for the Inter and JetBrains Mono typefaces used throughout the interface.

Every cuber who tests the timer — your feedback makes it better.

Built for cubers, by a cuber. Go break a PB. 🧩⚡

