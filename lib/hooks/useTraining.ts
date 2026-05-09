import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchTrainingTemplates,
  fetchTrainingTemplateById,
  fetchTrainingAssignments,
  fetchTrainingAssignmentById,
  fetchTrainingStatistics,
  fetchTrainingResults,
  createTrainingTemplate,
  generateTrainingTemplate,
  updateTrainingTemplate,
  deleteTrainingTemplate,
  createTrainingAssignment,
  completeTrainingAssignment,
} from '@/lib/api/training'

export const trainingKeys = {
  all: ['training'] as const,
  templates: (params?: object) => [...trainingKeys.all, 'templates', params] as const,
  template: (id: number) => [...trainingKeys.all, 'template', id] as const,
  assignments: (params?: object) => [...trainingKeys.all, 'assignments', params] as const,
  assignment: (id: number) => [...trainingKeys.all, 'assignment', id] as const,
  statistics: (company_id?: number) => [...trainingKeys.all, 'statistics', company_id] as const,
  results: () => [...trainingKeys.all, 'results'] as const,
}

export function useTrainingTemplates(params?: { employee_id?: number; ai_generated?: boolean }) {
  return useQuery({
    queryKey: trainingKeys.templates(params),
    queryFn: () => fetchTrainingTemplates(params),
    placeholderData: (prev) => prev,
  })
}

export function useTrainingTemplate(id: number) {
  return useQuery({
    queryKey: trainingKeys.template(id),
    queryFn: () => fetchTrainingTemplateById(id),
    enabled: !!id,
  })
}

export function useTrainingAssignments(params?: { employee_id?: number; status?: string }) {
  return useQuery({
    queryKey: trainingKeys.assignments(params),
    queryFn: () => fetchTrainingAssignments(params),
    placeholderData: (prev) => prev,
  })
}

export function useTrainingAssignment(id: number) {
  return useQuery({
    queryKey: trainingKeys.assignment(id),
    queryFn: () => fetchTrainingAssignmentById(id),
    enabled: !!id,
  })
}

export function useTrainingStatistics(company_id?: number) {
  return useQuery({
    queryKey: trainingKeys.statistics(company_id),
    queryFn: () => fetchTrainingStatistics(company_id),
  })
}

export function useTrainingResults() {
  return useQuery({
    queryKey: trainingKeys.results(),
    queryFn: fetchTrainingResults,
  })
}

export function useCreateTrainingTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createTrainingTemplate,
    onSuccess: () => qc.invalidateQueries({ queryKey: trainingKeys.all }),
  })
}

export function useGenerateTrainingTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: generateTrainingTemplate,
    onSuccess: () => qc.invalidateQueries({ queryKey: trainingKeys.all }),
  })
}

export function useUpdateTrainingTemplate(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Parameters<typeof updateTrainingTemplate>[1]) =>
      updateTrainingTemplate(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: trainingKeys.all }),
  })
}

export function useDeleteTrainingTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteTrainingTemplate,
    onSuccess: () => qc.invalidateQueries({ queryKey: trainingKeys.all }),
  })
}

export function useCreateTrainingAssignment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createTrainingAssignment,
    onSuccess: () => qc.invalidateQueries({ queryKey: trainingKeys.all }),
  })
}

export function useCompleteTrainingAssignment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, score }: { id: number; score: number }) =>
      completeTrainingAssignment(id, score),
    onSuccess: () => qc.invalidateQueries({ queryKey: trainingKeys.all }),
  })
}
