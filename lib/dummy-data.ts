export type QuestionType =
  | "short_text"
  | "long_text"
  | "multiple_choice"
  | "checkbox"
  | "dropdown"
  | "date"
  | "rating"

export interface Question {
  id: string
  type: QuestionType
  title: string
  required: boolean
  options?: string[]
}

export interface Form {
  id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
  responseCount: number
  questions: Question[]
}

export const dummyForms: Form[] = [
  {
    id: "1",
    title: "RISTEK Datathon 2025 Registration",
    description:
      "Register for RISTEK's flagship data science competition — the biggest student-led Datathon in Indonesia. Open for undergraduate students from all universities.",
    createdAt: "2026-01-10",
    updatedAt: "2026-02-05",
    responseCount: 420,
    questions: [
      {
        id: "q1",
        type: "short_text",
        title: "Full Name",
        required: true,
      },
      {
        id: "q2",
        type: "short_text",
        title: "University / Institution",
        required: true,
      },
      {
        id: "q3",
        type: "dropdown",
        title: "Which track are you registering for?",
        required: true,
        options: [
          "Data Analytics",
          "Machine Learning",
          "Data Engineering",
          "MLOps",
        ],
      },
      {
        id: "q4",
        type: "multiple_choice",
        title: "How did you hear about RISTEK Datathon 2025?",
        required: false,
        options: [
          "Instagram / Social Media",
          "Friend / Colleague",
          "Fasilkom UI Website",
          "Email Newsletter",
        ],
      },
      {
        id: "q5",
        type: "checkbox",
        title:
          "Which tools/technologies are you comfortable with? (Select all that apply)",
        required: false,
        options: [
          "Python",
          "SQL",
          "TensorFlow / PyTorch",
          "Tableau / Power BI",
          "Spark / Hadoop",
        ],
      },
      {
        id: "q6",
        type: "long_text",
        title:
          "Briefly describe your motivation for joining RISTEK Datathon 2025.",
        required: true,
      },
    ],
  },
  {
    id: "2",
    title: "RISTEK Sisters in Tech 2025 — Mentee Application",
    description:
      "Apply to be a mentee in SISTECH 2025, the first student-powered women-only tech mentorship program in Indonesia. Open for female Indonesian citizens aged 17–25.",
    createdAt: "2026-01-20",
    updatedAt: "2026-02-15",
    responseCount: 67,
    questions: [
      {
        id: "q1",
        type: "short_text",
        title: "Full Name",
        required: true,
      },
      {
        id: "q2",
        type: "short_text",
        title: "Email Address",
        required: true,
      },
      {
        id: "q3",
        type: "dropdown",
        title: "Select your preferred career path",
        required: true,
        options: [
          "Product Management",
          "UI/UX Design",
          "Software Engineering",
          "Data Analytics",
          "Digital Marketing",
        ],
      },
      {
        id: "q4",
        type: "rating",
        title:
          "How would you rate your current knowledge in your chosen career path?",
        required: true,
      },
      {
        id: "q5",
        type: "checkbox",
        title: "What do you hope to gain from SISTECH? (Select all that apply)",
        required: false,
        options: [
          "Mentorship from industry professionals",
          "Networking opportunities",
          "Portfolio & project guidance",
          "Career direction & clarity",
          "Community support",
        ],
      },
      {
        id: "q6",
        type: "long_text",
        title:
          "Tell us about yourself and why you want to join RISTEK Sisters in Tech 2025.",
        required: true,
      },
      {
        id: "q7",
        type: "multiple_choice",
        title: "What is your current education level?",
        required: true,
        options: [
          "High School / Vocational",
          "Undergraduate (Year 1–2)",
          "Undergraduate (Year 3–4)",
          "Fresh Graduate",
        ],
      },
    ],
  },
]