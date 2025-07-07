import React, { useState, useEffect } from "react";

const departments = [
  { id: "6855087c6db49ddcf8a3014e", name: "CSE" },
  { id: "6855087c6db49ddcf8a3014f", name: "Mechanical" },
  { id: "6855087c6db49ddcf8a30150", name: "Electrical" },
  { id: "6855087c6db49ddcf8a30151", name: "Civil" },
  { id: "6855087c6db49ddcf8a30152", name: "Physics" },
];

const journalTypes = [
  "SCOPUS",
  "WEB OF SCIENCE", 
  "SCI/ESCI",
  "ICI",
  "UGC CARE",
  "OTHER"
];

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Generate years from 1950 to current year
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1949 }, (_, i) => 1950 + i).reverse();

// Mock database for employee lookup
const mockEmployeeDatabase = {
  "12345": { name: "Dr. John Smith", department: "6855087c6db49ddcf8a3014e" },
  "67890": { name: "Prof. Sarah Johnson", department: "6855087c6db49ddcf8a3014f" },
  "11111": { name: "Dr. Mike Wilson", department: "6855087c6db49ddcf8a30150" },
};

export default function JournalRegistrationForm() {
  const [form, setForm] = useState({
    employeeId: "",
    authorName: "",
    authorDeptId: "",
    journalType: "",
    journalName: "",
    isbnIssn: "",
    publicationMonth: "",
    publicationYear: "",
    title: "",
    pdf: null,
    doi: "",
    coAuthors: [],
    coAuthorInput: "",
  });

  const [errors, setErrors] = useState({});
  const [isEmployeeFound, setIsEmployeeFound] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Auto-fill employee data when employee ID changes
  useEffect(() => {
    if (form.employeeId && form.employeeId.length >= 4) {
      const employee = mockEmployeeDatabase[form.employeeId];
      if (employee) {
        setForm(prev => ({
          ...prev,
          authorName: employee.name,
          authorDeptId: employee.department
        }));
        setIsEmployeeFound(true);
      } else {
        setIsEmployeeFound(false);
      }
    } else {
      setIsEmployeeFound(false);
    }
  }, [form.employeeId]);

  const validate = () => {
    const newErrors = {};
    if (!form.employeeId) newErrors.employeeId = "Employee ID is required";
    if (!form.authorName) newErrors.authorName = "Author name is required";
    if (!form.authorDeptId) newErrors.authorDeptId = "Author department is required";
    if (!form.journalType) newErrors.journalType = "Journal type is required";
    if (!form.journalName) newErrors.journalName = "Journal/Conference name is required";
    if (!form.isbnIssn) newErrors.isbnIssn = "ISBN/ISSN number is required";
    if (!form.publicationMonth) newErrors.publicationMonth = "Publication month is required";
    if (!form.publicationYear) newErrors.publicationYear = "Publication year is required";
    if (!form.title) newErrors.title = "Title is required";
    if (!form.pdf) newErrors.pdf = "PDF document is required";

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setErrors(prev => ({ ...prev, pdf: "File size must be less than 10MB" }));
        return;
      }
      if (file.type !== "application/pdf") {
        setErrors(prev => ({ ...prev, pdf: "Only PDF files are allowed" }));
        return;
      }
      setForm(prev => ({ ...prev, pdf: file }));
      setErrors(prev => ({ ...prev, pdf: "" }));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, pdf: "File size must be less than 10MB" }));
        return;
      }
      if (file.type !== "application/pdf") {
        setErrors(prev => ({ ...prev, pdf: "Only PDF files are allowed" }));
        return;
      }
      setForm(prev => ({ ...prev, pdf: file }));
      setErrors(prev => ({ ...prev, pdf: "" }));
    }
  };

  const handleIsbnIssnChange = (e) => {
    let value = e.target.value.replace(/[^0-9X-]/g, '');
    
    // Auto-format ISBN/ISSN
    if (value.length <= 8) {
      // ISSN format: XXXX-XXXX
      value = value.replace(/(\d{4})(\d{1,4})/, '$1-$2');
    } else if (value.length <= 13) {
      // ISBN-13 format: XXX-X-XX-XXXXXX-X
      value = value.replace(/(\d{3})(\d{1})(\d{1,2})(\d{1,6})(\d{1})/, '$1-$2-$3-$4-$5');
    }
    
    setForm(prev => ({ ...prev, isbnIssn: value }));
    if (errors.isbnIssn) {
      setErrors(prev => ({ ...prev, isbnIssn: "" }));
    }
  };

  const handleAddCoAuthor = () => {
    if (form.coAuthorInput.trim()) {
      setForm(prev => ({
        ...prev,
        coAuthors: [...prev.coAuthors, prev.coAuthorInput.trim()],
        coAuthorInput: "",
      }));
    }
  };

  const handleRemoveCoAuthor = (index) => {
    setForm(prev => ({
      ...prev,
      coAuthors: prev.coAuthors.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      // Scroll to first error
      const firstError = Object.keys(validationErrors)[0];
      const element = document.querySelector(`[name="${firstError}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    try {
      // Your API submission logic here
      console.log("Form submitted:", form);
      alert("Publication registered successfully!");
      
      // Reset form
      setForm({
        employeeId: "",
        authorName: "",
        authorDeptId: "",
        journalType: "",
        journalName: "",
        isbnIssn: "",
        publicationMonth: "",
        publicationYear: "",
        title: "",
        pdf: null,
        doi: "",
        coAuthors: [],
        coAuthorInput: "",
      });
      setErrors({});
      setIsEmployeeFound(false);
    } catch (err) {
      console.error(err);
      alert("Submission failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-8 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Journal Publication Registration
            </h1>
            <p className="text-gray-600">
              Please fill out all required fields to register your publication
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Employee ID */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employee ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="employeeId"
              value={form.employeeId}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                errors.employeeId ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your employee ID"
            />
            {isEmployeeFound && (
              <p className="mt-2 text-sm text-green-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Employee found - details auto-filled
              </p>
            )}
            {errors.employeeId && (
              <p className="mt-2 text-sm text-red-600">{errors.employeeId}</p>
            )}
          </div>

          {/* Author Name */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="authorName"
              value={form.authorName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                errors.authorName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter author name"
              readOnly={isEmployeeFound}
            />
            {errors.authorName && (
              <p className="mt-2 text-sm text-red-600">{errors.authorName}</p>
            )}
          </div>

          {/* Author Department */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author Department <span className="text-red-500">*</span>
            </label>
            <select
              name="authorDeptId"
              value={form.authorDeptId}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors appearance-none bg-white ${
                errors.authorDeptId ? 'border-red-500' : 'border-gray-300'
              }`}
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '16px'
              }}
              disabled={isEmployeeFound}
            >
              <option value="">Select department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
            {errors.authorDeptId && (
              <p className="mt-2 text-sm text-red-600">{errors.authorDeptId}</p>
            )}
          </div>

          {/* Journal Type */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type of Journal <span className="text-red-500">*</span>
            </label>
            <select
              name="journalType"
              value={form.journalType}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors appearance-none bg-white ${
                errors.journalType ? 'border-red-500' : 'border-gray-300'
              }`}
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '16px'
              }}
            >
              <option value="">Select journal type</option>
              {journalTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.journalType && (
              <p className="mt-2 text-sm text-red-600">{errors.journalType}</p>
            )}
          </div>

          {/* Journal Name */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name of Journal/Conference <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="journalName"
              value={form.journalName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                errors.journalName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter journal or conference name"
            />
            {errors.journalName && (
              <p className="mt-2 text-sm text-red-600">{errors.journalName}</p>
            )}
          </div>

          {/* ISBN/ISSN */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ISBN/ISSN Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="isbnIssn"
              value={form.isbnIssn}
              onChange={handleIsbnIssnChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                errors.isbnIssn ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter ISBN or ISSN number"
            />
            <p className="mt-1 text-xs text-gray-500">
              Format will be automatically applied (e.g., 1234-5678 for ISSN, 978-1-23-456789-0 for ISBN)
            </p>
            {errors.isbnIssn && (
              <p className="mt-2 text-sm text-red-600">{errors.isbnIssn}</p>
            )}
          </div>

          {/* Publication Date */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Publication <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <select
                  name="publicationMonth"
                  value={form.publicationMonth}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors appearance-none bg-white ${
                    errors.publicationMonth ? 'border-red-500' : 'border-gray-300'
                  }`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '16px'
                  }}
                >
                  <option value="">Select month</option>
                  {months.map((month, index) => (
                    <option key={month} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
                {errors.publicationMonth && (
                  <p className="mt-2 text-sm text-red-600">{errors.publicationMonth}</p>
                )}
              </div>
              <div>
                <select
                  name="publicationYear"
                  value={form.publicationYear}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors appearance-none bg-white ${
                    errors.publicationYear ? 'border-red-500' : 'border-gray-300'
                  }`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '16px'
                  }}
                >
                  <option value="">Select year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.publicationYear && (
                  <p className="mt-2 text-sm text-red-600">{errors.publicationYear}</p>
                )}
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title of Publication <span className="text-red-500">*</span>
            </label>
            <textarea
              name="title"
              value={form.title}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter the complete title of your publication"
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* PDF Upload */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload PDF <span className="text-red-500">*</span>
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              } ${errors.pdf ? 'border-red-500' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {form.pdf ? (
                <div className="text-green-600">
                  <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="font-medium">{form.pdf.name}</p>
                  <p className="text-sm text-gray-500">
                    {(form.pdf.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="text-gray-500">
                  <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="font-medium mb-1">Drop your PDF here or click to browse</p>
                  <p className="text-sm">Maximum file size: 10MB</p>
                </div>
              )}
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
                id="pdf-upload"
              />
              <label
                htmlFor="pdf-upload"
                className="mt-3 inline-block px-4 py-2 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
              >
                Choose File
              </label>
            </div>
            {errors.pdf && (
              <p className="mt-2 text-sm text-red-600">{errors.pdf}</p>
            )}
          </div>

          {/* DOI */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              DOI (Digital Object Identifier) <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="text"
              name="doi"
              value={form.doi}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                errors.doi ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 10.1000/182"
            />
            {errors.doi && (
              <p className="mt-2 text-sm text-red-600">{errors.doi}</p>
            )}
          </div>

          {/* Co-authors */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Co-authors (Optional)
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                name="coAuthorInput"
                value={form.coAuthorInput}
                onChange={(e) => setForm({ ...form, coAuthorInput: e.target.value })}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Enter co-author name"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCoAuthor())}
              />
              <button
                type="button"
                onClick={handleAddCoAuthor}
                className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Add
              </button>
            </div>
            {form.coAuthors.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Added co-authors:</p>
                {form.coAuthors.map((author, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-700">{author}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCoAuthor(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <button
              type="submit"
                              className="w-full bg-gray-800 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Submit Publication
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}