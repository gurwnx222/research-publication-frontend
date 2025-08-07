import React, { useState, useEffect } from "react";

const departments = [
  {
    _id: "68835bb728200e02b35ddefa",
    name: "DEPARTMENT OF PHYSICAL SCIENCES",
  },
  { _id: "68835c2b28200e02b35ddf01", name: "DEPARTMENT OF LIFE SCIENCES" },
  {
    _id: "68835c4d28200e02b35ddf08",
    name: "DEPARTMENT OF AGRICULTURE & FOOD TECHNOLOGY",
  },
  {
    _id: "68835c6228200e02b35ddf0f",
    name: "DEPARTMENT OF PHARMACY & PHARMACEUTICAL SCIENCES",
  },
  {
    _id: "68835c8428200e02b35ddf1d",
    name: "DEPARTMENT OF MANAGEMENT & COMMERCE",
  },
  {
    _id: "68835cb928200e02b35ddf24",
    name: "DEPARTMENT OF HOTEL MANAGEMENT & CATERING SERVICES",
  },
  {
    _id: "68835cc428200e02b35ddf2b",
    name: "DEPARTMENT OF COMPUTER APPLICATION",
  },
  { _id: "68835ccf28200e02b35ddf32", name: "DEPARTMENT OF EDUCATION" },
  { _id: "68835cda28200e02b35ddf39", name: "DEPARTMENT OF JOURNALISM" },
  {
    _id: "68835ce828200e02b35ddf40",
    name: "DEPARTMENT OF HUMANITIES & LANGUAGES",
  },
  { _id: "68835cf528200e02b35ddf47", name: "DEPARTMENT OF ARCHITECTURE" },
  {
    _id: "68835d0228200e02b35ddf4e",
    name: "DEPARTMENT OF DESIGN & FINE ARTS",
  },
  { _id: "68835d1528200e02b35ddf55", name: "DEPARTMENT OF LEGAL STUDIES" },
  { _id: "68835d2728200e02b35ddf5c", name: "DEPARTMENT OF HEALTH SCIENCES" },
  { _id: "6883600728200e02b35ddf95", name: "DEPARTMENT OF ENGINEERING" },
  {
    _id: "68838fc14776e47b81087d44",
    name: "DEPARTMENT OF RESEARCH, INNOVATION AND INCUBATION",
  },
];

const journalTypes = [
  "SCI/ESCI",
  "WEB OF SCIENCE",
  "SCOPUS",
  "UGC CARE",
  "ICI",
  "OTHER",
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Generate years from 1950 to current year
const currentYear = new Date().getFullYear();
const years = Array.from(
  { length: currentYear - 1949 },
  (_, i) => 1950 + i
).reverse();

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
    orcidID: "",
    coAuthors: [],
    coAuthorInput: "",
  });

  const [errors, setErrors] = useState({});
  const [isEmployeeFound, setIsEmployeeFound] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    step: "",
    message: "",
    isError: false,
  });
  const [submit, setIsSubmitting] = useState(false);
  const API_BASE_URL = "https://research-publication.onrender.com/api";
  // Auto-fill employee data when employee ID changes

  useEffect(() => {
    const fetchEmployeeData = async (employeeId) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/authors/employee-id?q=${employeeId}`
        );

        if (response.ok) {
          const employee = await response.json();
          console.log("Employee data fetched:", employee);

          setForm((prev) => ({
            ...prev,
            authorName: employee.authorBio.author_name,
            authorDeptId: employee.authorBio.department, // Make sure this matches the department _id
          }));
          setIsEmployeeFound(true);
        } else {
          setIsEmployeeFound(false);
          setForm((prev) => ({
            ...prev,
            authorName: "",
            authorDeptId: "",
          }));
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
        setIsEmployeeFound(false);
        setForm((prev) => ({
          ...prev,
          authorName: "",
          authorDeptId: "",
        }));
      }
    };

    if (form.employeeId && form.employeeId.length >= 4) {
      fetchEmployeeData(form.employeeId);
    } else {
      setIsEmployeeFound(false);
    }
  }, [form.employeeId]);

  const validate = () => {
    const newErrors = {};
    if (!form.employeeId) newErrors.employeeId = "Employee ID is required";
    if (!form.authorName) newErrors.authorName = "Author name is required";
    if (!form.authorDeptId)
      newErrors.authorDeptId = "Author department is required";
    if (!form.journalType) newErrors.journalType = "Journal type is required";
    if (!form.journalName)
      newErrors.journalName = "Journal/Conference name is required";
    if (!form.isbnIssn) newErrors.isbnIssn = "ISBN/ISSN number is required";
    if (!form.publicationMonth)
      newErrors.publicationMonth = "Publication month is required";
    if (!form.publicationYear)
      newErrors.publicationYear = "Publication year is required";
    if (!form.title) newErrors.title = "Title is required";
    if (!form.pdf) newErrors.pdf = "PDF document is required";

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        setErrors((prev) => ({
          ...prev,
          pdf: "File size must be less than 10MB",
        }));
        return;
      }
      if (file.type !== "application/pdf") {
        setErrors((prev) => ({ ...prev, pdf: "Only PDF files are allowed" }));
        return;
      }
      setForm((prev) => ({ ...prev, pdf: file }));
      setErrors((prev) => ({ ...prev, pdf: "" }));
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
        setErrors((prev) => ({
          ...prev,
          pdf: "File size must be less than 10MB",
        }));
        return;
      }
      if (file.type !== "application/pdf") {
        setErrors((prev) => ({ ...prev, pdf: "Only PDF files are allowed" }));
        return;
      }
      setForm((prev) => ({ ...prev, pdf: file }));
      setErrors((prev) => ({ ...prev, pdf: "" }));
    }
  };

  const handleIsbnIssnChange = (e) => {
    let value = e.target.value.replace(/[^0-9X-]/g, "");

    // Auto-format ISBN/ISSN
    if (value.length <= 8) {
      // ISSN format: XXXX-XXXX
      value = value.replace(/(\d{4})(\d{1,4})/, "$1-$2");
    } else if (value.length <= 13) {
      // ISBN-13 format: XXX-X-XX-XXXXXX-X
      value = value.replace(
        /(\d{3})(\d{1})(\d{1,2})(\d{1,6})(\d{1})/,
        "$1-$2-$3-$4-$5"
      );
    }

    setForm((prev) => ({ ...prev, isbnIssn: value }));
    if (errors.isbnIssn) {
      setErrors((prev) => ({ ...prev, isbnIssn: "" }));
    }
  };
  const handleOrcidChange = (e) => {
    let value = e.target.value.replace(/[^0-9X-]/g, "");

    // Auto-format ORCID: XXXX-XXXX-XXXX-XXXX
    if (value.length > 0) {
      value = value.replace(
        /(\d{4})(\d{1,4})?(\d{1,4})?(\d{1,4})?/,
        (match, p1, p2, p3, p4) => {
          let formatted = p1;
          if (p2) formatted += `-${p2}`;
          if (p3) formatted += `-${p3}`;
          if (p4) formatted += `-${p4}`;
          return formatted;
        }
      );
    }

    setForm((prev) => ({ ...prev, orcidId: value }));
    if (errors.orcidId) {
      setErrors((prev) => ({ ...prev, orcidId: "" }));
    }
  };
  const handleDoiChange = (e) => {
    let value = e.target.value.trim();

    // Remove common prefixes if user pastes full URL
    value = value.replace(/^https?:\/\/(dx\.)?doi\.org\//, "");
    value = value.replace(/^doi:/, "");

    // DOI format: 10.XXXX/suffix (no character restrictions on suffix)
    // Only ensure it starts with "10." if user is typing a DOI
    if (value && !value.startsWith("10.") && /^\d/.test(value)) {
      // If starts with digits but not "10.", assume they're typing a DOI
      if (value.startsWith("10")) {
        value = value.replace(/^10/, "10.");
      }
    }

    setForm((prev) => ({ ...prev, doi: value }));
    if (errors.doi) {
      setErrors((prev) => ({ ...prev, doi: "" }));
    }
  };
  const handleAddCoAuthor = () => {
    if (form.coAuthorInput.trim()) {
      setForm((prev) => ({
        ...prev,
        coAuthors: [...prev.coAuthors, prev.coAuthorInput.trim()],
        coAuthorInput: "",
      }));
    }
  };

  const handleRemoveCoAuthor = (index) => {
    setForm((prev) => ({
      ...prev,
      coAuthors: prev.coAuthors.filter((_, i) => i !== index),
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const firstError = Object.keys(validationErrors)[0];
      const element = document.querySelector(`[name="${firstError}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({
      step: "preparing",
      message: "Preparing submission...",
      isError: false,
    });

    try {
      // Step 1: Submit publication
      setSubmitStatus({
        step: "publication",
        message: "Submitting publication...",
        isError: false,
      });

      const formData = new FormData();

      // Add all form fields
      formData.append("employeeId", form.employeeId);
      formData.append("authorName", form.authorName);
      formData.append("authorDeptId", form.authorDeptId);
      formData.append("journalType", form.journalType);
      formData.append("journalName", form.journalName);
      formData.append("isbnIssn", form.isbnIssn);
      formData.append("publicationMonth", form.publicationMonth);
      formData.append("publicationYear", form.publicationYear);
      formData.append("title", form.title);
      formData.append("pdfFile", form.pdf);

      // Optional fields
      if (form.doi) formData.append("doi", form.doi);
      if (form.orcidID) formData.append("orcidID", form.orcidID);
      if (form.coAuthors.length > 0) {
        formData.append("coAuthors", JSON.stringify(form.coAuthors));
      }

      // Check if API server is reachable first
      let publicationResponse;
      try {
        publicationResponse = await fetch(`${API_BASE_URL}/publication`, {
          method: "POST",
          body: formData,
        });
      } catch (networkError) {
        throw new Error(
          `Cannot connect to server. Please check if the API server is running at ${API_BASE_URL}`
        );
      }

      // Check if response is JSON
      const contentType = publicationResponse.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        // If it's not JSON, try to get the text to see what was returned
        const responseText = await publicationResponse.text();
        console.error("Non-JSON response received:", responseText);

        if (responseText.includes("<!DOCTYPE")) {
          throw new Error(
            "Server returned HTML instead of JSON. This usually means the API endpoint doesn't exist or the server is not configured correctly."
          );
        }

        throw new Error(
          `Server returned unexpected content type: ${contentType}. Expected JSON.`
        );
      }

      if (!publicationResponse.ok) {
        let errorMessage;
        try {
          const errorData = await publicationResponse.json();
          errorMessage =
            errorData.message ||
            `HTTP ${publicationResponse.status}: ${publicationResponse.statusText}`;
        } catch (parseError) {
          errorMessage = `HTTP ${publicationResponse.status}: ${publicationResponse.statusText}`;
        }
        throw new Error(errorMessage);
      }

      let publicationResult;
      try {
        publicationResult = await publicationResponse.json();
      } catch (parseError) {
        throw new Error("Failed to parse server response as JSON");
      }

      console.log("Publication submitted successfully:", publicationResult);

      // Extract publication ID from response
      const publicationId =
        publicationResult.publication?._id ||
        publicationResult.publication?.id ||
        publicationResult._id ||
        publicationResult.id;

      if (!publicationId) {
        throw new Error(
          "Publication ID not found in response. Please contact support."
        );
      }

      // Step 2: Assign main author to publication
      setSubmitStatus({
        step: "author",
        message: "Assigning author to publication...",
        isError: false,
      });

      let authorAssignmentResponse;
      try {
        authorAssignmentResponse = await fetch(
          `${API_BASE_URL}/authors/assign-publication`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              employee_id: form.employeeId,
              publication_id: publicationId,
              author_order: 1, // Main author
              author_name: form.authorName,
              department: form.authorDeptId,
            }),
          }
        );
      } catch (networkError) {
        console.warn(
          "Author assignment failed due to network error:",
          networkError
        );
        // Continue without failing the whole process
      }

      let authorAssignmentSuccess = false;
      if (authorAssignmentResponse && !authorAssignmentResponse.ok) {
        try {
          const errorData = await authorAssignmentResponse.json();
          console.error("Author assignment failed:", errorData);
          setSubmitStatus({
            step: "author",
            message: `Warning: ${errorData.message}. Publication saved successfully.`,
            isError: false,
          });
        } catch (parseError) {
          console.warn("Failed to parse author assignment error response");
        }
      } else if (authorAssignmentResponse) {
        try {
          const assignmentResult = await authorAssignmentResponse.json();
          console.log("Main author assigned successfully:", assignmentResult);
          authorAssignmentSuccess = true;
        } catch (parseError) {
          console.warn("Failed to parse author assignment response");
        }
      }

      // Step 3: Handle co-authors (if any)
      if (form.coAuthors.length > 0) {
        setSubmitStatus({
          step: "coauthors",
          message: "Processing co-authors...",
          isError: false,
        });

        console.log("Co-authors to be processed:", form.coAuthors);
      }

      // Success!
      setSubmitStatus({
        step: "complete",
        message: "Publication registered successfully!",
        isError: false,
      });

      // Show success message
      alert(
        "Publication registered successfully!" +
          (authorAssignmentSuccess
            ? ""
            : " (Author assignment may need manual review)")
      );

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
        orcidID: "",
        coAuthors: [],
        coAuthorInput: "",
      });
      setErrors({});
      setIsEmployeeFound(false);
      setSubmitStatus({ step: "", message: "", isError: false });
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus({
        step: "error",
        message: error.message || "An unexpected error occurred",
        isError: true,
      });
      alert("Submission failed: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add this component to show submission status
  const SubmissionStatus = () => {
    if (!submitStatus.step) return null;
    return (
      <div
        className={`fixed top-4 right-4 max-w-sm p-4 rounded-lg shadow-lg z-50 ${
          submitStatus.isError
            ? "bg-red-100 border-red-500 text-red-700"
            : "bg-blue-100 border-blue-500 text-blue-700"
        } border`}
      >
        <div className="flex items-center">
          {!submitStatus.isError && (
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          <span className="text-sm font-medium">{submitStatus.message}</span>
        </div>
      </div>
    );
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
                errors.employeeId ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your employee ID"
            />
            {isEmployeeFound && (
              <p className="mt-2 text-sm text-green-600 flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
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
                errors.authorName ? "border-red-500" : "border-gray-300"
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
                errors.authorDeptId ? "border-red-500" : "border-gray-300"
              }`}
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 12px center",
                backgroundSize: "16px",
              }}
              disabled={isEmployeeFound}
            >
              <option value="">Select department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
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
                errors.journalType ? "border-red-500" : "border-gray-300"
              }`}
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 12px center",
                backgroundSize: "16px",
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
                errors.journalName ? "border-red-500" : "border-gray-300"
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
                errors.isbnIssn ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter ISBN or ISSN number"
            />
            <p className="mt-1 text-xs text-gray-500">
              Format will be automatically applied (e.g., 1234-5678 for ISSN,
              978-1-23-456789-0 for ISBN)
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
                    errors.publicationMonth
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                    backgroundSize: "16px",
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
                  <p className="mt-2 text-sm text-red-600">
                    {errors.publicationMonth}
                  </p>
                )}
              </div>
              <div>
                <select
                  name="publicationYear"
                  value={form.publicationYear}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors appearance-none bg-white ${
                    errors.publicationYear
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                    backgroundSize: "16px",
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
                  <p className="mt-2 text-sm text-red-600">
                    {errors.publicationYear}
                  </p>
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
                errors.title ? "border-red-500" : "border-gray-300"
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
                dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
              } ${errors.pdf ? "border-red-500" : ""}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {form.pdf ? (
                <div className="text-green-600">
                  <svg
                    className="mx-auto h-12 w-12 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="font-medium">{form.pdf.name}</p>
                  <p className="text-sm text-gray-500">
                    {(form.pdf.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="text-gray-500">
                  <svg
                    className="mx-auto h-12 w-12 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="font-medium mb-1">
                    Drop your PDF here or click to browse
                  </p>
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
              DOI (Digital Object Identifier){" "}
              <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="text"
              name="doi"
              value={form.doi}
              onChange={handleDoiChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                errors.doi ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g., 10.1000/182"
            />
            {errors.doi && (
              <p className="mt-2 text-sm text-red-600">{errors.doi}</p>
            )}
          </div>
          {/* orcidID */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ORCID ID <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="text"
              name="orcidID"
              value={form.orcidID}
              onChange={handleOrcidChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                errors.orcidID ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g., 0000-0000-0000-0000"
            />
            {errors.orcidID && (
              <p className="mt-2 text-sm text-red-600">{errors.orcidID}</p>
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
                onChange={(e) =>
                  setForm({ ...form, coAuthorInput: e.target.value })
                }
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Enter co-author name"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddCoAuthor())
                }
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
                <p className="text-sm font-medium text-gray-700">
                  Added co-authors:
                </p>
                {form.coAuthors.map((author, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                  >
                    <span className="text-gray-700">{author}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCoAuthor(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
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
              onClick={handleSubmit}
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
