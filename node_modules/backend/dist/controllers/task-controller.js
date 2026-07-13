import { prisma } from '../repositories/prisma.js';
export class TaskController {
    // GET /api/v1/tasks
    async list(req, res) {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
            });
        }
        try {
            const { status, priority, category, customerId } = req.query;
            const filter = {};
            const isManager = user.roles.includes('ADMIN') || user.roles.includes('BRANCH_MANAGER');
            if (!isManager) {
                filter.assignedRM = user.id;
            }
            if (status)
                filter.status = status;
            if (priority)
                filter.priority = priority;
            if (category)
                filter.category = category;
            if (customerId)
                filter.customerId = customerId;
            const tasks = await prisma.rMTask.findMany({
                where: filter,
                include: {
                    customer: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                            segment: true
                        }
                    }
                },
                orderBy: {
                    dueDate: 'asc'
                }
            });
            return res.status(200).json({
                success: true,
                data: tasks
            });
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                error: { code: 'INTERNAL_SERVER_ERROR', message: err.message || 'Failed to list tasks.' }
            });
        }
    }
    // GET /api/v1/tasks/:id
    async get(req, res) {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
            });
        }
        try {
            const { id } = req.params;
            const task = await prisma.rMTask.findUnique({
                where: { id },
                include: {
                    customer: true,
                    comments: {
                        include: {
                            author: {
                                select: { id: true, name: true, username: true }
                            }
                        },
                        orderBy: { createdAt: 'desc' }
                    },
                    reminders: true,
                    history: {
                        include: {
                            changedBy: {
                                select: { id: true, name: true }
                            }
                        },
                        orderBy: { createdAt: 'desc' }
                    },
                    attachments: {
                        include: {
                            uploadedBy: {
                                select: { id: true, name: true }
                            }
                        },
                        orderBy: { createdAt: 'desc' }
                    }
                }
            });
            if (!task) {
                return res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: 'Task not found.' }
                });
            }
            const isManager = user.roles.includes('ADMIN') || user.roles.includes('BRANCH_MANAGER');
            if (!isManager && task.assignedRM !== user.id) {
                return res.status(403).json({
                    success: false,
                    error: { code: 'FORBIDDEN', message: 'You do not have access to this task.' }
                });
            }
            return res.status(200).json({
                success: true,
                data: task
            });
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                error: { code: 'INTERNAL_SERVER_ERROR', message: err.message || 'Failed to get task details.' }
            });
        }
    }
    // POST /api/v1/tasks
    async create(req, res) {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
            });
        }
        try {
            const { customerId, title, description, priority, category, dueDate, estimatedDuration } = req.body;
            if (!customerId || !title || !priority || !category || !dueDate) {
                return res.status(400).json({
                    success: false,
                    error: { code: 'BAD_REQUEST', message: 'Missing required parameters.' }
                });
            }
            const customer = await prisma.customer.findUnique({
                where: { id: customerId }
            });
            if (!customer) {
                return res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: 'Customer not found.' }
                });
            }
            const task = await prisma.rMTask.create({
                data: {
                    customerId,
                    assignedRM: customer.rmId,
                    title,
                    description,
                    priority,
                    status: 'Pending',
                    category,
                    dueDate: new Date(dueDate),
                    estimatedDuration: estimatedDuration ? parseInt(estimatedDuration, 10) : undefined,
                    createdBy: user.name
                }
            });
            await prisma.taskHistory.create({
                data: {
                    taskId: task.id,
                    fieldName: 'status',
                    oldValue: null,
                    newValue: 'Pending',
                    changedById: user.id
                }
            });
            return res.status(201).json({
                success: true,
                data: task
            });
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                error: { code: 'INTERNAL_SERVER_ERROR', message: err.message || 'Failed to create task.' }
            });
        }
    }
    // PATCH /api/v1/tasks/:id
    async update(req, res) {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
            });
        }
        try {
            const { id } = req.params;
            const { title, description, priority, status, category, dueDate, estimatedDuration, actualDuration } = req.body;
            const existingTask = await prisma.rMTask.findUnique({
                where: { id }
            });
            if (!existingTask) {
                return res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: 'Task not found.' }
                });
            }
            const isManager = user.roles.includes('ADMIN') || user.roles.includes('BRANCH_MANAGER');
            if (!isManager && existingTask.assignedRM !== user.id) {
                return res.status(403).json({
                    success: false,
                    error: { code: 'FORBIDDEN', message: 'You do not have access to this task.' }
                });
            }
            const updateData = {};
            if (title !== undefined)
                updateData.title = title;
            if (description !== undefined)
                updateData.description = description;
            if (priority !== undefined)
                updateData.priority = priority;
            if (status !== undefined)
                updateData.status = status;
            if (category !== undefined)
                updateData.category = category;
            if (dueDate !== undefined)
                updateData.dueDate = new Date(dueDate);
            if (estimatedDuration !== undefined)
                updateData.estimatedDuration = parseInt(estimatedDuration, 10);
            if (actualDuration !== undefined)
                updateData.actualDuration = parseInt(actualDuration, 10);
            updateData.updatedBy = user.name;
            if (status === 'Completed' && existingTask.status !== 'Completed') {
                updateData.completedAt = new Date();
            }
            const task = await prisma.rMTask.update({
                where: { id },
                data: updateData
            });
            if (status !== undefined && status !== existingTask.status) {
                await prisma.taskHistory.create({
                    data: {
                        taskId: task.id,
                        fieldName: 'status',
                        oldValue: existingTask.status,
                        newValue: status,
                        changedById: user.id
                    }
                });
            }
            if (priority !== undefined && priority !== existingTask.priority) {
                await prisma.taskHistory.create({
                    data: {
                        taskId: task.id,
                        fieldName: 'priority',
                        oldValue: existingTask.priority,
                        newValue: priority,
                        changedById: user.id
                    }
                });
            }
            return res.status(200).json({
                success: true,
                data: task
            });
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                error: { code: 'INTERNAL_SERVER_ERROR', message: err.message || 'Failed to update task.' }
            });
        }
    }
    // DELETE /api/v1/tasks/:id
    async delete(req, res) {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
            });
        }
        try {
            const { id } = req.params;
            const existingTask = await prisma.rMTask.findUnique({
                where: { id }
            });
            if (!existingTask) {
                return res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: 'Task not found.' }
                });
            }
            const isManager = user.roles.includes('ADMIN') || user.roles.includes('BRANCH_MANAGER');
            if (!isManager) {
                return res.status(403).json({
                    success: false,
                    error: { code: 'FORBIDDEN', message: 'Only branch administrators can delete tasks.' }
                });
            }
            await prisma.rMTask.delete({
                where: { id }
            });
            return res.status(200).json({
                success: true,
                message: 'Task deleted successfully.'
            });
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                error: { code: 'INTERNAL_SERVER_ERROR', message: err.message || 'Failed to delete task.' }
            });
        }
    }
    // POST /api/v1/tasks/:id/comment
    async addComment(req, res) {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
            });
        }
        try {
            const { id } = req.params;
            const { comment } = req.body;
            if (!comment) {
                return res.status(400).json({
                    success: false,
                    error: { code: 'BAD_REQUEST', message: 'Comment content cannot be empty.' }
                });
            }
            const existingTask = await prisma.rMTask.findUnique({
                where: { id }
            });
            if (!existingTask) {
                return res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: 'Task not found.' }
                });
            }
            const taskComment = await prisma.taskComment.create({
                data: {
                    taskId: id,
                    comment,
                    authorId: user.id
                },
                include: {
                    author: {
                        select: { id: true, name: true, username: true }
                    }
                }
            });
            await prisma.taskHistory.create({
                data: {
                    taskId: id,
                    fieldName: 'comment',
                    oldValue: null,
                    newValue: 'Added a comment',
                    changedById: user.id
                }
            });
            return res.status(201).json({
                success: true,
                data: taskComment
            });
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                error: { code: 'INTERNAL_SERVER_ERROR', message: err.message || 'Failed to add comment.' }
            });
        }
    }
    // POST /api/v1/tasks/:id/complete
    async complete(req, res) {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
            });
        }
        try {
            const { id } = req.params;
            const { actualDuration, completionNotes } = req.body;
            const existingTask = await prisma.rMTask.findUnique({
                where: { id }
            });
            if (!existingTask) {
                return res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: 'Task not found.' }
                });
            }
            const isManager = user.roles.includes('ADMIN') || user.roles.includes('BRANCH_MANAGER');
            if (!isManager && existingTask.assignedRM !== user.id) {
                return res.status(403).json({
                    success: false,
                    error: { code: 'FORBIDDEN', message: 'You do not have access to this task.' }
                });
            }
            const task = await prisma.rMTask.update({
                where: { id },
                data: {
                    status: 'Completed',
                    completedAt: new Date(),
                    actualDuration: actualDuration ? parseInt(actualDuration, 10) : undefined,
                    updatedBy: user.name
                }
            });
            await prisma.taskHistory.create({
                data: {
                    taskId: id,
                    fieldName: 'status',
                    oldValue: existingTask.status,
                    newValue: 'Completed',
                    changedById: user.id
                }
            });
            if (completionNotes) {
                await prisma.taskComment.create({
                    data: {
                        taskId: id,
                        comment: `Completion Note: ${completionNotes}`,
                        authorId: user.id
                    }
                });
            }
            return res.status(200).json({
                success: true,
                data: task
            });
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                error: { code: 'INTERNAL_SERVER_ERROR', message: err.message || 'Failed to complete task.' }
            });
        }
    }
    // GET /api/v1/tasks/calendar
    async calendar(req, res) {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
            });
        }
        try {
            const filter = {};
            const isManager = user.roles.includes('ADMIN') || user.roles.includes('BRANCH_MANAGER');
            if (!isManager) {
                filter.assignedRM = user.id;
            }
            const tasks = await prisma.rMTask.findMany({
                where: filter,
                include: {
                    customer: {
                        select: { id: true, name: true }
                    }
                }
            });
            const now = new Date();
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
            const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            const endOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59, 999);
            const currentDay = now.getDay();
            const daysToSunday = currentDay === 0 ? 0 : 7 - currentDay;
            const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysToSunday, 23, 59, 59, 999);
            const startOfNextWeek = new Date(endOfWeek.getTime() + 1);
            const endOfNextWeek = new Date(startOfNextWeek.getTime() + 7 * 24 * 60 * 60 * 1000 - 1000);
            const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59, 999);
            const responseCalendar = {
                overdue: [],
                today: [],
                tomorrow: [],
                thisWeek: [],
                nextWeek: [],
                nextMonth: [],
                upcoming: []
            };
            tasks.forEach((task) => {
                const due = new Date(task.dueDate);
                const isClosed = task.status === 'Completed' || task.status === 'Cancelled';
                if (!isClosed && due < startOfToday) {
                    responseCalendar.overdue.push(task);
                }
                else if (due >= startOfToday && due <= endOfToday) {
                    responseCalendar.today.push(task);
                }
                else if (due >= startOfTomorrow && due <= endOfTomorrow) {
                    responseCalendar.tomorrow.push(task);
                }
                else if (due > endOfTomorrow && due <= endOfWeek) {
                    responseCalendar.thisWeek.push(task);
                }
                else if (due >= startOfNextWeek && due <= endOfNextWeek) {
                    responseCalendar.nextWeek.push(task);
                }
                else if (due >= startOfNextMonth && due <= endOfNextMonth) {
                    responseCalendar.nextMonth.push(task);
                }
                else {
                    responseCalendar.upcoming.push(task);
                }
            });
            return res.status(200).json({
                success: true,
                data: responseCalendar
            });
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                error: { code: 'INTERNAL_SERVER_ERROR', message: err.message || 'Failed to assemble task calendar.' }
            });
        }
    }
    // GET /api/v1/tasks/workload
    async workload(req, res) {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
            });
        }
        try {
            const isManager = user.roles.includes('ADMIN') || user.roles.includes('BRANCH_MANAGER');
            const filter = {};
            if (!isManager) {
                filter.assignedRM = user.id;
            }
            const tasks = await prisma.rMTask.findMany({
                where: filter,
                include: {
                    rm: {
                        select: { id: true, name: true }
                    }
                }
            });
            const totalCount = tasks.length;
            const pendingCount = tasks.filter(t => ['Pending', 'In Progress', 'Waiting Customer'].includes(t.status)).length;
            const completedCount = tasks.filter(t => t.status === 'Completed').length;
            const cancelledCount = tasks.filter(t => t.status === 'Cancelled').length;
            const now = new Date();
            const overdueCount = tasks.filter(t => {
                return !['Completed', 'Cancelled'].includes(t.status) && new Date(t.dueDate) < now;
            }).length;
            const tasksByCategory = {};
            tasks.forEach(t => {
                tasksByCategory[t.category] = (tasksByCategory[t.category] || 0) + 1;
            });
            const rmWorkloadMap = {};
            tasks.forEach(t => {
                const rmId = t.assignedRM;
                const name = t.rm?.name || 'Unknown RM';
                if (!rmWorkloadMap[rmId]) {
                    rmWorkloadMap[rmId] = { rmName: name, pending: 0, completed: 0, overdue: 0, total: 0 };
                }
                rmWorkloadMap[rmId].total += 1;
                if (t.status === 'Completed') {
                    rmWorkloadMap[rmId].completed += 1;
                }
                else if (!['Completed', 'Cancelled'].includes(t.status) && new Date(t.dueDate) < now) {
                    rmWorkloadMap[rmId].overdue += 1;
                    rmWorkloadMap[rmId].pending += 1;
                }
                else if (['Pending', 'In Progress', 'Waiting Customer'].includes(t.status)) {
                    rmWorkloadMap[rmId].pending += 1;
                }
            });
            const rmWorkloads = Object.values(rmWorkloadMap);
            const totalRMs = rmWorkloads.length || 1;
            const averageWorkload = totalCount / totalRMs;
            return res.status(200).json({
                success: true,
                data: {
                    totalTasks: totalCount,
                    pendingCount,
                    completedCount,
                    cancelledCount,
                    overdueCount,
                    pendingPercentage: totalCount ? (pendingCount / totalCount) * 100 : 0,
                    completedPercentage: totalCount ? (completedCount / totalCount) * 100 : 0,
                    overduePercentage: totalCount ? (overdueCount / totalCount) * 100 : 0,
                    averageWorkload,
                    tasksByCategory,
                    rmWorkload: rmWorkloads
                }
            });
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                error: { code: 'INTERNAL_SERVER_ERROR', message: err.message || 'Failed to retrieve workload metrics.' }
            });
        }
    }
    // GET /api/v1/tasks/analytics
    async analytics(req, res) {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
            });
        }
        try {
            const filter = {};
            const isManager = user.roles.includes('ADMIN') || user.roles.includes('BRANCH_MANAGER');
            if (!isManager) {
                filter.assignedRM = user.id;
            }
            const tasks = await prisma.rMTask.findMany({
                where: filter
            });
            const totalCount = tasks.length;
            const completedTasks = tasks.filter(t => t.status === 'Completed' && t.completedAt);
            const totalCompleted = completedTasks.length;
            let completedOnTime = 0;
            let totalDurationMs = 0;
            completedTasks.forEach(t => {
                const completed = new Date(t.completedAt);
                const due = new Date(t.dueDate);
                const created = new Date(t.createdAt);
                if (completed <= due) {
                    completedOnTime += 1;
                }
                totalDurationMs += (completed.getTime() - created.getTime());
            });
            const averageCompletionTimeHours = totalCompleted ? (totalDurationMs / (1000 * 60 * 60)) / totalCompleted : 0;
            const slaComplianceRate = totalCompleted ? (completedOnTime / totalCompleted) * 100 : 100;
            const now = new Date();
            const activeTasks = tasks.filter(t => !['Completed', 'Cancelled'].includes(t.status));
            const overdueTasks = activeTasks.filter(t => new Date(t.dueDate) < now);
            const overduePercentage = activeTasks.length ? (overdueTasks.length / activeTasks.length) * 100 : 0;
            const completionTrends = {};
            completedTasks.forEach(t => {
                const completedDate = new Date(t.completedAt);
                const monthName = completedDate.toLocaleString('en-US', { month: 'short', year: 'numeric' });
                completionTrends[monthName] = (completionTrends[monthName] || 0) + 1;
            });
            return res.status(200).json({
                success: true,
                data: {
                    totalTasks: totalCount,
                    totalCompleted,
                    completedOnTime,
                    averageCompletionTimeHours,
                    slaComplianceRate,
                    overdueActivePercentage: overduePercentage,
                    completionTrends
                }
            });
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                error: { code: 'INTERNAL_SERVER_ERROR', message: err.message || 'Failed to retrieve task SLA performance data.' }
            });
        }
    }
}
//# sourceMappingURL=task-controller.js.map