import express, { NextFunction, Request, Response } from "express";
import { baseUrl } from "../../../util/common";
import AssetManagementController from "../controller/assets.controller";
import UlbMasterController from "../controller/ulb.controller";
class AssetManagementRoute {
  private assetManagementController: AssetManagementController;
  private ulbmasterController: UlbMasterController;

  constructor() {
    this.assetManagementController = new AssetManagementController(); 
    this.ulbmasterController = new UlbMasterController(); 
  }

  configure(app: express.Application): void {
    app
      .route(`${baseUrl}/asset/create`)
      .post(
        (req: Request, res: Response, next: NextFunction) =>
          this.assetManagementController.create(req, res, next, "0101"),
      ); //0101

      app
      .route(`${baseUrl}/asset/get`)
      .get(
        (req: Request, res: Response, next: NextFunction) =>
          this.assetManagementController.getAll(req, res, next, "0102"),
      ); //0102

      app
      .route(`${baseUrl}/asset/get-single`)
      .get(
        (req: Request, res: Response, next: NextFunction) =>
          this.assetManagementController.getAllbyId(req, res, next, "0103"),
    ); //0103

      app
      .route(`${baseUrl}/asset/delete-single`)
      .post(
        (req: Request, res: Response, next: NextFunction) =>
          this.assetManagementController.deleteAllbyId(req, res, next, "0104"),
    ); //0104

     app
      .route(`${baseUrl}/asset/update-single`)
      .post(
        (req: Request, res: Response, next: NextFunction) =>
          this.assetManagementController.updatebyId(req, res, next, "0105"),
    ); //0105

    app
      .route(`${baseUrl}/dms/upload-get`)
      .post(
        (req: Request, res: Response, next: NextFunction) =>
          this.assetManagementController.updatebyId(req, res, next, "0106"),
    ); //0106

    app
      .route(`${baseUrl}/assets/ulb-get`)
      .get(
        (req: Request, res: Response, next: NextFunction) =>
          this.ulbmasterController.get(req, res, next, "0107"),
    ); //0107
  }

  
}

export default AssetManagementRoute;