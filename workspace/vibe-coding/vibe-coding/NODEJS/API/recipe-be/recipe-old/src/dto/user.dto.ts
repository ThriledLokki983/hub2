import z from 'zod';

export const CreateUserDtoType = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  created_at: z.date(),
  updated_at: z.date(),
});

export const UpdateUserDtoType = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(50).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).max(100).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export const SignupUserDtoType = z.object({
  name: z.string().min(1).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export const LoginUserDtoType = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export type CreateUserDto = z.infer<typeof CreateUserDtoType>;
export type UpdateUserDto = z.infer<typeof UpdateUserDtoType>;
export type SignupUserDto = z.infer<typeof SignupUserDtoType>;
export type LoginUserDto = z.infer<typeof LoginUserDtoType>;
