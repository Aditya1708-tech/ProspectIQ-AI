import { Response } from 'express';
import { CustomerService } from '../services/analytics/customer-service.js';
import { ImportService } from '../services/analytics/import-service.js';
import { AIClient } from '../services/ai/ai-client.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { customerQuerySchema } from 'shared';
import { prisma } from '../repositories/prisma.js';

export class CustomerController {
  private customerService = new CustomerService();
  private importService = new ImportService();
  private aiClient = new AIClient();

  async list(req: AuthenticatedRequest, res: Response) {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      });
    }

    try {
      // Validate and parse query parameters
      const parsedQuery = customerQuerySchema.parse(req.query);

      const result = await this.customerService.listCustomers(parsedQuery, user.id, user.roles);
      return res.status(200).json({
        success: true,
        data: result,
        meta: {
          timestamp: new Date().toISOString()
        }
      });
    } catch (err: any) {
      if (err.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid query parameters',
            details: err.errors
          }
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to retrieve customers: ${err.message}`
        }
      });
    }
  }

  async detail(req: AuthenticatedRequest, res: Response) {
    const user = req.user;
    const { id } = req.params;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      });
    }

    try {
      const customer = await this.customerService.getCustomerById(id, user.id, user.roles);
      if (!customer) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Customer profile not found or access denied.'
          }
        });
      }

      return res.status(200).json({
        success: true,
        data: customer,
        meta: {
          timestamp: new Date().toISOString()
        }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to retrieve customer: ${err.message}`
        }
      });
    }
  }

  async profile(req: AuthenticatedRequest, res: Response) {
    const user = req.user;
    const { id } = req.params;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      });
    }

    try {
      const profile = await this.customerService.getCustomerProfile(id, user.id, user.roles);
      if (!profile) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Customer profile not found or access denied.'
          }
        });
      }

      return res.status(200).json({
        success: true,
        data: profile,
        meta: {
          timestamp: new Date().toISOString()
        }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to compile customer profile: ${err.message}`
        }
      });
    }
  }

  async transactions(req: AuthenticatedRequest, res: Response) {
    const user = req.user;
    const { id } = req.params;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      });
    }

    try {
      const transactions = await this.customerService.getCustomerTransactions(id, user.id, user.roles);
      return res.status(200).json({
        success: true,
        data: transactions,
        meta: {
          timestamp: new Date().toISOString()
        }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to retrieve transactions: ${err.message}`
        }
      });
    }
  }

  async rawInteractions(req: AuthenticatedRequest, res: Response) {
    const user = req.user;
    const { id } = req.params;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      });
    }

    try {
      const interactions = await this.customerService.getCustomerInteractions(id, user.id, user.roles);
      return res.status(200).json({
        success: true,
        data: interactions,
        meta: {
          timestamp: new Date().toISOString()
        }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to retrieve interactions: ${err.message}`
        }
      });
    }
  }

  async import(req: AuthenticatedRequest, res: Response) {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        error: { code: 'BAD_REQUEST', message: 'No file uploaded. Please upload a CSV or JSON file.' }
      });
    }

    let columnMapping: Record<string, string> = {};
    if (req.body.columnMapping) {
      try {
        columnMapping = typeof req.body.columnMapping === 'string'
          ? JSON.parse(req.body.columnMapping)
          : req.body.columnMapping;
      } catch {
        columnMapping = {};
      }
    }

    try {
      const summary = await this.importService.importFromBuffer(
        file.buffer,
        file.mimetype,
        columnMapping,
        user.id
      );

      return res.status(200).json({
        success: true,
        data: summary,
        meta: {
          timestamp: new Date().toISOString()
        }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: `File import failed: ${err.message}`
        }
      });
    }
  }

  async analyze(req: AuthenticatedRequest, res: Response) {
    const user = req.user;
    const { id } = req.params;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      });
    }

    try {
      const profile = await this.customerService.getCustomerProfile(id, user.id, user.roles);
      if (!profile) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Customer profile not found or access denied.'
          }
        });
      }

      const traceId = (req.headers['x-request-id'] || req.headers['x-correlation-id']) as string;
      const analysis = await this.aiClient.analyzeProfile(profile, traceId);

      // Deterministic Task Auto-generation (Sprint 11)
      if (analysis.nextBestActionIQ?.data?.primaryAction) {
        const primary = analysis.nextBestActionIQ.data.primaryAction;
        
        // Search for existing open task with the same title
        const existingOpenTask = await prisma.rMTask.findFirst({
          where: {
            customerId: profile.customer.id,
            title: primary.title,
            status: {
              in: ['Pending', 'In Progress', 'Waiting Customer']
            }
          }
        });

        if (!existingOpenTask) {
          let estDuration = 15;
          const match = primary.expectedDuration.match(/(\d+)/);
          if (match) {
            estDuration = parseInt(match[1], 10);
          }

          // Map action category
          let category = 'Follow-up';
          const titleLower = primary.title.toLowerCase();
          if (titleLower.includes('kyc') || titleLower.includes('document')) {
            category = 'KYC';
          } else if (titleLower.includes('meeting') || titleLower.includes('discussion')) {
            category = 'Meeting';
          } else if (titleLower.includes('dormancy') || titleLower.includes('reactivate')) {
            category = 'Dormancy';
          } else if (titleLower.includes('digital') || titleLower.includes('adoption')) {
            category = 'Digital Engagement';
          } else if (titleLower.includes('portfolio') || titleLower.includes('holding')) {
            category = 'Portfolio Review';
          } else if (titleLower.includes('compliance') || titleLower.includes('regulation')) {
            category = 'Compliance';
          } else if (titleLower.includes('relationship') || titleLower.includes('quarterly')) {
            category = 'Relationship';
          }

          const createdTask = await prisma.rMTask.create({
            data: {
              customerId: profile.customer.id,
              assignedRM: profile.customer.rmId,
              title: primary.title,
              description: primary.description,
              priority: primary.priority || 'MEDIUM',
              status: 'Pending',
              category,
              dueDate: new Date(primary.recommendedDueDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)),
              estimatedDuration: estDuration,
              createdBy: 'System (NBAIQ)'
            }
          });

          await prisma.taskHistory.create({
            data: {
              taskId: createdTask.id,
              fieldName: 'status',
              oldValue: null,
              newValue: 'Pending',
              changedById: user.id
            }
          });
        }
      }

      return res.status(200).json({
        success: true,
        data: analysis,
        meta: {
          timestamp: new Date().toISOString()
        }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: `AI Analysis failed: ${err.message}`
        }
      });
    }
  }

  async findna(req: AuthenticatedRequest, res: Response) {
    const user = req.user;
    const { id } = req.params;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      });
    }

    try {
      const profile = await this.customerService.getCustomerProfile(id, user.id, user.roles);
      if (!profile) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Customer profile not found or access denied.'
          }
        });
      }

      const traceId = (req.headers['x-request-id'] || req.headers['x-correlation-id']) as string;
      const analysis = await this.aiClient.analyzeProfile(profile, traceId);

      return res.status(200).json({
        success: true,
        data: analysis.financialDNA,
        meta: {
          timestamp: new Date().toISOString()
        }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: `Financial DNA generation failed: ${err.message}`
        }
      });
    }
  }

  async priority(req: AuthenticatedRequest, res: Response) {
    const user = req.user;
    const { id } = req.params;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      });
    }

    try {
      const profile = await this.customerService.getCustomerProfile(id, user.id, user.roles);
      if (!profile) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Customer profile not found or access denied.'
          }
        });
      }

      const traceId = (req.headers['x-request-id'] || req.headers['x-correlation-id']) as string;
      const analysis = await this.aiClient.analyzeProfile(profile, traceId);

      return res.status(200).json({
        success: true,
        data: analysis.priorityIQ,
        meta: {
          timestamp: new Date().toISOString()
        }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: `PriorityIQ calculation failed: ${err.message}`
        }
      });
    }
  }

  async copilot(req: AuthenticatedRequest, res: Response) {
    const user = req.user;
    const { id } = req.params;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      });
    }

    try {
      const profile = await this.customerService.getCustomerProfile(id, user.id, user.roles);
      if (!profile) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Customer profile not found or access denied.'
          }
        });
      }

      const traceId = (req.headers['x-request-id'] || req.headers['x-correlation-id']) as string;
      const analysis = await this.aiClient.analyzeProfile(profile, traceId);

      return res.status(200).json({
        success: true,
        data: analysis.copilot,
        meta: {
          timestamp: new Date().toISOString()
        }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: `RM Co-Pilot briefing failed: ${err.message}`
        }
      });
    }
  }

  private async getProfileAndAnalyze(req: AuthenticatedRequest, res: Response) {
    const user = req.user;
    const { id } = req.params;

    if (!user) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      });
      return null;
    }

    const profile = await this.customerService.getCustomerProfile(id, user.id, user.roles);
    if (!profile) {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Customer profile not found or access denied.'
        }
      });
      return null;
    }

    const traceId = (req.headers['x-request-id'] || req.headers['x-correlation-id']) as string;
    const analysis = await this.aiClient.analyzeProfile(profile, traceId);
    return analysis;
  }

  async explain(req: AuthenticatedRequest, res: Response) {
    try {
      const analysis = await this.getProfileAndAnalyze(req, res);
      if (!analysis) return;
      return res.status(200).json({
        success: true,
        data: analysis.explainIQ ? analysis.explainIQ.data : null,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
      });
    }
  }

  async audit(req: AuthenticatedRequest, res: Response) {
    try {
      const analysis = await this.getProfileAndAnalyze(req, res);
      if (!analysis) return;
      return res.status(200).json({
        success: true,
        data: analysis.explainIQ ? analysis.explainIQ.data.auditRecord : null,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
      });
    }
  }

  async timeline(req: AuthenticatedRequest, res: Response) {
    try {
      const analysis = await this.getProfileAndAnalyze(req, res);
      if (!analysis) return;
      return res.status(200).json({
        success: true,
        data: analysis.explainIQ ? analysis.explainIQ.data.reasoningTimeline : [],
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
      });
    }
  }

  async evidence(req: AuthenticatedRequest, res: Response) {
    try {
      const analysis = await this.getProfileAndAnalyze(req, res);
      if (!analysis) return;
      return res.status(200).json({
        success: true,
        data: analysis.explainIQ ? analysis.explainIQ.data.evidenceMatrix : [],
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
      });
    }
  }

  async confidence(req: AuthenticatedRequest, res: Response) {
    try {
      const analysis = await this.getProfileAndAnalyze(req, res);
      if (!analysis) return;
      return res.status(200).json({
        success: true,
        data: analysis.explainIQ ? analysis.explainIQ.data.confidenceModel : null,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
      });
    }
  }

  async nextAction(req: AuthenticatedRequest, res: Response) {
    try {
      const analysis = await this.getProfileAndAnalyze(req, res);
      if (!analysis) return;
      return res.status(200).json({
        success: true,
        data: analysis.nextBestActionIQ ? analysis.nextBestActionIQ.data : null,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
      });
    }
  }

  async workflow(req: AuthenticatedRequest, res: Response) {
    try {
      const analysis = await this.getProfileAndAnalyze(req, res);
      if (!analysis) return;
      const data = analysis.nextBestActionIQ ? analysis.nextBestActionIQ.data : null;
      return res.status(200).json({
        success: true,
        data: data ? {
          primaryAction: data.primaryAction,
          secondaryAction: data.secondaryAction,
          optionalFollowUp: data.optionalFollowUp
        } : null,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
      });
    }
  }

  async checklist(req: AuthenticatedRequest, res: Response) {
    try {
      const analysis = await this.getProfileAndAnalyze(req, res);
      if (!analysis) return;
      const data = analysis.nextBestActionIQ ? analysis.nextBestActionIQ.data : null;
      return res.status(200).json({
        success: true,
        data: data ? {
          checklist: data.checklist,
          taskCard: data.taskCard
        } : null,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
      });
    }
  }

  async interactions(req: AuthenticatedRequest, res: Response) {
    try {
      const analysis = await this.getProfileAndAnalyze(req, res);
      if (!analysis) return;
      return res.status(200).json({
        success: true,
        data: analysis.relationshipIQ ? analysis.relationshipIQ.data.interactions : null,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
      });
    }
  }

  async schedule(req: AuthenticatedRequest, res: Response) {
    try {
      const analysis = await this.getProfileAndAnalyze(req, res);
      if (!analysis) return;
      const data = analysis.nextBestActionIQ ? analysis.nextBestActionIQ.data : null;
      return res.status(200).json({
        success: true,
        data: data ? {
          schedule: data.schedule,
          recommendedCompletionWindow: data.recommendedCompletionWindow
        } : null,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
      });
    }
  }

  async relationship(req: AuthenticatedRequest, res: Response) {
    try {
      const analysis = await this.getProfileAndAnalyze(req, res);
      if (!analysis) return;
      return res.status(200).json({
        success: true,
        data: analysis.relationshipIQ ? analysis.relationshipIQ.data : null,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
      });
    }
  }

  async journey(req: AuthenticatedRequest, res: Response) {
    try {
      const analysis = await this.getProfileAndAnalyze(req, res);
      if (!analysis) return;
      return res.status(200).json({
        success: true,
        data: analysis.relationshipIQ ? analysis.relationshipIQ.data.journey : [],
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
      });
    }
  }

  async milestones(req: AuthenticatedRequest, res: Response) {
    try {
      const analysis = await this.getProfileAndAnalyze(req, res);
      if (!analysis) return;
      return res.status(200).json({
        success: true,
        data: analysis.relationshipIQ ? analysis.relationshipIQ.data.milestones : [],
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
      });
    }
  }

  async engagement(req: AuthenticatedRequest, res: Response) {
    try {
      const analysis = await this.getProfileAndAnalyze(req, res);
      if (!analysis) return;
      return res.status(200).json({
        success: true,
        data: analysis.relationshipIQ ? analysis.relationshipIQ.data.engagement : null,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
      });
    }
  }

  async relationshipHealth(req: AuthenticatedRequest, res: Response) {
    try {
      const analysis = await this.getProfileAndAnalyze(req, res);
      if (!analysis) return;
      return res.status(200).json({
        success: true,
        data: analysis.relationshipIQ ? analysis.relationshipIQ.data.health : null,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
      });
    }
  }

  async predict(req: AuthenticatedRequest, res: Response) {
    try {
      const analysis = await this.getProfileAndAnalyze(req, res);
      if (!analysis) return;
      return res.status(200).json({
        success: true,
        data: analysis.predictIQ ? analysis.predictIQ.data : null,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
      });
    }
  }

  async churn(req: AuthenticatedRequest, res: Response) {
    try {
      const analysis = await this.getProfileAndAnalyze(req, res);
      if (!analysis) return;
      return res.status(200).json({
        success: true,
        data: analysis.predictIQ ? analysis.predictIQ.data.churn : null,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
      });
    }
  }

  async forecast(req: AuthenticatedRequest, res: Response) {
    try {
      const analysis = await this.getProfileAndAnalyze(req, res);
      if (!analysis) return;
      return res.status(200).json({
        success: true,
        data: analysis.predictIQ ? analysis.predictIQ.data.relationship : null,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
      });
    }
  }

  async growth(req: AuthenticatedRequest, res: Response) {
    try {
      const analysis = await this.getProfileAndAnalyze(req, res);
      if (!analysis) return;
      return res.status(200).json({
        success: true,
        data: analysis.predictIQ ? analysis.predictIQ.data.growth : null,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
      });
    }
  }

  async earlyWarnings(req: AuthenticatedRequest, res: Response) {
    try {
      const analysis = await this.getProfileAndAnalyze(req, res);
      if (!analysis) return;
      return res.status(200).json({
        success: true,
        data: analysis.predictIQ ? analysis.predictIQ.data.earlyWarnings : [],
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
      });
    }
  }

  async predictionTimeline(req: AuthenticatedRequest, res: Response) {
    try {
      const analysis = await this.getProfileAndAnalyze(req, res);
      if (!analysis) return;
      return res.status(200).json({
        success: true,
        data: analysis.predictIQ ? analysis.predictIQ.data.timeline : [],
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
      });
    }
  }

  // Static memory simulation history
  private simulationHistoryLogs = new Map<string, any[]>();

  async simulate(req: AuthenticatedRequest, res: Response) {
    try {
      const user = req.user;
      const { id } = req.params;

      if (!user) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
        });
        return;
      }

      const profile = await this.customerService.getCustomerProfile(id, user.id, user.roles);
      if (!profile) {
        res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Customer profile not found or access denied.' }
        });
        return;
      }

      const scenario = req.body.scenario;
      if (!scenario) {
        res.status(400).json({
          success: false,
          error: { code: 'BAD_REQUEST', message: 'Scenario body adjustment parameters required.' }
        });
        return;
      }

      const traceId = (req.headers['x-request-id'] || req.headers['x-correlation-id']) as string;
      const projection = await this.aiClient.simulateProfile(profile, scenario, traceId);

      // Save to static log history
      const key = `${user.id}:${id}`;
      const logEntry = {
        scenarioName: scenario.scenarioName,
        description: scenario.description,
        timestamp: new Date().toISOString(),
        overallConfidence: projection.confidence,
        decisionCategory: projection.decision.category,
        metricsDiff: Object.entries(projection.projectedMetrics).reduce((acc, [k, v]) => {
          acc[k] = v.difference;
          return acc;
        }, {} as Record<string, number>)
      };

      const history = this.simulationHistoryLogs.get(key) || [];
      history.unshift(logEntry);
      this.simulationHistoryLogs.set(key, history);

      return res.status(200).json({
        success: true,
        data: projection,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
      });
    }
  }

  async getSimulationHistory(req: AuthenticatedRequest, res: Response) {
    try {
      const user = req.user;
      const { id } = req.params;

      if (!user) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
        });
        return;
      }

      const key = `${user.id}:${id}`;
      const history = this.simulationHistoryLogs.get(key) || [];
      
      return res.status(200).json({
        success: true,
        data: history,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
      });
    }
  }

  async getSimulationTemplates(req: AuthenticatedRequest, res: Response) {
    try {
      const templates = [
        {
          templateId: "boost_outreach",
          scenarioName: "Outreach & Engagement Boost",
          description: "Increase RM communication frequency and improve touchpoint responsiveness.",
          adjustments: {
            rmInteractionsChange: 50.0,
            kycEvent: null,
            savingsRatioChange: 0.0,
            digitalPaymentsChange: 15.0,
            salaryStabilityChange: 0.0,
            meetingCompletionChange: 20.0,
            followUpQualityChange: 25.0,
            engagementChange: 30.0,
            closePendingTasks: true
          }
        },
        {
          templateId: "kyc_recovery",
          scenarioName: "Compliance & KYC Recovery",
          description: "Perform pending KYC updates and resolve backlog compliance actions.",
          adjustments: {
            rmInteractionsChange: 20.0,
            kycEvent: true,
            savingsRatioChange: 0.0,
            digitalPaymentsChange: 0.0,
            salaryStabilityChange: 0.0,
            meetingCompletionChange: 10.0,
            followUpQualityChange: 10.0,
            engagementChange: 15.0,
            closePendingTasks: true
          }
        },
        {
          templateId: "savings_optimization",
          scenarioName: "Savings & Balance Growth",
          description: "Increase customer balance growth rate and prioritize savings turnover.",
          adjustments: {
            rmInteractionsChange: 10.0,
            kycEvent: null,
            savingsRatioChange: 40.0,
            digitalPaymentsChange: 20.0,
            salaryStabilityChange: 10.0,
            meetingCompletionChange: 15.0,
            followUpQualityChange: 15.0,
            engagementChange: 20.0,
            closePendingTasks: null
          }
        },
        {
          templateId: "dormancy_reversal",
          scenarioName: "Dormancy Reversal & Support",
          description: "Reactively engage high-risk dormant customer through priority check-ins.",
          adjustments: {
            rmInteractionsChange: 80.0,
            kycEvent: true,
            savingsRatioChange: 15.0,
            digitalPaymentsChange: 30.0,
            salaryStabilityChange: 0.0,
            meetingCompletionChange: 50.0,
            followUpQualityChange: 30.0,
            engagementChange: 60.0,
            closePendingTasks: true
          }
        }
      ];

      return res.status(200).json({
        success: true,
        data: templates,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
      });
    }
  }
}


