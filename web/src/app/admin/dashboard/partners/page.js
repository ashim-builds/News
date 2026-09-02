"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, UserCheck, UserX, Loader2, RefreshCw, Upload, Image as ImageIcon } from "lucide-react";
import { authFetch } from "@/lib/auth";

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    photoUrl: "",
    status: "Active",
    order: 0,
  });

  const fetchPartners = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch("/api/partners");
      const data = await res.json();
      if (data.success) {
        setPartners(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch partners:", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function loadData() {
      try {
        const res = await fetch("/api/partners");
        const data = await res.json();
        if (!ignore && data.success) {
          setPartners(data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch partners:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadData();
    return () => {
      ignore = true;
    };
  }, []);

  const handleOpenModal = (partner = null) => {
    if (partner) {
      setEditingPartner(partner);
      setFormData({
        name: partner.name || "",
        role: partner.role || "",
        photoUrl: partner.photoUrl || "",
        status: partner.status || "Active",
        order: partner.order || 0,
      });
    } else {
      setEditingPartner(null);
      setFormData({
        name: "",
        role: "",
        photoUrl: "",
        status: "Active",
        order: partners.length + 1,
      });
    }
    setShowModal(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const bodyData = new FormData();
      bodyData.append("file", file);

      const res = await authFetch("/api/upload", {
        method: "POST",
        body: bodyData,
      });
      const result = await res.json();
      if (result.success && result.url) {
        setFormData((prev) => ({ ...prev, photoUrl: result.url }));
      } else {
        alert("फोटो अपलोड विफल भयो: " + (result.error || "Upload failed"));
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("फोटो अपलोडमा समस्या आयो।");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert("कृपया नाम लेख्नुहोस् (Name is required)");

    setSubmitting(true);
    try {
      const url = editingPartner ? `/api/partners/${editingPartner._id}` : "/api/partners";
      const method = editingPartner ? "PUT" : "POST";

      const res = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        fetchPartners();
      } else {
        alert(data.error || "Operation failed");
      }
    } catch (err) {
      alert("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("के तपाईं यो साझेदार हटाउन चाहनुहुन्छ? (Delete partner?)")) return;

    try {
      const res = await authFetch(`/api/partners/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchPartners();
      } else {
        alert(data.error || "Delete failed");
      }
    } catch (err) {
      alert("Delete failed");
    }
  };

  const toggleStatus = async (partner) => {
    const newStatus = partner.status === "Active" ? "Inactive" : "Active";
    try {
      const res = await authFetch(`/api/partners/${partner._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchPartners();
      }
    } catch (err) {
      console.error("Toggle status error:", err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-gray-900">साझेदार तथा टिम व्यवस्थापन</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage Working Partners & Team members displayed on the website footer.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchPartners}
            className="p-2 text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
            title="Refresh"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
          >
            <Plus size={16} />
            <span>नयाँ साझेदार थप्नुहोस् (Add Partner)</span>
          </button>
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-gray-200">
          <Loader2 className="w-8 h-8 animate-spin text-red-600 mb-2" />
          <p className="text-xs text-gray-500">डाटा लोड हुँदैछ...</p>
        </div>
      ) : partners.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-6">
          <p className="text-sm font-semibold text-gray-700 mb-2">कुनै पनि साझेदार थपिएको छैन</p>
          <p className="text-xs text-gray-400 mb-4">No working partners added yet.</p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
          >
            <Plus size={16} />
            <span>पहिलो साझेदार थप्नुहोस्</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {partners.map((partner) => (
            <div
              key={partner._id}
              className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col justify-between hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center text-gray-400 font-bold text-lg">
                  {partner.photoUrl && (partner.photoUrl.startsWith("http") || partner.photoUrl.startsWith("/") || partner.photoUrl.startsWith("data:")) ? (
                    <img src={partner.photoUrl} alt={partner.name} className="w-full h-full object-cover" />
                  ) : (
                    partner.name?.charAt(0) || "P"
                  )}
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-sm text-gray-900 truncate">{partner.name}</h3>
                  <p className="text-xs text-blue-600 font-medium truncate">{partner.role}</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-2 text-xs">
                <button
                  onClick={() => toggleStatus(partner)}
                  className={`flex items-center gap-1 font-semibold px-2.5 py-1 rounded-lg transition ${
                    partner.status === "Active"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-gray-100 text-gray-500 border border-gray-200"
                  }`}
                >
                  {partner.status === "Active" ? <UserCheck size={14} /> : <UserX size={14} />}
                  <span>{partner.status}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenModal(partner)}
                    className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Edit"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(partner._id)}
                    className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in duration-150">
            <h2 className="text-lg font-extrabold text-gray-900 mb-4">
              {editingPartner ? "साझेदार विवरण सम्पादन गर्नुहोस्" : "नयाँ साझेदार / टिम सदस्य थप्नुहोस्"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  पुरा नाम (Person Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा: रामप्रसाद शर्मा"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm text-gray-900 font-semibold bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-hidden placeholder:text-gray-400 placeholder:font-normal shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  पद / भूमिका (Role / Title)
                </label>
                <input
                  type="text"
                  placeholder="उदा: समाचारदाता / सम्पादक"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm text-gray-900 font-semibold bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-hidden placeholder:text-gray-400 placeholder:font-normal shadow-2xs"
                />
              </div>

              {/* Photo Upload & URL */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  फोटो (Photo)
                </label>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center">
                    {formData.photoUrl && (formData.photoUrl.startsWith("http") || formData.photoUrl.startsWith("/") || formData.photoUrl.startsWith("data:")) ? (
                      <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={20} className="text-gray-400" />
                    )}
                  </div>
                  <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-xs font-bold text-gray-800 rounded-xl cursor-pointer transition">
                    {uploadingImage ? (
                      <Loader2 size={16} className="animate-spin text-red-600" />
                    ) : (
                      <Upload size={16} />
                    )}
                    <span>{uploadingImage ? "अपलोड हुँदैछ..." : "फोटो अपलोड गर्नुहोस् (Upload File)"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
                <input
                  type="url"
                  placeholder="अथवा फोटो लिङ्क राख्नुहोस् (or Image URL)"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs text-gray-900 font-semibold bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-hidden placeholder:text-gray-400 placeholder:font-normal shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1.5">अवस्था (Status)</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm text-gray-900 font-semibold bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-hidden shadow-2xs"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1.5">क्रम (Order)</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 text-sm text-gray-900 font-semibold bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-hidden shadow-2xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
                >
                  रद्द गर्नुहोस् (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingImage}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition disabled:opacity-50 cursor-pointer"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  <span>{editingPartner ? "अद्यावधिक गर्नुहोस्" : "सुरक्षित गर्नुहोस् (Save)"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
