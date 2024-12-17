import { Request, Response, NextFunction } from "express";
import NotificationsDao from "../dao/notifications.dao";

const notificationsDao = new NotificationsDao();

class NotificationsController {
  async getAll(req: Request, res: Response, next: NextFunction, routeCode: string) {
    try {
      const userType: string = req?.body?.auth?.user_type;

      // if (!userType) {
      //   return res.status(400).json({ success: false, message: "User type is required." });
      // }

      console.log("User Type:", userType);

      // Filter notifications based on user type
      let notifications;
      if (userType == "Municipal") {
        notifications = await notificationsDao.getAllNotifications();
      } else if (userType == "TC") {
        notifications = await notificationsDao.getNotificationsByStatus([0, 2, -2]);
      } else if (userType == "Admin") {
        notifications = await notificationsDao.getNotificationsByStatus([1]);
      } else {
        return res.status(400).json({ success: false, message: "Invalid user type." });
      }

      res.status(200).json({ success: true, message: "Notifications fetched successfully.", data: notifications });
    } catch (error) {
      console.error(`Error in route ${routeCode}:`, error);
      res.status(500).json({ success: false, message: "Error fetching notifications." });
    }
  }
  
  async getById(req: Request, res: Response, next: NextFunction, routeCode: string) {
    try {
      console.log(`Route Code: ${routeCode}`);
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ success: false, message: "Notification ID is required." });
      }

      const notification = await notificationsDao.getNotificationById(Number(id));
      if (!notification) {
        return res.status(404).json({ success: false, message: "Notification not found." });
      }

      res.status(200).json({ success: true, message: "Notification found successfully." , data: notification });
    } catch (error) {
      console.error(`Error in route ${routeCode}:`, error);
      res.status(500).json({ success: false, message: "Error fetching notification by ID." });
    }
  }
}

export default NotificationsController;
