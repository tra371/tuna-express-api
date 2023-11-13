import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../../controllers/api.controllers";
import {
  apiUpdateUserValidator,
  apiFileUploadValidator,
} from "../../middlewares/validators/validator";
import multer from "multer";

const storage = multer.memoryStorage();
const fileSizeLimitInMB = 20;
const upload = multer({
  storage: storage,
  limits: { fileSize: fileSizeLimitInMB * 1024 },
});

const router = Router();

router.post("/create-user", createUser);
router.get("/user/:id?", getUser);
router.get("/users", getUsers);
router.put("/update-user/:id?", apiUpdateUserValidator, updateUser); // later need to implement partial update with patch
router.delete("/delete-user/:id?", deleteUser);
// router.post(
//   "/file-upload",
//   apiFileUploadValidator,
//   upload.array("images", 5),
//   fileUpload
// );

export default router;
