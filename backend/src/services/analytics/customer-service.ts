import { CustomerRepository, FindAllParams } from '../../repositories/customer-repository.js';
import { PagedResponse, CustomerProfile, Transaction, Interaction, Customer } from 'shared';

export class CustomerService {
  private customerRepo = new CustomerRepository();

  async getCustomerById(id: string, rmId: string, roles: string[]): Promise<Customer | null> {
    const isAdmin = roles.includes('ADMIN');
    return this.customerRepo.findById(id, rmId, isAdmin);
  }

  async getCustomerProfile(id: string, rmId: string, roles: string[]): Promise<CustomerProfile | null> {
    const isAdmin = roles.includes('ADMIN');
    return this.customerRepo.findProfileById(id, rmId, isAdmin);
  }

  async listCustomers(params: {
    page: number;
    limit: number;
    sort: string;
    order: 'asc' | 'desc';
    search?: string;
    status?: string;
    segment?: string;
    riskCategory?: string;
  }, rmId: string, roles: string[]): Promise<PagedResponse<Customer>> {
    const isAdmin = roles.includes('ADMIN') || roles.includes('BRANCH_MANAGER') || roles.includes('REGIONAL_MANAGER');
    const findAllParams: FindAllParams = {
      ...params,
      rmId,
      isAdmin
    };
    return this.customerRepo.findAll(findAllParams);
  }

  async getCustomerTransactions(customerId: string, rmId: string, roles: string[]): Promise<Transaction[]> {
    const isAdmin = roles.includes('ADMIN') || roles.includes('BRANCH_MANAGER') || roles.includes('REGIONAL_MANAGER');
    return this.customerRepo.findTransactions(customerId, rmId, isAdmin);
  }

  async getCustomerInteractions(customerId: string, rmId: string, roles: string[]): Promise<Interaction[]> {
    const isAdmin = roles.includes('ADMIN') || roles.includes('BRANCH_MANAGER') || roles.includes('REGIONAL_MANAGER');
    return this.customerRepo.findInteractions(customerId, rmId, isAdmin);
  }

  async listAllCustomerProfiles(rmId: string, roles: string[]): Promise<CustomerProfile[]> {
    const isAdmin = roles.includes('ADMIN') || roles.includes('BRANCH_MANAGER') || roles.includes('REGIONAL_MANAGER');
    return this.customerRepo.findAllProfiles(rmId, isAdmin);
  }
}
