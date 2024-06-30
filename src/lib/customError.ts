
class CustomError extends Error{

    private status: boolean;

    constructor(mssg: string, status: boolean){
        super(mssg);
        this.status = status;
    }
}

export default CustomError;