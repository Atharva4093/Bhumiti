"use client";

import { useState } from "react";
import { Search, FileText, Download, BookOpen, ShieldCheck, ExternalLink, PlusCircle } from "lucide-react";

interface DocumentItem {
  id: string;
  title: string;
  category: "Policy Document" | "Research Paper" | "Case Study" | "Whitepaper";
  author: string;
  department: string;
  date: string;
  fileSize: string;
  downloads: number;
  description: string;
}

const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: "DOC-001",
    title: "National Framework for Peri-Urban Land Transition and Sustainable Zoning (2026 Revision)",
    category: "Policy Document",
    author: "Ministry of Rural Development & NITI Aayog",
    department: "Department of Land Resources",
    date: "14 Aug 2026",
    fileSize: "4.2 MB",
    downloads: 1240,
    description: "Comprehensive guidelines regulating agricultural conversion, green buffer protections, and municipal boundary expansions."
  },
  {
    id: "DOC-002",
    title: "Geospatial Analysis of Groundwater Depletion in Western Maharashtra Industrial Corridors",
    category: "Research Paper",
    author: "Dr. R. K. Deshmukh, IIT Bombay",
    department: "Center for Urban Science & Engineering",
    date: "28 Jul 2026",
    fileSize: "8.7 MB",
    downloads: 856,
    description: "An empirical study evaluating aquifer stress resulting from high-density concrete clustering in Hadapsar and Lohegaon sectors."
  },
  {
    id: "DOC-003",
    title: "Digitization of Cadastral Records: Mitigating Title Disputes Through Immutable GIS Integration",
    category: "Whitepaper",
    author: "National Land Governance Consortium",
    department: "Digital India Land Records Modernization Programme",
    date: "10 Jun 2026",
    fileSize: "3.1 MB",
    downloads: 2150,
    description: "Policy blueprint detailing blockchain-backed verification mechanisms for land ownership registries and spatial parcels."
  },
  {
    id: "DOC-004",
    title: "Pune Metropolitan Region Land Use Transition Case Study: 2015–2025",
    category: "Case Study",
    author: "State Directorate of Town Planning",
    department: "Government of Maharashtra",
    date: "02 May 2026",
    fileSize: "12.4 MB",
    downloads: 1620,
    description: "Longitudinal audit of agricultural loss, forest canopy reduction, and infrastructure development across peri-urban sectors."
  }
];

export default function ResearchRepositoryView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<"Policy Document" | "Research Paper" | "Case Study" | "Whitepaper">("Research Paper");
  const [newAuthor, setNewAuthor] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownloadPDF = (doc: DocumentItem) => {
    const pdfLinks: Record<string, string> = {
      "DOC-001": "https://www.niti.gov.in/sites/default/files/2026-04/Moving-Towards-Effective-City-Government-a-Framework-for-Million-Plus-Cities.pdf",
      "DOC-002": "https://dolr.gov.in/en/documents/",
      "DOC-003": "https://dolr.gov.in/en/documents/",
      "DOC-004": "https://dolr.gov.in/en/documents/"
    };

    const targetUrl = pdfLinks[doc.id] || "https://dolr.gov.in/en/documents/";
    window.open(targetUrl, "_blank");
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAuthor) return;

    const newDoc: DocumentItem = {
      id: `DOC-00${documents.length + 1}`,
      title: newTitle,
      category: newCategory,
      author: newAuthor,
      department: "Independent Research / Academic Partner",
      date: new Date().toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }),
      fileSize: "2.5 MB",
      downloads: 1,
      description: newDesc || "Newly submitted research repository item pending peer verification."
    };

    setDocuments([newDoc, ...documents]);
    setNewTitle("");
    setNewAuthor("");
    setNewDesc("");
    setIsUploadModalOpen(false);
  };

  return (
    <div className="w-full h-full p-6 bg-slate-50 overflow-y-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm mb-1">
            <BookOpen className="w-4 h-4" />
            <span>NATIONAL KNOWLEDGE ECOSYSTEM</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Centralized Research & Policy Repository</h1>
          <p className="text-slate-600 text-sm mt-1">
            Peer-reviewed research publications, government policy documents, whitepapers, and multi-departmental case studies.
          </p>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition shadow-sm self-start md:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Contribute Publication</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Publications</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{documents.length + 42}</p>
          <span className="text-xs text-emerald-600 font-medium mt-2 inline-block">+12 uploaded this month</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Departments</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">14 Ministries</p>
          <span className="text-xs text-blue-600 font-medium mt-2 inline-block">Central & State Bodies</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Research Downloads</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">5,860+</p>
          <span className="text-xs text-emerald-600 font-medium mt-2 inline-block">Verified academic access</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tamper-Proof Integrity</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1 flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5" /> Secured
          </p>
          <span className="text-xs text-slate-500 mt-2 inline-block">SHA-256 Metadata Hash</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-6 items-stretch lg:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, author, keyword, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
          {["All", "Policy Document", "Research Paper", "Whitepaper", "Case Study"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition shadow-sm cursor-pointer ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredDocs.map((doc) => (
          <div key={doc.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl mt-1 md:mt-0 flex-shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                    doc.category === 'Policy Document' ? 'bg-purple-100 text-purple-700' :
                    doc.category === 'Research Paper' ? 'bg-emerald-100 text-emerald-700' :
                    doc.category === 'Whitepaper' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {doc.category}
                  </span>
                  <span className="text-xs text-slate-400">• {doc.date}</span>
                  <span className="text-xs text-slate-400">• {doc.fileSize}</span>
                </div>
                <h3 onClick={() => setSelectedDoc(doc)} className="text-base font-semibold text-slate-900 hover:text-blue-600 cursor-pointer transition">
                  {doc.title}
                </h3>
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                  {doc.description}
                </p>
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 font-medium">
                  <span>Author: <strong className="text-slate-700">{doc.author}</strong></span>
                  <span>Department: <strong className="text-slate-700">{doc.department}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
              <button 
                onClick={() => handleDownloadPDF(doc)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-medium transition cursor-pointer shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
              <button 
                onClick={() => setSelectedDoc(doc)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-xs font-medium transition cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedDoc && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                {selectedDoc.category} • {selectedDoc.id}
              </span>
              <button onClick={() => setSelectedDoc(null)} className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer">✕</button>
            </div>
            <h2 className="text-lg font-bold text-slate-900">{selectedDoc.title}</h2>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">{selectedDoc.description}</p>
            <div className="text-xs space-y-1 text-slate-500">
              <p><strong>Author:</strong> {selectedDoc.author}</p>
              <p><strong>Issuing Department:</strong> {selectedDoc.department}</p>
              <p><strong>Published Date:</strong> {selectedDoc.date}</p>
              <p><strong>Security Hash:</strong> <code className="text-[10px] font-mono text-emerald-600">SHA-256: 8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d</code></p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => handleDownloadPDF(selectedDoc)} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 hover:bg-blue-700 cursor-pointer shadow-sm">
                <Download className="w-3.5 h-3.5" /> Download PDF Document
              </button>
            </div>
          </div>
        </div>
      )}

      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 p-6 animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Contribute Research or Policy Document</h2>
            <p className="text-xs text-slate-500 mb-4">Submit peer-reviewed documentation to the national land governance repository.</p>
            
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Assessment of Land Conversion Impact in Tier-2 Cities"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as "Policy Document" | "Research Paper" | "Case Study" | "Whitepaper")}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  >
                    <option value="Research Paper">Research Paper</option>
                    <option value="Policy Document">Policy Document</option>
                    <option value="Whitepaper">Whitepaper</option>
                    <option value="Case Study">Case Study</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Author / Institution</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Ananya Sharma, IISc"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Abstract / Description</label>
                <textarea
                  rows={3}
                  placeholder="Provide a concise summary of the findings or policy implications..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition shadow-sm cursor-pointer"
                >
                  Submit for Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}