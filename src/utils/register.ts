import { prisma } from "#/lib/prismaConnect"
import { genSalt } from "bcryptjs";
import hashData from "./hashData";


enum verificationTypeEnum {
    GOOGLE = "GOOGLE",
    FACEBOOK= "FACEBOOK",
    FLIGHTTER = "FLIGHTTER",
  }

const register = async(email:string,
     userName: string, 
     authProvider:string,
     password?:string, 

    ) => {

        const userExists = await prisma.user.findUnique({ where: { email } });

        if (userExists) throw new Error('Email already registered');
      
        let hashedPassword;

        if (password === null || undefined) {
            const haveEmailRecords = await prisma.otp.findMany({where:{email}, orderBy:{createdAt:'desc'} });

            const emailRecord = haveEmailRecords[0]
            
            if (!emailRecord || emailRecord.isVerified === false) 
                    throw new Error('User not verified');
            
            const passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/
             
            if( !passwordCheck.test(password!))
                   throw new Error('Password must contain at least 8 characters, including uppercase letters, lowercase letters, numbers, and special characters.');

    
         }
         
          hashedPassword = await hashData(password!, 10);

          const verificationType = verificationTypeEnum[authProvider as keyof typeof verificationTypeEnum];

          let userDocs = {
            email,
            userName,
            verificationType,
            isVerified: true,
            password: null
          };
        
          if (hashedPassword) userDocs.password = hashedPassword;
        console.log(userDocs)
          const user = await prisma.user.create({ data: userDocs });
        
          await prisma.otp.deleteMany({ where: { email } });
        
          return user;
        




    // if(authProvider && authProvider === 'GOOGLE' || 'FACEBOOK'){

    //     const userExists = await prisma.user.findUnique({where:{email} });

    //     if (userExists) 
    //         throw new Error('Email already registered');
    //     const verificationType = verificationTypeEnum[authProvider as keyof typeof verificationTypeEnum];
    //     // console.log(verificationType)

    //     let userDocs = ({
    //         email,
    //         userName,
    //         // password:hashedPassword,
    //         verificationType,
    //         isVerified:true

    //     });
    //     const user = await prisma.user.create({data:userDocs});


    //     await prisma.otp.deleteMany({ where:{email }});

    //     return user;

        
    // }else{

    //  const haveEmailRecords = await prisma.otp.findMany({where:{email}, orderBy:{createdAt:'desc'} });

    // const emailRecord = haveEmailRecords[0]

   
    // if (!emailRecord || emailRecord.isVerified === false) 
    //         throw new Error('User not verified');

 
    // const userExists = await prisma.user.findUnique({where:{email} });

    // if (userExists) 
    //     throw new Error('Email already registered');

    //     const passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/
    //    if( !passwordCheck.test(password))
    //         throw new Error('Password must contain at least 8 characters, including uppercase letters, lowercase letters, numbers, and special characters.');



    //     const salt = await genSalt();
    //     const hashedPassword = await hashData(password, 10);

        
    //     const verificationType = verificationTypeEnum[authProvider as keyof typeof verificationTypeEnum];
    //     console.log(verificationType)



    //     let userDocs = ({
    //         email,
    //         userName,
    //         password:hashedPassword,
    //         verificationType,
    //         isVerified:true

    //     });
    //     const user = await prisma.user.create({data:userDocs});


    //     await prisma.otp.deleteMany({ where:{email }});

    //     return user;

    // }
}


export default register