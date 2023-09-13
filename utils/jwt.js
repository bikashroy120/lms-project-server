

export const sendToken = (user,statusCode,res)=>{

    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();


    // const accessTokenExpire = parseInt(process.env.)
} 