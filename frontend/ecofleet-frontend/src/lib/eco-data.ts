export type Tone = "primary" | "warning" | "destructive" | "info";

export const toneText: Record<Tone, string> = {
  primary: "text-primary",
  warning: "text-warning",
  destructive: "text-destructive",
  info: "text-info",
};

export const toneBg: Record<Tone, string> = {
  primary: "bg-primary/15 text-primary",
  warning: "bg-warning/15 text-warning",
  destructive: "bg-destructive/15 text-destructive",
  info: "bg-info/15 text-info",
};

export const toneDot: Record<Tone, string> = {
  primary: "bg-primary",
  warning: "bg-warning",
  destructive: "bg-destructive",
  info: "bg-info",
};

export const spark = (seed: number[]) => seed.map((v, i) => ({ i, v }));

export const fuelTrend = [
  { day: "Mon", actual: 3260, predicted: 3300 },
  { day: "Tue", actual: 3390, predicted: 3340 },
  { day: "Wed", actual: 3310, predicted: 3280 },
  { day: "Thu", actual: 3480, predicted: 3400 },
  { day: "Fri", actual: 3520, predicted: 3450 },
  { day: "Sat", actual: 3400, predicted: 3320 },
  { day: "Sun", actual: 3420, predicted: 3180 },
];

export const co2Trend = [
  { week: "Week 1", actual: 64.2, target: 62.0 },
  { week: "Week 2", actual: 62.8, target: 61.0 },
  { week: "Week 3", actual: 60.4, target: 60.0 },
  { week: "Week 4", actual: 58.1, target: 59.0 },
];

export const routeCompare = [
  { metric: "Distance", current: "18.6 km", optimized: "17.4 km" },
  { metric: "Fuel", current: "6.4 L", optimized: "5.5 L" },
  { metric: "Time", current: "48 min", optimized: "42 min" },
  { metric: "CO₂ Emission", current: "16.8 kg", optimized: "14.6 kg" },
  { metric: "Cost", current: "₹ 612", optimized: "₹ 526" },
];

export const drivers = [
  { name: "Ravi Teja", vehicle: "TS09-UA-2210", score: 96 },
  { name: "Anjali Sharma", vehicle: "TS08-KB-7745", score: 93 },
  { name: "Mohd. Irfan", vehicle: "TS11-JC-1902", score: 90 },
];

export const zones: { label: string; tone: Tone }[] = [
  { label: "Low Emission Zone", tone: "primary" },
  { label: "Medium Emission Zone", tone: "warning" },
  { label: "High Emission Zone", tone: "destructive" },
];

export const pins: { top: string; left: string; tone: Tone; name: string }[] = [
  { top: "22%", left: "18%", tone: "primary", name: "Miyapur" },
  { top: "36%", left: "44%", tone: "warning", name: "Ameerpet" },
  { top: "58%", left: "30%", tone: "primary", name: "Gachibowli" },
  { top: "48%", left: "68%", tone: "destructive", name: "Secunderabad" },
  { top: "72%", left: "58%", tone: "warning", name: "LB Nagar" },
  { top: "30%", left: "78%", tone: "primary", name: "Uppal" },
];

/* ---- routes screen ---- */

export const activeRoutes = [
  {
    id: "H-7",
    vehicle: "TS09-UA-2210",
    driver: "Ravi Teja",
    from: "Miyapur",
    to: "Uppal",
    load: "78%",
    status: "Optimized",
    tone: "primary" as Tone,
    fuel: 5.5,
    saving: 14,
  },
  {
    id: "H-12",
    vehicle: "TS08-KB-7745",
    driver: "Anjali Sharma",
    from: "Gachibowli",
    to: "Secunderabad",
    load: "64%",
    status: "Optimizing",
    tone: "info" as Tone,
    fuel: 7.1,
    saving: 9,
  },
  {
    id: "H-19",
    vehicle: "TS11-JC-1902",
    driver: "Mohd. Irfan",
    from: "LB Nagar",
    to: "Ameerpet",
    load: "91%",
    status: "Normal",
    tone: "warning" as Tone,
    fuel: 8.4,
    saving: 0,
  },
  {
    id: "H-24",
    vehicle: "TS09-UB-4412",
    driver: "Suresh Babu",
    from: "Kukatpally",
    to: "Shamshabad",
    load: "55%",
    status: "Deviation",
    tone: "destructive" as Tone,
    fuel: 9.2,
    saving: 0,
  },
];

export const vehicleComparison = [
  {
    vehicle: "TS09-UA-2210",
    type: "Light Truck",
    distance: "184 km",
    fuel: "44 L",
    co2: "116 kg",
    efficiency: "4.18 km/L",
    saving: "12.4%",
    best: true,
  },
  {
    vehicle: "TS08-KB-7745",
    type: "Van",
    distance: "162 km",
    fuel: "41 L",
    co2: "108 kg",
    efficiency: "3.95 km/L",
    saving: "9.1%",
  },
  {
    vehicle: "TS11-JC-1902",
    type: "Heavy Truck",
    distance: "208 km",
    fuel: "68 L",
    co2: "179 kg",
    efficiency: "3.05 km/L",
    saving: "6.2%",
  },
];

export const routeFuelByHour = [
  { hour: "06", normal: 62, optimized: 55 },
  { hour: "08", normal: 96, optimized: 78 },
  { hour: "10", normal: 88, optimized: 72 },
  { hour: "12", normal: 74, optimized: 63 },
  { hour: "14", normal: 81, optimized: 68 },
  { hour: "16", normal: 104, optimized: 84 },
  { hour: "18", normal: 112, optimized: 88 },
  { hour: "20", normal: 70, optimized: 58 },
];

/* ---- government screen ---- */

export const emissionByZone = [
  { zone: "Miyapur", co2: 9.4, limit: 12 },
  { zone: "Ameerpet", co2: 14.2, limit: 12 },
  { zone: "Gachibowli", co2: 8.1, limit: 12 },
  { zone: "Secunderabad", co2: 16.8, limit: 12 },
  { zone: "LB Nagar", co2: 12.9, limit: 12 },
  { zone: "Uppal", co2: 7.6, limit: 12 },
];

export const operatorLeaderboard = [
  { operator: "EcoFleet Logistics", vehicles: 250, score: 92, co2: "58.1 T", trend: -7.1 },
  { operator: "Deccan Movers", vehicles: 180, score: 84, co2: "49.4 T", trend: -3.2 },
  { operator: "Charminar Transports", vehicles: 210, score: 76, co2: "66.2 T", trend: -1.1 },
  { operator: "Telangana Freight Co.", vehicles: 145, score: 68, co2: "52.8 T", trend: 2.4 },
  { operator: "Hyd Express Cargo", vehicles: 96, score: 61, co2: "41.7 T", trend: 4.6 },
];

export const cityCompliance = [
  { month: "Apr", compliant: 68, target: 70 },
  { month: "May", compliant: 72, target: 74 },
  { month: "Jun", compliant: 77, target: 78 },
  { month: "Jul", compliant: 81, target: 82 },
  { month: "Aug", compliant: 86, target: 84 },
];
