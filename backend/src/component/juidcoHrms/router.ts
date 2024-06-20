import express from "express";

import AssetManagementRoute from "./route/assets.route";
// import FileUploadRoute from "./route/fileUpload.route";
import FileManagementRoutes from "./route/image.route";

class AssetsRoute {
 
  private assetManagementRoute: AssetManagementRoute;
  private fileManagementRoutes: FileManagementRoutes;
  
  constructor(app: express.Application) {
    this.assetManagementRoute = new AssetManagementRoute();
    this.assetManagementRoute.configure(app); // 01

     this.fileManagementRoutes = new FileManagementRoutes();
    this.fileManagementRoutes.configure(app); // 02

      // new FileUploadRoute(app);

  }
}

export default AssetsRoute;
