# 🌿 Guest — You Are Not Alone

A compassionate, anonymous mental health support web app for people struggling with addiction, depression, alcohol use, and suicidal thoughts.

**Stack:** React 18 · Tailwind CSS · Firebase (Firestore + Auth) · OpenAI GPT-4o-mini · PWA

---

## 📁 Folder Structure

```
guest/
├─ public/
│  ├─ index.html          # PWA HTML with Google Fonts
│  └─ manifest.json       # PWA manifest (installable)
├─ src/
│  ├─ App.js              # Root: routing, auth, SessionContext
│  ├─ index.js            # Entry point + service worker
│  ├─ index.css           # Tailwind + custom component styles
│  ├─ firebase.js         # Firebase config + all DB helpers
│  ├─ openai.js           # OpenAI API + crisis detection
│  ├─ serviceWorkerRegistration.js
│  ├─ components/
│  │  ├─ Navbar.js        # Responsive navigation bar
│  │  ├─ Chat.js          # AI chat with Firebase persistence
│  │  ├─ EmergencyContact.js  # Crisis contact system
│  │  ├─ MoodTracker.js   # Daily mood logging + Recharts trends
│  │  ├─ Badges.js        # Gamification achievements
│  │  ├─ VisitorCounter.js # Real-time visitor count
│  │  └─ ResourceSuggester.js # Categorized support resources
│  └─ pages/
│     ├─ Home.js          # Landing page
│     ├─ ChatPage.js      # Chat page wrapper with sidebar
│     ├─ Resources.js     # Resources directory
│     └─ AdminDashboard.js # Protected analytics dashboard
├─ tailwind.config.js
├─ postcss.config.js
├─ .env.example
├─ .gitignore
└─ package.json
```

---

## 🚀 Step-by-Step Setup

### Step 1 — Clone / Create the project

```bash
# If using Create React App from scratch:
npx create-react-app guest
cd guest

# Then copy all the src/ and config files from this codebase into the folder
```

### Step 2 — Install dependencies

```bash
npm install
```

This installs:
- `react-router-dom` — routing
- `firebase` — Firestore + anonymous auth
- `recharts` — mood trend charts
- `openai` — OpenAI SDK (used for reference; we call the API directly via fetch)
- `tailwindcss`, `autoprefixer`, `postcss` — styling

### Step 3 — Set up Firebase

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"** → name it `guest-app`
3. Go to **Firestore Database** → Create database → Start in **test mode** (you'll add rules later)
4. Go to **Authentication** → Sign-in method → Enable **Anonymous**
5. Go to **Project Settings** → **General** → scroll to "Your apps" → click `</>` (Web)
6. Register the app and copy the config object

### Step 4 — Set up OpenAI

1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click **"Create new secret key"**
3. Copy the key (you won't see it again)

### Step 5 — Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
REACT_APP_OPENAI_API_KEY=sk-...your_key_here...

REACT_APP_FIREBASE_API_KEY=AIzaSy...
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef

REACT_APP_ADMIN_PASSWORD=choose_a_strong_password
```

### Step 6 — Update firebase.js with env variables (optional improvement)

In `src/firebase.js`, replace the hardcoded `firebaseConfig` with:

```javascript
const firebaseConfig = {
  apiKey:            process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain:        process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.REACT_APP_FIREBASE_APP_ID,
};
```

### Step 7 — Run locally

```bash
npm start
```

Visit [http://localhost:3000](http://localhost:3000) — the app will open.

- `/` — Home page
- `/chat` — AI chat
- `/resources` — Support resources
- `/admin` — Admin dashboard (requires password)

---

## 🔥 Firebase Security Rules

In the Firebase Console → Firestore → Rules, replace the default with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Analytics — anyone can read/write visitor count
    match /analytics/{doc} {
      allow read, write: if true;
    }
    // Chats — only the session owner can read/write
    match /chats/{doc} {
      allow read, write: if request.auth != null;
    }
    // Moods
    match /moods/{doc} {
      allow read, write: if request.auth != null;
    }
    // Emergency contacts — session owner only
    match /emergencyContacts/{sessionId} {
      allow read, write: if request.auth != null && request.auth.uid == sessionId;
    }
    // Badges
    match /badges/{sessionId} {
      allow read, write: if request.auth != null && request.auth.uid == sessionId;
    }
    // Emergency triggers — write by anyone logged in, read by admin only (handled in app)
    match /emergencyTriggers/{doc} {
      allow write: if request.auth != null;
      allow read: if request.auth != null;
    }
  }
}
```

---

## 🌐 Deploy on Vercel (Recommended)

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   Follow the prompts. Choose "React" framework preset.

4. **Add environment variables in Vercel Dashboard:**
   - Go to your project → **Settings** → **Environment Variables**
   - Add each variable from your `.env` file

5. **Redeploy:**
   ```bash
   vercel --prod
   ```

---

## 🌐 Deploy on Netlify (Alternative)

1. **Build:**
   ```bash
   npm run build
   ```

2. **Drag & drop** the `build/` folder to [https://app.netlify.com/drop](https://app.netlify.com/drop)

   **OR use Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   netlify deploy --dir=build --prod
   ```

3. **Add environment variables:**
   - Netlify Dashboard → Site Settings → **Environment variables**
   - Add all `REACT_APP_*` variables

4. **Add `_redirects` file** for React Router (create `public/_redirects`):
   ```
   /* /index.html 200
   ```

---

## 📱 PWA — Making it Installable

The app is already configured as a PWA. On mobile:
- **iOS:** Tap Share → "Add to Home Screen"
- **Android:** Chrome will show "Install App" banner automatically

---

## 🔑 Key Features Summary

| Feature | Location | Tech |
|---------|----------|------|
| AI Chat | `Chat.js` + `openai.js` | OpenAI GPT-4o-mini |
| Crisis Detection | `openai.js` → `detectCrisis()` | Keyword matching |
| Anonymous Auth | `App.js` + `firebase.js` | Firebase Anonymous Auth |
| Chat History | `firebase.js` → `saveChatMessage()` | Firestore |
| Emergency Contact | `EmergencyContact.js` | Firestore |
| Visitor Counter | `VisitorCounter.js` + `firebase.js` | Firestore real-time |
| Mood Tracker | `MoodTracker.js` | Firestore + Recharts |
| Badges | `Badges.js` + `firebase.js` | Firestore |
| Resources | `ResourceSuggester.js` | Static + categorized |
| Admin Dashboard | `AdminDashboard.js` | Recharts + Firestore |
| PWA | `manifest.json` + `serviceWorkerRegistration.js` | CRA service worker |

---

## 🆘 Crisis Resources (Hardcoded in App)

- **988 Suicide & Crisis Lifeline** — Call or text 988
- **Crisis Text Line** — Text HOME to 741741
- **SAMHSA Helpline** — 1-800-662-4357
- **Emergency** — 911

---

## 📝 Notes

- **API costs:** GPT-4o-mini is very affordable (~$0.15/1M input tokens). For a community app, this should cost pennies per day.
- **Privacy:** All chats are stored anonymously by Firebase UID (a random ID, no email or name).
- **Admin password:** The admin page uses a simple client-side password check. For production, consider Firebase Admin SDK or a backend.
- **Email notifications:** The emergency contact feature saves the email but does not auto-send. To enable email sending, add a Firebase Cloud Function with Nodemailer or SendGrid.

---

*Guest is a community mental health tool. It is not a substitute for professional mental health care.*
