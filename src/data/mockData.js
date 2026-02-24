// src/data/mockData.js
// ─────────────────────────────────────────────
// All mock JSON data for Programs & Subjects
// ─────────────────────────────────────────────

export const PROGRAMS = [
  {
    id: 1,
    code: "BSIT",
    name: "Bachelor of Science in Information Technology",
    type: "Bachelor's",
    duration: "4 years",
    units: 168,
    status: "Active",
    dateAdded: "2024-01-10",
    description:
      "Equips students with skills to develop, manage, and support information systems. Covers programming, networking, database management, and system analysis.",
    yearLevels: {
      "1st Year": ["IT101", "IT102", "IT103", "GE001", "GE002", "GE003", "PE001", "NSTP1"],
      "2nd Year": ["IT201", "IT202", "IT203", "IT204", "GE004", "GE005", "PE002", "NSTP2"],
      "3rd Year": ["IT301", "IT302", "IT303", "IT304", "IT305", "GE006", "PE003"],
      "4th Year": ["IT401", "IT402", "IT403", "IT404", "IT405", "IT406"],
    },
  },
  {
    id: 2,
    code: "BSCS",
    name: "Bachelor of Science in Computer Science",
    type: "Bachelor's",
    duration: "4 years",
    units: 172,
    status: "Active",
    dateAdded: "2024-01-12",
    description:
      "Focuses on theoretical foundations of computation and practical software development. Emphasizes algorithms, data structures, and system design.",
    yearLevels: {
      "1st Year": ["CS101", "CS102", "CS103", "GE001", "GE002", "GE003", "PE001", "NSTP1"],
      "2nd Year": ["CS201", "CS202", "CS203", "CS204", "GE004", "GE005", "PE002", "NSTP2"],
      "3rd Year": ["CS301", "CS302", "CS303", "CS304", "CS305", "GE006", "PE003"],
      "4th Year": ["CS401", "CS402", "CS403", "CS404", "CS405"],
    },
  },
  {
    id: 3,
    code: "BSIS",
    name: "Bachelor of Science in Information Systems",
    type: "Bachelor's",
    duration: "4 years",
    units: 165,
    status: "Active",
    dateAdded: "2024-02-01",
    description:
      "Bridges business and technology. Prepares students for systems analysis, design, and management roles in enterprise environments.",
    yearLevels: {
      "1st Year": ["IS101", "IS102", "IS103", "GE001", "GE002", "PE001", "NSTP1"],
      "2nd Year": ["IS201", "IS202", "IS203", "IS204", "GE003", "GE004", "PE002", "NSTP2"],
      "3rd Year": ["IS301", "IS302", "IS303", "IS304", "IS305", "GE005"],
      "4th Year": ["IS401", "IS402", "IS403", "IS404", "IS405"],
    },
  },
  {
    id: 4,
    code: "DICT",
    name: "Diploma in Information and Communications Technology",
    type: "Diploma",
    duration: "2 years",
    units: 84,
    status: "Active",
    dateAdded: "2024-02-15",
    description:
      "Two-year program providing foundational ICT skills for immediate workforce readiness in technology support and basic development.",
    yearLevels: {
      "1st Year": ["DC101", "DC102", "DC103", "DC104", "GE001", "PE001"],
      "2nd Year": ["DC201", "DC202", "DC203", "DC204", "DC205"],
    },
  },
  {
    id: 5,
    code: "BSECE",
    name: "Bachelor of Science in Electronics Engineering",
    type: "Bachelor's",
    duration: "5 years",
    units: 198,
    status: "Under Review",
    dateAdded: "2024-03-05",
    description:
      "Covers electronics, communications, and control systems engineering with emphasis on circuit design and signal processing.",
    yearLevels: {
      "1st Year": ["ECE101", "ECE102", "GE001", "GE002", "GE003", "PE001", "NSTP1"],
      "2nd Year": ["ECE201", "ECE202", "ECE203", "GE004", "GE005", "PE002", "NSTP2"],
      "3rd Year": ["ECE301", "ECE302", "ECE303", "ECE304", "GE006"],
      "4th Year": ["ECE401", "ECE402", "ECE403", "ECE404", "PE003"],
      "5th Year": ["ECE501", "ECE502", "ECE503", "ECE504"],
    },
  },
  {
    id: 6,
    code: "BSME",
    name: "Bachelor of Science in Mechanical Engineering",
    type: "Bachelor's",
    duration: "5 years",
    units: 195,
    status: "Phased Out",
    dateAdded: "2023-06-20",
    description:
      "Focuses on design, analysis, manufacturing, and maintenance of mechanical systems. Program is currently being phased out.",
    yearLevels: {
      "1st Year": ["ME101", "ME102", "GE001", "GE002", "PE001", "NSTP1"],
      "2nd Year": ["ME201", "ME202", "ME203", "GE003", "GE004", "PE002", "NSTP2"],
      "3rd Year": ["ME301", "ME302", "ME303", "ME304", "GE005"],
      "4th Year": ["ME401", "ME402", "ME403", "PE003"],
      "5th Year": ["ME501", "ME502", "ME503"],
    },
  },
];

export const SUBJECTS = [
  // ── BSIT ──────────────────────────────────────────────────
  {
    id: 1, code: "IT101", title: "Introduction to Computing", units: 3,
    semester: "1st Semester", term: "Semester", program: "BSIT",
    prereqs: "None", coreqs: "None",
    description: "Fundamentals of computing, hardware, software, and basic programming concepts.",
    dateAdded: "2024-01-10",
  },
  {
    id: 2, code: "IT102", title: "Computer Programming 1", units: 3,
    semester: "1st Semester", term: "Semester", program: "BSIT",
    prereqs: "None", coreqs: "IT101",
    description: "Introduction to programming using a high-level language. Covers algorithms, flowcharts, and basic programming constructs.",
    dateAdded: "2024-01-10",
  },
  {
    id: 3, code: "IT103", title: "Computer Programming 2", units: 3,
    semester: "2nd Semester", term: "Semester", program: "BSIT",
    prereqs: "IT102", coreqs: "None",
    description: "Object-oriented programming concepts including classes, inheritance, and polymorphism.",
    dateAdded: "2024-01-10",
  },
  {
    id: 4, code: "IT201", title: "Data Structures and Algorithms", units: 3,
    semester: "1st Semester", term: "Semester", program: "BSIT",
    prereqs: "IT103", coreqs: "None",
    description: "Study of fundamental data structures and algorithm design techniques for efficient problem solving.",
    dateAdded: "2024-01-15",
  },
  {
    id: 5, code: "IT202", title: "Database Management Systems", units: 3,
    semester: "2nd Semester", term: "Semester", program: "BSIT",
    prereqs: "IT201", coreqs: "None",
    description: "Relational database concepts, SQL, normalization, and database design principles.",
    dateAdded: "2024-01-15",
  },
  {
    id: 6, code: "IT203", title: "Web Development 1", units: 3,
    semester: "2nd Semester", term: "Semester", program: "BSIT",
    prereqs: "IT103", coreqs: "None",
    description: "HTML, CSS, and JavaScript fundamentals for building static and dynamic web pages.",
    dateAdded: "2024-01-20",
  },
  {
    id: 7, code: "IT301", title: "Systems Analysis and Design", units: 3,
    semester: "1st Semester", term: "Semester", program: "BSIT",
    prereqs: "IT202", coreqs: "None",
    description: "Methodologies for analyzing, designing, and implementing information systems in organizations.",
    dateAdded: "2024-02-01",
  },
  {
    id: 8, code: "IT302", title: "Network Administration", units: 3,
    semester: "1st Semester", term: "Both", program: "BSIT",
    prereqs: "IT201", coreqs: "None",
    description: "Fundamentals of computer networking, TCP/IP protocols, and network configuration and management.",
    dateAdded: "2024-02-01",
  },
  {
    id: 9, code: "IT401", title: "Capstone Project 1", units: 3,
    semester: "1st Semester", term: "Semester", program: "BSIT",
    prereqs: "IT301, IT302", coreqs: "IT402",
    description: "First phase of the undergraduate capstone research and development project.",
    dateAdded: "2024-02-10",
  },
  {
    id: 10, code: "IT402", title: "Capstone Project 2", units: 3,
    semester: "2nd Semester", term: "Semester", program: "BSIT",
    prereqs: "IT401", coreqs: "None",
    description: "Completion and final defense of the undergraduate capstone project.",
    dateAdded: "2024-02-10",
  },
  // ── BSCS ──────────────────────────────────────────────────
  {
    id: 11, code: "CS101", title: "Introduction to Computer Science", units: 3,
    semester: "1st Semester", term: "Semester", program: "BSCS",
    prereqs: "None", coreqs: "None",
    description: "Overview of computer science disciplines, career paths, and computing ethics.",
    dateAdded: "2024-01-12",
  },
  {
    id: 12, code: "CS201", title: "Discrete Mathematics", units: 3,
    semester: "1st Semester", term: "Semester", program: "BSCS",
    prereqs: "CS101", coreqs: "None",
    description: "Mathematical structures for CS: logic, sets, relations, graphs, and combinatorics.",
    dateAdded: "2024-01-18",
  },
  {
    id: 13, code: "CS301", title: "Design and Analysis of Algorithms", units: 3,
    semester: "1st Semester", term: "Semester", program: "BSCS",
    prereqs: "CS201", coreqs: "None",
    description: "Advanced algorithm design paradigms: divide-and-conquer, dynamic programming, greedy algorithms.",
    dateAdded: "2024-02-05",
  },
  {
    id: 14, code: "CS302", title: "Operating Systems", units: 3,
    semester: "2nd Semester", term: "Semester", program: "BSCS",
    prereqs: "CS301", coreqs: "None",
    description: "Process management, memory management, file systems, and OS design principles.",
    dateAdded: "2024-02-05",
  },
  {
    id: 15, code: "CS401", title: "Machine Learning", units: 3,
    semester: "1st Semester", term: "Both", program: "BSCS",
    prereqs: "CS301, CS201", coreqs: "None",
    description: "Supervised and unsupervised learning, neural networks, and practical ML implementation.",
    dateAdded: "2024-02-20",
  },
  // ── BSIS ──────────────────────────────────────────────────
  {
    id: 16, code: "IS101", title: "Business Process Management", units: 3,
    semester: "1st Semester", term: "Both", program: "BSIS",
    prereqs: "None", coreqs: "None",
    description: "Analysis and management of business workflows and enterprise process optimization.",
    dateAdded: "2024-02-01",
  },
  {
    id: 17, code: "IS201", title: "Enterprise Resource Planning", units: 3,
    semester: "2nd Semester", term: "Term", program: "BSIS",
    prereqs: "IS101", coreqs: "None",
    description: "Study of ERP systems including SAP and Oracle and their enterprise business applications.",
    dateAdded: "2024-02-20",
  },
  // ── DICT ──────────────────────────────────────────────────
  {
    id: 18, code: "DC101", title: "Computer Hardware Servicing", units: 3,
    semester: "1st Semester", term: "Semester", program: "DICT",
    prereqs: "None", coreqs: "None",
    description: "Hands-on training in PC assembly, troubleshooting, and hardware maintenance.",
    dateAdded: "2024-02-15",
  },
  {
    id: 19, code: "DC102", title: "Technical Support Fundamentals", units: 3,
    semester: "1st Semester", term: "Term", program: "DICT",
    prereqs: "None", coreqs: "DC101",
    description: "IT support skills, help desk operations, and technical customer service techniques.",
    dateAdded: "2024-02-15",
  },
  // ── GE ────────────────────────────────────────────────────
  {
    id: 20, code: "GE001", title: "Understanding the Self", units: 3,
    semester: "Both", term: "Both", program: "BSIT",
    prereqs: "None", coreqs: "None",
    description: "Exploration of identity from philosophical, psychological, and sociological perspectives.",
    dateAdded: "2024-01-05",
  },
  {
    id: 21, code: "GE002", title: "Purposive Communication", units: 3,
    semester: "Both", term: "Both", program: "BSIT",
    prereqs: "None", coreqs: "None",
    description: "Communication strategies, technical writing, and oral presentation skills for professionals.",
    dateAdded: "2024-01-05",
  },
];

// ── Dashboard Stats ─────────────────────────────────────────
export const STATS = {
  totalPrograms:      PROGRAMS.length,
  totalSubjects:      SUBJECTS.length,
  activePrograms:     PROGRAMS.filter((p) => p.status === "Active").length,
  inactivePrograms:   PROGRAMS.filter((p) => p.status !== "Active").length,
  subjectsWithPrereqs: SUBJECTS.filter((s) => s.prereqs !== "None").length,
  subjectsBySemester: {
    "1st Semester": SUBJECTS.filter((s) => s.semester === "1st Semester").length,
    "2nd Semester": SUBJECTS.filter((s) => s.semester === "2nd Semester").length,
    Both:           SUBJECTS.filter((s) => s.semester === "Both").length,
  },
  subjectsByTerm: {
    Semester: SUBJECTS.filter((s) => s.term === "Semester").length,
    Term:     SUBJECTS.filter((s) => s.term === "Term").length,
    Both:     SUBJECTS.filter((s) => s.term === "Both").length,
  },
};

// ── Chart data ───────────────────────────────────────────────
export const PROGRAM_DIST = [
  { name: "BSIT", value: 168, color: "#5eead4" },
  { name: "BSCS", value: 172, color: "#a78bfa" },
  { name: "BSIS", value: 165, color: "#f472b6" },
  { name: "DICT", value: 84,  color: "#fbbf24" },
];

export const RECENT_PROGRAMS = [...PROGRAMS]
  .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
  .slice(0, 5);

export const RECENT_SUBJECTS = [...SUBJECTS]
  .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
  .slice(0, 5);