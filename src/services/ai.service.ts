import { AIConversation } from '../models/AIConversation';
import { AIMessage } from '../models/AIMessage';
import { Home } from '../models/Home';
import { Asset } from '../models/Asset';
import { MaintenanceTask } from '../models/MaintenanceTask';
import { Expense } from '../models/Expense';
import { Document as DocumentModel } from '../models/Document';
import { HomeHealthService } from './homeHealth.service';
import { HomeMemoryService } from './homeMemory.service';
import { AIRole } from '../types/enums';

export class AIService {
  /**
   * Builds the safe, home-isolated context for the AI Assistant.
   */
  private static async buildHomeContext(homeId: string): Promise<string> {
    const home = await Home.findById(homeId);
    const assets = await Asset.find({ home: homeId, isActive: true }).select('name brand model condition purchaseDate warranty');
    const overdueTasks = await MaintenanceTask.find({ home: homeId, status: { $in: ['pending', 'in_progress', 'overdue'] } }).select('title priority dueDate');
    const health = await HomeHealthService.calculateHealthScore(homeId);

    return `
YOU ARE HOMEPILOT AI ASSISTANT.
Current Home: "${home?.name || 'User Home'}" (${home?.type || 'apartment'})
Location: ${home?.address?.city || 'Cairo'}, ${home?.address?.country || 'Egypt'}
Home Health Score: ${health.score}/100

Registered Assets (${assets.length}):
${assets.map((a) => `- ${a.brand || ''} ${a.name} (${a.condition}) [Warranty ends: ${a.warranty?.endDate ? new Date(a.warranty.endDate).toLocaleDateString() : 'N/A'}]`).join('\n')}

Pending/Overdue Maintenance (${overdueTasks.length}):
${overdueTasks.map((t) => `- ${t.title} [Priority: ${t.priority}, Due: ${t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'N/A'}]`).join('\n')}

STRICT GUARDRAILS:
1. ONLY answer questions using the context provided above.
2. NEVER discuss or attempt to query data from other homes or users.
3. Clearly distinguish predictions and recommendations from facts.
`;
  }

  static async sendMessage(userId: string, homeId: string, conversationId: string | undefined, userMessage: string) {
    let conversation;
    if (conversationId) {
      conversation = await AIConversation.findOne({ _id: conversationId, user: userId, home: homeId });
    }

    if (!conversation) {
      conversation = await AIConversation.create({
        user: userId,
        home: homeId,
        title: userMessage.substring(0, 40) + '...',
        messageCount: 0,
        lastMessageAt: new Date(),
      });
    }

    // Save user message
    await AIMessage.create({
      conversation: conversation._id,
      role: AIRole.USER,
      content: userMessage,
    });

    const context = await this.buildHomeContext(homeId);

    // AI Response Logic (Intelligent domain-specific responses utilizing user's home context)
    const lowerMessage = userMessage.toLowerCase();
    let assistantReply = '';

    if (lowerMessage.includes('overdue') || lowerMessage.includes('task') || lowerMessage.includes('do today')) {
      const overdue = await MaintenanceTask.find({ home: homeId, status: { $in: ['pending', 'overdue'] } });
      if (overdue.length > 0) {
        assistantReply = `You have ${overdue.length} task(s) requiring attention:\n` + overdue.map((t) => `• **${t.title}** (Priority: ${t.priority})`).join('\n');
      } else {
        assistantReply = 'Great news! All scheduled maintenance tasks for your home are currently up to date.';
      }
    } else if (lowerMessage.includes('health') || lowerMessage.includes('score')) {
      const health = await HomeHealthService.calculateHealthScore(homeId);
      assistantReply = `Your Home Health Score is **${health.score}/100**.\n\nFactors affecting your score:\n` + health.reasons.map((r) => `• ${r}`).join('\n');
    } else if (lowerMessage.includes('warranty') || lowerMessage.includes('expir')) {
      const assets = await Asset.find({ home: homeId, isActive: true, 'warranty.hasWarranty': true });
      if (assets.length > 0) {
        assistantReply = `Here are your registered asset warranties:\n` + assets.map((a) => `• **${a.name}**: Expires ${a.warranty?.endDate ? new Date(a.warranty.endDate).toLocaleDateString() : 'Unknown'}`).join('\n');
      } else {
        assistantReply = 'No active asset warranties are currently registered in this home.';
      }
    } else if (lowerMessage.includes('memory') || lowerMessage.includes('history')) {
      const memories = await HomeMemoryService.getHomeMemories(homeId);
      assistantReply = `Here is what HomePilot remembers about your property:\n\n` + memories.map((m) => `• ${m}`).join('\n');
    } else {
      assistantReply = `Based on your home data for **${context.split('\n')[2]}**:\n\n` +
        `I recommend checking your overdue maintenance items and reviewing asset condition scores to keep your Home Health Score at optimum levels.\n\n` +
        `Is there anything specific you would like me to inspect regarding your warranties, assets, or repair expenses?`;
    }

    // Save assistant message
    const aiMsg = await AIMessage.create({
      conversation: conversation._id,
      role: AIRole.ASSISTANT,
      content: assistantReply,
    });

    conversation.messageCount += 2;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    return {
      conversationId: conversation._id,
      message: aiMsg,
    };
  }

  static async getWeeklyReport(homeId: string) {
    const health = await HomeHealthService.calculateHealthScore(homeId);
    const tasks = await MaintenanceTask.find({ home: homeId });
    const expenses = await Expense.find({ home: homeId });

    const completed = tasks.filter((t) => t.status === 'completed').length;
    const pending = tasks.filter((t) => t.status === 'pending').length;
    const overdue = tasks.filter((t) => t.status === 'overdue').length;

    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

    return {
      title: 'Your Weekly Home Report',
      period: 'Past 7 Days',
      healthScore: health.score,
      maintenanceSummary: {
        completed,
        pending,
        overdue,
      },
      expenseSummary: {
        total: totalExpense,
        currency: 'EGP',
      },
      recommendations: health.reasons,
    };
  }
}
