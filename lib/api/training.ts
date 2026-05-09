import api from '@/lib/api/axios'
import type { PaginatedResponse } from '@/lib/types/employee'

/** Training template from API */
export interface TrainingTemplate {
  id: number
  employee_id: number | null
  title: string
  content: string
  topics: string[]
  ai_generated: boolean
  created_at: string
  updated_at: string
}

/** Training assignment from API */
export interface TrainingAssignment {
  id: number
  employee_id: number
  training_template_id: number
  status: 'pending' | 'in_progress' | 'completed'
  score: number | null
  due_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
  template?: TrainingTemplate
}

/** Training statistics */
export interface TrainingStatistics {
  total_templates: number
  total_assignments: number
  completed_assignments: number
  pending_assignments: number
  avg_score: number | null
  completion_rate: number | null
}

/**
 * List training templates.
 * GET /api/training/templates
 */
export async function fetchTrainingTemplates(params?: {
  employee_id?: number
  ai_generated?: boolean
}): Promise<PaginatedResponse<TrainingTemplate>> {
  const res = await api.get<PaginatedResponse<TrainingTemplate>>('/api/training/templates', { params })
  return res.data
}

/**
 * Get a single training template.
 * GET /api/training/templates/{template}
 */
export async function fetchTrainingTemplateById(id: number): Promise<TrainingTemplate> {
  const res = await api.get<{ data: TrainingTemplate }>(`/api/training/templates/${id}`)
  return res.data.data
}

/**
 * Create a training template manually.
 * POST /api/training/templates
 */
export async function createTrainingTemplate(payload: {
  employee_id?: number
  title: string
  content: string
  topics?: string[]
}): Promise<TrainingTemplate> {
  const res = await api.post<{ data: TrainingTemplate }>('/api/training/templates', payload)
  return res.data.data
}

/**
 * Generate a personalised AI training template.
 * POST /api/training/templates/generate
 */
export async function generateTrainingTemplate(payload: {
  employee_id: number
  focus?: string
  assign?: boolean
  due_in_days?: number
}): Promise<TrainingTemplate> {
  const res = await api.post<{ data: TrainingTemplate }>('/api/training/templates/generate', payload)
  return res.data.data
}

/**
 * Update a training template.
 * PUT /api/training/templates/{template}
 */
export async function updateTrainingTemplate(
  id: number,
  payload: Partial<{ title: string; content: string; topics: string[] }>
): Promise<TrainingTemplate> {
  const res = await api.put<{ data: TrainingTemplate }>(`/api/training/templates/${id}`, payload)
  return res.data.data
}

/**
 * Delete a training template.
 * DELETE /api/training/templates/{template}
 */
export async function deleteTrainingTemplate(id: number): Promise<void> {
  await api.delete(`/api/training/templates/${id}`)
}

/**
 * List training assignments.
 * GET /api/training/assignments
 */
export async function fetchTrainingAssignments(params?: {
  employee_id?: number
  status?: string
}): Promise<PaginatedResponse<TrainingAssignment>> {
  const res = await api.get<PaginatedResponse<TrainingAssignment>>('/api/training/assignments', { params })
  return res.data
}

/**
 * Get a single training assignment.
 * GET /api/training/assignments/{assignment}
 */
export async function fetchTrainingAssignmentById(id: number): Promise<TrainingAssignment> {
  const res = await api.get<{ data: TrainingAssignment }>(`/api/training/assignments/${id}`)
  return res.data.data
}

/**
 * Create a training assignment.
 * POST /api/training/assignments
 */
export async function createTrainingAssignment(payload: {
  employee_id: number
  training_template_id: number
  due_at?: string
}): Promise<TrainingAssignment> {
  const res = await api.post<{ data: TrainingAssignment }>('/api/training/assignments', payload)
  return res.data.data
}

/**
 * Mark an assignment complete with a score.
 * PATCH /api/training/assignments/{assignment}/complete
 */
export async function completeTrainingAssignment(id: number, score: number): Promise<TrainingAssignment> {
  const res = await api.patch<{ data: TrainingAssignment }>(`/api/training/assignments/${id}/complete`, { score })
  return res.data.data
}

/**
 * Training statistics for the caller's tenant.
 * GET /api/training/statistics
 */
export async function fetchTrainingStatistics(company_id?: number): Promise<TrainingStatistics> {
  const res = await api.get<{ data: TrainingStatistics }>('/api/training/statistics', {
    params: company_id ? { company_id } : undefined,
  })
  return res.data.data
}

/**
 * Completed training assignments (results).
 * GET /api/training/results
 */
export async function fetchTrainingResults(): Promise<TrainingAssignment[]> {
  const res = await api.get<{ data: TrainingAssignment[] }>('/api/training/results')
  return res.data.data
}
