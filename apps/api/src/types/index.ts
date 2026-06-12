export interface Employee {
  id: string
  name: string
  email: string
  department: string
  role: string
  status: 'Active' | 'Inactive' | 'On Leave'
  joiningDate: string
}

export interface Leave {
  id: string
  employeeId: string
  employee: string
  type: 'Annual Leave' | 'Sick Leave' | 'Maternity Leave' | 'Paternity Leave' | 'Unpaid Leave'
  from: string
  to: string
  status: 'Pending' | 'Approved' | 'Rejected'
  reason?: string
}

export interface PayrollRecord {
  id: string
  employeeId: string
  employee: string
  month: string
  gross: number
  deductions: number
  net: number          // always derived: gross - deductions
  status: 'Pending' | 'Processed' | 'Failed'
}

export interface Job {
  id: string
  title: string
  department: string
  applicants: number
  status: 'Open' | 'Closed' | 'Draft'
}

export interface DashboardStats {
  totalEmployees: number
  activeEmployees: number
  pendingLeaves: number
  openJobs: number
  totalPayrollThisMonth: number
}

export interface ApiError {
  message: string
  code?: string
}
