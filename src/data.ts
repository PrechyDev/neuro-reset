import { PresetGroup, ResetResponse } from "./types";

export const FEELING_PRESETS: PresetGroup = {
  label: "How are you feeling right now?",
  chips: [
    { id: "f1", label: "Executive Dysfunction", emoji: "🧠", value: "Stuck in severe cognitive inertia, know what to do but cannot move" },
    { id: "f2", label: "Sensory Overload", emoji: "💥", value: "Sensory system is fried, ambient noise feels like needles" },
    { id: "f3", label: "Hyperfocus Burnout", emoji: "🫗", value: "Drained from hyperfocusing on the wrong thing for hours" },
    { id: "f4", label: "Transition Friction", emoji: "🧱", value: "Experiencing heavy resistance shifting from relaxing to working" },
    { id: "f5", label: "Understimulated & Heavy", emoji: "💤", value: "Sluggish, low brain energy, feeling sleepy and unmotivated" },
  ]
};

export const TRIGGER_PRESETS: PresetGroup = {
  label: "What triggered it? (Optional)",
  chips: [
    { id: "t1", label: "Context Switching", emoji: "🔄", value: "Struggling to shift gears after a sudden interruption" },
    { id: "t2", label: "Vague instructions", emoji: "❔", value: "The task steps feel unstructured, and I do not know where to start" },
    { id: "t3", label: "Digital Rabbit Hole", emoji: "📱", value: "Got stuck scrolling Twitter, Instagram, or Slack" },
    { id: "t4", label: "Generator / Loud Traffic", emoji: "🔊", value: "Heavy generator roar or loud Nigerian road traffic draining battery" },
    { id: "t5", label: "A monstrous task list", emoji: "📋", value: "A massive list of tasks with no clear entry point" },
    { id: "t6", label: "Fear of doing a bad job", emoji: "🥺", value: "High perfectionism block and wanting to avoid failure" },
  ]
};

export const LOCATION_PRESETS: PresetGroup = {
  label: "Common locations (or type any customized space below):",
  chips: [
    { id: "l1", label: "Home (Bedroom / Parlor)", emoji: "🏠", value: "At home in my bedroom or parlor" },
    { id: "l2", label: "Girlfriend's House", emoji: "👩‍❤️‍👨", value: "At my girlfriend's house" },
    { id: "l3", label: "Office / Shared Workspace", emoji: "💼", value: "At a desk in a quiet office or shared workspace" },
    { id: "l4", label: "Library / Quiet Hall", emoji: "📚", value: "A library or quiet space where I must remain silent" },
    { id: "l5", label: "Danfo Bus", emoji: "🚌", value: "Inside a moving public vehicle or danfo bus" },
    { id: "l6", label: "Banking Hall / Queue", emoji: "🏦", value: "Standing or sitting in a busy banking hall queue" },
  ]
};

export const TIME_PRESETS: PresetGroup = {
  label: "Time you can spare right now for your reset break:",
  chips: [
    { id: "d1", label: "Just 2 minutes", emoji: "⚡", value: "2 minutes" },
    { id: "d2", label: "5 minutes", emoji: "⏱️", value: "5 minutes" },
    { id: "d3", label: "10 minutes", emoji: "⏳", value: "10 minutes" },
  ]
};

// Expanded to exactly 20 high-quality pre-curated resets (10 for public, 10 for private spaces)
export const OFFLINE_RESETS: Record<string, ResetResponse[]> = {
  public: [
    {
      title: "The Silent Toe Squeeze",
      intervention: "Do this now: Sit upright and firmly press your big toes down into the soles of your shoes. Maintain this maximal squeeze for exactly 10 seconds, then release completely for 10 seconds. Repeat this tensing and releasing pattern 5 times.",
      whyItWorks: "Why it works: Isometric muscle compression triggers deep sensory proprioceptive feedback that down-regulates a hyper-active nervous system without drawing any public attention.",
      then: "Then: Open the file or screen you need to work on and type exactly five letters to break the paralysis.",
      category: "sensory",
      durationSeconds: 120
    },
    {
      title: "The 3x3 Silent Grounder",
      intervention: "Do this now: Scan your immediate environment and find 3 items of a specific color, touch 2 actual textures within arms' reach, and match your breathing depth to the hum of the surrounding space.",
      whyItWorks: "Why it works: Grounding channels your sensory receptors out of high-vibration anxiety back into immediate physical safety.",
      then: "Then: Open your pending screen and focus on just the very first word.",
      category: "sensory",
      durationSeconds: 150
    },
    {
      title: "Discreet Ankle Alphabet Reels",
      intervention: "Do this now: While sitting or standing, lift one heel slightly. Discreetly draw the first 5 letters of the alphabet (A, B, C, D, E) in the air with your big toe. Swap feet and write them again with the other ankle.",
      whyItWorks: "Why it works: Staged ankle rotation utilizes complex motor planning to break task avoidance loops and increase immediate local blood flow.",
      then: "Then: Take a quick breath and open your document.",
      category: "movement",
      durationSeconds: 120
    },
    {
      title: "The Slow Glass Trace",
      intervention: "Do this now: Hold your glass or water container. Spend exactly two minutes tracing its temperature, density, and cold condensation with your fingertips, breathing quietly.",
      whyItWorks: "Why it works: Immediate tactile sensory tracing diverts overactive mental gears, slowing your heart rate and introducing somatic presence.",
      then: "Then: Take a single sip, open your screen, and look closely at the target task details.",
      category: "sensory",
      durationSeconds: 180
    },
    {
      title: "Core Isometric Lock",
      intervention: "Do this now: Sit back, contract your core muscles fully for 8 seconds, and then release them completely. Repeat this process 6 times, breathing steadily.",
      whyItWorks: "Why it works: Isometric core holds discharge high autonomic arousal, letting the nervous system settle into a quiet parasympathetic state.",
      then: "Then: Direct your eyes to the first step of your task and make a small note.",
      category: "movement",
      durationSeconds: 150
    },
    {
      title: "Thumb-to-Finger Sequences",
      intervention: "Do this now: Bring your hand to your side. Touch your thumb to your index, middle, ring, and pinky finger one by one with steady force, then reverse the sequence. Do this 10 times consecutively.",
      whyItWorks: "Why it works: Fine motor planning drills stimulate dopamine secretion by fulfilling clean, measurable physical targets.",
      then: "Then: Touch your keyboard or tool and begin your work with a tiny, brief detail.",
      category: "dopamine",
      durationSeconds: 120
    },
    {
      title: "The Distant Sound Hunter",
      intervention: "Do this now: Close your eyes and hunt for the most distant ambient sound you can find (e.g., street noise, a bird). Focus on it exclusively for 1 minute, ignoring all immediate noises.",
      whyItWorks: "Why it works: Dynamic auditory filter tuning forces your brain's frontal lobe to engage, rebuilding deliberate attention filters.",
      then: "Then: Open your eyes and read the first bullet point on your list.",
      category: "sensory",
      durationSeconds: 120
    },
    {
      title: "Phone Screentime Pause",
      intervention: "Do this now: Completely lock your phone. Look directly at your reflection on the dark screen for 30 seconds. Slowly blink 5 times, letting your ocular muscles relax fully.",
      whyItWorks: "Why it works: Forcing visual distance blocks screen-induced dopamine seeking loops and interrupts high transition friction.",
      then: "Then: Set the phone face down and interact with your work material for three seconds.",
      category: "initiation",
      durationSeconds: 120
    },
    {
      title: "Discreet Shoulder Shrugs",
      intervention: "Do this now: Elevate your shoulders up to your ears as high as they can go, maintain the tension for 3 seconds, then drop them completely. Do this 8 times.",
      whyItWorks: "Why it works: Actively tensing and releasing shoulder muscle groups lowers physical anxiety and dissolves structural tension.",
      then: "Then: Open the file or screen you need to work on and touch the keyboard.",
      category: "movement",
      durationSeconds: 120
    },
    {
      title: "The Danfo Gaze Shift",
      intervention: "Do this now: Shift your gaze to a very distant point outside or across the space for 20 seconds. Next, look at an object within arm's reach for 20 seconds. Repeat this gaze shift 4 times.",
      whyItWorks: "Why it works: Altering focus distance exercises the physical eye muscles, clearing structural visual fatigue and cerebral blocks.",
      then: "Then: Shift your gaze back to your primary workstation and read one headline.",
      category: "sensory",
      durationSeconds: 160
    }
  ],
  private: [
    {
      title: "Somatic Freeze Melter",
      intervention: "Do this now: Shake your hands and arms vigorously for exactly 30 seconds. Next, shrug your shoulders up to your ears as high as they can go, hold for 5 seconds, and let them drop. Do this 3 times.",
      whyItWorks: "Why it works: Proprioceptive and muscular release releases systemic stress hormones and resets physical brain loops that cause task avoidance.",
      then: "Then: Place your fingers directly over your workspace.",
      category: "movement",
      durationSeconds: 120
    },
    {
      title: "The Ice-Water Splash",
      intervention: "Do this now: Walk to the sink, fill your palms with cold water, and press it firmly against your open face, neck, and behind your ears. Let the cool moisture dry naturally.",
      whyItWorks: "Why it works: The extreme cold stimulus activates the mammalian dive reflex, rapidly slowing your heart rate and clearing sluggish cognitive fog.",
      then: "Then: Sit back down at your desk and open your editor immediately.",
      category: "sensory",
      durationSeconds: 180
    },
    {
      title: "The Terrible 60-Second Output",
      intervention: "Do this now: Open a completely blank document or notepad. Start typing the absolute worst, ugliest, most nonsensical sentences about your pending task. Spill whatever rubbish comes to mind without correction.",
      whyItWorks: "Why it works: Explicitly allowing terrible work removes the executive anxiety of perfectionism and lowers initiation barriers.",
      then: "Then: Delete or ignore the rubbish and write down the very first real line of your actual task.",
      category: "initiation",
      durationSeconds: 120
    },
    {
      title: "The 4-Minute Sweep Blast",
      intervention: "Do this now: Stand up, set a timer for exactly 4 minutes, and pick exactly 5 scattered things off your parlor floor or desk. Put them back where they belong. Stop completely once the timer beeps.",
      whyItWorks: "Why it works: Quick, boundaries-defined movement breaks stimulate dopamine release by satisfying a simple, achievable visual completion loop.",
      then: "Then: Return to your workspace and touch your keyboard.",
      category: "movement",
      durationSeconds: 240
    },
    {
      title: "The desk-clearing loop",
      intervention: "Do this now: Identify precisely 3 elements scattered across your visual arena that are not related to your task, pick them up, and set them behind you or in a drawer. Clear your central view.",
      whyItWorks: "Why it works: Visual field boundaries minimize cognitive drag by lowering the processing cost for active working memory.",
      then: "Then: Bring your computer to the center of your empty path and work on it.",
      category: "dopamine",
      durationSeconds: 150
    },
    {
      title: "The Vagus Sigh Reset",
      intervention: "Do this now: Take a deep breath through your nose, follow it quickly by a tiny secondary sniff to expand the lungs, then let out a slow vocalized sigh through open lips. Repeat 5 times.",
      whyItWorks: "Why it works: Double-sniff sighing instantly empties toxic carbon dioxide levels in the bloodstream, triggering deep neurological relaxation.",
      then: "Then: Sit straight and open the target screen.",
      category: "sensory",
      durationSeconds: 120
    },
    {
      title: "Loud Vocal Discharge",
      intervention: "Do this now: Open your mouth wide and make a loud hum or vibrate your lips together rapidly for 20 seconds. Repeat 3 times to let your facial muscles vibrate fully.",
      whyItWorks: "Why it works: Vocal chord vibrations stimulate cranial nerves that quickly lower autonomic shock and cognitive lock.",
      then: "Then: Gently look at your screen and write just one line.",
      category: "movement",
      durationSeconds: 120
    },
    {
      title: "The 5-Step Gravity Walk",
      intervention: "Do this now: Stand up. Walk exactly 5 slow steps. Focus entirely on the concrete weight of your heels hitting the ground, and your spine supporting your frame with each step.",
      whyItWorks: "Why it works: Somatosensory feedback brings attention down from catastrophic future spirals into real-time safety.",
      then: "Then: Return to your workspace, touch your tool, and initiate the task.",
      category: "movement",
      durationSeconds: 180
    },
    {
      title: "Temp Change Hand Wash",
      intervention: "Do this now: Run to the sink. Turn on cold tap water and wash your hands. Rub your palms together firmly under the stream. Dry them completely with a fresh towel.",
      whyItWorks: "Why it works: Drastic sensory temperature changes override mental static waves and stimulate somatic attention.",
      then: "Then: Immediately sit back down and tackle your primary chore for 30 seconds.",
      category: "sensory",
      durationSeconds: 150
    },
    {
      title: "Visual Anchor Setup",
      intervention: "Do this now: Select exactly one visual token (like a clean mug, an attractive card, or a specific coaster) and place it directly beside your screen. Let your eyes focus on it for 10 seconds.",
      whyItWorks: "Why it works: Visual anchors create a physical orientation point, keeping the hyperactive brain centered in its workspace boundaries.",
      then: "Then: Translate that orientation to your target job, taking one brief baby step.",
      category: "initiation",
      durationSeconds: 120
    }
  ]
};

// Exactly 50 highly practical, realistic, relatable advice slides for young neurodivergent Nigerian adults
export const ADVICE_SLIDES = [
  "Alternative wiring is not a flaw. Stop comparing your cognitive tempo to neurotypical peers today.",
  "Options act as toxic cognitive weight. A single directive bypasses choice-paralysis instantly.",
  "Public spaces code you into stillness, but your toes and breathing can regulate you unnoticed.",
  "Autistic inertia resists starting. Give yourself permission to make an incredibly ugly first line.",
  "Feeling sluggish means your cortex is seeking stimulation. A quick physical challenge triggers immediate dopamine.",
  "Sensory overload isn't a bad attitude; it is your biological filter shutting down. Calm the noise first.",
  "You are not lazy; you are frozen. There is a wide biological difference under neurodivergency.",
  "A tiny, terrible start is infinitely more useful than an immaculate, unborn plan.",
  "The constant hum of a generator acts as auditory rust. Ground your sensory receptors right now.",
  "Your partner's couch or bedroom holds different sensory associations. Transition with respect for the fresh space.",
  "No gree for executive dysfunction today. Lower your target demands to microscopic tasks.",
  "Danfo noise is chaotic, but shifting your gaze 5 degrees can recalibrate your vestibular system safely.",
  "If a task feels too large, your brain treats it as a biological threat. Disarm it by shrinking the target.",
  "Hyperfocus isn't a bad thing, but getting stuck on the wrong rail drains your executive fuel fast.",
  "Splashing cold tap water stimulates the vagus nerve, immediately shifting your nervous state.",
  "We refuse toxic positivity. Some days are hard, but we can somatically ground ourselves anyway.",
  "The panic of a looming deadline drains limited focus. Breathe, contract your core, and reset calmly.",
  "A workspace with scattered mugs is busy visual noise. Put exactly three away to win a quick dopamine hit.",
  "You don't need to finish the whole project today. You just need to touch the keyboard for 60 seconds.",
  "Nervous systems don't care about logic or arguments. They care about immediate somatic safety.",
  "Body-doubling works because knowing other peers are in the focus loop lowers task anxiety.",
  "Scribbling nonsensical words on scratch paper tricks the autistic inertia engine into moving.",
  "A single cup of water, drank slowly while tracing the cold glass, resets intensive cognitive overload.",
  "Isolating one tiny action removes the giant weight of a massive master todo list.",
  "ADHD is an interest-driven energy system. If it is boring, we must borrow dopamine from somatic movement.",
  "Don't fight the generator sound. Synchronize your slow breaths to its steady rhythm instead.",
  "Transitions are the absolute hardest part of alternative brains. Be exceptionally gentle with yourself today.",
  "It is perfectly alright if your desk looks chaotic. Create one clean 10-inch circle of focus.",
  "Close your eyes for 30 seconds and locate the furthest sound. This switches you from internal spiral to outer focus.",
  "Isometric muscle clenching of your thighs requires zero movement but fires excellent motor planning pathways.",
  "When your brain is fried, reading complex instructions is painful. Start with the bold text only.",
  "A 5-minute break that actually resets your sensory system is better than 3 hours of guilt-ridden staring.",
  "You are worthy of gentle transition buffers. Take 3 slow breaths before shifting tasks.",
  "Your girlfriend's or boyfriend's house has different sensory markers. Let your mind adjust before tackling heavy chores.",
  "If WhatsApp notifications are sparking panic, flip your phone face-down. Out of sight, out of working memory.",
  "Draw circles with your ankles; it releases stored physical anxiety from prolonged sitting.",
  "Task paralysis is executive traffic. Let the panic cars pass; your lane will clear up eventually.",
  "A high-intensity meltdown needs cold water or deep muscle tension, not a logical lecture.",
  "We are not doing 'productivity engineering.' We are caring for your highly sensitive nervous system.",
  "There is zero shame in finding things hard today. Shaking your hands out can dispel the heavy fog.",
  "Never wait for 'perfect inspiration.' It is a fiction. Action produces the chemical state of focus.",
  "A messy kitchen sink or unmade bed is a visual attention trap. Close the door or turn away to focus.",
  "When sound is too loud in Nigeria, hum a low, constant frequency. It dampens external spike frequencies.",
  "Autistic meltdown is a physical overload state. Turn off your screen, look at a wall, and breathe.",
  "Celebrate highly ugly drafts! They are the champions that break the cognitive block.",
  "Somatic regulation is the master key. When the mind is stuck in a loop, move the physical body.",
  "You are not failing. You are navigating a neurotypical workspace with a magnificent custom brain.",
  "Dopamine crashes are cyclical. Recognize the low-tide and ride it out without harsh self-blame.",
  "You don't need standard time management. You need sensory-aligned energy management.",
  "Take one microscopic step. The smallest action contains the nucleus of full task initiation."
];
