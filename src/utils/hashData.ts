import { hash } from "bcryptjs";



async function hashData(data: string, saltRounds: number = 10): Promise<any> {
  try {
    if(!data) return;
    
    return await hash(data, saltRounds);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('An unexpected error occurred during hashing');
    }
  }
}

export default hashData;
