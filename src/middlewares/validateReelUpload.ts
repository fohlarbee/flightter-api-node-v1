import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

const userSchema = z.object({
  title: z.string().max(200),
  caption: z.string().max(500),  
});

export function validateUploadreel(req: Request, res: Response, next: NextFunction) {
  try {
    const validatedData = userSchema.safeParse(req.body);

    if (!validatedData.success) {
      return res.status(400).json({
        status: false,
        data:validatedData.error
      });
    }

    // Attach validated data to the request object for further use
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}
