import { compare } from "bcryptjs"


const compareHashData = async (unhashed: string, hashed: string) => {
    try {
        const isMatched = await compare(unhashed, hashed);
        return isMatched;


    } catch (error) {
        if (error instanceof Error)
            return ({ success: false, mssg: 'An error occured in compare hash function' })

    }


}

export default compareHashData;