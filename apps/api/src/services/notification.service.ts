import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class NotificationService {
    async createNotification(data: { title: string; message: string; type?: string }) {
        try {
            return await prisma.notification.create({
                data: {
                    title: data.title,
                    message: data.message,
                    type: data.type || 'INFO',
                }
            });
        } catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    }

    async getNotifications(limit = 10) {
        try {
            return await prisma.notification.findMany({
                orderBy: { createdAt: 'desc' },
                take: limit,
            });
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    }

    async markAsRead(id: string) {
        try {
            return await prisma.notification.update({
                where: { id },
                data: { read: true },
            });
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    }

    async markAllAsRead() {
        try {
            return await prisma.notification.updateMany({
                where: { read: false },
                data: { read: true },
            });
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw error;
        }
    }

    async getUnreadCount() {
        try {
            return await prisma.notification.count({
                where: { read: false },
            });
        } catch (error) {
            console.error('Error getting unread count:', error);
            throw error;
        }
    }
}
