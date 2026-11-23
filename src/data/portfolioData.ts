export type ProjectCategory = 'All' | 'AI & Agents' | '3D & Simulation' | 'Full-Stack' | 'Research & IoT';

export type SimVisualType = 'fluid' | 'dither' | 'globe' | 'network' | 'matrix' | 'waves';

export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  discipline: string;
  category: Exclude<ProjectCategory, 'All'>;
  year: string;
  period: string;
  summary: string;
  highlights: string[];
  stack: string[];
  metrics: { label: string; value: string }[];
  githubUrl: string;
  liveUrl?: string;
  paperUrl?: string;
  accentFrom: string;
  accentTo: string;
  bgTone: string;
  visualType: SimVisualType;
  featuredChapter?: boolean;
}

export const PROFILE = {
  name: 'Debjit Das',
  firstName: 'Debjit',
  lastName: 'Das',
  role: 'Full-Stack Developer & Creative Engineer',
  location: 'Chennai, India',
  timezone: 'Asia/Kolkata',
  email: 'debjitsince90908@gmail.com',
  phone: '+91 98630 92282',
  university: 'SRMIST, Kattankulathur',
  degree: 'B.Tech CSE (Data Science)',
  cgpa: '8.5 / 10',
  gradYear: '2024 – 2028',
  github: 'https://github.com/rosdebbu',
  linkedin: 'https://www.linkedin.com/in/debjit-das-6b0452327/',
  leetcode: 'https://leetcode.com/u/debbjitttt/',
  zenodo: 'https://zenodo.org/records/24333948',
  resumePdf: '/Debjit_Das_Resume.pdf',
  photo: '/photo.jpeg',
};

export const PROJECTS: ProjectItem[] = [
  {
    id: 'openzess',
    title: 'OpenZess',
    tagline: 'Open-Source AI Agent Workspace & Live Telemetry Studio',
    discipline: 'Full-Stack & AI Systems',
    category: 'AI & Agents',
    year: '2026',
    period: 'Apr 2026 – Present',
    summary:
      'An open-source AI agent workspace combining a React 19 web dashboard, terminal UI, and FastAPI/Rust execution backend with real-time WebSocket event streaming.',
    highlights: [
      '250+ commits across React 19 dashboard, terminal UI, and FastAPI backend.',
      'Real-time WebSocket data viewer, PostgreSQL persistence, Docker Compose setup, and CI with 86 passing tests.',
      'Published official VitePress documentation platform for the OpenZess architecture.',
    ],
    stack: ['React 19', 'TypeScript', 'Python', 'FastAPI', 'Rust', 'PostgreSQL', 'WebSockets', 'Docker'],
    metrics: [
      { label: 'Commits', value: '250+' },
      { label: 'CI Tests', value: '86 Passing' },
    ],
    githubUrl: 'https://github.com/rosdebbu/openzess',
    liveUrl: 'https://openzess-docs.vercel.app',
    accentFrom: '#455CE9',
    accentTo: '#00D2FF',
    bgTone: '#0D111C',
    visualType: 'network',
    featuredChapter: true,
  },
  {
    id: 'foamtwin',
    title: 'OpenZess Studio & FoamTwin',
    tagline: 'Browser-Native 2D/3D CFD Fluid & Heat-Transfer Simulators',
    discipline: 'WebGL & Scientific Computing',
    category: '3D & Simulation',
    year: '2026',
    period: 'Jun 2026 – Nov 2026',
    summary:
      'OpenFOAM-inspired fluid-flow studio streaming a live Python Navier–Stokes solver over WebSockets into a Vue 3 / React 19 + Three.js WebGL viewport with ParaView export.',
    highlights: [
      'Streams real-time velocity & pressure fields from a Python Navier–Stokes solver over WebSockets.',
      'FoamTwin renders 3D airflow and thermal transfer in React 19 + WebGL with OpenFOAM & ParaView export.',
      '80+ commits covering mesh generation, boundary conditions, and interactive visualization.',
    ],
    stack: ['Three.js', 'WebGL', 'React 19', 'Vue 3', 'TypeScript', 'Python', 'FastAPI', 'OpenFOAM'],
    metrics: [
      { label: 'Solver', value: 'Navier–Stokes' },
      { label: 'Export', value: 'ParaView / VTK' },
    ],
    githubUrl: 'https://github.com/rosdebbu/openn_fOam',
    liveUrl: 'https://github.com/rosdebbu/foamtwin--cfd',
    accentFrom: '#FF2E93',
    accentTo: '#00F0FF',
    bgTone: '#090910',
    visualType: 'fluid',
    featuredChapter: true,
  },
  {
    id: 'geoharmonix',
    title: 'GeoHarmonix',
    tagline: '26-Year NASA Satellite Active-Fire Burning Calendar & Globe',
    discipline: 'Data Visualization & Earth Science',
    category: '3D & Simulation',
    year: '2026',
    period: 'Nov 2026',
    summary:
      '3rd Place Winner at NASA Space Apps Challenge Chennai — harmonizing 26 years of cross-sensor NASA MODIS and VIIRS FIRMS satellite fire data into an interactive calendar and globe.',
    highlights: [
      'Won 3rd Place at NASA Space Apps Challenge Chennai (Team HighOnCode).',
      'Cross-sensor harmonization unifying MODIS and VIIRS orbital fire detections across 26 years.',
      'Interactive temporal calendar and geospatial fire-intensity visualization deployed on Vercel.',
    ],
    stack: ['Python', 'NASA FIRMS', 'MODIS / VIIRS', 'Web Visualization', 'Vercel'],
    metrics: [
      { label: 'Award', value: '3rd Place NASA' },
      { label: 'Span', value: '26 Years Data' },
    ],
    githubUrl: 'https://github.com/rosdebbu/GeoHarmonix',
    liveUrl: 'https://geo-harmonix-delta.vercel.app',
    accentFrom: '#FF6B2B',
    accentTo: '#FFD166',
    bgTone: '#170E0A',
    visualType: 'globe',
    featuredChapter: true,
  },
  {
    id: 'satyapay',
    title: 'SatyaPay',
    tagline: 'Zero-Latency Local EMI & Hidden Checkout Cost Detector',
    discipline: 'Fintech & Browser Extension',
    category: 'Full-Stack',
    year: '2026',
    period: 'Sep 2026',
    summary:
      'A Chrome extension and checkout widget that uncovers the true cost of EMI and payment offers — effective interest, GST, and hidden penalties — locally in under 5 ms.',
    highlights: [
      'Computes true APR, GST on interest, processing fees, and foreclosure penalties before checkout.',
      '100% local IndexedDB execution in < 5 ms for complete financial privacy.',
    ],
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Chrome Extension', 'IndexedDB'],
    metrics: [
      { label: 'Latency', value: '< 5 ms' },
      { label: 'Privacy', value: '100% Local' },
    ],
    githubUrl: 'https://github.com/rosdebbu/SatyaPay',
    accentFrom: '#10B981',
    accentTo: '#3B82F6',
    bgTone: '#081412',
    visualType: 'matrix',
  },
  {
    id: 'agrotech-ml',
    title: 'AgroTech ML',
    tagline: 'Crop & Fertilizer Recommender + Published Zenodo Audit',
    discipline: 'Applied ML & Research',
    category: 'Research & IoT',
    year: '2026',
    period: 'Aug 2026 – Nov 2026',
    summary:
      'Dual-stage machine learning web platform predicting 22 crops at 99.55% accuracy and 7 fertilizer types, accompanied by a published dataset robustness audit on Zenodo.',
    highlights: [
      '99.55% classification accuracy across 22 crop classes and 7 soil nutrient deficit profiles.',
      'Published peer-accessible dataset audit on Zenodo (DOI: 10.5281/zenodo.24333948).',
    ],
    stack: ['Python', 'FastAPI', 'Scikit-learn', 'Pandas', 'Vercel'],
    metrics: [
      { label: 'Accuracy', value: '99.55%' },
      { label: 'Paper', value: 'Zenodo DOI' },
    ],
    githubUrl: 'https://github.com/rosdebbu/crop-fertilizer-ml',
    liveUrl: 'https://crop-fertilizer-ml.vercel.app',
    paperUrl: 'https://zenodo.org/records/24333948',
    accentFrom: '#84CC16',
    accentTo: '#14B8A6',
    bgTone: '#0D150B',
    visualType: 'dither',
  },
  {
    id: 'shoresense',
    title: 'ShoreSense',
    tagline: 'ESP32 Multi-Sensor IoT Beach Monitoring & Fuzzy-Logic Dashboard',
    discipline: 'Hardware, IoT & ML',
    category: 'Research & IoT',
    year: '2026',
    period: 'Oct 2026 – Nov 2026',
    summary:
      'Custom ESP32 smart stick field-tested across 100 m at Elliot’s Beach, Chennai, streaming environmental telemetry into a live ML and fuzzy-logic coastal safety dashboard.',
    highlights: [
      'Hardware-to-cloud pipeline built on ESP32 + C++ firmware with multi-sensor fusion.',
      'Field-validated across 100 meters of coastline at Elliot’s Beach, Chennai.',
    ],
    stack: ['ESP32', 'C++', 'Python', 'Fuzzy Logic', 'Streamlit'],
    metrics: [
      { label: 'Field Test', value: '100m Coast' },
      { label: 'Inference', value: 'Fuzzy Logic' },
    ],
    githubUrl: 'https://github.com/rosdebbu/shoresense',
    liveUrl: 'https://shoresense-data.vercel.app',
    accentFrom: '#06B6D4',
    accentTo: '#6366F1',
    bgTone: '#07131B',
    visualType: 'waves',
  },
  {
    id: 'kalvios-ai',
    title: 'KalviOS AI',
    tagline: 'Agentic AI Student Life Companion Platform',
    discipline: 'Product & Frontend Engineering',
    category: 'AI & Agents',
    year: '2026',
    period: '2026',
    summary:
      'An agentic AI companion designed for university students to orchestrate academics, exams, career roadmaps, and personal finance from a single fast workspace.',
    highlights: [
      'Modular React + TypeScript + Vite architecture with agentic planning workflows.',
      'Deployed live on Vercel with responsive minimalist dashboard ergonomics.',
    ],
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'AI Agents'],
    metrics: [
      { label: 'Focus', value: 'Agentic OS' },
      { label: 'Status', value: 'Live' },
    ],
    githubUrl: 'https://github.com/rosdebbu/kalvios-ai',
    liveUrl: 'https://kalvios-ai.vercel.app',
    accentFrom: '#A855F7',
    accentTo: '#EC4899',
    bgTone: '#130B19',
    visualType: 'dither',
  },
];

export const SKILLS_GROUPS = [
  {
    label: 'Languages',
    items: ['TypeScript', 'JavaScript', 'Python', 'C++', 'Rust', 'Java', 'SQL', 'Bash'],
  },
  {
    label: 'Frontend & Creative',
    items: ['React 19', 'Next.js', 'Vue 3', 'Three.js / WebGL', 'GSAP', 'Lenis', 'Tailwind CSS', 'Vite'],
  },
  {
    label: 'Backend & Systems',
    items: ['FastAPI', 'Node.js', 'Express', 'WebSockets', 'PostgreSQL', 'MySQL', 'Prisma', 'Docker'],
  },
  {
    label: 'AI, ML & Scientific',
    items: ['PyTorch', 'PyTorch Geometric', 'Scikit-learn', 'OpenFOAM', 'ParaView', 'ESP32', 'Fuzzy Logic'],
  },
];

export const ACHIEVEMENTS = [
  {
    year: '2026',
    title: '3rd Place — NASA Space Apps Challenge, Chennai',
    detail: 'Team HighOnCode · Built GeoHarmonix harmonizing 26 years of MODIS & VIIRS fire data.',
  },
  {
    year: '2026',
    title: 'Published Research Paper on Zenodo',
    detail: 'Crop & Fertilizer ML Dataset Robustness Audit · DOI: 10.5281/zenodo.24333948.',
  },
  {
    year: '2026',
    title: 'Graph Neural Networks (GNN) Research — SRMIST',
    detail: 'Co-authoring faculty paper benchmarking GNN architectures against classical ML.',
  },
  {
    year: '2026',
    title: '660+ Open-Source GitHub Contributions',
    detail: '10+ live deployed apps · E-Summit 2026 IIT Madras · LeetCode & CodeChef.',
  },
];
