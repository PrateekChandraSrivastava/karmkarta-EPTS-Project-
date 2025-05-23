import React, { useState } from 'react';
import '../Style/EmployeeModals.css';

const SalaryModal = ({ employee, onClose, onUpdate }) => {
  const [salaryData, setSalaryData] = useState({
    basicSalary: employee.salary?.basic || '',
    allowances: employee.salary?.allowances || '',
    deductions: employee.salary?.deductions || '',
    effectiveDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalaryData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalSalary = parseFloat(salaryData.basicSalary) + 
                       parseFloat(salaryData.allowances) - 
                       parseFloat(salaryData.deductions);
    
    onUpdate({
      employeeId: employee.id,
      ...salaryData,
      totalSalary
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Manage Salary - {employee.name}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="salary-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Basic Salary</label>
              <input
                type="number"
                name="basicSalary"
                value={salaryData.basicSalary}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Allowances</label>
              <input
                type="number"
                name="allowances"
                value={salaryData.allowances}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Deductions</label>
              <input
                type="number"
                name="deductions"
                value={salaryData.deductions}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Effective Date</label>
              <input
                type="date"
                name="effectiveDate"
                value={salaryData.effectiveDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="salary-summary">
            <h3>Salary Summary</h3>
            <div className="summary-item">
              <span>Total Salary:</span>
              <span className="total-amount">
                ${(
                  parseFloat(salaryData.basicSalary || 0) +
                  parseFloat(salaryData.allowances || 0) -
                  parseFloat(salaryData.deductions || 0)
                ).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Update Salary
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalaryModal; 