export const HERO = {
  name: 'DIPTANGKUSH DAS',
  callsign: 'KINGSLAYER',
  role: 'Digital Vigilante Engineer',
  tagline: 'Building systems today that model the intelligence of tomorrow.',
  bio: 'I build at the intersection of logic, automation, and intelligent design: algorithmic trading engines, secure VPN architectures, AI pipelines, and data systems shaped around how software behaves under pressure.',
  origin: 'Kolkata, India',
  contact: {
    email: 'diptangkushdas@gmail.com',
    phone: '+91-8972379094',
    linkedin: 'https://www.linkedin.com/in/diptangkush-das-kingslayer',
    github: 'https://github.com/AspiringAdult',
    resume: '/Diptangkush_CV.pdf',
  },
}

export const SKILLS = [
  { name: 'Python', level: 92, group: 'Code' },
  { name: 'Java', level: 78, group: 'Code' },
  { name: 'C / C++', level: 70, group: 'Code' },
  { name: 'Power BI', level: 84, group: 'Data' },
  { name: 'MySQL', level: 80, group: 'Data' },
  { name: 'Streamlit / Flask', level: 82, group: 'Frameworks' },
  { name: 'Algorithmic Trading', level: 86, group: 'Domain' },
  { name: 'Data Science', level: 80, group: 'Domain' },
  { name: 'Testing & Debugging', level: 88, group: 'Engineering' },
]

export const LANGUAGES = [
  { name: 'Bengali', level: 'NATIVE' },
  { name: 'English', level: 'FLUENT' },
  { name: 'Hindi', level: 'FLUENT' },
]

export const PROJECTS = [
  {
    id: 'genesis',
    world: 'shadow',
    code: 'OP-001',
    name: 'GENESIS SYNDICATE',
    subtitle: 'AI Consciousness Emulator',
    color: '#22d3ee',
    glyph: 'AI',
    summary: 'Experimental AI framework exploring consciousness-like behavior through dynamic memory re-selection, personality switching, and adaptive learning loops.',
    objectives: [
      'Model evolving neural behavior across personality vectors',
      'Implement memory re-selection over conversational context',
      'Build adaptive loops with self-introspection telemetry',
    ],
    stack: ['Python', 'Vector Memory', 'LLM Orchestration', 'Adaptive Loops'],
    status: 'ACTIVE',
  },
  {
    id: 'rag',
    world: 'shadow',
    code: 'OP-002',
    name: 'RAG NEXUS',
    subtitle: 'Retrieval-Augmented Generation Pipeline',
    color: '#67e8f9',
    glyph: 'RAG',
    summary: 'Document indexing and semantic search connected to a language model for context-aware answers grounded in retrieved evidence.',
    objectives: [
      'Create vector embeddings with similarity search',
      'Shape prompts for grounded responses',
      'Tune retrieval latency without losing relevance',
    ],
    stack: ['Python', 'Embeddings', 'Vector DB', 'LLM API'],
    status: 'DEPLOYED',
  },
  {
    id: 'tradebot',
    world: 'web',
    code: 'OP-003',
    name: 'WEAVER TRADING BOT',
    subtitle: 'Algorithmic Trading + Generative Intelligence',
    color: '#f0abfc',
    glyph: 'BOT',
    summary: 'Automated trading system that executes rule-based strategies on technical indicators with historical backtesting and risk controls.',
    objectives: [
      'Generate signals from technical indicators',
      'Backtest against historical data for returns and drawdown',
      'Manage positions with repeatable risk constraints',
    ],
    stack: ['Python', 'Pandas', 'NumPy', 'Yahoo Finance API'],
    status: 'OPERATIONAL',
  },
  {
    id: 'maven',
    world: 'web',
    code: 'OP-004',
    name: 'MARKET MAVEN',
    subtitle: 'Sentiment-Driven Stock Dashboard',
    color: '#a5f3fc',
    glyph: 'DASH',
    summary: 'Streamlit dashboard combining live financial data with sentiment analysis to surface trade-relevant signals quickly.',
    objectives: [
      'Ingest live financial data through Yahoo Finance',
      'Layer sentiment analysis over headline feeds',
      'Deliver interactive exploration for market signals',
    ],
    stack: ['Streamlit', 'Python', 'Yahoo Finance', 'NLP'],
    status: 'DEPLOYED',
  },
  {
    id: 'vpn',
    world: 'cyber',
    code: 'OP-005',
    name: 'NIGHTSHADE VPN',
    subtitle: 'Java VPN Prototype / Networking & Security',
    color: '#fde68a',
    glyph: 'VPN',
    summary: 'Proof-of-concept VPN-like system in Java over TCP sockets featuring encrypted channels, key exchange logic, and packet forwarding simulation.',
    objectives: [
      'Create encrypted communication channels over TCP',
      'Prototype shared-key exchange logic',
      'Simulate packet forwarding for tunneling analysis',
    ],
    stack: ['Java', 'TCP Sockets', 'Cryptography', 'Networking'],
    status: 'PROTOTYPE',
  },
]

export const EXPERIENCE = [
  {
    title: 'Data Science Visualization',
    company: 'Infotech',
    dates: 'Mar 2024 - Jun 2024',
    points: [
      'Automated pictorial reporting of company datasets with the Prodigy Team.',
      'Designed Python programs to analyze datasets and classify outcomes visually.',
      'Built bar charts, histograms, and Power BI dashboards that cut repetitive reporting time.',
    ],
  },
  {
    title: 'Python Developer',
    company: 'Cognifyz',
    dates: 'Feb 2026 - Mar 2026',
    points: [
      'Automated data processing tasks through Python scripts and workflow helpers.',
      'Worked on back-end logic with a strong focus on database operations.',
      'Debugged and resolved reliability issues across the codebase.',
    ],
  },
  {
    title: 'Blockchain Developer',
    company: 'AlphaCode',
    dates: 'Mar 2026 - Apr 2026',
    points: [
      'Developed Solidity smart contracts for decentralized applications.',
      'Tested and debugged blockchain applications for QA and release readiness.',
      'Recommended improvements for existing infrastructure and contract behavior.',
    ],
  },
]

export const DATA_STREAMS = [
  {
    label: 'Automation Systems',
    value: 89,
    detail: 'Python workflows, debugging, and repeatable operational tooling.',
  },
  {
    label: 'Visualization Layer',
    value: 84,
    detail: 'Power BI dashboards, charting systems, and insight-first storytelling.',
  },
  {
    label: 'Intelligence Pipelines',
    value: 86,
    detail: 'AI experimentation, retrieval workflows, and adaptive system design.',
  },
  {
    label: 'Security Thinking',
    value: 78,
    detail: 'Networking fundamentals, ethical hacking labs, and secure-channel analysis.',
  },
]

export const CERTIFICATIONS = [
  {
    name: 'Ethical Hacking with Kali Linux',
    org: 'IBM',
    tag: 'CYBER',
    summary: 'Hands-on security foundations covering Kali Linux workflows, reconnaissance patterns, and core attack-surface analysis.',
    skills: ['Kali Linux', 'Reconnaissance', 'Security Labs'],
  },
  {
    name: 'Ethical Hacking Capstone: Breach, Response, AI',
    org: 'IBM',
    tag: 'CYBER',
    summary: 'Capstone work centered on breach simulation, response thinking, and security automation augmented by AI-assisted reasoning.',
    skills: ['Incident Response', 'Threat Modeling', 'Security Automation'],
  },
  {
    name: 'Ethical Hacking Essentials',
    org: 'EC-Council',
    tag: 'CYBER',
    summary: 'Baseline ethical hacking concepts focused on network security, attack methodology, and defensive awareness.',
    skills: ['Network Security', 'Vulnerability Mindset', 'Defense Basics'],
  },
  {
    name: 'Computer Vision App with Azure Cognitive Service',
    org: 'Microsoft',
    tag: 'AI',
    summary: 'Applied computer vision workflows using Azure services to turn image inputs into structured intelligence.',
    skills: ['Computer Vision', 'Azure AI', 'Applied ML'],
  },
  {
    name: 'Decentralized Finance',
    org: 'Duke University',
    tag: 'WEB3',
    summary: 'Exploration of decentralized finance systems, market mechanics, and blockchain-native financial models.',
    skills: ['DeFi', 'Blockchain Markets', 'Financial Systems'],
  },
  {
    name: 'Fundamental Neuroscience for Neuroimaging',
    org: 'Johns Hopkins University',
    tag: 'SCI',
    summary: 'Scientific grounding in cognition, brain systems, and the biological context that informs intelligence modeling.',
    skills: ['Neuroscience', 'Research Framing', 'Signal Interpretation'],
  },
  {
    name: 'International Supply Chains and Logistics',
    org: 'University of Colorado Boulder',
    tag: 'OPS',
    summary: 'Operational systems thinking around logistics, movement constraints, and decision-making across distributed processes.',
    skills: ['Operations', 'Logistics', 'Systems Thinking'],
  },
]

export const EDUCATION = [
  {
    school: 'Adamas University, Kolkata',
    degree: 'Master of Computer Application',
    dates: '2025 - 2027',
    status: 'In Progress',
  },
  {
    school: 'Dayananda Sagar University, Bangalore',
    degree: 'Bachelor of Computer Application',
    dates: '2021 - 2024',
    status: 'Completed',
  },
  {
    school: "St. Joseph's School, Siliguri",
    degree: 'Schooling',
    dates: 'Foundational Studies',
    status: 'Completed',
  },
  {
    school: 'Indian Convent School, Kota',
    degree: 'Schooling',
    dates: 'Foundational Studies',
    status: 'Completed',
  },
]

export const CONTACT_PROTOCOLS = [
  {
    title: 'Base',
    detail: HERO.origin,
  },
  {
    title: 'Focus',
    detail: 'AI systems, data products, automation, and secure engineering experiments.',
  },
  {
    title: 'Status',
    detail: 'Open to internships, freelance builds, and collaborative technical work.',
  },
]

export const SECTORS = [
  { id: 'hero', label: 'CORE IDENTITY', code: '00' },
  { id: 'shadow', label: 'SHADOW INTELLIGENCE', code: '01' },
  { id: 'web', label: 'WEB OF SYSTEMS', code: '02' },
  { id: 'cyber', label: 'CYBER DEFENSE', code: '03' },
  { id: 'data', label: 'DATA LAB', code: '04' },
  { id: 'archive', label: 'KNOWLEDGE ARCHIVE', code: '05' },
  { id: 'contact', label: 'TRANSMISSION', code: '06' },
]
