# Jason Hughes: portfolio with a terminal you can talk to

**Live site:** https://main.d27e6f0l9zjz45.amplifyapp.com
**GitHub:** https://github.com/GenialSmileAdam/Portfolio
**Challenge:** AWS Student Builder Challenge: Build Your Tech Superpower

## Summary (short version for the form)

My portfolio is a fast, static site hosted on AWS Amplify Hosting in Stockholm (eu-north-1). It has the three required sections (About me, Tech superpowers, Projects) and one creative feature: an interactive terminal. Visitors open it from the nav, from the hero, from a floating "Try my terminal" pill, or by pressing the backtick key. They type commands such as `projects`, `open orion`, `skills`, `aws` or `theme light` to explore my work instead of scrolling. It is keyboard accessible, works on mobile, and respects light mode and reduced motion.

## About me

I am a final-year Software Engineering student at Nile University of Nigeria (GPA 4.8 / 5.0) and the sole founder of Migaki Studio. I enjoy backend work: clean APIs, careful security, and connecting them to payments and language models. I led development of SafeSpace, one of seven systems shipped for the university.

## The creative feature: a terminal that explores my work

A portfolio is usually something you scroll. I wanted visitors to be able to ask it questions, the way I work every day.

- **How visitors find it:** a "Terminal" button in the nav, an "Open terminal" button in the hero, and a pill pinned to the bottom left that reads "Try my terminal. Press `". The pill gives a short nudge when the page loads and disappears while the terminal is open.
- **What it does:** `help`, `about`, `skills`, `projects`, `open <name>`, `goto <section>`, `aws`, `contact`, `theme dark|light`, `fortune`, `clear`. Up and down arrows recall earlier commands. `goto contact` closes the terminal and scrolls the page there.
- **It does not get in the way:** the terminal is optional and closes with Escape. The whole portfolio works without it.
- **Accessible:** it is a labelled dialog, focus moves into it and returns to the button that opened it, and the output is announced to screen readers.

Screenshots: `screenshots/03-terminal-feature.png` (dark) and `screenshots/06-light-theme-terminal.png` (light).

## What is on the site

| Required section | Where |
|---|---|
| About me | Section "About me", with GPA, shipped systems, JAMB score and Olympiad result |
| Skills or Tech superpowers | Section "Tech superpowers" |
| Projects or achievements | Section "Selected projects", plus the achievements in About |

Projects shown, each with a screenshot taken from the running app or its public page: Orion, SafeSpace, EcoBuy, Catsi, a CPU scheduling simulator, Village, plus written case notes for the Darling Nice API and a serverless email pipeline on AWS. Source code of client and company work is deliberately not published. I chose to show what each project does and how it looks instead.

## AWS services and tools used

| Service or tool | What I used it for |
|---|---|
| **AWS Amplify Hosting** (eu-north-1) | Hosts the site on a public HTTPS URL with a global CDN. I created the app and a `main` production branch, then deployed a zip of the static files with the AWS CLI (`create-app`, `create-branch`, `create-deployment`, `start-deployment`). |
| **AWS CLI v2 and `aws login`** | Browser-based sign-in that gives the CLI short-lived credentials, so I never copied access keys. Used for every deployment. |
| **Agent Toolkit for AWS** | Installed with `aws configure agent-toolkit`. It adds the AWS MCP Server and a catalogue of AWS agent skills to my coding agent. I confirmed it with `aws agent-toolkit list-available-skills`, which returned 120 skills. |

The project is static on purpose. For a portfolio, the right amount of infrastructure is a CDN and nothing to patch.

Evidence is in `aws-evidence/`: the Amplify app (`amplify-app.json`), the production branch (`amplify-branch.json`), two successful deployments (`amplify-deployments.json`), the CLI version, and the list of agent skills. The architecture diagram is `screenshots/07-architecture.png`.

## How I built it

1. **Content first.** I went through my own projects and backups and picked what I could show publicly. Orion is represented only by its public site, https://app.askorion.com.ng. Campus One, Orion v2 and FinCare are not on the site at all.
2. **Real screenshots, no mock-ups.** I ran the front ends locally where I could (EcoBuy, Village) and captured them with headless Chrome. For SafeSpace I used screenshots saved earlier that show only demo data, because the live app sits behind campus sign-in.
3. **Design.** My first version looked generic, so I redesigned it with a stricter brief: one accent colour, Geist type, a split hero showing real product screenshots, a bento grid with varied cell sizes, and no decorative gimmicks. Motion is limited to a scroll reveal and the terminal nudge, and both switch off for visitors who prefer reduced motion.
4. **Performance basics.** Self-hosted variable fonts, WebP images (about 400 KB for all images), explicit image sizes to avoid layout shift, and no JavaScript framework.
5. **Deploy.** Zip upload to Amplify Hosting, then a check that the live URL and images return HTTP 200.

## What I learned

- **Amplify Hosting has a simple manual path.** Create an app, create a branch, upload a zip, start the deployment. For a static site that took seconds, and the second deployment (a text fix) finished in under ten seconds.
- **`aws login` is a better default than access keys.** Credentials are short-lived and renewable, and nothing secret ends up in a file.
- **The AWS MCP Server needs to know which profile to use.** The generated config falls back to the `default` profile, so a named profile has to be set in `AWS_MCP_PROXY_PROFILES`.
- **Showing work you cannot open-source takes thought.** Screenshots and plain descriptions can carry a project without exposing code or client data.
- **Check the words, not just the layout.** After deploying, I noticed that my terminal's `aws` command claimed Amplify rebuilds on every GitHub push. That was false for my zip-based deployment. I corrected the text and redeployed.

## Challenges

- **Getting screenshots of apps that need a backend.** SafeSpace needs campus single sign-on and a hosted database, and EcoBuy needs MongoDB, so I could not run them end to end on my laptop. I used earlier screenshots with demo data for SafeSpace and cropped EcoBuy to the part that renders without data. The Darling Nice front end would not start (a missing native build dependency), so it appears as a written case note instead of a screenshot.
- **Deciding what stays private.** Several of my best projects are client or company work. Choosing what to leave out was harder than choosing what to include.
- **Deployment is manual, not automatic.** Because I deployed a zip, pushing to GitHub does not redeploy the site. Connecting the repository to Amplify for automatic builds is the next step.
- **The AWS MCP Server did not always connect.** After setup, the `aws-mcp` server timed out while connecting in a later coding session. The CLI and Agent Toolkit catalogue worked fine, so I used the AWS CLI directly for deployment. I have not yet found the cause.
- **Making it look like mine.** A first pass with default dark styling looked like every other developer portfolio. Redesigning around real product screenshots made it feel specific to me.

## Next steps

Connect the GitHub repository to Amplify for automatic deploys, add a custom domain, and add a `stack` command to the terminal that shows what each project was built with.

## Attachments in this folder

| File | What it shows |
|---|---|
| `screenshots/01-home-desktop-live.png` | Home page on the live Amplify URL, desktop |
| `screenshots/02-home-mobile-live.png` | Home page on the live URL, mobile |
| `screenshots/03-terminal-feature.png` | Creative feature: terminal open, dark theme |
| `screenshots/04-projects-desktop.png` | Hero and projects sections |
| `screenshots/05-skills-about-contact-desktop.png` | Skills, About and Contact sections |
| `screenshots/06-light-theme-terminal.png` | Terminal in light theme |
| `screenshots/07-architecture.png` | How the site is built and hosted |
| `aws-evidence/` | Amplify app, branch, deployments, CLI version, agent skills list |
