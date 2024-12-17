import express, { NextFunction, Request, Response } from "express";
import { baseUrl } from "../../../util/common";
import NotificationsController from "../controller/notifications.controller";

class NotificationsRoute {
  private notificationsController: NotificationsController;

  constructor() {
    this.notificationsController = new NotificationsController();
  }

  configure(app: express.Application): void {
    // Route to fetch all notifications
    app
      .route(`${baseUrl}/notifications/get`)
      .get(
        (req: Request, res: Response, next: NextFunction) =>
          this.notificationsController.getAll(req, res, next, "0201"),
      ); //0201

    // Route to fetch a single notification by ID
    app
      .route(`${baseUrl}/notifications/get-single`)
      .get(
        (req: Request, res: Response, next: NextFunction) =>
          this.notificationsController.getById(req, res, next, "0202"),
      ); //0202
  }
}

export default NotificationsRoute;
