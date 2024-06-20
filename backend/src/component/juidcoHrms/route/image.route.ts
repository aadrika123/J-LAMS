import express, {  Request, Response } from "express";
import { baseUrl } from "../../../util/common";
import DMSFileHandlerController from "../controller/image.controller";
import { multerForDms } from "../../../middleware/_multer";

class FileManagementRoutes {
  private dmsFileHandlerController: DMSFileHandlerController;

  constructor() {
    this.dmsFileHandlerController = new DMSFileHandlerController();
  }

  configure(app: express.Application): void {
    app
      .route(`${baseUrl}/dms/upload`)
      .post((req: Request, res: Response) => {
        multerForDms(req, res, () =>
          this.dmsFileHandlerController.upload(req, res, "0106")
        );
      }); //0106

    app
      .route(`${baseUrl}/dms/get`)
      .get((req: Request, res: Response) =>
        this.dmsFileHandlerController.getFile(req, res, "0106")
      ); //0106

    app
      .route(`${baseUrl}/dms/upload-gets`)
      .post((req: Request, res: Response) => {
        multerForDms(req, res, () => {
          this.dmsFileHandlerController.uploadAndGetUrl(req, res, "0106");
        });
      }); //0106
  }
}

export default FileManagementRoutes;
