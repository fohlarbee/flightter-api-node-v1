export const generateOTP = async () => {
  let otp;
  try {
    return (otp = `${Math.floor(100000 + Math.random() * 900000)}`);
  } catch (error) {
    if (error instanceof Error) return error.message;
  }
};
