import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import createError from "http-errors";
import {
  generateFileUrlS3,
  passToExpressErrorHandler,
  randomFileName,
} from "../utils";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// const BUCKET_NAME = process.env.BUCKET_NAME;
// const BUCKET_REGION = process.env.BUCKET_REGION;
// const ACCESS_KEY = process.env.ACCESS_KEY as string;
// const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY as string;

// const credentials = {
//   accessKeyId: ACCESS_KEY,
//   secretAccessKey: SECRET_ACCESS_KEY,
// };

// const s3 = new S3Client({
//   region: BUCKET_REGION,
//   credentials,
// });

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new createError.Conflict("Email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });
    res.status(201).json(user);
  } catch (err) {
    passToExpressErrorHandler(err, next);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      throw new createError.NotFound("User not found!");
    }

    res.status(200).json(user);
  } catch (err) {
    passToExpressErrorHandler(err, next);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (err) {
    passToExpressErrorHandler(err, next);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, email, isAdmin } = req.body;
    // need to implement partial update
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        name: name,
        email: email,
        isAdmin: isAdmin,
      },
    });
    res.status(200).json(updatedUser);
  } catch (err) {
    passToExpressErrorHandler(err, next);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send("User deleted!");
  } catch (err) {
    passToExpressErrorHandler(err, next);
  }
};

// export const fileUpload = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     let filesUploaded: any = [];
//     const files = req.files as Express.Multer.File[];
//     for (const file of files) {
//       const params = {
//         Bucket: BUCKET_NAME,
//         Key: randomFileName(),
//         Body: file.buffer,
//         ContentType: file.mimetype,
//       };
//       const command = new PutObjectCommand(params);
//       await s3.send(command);
//       const fileUrl = generateFileUrlS3(
//         BUCKET_NAME as string,
//         BUCKET_REGION as string,
//         params.Key
//       );
//       const newFile = await prisma.file.create({ data: { url: fileUrl } });
//       filesUploaded.push(newFile);
//     }

//     res.status(201).json(filesUploaded);
//   } catch (err: any) {
//     console.error(err);
//     passToExpressErrorHandler(err, next);
//   }

//   res.send({});
// };
