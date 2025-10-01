import z from 'zod';

export const CreateRecipeDtoType = z.object({
  title: z.string().min(1).max(50),
  description: z.string().min(1).max(500),
  image: z.string().optional().default(''),
  chef: z.string().optional().default(''),
  cook_time: z.string().optional().default('45 minutes'),
  prep_time: z.string().optional().default('20 minutes'),
  total_time: z.string().optional().default('65 minutes'),
  servings: z.number().int().positive().optional().default(4),
  difficulty: z.string().optional().default('Medium'),
  ingredients: z.array(z.string()).optional(),
  instructions: z.array(z.string()).optional(),
});

export const UpdateRecipeDtoType = z.object({
  title: z.string().min(1).max(50).optional(),
  description: z.string().min(1).max(500).optional(),
  image: z.string().optional(),
  chef: z.string().optional(),
  cook_time: z.string().optional(),
  prep_time: z.string().optional(),
  total_time: z.string().optional(),
  servings: z.number().int().positive().optional(),
  difficulty: z.string().optional(),
  ingredients: z.array(z.string()).optional(),
  instructions: z.array(z.string()).optional(),
});
