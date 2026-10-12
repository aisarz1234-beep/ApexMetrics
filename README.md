# ⚡ ApexMetrics

> **Unified Multi-Discipline Athletic Point Platform with Real-Time Leaderboards, RPG Character Progression, and Co-Op Boss Raids**

ApexMetrics solves the fragmented fitness dilemma by mathematically normalizing diverse athletic disciplines—cardiovascular endurance, rep-based calisthenics, volume-based weightlifting, and time-based sports—into a standardized, fair score powering real-time dynamic leaderboards.

---

## 🚀 Key Features

### 1. Unified Scoring Engine
Applies weighted physical load multipliers to standardize diverse physical efforts:
* **Distance Cardio (Points / km):**
  * 🏊 **Swimming:** $30.0\text{ pts/km}$ (High-resistance, full-body cardiovascular load)
  * 🏃 **Running:** $10.0\text{ pts/km}$ (High-impact, bodyweight-supported movement)
  * 🚴 **Cycling:** $3.0\text{ pts/km}$ (Mechanical advantage & efficiency)
* **Rep-Based Calisthenics (Points / rep):**
  * 🧗 **Pull-up / Chin-up:** $3.0\text{ pts/rep}$ (High upper-body relative strength)
  * 🤸 **Push-up:** $0.8\text{ pts/rep}$ (Standard bodyweight movement baseline)
  * 🦵 **Bodyweight Squat / Lunge:** $0.5\text{ pts/rep}$ (Lower-body endurance)
  * ⏱️ **Plank:** $0.2\text{ pts/sec}$ (Time-under-tension core metric)
* **Strength Training / Weightlifting (Volume-Based):**
  * $\text{Points} = (\text{Weight in kg} \times \text{Reps}) \times \text{Coefficient}$
  * 🏋️ **Compound Lifts** (Squat, Deadlift, Bench Press, OHP): $\text{Coefficient} = 0.05$ per kg-rep
  * 💪 **Isolation Lifts** (Curls, Lateral Raises, Pushdowns): $\text{Coefficient} = 0.02$ per kg-rep
* **Time-Based Sports / HIIT (Points / minute):**
  * 🔥 **High-Intensity** (HIIT, Sparring, Competitive Matches): $2.0\text{ pts/min}$
  * 🧘 **Moderate-Intensity** (Yoga, Mobility, Recovery): $1.0\text{ pt/min}$

---

### 2. Fun & Gamification Mechanics
* **RPG Character Attributes & Classes:**
  * 4 Core Attributes: **Strength**, **Endurance**, **Agility**, and **Stamina** visualized with an interactive Recharts radar chart.
  * Specialized Classes:
    * *Juggernaut* (+10% on compound strength lifts)
    * *Apex Strider* (+10% on running cardio)
    * *Aquanaut* (+15% on swimming cardio)
    * *Shinobi* (+10% on calisthenics reps)
    * *Vanguard* (+5% balanced across all disciplines)
  * Level & XP Progression with dynamic progress bars.
* **Group Boss Raids (Co-op):**
  * Athletes unite against virtual World Bosses (e.g., *Kronos the Iron Behemoth*).
  * Every workout logged deals direct damage to the boss's HP pool.
  * MVP damage leaderboard & team energy cheers.
* **Campus Turf Wars & Territory Capture:**
  * Sector-based map of campus athletic grounds (*The Iron Dungeon*, *Track Stadium*, *Aquatic Center*, *Stadium Steps*, *Campus Green*).
  * Team factions (*Crimson Lions*, *Cobalt Titans*, *Emerald Vipers*) capture and fortify zones to grant passive +5% training buffs.
* **Dynamic Daily Bounties & Quests:**
  * Rotating challenges (e.g., *Dawn Patrol*, *Century Calisthenics*, *Iron Colossus Volume*) granting multipliers and bonus points.
* **Milestone Evolution Badges:**
  * Humorous and stylized animated accolades (*Waterlogged*, *Gravity Defier*, *Iron Disciple*, *Century Club*).

---

### 3. Hybrid Anti-Cheat & Production Security
* **Smartwatch GPS Track Parsing:**
  * Integrated GPX/FIT file parser calculating true Haversine distance, elapsed time, cadence, and heart rates.
  * Rejects superhuman paces ($< 2\text{m } 15\text{s / km}$ running).
* **Strava API OAuth 2.0 Integration:**
  * Synchronize certified GPS runs and rides directly to eliminate self-reported claims.
* **Heuristic Non-Cardio Caps:**
  * Strict physical ceilings on single-session volume and repetition bursts.
* **Peer-Review Activity Feed:**
  * Extreme outliers automatically flagged for community verification with proof inspection and voting.
* **Production Security:**
  * JWT authentication & salted bcrypt password hashing.
  * IDOR prevention middleware ensuring record authorization integrity.
  * Rate-limiting on authentication and API endpoints.
  * Helmet security headers & parameterized queries.

---

### 4. Real-Time Dynamic Leaderboards
* **Redis Sorted Set (ZSET) Engine:**
  * Instant $O(\log N)$ real-time rank computation.
* **Flexible Scopes & Filters:**
  * Timeframes: Daily, Weekly, All-Time.
  * Campus Sectors: Global, Engineering Quad, Main Gym, Aquatic Center, North Oval, Downtown.
  * Faction Teams: All, Crimson Lions, Cobalt Titans, Emerald Vipers.
* **Real-Time WebSockets:**
  * Live Socket.io push events update ranks instantly whenever any athlete logs a workout.

---

## 🛠️ Quick Start & Running Locally

### 1. Requirements
* Node.js v18+ & npm

### 2. Start the Fullstack Application
ApexMetrics is equipped with automated static client serving directly from the server:

```powershell
# Run the combined production server & API on port 5000:
npm start

# Or run client & server concurrently in development mode with HMR:
npm run dev
```

Visit **http://localhost:5000** in your web browser.

---

## 🧪 Demo Athletes (Pre-Seeded)
You can instantly switch between athletes directly from the user dropdown in the top-right navbar:
* **Alex Vance** (`alex@apexmetrics.io` / `apex1234`): Apex Strider • Crimson Lions • Engineering Quad
* **Marcus Thorne** (`marcus@apexmetrics.io` / `apex1234`): Juggernaut • Cobalt Titans • Main Gym
* **Elena Rostova** (`elena@apexmetrics.io` / `apex1234`): Aquanaut • Emerald Vipers • Aquatic Center
* **Kai Takahashi** (`kai@apexmetrics.io` / `apex1234`): Shinobi • Crimson Lions • North Oval
