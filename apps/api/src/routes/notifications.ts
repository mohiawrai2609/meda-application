import { Router } from 'express';
import { NotificationService } from '../services/notification.service';

const router = Router();
const notificationService = new NotificationService();

router.get('/', async (req, res) => {
    try {
        const notifications = await notificationService.getNotifications();
        const unreadCount = await notificationService.getUnreadCount();
        res.json({ notifications, unreadCount });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

router.post('/read-all', async (req, res) => {
    try {
        await notificationService.markAllAsRead();
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to mark notifications as read' });
    }
});

router.post('/:id/read', async (req, res) => {
    try {
        await notificationService.markAsRead(req.params.id);
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
});

export default router;
