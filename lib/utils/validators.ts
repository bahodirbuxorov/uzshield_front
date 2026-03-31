import { z } from 'zod'

/** Email + password login schema */
export const loginSchema = z.object({
  email: z.string().email({ message: 'Valid email required' }),
  password: z.string().min(6, { message: 'Min 6 characters' }),
})

export type LoginFormValues = z.infer<typeof loginSchema>

/** Step 1 of campaign wizard */
export const campaignStep1Schema = z.object({
  name: z.string().min(3, { message: 'Min 3 characters' }).max(100),
  channels: z.array(z.enum(['email', 'telegram', 'sms'])).min(1, 'Select at least one channel'),
  targetGroup: z.enum(['all', 'department', 'individual']),
  departments: z.array(z.string()).optional(),
  employeeIds: z.array(z.string()).optional(),
  scheduleType: z.enum(['immediately', 'scheduled']),
  scheduledAt: z.string().optional(),
})

/** Step 2 of campaign wizard */
export const campaignStep2Schema = z.object({
  templateId: z.string().min(1, 'Select a template'),
})

/** Full campaign form (merged) */
export const campaignFormSchema = campaignStep1Schema.merge(campaignStep2Schema)

export type CampaignStep1Values = z.infer<typeof campaignStep1Schema>
export type CampaignStep2Values = z.infer<typeof campaignStep2Schema>
export type CampaignFormValues = z.infer<typeof campaignFormSchema>
