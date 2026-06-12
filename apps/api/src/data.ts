export const employees = [
  { id: 'EMP-001', name: 'Aarav Sharma', email: 'aarav@company.com', department: 'Engineering', role: 'Frontend Developer', status: 'Active', joiningDate: '2024-04-12' },
  { id: 'EMP-002', name: 'Meera Iyer', email: 'meera@company.com', department: 'HR', role: 'HR Manager', status: 'Active', joiningDate: '2023-11-01' },
  { id: 'EMP-003', name: 'Kabir Khan', email: 'kabir@company.com', department: 'Finance', role: 'Payroll Specialist', status: 'Active', joiningDate: '2022-07-19' }
]

export const leaves = [
  { id: 'LV-101', employee: 'Aarav Sharma', type: 'Annual Leave', from: '2026-05-04', to: '2026-05-06', status: 'Pending' },
  { id: 'LV-102', employee: 'Meera Iyer', type: 'Sick Leave', from: '2026-04-22', to: '2026-04-22', status: 'Approved' }
]

export const payroll = [
  { id: 'PAY-001', employee: 'Aarav Sharma', month: 'April 2026', gross: 90000, deductions: 8000, net: 82000, status: 'Processed' },
  { id: 'PAY-002', employee: 'Meera Iyer', month: 'April 2026', gross: 110000, deductions: 12000, net: 98000, status: 'Processed' }
]

export const jobs = [
  { id: 'JOB-001', title: 'Backend Developer', department: 'Engineering', applicants: 24, status: 'Open' },
  { id: 'JOB-002', title: 'HR Executive', department: 'HR', applicants: 11, status: 'Open' }
]
