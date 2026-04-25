import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "vscj-budget-v3";

const defaultCategories = [
  {
    id: "rent",
    name: "Miete",
    icon: "🏠",
    color: "#60a5fa",
    softColor: "#dbeafe",
    budget: 0,
    type: "fix",
    setup: true,
    entries: [],
  },
  {
    id: "health",
    name: "Krankenkasse",
    icon: "❤️",
    color: "#fb7185",
    softColor: "#ffe4e6",
    budget: 0,
    type: "fix",
    setup: true,
    entries: [],
  },
  {
    id: "savings",
    name: "Sparkonto",
    icon: "🐷",
    color: "#34d399",
    softColor: "#d1fae5",
    budget: 0,
    type: "saving",
    setup: true,
    entries: [],
  },
  {
    id: "bills",
    name: "Rechnungen",
    icon: "🧾",
    color: "#facc15",
    softColor: "#fef9c3",
    budget: 0,
    type: "flex",
    setup: false,
    entries: [],
  },
  {
    id: "food",
    name: "Essen",
    icon: "🍕",
    color: "#fb923c",
    softColor: "#ffedd5",
    budget: 0,
    type: "flex",
    setup: false,
    entries: [],
  },
  {
    id: "fun",
    name: "Freizeit",
    icon: "🎮",
    color: "#a78bfa",
    softColor: "#ede9fe",
    budget: 0,
    type: "flex",
    setup: false,
    entries: [],
  },
];

const today = new Date().toISOString().slice(0, 10);
const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  .toISOString()
  .slice(0, 10);

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    color: "#0f172a",
    padding: 16,
  },
  phone: { maxWidth: 440, margin: "0 auto" },
  topBar: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 18, paddingTop: 10 },
  logoRow: { display: "flex", alignItems: "center", gap: 10 },
  logo: { width: 46, height: 46, borderRadius: 16, background: "#0f172a", color: "white", display: "grid", placeItems: "center", fontSize: 24, boxShadow: "0 10px 25px rgba(15, 23, 42, 0.18)" },
  appTitle: { margin: 0, fontSize: 24, lineHeight: 1.05, fontWeight: 950, letterSpacing: -0.8 },
  smallText: { margin: 0, color: "#64748b", fontSize: 13, fontWeight: 650 },
  pillButton: { border: 0, borderRadius: 999, background: "white", padding: "10px 13px", fontWeight: 900, boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)", cursor: "pointer", whiteSpace: "nowrap" },
  hero: { background: "#ffffff", borderRadius: 32, padding: 22, boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)", marginBottom: 14 },
  label: { margin: 0, fontSize: 11, fontWeight: 950, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.9 },
  budgetInput: { width: "100%", border: 0, outline: 0, fontSize: 44, fontWeight: 950, letterSpacing: -2, color: "#0f172a", background: "transparent", marginTop: 6 },
  dateInput: { width: "100%", border: "2px solid #e2e8f0", borderRadius: 18, padding: 12, marginTop: 8, fontWeight: 900, background: "#f8fafc", color: "#0f172a", boxSizing: "border-box" },
  summaryGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 14 },
  summaryBox: { background: "#f8fafc", borderRadius: 18, padding: 10, textAlign: "center" },
  summaryNumber: { margin: "4px 0 0", fontWeight: 950, fontSize: 15 },
  alert: { marginTop: 12, background: "#0f172a", color: "white", borderRadius: 22, padding: 14, fontSize: 14, fontWeight: 750, lineHeight: 1.35 },
  sectionTitle: { display: "flex", alignItems: "center", justifyContent: "space-between", margin: "18px 2px 10px" },
  h2: { margin: 0, fontSize: 18, fontWeight: 950, letterSpacing: -0.4 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  card: { border: 0, borderRadius: 28, padding: 15, textAlign: "left", minHeight: 148, cursor: "pointer", boxShadow: "0 12px 28px rgba(15, 23, 42, 0.08)", transition: "transform 160ms ease, box-shadow 160ms ease" },
  cardTop: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 },
  iconBubble: { width: 42, height: 42, borderRadius: 16, background: "rgba(255,255,255,0.75)", display: "grid", placeItems: "center", fontSize: 24 },
  statusBubble: { borderRadius: 999, background: "rgba(255,255,255,0.75)", padding: "6px 9px", fontSize: 12, fontWeight: 950 },
  cardName: { margin: "14px 0 4px", fontSize: 17, fontWeight: 950, letterSpacing: -0.3 },
  cardMoney: { margin: 0, color: "#334155", fontSize: 13, fontWeight: 850 },
  progressOuter: { height: 10, background: "rgba(255,255,255,0.8)", borderRadius: 999, overflow: "hidden", marginTop: 12 },
  progressInner: { height: "100%", borderRadius: 999 },
  detail: { marginTop: 14, borderRadius: 34, padding: 18, boxShadow: "0 16px 40px rgba(15, 23, 42, 0.10)" },
  detailHeader: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 16 },
  detailTitle: { margin: 0, fontSize: 26, fontWeight: 950, letterSpacing: -0.8 },
  detailStats: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 },
  stat: { background: "rgba(255,255,255,0.72)", borderRadius: 20, padding: 10 },
  statValue: { margin: "4px 0 0", fontWeight: 950, fontSize: 15 },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 },
  inputWrap: { background: "rgba(255,255,255,0.72)", borderRadius: 20, padding: 11 },
  input: { width: "100%", border: 0, outline: 0, background: "transparent", fontWeight: 900, fontSize: 18, color: "#0f172a", marginTop: 4, boxSizing: "border-box" },
  fullInputWrap: { background: "rgba(255,255,255,0.72)", borderRadius: 20, padding: 11, marginTop: 10 },
  message: { background: "rgba(255,255,255,0.72)", borderRadius: 22, padding: 13, marginTop: 14, fontSize: 14, fontWeight: 760, lineHeight: 1.4 },
  primaryButton: { width: "100%", border: 0, borderRadius: 22, background: "#0f172a", color: "white", padding: "14px 16px", fontWeight: 950, fontSize: 15, cursor: "pointer", marginTop: 10 },
  secondaryButton: { width: "100%", border: 0, borderRadius: 18, background: "rgba(255,255,255,0.75)", color: "#0f172a", padding: "11px 12px", fontWeight: 950, fontSize: 14, cursor: "pointer", marginTop: 8 },
  entryList: { display: "grid", gap: 8, marginTop: 12 },
  entry: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, background: "rgba(255,255,255,0.72)", borderRadius: 18, padding: "10px 12px" },
  tinyButton: { border: 0, background: "#fee2e2", color: "#991b1b", borderRadius: 999, padding: "7px 9px", fontWeight: 950, cursor: "pointer" },
  modalBackdrop: { position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", display: "flex", alignItems: "flex-end", justifyContent: "center", padding: 14, zIndex: 50 },
  modal: { width: "100%", maxWidth: 440, maxHeight: "88vh", overflow: "auto", background: "white", borderRadius: 34, padding: 18, boxShadow: "0 24px 80px rgba(15,23,42,0.35)", boxSizing: "border-box" },
  questionCard: { background: "#f8fafc", borderRadius: 24, padding: 14, marginTop: 10 },
  select: { width: "100%", border: "2px solid #e2e8f0", borderRadius: 16, padding: 12, marginTop: 8, fontWeight: 850, background: "white" },
  wrappedHero: { background: "linear-gradient(135deg, #0f172a 0%, #4c1d95 55%, #be185d 100%)", color: "white", borderRadius: 28, padding: 18, marginTop: 10 },
  wrappedBig: { margin: "8px 0 0", fontSize: 34, fontWeight: 950, letterSpacing: -1.4 },
  setupTitle: { fontSize: 32, fontWeight: 950, letterSpacing: -1.2, margin: "12px 0 8px", lineHeight: 1.05 },
  setupSubtitle: { color: "#64748b", fontWeight: 750, lineHeight: 1.4, margin: 0 },
};

function chf(value) {
  const number = Number(value) || 0;
  return new Intl.NumberFormat("de-CH", { style: "currency", currency: "CHF", maximumFractionDigits: 0 }).format(number);
}

function safeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, number) : 0;
}

function spentOf(category) {
  return (category.entries || []).reduce((sum, entry) => sum + safeNumber(entry.amount), 0);
}

function getStatus(category) {
  const spent = spentOf(category);
  const remaining = category.budget - spent;
  const percent = category.budget > 0 ? spent / category.budget : 0;

  if (category.type === "saving") {
    if (spent >= category.budget && category.budget > 0) return { icon: "🎉", label: "Ziel", tone: "good" };
    return { icon: "🐷", label: "Sparen", tone: "neutral" };
  }

  if (remaining < 0) return { icon: "⚠️", label: "Drüber", tone: "bad" };
  if (percent < 0.75) return { icon: "✅", label: "Locker", tone: "good" };
  return { icon: "👀", label: "Achtung", tone: "warn" };
}

function categoryMessage(category) {
  const spent = spentOf(category);
  const remaining = category.budget - spent;
  const status = getStatus(category);

  if (category.setup && category.type === "fix") {
    return "Diese Fixkosten sind fest im Monatsbudget eingeplant. Du kannst sie hier ändern, aber normalerweise bleiben sie jeden Monat gleich.";
  }

  if (category.type === "saving") {
    if (spent >= category.budget && category.budget > 0) return "Stark! Dein Sparziel ist erreicht. Dein Zukunfts-Ich macht gerade einen kleinen Freudentanz 🐷✨";
    return `Noch ${chf(remaining)} bis zum Sparziel. Mini-Tipp: direkt nach dem Lohn aufs Sparkonto überweisen.`;
  }

  if (status.tone === "bad") return `Du bist ${chf(Math.abs(remaining))} über dem Plan. Kein Drama: Für den Rest des Monats kleine Ausgaben stoppen und nächste Woche bewusst günstiger planen 🎯`;
  if (status.tone === "warn") return "Du bist noch im Plan, aber diese Kategorie wird langsam warm. Tipp: vor dem nächsten Kauf kurz 10 Sekunden warten 👀";
  return `Sehr gut! In dieser Kategorie hast du noch ${chf(remaining)} Luft. Genau so bleibt das Monatsbudget entspannt ✅`;
}

function calculateSmartPlan(monthlyBudget, categories, profile) {
  const income = safeNumber(monthlyBudget);
  const fixedTotal = categories.filter((category) => category.setup).reduce((sum, category) => sum + safeNumber(category.budget), 0);
  const available = Math.max(0, income - fixedTotal);

  let billsRate = 0.2;
  let foodRate = 0.45;
  let funRate = 0.35;

  if (profile.goal === "safety") {
    billsRate = 0.22;
    foodRate = 0.48;
    funRate = 0.3;
  }
  if (profile.goal === "fun") {
    billsRate = 0.16;
    foodRate = 0.42;
    funRate = 0.42;
  }
  if (profile.goal === "debt") {
    billsRate = 0.3;
    foodRate = 0.45;
    funRate = 0.25;
  }
  if (profile.lifestyle === "home") {
    foodRate += 0.06;
    funRate -= 0.06;
  }
  if (profile.lifestyle === "social") {
    foodRate -= 0.06;
    funRate += 0.06;
  }
  if (profile.risk === "tight") {
    funRate -= 0.08;
    billsRate += 0.04;
    foodRate += 0.04;
  }

  const totalRate = billsRate + foodRate + funRate;
  billsRate /= totalRate;
  foodRate /= totalRate;
  funRate /= totalRate;

  return {
    bills: Math.round(available * billsRate),
    food: Math.round(available * foodRate),
    fun: Math.round(available * funRate),
    fixedTotal,
    available,
  };
}

function sortCategories(categories) {
  const order = { fix: 1, saving: 2, flex: 3 };
  return [...categories].sort((a, b) => order[a.type] - order[b.type]);
}

export default function App() {
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [monthStart, setMonthStart] = useState(firstDayOfMonth);
  const [categories, setCategories] = useState(defaultCategories);
  const [selectedId, setSelectedId] = useState("food");
  const [setupDone, setSetupDone] = useState(false);
  const [showCoach, setShowCoach] = useState(false);
  const [showWrapped, setShowWrapped] = useState(false);
  const [newExpense, setNewExpense] = useState("");
  const [newNote, setNewNote] = useState("");
  const [profile, setProfile] = useState({ goal: "safety", lifestyle: "balanced", risk: "normal" });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const data = JSON.parse(saved);
      if (data.monthlyBudget !== undefined) setMonthlyBudget(data.monthlyBudget);
      if (data.monthStart) setMonthStart(data.monthStart);
      if (Array.isArray(data.categories)) setCategories(data.categories);
      if (data.profile) setProfile(data.profile);
      if (data.setupDone !== undefined) setSetupDone(data.setupDone);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ monthlyBudget, monthStart, categories, profile, setupDone }));
  }, [monthlyBudget, monthStart, categories, profile, setupDone]);

  const selectedCategory = categories.find((category) => category.id === selectedId) || categories[0];
  const selectedSpent = spentOf(selectedCategory);

  const totals = useMemo(() => {
    const planned = categories.reduce((sum, category) => sum + safeNumber(category.budget), 0);
    const spent = categories.reduce((sum, category) => sum + spentOf(category), 0);
    const fixedPlanned = categories.filter((category) => category.setup).reduce((sum, category) => sum + safeNumber(category.budget), 0);
    const left = safeNumber(monthlyBudget) - fixedPlanned - spent;
    const unplanned = safeNumber(monthlyBudget) - planned;
    return { planned, spent, fixedPlanned, left, unplanned };
  }, [categories, monthlyBudget]);

  const smartPlan = useMemo(() => calculateSmartPlan(monthlyBudget, categories, profile), [monthlyBudget, categories, profile]);

  const wrapped = useMemo(() => {
    const trackable = categories.filter((category) => !category.setup || category.type === "saving");
    const sortedBySpent = [...trackable].sort((a, b) => spentOf(b) - spentOf(a));
    const biggest = sortedBySpent[0];
    const best = categories.filter((category) => !category.setup && category.type !== "saving").sort((a, b) => b.budget - spentOf(b) - (a.budget - spentOf(a)))[0];
    const overs = categories.filter((category) => !category.setup && category.type !== "saving" && spentOf(category) > category.budget);
    const savings = categories.find((category) => category.id === "savings");
    const savingProgress = savings && savings.budget ? Math.round((spentOf(savings) / savings.budget) * 100) : 0;
    return { biggest, best, overs, savings, savingProgress };
  }, [categories]);

  function updateCategory(id, field, value) {
    setCategories((current) => current.map((category) => (category.id === id ? { ...category, [field]: safeNumber(value) } : category)));
  }

  function addEntry() {
    const amount = safeNumber(newExpense);
    if (!amount) return;

    const entry = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      amount,
      note: newNote.trim() || "Eintrag",
      date: today,
    };

    setCategories((current) => current.map((category) => (category.id === selectedCategory.id ? { ...category, entries: [entry, ...(category.entries || [])] } : category)));
    setNewExpense("");
    setNewNote("");
  }

  function deleteEntry(categoryId, entryId) {
    setCategories((current) => current.map((category) => (category.id === categoryId ? { ...category, entries: (category.entries || []).filter((entry) => entry.id !== entryId) } : category)));
  }

  function applySmartPlan() {
    setCategories((current) => current.map((category) => {
      if (category.id === "bills") return { ...category, budget: smartPlan.bills };
      if (category.id === "food") return { ...category, budget: smartPlan.food };
      if (category.id === "fun") return { ...category, budget: smartPlan.fun };
      return category;
    }));
    setSelectedId("food");
    setShowCoach(false);
  }

  function finishSetup() {
    if (!monthlyBudget) {
      alert("Bitte gib zuerst dein Monatsbudget ein.");
      return;
    }
    setSetupDone(true);
    setSelectedId("food");
  }

  function startNewMonth() {
    const confirmed = window.confirm("Neuen Monat starten? Deine Fixkosten und Budgets bleiben erhalten, alle Tracking-Einträge werden auf 0 gesetzt.");
    if (!confirmed) return;
    setMonthStart(today);
    setCategories((current) => current.map((category) => ({ ...category, entries: [] })));
    setSelectedId("food");
  }

  function resetAll() {
    const confirmed = window.confirm("Alles zurücksetzen? Danach erscheint wieder das Start-Setup.");
    if (!confirmed) return;
    localStorage.removeItem(STORAGE_KEY);
    setMonthlyBudget(0);
    setMonthStart(firstDayOfMonth);
    setCategories(defaultCategories);
    setSelectedId("food");
    setSetupDone(false);
  }

  const selectedPercent = selectedCategory.budget ? Math.min(100, Math.round((selectedSpent / selectedCategory.budget) * 100)) : 0;

  if (!setupDone) {
    const rent = categories.find((category) => category.id === "rent");
    const health = categories.find((category) => category.id === "health");
    const savings = categories.find((category) => category.id === "savings");
    const fixedTotal = safeNumber(rent?.budget) + safeNumber(health?.budget) + safeNumber(savings?.budget);
    const available = safeNumber(monthlyBudget) - fixedTotal;

    return (
      <div style={styles.page}>
        <div style={styles.phone}>
          <header style={styles.topBar}>
            <div style={styles.logoRow}>
              <div style={styles.logo}>💰</div>
              <div>
                <h1 style={styles.appTitle}>VSCJ Budget</h1>
                <p style={styles.smallText}>Start-Setup</p>
              </div>
            </div>
          </header>

          <section style={styles.hero}>
            <h2 style={styles.setupTitle}>Richte deinen Monat ein</h2>
            <p style={styles.setupSubtitle}>Gib zuerst dein Monatsbudget und deine fixen Werte ein. Danach startet dein Tracking bei 0.</p>

            <label style={{ display: "block", marginTop: 18 }}>
              <p style={styles.label}>Monatsbudget</p>
              <input style={styles.budgetInput} type="number" placeholder="4500" value={monthlyBudget || ""} onChange={(event) => setMonthlyBudget(safeNumber(event.target.value))} />
            </label>

            <label style={{ display: "block", marginTop: 10 }}>
              <p style={styles.label}>Startdatum</p>
              <input style={styles.dateInput} type="date" value={monthStart} onChange={(event) => setMonthStart(event.target.value)} />
            </label>

            <div style={styles.formGrid}>
              <label style={{ ...styles.inputWrap, background: "#dbeafe" }}>
                <p style={styles.label}>🏠 Miete</p>
                <input style={styles.input} type="number" placeholder="1600" value={rent?.budget || ""} onChange={(event) => updateCategory("rent", "budget", event.target.value)} />
              </label>
              <label style={{ ...styles.inputWrap, background: "#ffe4e6" }}>
                <p style={styles.label}>❤️ Krankenkasse</p>
                <input style={styles.input} type="number" placeholder="380" value={health?.budget || ""} onChange={(event) => updateCategory("health", "budget", event.target.value)} />
              </label>
            </div>

            <label style={{ ...styles.fullInputWrap, background: "#d1fae5" }}>
              <p style={styles.label}>🐷 Sparkonto / Sparziel</p>
              <input style={styles.input} type="number" placeholder="700" value={savings?.budget || ""} onChange={(event) => updateCategory("savings", "budget", event.target.value)} />
            </label>

            <div style={styles.alert}>
              Fix eingeplant: {chf(fixedTotal)}<br />
              Übrig für Essen, Freizeit & Rechnungen: {chf(available)}
            </div>

            <button style={styles.primaryButton} onClick={finishSetup}>Tracking starten</button>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.phone}>
        <header style={styles.topBar}>
          <div style={styles.logoRow}>
            <div style={styles.logo}>💰</div>
            <div>
              <h1 style={styles.appTitle}>VSCJ Budget</h1>
              <p style={styles.smallText}>tracken · planen · feiern</p>
            </div>
          </div>
          <button style={styles.pillButton} onClick={() => setShowCoach(true)}>KI-Plan ✨</button>
        </header>

        <section style={styles.hero}>
          <p style={styles.label}>Monatsbudget</p>
          <input style={styles.budgetInput} type="number" value={monthlyBudget} onChange={(event) => setMonthlyBudget(safeNumber(event.target.value))} />

          <label>
            <p style={{ ...styles.label, marginTop: 10 }}>Startdatum des Budget-Monats</p>
            <input style={styles.dateInput} type="date" value={monthStart} onChange={(event) => setMonthStart(event.target.value)} />
          </label>

          <div style={styles.summaryGrid}>
            <div style={styles.summaryBox}>
              <p style={styles.label}>Fix geplant</p>
              <p style={styles.summaryNumber}>{chf(totals.fixedPlanned)}</p>
            </div>
            <div style={styles.summaryBox}>
              <p style={styles.label}>Getrackt</p>
              <p style={styles.summaryNumber}>{chf(totals.spent)}</p>
            </div>
            <div style={styles.summaryBox}>
              <p style={styles.label}>Frei</p>
              <p style={styles.summaryNumber}>{chf(totals.left)}</p>
            </div>
          </div>

          <div style={styles.alert}>
            {totals.left >= 0 ? `🎉 Nach Fixkosten und Einträgen bleiben dir aktuell ${chf(totals.left)}.` : `⚠️ Du bist ${chf(Math.abs(totals.left))} über deinem Monatsbudget.`}
            <br />
            {totals.unplanned >= 0 ? `Noch ${chf(totals.unplanned)} sind nicht als Kategorie-Budget verteilt.` : `Du hast ${chf(Math.abs(totals.unplanned))} mehr verplant als dein Budget.`}
          </div>

          <button style={styles.primaryButton} onClick={() => setShowWrapped(true)}>Monats-Wrapped ansehen 🎧</button>
          <button style={styles.secondaryButton} onClick={startNewMonth}>Neuen Monat starten</button>
        </section>

        <div style={styles.sectionTitle}>
          <h2 style={styles.h2}>Kategorien</h2>
          <button style={styles.pillButton} onClick={resetAll}>Setup neu</button>
        </div>

        <section style={styles.grid}>
          {sortCategories(categories).map((category) => {
            const status = getStatus(category);
            const spent = spentOf(category);
            const percent = category.budget ? Math.min(100, Math.round((spent / category.budget) * 100)) : 0;
            const isSelected = selectedId === category.id;
            const shownSpent = category.setup && category.type === "fix" ? category.budget : spent;

            return (
              <button key={category.id} onClick={() => setSelectedId(category.id)} style={{ ...styles.card, background: category.softColor, outline: isSelected ? `3px solid ${category.color}` : "3px solid transparent", transform: isSelected ? "translateY(-3px)" : "none" }}>
                <div style={styles.cardTop}>
                  <div style={styles.iconBubble}>{category.icon}</div>
                  <div style={styles.statusBubble}>{category.setup && category.type === "fix" ? "🔒 Fix" : `${status.icon} ${status.label}`}</div>
                </div>
                <h3 style={styles.cardName}>{category.name}</h3>
                <p style={styles.cardMoney}>{category.setup && category.type === "fix" ? `${chf(category.budget)} fix` : `${chf(shownSpent)} / ${chf(category.budget)}`}</p>
                <div style={styles.progressOuter}>
                  <div style={{ ...styles.progressInner, width: `${category.setup && category.type === "fix" ? 100 : percent}%`, background: spent > category.budget ? "#ef4444" : category.color }} />
                </div>
              </button>
            );
          })}
        </section>

        <section style={{ ...styles.detail, background: selectedCategory.softColor }}>
          <div style={styles.detailHeader}>
            <div>
              <p style={{ ...styles.label, color: selectedCategory.color }}>Ausgewählte Kategorie</p>
              <h2 style={styles.detailTitle}>{selectedCategory.icon} {selectedCategory.name}</h2>
            </div>
            <div style={styles.statusBubble}>{selectedCategory.setup && selectedCategory.type === "fix" ? "🔒 Fix" : `${getStatus(selectedCategory).icon} ${getStatus(selectedCategory).label}`}</div>
          </div>

          <div style={styles.detailStats}>
            <div style={styles.stat}>
              <p style={styles.label}>Budget</p>
              <p style={styles.statValue}>{chf(selectedCategory.budget)}</p>
            </div>
            <div style={styles.stat}>
              <p style={styles.label}>{selectedCategory.setup && selectedCategory.type === "fix" ? "Fix" : selectedCategory.type === "saving" ? "Gespart" : "Ausgegeben"}</p>
              <p style={styles.statValue}>{chf(selectedCategory.setup && selectedCategory.type === "fix" ? selectedCategory.budget : selectedSpent)}</p>
            </div>
            <div style={styles.stat}>
              <p style={styles.label}>Rest</p>
              <p style={styles.statValue}>{chf(selectedCategory.budget - selectedSpent)}</p>
            </div>
          </div>

          <div style={styles.progressOuter}>
            <div style={{ ...styles.progressInner, width: `${selectedCategory.setup && selectedCategory.type === "fix" ? 100 : selectedPercent}%`, background: selectedSpent > selectedCategory.budget ? "#ef4444" : selectedCategory.color }} />
          </div>

          <label style={styles.fullInputWrap}>
            <p style={styles.label}>{selectedCategory.setup ? "Fixbetrag ändern" : "Kategorie-Budget ändern"}</p>
            <input style={styles.input} type="number" value={selectedCategory.budget} onChange={(event) => updateCategory(selectedCategory.id, "budget", event.target.value)} />
          </label>

          {!(selectedCategory.setup && selectedCategory.type === "fix") && (
            <>
              <div style={styles.formGrid}>
                <label style={styles.inputWrap}>
                  <p style={styles.label}>{selectedCategory.type === "saving" ? "Sparen hinzufügen" : "Ausgabe hinzufügen"}</p>
                  <input style={styles.input} type="number" placeholder="z.B. 25" value={newExpense} onChange={(event) => setNewExpense(event.target.value)} />
                </label>
                <label style={styles.inputWrap}>
                  <p style={styles.label}>Notiz</p>
                  <input style={styles.input} placeholder={selectedCategory.type === "saving" ? "Lohn-Sparen" : "Migros, Lunch..."} value={newNote} onChange={(event) => setNewNote(event.target.value)} />
                </label>
              </div>
              <button style={styles.primaryButton} onClick={addEntry}>+ Eintrag speichern</button>
            </>
          )}

          <p style={styles.message}>{categoryMessage(selectedCategory)}</p>

          {!(selectedCategory.setup && selectedCategory.type === "fix") && (
            <div style={styles.entryList}>
              {(selectedCategory.entries || []).length === 0 ? (
                <p style={styles.message}>Noch keine Einträge in dieser Kategorie. Jeder Monat startet bei 0.</p>
              ) : (
                selectedCategory.entries.map((entry) => (
                  <div key={entry.id} style={styles.entry}>
                    <div>
                      <strong>{entry.note}</strong>
                      <div style={{ color: "#64748b", fontSize: 12, fontWeight: 800 }}>{entry.date}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <strong>{chf(entry.amount)}</strong>
                      <button style={styles.tinyButton} onClick={() => deleteEntry(selectedCategory.id, entry.id)}>×</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>

        {showCoach && (
          <div style={styles.modalBackdrop} onClick={() => setShowCoach(false)}>
            <section style={styles.modal} onClick={(event) => event.stopPropagation()}>
              <div style={styles.detailHeader}>
                <div>
                  <p style={styles.label}>Budget Coach</p>
                  <h2 style={styles.detailTitle}>Vorschlag für den Rest ✨</h2>
                </div>
                <button style={styles.pillButton} onClick={() => setShowCoach(false)}>Schließen</button>
              </div>

              <div style={styles.questionCard}>
                <p style={styles.label}>Was ist dir diesen Monat am wichtigsten?</p>
                <select style={styles.select} value={profile.goal} onChange={(event) => setProfile({ ...profile, goal: event.target.value })}>
                  <option value="safety">Sicherheit & Reserve aufbauen</option>
                  <option value="fun">Mehr Freiheit für Freizeit</option>
                  <option value="debt">Rechnungen besser kontrollieren</option>
                </select>
              </div>

              <div style={styles.questionCard}>
                <p style={styles.label}>Wie gibst du typischerweise Geld aus?</p>
                <select style={styles.select} value={profile.lifestyle} onChange={(event) => setProfile({ ...profile, lifestyle: event.target.value })}>
                  <option value="home">Ich esse oft zuhause</option>
                  <option value="balanced">Ausgeglichen</option>
                  <option value="social">Ich bin gerne unterwegs</option>
                </select>
              </div>

              <div style={styles.questionCard}>
                <p style={styles.label}>Wie fühlt sich dein Budget aktuell an?</p>
                <select style={styles.select} value={profile.risk} onChange={(event) => setProfile({ ...profile, risk: event.target.value })}>
                  <option value="tight">Eher knapp</option>
                  <option value="normal">Normal</option>
                  <option value="comfortable">Entspannt</option>
                </select>
              </div>

              <div style={styles.message}>
                Nach Fixkosten und Sparziel von <strong>{chf(smartPlan.fixedTotal)}</strong> bleiben <strong>{chf(smartPlan.available)}</strong>. Vorschlag: {chf(smartPlan.bills)} Rechnungen, {chf(smartPlan.food)} Essen und {chf(smartPlan.fun)} Freizeit.
              </div>

              <button style={styles.primaryButton} onClick={applySmartPlan}>Vorschlag übernehmen</button>
            </section>
          </div>
        )}

        {showWrapped && (
          <div style={styles.modalBackdrop} onClick={() => setShowWrapped(false)}>
            <section style={styles.modal} onClick={(event) => event.stopPropagation()}>
              <div style={styles.detailHeader}>
                <div>
                  <p style={styles.label}>VSCJ Wrapped</p>
                  <h2 style={styles.detailTitle}>Dein Monat kurz & ehrlich 🎧</h2>
                </div>
                <button style={styles.pillButton} onClick={() => setShowWrapped(false)}>Schließen</button>
              </div>

              <div style={styles.wrappedHero}>
                <p style={{ ...styles.label, color: "rgba(255,255,255,0.75)" }}>Flexibel getrackt</p>
                <p style={styles.wrappedBig}>{chf(totals.spent)}</p>
                <p style={{ fontWeight: 800, lineHeight: 1.35 }}>
                  {totals.left >= 0 ? `Nach Fixkosten bleiben dir ${chf(totals.left)}. Stark.` : `Du bist ${chf(Math.abs(totals.left))} über Budget. Nächster Monat wird smarter.`}
                </p>
              </div>

              <div style={styles.questionCard}>
                <p style={styles.label}>Top Kategorie</p>
                <h3 style={{ margin: "6px 0 0", fontSize: 22 }}>{wrapped.biggest?.icon} {wrapped.biggest?.name}</h3>
                <p style={{ margin: "6px 0 0", fontWeight: 850 }}>{chf(spentOf(wrapped.biggest || {}))} getrackt</p>
              </div>

              <div style={styles.questionCard}>
                <p style={styles.label}>Beste Budget-Disziplin</p>
                <h3 style={{ margin: "6px 0 0", fontSize: 22 }}>{wrapped.best?.icon} {wrapped.best?.name}</h3>
                <p style={{ margin: "6px 0 0", fontWeight: 850 }}>Hier hattest du am meisten Luft.</p>
              </div>

              <div style={styles.questionCard}>
                <p style={styles.label}>Sparziel</p>
                <h3 style={{ margin: "6px 0 0", fontSize: 22 }}>🐷 {wrapped.savingProgress}% erreicht</h3>
                <p style={{ margin: "6px 0 0", fontWeight: 850 }}>{wrapped.savingProgress >= 100 ? "Sparziel geschafft. Sehr stark!" : "Noch nicht ganz dort — aber jeder Eintrag zählt."}</p>
              </div>

              <div style={styles.message}>
                {wrapped.overs.length === 0 ? "Keine flexible Kategorie überzogen. Monats-Fazit: kontrolliert, ruhig und ziemlich erwachsen. 🎉" : `${wrapped.overs.length} Kategorie(n) waren über Budget. Fokus für nächsten Monat: zuerst ${wrapped.overs[0].name} besser planen.`}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
