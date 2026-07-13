import { CustomerRepository } from '../repositories/customer-repository.js';
export class CustomerService {
    customerRepo = new CustomerRepository();
    async getCustomerById(id, rmId, roles) {
        const isAdmin = roles.includes('ADMIN');
        return this.customerRepo.findById(id, rmId, isAdmin);
    }
    async getCustomerProfile(id, rmId, roles) {
        const isAdmin = roles.includes('ADMIN');
        return this.customerRepo.findProfileById(id, rmId, isAdmin);
    }
    async listCustomers(params, rmId, roles) {
        const isAdmin = roles.includes('ADMIN');
        const findAllParams = {
            ...params,
            rmId,
            isAdmin
        };
        return this.customerRepo.findAll(findAllParams);
    }
    async getCustomerTransactions(customerId, rmId, roles) {
        const isAdmin = roles.includes('ADMIN');
        return this.customerRepo.findTransactions(customerId, rmId, isAdmin);
    }
    async getCustomerInteractions(customerId, rmId, roles) {
        const isAdmin = roles.includes('ADMIN');
        return this.customerRepo.findInteractions(customerId, rmId, isAdmin);
    }
    async listAllCustomerProfiles(rmId, roles) {
        const isAdmin = roles.includes('ADMIN');
        return this.customerRepo.findAllProfiles(rmId, isAdmin);
    }
}
//# sourceMappingURL=customer-service.js.map