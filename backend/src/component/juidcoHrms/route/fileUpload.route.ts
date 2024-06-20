import express, { Request, Response } from "express";
import { baseUrl } from "../../../util/common";
import upload from "../../../middleware/imageUploadConfig";
import UploadImgServices from "../controller/uploadImg.services";

export default class FileUploadRoute {
  constructor(app: express.Application) {
    const uploadImg = new UploadImgServices();
    this.init(app, uploadImg);
  }
  init(app: express.Application, uploadImg: UploadImgServices): void {
    app
      .route(`${baseUrl}/file-upload`)
      .post(upload.array("file"), (req: Request, res: Response) =>
        uploadImg.imageUpload(req, res)
      );
  }
}