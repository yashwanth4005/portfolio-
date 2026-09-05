/**
 * ================================================================
 *  PORTFOLIO DATA — single source of truth for Yashwanth Kumar
 *  Edit this file to update your content. Never touch the UI files.
 * ================================================================
 */

const PORTFOLIO = {

  /* ── Personal Info ──────────────────────────────────────────── */
  personal: {
    name: "Yashwanth Kumar",
    greeting: "Hi, I'm",
    headline: "B.Tech Graduate  ·  Aspiring Software & Data Professional",
    description: "I am a B.Tech graduate interested in software development, data, and machine learning. I enjoy learning new technologies and building practical projects to solve real-world problems.",
    location: "Hyderabad, India",
    email: "yaswanthkumar4005@gmail.com",             // ← update
    github: "https://github.com/yashwanth4005",    // ← update
    linkedin: "https://linkedin.com/in/yashwanth4005", // ← update
    phone: "+91 9490464005",
    profileImage: "assets/images/profile.jpg",         // ← replace with your photo
  },

  /* ── About Section ──────────────────────────────────────────── */
  about: {
    paragraphs: [
      "I am a B.Tech graduate with a strong interest in software development, data analysis. I believe in writing clean, purposeful code and building solutions that address real-world problems.",
      "I am actively learning new technologies and working on projects to sharpen my skills. I am looking for opportunities — internships, entry-level roles, or collaborations — where I can contribute, learn, and grow.",
    ],
    cards: [
      { icon: "🎓", label: "Education", value: "B.Tech" },
      { icon: "📍", label: "Location", value: "Guntur, India" },
      { icon: "💼", label: "Career Level", value: "Fresher" },
      { icon: "🎯", label: "Interests", value: "Software · Data Analysis · FullStack Development" },
      { icon: "🔍", label: "Looking For", value: "Full-time / Internship" },
    ],
  },

  /* ── Education ──────────────────────────────────────────────── */
  education: [
    {
      degree: "B.Tech",
      branch: "Computer Science Engineering",         // ← update (e.g., "Computer Science")
      college: "Koneru Lakshmaia University",   // ← update
      university: "KL University",     // ← update
      year: "2023 – 2027",         // ← update
      cgpa: "8.95 / 10",           // ← update (or "XX% / 100%")
    },
    // Add intermediate / 10th if needed:
    {
      degree: "Intermediate (MPC)",
      branch: "MPC",
      college: "Sri Chaithanya Junior College",
      university: "Board of Intermediate Education",
      year: "2023",
      cgpa: "7.04%",
    },
  ],

  /* ── Technical Skills ───────────────────────────────────────── */
  // Add or remove skills freely. Keys become category headings.
  skills: {
    "Programming": ["Python", "C", "SQL"],
    "Database": ["Spring Boot", "REST APIs"],
    "Data Analysis & Visualization": ["Data Analysis", "NumPy", "Pandas"],
    "Web Technologies": ["HTML", "CSS", "JavaScript", "React.js"],
    "Tools & Platforms": ["Git", "GitHub", "VS Code"],
  },

  /* ── Currently Learning ─────────────────────────────────────── */
  // Technologies / concepts you are actively studying right now.
  learning: [
    "Update this list with what you are currently learning",
    // e.g., "React.js", "Deep Learning", "Docker", "Data Structures & Algorithms"
  ],

  /* ── Certifications ─────────────────────────────────────────── */
  // Leave empty [] if you have none yet. Add as you earn them.
  certifications: [
    // {
    //   name:  "Certificate Name",
    //   org:   "Issuing Organization",
    //   date:  "Month YYYY",
    //   link:  "https://credential-link",   // or null
    //   image: null,  // or "assets/images/certs/cert1.jpg"
    // },
  ],

  /* ── Experience ─────────────────────────────────────────────── */
  // Leave empty [] if you have no experience yet.
  experience: [
    // {
    //   title:    "Role Title",
    //   company:  "Company Name",
    //   type:     "Internship",  // "Internship" | "Full-time" | "Freelance" | "Training"
    //   duration: "Month YYYY – Month YYYY",
    //   location: "Remote / City",
    //   points:   [
    //     "What you worked on and what you achieved.",
    //     "Another key contribution or learning.",
    //   ],
    // },
  ],

  /* ── Resume ─────────────────────────────────────────────────── */
  resume: {
    path: "./assets/resume/resume.pdf",       // ← drop your PDF here
    filename: "Yashwanth_Kumar_Resume.pdf",
  },

  /* ── Admin / Project Management ─────────────────────────────── */
  admin: {
    /**
     * HOW TO SET YOUR ADMIN PIN:
     * 1. Open your portfolio in a browser.
     * 2. Press  Ctrl + Shift + A
     * 3. Follow the "Set Admin PIN" prompt.
     * 4. The SHA-256 hash of your PIN will also be shown.
     * 5. Optionally paste that hash below so it is version-controlled.
     *
     * SECURITY NOTE:
     * This is client-side auth — appropriate for a personal GitHub Pages
     * portfolio. It prevents casual visitors from accessing admin but is
     * NOT production-grade security. For a real backend, migrate to
     * Firebase Auth, Supabase, or a custom API.
     */
    pinHash: null,  // e.g., "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3"
  },

};
