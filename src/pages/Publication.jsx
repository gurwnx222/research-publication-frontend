import React, { useState } from "react";

const departments = [
  { id: "6855087c6db49ddcf8a3014e", name: "CSE" },
  { id: "6855087c6db49ddcf8a3014f", name: "Mechanical" },
  { id: "6855087c6db49ddcf8a30150", name: "Electrical" },
  { id: "6855087c6db49ddcf8a30151", name: "Civil" },
  { id: "6855087c6db49ddcf8a30152", name: "Physics" }
];

export default function JournalRegistrationForm() {
  const [form, setForm] = useState({
    employeeId: "",
    password: "",
    authorName: "",
    authorDeptId: "",
    journalDeptId: "",
    isbn: "",
    year: "",
    title: "",
    pdf: null,
    coAuthors: [],
    coAuthorInput: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.employeeId) newErrors.employeeId = "Employee ID is required.";
    if (!form.password) newErrors.password = "Password is required.";
    if (!form.authorName) newErrors.authorName = "Author name is required.";
    if (!form.authorDeptId) newErrors.authorDeptId = "Select author department.";
    if (!form.journalDeptId) newErrors.journalDeptId = "Select journal department.";
    if (!form.isbn) newErrors.isbn = "Journal ISBN is required.";
    if (!form.year) newErrors.year = "Year of publication is required.";
    if (!form.title) newErrors.title = "Title is required.";
    if (!form.pdf) newErrors.pdf = "Upload PDF document.";
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, pdf: e.target.files[0] }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const userRes = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: Number(form.employeeId),
          password: form.password,
          email: `${form.employeeId}@university.edu`,
          role: "author",
        }),
      });
      const userData = await userRes.json();
      if (!userRes.ok) throw new Error(userData.message || "User registration failed");

      const publicationData = new FormData();
      publicationData.append("title", form.title);
      publicationData.append("abstract", form.title);
      publicationData.append("publication_date", form.year);
      publicationData.append("isbn", form.isbn);
      publicationData.append("department", form.journalDeptId);
      publicationData.append("pdfFile", form.pdf);

      const pubRes = await fetch("http://localhost:3000/api/publication", {
        method: "POST",
        body: publicationData,
      });
      const pubJson = await pubRes.json();
      if (!pubRes.ok) throw new Error(pubJson.message || "Publication upload failed");
      const publicationId = pubJson.publication._id;

      const authorRes = await fetch("http://localhost:3000/api/author", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: Number(form.employeeId),
          author_name: form.authorName,
          email: `${form.employeeId}@university.edu`,
          department: form.authorDeptId,
          publication_id: publicationId,
          author_order: 1,
          role: "primary",
        }),
      });
      const authorJson = await authorRes.json();
      if (!authorRes.ok) throw new Error(authorJson.message || "Main author save failed");

      for (let i = 0; i < form.coAuthors.length; i++) {
        const name = form.coAuthors[i];
        const coRes = await fetch("http://localhost:3000/api/author", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employee_id: Date.now() + i,
            author_name: name,
            email: `co${i}@example.com`,
            department: form.journalDeptId,
            publication_id: publicationId,
            author_order: i + 2,
            role: "co-author",
          }),
        });
        const coJson = await coRes.json();
        if (!coRes.ok) throw new Error(coJson.message || "Co-author save failed");
      }

      alert("Publication and authors registered successfully!");
      setForm({
        employeeId: "",
        password: "",
        authorName: "",
        authorDeptId: "",
        journalDeptId: "",
        isbn: "",
        year: "",
        title: "",
        pdf: null,
        coAuthors: [],
        coAuthorInput: "",
      });
      setErrors({});
    } catch (err) {
      console.error(err);
      alert(err.message || "Submission failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">Journal Publication Entry</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Employee ID</label>
            <input
              type="text"
              name="employeeId"
              value={form.employeeId}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            />
            {errors.employeeId && <p className="text-red-500 text-sm">{errors.employeeId}</p>}
          </div>
          <div>
            <label className="block font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
        </div>
        <div>
          <label className="block font-medium">Author Name</label>
          <input
            type="text"
            name="authorName"
            value={form.authorName}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
          />
          {errors.authorName && <p className="text-red-500 text-sm">{errors.authorName}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Author Department</label>
            <select
              name="authorDeptId"
              value={form.authorDeptId}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            {errors.authorDeptId && <p className="text-red-500 text-sm">{errors.authorDeptId}</p>}
          </div>
          <div>
            <label className="block font-medium">Journal Department</label>
            <select
              name="journalDeptId"
              value={form.journalDeptId}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            {errors.journalDeptId && <p className="text-red-500 text-sm">{errors.journalDeptId}</p>}
          </div>
        </div>
        <div>
          <label className="block font-medium">Journal ISBN</label>
          <input
            type="text"
            name="isbn"
            value={form.isbn}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
          />
          {errors.isbn && <p className="text-red-500 text-sm">{errors.isbn}</p>}
        </div>
        <div>
          <label className="block font-medium">Year of Publication</label>
          <input
            type="number"
            name="year"
            value={form.year}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
          />
          {errors.year && <p className="text-red-500 text-sm">{errors.year}</p>}
        </div>
        <div>
          <label className="block font-medium">Title</label>
          <textarea
            name="title"
            value={form.title}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter journal title"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
        </div>
        <div>
          <label className="block font-medium">Upload PDF</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full border rounded px-3 py-2"
          />
          {errors.pdf && <p className="text-red-500 text-sm">{errors.pdf}</p>}
        </div>
        <div>
          <label className="block font-medium">Add Co-authors (optional)</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="coAuthorInput"
              value={form.coAuthorInput}
              onChange={(e) => setForm({ ...form, coAuthorInput: e.target.value })}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter co-author name"
            />
            <button type="button" onClick={handleAddCoAuthor} className="bg-blue-500 text-white px-3 py-2 rounded">
              Add
            </button>
          </div>
          <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
            {form.coAuthors.map((co, i) => (
              <li key={i}>{co}</li>
            ))}
          </ul>
        </div>
        <div className="text-center">
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
            Add Publication
          </button>
        </div>
      </form>
    </div>
  );
}
