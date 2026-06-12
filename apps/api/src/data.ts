import type { Employee, Leave, PayrollRecord, Job } from './types/index.js'

export const employees: Employee[] = [
  { id: 'EMP-001', name: 'Aarav Sharma',  email: 'aarav@company.com',  department: 'Engineering', role: 'Frontend Developer',   status: 'Active',   joiningDate: '2024-04-12' },
  { id: 'EMP-002', name: 'Meera Iyer',    email: 'meera@company.com',  department: 'HR',          role: 'HR Manager',           status: 'Active',   joiningDate: '2023-11-01' },
  { id: 'EMP-003', name: 'Kabir Khan',    email: 'kabir@company.com',  department: 'Finance',     role: 'Payroll Specialist',   status: 'Active',   joiningDate: '2022-07-19' },
  { id: 'EMP-004', name: 'Priya Nair',    email: 'priya@company.com',  department: 'Engineering', role: 'Backend Developer',    status: 'Active',   joiningDate: '2023-03-05' },
  { id: 'EMP-005', name: 'Rohan Mehta',   email: 'rohan@company.com',  department: 'Marketing',   role: 'Marketing Lead',       status: 'On Leave', joiningDate: '2021-09-14' },
]

export const leaves: Leave[] = [
  { id: 'LV-101', employeeId: 'EMP-001', employee: 'Aarav Sharma', type: 'Annual Leave', from: '2026-05-04', to: '2026-05-06', status: 'Pending',  reason: 'Family vacation' },
  { id: 'LV-102', employeeId: 'EMP-002', employee: 'Meera Iyer',   type: 'Sick Leave',   from: '2026-04-22', to: '2026-04-22', status: 'Approved', reason: 'Medical appointment' },
  { id: 'LV-103', employeeId: 'EMP-005', employee: 'Rohan Mehta',  type: 'Annual Leave', from: '2026-06-01', to: '2026-06-15', status: 'Approved', reason: 'Extended leave' },
]

// net is always derived as gross - deductions; never stored independently
function makePayroll(
  id: string, employeeId: string, employee: string,
  month: string, gross: number, deductions: number,
  status: PayrollRecord['status']
): PayrollRecord {
  return { id, employeeId, employee, month, gross, deductions, net: gross - deductions, status }
}

export const payroll: PayrollRecord[] = [
  makePayroll('PAY-001', 'EMP-001', 'Aarav Sharma', 'April 2026',  90000,  8000, 'Processed'),
  makePayroll('PAY-002', 'EMP-002', 'Meera Iyer',   'April 2026', 110000, 12000, 'Processed'),
  makePayroll('PAY-003', 'EMP-003', 'Kabir Khan',   'April 2026',  85000,  7500, 'Processed'),
  makePayroll('PAY-004', 'EMP-004', 'Priya Nair',   'April 2026',  95000,  9000, 'Processed'),
  makePayroll('PAY-005', 'EMP-005', 'Rohan Mehta',  'April 2026',  75000,  6000, 'Pending'),
]

export const jobs: Job[] = [
  { id: 'JOB-001', title: 'Backend Developer',   department: 'Engineering', applicants: 24, status: 'Open'   },
  { id: 'JOB-002', title: 'HR Executive',         department: 'HR',          applicants: 11, status: 'Open'   },
  { id: 'JOB-003', title: 'Financial Analyst',    department: 'Finance',     applicants:  8, status: 'Open'   },
  { id: 'JOB-004', title: 'Marketing Specialist', department: 'Marketing',   applicants: 15, status: 'Closed' },
]
