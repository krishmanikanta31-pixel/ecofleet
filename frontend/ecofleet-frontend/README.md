# EcoFleet Command

Lovable Prompt — EcoFleet (SIH 2026)

Copy everything below into Lovable as your build prompt.

Build a two-part web app called EcoFleet — "Quantum-Inspired Fuel Consumption Prediction & Green Fleet Optimization" — for a Smart India Hackathon 2026 submission under the Smart Vehicles theme. Part 1 is a marketing/pitch landing page. Part 2 is a linked, working fleet-management dashboard with realistic dummy data. Use React with Tailwind CSS, smooth scroll-based animations (fade-up on scroll), and Recharts for all charts.

Design system

Theme: dark, mirroring a fleet-command-center feel — background #0A1710 to #0D1F14 gradient, card surfaces #0F2818 with a 1px #1E3A28 border and soft rounded corners (16px).

Primary accent: green gradient from #22C55E to #16A34A, used for CTAs, active states, positive metrics, and highlight borders.

Secondary accents: amber #F59E0B for warnings, red #EF4444 for alerts, blue #3B82F6 for informational badges.

Typography: "Poppins" for headings (600–700 weight), "Inter" for body text. Large hero headline (56–64px desktop, 32px mobile), generous line-height.

Micro-interactions: hover-lift on cards (translateY -4px + glow shadow), animated counters on stat numbers, subtle pulsing dot on "live" indicators.

Iconography: lucide-react icons throughout (Leaf, Zap, TrendingDown, MapPin, AlertTriangle, Atom, Car, Fuel).

PART 1 — Landing Page (route: /)

1. Navbar

Sticky, transparent-to-solid on scroll. Left: leaf/circuit hybrid logo mark + "EcoFleet" wordmark with tagline "Smart Fleet. Quantum Future." beneath it in small caps. Center nav links: Problem, Our Approach, Features, Impact, Tech Stack, Live Demo. Right: a green gradient "View Live Dashboard" button linking to /dashboard.

2. Hero section

Full-height, dark radial gradient background with a faint animated circuit/atom-orbit pattern behind the content.

Small pill badge: "Smart India Hackathon 2026 · Smart Vehicles"

Headline: "Predicting Fuel. Preventing Waste. Powering a Greener India's Fleets."

Subheadline: "EcoFleet uses quantum-inspired optimization and AI-driven fuel prediction to help commercial and government fleets cut fuel consumption by up to 14%, reduce CO₂ emissions, and plan every route smarter — updated every single minute."

Two CTAs: primary green button "Explore Live Dashboard" (links to /dashboard), secondary outlined button "See How It Works" (scrolls to Our Approach section).

Below the CTAs, a row of 4 animated stat counters that count up on scroll into view: "14% Avg. Fuel Savings", "8.9 Tons CO₂ Tracked Daily", "250+ Vehicles Monitored", "60-Second Refresh Rate".

3. Problem Statement section

Two-column layout. Left column: heading "The Problem" and body text explaining that Indian commercial and government fleets (logistics, municipal, public transport) lose 12–18% of fuel budgets to inefficient routing, unpredictable consumption patterns, poor driver behavior visibility, and lack of real-time emissions tracking — worsening both operating costs and India's transport-sector carbon footprint. State that existing fleet software gives historical reports, not real-time, minute-by-minute predictive intelligence. Right column: a stacked set of 4 small "pain point" cards with icons — "No real-time fuel forecasting" (Fuel icon), "Static, non-adaptive routing" (MapPin icon), "Invisible driver inefficiency" (AlertTriangle icon), "No live emissions accountability" (Leaf icon), each with a one-line description.

4. Our Approach — "Why Quantum-Inspired?" section

Centered heading: "A Quantum-Inspired Edge Over Traditional Optimization." Subtext explaining that classical route/fuel optimization algorithms evaluate possibilities sequentially and get stuck in local optima on large, dynamic fleets, while EcoFleet's quantum-inspired optimization (QAOA-style annealing simulated on classical hardware) explores multiple route and fuel-load combinations in parallel-weighted probability states, converging faster on near-global-optimal solutions for fuel, time, and emissions simultaneously.

Below the text, recreate a comparison widget with three side-by-side cards — "Traditional Planning" (Fuel Used 100%, Time 100%, CO₂ 100%, all shown as full-width orange progress bars), "AI Optimization" (Fuel Used 90%, Time 92%, CO₂ 90%, blue progress bars), and "Quantum-Inspired Optimization" highlighted with a green glowing border and a "Best" ribbon badge in the corner (Fuel Used 82%, Time 88%, CO₂ 82%, green progress bars). Beneath the three cards, a callout banner: "Quantum-Inspired Optimization gives the best overall performance — lower fuel usage, lower time, and lower emissions, validated across 250+ simulated fleet routes."

5. Features section

Heading: "Everything Your Fleet Command Center Needs." A responsive grid of 8 feature cards, each with an icon, title, and 1–2 line description:

AI Fuel Prediction — Forecasts tomorrow's fuel consumption using historical patterns, weather, traffic, and load data, refreshed every minute.

Quantum Route Optimization — Recomputes optimal routes in real time, balancing distance, fuel, time, and emission zones.

Live Fleet Map — Tracks every vehicle's GPS position, route deviation, and emission-zone exposure on an interactive city map.

Carbon Intelligence — Converts fuel data into CO₂ emissions automatically and tracks progress against monthly targets.

Driver Eco Scoring — Ranks drivers on braking, idling, and acceleration behavior to reward efficient driving.

Smart Alerts & Diagnostics — Flags abnormal fuel consumption, maintenance needs, and route deviations the moment they happen.

EV Transition Planner — Identifies which vehicles in the fleet are best suited to switch to electric, with projected savings.

Government Analytics Portal — Gives regulators and city planners aggregated, anonymized fleet emissions data for policy-making.

6. Impact & SDG Alignment section

Dark green banner section. Heading: "Built for India's Climate Goals." Three impact stat blocks with big numbers: "Up to 14% fuel cost reduction per fleet", "8.5 Tons/year CO₂ reduction per 42 vehicles transitioned to EV", "60-second data refresh for true real-time accountability." Below, a row of SDG alignment badges/cards referencing UN Sustainable Development Goals: SDG 9 (Industry, Innovation & Infrastructure — smart transport tech), SDG 11 (Sustainable Cities & Communities — cleaner urban fleets), SDG 13 (Climate Action — direct CO₂ reduction), SDG 12 (Responsible Consumption — optimized fuel use). Each badge has the SDG number, name, and one line connecting it to EcoFleet's function.

7. Tech Stack section

Heading: "What Powers EcoFleet." A grid of labeled technology chips grouped into 4 categories, each category as a small card:

Frontend & Visualization: React, Tailwind CSS, Recharts, Mapbox/Leaflet for live maps.

AI & Prediction Engine: Python, scikit-learn / TensorFlow for fuel consumption forecasting models trained on historical fleet + traffic + weather data.

Quantum-Inspired Optimization: Simulated annealing / QAOA-inspired heuristics (Qiskit-style formulation run on classical solvers) for route and load optimization.

Backend & Real-Time Data: Node.js/FastAPI backend, WebSocket-based live data pipeline for minute-by-minute vehicle telemetry, PostgreSQL for historical analytics.

8. Final CTA section

Centered, full-width green gradient card: heading "See EcoFleet in Action" with subtext "Explore a live simulated fleet of 250 vehicles — real-time fuel prediction, quantum route optimization, and emissions tracking, all in one dashboard." One large button "Launch Live Dashboard" linking to /dashboard.

9. Footer

Dark footer with EcoFleet logo/wordmark, one-line tagline, "Smart India Hackathon 2026 · Smart Vehicles Theme · Problem Statement: Quantum-Inspired Fuel Consumption Prediction and Green Fleet Optimization" as a centered credit line, and simple nav link repeats.

PART 2 — Dashboard Demo (route: /dashboard)

Recreate a fleet command-center dashboard styled to match the landing page's dark green theme, using realistic dummy/mock data (static or randomly fluctuating on refresh, no backend needed):

Sidebar: EcoFleet logo at top, then grouped nav sections — Main Modules (Dashboard active, Fleet Overview, AI Fuel Prediction, Route Optimization, Quantum Optimization, Drivers & Behavior, Alerts & Diagnostics), Sustainability (Carbon Intelligence, EV Transition, Sustainability Goals), Government Portal (Govt. Analytics, Reports & Insights, What-If Simulator), Others (AI Assistant with "New" badge, Settings, Logout). Bottom of sidebar: a small green "Together for a Greener Tomorrow" card.

Top bar: search input, notification bell with badge count, and a user profile chip (name + "Fleet Manager" role).

Top stat row: 6 stat cards — Total Vehicles (250, +12 this month), Active Vehicles (218, 87% of total), Fuel Consumed Today (3,420 L), Predicted Tomorrow (3,180 L, -6.3% vs today), CO₂ Emissions Today (8.9 Tons, -7.1% vs today), Fuel Saving Potential (8.4%, "High Saving Opportunity"), each with a small sparkline trend and directional arrow colored green (improvement) or red.

Fuel Consumption Trend chart: line chart, Mon–Sun, two series (Actual solid green line, Predicted dashed light-green line), with a "This Week" dropdown.

CO₂ Emissions Trend chart: line chart, Week 1–4, two series (Actual solid, Target dashed), "This Month" dropdown.

Live Fleet Map card: styled map placeholder showing Hyderabad-area zones with colored route lines and vehicle pin markers, a legend for Low/Medium/High Emission Zones, and toggles for Show Traffic / Show Routes / High Emission Zones.

Route Optimization card: side-by-side comparison of "Current Route (Normal)" vs "Optimized Route (Green)" — Distance, Fuel, Time, CO₂ Emission, Cost for each — with a center badge "Better by 14% Fuel Saved" and a green callout: "You will save 0.9 L fuel and 2.2 kg CO₂ by using optimized route!"

Smart Alerts panel: list of 4 alerts with colored icons and timestamps — abnormal fuel consumption spike, maintenance required, route deviation, and an eco-driving achievement (green check).

Driver Eco Score (Top 3) panel: 3 driver rows with avatar, name, score out of 100, and a progress bar.

EV Transition Recommendation card: vehicle graphic, "42 Vehicles suitable for EV transition," projected annual savings in ₹, and projected CO₂ reduction in tons/year.

Quantum-Inspired Optimization Result panel (full-width, bottom): the same 3-way comparison (Traditional Planning / AI Optimization / Quantum-Inspired Optimization, with the quantum card highlighted and a "Best" ribbon) plus a "Run Optimization" button and an explanatory line about quantum-inspired optimization giving the best overall fuel/time/CO₂ performance.

Bottom stat strip: Total Distance Today, Average Fuel Efficiency, Total Cost Today, Idle Time (Total), Most Efficient Vehicle — as 5 small inline stat chips.

Make all charts and numbers internally consistent (e.g., predicted tomorrow should be lower than today's actual, reflecting the optimization narrative), and ensure the dashboard feels alive with a subtle "Live" pulsing indicator near the top stat row.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://quantum-eco-drive.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f0807794-35b2-4635-a746-68ce46e85bc6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
