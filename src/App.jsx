import { useState, useEffect, useRef, useCallback } from "react";
import { Chart, registerables } from "chart.js";
import { createClient } from "@supabase/supabase-js";

Chart.register(...registerables);

// ─── SUPABASE CONFIG ──────────────────────────────────────────────────────────
// Replace these two values after you create your Supabase project
const SUPABASE_URL = "https://wbrgwhfoafxsxhfkozjf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indicmd3aGZvYWZ4c3hoZmtvempmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5NzcxODAsImV4cCI6MjA5MzU1MzE4MH0.xLbTHhCTtx9t1qAtYDfU2jZT6LbaNUKfE5MoYtjQBJo";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── STATIC DATA ──────────────────────────────────────────────────────────────
const START_WEIGHT = 111;

const WORKOUTS = [
  { day:"Day 1", label:"Upper Body", icon:"💪", focus:"Build mind-muscle connection. Light weights, perfect form.",
    exercises:[{name:"Wall Push-Ups / Incline Push-Ups",sets:"3 sets × 10-12 reps"},{name:"Dumbbell Floor Chest Press",sets:"4 sets × 8-12 reps"},{name:"Bent Over Dumbbell Row",sets:"3 sets × 8-12 reps"},{name:"DB Front Raise",sets:"3 sets × 12-15 reps"},{name:"Dumbbell Hammer Curl",sets:"3 sets × 10-15 reps"},{name:"Dumbbell Triceps Extension (superset)",sets:"3 sets × 15-18 reps"}]},
  { day:"Day 2", label:"Legs", icon:"🦵", focus:"Control the tempo. Feel it in the right muscles.",
    exercises:[{name:"Romanian Deadlift (superset w/ squats)",sets:"3 sets × 10-12 reps"},{name:"Chair Squats (superset w/ RDL)",sets:"3 sets × 12-15 reps"},{name:"Glute Bridges",sets:"3 sets × 18-20 reps"},{name:"Standing Dumbbell Calf Raise",sets:"3 sets × 15-20 reps"},{name:"Mountain Climbers",sets:"3 sets × 60 seconds"},{name:"Max Wall-Sit Hold",sets:"2 sets till failure"}]},
  { day:"Day 3", label:"Push Day", icon:"🔥", focus:"Chest, shoulders, triceps. Slow on the way down.",
    exercises:[{name:"Wall Push-Ups / Knee Push-Ups",sets:"3 sets × 10-12 reps"},{name:"Floor Chest Press with Dumbbells",sets:"3 sets × 12-15 reps"},{name:"Floor Dumbbell Fly",sets:"3 sets × 12-15 reps"},{name:"Dumbbell Shoulder Press",sets:"3 sets × 10-12 reps"},{name:"Dumbbell Lateral Raises (superset)",sets:"3 sets × 12-15 reps"},{name:"Dumbbell Triceps Extension",sets:"3 sets × 15-18 reps"}]},
  { day:"Day 4", label:"Pull Day", icon:"🏋️", focus:"Back and biceps. Squeeze at the top of every rep.",
    exercises:[{name:"Bent Over Row",sets:"4 sets × 10-12 reps"},{name:"Dumbbell Reverse Fly",sets:"3 sets × 12-15 reps"},{name:"Dumbbell Single Arm Row",sets:"3 sets × 10-12 reps"},{name:"Dumbbell Shrugs",sets:"3 sets × 15 reps"},{name:"Bicep Curl (superset)",sets:"3 sets × 15-18 reps"},{name:"Bicep Pulses (superset)",sets:"3 sets × 15-18 reps"}]},
  { day:"Day 5", label:"Legs + Abs", icon:"⚡", focus:"Core tight throughout. Don't rush the ab work.",
    exercises:[{name:"Bodyweight / Chair Squat",sets:"3 sets × 12-15 reps"},{name:"Glute Bridge",sets:"3 sets × 15-20 reps"},{name:"Sumo Squats",sets:"3 sets × 12-15 reps"},{name:"Lying Dumbbell Leg Curl",sets:"3 sets × 12-15 reps"},{name:"Crunches (superset w/ Heel Touch)",sets:"3 sets × 10-15 reps"},{name:"Heel Touch (superset w/ Crunches)",sets:"3 sets × 10-15 reps"},{name:"Standing Calf Raises",sets:"4 sets × 15-18 reps"}]},
  { day:"Day 6", label:"Cardio + Yoga + Meditation", icon:"🧘", focus:"Active recovery. Let the body breathe and reset.",
    exercises:[{name:"Full Body Warm-Up",sets:"5 min"},{name:"30min Cycling / Swimming OR 15min HIIT Step-Jog",sets:"40sec work + 20sec rest × 15 rounds"},{name:"Surya Namaskars (AMRAP 10 min)",sets:"As many rounds as possible"},{name:"Full Body Cooldown",sets:"5-10 min"},{name:"10-Min Body Scan Meditation",sets:"Non-negotiable today"}]},
  { day:"Day 7", label:"Active Rest", icon:"🌿", focus:"No structured workout. Walk, stretch, recover. Hit 8,000 steps.",
    exercises:[{name:"8,000 steps (compensate weekly deficit)",sets:"Throughout the day"},{name:"Light stretching if needed",sets:"10-15 min optional"},{name:"Pre-sleep stretch tonight",sets:"Non-negotiable"}]},
];

const WEEKLY_MEALS = [
  { m1:{recipe:"Masala Paneer Scramble",steps:"Spray oil in pan. Crumble 100g low-fat paneer. Add onion, capsicum, tomato. Season with turmeric + black pepper. Add ginger-garlic paste. Cook 4 min. Top with coriander."},m2:{recipe:"Black Coffee + Soaked Walnuts",steps:"Americano or black coffee (50ml fat-free milk + stevia ok). Pair with 5 soaked walnut halves."},m3:{recipe:"Moong Dal + Bran Roti Thali",steps:"Cook 20g moong dal with turmeric, ginger, garlic. Add spinach at end. Make 1 bran roti (40g). Serve with 120g cucumber raita + raw salad. Finish with cinnamon water."},m4:{recipe:"Saffron Yogurt Smoothie Bowl",steps:"Blend 120g greek yogurt + 100g banana + pinch cinnamon + 2-3 saffron strands soaked in 1 tsp warm water. Top with crushed walnuts."},m5:{recipe:"Palak Paneer (Lean)",steps:"Blanch 150g spinach, blend smooth. Spray oil, sauté cumin + onion + garlic + ginger. Add 100g paneer cubed. Pour spinach puree. Add turmeric + black pepper. Serve with 40g bran chapati + cinnamon water."} },
  { m1:{recipe:"Tofu Veggie Stir-Fry",steps:"Press 120g firm tofu, cut cubes. Spray oil wok. Add tofu + broccoli + capsicum + zucchini. Add 1 tsp soy sauce, ginger, garlic. Stir-fry 5-6 min high heat."},m2:{recipe:"Masala Chai + Almonds",steps:"Brew strong tea with ginger + 2 cardamom pods + cinnamon. 50ml fat-free milk + stevia. Pair with 10 almonds."},m3:{recipe:"Soya Millet Bowl",steps:"Soak 30g soya nuggets 15 min, squeeze dry. Cook with onion, tomato, cumin, garam masala. Serve over 40g foxtail millet. Top with coriander + cinnamon water."},m4:{recipe:"Guava Yogurt Parfait",steps:"Layer 120g yogurt with 135g cubed guava + 5 walnut halves. Sprinkle cinnamon."},m5:{recipe:"Masala Oats with Tofu",steps:"Boil 40g oats in water. Add onion, tomato, capsicum, ginger. Pan-fry 120g tofu with turmeric separately. Combine. Season cumin + coriander. Best dinner for lipid profile."} },
  { m1:{recipe:"Protein Shake + Veggie Bowl",steps:"1 scoop protein shake in 250ml water. Alongside: sauté capsicum, broccoli, mushroom with spray oil, garlic, salt, pepper."},m2:{recipe:"Green Tea + Brazil Nuts",steps:"Brew strong green tea. Pair with 3 brazil nuts — selenium supports your thyroid directly."},m3:{recipe:"Tempeh Stir-Fry + Brown Rice",steps:"Slice 120g tempeh thin. Pan-fry with spray oil, soy sauce, ginger, garlic, spring onion. Serve over 40g brown rice + ¼ tsp turmeric."},m4:{recipe:"Pomegranate Curd Bowl",steps:"120g greek yogurt + 110g pomegranate seeds + pinch cinnamon + 3 walnut halves. Strong anti-inflammatory combo."},m5:{recipe:"Aloo Sabzi + Bran Chapati",steps:"150g potato cubed, boil. Spray oil, add cumin, onion, tomato, ginger-garlic, turmeric, coriander. Mix in potato. Serve with 40g bran chapati + veggie soup + cinnamon water."} },
  { m1:{recipe:"Paneer Bhurji",steps:"Spray oil. Add cumin, finely chopped onion, green chilli, ginger, tomato. Add 100g crumbled low-fat paneer. Season with turmeric, black pepper, garam masala. Cook 5 min."},m2:{recipe:"Black Coffee + Cashews",steps:"Black coffee or americano. Pair with 9 cashews — rich in zinc, directly supports testosterone."},m3:{recipe:"Dal Khichdi (Light)",steps:"Cook 20g moong dal + 40g rice with turmeric, ginger, cumin in pressure cooker. Add lots of veggies. Serve with 120g curd."},m4:{recipe:"Mango Smoothie Bowl",steps:"Blend 120g yogurt + 120g mango + pinch cinnamon + 2-3 saffron strands soaked in warm water. Top with 5 walnut halves."},m5:{recipe:"Tofu + Brown Pasta Primavera",steps:"Boil 40g whole wheat pasta. Pan-fry 120g tofu with spray oil + garlic. Add broccoli, zucchini, capsicum. Toss pasta in. Season with herbs + black pepper + turmeric."} },
  { m1:{recipe:"Soya Scramble + Chapati",steps:"Soak 30g soya nuggets, squeeze, chop small. Spray oil, add onion, tomato, green chilli, ginger-garlic. Add soya. Season with turmeric, cumin, pepper. Serve with 40g bran chapati."},m2:{recipe:"Cinnamon Coffee + Walnuts",steps:"Black coffee with a pinch of cinnamon. Pair with 5 soaked walnut halves. Cinnamon improves insulin sensitivity."},m3:{recipe:"Paneer Tikka Salad Bowl",steps:"Marinate 100g paneer in curd, turmeric, chilli, ginger-garlic. Grill or air-fry. Serve over large salad. Dress with ACV + mustard. Serve with 40g millet."},m4:{recipe:"Berry Smoothie",steps:"Blend 150ml fat-free milk + 180g mixed berries + pinch cinnamon + 3 brazil nuts ground in. Best fruit for inflammation markers."},m5:{recipe:"Subway-Style Paneer Wrap",steps:"Whole wheat wrap (40g atta). Grilled paneer 100g + unlimited veggies. Fat-free sauces only: chilli + mustard + BBQ. No cheese."} },
  { m1:{recipe:"Tofu + Oats Upma",steps:"Cook 40g oats as upma with mustard seeds, curry leaves, onion, tomato, green chilli. Pan-fry 120g tofu with spray oil + turmeric. Mix together."},m2:{recipe:"Green Coffee + Almonds",steps:"Green coffee (supports fat metabolism) or regular black coffee. Pair with 10 almonds."},m3:{recipe:"Masoor Dal + Millet Roti",steps:"Cook 20g masoor dal with tomato, onion, garlic, turmeric, garam masala. Add spinach + beetroot at end. Serve with 40g millet roti + 120g curd + cinnamon water."},m4:{recipe:"Watermelon + Yogurt Bowl",steps:"120g greek yogurt + 250g watermelon cubed + pinch cinnamon + 5 walnut halves."},m5:{recipe:"Paneer Veggie Soup + Brown Bread",steps:"Big pot: 100g paneer cubed + all available veggies + 1L water + garlic, ginger, turmeric, pepper. Simmer 20 min. Serve with 2 slices brown bread."} },
  { m1:{recipe:"Sunday Special Tofu Bhurji",steps:"Spray oil. Add cumin, 3 colours of capsicum, tomato, green chilli, ginger-garlic. Add 120g crumbled firm tofu. Season with turmeric, chaat masala, black pepper. Cook 6 min."},m2:{recipe:"Chamomile Tea + Brazil Nuts",steps:"Sunday morning chamomile instead of caffeine — resets cortisol. Pair with 3 brazil nuts. Weekly cortisol reset ritual."},m3:{recipe:"Rajma-Style Soya Bowl",steps:"Cook 30g soya nuggets with rajma-style gravy (onion, tomato, ginger, garlic, all spices). Serve over 40g brown rice."},m4:{recipe:"Sunday Saffron Milk",steps:"150ml warm fat-free milk + 4 saffron strands soaked in warm water + pinch cinnamon + stevia. 5 walnut halves on the side. Weekly serotonin ritual."},m5:{recipe:"Stuffed Capsicum with Paneer + Rice",steps:"Hollow 2 capsicums. Fill with 100g paneer mixed with onion, tomato, spices, herbs. Bake or air-fry 15 min. Serve with 40g rice + veggie soup."} },
];

const HABITS = {
  morning:[
    {id:"c1",text:"Morning hydration drink",note:"600ml water + 5ml ACV + 5ml Aloe Vera + lemon"},
    {id:"c2",text:"20+ min morning sunlight",note:"Before 8am preferred — Vitamin D + circadian rhythm"},
    {id:"c3",text:"Workout done",note:"See today's workout card above"},
    {id:"c4",text:"No-phone breakfast with Shweta",note:"10+ min undistracted — protect this ritual"},
  ],
  day:[
    {id:"c5",text:"6 deep breaths before each meal",note:"Activates rest-and-digest, improves GLP-1"},
    {id:"c6",text:"Chewed food 22+ times per bite",note:"Game changer for gut health and satiety"},
    {id:"c7",text:"10-min walk post meals",note:"Glucose handling + liver load + adds steps"},
    {id:"c8",text:"600g vegetables consumed",note:"Unlimited — add to every meal"},
    {id:"c9",text:"Last coffee before 4:00 PM",note:"After 4pm it disrupts deep sleep quality"},
    {id:"c10",text:"No alcohol today",note:"Non-negotiable for first 4-6 weeks — liver enzymes"},
  ],
  evening:[
    {id:"c11",text:"Last meal 2 hours before bed",note:"Better digestion and deeper sleep"},
    {id:"c12",text:"Pre-sleep stretch (10 min)",note:"Parasympathetic nervous system activation"},
    {id:"c13",text:"10-min body scan meditation",note:"Critical — cortisol directly affects TSH + testosterone"},
    {id:"c14",text:"Night mode on / blue light off",note:"Enables melatonin release"},
    {id:"c15",text:"Chamomile tea pre-sleep",note:"Part of your plan — sleep quality and recovery"},
  ],
};

const SUPPS = [
  {id:"s1",name:"Vitamin D3",dose:"10,000 IU daily (first 30 days)\nor 60,000 IU once weekly",timing:"Meal 1",note:"Critical — low Vitamin D is your top priority marker"},
  {id:"s2",name:"Multivitamin",dose:"1 serving",timing:"Meal 1",note:"NOW Adam / Healthy Hey / Life Extension"},
  {id:"s3",name:"Vitamin C",dose:"1000mg",timing:"Meal 1",note:"Anti-inflammatory + detox + skin"},
  {id:"s4",name:"Vegan DHA / Omega",dose:"1 serving",timing:"Meal 5",note:"Anti-inflammatory + testosterone — WOW / GNC"},
  {id:"s5",name:"Magnesium Glycinate",dose:"1 serving",timing:"Meal 5",note:"Sleep + stress + GABA — Carbamide Forte"},
  {id:"s6",name:"Zinc Methionine",dose:"30mg",timing:"Meal 5",note:"Dopamine + mood + hormones"},
];

const MEAL_LABELS = [
  {num:1,title:"Post-cardio protein meal",sub:"First meal — protein focus"},
  {num:2,title:"Mid-morning snack",sub:"Coffee + healthy fats"},
  {num:3,title:"Lunch — main carb + protein",sub:"Biggest carb meal of the day"},
  {num:4,title:"Afternoon recovery bowl",sub:"Fats + dairy + fruit + saffron"},
  {num:5,title:"Dinner — protein + carb",sub:"Last meal — 2 hrs before bed"},
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function fmtDate(str) {
  if (!str) return '';
  const [,m,d] = str.split('-');
  return `${parseInt(d)} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(m)-1]}`;
}
function fmtDateFull(str) {
  if (!str) return '';
  const [y,m,d] = str.split('-');
  const dt = new Date(parseInt(y), parseInt(m)-1, parseInt(d));
  return `${'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(' ')[dt.getDay()]}, ${parseInt(d)} ${'January February March April May June July August September October November December'.split(' ')[parseInt(m)-1]} ${y}`;
}
function getDayIdx(startStr) {
  const diff = Math.floor((new Date(todayKey()) - new Date(startStr)) / 86400000);
  return diff % 7;
}
function getWeekDayIdx() {
  const dow = new Date().getDay();
  return dow === 0 ? 6 : dow - 1;
}
function calcScore(d) {
  if (!d) return 0;
  const checks = Object.values(d.checks||{}).filter(Boolean).length;
  const water = Math.min(1,(d.water||0)*250/3500);
  const steps = Math.min(1,(d.steps||0)/8000);
  const meals = Object.values(d.meals||{}).filter(Boolean).length;
  const supps = Object.values(d.supps||{}).filter(Boolean).length;
  return Math.round(checks/15*50 + water*15 + steps*15 + meals/5*10 + supps/6*10);
}


// ─── RESPONSIVE HOOK ─────────────────────────────────────────────────────────
function useIsMobile() {
  const [mob, setMob] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMob(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return mob;
}
// ─── COLOURS ─────────────────────────────────────────────────────────────────
const C = {
  green:'#1D9E75', greenL:'#E1F5EE', greenD:'#085041', greenM:'#9FE1CB',
  amber:'#BA7517', amberL:'#FAEEDA', red:'#A32D2D', redL:'#FCEBEB',
  purple:'#534AB7', purpleL:'#EEEDFE', blue:'#185FA5', blueL:'#E6F1FB',
  grayL:'#F1EFE8', border:'rgba(0,0,0,0.08)', borderS:'rgba(0,0,0,0.14)',
  bg:'#FAFAF8', surface:'#FFFFFF', text:'#1a1a18', text2:'#5F5E5A', text3:'#888780',
};

// ─── STYLE HELPERS ────────────────────────────────────────────────────────────
const card = { background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:'16px 18px' };
const statGrid = { display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10, marginBottom:16 };
const numBtn = { width:44, height:44, borderRadius:10, border:`1px solid ${C.borderS}`, background:C.grayL, cursor:'pointer', fontSize:22, display:'flex', alignItems:'center', justifyContent:'center', color:C.text, fontFamily:'inherit' };
const btnPrimary = { background:C.green, color:'white', border:'none', borderRadius:10, padding:'10px 20px', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit' };
const btnSecondary = { background:'none', border:`1px solid ${C.borderS}`, borderRadius:10, padding:'9px 16px', fontSize:13, color:C.text2, cursor:'pointer', fontFamily:'inherit' };
const formInput = { border:`1px solid ${C.borderS}`, borderRadius:10, padding:'12px 13px', fontSize:16, fontFamily:'inherit', background:C.surface, color:C.text, outline:'none', width:'100%', boxSizing:'border-box' };
const navItem = (active) => ({ display:'flex', alignItems:'center', gap:10, padding:'10px 20px', cursor:'pointer', fontSize:13, color:active?C.greenD:C.text2, borderLeft:active?`2px solid ${C.green}`:'2px solid transparent', background:active?C.greenL:'none', fontWeight:active?500:400 });
const tab = (active) => ({ fontSize:13, padding:'7px 16px', borderRadius:7, cursor:'pointer', color:active?C.text:C.text2, border:'none', background:active?C.surface:'none', fontWeight:active?500:400, fontFamily:'inherit', boxShadow:active?'0 1px 3px rgba(0,0,0,0.08)':'none' });

// ─── MINI COMPONENTS ─────────────────────────────────────────────────────────
function ProgBar({ pct, color }) {
  return <div style={{ background:C.grayL, borderRadius:6, height:7, overflow:'hidden', marginTop:8 }}><div style={{ height:'100%', borderRadius:6, background:color||C.green, width:`${Math.min(100,Math.round(pct||0))}%`, transition:'width 0.3s' }}/></div>;
}
function SecLabel({ color, children }) {
  return <div style={{ fontSize:11, textTransform:'uppercase', letterSpacing:'0.07em', color:C.text3, fontWeight:500, marginBottom:10, display:'flex', alignItems:'center', gap:6 }}><span style={{ width:6, height:6, borderRadius:'50%', background:color||C.green, display:'inline-block' }}/>{children}</div>;
}
function StatCard({ label, value, unit, pct, sub }) {
  return <div style={card}><div style={{ fontSize:11, color:C.text3, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 }}>{label}</div><div style={{ fontSize:26, fontWeight:700, fontFamily:"'DM Mono',monospace" }}>{value}<span style={{ fontSize:13, fontWeight:400, color:C.text3, marginLeft:2 }}>{unit}</span></div>{pct!==undefined&&<ProgBar pct={pct}/>}{sub&&<div style={{ fontSize:11, color:C.text3, marginTop:4 }}>{sub}</div>}</div>;
}
function ScoreRing({ score }) {
  const offset = 201 - 201*score/100;
  const msgs = [[0,"Let's get started","Check off habits, log meals, track your numbers."],[30,"Good momentum","Every habit you check compounds into results."],[60,"Strong day","On track — don't let the evening slip."],[85,"Almost perfect","Make this your new baseline."],[99,"Perfect day ✓","This is what transformation looks like."]];
  let m = msgs[0]; for (const t of msgs) if (score>=t[0]) m=t;
  return <div style={{ display:'flex', alignItems:'center', gap:20, padding:16, ...card, marginBottom:20 }}>
    <div style={{ position:'relative', width:80, height:80, flexShrink:0 }}>
      <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform:'rotate(-90deg)' }}>
        <circle cx="40" cy="40" r="32" fill="none" stroke={C.greenL} strokeWidth="8"/>
        <circle cx="40" cy="40" r="32" fill="none" stroke={C.green} strokeWidth="8" strokeDasharray="201" strokeDashoffset={offset} strokeLinecap="round" style={{ transition:'stroke-dashoffset 0.4s' }}/>
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, fontWeight:700, fontFamily:"'DM Mono',monospace", color:C.greenD }}>{score}%</div>
    </div>
    <div><div style={{ fontSize:15, fontWeight:600, marginBottom:4 }}>{m[1]}</div><div style={{ fontSize:12, color:C.text3, lineHeight:1.6 }}>{m[2]}</div></div>
  </div>;
}
function WorkoutCard({ dayIdx }) {
  const w = WORKOUTS[dayIdx];
  const [open, setOpen] = useState(false);
  return <div style={{ ...card, marginBottom:20, borderLeft:`3px solid ${C.green}` }}>
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer' }} onClick={()=>setOpen(o=>!o)}>
      <div><div style={{ display:'flex', alignItems:'center', gap:8 }}><span>{w.icon}</span><span style={{ fontSize:11, background:C.greenL, color:C.greenD, borderRadius:20, padding:'2px 9px', fontWeight:500 }}>{w.day}</span><span style={{ fontSize:15, fontWeight:600 }}>{w.label}</span></div><div style={{ fontSize:12, color:C.text3, marginTop:4, marginLeft:26 }}>{w.focus}</div></div>
      <span style={{ fontSize:13, color:C.text3 }}>{open?'▲':'▼'}</span>
    </div>
    {open && <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${C.border}` }}>
      {w.exercises.map((ex,i)=><div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:i<w.exercises.length-1?`1px solid ${C.border}`:'none' }}><span style={{ fontSize:13 }}>{ex.name}</span><span style={{ fontSize:12, color:C.green, fontWeight:500 }}>{ex.sets}</span></div>)}
      <div style={{ marginTop:10, fontSize:12, color:C.text3, background:C.grayL, borderRadius:8, padding:'8px 12px' }}>Warm up first · Form before weight · Rest 60-90 sec between sets · Log in Strong app</div>
    </div>}
  </div>;
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null); // {type:'error'|'success', text}

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setMsg(null);
    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMsg({ type:'error', text:error.message });
      else setMsg({ type:'success', text:'Account created! Check your email to confirm, then log in.' });
    } else if (mode === 'login') {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg({ type:'error', text:error.message });
      else onLogin(data.user);
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) setMsg({ type:'error', text:error.message });
      else setMsg({ type:'success', text:'Password reset email sent. Check your inbox.' });
    }
    setLoading(false);
  }

  return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:C.bg, fontFamily:"'DM Sans',system-ui,sans-serif" }}>
    <div style={{ width:'100%', maxWidth:400, padding:24 }}>
      <div style={{ textAlign:'center', marginBottom:32 }}>
        <div style={{ fontSize:28, fontWeight:700, color:C.green }}>Shubham's Tracker</div>
        <div style={{ fontSize:13, color:C.text3, marginTop:6 }}>Phase I — Health Priming & Fatloss</div>
      </div>
      <div style={{ ...card, padding:'28px 28px' }}>
        <div style={{ fontSize:17, fontWeight:600, marginBottom:20 }}>{mode==='signup'?'Create account':mode==='forgot'?'Reset password':'Welcome back'}</div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:12, color:C.text2, fontWeight:500, marginBottom:5 }}>Email</div>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@example.com" style={formInput}/>
          </div>
          {mode!=='forgot' && <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:12, color:C.text2, fontWeight:500, marginBottom:5 }}>Password</div>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="minimum 6 characters" style={formInput}/>
          </div>}
          {msg && <div style={{ marginBottom:14, padding:'10px 13px', borderRadius:8, background:msg.type==='error'?C.redL:C.greenL, color:msg.type==='error'?C.red:C.greenD, fontSize:13, lineHeight:1.5 }}>{msg.text}</div>}
          <button type="submit" style={{ ...btnPrimary, width:'100%' }} disabled={loading}>{loading?'Please wait...':(mode==='signup'?'Create account':mode==='forgot'?'Send reset email':'Log in')}</button>
        </form>
        <div style={{ marginTop:18, display:'flex', flexDirection:'column', gap:8, alignItems:'center' }}>
          {mode==='login' && <><button style={{ ...btnSecondary, border:'none', fontSize:13, color:C.blue, cursor:'pointer', background:'none' }} onClick={()=>{setMode('signup');setMsg(null);}}>Don't have an account? Sign up</button><button style={{ ...btnSecondary, border:'none', fontSize:12, color:C.text3, cursor:'pointer', background:'none' }} onClick={()=>{setMode('forgot');setMsg(null);}}>Forgot password?</button></>}
          {mode!=='login' && <button style={{ ...btnSecondary, border:'none', fontSize:13, color:C.blue, cursor:'pointer', background:'none' }} onClick={()=>{setMode('login');setMsg(null);}}>Back to login</button>}
        </div>
      </div>
    </div>
  </div>;
}

// ─── CHART COMPONENT ──────────────────────────────────────────────────────────
function LineChart({ data, label, color, yFormatter, minPad=2 }) {
  const ref = useRef(null); const chart = useRef(null);
  useEffect(()=>{
    if(!data?.length||!ref.current) return;
    if(chart.current){chart.current.destroy();chart.current=null;}
    chart.current = new Chart(ref.current,{type:'line',data:{labels:data.map(d=>fmtDate(d.date)),datasets:[{data:data.map(d=>d.value),borderColor:color||C.green,backgroundColor:`${color||C.green}15`,pointBackgroundColor:color||C.green,pointRadius:4,tension:0.3,fill:true}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{min:Math.min(...data.map(d=>d.value))-minPad,max:Math.max(...data.map(d=>d.value))+minPad,grid:{color:'rgba(0,0,0,0.04)'},ticks:{font:{size:11},callback:yFormatter}},x:{grid:{display:false},ticks:{font:{size:11},maxTicksLimit:8}}}}});
    return()=>{if(chart.current){chart.current.destroy();chart.current=null;}};
  },[data,color]);
  return <div style={{ height:200 }}><canvas ref={ref} role="img" aria-label={label}/></div>;
}
function BarChart({ data, label }) {
  const ref = useRef(null); const chart = useRef(null);
  useEffect(()=>{
    if(!data?.length||!ref.current) return;
    if(chart.current){chart.current.destroy();chart.current=null;}
    chart.current = new Chart(ref.current,{type:'bar',data:{labels:data.map(d=>fmtDate(d.date)),datasets:[{data:data.map(d=>d.score),backgroundColor:data.map(d=>d.score>=80?'rgba(29,158,117,0.75)':d.score>=50?'rgba(186,117,23,0.7)':'rgba(163,45,45,0.6)'),borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{min:0,max:100,grid:{color:'rgba(0,0,0,0.04)'},ticks:{font:{size:11},callback:v=>v+'%'}},x:{grid:{display:false},ticks:{font:{size:11},maxTicksLimit:14}}}}});
    return()=>{if(chart.current){chart.current.destroy();chart.current=null;}};
  },[data]);
  return <div style={{ height:200 }}><canvas ref={ref} role="img" aria-label={label}/></div>;
}
function DonutChart({ segments }) {
  const ref = useRef(null); const chart = useRef(null);
  useEffect(()=>{
    if(!ref.current) return;
    if(chart.current){chart.current.destroy();chart.current=null;}
    chart.current = new Chart(ref.current,{type:'doughnut',data:{labels:segments.map(s=>s.label),datasets:[{data:segments.map(s=>s.value),backgroundColor:segments.map(s=>s.color),borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:11},boxWidth:12,padding:12}}}}});
    return()=>{if(chart.current){chart.current.destroy();chart.current=null;}};
  },[segments]);
  return <div style={{ height:200 }}><canvas ref={ref} role="img" aria-label="Habit breakdown donut"/></div>;
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

// ─── DASHBOARD PAGE (isolated so errors don't blank the whole app) ────────────
function Dashboard({ savedDays, weightLog, latestW, wLost }) {
  try {
    const avgScore = savedDays.length ? Math.round(savedDays.reduce((a,d)=>a+(d.score||0),0)/savedDays.length) : null;
    const bestScore = savedDays.length ? Math.max(...savedDays.map(d=>d.score||0)) : null;
    const wPct = latestW && wLost > 0 ? ((START_WEIGHT-latestW)/START_WEIGHT*100).toFixed(1) : null;

    const habitAvg = (ids) => {
      if (!savedDays.length) return 0;
      return Math.round(savedDays.reduce((a,d) => {
        const checks = d.checks || {};
        return a + ids.filter(id=>checks[id]).length / ids.length;
      }, 0) / savedDays.length * 100);
    };

    const donutSegments = [
      { label:'Morning', value: habitAvg(['c1','c2','c3','c4']), color: C.green },
      { label:'Daytime', value: habitAvg(['c5','c6','c7','c8','c9','c10']), color: C.amber },
      { label:'Evening', value: habitAvg(['c11','c12','c13','c14','c15']), color: C.purple },
    ];

    return <div>
      <div style={{ fontSize:22, fontWeight:700, marginBottom:4 }}>Progress Dashboard</div>
      <div style={{ fontSize:13, color:C.text3, marginBottom:20 }}>Your transformation — day by day</div>
      <div style={statGrid}>
        <StatCard label="Days logged" value={savedDays.length} sub="consistency is everything"/>
        <StatCard label="Avg daily score" value={avgScore!==null?avgScore+'%':'—'} sub={avgScore!==null?(avgScore>=70?'On track':'Needs consistency'):'—'}/>
        <StatCard label="Best score" value={bestScore!==null?bestScore+'%':'—'} sub="personal best"/>
        <StatCard label="Weight lost" value={wLost>0?wLost:'—'} unit={wLost>0?'kg':''} sub={wPct?`${wPct}% of start weight`:'keep logging'}/>
      </div>
      <div style={{ ...card, marginBottom:16 }}>
        <div style={{ fontSize:14, fontWeight:500, marginBottom:2 }}>Daily habit score</div>
        <div style={{ fontSize:12, color:C.text3, marginBottom:12 }}>Green ≥80% · Amber ≥50% · Red below 50%</div>
        {savedDays.length
          ? <BarChart data={savedDays} label="Daily scores"/>
          : <div style={{ textAlign:'center', padding:40, color:C.text3, fontSize:13 }}>Save your first day to see scores here.</div>}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:12, marginBottom:12 }}>
        <div style={card}>
          <div style={{ fontSize:14, fontWeight:500, marginBottom:2 }}>Weight trend</div>
          <div style={{ fontSize:12, color:C.text3, marginBottom:12 }}>Progress toward goal</div>
          {weightLog.length>1
            ? <LineChart data={weightLog.map(e=>({date:e.date,value:Number(e.weight)}))} label="Weight" yFormatter={v=>v+'kg'} minPad={2}/>
            : <div style={{ textAlign:'center', padding:40, color:C.text3, fontSize:13 }}>Log 2+ weights to see trend.</div>}
        </div>
        <div style={card}>
          <div style={{ fontSize:14, fontWeight:500, marginBottom:2 }}>Habit breakdown</div>
          <div style={{ fontSize:12, color:C.text3, marginBottom:12 }}>Avg completion by time of day</div>
          {savedDays.length
            ? <DonutChart segments={donutSegments}/>
            : <div style={{ textAlign:'center', padding:40, color:C.text3, fontSize:13 }}>Save a few days to see breakdown.</div>}
        </div>
      </div>
      <div style={card}>
        <div style={{ fontSize:14, fontWeight:500, marginBottom:12 }}>Daily log history</div>
        {!savedDays.length
          ? <div style={{ textAlign:'center', padding:40, color:C.text3, fontSize:13 }}>No days saved yet.</div>
          : <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
                <thead>
                  <tr>{['Date','Score','Water','Steps','Habits','Meals','Notes'].map(h=>(
                    <th key={h} style={{ textAlign:'left', fontSize:11, textTransform:'uppercase', letterSpacing:'0.05em', color:C.text3, fontWeight:500, padding:'7px 10px', borderBottom:`1px solid ${C.border}` }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>{[...savedDays].reverse().map(d=>{
                  const sc = d.score||0;
                  const bg = sc>=80?C.greenL:sc>=50?C.amberL:C.redL;
                  const fc = sc>=80?C.greenD:sc>=50?C.amber:C.red;
                  return <tr key={d.date}>
                    <td style={{ padding:'9px 10px' }}>{fmtDate(d.date)}</td>
                    <td style={{ padding:'9px 10px' }}><span style={{ fontSize:11, fontWeight:600, padding:'2px 9px', borderRadius:20, background:bg, color:fc, fontFamily:"'DM Mono',monospace" }}>{sc}%</span></td>
                    <td style={{ padding:'9px 10px', fontFamily:"'DM Mono',monospace" }}>{((d.water||0)*0.25).toFixed(1)}L</td>
                    <td style={{ padding:'9px 10px', fontFamily:"'DM Mono',monospace" }}>{((d.steps||0)/1000).toFixed(1)}k</td>
                    <td style={{ padding:'9px 10px' }}>{d.habits||0}/15</td>
                    <td style={{ padding:'9px 10px' }}>{d.meals||0}/5</td>
                    <td style={{ padding:'9px 10px', color:C.text3, maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.notes||'—'}</td>
                  </tr>;
                })}</tbody>
              </table>
            </div>}
      </div>
    </div>;
  } catch(err) {
    return <div style={{ padding:40, textAlign:'center', color:C.text3, fontSize:13 }}>
      Dashboard error: {err.message}. Try saving today's log first, then reload.
    </div>;
  }
}

export default function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [page, setPage] = useState('today');
  const [startDate, setStartDate] = useState(null);
  const [todayData, setTodayData] = useState({ checks:{}, water:0, steps:0, meals:{}, supps:{}, notes:'' });
  const [weightLog, setWeightLog] = useState([]);
  const [savedDays, setSavedDays] = useState([]);
  const [habitTab, setHabitTab] = useState('morning');
  const [expandedMeal, setExpandedMeal] = useState(null);
  const isMobile = useIsMobile();
  const [wInput, setWInput] = useState('');
  const [wNote, setWNote] = useState('');
  const [wDate, setWDate] = useState(todayKey());
  const [saveState, setSaveState] = useState('idle'); // idle | saving | saved
  const [dbLoading, setDbLoading] = useState(false);

  // ── AUTH ──
  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{ setSession(session); setAuthLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_,session)=>setSession(session));
    return ()=>subscription.unsubscribe();
  },[]);

  // ── LOAD DATA WHEN LOGGED IN ──
  useEffect(()=>{
    if (!session) return;
    loadAllData();
  },[session]);

  async function loadAllData() {
    setDbLoading(true);
    const uid = session.user.id;

    // load or create user profile (start date)
    const { data: profile } = await supabase.from('profiles').select('start_date').eq('id', uid).single();
    let sd = profile?.start_date;
    if (!sd) {
      sd = todayKey();
      await supabase.from('profiles').upsert({ id: uid, start_date: sd });
    }
    setStartDate(sd);

    // load today's log
    const today = todayKey();
    const { data: todayRow } = await supabase.from('day_logs').select('*').eq('user_id', uid).eq('date', today).single();
    if (todayRow) {
      setTodayData({ checks:todayRow.checks||{}, water:todayRow.water||0, steps:todayRow.steps||0, meals:todayRow.meals||{}, supps:todayRow.supps||{}, notes:todayRow.notes||'' });
    }

    // load all day logs for dashboard
    const { data: allLogs } = await supabase.from('day_logs').select('*').eq('user_id', uid).order('date', { ascending: true });
    setSavedDays((allLogs||[]).map(r=>({ date:r.date, score:r.score||0, water:r.water||0, steps:r.steps||0, habits:Object.values(r.checks||{}).filter(Boolean).length, meals:Object.values(r.meals||{}).filter(Boolean).length, notes:r.notes||'', checks:r.checks||{} })));

    // load weight log
    const { data: weights } = await supabase.from('weight_log').select('*').eq('user_id', uid).order('date', { ascending: true });
    setWeightLog(weights||[]);

    setDbLoading(false);
  }

  // ── PERSIST TODAY LIVE (debounced) ──
  const persistTimer = useRef(null);
  function persistToday(data) {
    clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(async ()=>{
      if (!session) return;
      const score = calcScore(data);
      await supabase.from('day_logs').upsert({
        user_id: session.user.id, date: todayKey(),
        checks:data.checks, water:data.water, steps:data.steps,
        meals:data.meals, supps:data.supps, notes:data.notes, score,
      }, { onConflict: 'user_id,date' });
    }, 800);
  }

  function updateToday(patch) {
    const next = { ...todayData, ...patch };
    setTodayData(next);
    persistToday(next);
  }

  function toggleCheck(id) { updateToday({ checks:{ ...todayData.checks, [id]:!todayData.checks[id] } }); }
  function adjNum(type, delta) {
    if (type==='water') updateToday({ water:Math.max(0,Math.min(14,(todayData.water||0)+delta)) });
    else updateToday({ steps:Math.max(0,Math.min(20000,(todayData.steps||0)+delta)) });
  }
  function toggleMealLog(n) { updateToday({ meals:{ ...todayData.meals, [n]:!todayData.meals[n] } }); }
  function toggleSupp(id) { updateToday({ supps:{ ...todayData.supps, [id]:!todayData.supps[id] } }); }

  async function saveDay() {
    setSaveState('saving');
    const score = calcScore(todayData);
    await supabase.from('day_logs').upsert({
      user_id:session.user.id, date:todayKey(),
      checks:todayData.checks, water:todayData.water, steps:todayData.steps,
      meals:todayData.meals, supps:todayData.supps, notes:todayData.notes, score,
    }, { onConflict:'user_id,date' });
    // refresh saved days
    const { data: allLogs } = await supabase.from('day_logs').select('*').eq('user_id',session.user.id).order('date',{ascending:true});
    setSavedDays((allLogs||[]).map(r=>({ date:r.date, score:r.score||0, water:r.water||0, steps:r.steps||0, habits:Object.values(r.checks||{}).filter(Boolean).length, meals:Object.values(r.meals||{}).filter(Boolean).length, notes:r.notes||'', checks:r.checks||{} })));
    setSaveState('saved');
    setTimeout(()=>setSaveState('idle'),2500);
  }

  async function addWeight() {
    const val = parseFloat(wInput);
    if (!wDate || isNaN(val) || !session) return;
    await supabase.from('weight_log').upsert({ user_id:session.user.id, date:wDate, weight:val, note:wNote }, { onConflict:'user_id,date' });
    const { data } = await supabase.from('weight_log').select('*').eq('user_id',session.user.id).order('date',{ascending:true});
    setWeightLog(data||[]);
    setWInput(''); setWNote('');
  }

  async function delWeight(date) {
    await supabase.from('weight_log').delete().eq('user_id',session.user.id).eq('date',date);
    setWeightLog(prev=>prev.filter(e=>e.date!==date));
  }

  async function logout() {
    await supabase.auth.signOut();
    setSession(null); setSavedDays([]); setWeightLog([]); setTodayData({ checks:{}, water:0, steps:0, meals:{}, supps:{}, notes:'' });
  }

  // ── RENDER ──
  if (authLoading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', color:C.text3, fontSize:14, fontFamily:'system-ui' }}>Loading...</div>;
  if (!session) return <LoginScreen onLogin={()=>loadAllData()}/>;

  const score = calcScore(todayData);
  const dayIdx = startDate ? getDayIdx(startDate) : 0;
  const weekIdx = getWeekDayIdx();
  const recipes = WEEKLY_MEALS[weekIdx];
  const latestW = weightLog.length ? weightLog[weightLog.length-1].weight : null;
  const wLost = latestW ? (START_WEIGHT - latestW).toFixed(1) : null;

  return <div style={{ display:'flex', minHeight:'100vh', fontFamily:"'DM Sans',system-ui,sans-serif", background:C.bg, color:C.text }}>

    {/* DESKTOP SIDEBAR */}
    {!isMobile && <nav style={{ width:220, minHeight:'100vh', background:C.surface, borderRight:`1px solid ${C.border}`, padding:'24px 0', position:'fixed', top:0, left:0, display:'flex', flexDirection:'column', zIndex:100 }}>
      <div style={{ padding:'0 20px 20px', borderBottom:`1px solid ${C.border}`, marginBottom:16 }}>
        <div style={{ fontSize:15, fontWeight:600 }}>Shubham Jitani</div>
        <div style={{ fontSize:11, background:C.greenL, color:C.greenD, borderRadius:20, padding:'2px 9px', display:'inline-block', marginTop:4, fontWeight:500 }}>Phase I · Fatloss</div>
      </div>
      {[['today','◉','Today'],['meals','◈','Meals & Recipes'],['supplements','◇','Supplements'],['weight','▲','Weight Log'],['dashboard','▦','Dashboard'],['health','◎','Health Focus']].map(([id,icon,label])=>(
        <div key={id} style={navItem(page===id)} onClick={()=>setPage(id)}><span style={{ width:18, textAlign:'center' }}>{icon}</span>{label}</div>
      ))}
      <div style={{ marginTop:'auto', padding:'16px 20px', borderTop:`1px solid ${C.border}` }}>
        <div style={{ fontSize:11, color:C.text3, lineHeight:1.9 }}>
          Start: <strong style={{ color:C.text, fontFamily:"'DM Mono',monospace" }}>111 kg</strong><br/>
          Now: <strong style={{ color:C.green, fontFamily:"'DM Mono',monospace" }}>{latestW?`${latestW} kg`:'—'}</strong><br/>
          Lost: <strong style={{ color:C.green, fontFamily:"'DM Mono',monospace" }}>{wLost>0?`${wLost} kg`:'—'}</strong>
        </div>
        <button onClick={logout} style={{ ...btnSecondary, marginTop:10, width:'100%', fontSize:12 }}>Log out</button>
      </div>
    </nav>}

    {/* MOBILE TOP BAR */}
    {isMobile && <div style={{ position:'fixed', top:0, left:0, right:0, height:52, background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'0 16px', display:'flex', alignItems:'center', justifyContent:'space-between', zIndex:100 }}>
      <div>
        <div style={{ fontSize:14, fontWeight:600 }}>Shubham's Tracker</div>
        <div style={{ fontSize:10, color:C.green, fontWeight:500 }}>Phase I · {WORKOUTS[dayIdx].day}: {WORKOUTS[dayIdx].label}</div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:10, color:C.text3 }}>Lost</div>
          <div style={{ fontSize:14, fontWeight:700, fontFamily:"'DM Mono',monospace", color:C.green }}>{wLost>0?`${wLost}kg`:'—'}</div>
        </div>
        <button onClick={logout} style={{ background:'none', border:`1px solid ${C.border}`, borderRadius:8, padding:'5px 10px', fontSize:11, color:C.text3, cursor:'pointer', fontFamily:'inherit' }}>Out</button>
      </div>
    </div>}

    {/* MOBILE BOTTOM TAB BAR */}
    {isMobile && <nav style={{ position:'fixed', bottom:0, left:0, right:0, background:C.surface, borderTop:`1px solid ${C.border}`, display:'grid', gridTemplateColumns:'repeat(6,1fr)', zIndex:100, paddingBottom:'env(safe-area-inset-bottom,0px)' }}>
      {[['today','◉','Today'],['meals','◈','Meals'],['supplements','◇','Supps'],['weight','▲','Weight'],['dashboard','▦','Stats'],['health','◎','Health']].map(([id,icon,label])=>(
        <button key={id} onClick={()=>setPage(id)} style={{ padding:'8px 0 6px', border:'none', background:'none', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:1, fontFamily:'inherit' }}>
          <span style={{ fontSize:15 }}>{icon}</span>
          <span style={{ fontSize:9, fontWeight:page===id?600:400, color:page===id?C.green:C.text3 }}>{label}</span>
          {page===id && <span style={{ width:14, height:2, background:C.green, borderRadius:1, marginTop:1 }}/>}
        </button>
      ))}
    </nav>}

    <main style={{
      marginLeft: isMobile ? 0 : 220,
      flex: 1,
      padding: isMobile ? '60px 14px 76px' : '28px 32px',
      maxWidth: isMobile ? '100%' : 'calc(100vw - 220px)',
      overflowX: 'hidden',
      boxSizing: 'border-box',
    }}>
      {dbLoading && <div style={{ textAlign:'center', padding:40, color:C.text3 }}>Loading your data...</div>}

      {/* ── TODAY ── */}
      {!dbLoading && page==='today' && <div>
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:20, fontWeight:700 }}>Today</div>
          <div style={{ fontSize:12, color:C.text3, marginTop:2 }}>{fmtDateFull(todayKey())}</div>
        </div>
        <ScoreRing score={score}/>
        <div style={statGrid}>
          <StatCard label="Water" value={(todayData.water*0.25).toFixed(2).replace(/\.?0+$/,'')} unit="L" pct={todayData.water*250/3500*100}/>
          <StatCard label="Steps" value={(todayData.steps/1000).toFixed(1)} unit="k" pct={todayData.steps/8000*100}/>
          <StatCard label="Habits" value={Object.values(todayData.checks).filter(Boolean).length} unit="/15" pct={Object.values(todayData.checks).filter(Boolean).length/15*100}/>
          <StatCard label="Meals" value={Object.values(todayData.meals).filter(Boolean).length} unit="/5" pct={Object.values(todayData.meals).filter(Boolean).length/5*100}/>
        </div>
        <SecLabel color={C.green}>Today's Workout</SecLabel>
        <WorkoutCard dayIdx={dayIdx}/>
        <SecLabel color={C.amber}>Daily Habits</SecLabel>
        <div style={{ display:'flex', gap:4, background:C.grayL, borderRadius:10, padding:4, marginBottom:16, width:'fit-content' }}>
          {[['morning','Morning'],['day','During Day'],['evening','Evening']].map(([id,label])=>(
            <button key={id} style={tab(habitTab===id)} onClick={()=>setHabitTab(id)}>{label}</button>
          ))}
        </div>
        {HABITS[habitTab].map(h=>{
          const done=!!todayData.checks[h.id];
          return <div key={h.id} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'11px 14px', border:`1px solid ${done?C.greenM:C.border}`, borderRadius:10, marginBottom:6, cursor:'pointer', background:done?C.greenL:C.surface, userSelect:'none', transition:'all 0.12s' }} onClick={()=>toggleCheck(h.id)}>
            <div style={{ width:20, height:20, borderRadius:5, border:`1.5px solid ${done?C.green:C.borderS}`, background:done?C.green:'none', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1, fontSize:11, color:'white' }}>{done?'✓':''}</div>
            <div><div style={{ fontSize:13, color:done?C.greenD:C.text }}>{h.text}</div><div style={{ fontSize:11, color:done?C.green:C.text3, marginTop:2 }}>{h.note}</div></div>
          </div>;
        })}
        <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:10, marginTop:16 }}>
          {[['water','Water intake','Target: 3.5L',`${todayData.water} glasses of 250ml`,-1,1],['steps','Steps today','Target: 8,000',`${todayData.steps.toLocaleString()} steps (±500)`,-500,500]].map(([type,title,target,sub,dec,inc])=>(
            <div key={type} style={{ ...card }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}><span style={{ fontSize:13, color:C.text2 }}>{title}</span><span style={{ fontSize:11, background:C.grayL, color:C.text3, borderRadius:20, padding:'2px 9px' }}>{target}</span></div>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <button style={numBtn} onClick={()=>adjNum(type,dec)}>−</button>
                <div style={{ fontSize:24, fontWeight:700, fontFamily:"'DM Mono',monospace", minWidth:60, textAlign:'center' }}>{type==='water'?todayData.water:todayData.steps.toLocaleString()}</div>
                <button style={numBtn} onClick={()=>adjNum(type,inc)}>+</button>
              </div>
              <div style={{ fontSize:11, color:C.text3, marginTop:6 }}>{sub}</div>
              <ProgBar pct={type==='water'?todayData.water*250/3500*100:todayData.steps/80}/>
            </div>
          ))}
        </div>
        <div style={{ marginTop:20 }}>
          <SecLabel color={C.blue}>Today's Notes</SecLabel>
          <textarea value={todayData.notes} onChange={e=>updateToday({notes:e.target.value})} placeholder="Energy levels, hunger, workout notes, how you feel..." style={{ ...formInput, minHeight:80, resize:'vertical', lineHeight:1.6, fontSize:13 }}/>
          <button style={{ ...btnPrimary, marginTop:10 }} onClick={saveDay}>{saveState==='saving'?'Saving...':saveState==='saved'?'✓ Saved to cloud!':'Save today\'s log'}</button>
        </div>
      </div>}

      {/* ── MEALS ── */}
      {!dbLoading && page==='meals' && <div>
        <div style={{ fontSize:22, fontWeight:700, marginBottom:4 }}>Meals & Recipes</div>
        <div style={{ fontSize:13, color:C.text3, marginBottom:16 }}>Rotating weekly menu · Today: {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][weekIdx]}'s plan</div>
        <div style={{ background:C.greenL, border:`1px solid ${C.greenM}`, borderRadius:10, padding:'12px 15px', fontSize:13, color:C.greenD, marginBottom:20, lineHeight:1.6 }}><strong>On waking:</strong> 600ml water + 5ml ACV + 5ml Aloe Vera + 1 lemon slice. Anti-inflammatory morning drink — before anything else.</div>
        {MEAL_LABELS.map(({num,title,sub})=>{
          const logged=!!todayData.meals[num]; const open=expandedMeal===num;
          return <div key={num} style={{ border:`1px solid ${C.border}`, borderRadius:14, marginBottom:10, background:C.surface, overflow:'hidden' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 16px', cursor:'pointer' }} onClick={()=>setExpandedMeal(open?null:num)}>
              <div style={{ width:26, height:26, borderRadius:'50%', background:C.grayL, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:600, color:C.text3, flexShrink:0 }}>{num}</div>
              <div style={{ flex:1 }}><div style={{ fontSize:14, fontWeight:500 }}>{title}</div><div style={{ fontSize:12, color:C.text3 }}>{sub}</div></div>
              <button style={{ width:26, height:26, borderRadius:'50%', border:`1.5px solid ${logged?C.green:C.borderS}`, background:logged?C.green:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, color:logged?'white':C.text3 }} onClick={e=>{e.stopPropagation();toggleMealLog(num);}}>✓</button>
              <span style={{ fontSize:13, color:C.text3 }}>{open?'▲':'▼'}</span>
            </div>
            {open && <div style={{ padding:'14px 16px 16px', borderTop:`1px solid ${C.border}` }}>
              <div style={{ background:C.grayL, borderRadius:10, padding:'12px 14px', border:`1px solid ${C.amberL}` }}>
                <div style={{ fontSize:11, background:C.amberL, color:C.amber, borderRadius:20, padding:'2px 10px', display:'inline-block', marginBottom:8, fontWeight:500 }}>Today's Recipe</div>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:6 }}>{recipes[`m${num}`]?.recipe}</div>
                <div style={{ fontSize:13, color:C.text2, lineHeight:1.7 }}>{recipes[`m${num}`]?.steps}</div>
              </div>
              {num===3&&<div style={{ background:C.grayL, borderRadius:10, padding:'12px 14px', marginTop:8 }}><div style={{ fontSize:12, fontWeight:600, marginBottom:4 }}>Cinnamon water (with Meal 3 + 5)</div><div style={{ fontSize:12, color:C.text2 }}>Pinch of cinnamon in room-temp water. Improves insulin sensitivity — prescribed in your plan.</div></div>}
              {num===5&&<div style={{ marginTop:10, padding:10, background:C.purpleL, borderRadius:10, fontSize:12, color:C.purple }}><strong>Late night cravings?</strong> Extra paneer/tofu in fridge · 1 fruit + 80g fat-free yogurt · Coke Zero for sugar cravings · Unlimited veggies always</div>}
            </div>}
          </div>;
        })}
      </div>}

      {/* ── SUPPLEMENTS ── */}
      {!dbLoading && page==='supplements' && <div>
        <div style={{ fontSize:22, fontWeight:700, marginBottom:4 }}>Supplements</div>
        <div style={{ fontSize:13, color:C.text3, marginBottom:16 }}>Targeted for your bloodwork — tap to mark taken</div>
        <div style={{ background:C.blueL, border:'1px solid #B5D4F4', borderRadius:10, padding:'12px 15px', fontSize:12, color:'#0C447C', lineHeight:1.7, marginBottom:20 }}>Your flags: Low Vitamin D · High Inflammation · Elevated Lipid Profile · Low Testosterone · Elevated TSH · Elevated Liver Enzymes</div>
        {['Meal 1','Meal 5'].map(timing=>(
          <div key={timing} style={{ marginBottom:20 }}>
            <SecLabel color={timing==='Meal 1'?C.amber:C.purple}>With {timing} — {timing==='Meal 1'?'morning':'evening'}</SecLabel>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
              {SUPPS.filter(s=>s.timing===timing).map(s=>{
                const taken=!!todayData.supps[s.id];
                return <div key={s.id} style={{ border:`1px solid ${taken?'#AFA9EC':C.border}`, borderRadius:10, padding:'12px 13px', cursor:'pointer', background:taken?C.purpleL:C.surface, transition:'all 0.15s' }} onClick={()=>toggleSupp(s.id)}>
                  <div style={{ fontSize:12, fontWeight:600, color:taken?C.purple:C.text, marginBottom:2 }}>{s.name}</div>
                  <div style={{ fontSize:11, color:C.text3, lineHeight:1.5 }}>{s.dose}</div>
                  <div style={{ fontSize:10, color:C.text3, marginTop:6, paddingTop:6, borderTop:`1px solid ${C.border}` }}>{s.note}</div>
                </div>;
              })}
            </div>
          </div>
        ))}
        <div style={card}>
          <div style={{ fontSize:12, fontWeight:600, marginBottom:8 }}>Daily food add-ins (non-negotiable)</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px 16px', fontSize:12, color:C.text2, lineHeight:1.8 }}>
            {['¼ tsp turmeric + pinch black pepper → reduces inflammation','Ginger + garlic in every cooked meal → lipid profile','Beetroot pre-workout → blood flow + pumps','Cinnamon water with Meal 3 + Meal 5 → insulin control','ACV (5ml) in morning drink → gut health','Saffron 2-3 strands in Meal 4 → serotonin'].map(t=><div key={t}>• {t}</div>)}
          </div>
        </div>
      </div>}

      {/* ── WEIGHT ── */}
      {!dbLoading && page==='weight' && <div>
        <div style={{ fontSize:22, fontWeight:700, marginBottom:4 }}>Weight Log</div>
        <div style={{ fontSize:13, color:C.text3, marginBottom:20 }}>Track progress from baseline: 111 kg</div>
        <div style={statGrid}>
          <StatCard label="Start weight" value="111" unit="kg" sub="Baseline — Day 1"/>
          <StatCard label="Current weight" value={latestW||'—'} unit={latestW?'kg':''} sub={wLost>0?`−${wLost}kg from start`:'Keep logging'}/>
          <StatCard label="Total lost" value={wLost>0?wLost:'—'} unit={wLost>0?'kg':''} sub={wLost>0?`${((START_WEIGHT-latestW)/START_WEIGHT*100).toFixed(1)}% of start weight`:''}/>
          <StatCard label="Days tracked" value={weightLog.length} sub="Weigh same time daily"/>
        </div>
        {weightLog.length>1 && <div style={{ ...card, marginBottom:20 }}><div style={{ fontSize:14, fontWeight:500, marginBottom:2 }}>Weight trend</div><div style={{ fontSize:12, color:C.text3, marginBottom:12 }}>Morning weigh-in — same time daily for accuracy</div><LineChart data={weightLog.map(e=>({date:e.date,value:e.weight}))} label="Weight trend" yFormatter={v=>v+'kg'} minPad={2}/></div>}
        <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:16 }}>
          <div>
            <SecLabel color={C.green}>Log weight</SecLabel>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[['Date','date',wDate,setWDate,''],['Weight (kg)','number',wInput,setWInput,'e.g. 110.5'],['Note (optional)','text',wNote,setWNote,'e.g. morning, post-workout']].map(([label,type,val,setter,ph])=>(
                <div key={label}><div style={{ fontSize:12, color:C.text2, fontWeight:500, marginBottom:4 }}>{label}</div><input type={type} value={val} onChange={e=>setter(e.target.value)} placeholder={ph} style={formInput} step={type==='number'?0.1:undefined}/></div>
              ))}
              <button style={btnPrimary} onClick={addWeight}>Log weight</button>
            </div>
            <div style={{ marginTop:14, background:C.amberL, borderRadius:10, padding:'12px 14px', fontSize:12, color:C.amber, lineHeight:1.7 }}>Best practice: Weigh every morning after toilet, before eating. Day-to-day swings of 0.5-1kg are normal — look at the weekly trend.</div>
          </div>
          <div>
            <SecLabel color={C.blue}>History</SecLabel>
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, overflow:'hidden' }}>
              {!weightLog.length ? <div style={{ textAlign:'center', padding:'40px 20px', color:C.text3, fontSize:13 }}>No entries yet.</div> : (
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                  <thead><tr>{['Date','Weight','Change','Note',''].map(h=><th key={h} style={{ textAlign:'left', fontSize:11, textTransform:'uppercase', letterSpacing:'0.05em', color:C.text3, fontWeight:500, padding:'8px 12px', borderBottom:`1px solid ${C.border}` }}>{h}</th>)}</tr></thead>
                  <tbody>{[...weightLog].reverse().map((e,i,arr)=>{const prev=arr[i+1];const delta=prev?(e.weight-prev.weight).toFixed(1):null;return <tr key={e.date}><td style={{ padding:'10px 12px' }}>{fmtDate(e.date)}</td><td style={{ padding:'10px 12px', fontFamily:"'DM Mono',monospace", fontWeight:600 }}>{e.weight} kg</td><td style={{ padding:'10px 12px' }}>{delta===null?'—':<span style={{ color:delta<=0?C.green:C.red }}>{delta<=0?'▼ ':'▲ '}{Math.abs(delta)}</span>}</td><td style={{ padding:'10px 12px', color:C.text3, fontSize:12 }}>{e.note||'—'}</td><td style={{ padding:'10px 12px' }}><button onClick={()=>delWeight(e.date)} style={{ background:'none', border:'none', cursor:'pointer', color:C.text3, fontSize:16 }}>×</button></td></tr>;})}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>}

      {/* ── DASHBOARD ── */}
      {!dbLoading && page==='dashboard' && <Dashboard
        savedDays={savedDays}
        weightLog={weightLog}
        latestW={latestW}
        wLost={wLost}
      />}

      {/* ── HEALTH ── */}
      {!dbLoading && page==='health' && <div>
        <div style={{ fontSize:22, fontWeight:700, marginBottom:4 }}>Health Focus</div>
        <div style={{ fontSize:13, color:C.text3, marginBottom:20 }}>Your markers, workout split, food substitutions</div>
        <div style={{ marginBottom:24 }}>
          <SecLabel color={C.red}>Your health markers — current status</SecLabel>
          {[{name:'Low Vitamin D',action:'D3 10,000 IU daily + 20min morning sunlight every day',sev:'red'},{name:'High Inflammation / Elevated Lipoprotein',action:'Turmeric+pepper in every meal, omega supplement, zero alcohol',sev:'red'},{name:'Elevated Liver Enzymes',action:'Zero alcohol 4-6 weeks, post-meal walks, 1-2 black coffees/day, beetroot + cruciferous veggies',sev:'red'},{name:'Elevated Lipid Profile',action:'600g veggies, lean protein, ginger+garlic daily, spray oil only',sev:'amber'},{name:'Low Testosterone',action:'Zinc methionine + Vegan DHA + Vitamin D3 — all in supplement stack',sev:'amber'},{name:'Elevated TSH (medicated)',action:'Consistent 7.5hr sleep, daily meditation, cortisol management is critical',sev:'amber'},{name:'Elevated Stress / Cortisol',action:'10-min body scan nightly, cardio as hormetic stressor, hard 6pm work stop',sev:'amber'}].map(m=>(
            <div key={m.name} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 14px', border:`1px solid ${C.border}`, borderRadius:10, marginBottom:6, background:C.surface }}>
              <div><div style={{ fontSize:13, fontWeight:500 }}>{m.name}</div><div style={{ fontSize:12, color:C.text3, marginTop:2 }}>{m.action}</div></div>
              <span style={{ fontSize:11, padding:'3px 10px', borderRadius:20, fontWeight:500, whiteSpace:'nowrap', marginLeft:12, background:m.sev==='red'?C.redL:C.amberL, color:m.sev==='red'?C.red:C.amber }}>{m.sev==='red'?'Priority':'Focus'}</span>
            </div>
          ))}
        </div>
        <div style={{ marginBottom:24 }}>
          <SecLabel color={C.green}>Level 1 weekly workout split</SecLabel>
          <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:8 }}>
            {WORKOUTS.map((w,i)=><div key={i} style={{ border:`1px solid ${i===dayIdx?C.greenM:C.border}`, borderRadius:10, padding:'12px 14px', background:i===dayIdx?C.greenL:C.surface }}>
              <div style={{ fontSize:12, fontWeight:600, color:i===dayIdx?C.greenD:C.text }}>{w.icon} {w.day} — {w.label} {i===dayIdx&&<span style={{ fontSize:10, background:C.green, color:'white', borderRadius:20, padding:'1px 7px', marginLeft:4 }}>TODAY</span>}</div>
              <div style={{ fontSize:11, color:i===dayIdx?C.green:C.text3, marginTop:3, lineHeight:1.6 }}>{w.exercises.slice(0,3).map(e=>e.name).join(' · ')}{w.exercises.length>3?'…':''}</div>
            </div>)}
          </div>
        </div>
        <SecLabel color={C.blue}>Food substitution quick reference</SecLabel>
        <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:10 }}>
          {[['Protein — swap freely',['Paneer 100g','Tofu 120g','Soya nuggets 35g','Greek yogurt 120g','Whey 1 scoop','Tempeh 120g']],['Carbs — swap freely',['Oats 40g','Rice 40g','Bran atta 40g','Millets 40g','Brown pasta 40g','Sweet potato 180g','Potato 170g','Brown bread 2 slices']],['Fats — swap freely',['10 almonds','5 walnut halves','9 cashews','3 brazil nuts','40g avocado','5g ghee (measured)']]].map(([label,items])=>(
            <div key={label} style={{ background:C.grayL, borderRadius:10, padding:'13px 14px' }}>
              <div style={{ fontSize:12, fontWeight:600, marginBottom:8 }}>{label}</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>{items.map(t=><span key={t} style={{ fontSize:11, background:C.surface, color:C.text2, borderRadius:20, padding:'3px 10px', border:`1px solid ${C.border}` }}>{t}</span>)}</div>
            </div>
          ))}
        </div>
      </div>}
    </main>
  </div>;
}
