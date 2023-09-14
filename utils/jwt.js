import dotenv from "dotenv"
// import { redis } from "./redis.js";
dotenv.config()

export const sendToken = (user, statusCode, res) => {

    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();

    // redis.set(user._id, JSON.stringify(user))

    const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || '300', 10)
    const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_RXPIRE || '1200', 10)




    const accesstokenOption = {
        expires: new Date(Date.now() + accessTokenExpire * 1000),
        maxAge: accessTokenExpire * 1000,
        httoOnly: true,
        sameSite: "lax"
    }

    const refreshtokenOption = {
        expires: new Date(Date.now() + refreshTokenExpire * 1000),
        maxAge: refreshTokenExpire * 1000,
        httoOnly: true,
        sameSite: "lax"
    }


    res.cookie("access_token", accessToken, accesstokenOption);
    res.cookie("refresh_token", refreshToken, refreshtokenOption);

    res.status(statusCode).json({
        sucess: true,
        user,
        accessToken
    })


} 