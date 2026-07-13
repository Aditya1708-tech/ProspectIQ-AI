import { CustomerRepository } from '../../repositories/customer-repository.js';
import { ImportSummary, ImportError } from 'shared';

export class ImportService {
  private customerRepo = new CustomerRepository();

  // Custom quotes-aware CSV parser
  private parseCSV(content: string): string[][] {
    const result: string[][] = [];
    let row: string[] = [];
    let cell = '';
    let inQuotes = false;

    for (let i = 0; i < content.length; i++) {
      const char = content[i];
      const nextChar = content[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          cell += '"';
          i++; // skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(cell.trim());
        cell = '';
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        row.push(cell.trim());
        cell = '';
        if (row.length > 0 && row.some(c => c !== '')) {
          result.push(row);
        }
        row = [];
        if (char === '\r' && nextChar === '\n') {
          i++; // skip newline
        }
      } else {
        cell += char;
      }
    }
    if (cell !== '' || row.length > 0) {
      row.push(cell.trim());
      if (row.some(c => c !== '')) {
        result.push(row);
      }
    }
    return result;
  }

  async importFromBuffer(
    buffer: Buffer,
    mimeType: string,
    columnMapping: Record<string, string> = {},
    rmId: string
  ): Promise<ImportSummary> {
    let rawRecords: any[] = [];
    const errors: ImportError[] = [];
    let total = 0;
    let imported = 0;
    let skipped = 0;
    let failed = 0;

    try {
      if (mimeType.includes('json')) {
        const jsonContent = buffer.toString('utf-8');
        rawRecords = JSON.parse(jsonContent);
        if (!Array.isArray(rawRecords)) {
          rawRecords = [rawRecords];
        }
      } else {
        // Assume CSV
        const csvContent = buffer.toString('utf-8');
        const rows = this.parseCSV(csvContent);

        if (rows.length < 2) {
          throw new Error('CSV file must contain a header row and at least one data row.');
        }

        const headers = rows[0];
        for (let r = 1; r < rows.length; r++) {
          const rowData = rows[r];
          const record: Record<string, any> = {};
          
          for (let c = 0; c < headers.length; c++) {
            const val = rowData[c];
            if (val !== undefined) {
              record[headers[c]] = val;
            }
          }
          rawRecords.push(record);
        }
      }
    } catch (e: any) {
      return {
        total: 0,
        imported: 0,
        skipped: 0,
        failed: 1,
        errors: [{ row: 0, error: `Failed to parse file content: ${e.message}` }]
      };
    }

    total = rawRecords.length;

    for (let index = 0; index < rawRecords.length; index++) {
      const rowNum = index + 1;
      const rawRec = rawRecords[index];
      const mappedRec: Record<string, any> = {};

      // Apply Column Mapping Layer
      // For each key in the raw record, check if it maps to an internal field
      for (const [key, val] of Object.entries(rawRec)) {
        const mappedKey = columnMapping[key] || this.normalizeKey(key);
        mappedRec[mappedKey] = val;
      }

      // Default mappings if some fields are missing but available in raw
      const name = mappedRec.name;
      const occupation = mappedRec.occupation;
      const incomeRange = mappedRec.incomeRange || '500,000 - 1,000,000';
      const riskCategory = mappedRec.riskCategory || 'MEDIUM';
      const segment = mappedRec.segment || 'RETAIL';
      const status = mappedRec.status || 'ACTIVE';
      const branchCode = mappedRec.branchCode || 'BR001';

      // Perform validation checks
      if (!name) {
        failed++;
        errors.push({ row: rowNum, column: 'name', error: 'Customer Name is required.' });
        continue;
      }

      if (!occupation) {
        failed++;
        errors.push({ row: rowNum, column: 'occupation', error: 'Occupation is required.' });
        continue;
      }

      const email = mappedRec.email ? String(mappedRec.email).trim() : null;
      const phone = mappedRec.phone ? String(mappedRec.phone).trim() : null;

      // Construct accounts nested data if accountNumber is present in import
      const accounts: any[] = [];
      const accountNumber = mappedRec.accountNumber;
      if (accountNumber) {
        const balanceVal = mappedRec.balance ? parseFloat(mappedRec.balance) : 0;
        if (isNaN(balanceVal)) {
          failed++;
          errors.push({ row: rowNum, column: 'balance', error: 'BankAccount balance must be a number.' });
          continue;
        }
        accounts.push({
          accountNumber,
          accountType: mappedRec.accountType || 'SAVINGS',
          balance: balanceVal,
          transactions: mappedRec.transactions || []
        });
      }

      // Check if productHoldings list exists in import record (JSON imports)
      let productHoldings = mappedRec.productHoldings || [];
      if (typeof productHoldings === 'string') {
        try {
          productHoldings = JSON.parse(productHoldings);
        } catch {
          productHoldings = [];
        }
      }

      // Check if interactions list exists
      let interactions = mappedRec.interactions || [];
      if (typeof interactions === 'string') {
        try {
          interactions = JSON.parse(interactions);
        } catch {
          interactions = [];
        }
      }

      // Address mapping
      const addresses: any[] = [];
      if (mappedRec.street || mappedRec.city) {
        addresses.push({
          type: mappedRec.addressType || 'RESIDENTIAL',
          street: mappedRec.street || '',
          city: mappedRec.city || '',
          state: mappedRec.state || '',
          postalCode: mappedRec.postalCode || '',
          country: mappedRec.country || 'India'
        });
      }

      try {
        await this.customerRepo.upsertImportRecord({
          id: mappedRec.id,
          name,
          email,
          phone,
          occupation,
          incomeRange,
          riskCategory,
          segment,
          status,
          rmId,
          branchCode,
          preferredContact: mappedRec.preferredContact || 'EMAIL',
          preferredLanguage: mappedRec.preferredLanguage || 'ENGLISH',
          addresses,
          accounts,
          productHoldings,
          interactions
        });
        imported++;
      } catch (err: any) {
        failed++;
        errors.push({ row: rowNum, error: `Database insertion failed: ${err.message}` });
      }
    }

    return {
      total,
      imported,
      skipped,
      failed,
      errors
    };
  }

  // Normalizes header keys (e.g. "Customer Email" -> "email")
  private normalizeKey(key: string): string {
    const norm = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (norm === 'customername' || norm === 'fullname' || norm === 'name') return 'name';
    if (norm === 'customeremail' || norm === 'emailaddress' || norm === 'email') return 'email';
    if (norm === 'customerphone' || norm === 'phonenumber' || norm === 'phone' || norm === 'mobile') return 'phone';
    if (norm === 'occupation' || norm === 'job') return 'occupation';
    if (norm === 'incomerange' || norm === 'income') return 'incomeRange';
    if (norm === 'riskcategory' || norm === 'risk') return 'riskCategory';
    if (norm === 'segment' || norm === 'customersegment') return 'segment';
    if (norm === 'status' || norm === 'customerstatus') return 'status';
    if (norm === 'branchcode' || norm === 'branch') return 'branchCode';
    if (norm === 'accountnumber' || norm === 'accnum') return 'accountNumber';
    if (norm === 'accounttype' || norm === 'acctype') return 'accountType';
    if (norm === 'balance' || norm === 'accbalance') return 'balance';
    if (norm === 'preferredcontact' || norm === 'contactpref') return 'preferredContact';
    if (norm === 'preferredlanguage' || norm === 'language') return 'preferredLanguage';
    return key;
  }
}
