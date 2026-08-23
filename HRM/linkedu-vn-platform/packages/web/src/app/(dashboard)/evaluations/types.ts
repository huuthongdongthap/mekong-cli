export interface Evaluation {
  id: string; evaluationType: string; totalScore: number | null
  maxScore: number | null; percentage: number | null; feedback: string | null
  evaluatedAt: string
  learner?: { fullName: string; id: string }
  evaluator?: { firstName: string; lastName: string }
  enrollment?: { program?: { name: string } }
}

export interface EvalResponse {
  items: Evaluation[]; total: number; page: number; limit: number; totalPages: number
}