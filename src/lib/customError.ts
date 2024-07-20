class CustomError extends Error {
  private status: boolean;
  private data: string | null;

  constructor(status: boolean, mssg: string, data: string | null) {
    super(mssg);
    this.status = status;
    this.data = data;
  }
}

export default CustomError;
