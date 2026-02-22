export type QuestionType =
  | "short_text"
  | "long_text"
  | "multiple_choice"
  | "checkbox"
  | "dropdown"
  | "date"
  | "rating"

export interface QuestionOption {
  id: number
  label: string
  position: number
}

export interface Question {
  id: string
  type: QuestionType
  title: string
  required: boolean
  position: number
  options: QuestionOption[]
}

export interface FormSummary {
  id: string
  title: string
  description: string
  response_count: number
  created_at: string
  updated_at: string
}

export interface FormDetail {
  id: string
  user_id: string
  title: string
  description: string
  response_count: number
  questions: Question[]
  created_at: string
  updated_at: string
}

export interface CreateQuestionOption {
  label: string
  position: number
}

export interface CreateQuestion {
  type: QuestionType
  title: string
  required: boolean
  position: number
  options: CreateQuestionOption[]
}

export interface CreateFormPayload {
  title: string
  description: string
  questions: CreateQuestion[]
}

export interface UpdateFormPayload {
  title: string
  description: string
  questions: CreateQuestion[]
}

export interface SubmitFormAnswer {
  question_id: string
  answer: string
}

export interface SubmitFormPayload {
  answers: SubmitFormAnswer[]
}

export interface FormResponseAnswer {
  question_id: string
  question_title: string
  question_type: QuestionType
  answer: string
}

export interface FormResponse {
  id: string
  submitted_at: string
  answers: FormResponseAnswer[]
}
