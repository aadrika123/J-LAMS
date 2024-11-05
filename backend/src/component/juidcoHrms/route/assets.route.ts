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

    // app
    //   .route(`${baseUrl}/assets/update-list`)
    //   .get(
    //     (req: Request, res: Response, next: NextFunction) =>
    //       this.assetManagementController.getAllUpdated(req, res, next, "0108"),
    // ); //0108

    app
      .route(`${baseUrl}/assets/field-officer-list`)
      .get(
        (req: Request, res: Response, next: NextFunction) =>
          this.assetManagementController.getAllFieldOfficer(req, res, next, "0109"),
    ); //0109

    app
      .route(`${baseUrl}/assets/checker-list`)
      .get(
        (req: Request, res: Response, next: NextFunction) =>
          this.assetManagementController.getAllCheckerData(req, res, next, "0110"),
    ); //0110

     app
      .route(`${baseUrl}/assets/auditlog-list`)
      .get(
        (req: Request, res: Response, next: NextFunction) =>
          this.assetManagementController.getAllAuditData(req, res, next, "0110"),
    ); //0110


    app
    .route(`${baseUrl}/asset/getcsvdata`)
    .get(
      (req: Request, res: Response, next: NextFunction) =>
        this.assetManagementController.getcsvdatall(req, res, next, "0111"),
    ); //0102


    app
    .route(`${baseUrl}/asset/marketcircle`)
    .get(
      (req: Request, res: Response, next: NextFunction) =>
        this.assetManagementController.marketcircle(req, res, next, "0112"),
    ); //0112

    app
    .route(`${baseUrl}/asset/locationadd`)
    .post(
      (req: Request, res: Response, next: NextFunction) =>
        this.assetManagementController.locationAdd(req, res, next, "0113"),
  ); //0113
  }
}

export default AssetManagementRoute;
