export interface Employee {
  id: string;
  name: string;
  email: string;
  rut: string;
  position: string;
  department: string;
  phone?: string;
  address?: string;
  hireDate: Date;
  salary: number;
  isActive: boolean;
}

export interface EmployeeFilter {
  department: string;
  position: string;
  isActive: boolean | null;
  searchTerm: string;
}

export interface EmployeeRepository {
  getAll(): Promise<Employee[]>;
  getById(id: string): Promise<Employee | null>;
  create(employee: Omit<Employee, 'id'>): Promise<Employee>;
  update(id: string, employee: Partial<Employee>): Promise<Employee>;
  delete(id: string): Promise<void>;
  getByDepartment(department: string): Promise<Employee[]>;
  search(term: string): Promise<Employee[]>;
}

export interface EmployeeService {
  getAllEmployees(): Promise<Employee[]>;
  getEmployeeById(id: string): Promise<Employee | null>;
  createEmployee(employee: Omit<Employee, 'id'>): Promise<Employee>;
  updateEmployee(id: string, employee: Partial<Employee>): Promise<Employee>;
  deleteEmployee(id: string): Promise<void>;
  getFilteredEmployees(filter: EmployeeFilter): Promise<Employee[]>;
  getDepartments(): string[];
  getPositions(): string[];
}