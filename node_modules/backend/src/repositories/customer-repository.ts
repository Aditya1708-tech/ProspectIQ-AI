import { prisma } from './prisma.js';
import { Customer, CustomerProfile, PaginationMeta, PagedResponse, Transaction, Interaction } from 'shared';

export interface FindAllParams {
  page: number;
  limit: number;
  sort: string;
  order: 'asc' | 'desc';
  search?: string;
  status?: string;
  segment?: string;
  riskCategory?: string;
  rmId: string;
  isAdmin: boolean;
}

export class CustomerRepository {
  async findById(id: string, rmId: string, isAdmin: boolean): Promise<Customer | null> {
    const where: any = {
      id,
      deletedAt: null
    };

    if (!isAdmin) {
      where.rmId = rmId;
    }

    const c = await prisma.customer.findFirst({
      where
    });

    if (!c) return null;

    return {
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      occupation: c.occupation,
      incomeRange: c.incomeRange,
      riskCategory: c.riskCategory,
      segment: c.segment,
      status: c.status as any,
      rmId: c.rmId,
      assignedAt: c.assignedAt.toISOString(),
      lastInteractionAt: c.lastInteractionAt?.toISOString() || null,
      preferredContact: c.preferredContact,
      preferredLanguage: c.preferredLanguage,
      branchCode: c.branchCode,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString()
    };
  }

  async findProfileById(id: string, rmId: string, isAdmin: boolean): Promise<any | null> {
    const where: any = {
      id,
      deletedAt: null
    };

    if (!isAdmin) {
      where.rmId = rmId;
    }

    const customer = await prisma.customer.findFirst({
      where,
      include: {
        rm: {
          select: {
            name: true,
            username: true
          }
        },
        addresses: true,
        accounts: {
          include: {
            transactions: {
              orderBy: { valueDate: 'desc' },
              take: 20
            }
          }
        },
        interactions: {
          orderBy: { interactionDate: 'desc' },
          take: 10
        },
        documents: true,
        productHoldings: true,
        tasks: {
          include: {
            history: true
          }
        }
      }
    });

    if (!customer) return null;

    // Aggregate summary information
    let totalBalance = 0;
    let totalAccounts = customer.accounts.length;
    const allTransactions: any[] = [];

    for (const acc of customer.accounts) {
      totalBalance += acc.balance;
      allTransactions.push(...acc.transactions);
    }

    // Sort aggregated transactions by date desc
    allTransactions.sort((a, b) => new Date(b.valueDate).getTime() - new Date(a.valueDate).getTime());

    const lastInteraction = customer.interactions[0] || null;

    return {
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        occupation: customer.occupation,
        incomeRange: customer.incomeRange,
        riskCategory: customer.riskCategory,
        segment: customer.segment,
        status: customer.status as any,
        rmId: customer.rmId,
        assignedAt: customer.assignedAt.toISOString(),
        lastInteractionAt: customer.lastInteractionAt?.toISOString() || null,
        preferredContact: customer.preferredContact,
        preferredLanguage: customer.preferredLanguage,
        branchCode: customer.branchCode,
        createdAt: customer.createdAt.toISOString(),
        updatedAt: customer.updatedAt.toISOString(),
        rm: customer.rm
      },
      addresses: customer.addresses.map(addr => ({
        ...addr,
        createdAt: addr.createdAt.toISOString(),
        updatedAt: addr.updatedAt.toISOString()
      })),
      accounts: customer.accounts.map(acc => ({
        id: acc.id,
        customerId: acc.customerId,
        accountNumber: acc.accountNumber,
        accountType: acc.accountType,
        balance: acc.balance,
        currency: acc.currency,
        createdAt: acc.createdAt.toISOString(),
        updatedAt: acc.updatedAt.toISOString()
      })),
      transactions: allTransactions.map(t => ({
        id: t.id,
        bankAccountId: t.bankAccountId,
        amount: t.amount,
        type: t.type as any,
        category: t.category,
        description: t.description,
        reference: t.reference,
        valueDate: t.valueDate.toISOString(),
        createdAt: t.createdAt.toISOString()
      })),
      interactions: customer.interactions.map(inter => ({
        id: inter.id,
        customerId: inter.customerId,
        rmId: inter.rmId,
        type: inter.type,
        summary: inter.summary,
        notes: inter.notes,
        interactionDate: inter.interactionDate.toISOString(),
        createdAt: inter.createdAt.toISOString()
      })),
      documents: customer.documents.map(doc => ({
        ...doc,
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString()
      })),
      productHoldings: customer.productHoldings.map(p => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString()
      })),
      tasks: customer.tasks.map(t => ({
        id: t.id,
        title: t.title,
        description: t.description,
        priority: t.priority,
        status: t.status,
        category: t.category,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
        dueDate: t.dueDate.toISOString(),
        completedAt: t.completedAt ? t.completedAt.toISOString() : null,
        estimatedDuration: t.estimatedDuration,
        actualDuration: t.actualDuration,
        history: t.history.map(h => ({
          id: h.id,
          fieldName: h.fieldName,
          oldValue: h.oldValue,
          newValue: h.newValue,
          createdAt: h.createdAt.toISOString()
        }))
      })),
      summary: {
        totalBalance,
        totalAccounts,
        lastInteraction: lastInteraction ? {
          id: lastInteraction.id,
          customerId: lastInteraction.customerId,
          rmId: lastInteraction.rmId,
          type: lastInteraction.type,
          summary: lastInteraction.summary,
          notes: lastInteraction.notes,
          interactionDate: lastInteraction.interactionDate.toISOString(),
          createdAt: lastInteraction.createdAt.toISOString()
        } : null
      }
    };
  }

  async findAll(params: FindAllParams): Promise<PagedResponse<any>> {
    const { page, limit, sort, order, search, status, segment, riskCategory, rmId, isAdmin } = params;
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null
    };

    if (!isAdmin) {
      where.rmId = rmId;
    }

    if (status) {
      where.status = status;
    }

    if (segment) {
      where.segment = segment;
    }

    if (riskCategory) {
      where.riskCategory = riskCategory;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { occupation: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Determine orderBy key
    const orderBy: any = {};
    if (sort === 'name' || sort === 'createdAt' || sort === 'status' || sort === 'segment' || sort === 'riskCategory') {
      orderBy[sort] = order;
    } else {
      orderBy.name = 'asc';
    }

    const [total, customers] = await Promise.all([
      prisma.customer.count({ where }),
      prisma.customer.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          rm: {
            select: {
              name: true,
              username: true
            }
          }
        }
      })
    ]);

    const formattedCustomers = customers.map(c => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      occupation: c.occupation,
      incomeRange: c.incomeRange,
      riskCategory: c.riskCategory,
      segment: c.segment,
      status: c.status as any,
      rmId: c.rmId,
      assignedAt: c.assignedAt.toISOString(),
      lastInteractionAt: c.lastInteractionAt?.toISOString() || null,
      preferredContact: c.preferredContact,
      preferredLanguage: c.preferredLanguage,
      branchCode: c.branchCode,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      rm: c.rm
    }));

    return {
      data: formattedCustomers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findTransactions(customerId: string, rmId: string, isAdmin: boolean): Promise<Transaction[]> {
    const customerWhere: any = { id: customerId, deletedAt: null };
    if (!isAdmin) {
      customerWhere.rmId = rmId;
    }

    const customer = await prisma.customer.findFirst({
      where: customerWhere,
      include: {
        accounts: {
          include: {
            transactions: {
              orderBy: { valueDate: 'desc' }
            }
          }
        }
      }
    });

    if (!customer) return [];

    const transactions: any[] = [];
    for (const acc of customer.accounts) {
      transactions.push(...acc.transactions);
    }

    // Sort all combined transactions by valueDate desc
    transactions.sort((a, b) => new Date(b.valueDate).getTime() - new Date(a.valueDate).getTime());

    return transactions.map(t => ({
      id: t.id,
      bankAccountId: t.bankAccountId,
      amount: t.amount,
      type: t.type as any,
      category: t.category,
      description: t.description,
      reference: t.reference,
      valueDate: t.valueDate.toISOString(),
      createdAt: t.createdAt.toISOString()
    }));
  }

  async findInteractions(customerId: string, rmId: string, isAdmin: boolean): Promise<Interaction[]> {
    const customerWhere: any = { id: customerId, deletedAt: null };
    if (!isAdmin) {
      customerWhere.rmId = rmId;
    }

    const customer = await prisma.customer.findFirst({
      where: customerWhere,
      include: {
        interactions: {
          orderBy: { interactionDate: 'desc' }
        }
      }
    });

    if (!customer) return [];

    return customer.interactions.map(inter => ({
      id: inter.id,
      customerId: inter.customerId,
      rmId: inter.rmId,
      type: inter.type,
      summary: inter.summary,
      notes: inter.notes,
      interactionDate: inter.interactionDate.toISOString(),
      createdAt: inter.createdAt.toISOString()
    }));
  }

  async upsertImportRecord(data: {
    id?: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    occupation: string;
    incomeRange: string;
    riskCategory: string;
    segment: string;
    status: string;
    rmId: string;
    branchCode: string;
    preferredContact?: string | null;
    preferredLanguage?: string | null;
    addresses?: any[];
    accounts?: any[];
    productHoldings?: any[];
    interactions?: any[];
  }) {
    // Check if customer already exists by email/phone or name + phone
    let customer = await prisma.customer.findFirst({
      where: {
        OR: [
          data.email ? { email: data.email } : undefined,
          data.phone ? { phone: data.phone } : undefined
        ].filter(Boolean) as any[]
      }
    });

    if (customer) {
      // Update existing record
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: {
          name: data.name,
          occupation: data.occupation,
          incomeRange: data.incomeRange,
          riskCategory: data.riskCategory,
          segment: data.segment,
          status: data.status,
          rmId: data.rmId,
          branchCode: data.branchCode,
          preferredContact: data.preferredContact,
          preferredLanguage: data.preferredLanguage
        }
      });
    } else {
      // Create new record
      customer = await prisma.customer.create({
        data: {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          occupation: data.occupation,
          incomeRange: data.incomeRange,
          riskCategory: data.riskCategory,
          segment: data.segment,
          status: data.status,
          rmId: data.rmId,
          branchCode: data.branchCode,
          preferredContact: data.preferredContact,
          preferredLanguage: data.preferredLanguage
        }
      });
    }

    // Manage nested relations upserts
    if (data.addresses) {
      for (const addr of data.addresses) {
        await prisma.customerAddress.create({
          data: {
            customerId: customer.id,
            type: addr.type || 'RESIDENTIAL',
            street: addr.street || '',
            city: addr.city || '',
            state: addr.state || '',
            postalCode: addr.postalCode || '',
            country: addr.country || ''
          }
        });
      }
    }

    if (data.accounts) {
      for (const acc of data.accounts) {
        const existingAcc = await prisma.bankAccount.findUnique({
          where: { accountNumber: acc.accountNumber }
        });

        if (existingAcc) {
          const updatedAcc = await prisma.bankAccount.update({
            where: { id: existingAcc.id },
            data: {
              balance: acc.balance,
              accountType: acc.accountType || 'SAVINGS'
            }
          });

          if (acc.transactions) {
            for (const t of acc.transactions) {
              await prisma.transaction.create({
                data: {
                  bankAccountId: updatedAcc.id,
                  amount: t.amount,
                  type: t.type,
                  category: t.category,
                  description: t.description,
                  reference: t.reference,
                  valueDate: t.valueDate ? new Date(t.valueDate) : new Date()
                }
              });
            }
          }
        } else {
          const createdAcc = await prisma.bankAccount.create({
            data: {
              customerId: customer.id,
              accountNumber: acc.accountNumber,
              accountType: acc.accountType || 'SAVINGS',
              balance: acc.balance
            }
          });

          if (acc.transactions) {
            for (const t of acc.transactions) {
              await prisma.transaction.create({
                data: {
                  bankAccountId: createdAcc.id,
                  amount: t.amount,
                  type: t.type,
                  category: t.category,
                  description: t.description,
                  reference: t.reference,
                  valueDate: t.valueDate ? new Date(t.valueDate) : new Date()
                }
              });
            }
          }
        }
      }
    }

    if (data.productHoldings) {
      for (const ph of data.productHoldings) {
        await prisma.productHolding.create({
          data: {
            customerId: customer.id,
            name: ph.name,
            status: ph.status || 'ACTIVE'
          }
        });
      }
    }

    if (data.interactions) {
      for (const inter of data.interactions) {
        const createdInter = await prisma.interaction.create({
          data: {
            customerId: customer.id,
            rmId: data.rmId,
            type: inter.type || 'CALL',
            summary: inter.summary || '',
            notes: inter.notes,
            interactionDate: inter.interactionDate ? new Date(inter.interactionDate) : new Date()
          }
        });

        // Sync last interaction date on customer
        await prisma.customer.update({
          where: { id: customer.id },
          data: { lastInteractionAt: createdInter.interactionDate }
        });
      }
    }

    return customer;
  }

  async findAllProfiles(rmId: string, isAdmin: boolean): Promise<CustomerProfile[]> {
    const where: any = { deletedAt: null };
    if (!isAdmin) {
      where.rmId = rmId;
    }
    const customers = await prisma.customer.findMany({
      where,
      include: {
        rm: { select: { name: true, username: true } },
        addresses: true,
        accounts: {
          include: {
            transactions: {
              orderBy: { valueDate: 'desc' },
              take: 20
            }
          }
        },
        interactions: {
          orderBy: { interactionDate: 'desc' },
          take: 10
        },
        documents: true,
        productHoldings: true
      }
    });

    return customers.map(customer => {
      let totalBalance = 0;
      let totalAccounts = customer.accounts.length;
      const allTransactions: any[] = [];

      for (const acc of customer.accounts) {
        totalBalance += acc.balance;
        allTransactions.push(...acc.transactions);
      }

      allTransactions.sort((a, b) => new Date(b.valueDate).getTime() - new Date(a.valueDate).getTime());

      const lastInteraction = customer.interactions[0] || null;

      return {
        customer: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          occupation: customer.occupation,
          incomeRange: customer.incomeRange,
          riskCategory: customer.riskCategory,
          segment: customer.segment,
          status: customer.status as any,
          rmId: customer.rmId,
          assignedAt: customer.assignedAt.toISOString(),
          lastInteractionAt: customer.lastInteractionAt?.toISOString() || null,
          preferredContact: customer.preferredContact,
          preferredLanguage: customer.preferredLanguage,
          branchCode: customer.branchCode,
          createdAt: customer.createdAt.toISOString(),
          updatedAt: customer.updatedAt.toISOString(),
          rm: customer.rm
        },
        addresses: customer.addresses.map(addr => ({
          id: addr.id,
          customerId: addr.customerId,
          type: addr.type,
          street: addr.street,
          city: addr.city,
          state: addr.state,
          postalCode: addr.postalCode,
          country: addr.country,
          createdAt: addr.createdAt.toISOString(),
          updatedAt: addr.updatedAt.toISOString()
        })),
        accounts: customer.accounts.map(acc => ({
          id: acc.id,
          customerId: acc.customerId,
          accountNumber: acc.accountNumber,
          accountType: acc.accountType,
          balance: acc.balance,
          currency: acc.currency,
          createdAt: acc.createdAt.toISOString(),
          updatedAt: acc.updatedAt.toISOString()
        })),
        transactions: allTransactions.map(t => ({
          id: t.id,
          bankAccountId: t.bankAccountId,
          amount: t.amount,
          type: t.type as any,
          category: t.category,
          description: t.description,
          reference: t.reference,
          valueDate: t.valueDate.toISOString(),
          createdAt: t.createdAt.toISOString()
        })),
        interactions: customer.interactions.map(inter => ({
          id: inter.id,
          customerId: inter.customerId,
          rmId: inter.rmId,
          type: inter.type as any,
          summary: inter.summary,
          notes: inter.notes,
          interactionDate: inter.interactionDate.toISOString(),
          createdAt: inter.createdAt.toISOString()
        })),
        documents: customer.documents.map(doc => ({
          id: doc.id,
          customerId: doc.customerId,
          name: doc.name,
          type: doc.type,
          url: doc.url,
          createdAt: doc.createdAt.toISOString(),
          updatedAt: doc.updatedAt.toISOString()
        })),
        productHoldings: customer.productHoldings.map(ph => ({
          id: ph.id,
          customerId: ph.customerId,
          name: ph.name,
          status: ph.status as any,
          createdAt: ph.createdAt.toISOString(),
          updatedAt: ph.updatedAt.toISOString()
        })),
        summary: {
          totalBalance,
          totalAccounts,
          lastInteraction: lastInteraction ? {
            id: lastInteraction.id,
            customerId: lastInteraction.customerId,
            rmId: lastInteraction.rmId,
            type: lastInteraction.type as any,
            summary: lastInteraction.summary,
            notes: lastInteraction.notes,
            interactionDate: lastInteraction.interactionDate.toISOString(),
            createdAt: lastInteraction.createdAt.toISOString()
          } : null
        }
      };
    });
  }
}
