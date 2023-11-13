import { NextFunction } from "express";
import JWT, { JwtPayload } from "jsonwebtoken";
import crypto from "crypto";

export const generateJWT = (
  userId: number,
  email: string,
  tokenType: "access" | "refresh"
): string => {
  try {
    let secretVar: string;
    let expiresIn: string | undefined;
    switch (tokenType) {
      case "access":
        secretVar = "ACCESS_SECRET";
        expiresIn = "1d";
        break;
      case "refresh":
        secretVar = "REFRESH_SECRET";
        expiresIn = "1y";
        break;
    }

    const secret: string = process.env[secretVar] as string;
    const payload = { email };
    const options = {
      expiresIn,
      issuer: "tuna",
      audience: String(userId),
    };

    const token = JWT.sign(payload, secret, options);

    return token;
  } catch (err) {
    throw err;
  }
};

export const verifyRefreshToken = (refreshToken: string) => {
  const decoded = JWT.verify(
    refreshToken,
    process.env.REFRESH_SECRET as string as string
  );
  const { email, aud: userId } = decoded as JwtPayload;
  return { email, userId };
};

export const passToExpressErrorHandler = (err: any, next: NextFunction) => {
  if (!err.statusCode) {
    err.statusCode = 500;
    console.log(err.message);
    err.message = "Could not process the request, check inputs and try again!";
  }
  next(err);
};

export const randomFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

export const generateFileUrlS3 = (
  bucketName: string,
  bucketRegion: string,
  filename: string
) => {
  return `https://${bucketName}.s3-${bucketRegion}.amazonaws.com/${filename}`;
};
