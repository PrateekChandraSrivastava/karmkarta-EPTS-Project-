import React, { useState } from 'react';
import '../Style/EmployeeModals.css';

const EditEmployeeModal = ({ employee, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    id: employee.id, // Use PK as Employee ID
    name: employee.name || '',
    email: employee.email || '',
    department: employee.department || '',
    designation: employee.designation || '',
    phone: employee.phone || '',
    dob: employee.dob || '',
    joinDate: employee.joinDate || '',
    image: employee.image || '',
    status: employee.status || 'active',
    manager_id: employee.manager_id || '',
  });

  const departments = [
    'IT',
    'Database',
    'HR',
    'Finance',
    'Marketing',
    'Operations'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Utility to resize/compress image
  const resizeImage = (file, maxWidth = 300, maxHeight = 300, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            const reader2 = new FileReader();
            reader2.onloadend = () => resolve(reader2.result);
            reader2.onerror = reject;
            reader2.readAsDataURL(blob);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = reject;
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressed = await resizeImage(file);
        setFormData(prev => ({
          ...prev,
          image: compressed
        }));
      } catch (err) {
        // fallback to original if compression fails
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({ ...prev, image: reader.result }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const cleanDate = (date) => {
    if (!date || date === 'Invalid date') return null;
    return date;
  };

  const cleanInt = (val) => {
    if (val === undefined || val === null || val === '' || isNaN(Number(val))) return null;
    return Number(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
      ...formData,
      dob: cleanDate(formData.dob),
      joinDate: cleanDate(formData.joinDate),
      manager_id: cleanInt(formData.manager_id), // Ensure manager_id is cleaned
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Employee</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="employee-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Employee ID</label>
              <input
                type="text"
                name="id"
                value={formData.id}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Department</label>
              <select
                name="department"
                value={formData.department || ''}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Profile Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Update Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeModal;