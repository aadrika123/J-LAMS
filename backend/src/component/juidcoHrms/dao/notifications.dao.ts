import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class NotificationsDao {
  async createNotification(assetId: string, status: number, role: string | null) {
    let message = "";

    // Generate message based on the status
    if (status === 0) {
      message = `Asset listed by ${role === "Municipal" ? "Municipal" : "Field Officer"} and is waiting for approval.`;
    } else if (status === 1) {
      message = "Asset approved by Field Officer.";
    } else if (status === -1) {
      message = "Asset rejected by Field Officer.";
    } else if (status === 2) {
      message = "Asset approved by Admin.";
    } else if (status === -2) {
      message = "Asset rejected by Admin.";
    } else if (status === 3) {
      message = "Asset sent back by Field Officer.";
    }

    // Save notification in the database
    return await prisma.notifications.create({
      data: {
        asset_id: assetId,
        message: message,
        status: status,
        role: role,
        created_at: new Date(),
      },
    });
  }

  async getAllNotifications() {
    // Fetch all notifications
    return await prisma.notifications.findMany({
      orderBy: { created_at: 'desc' }, // Order by newest first
    });
  }

  async getNotificationsByStatus(statusArray: number[]) {
    // Fetch notifications filtered by status
    return await prisma.notifications.findMany({
      where: { status: { in: statusArray } },
      orderBy: { created_at: 'desc' }, // Order by newest first
    });
  }

  async getNotificationById(id: number) {
    // Fetch a single notification by ID
    return await prisma.notifications.findUnique({
      where: { id },
    });
  }
}

export default NotificationsDao;
