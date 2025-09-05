import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import QuestionForm from "./QuestionForm";
import Swal from "sweetalert2";

interface Question {
  _id: string;
  question: string;
  type: "MCQ" | "Short Answer" | "True/False";
  options: string[];
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  createdAt?: string;
}

const QuestionList: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editData, setEditData] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<
    "all" | Question["type"] | Question["difficulty"]
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "difficulty">("newest");

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get("/questions");
      const safeData: Question[] = res.data.map((q: any) => ({
        _id: q._id,
        question: q.question || "",
        type: q.type || "MCQ",
        options: q.options || [],
        answer: q.answer || "",
        difficulty: q.difficulty || "easy",
        createdAt: q.createdAt || undefined,
      }));
      setQuestions(safeData);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch questions", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleCreate = async (data: Partial<Question>) => {
    try {
      if (editData) {
        await axiosInstance.put(`/questions/${editData._id}`, data);
        setEditData(null);
        Swal.fire({
          title: "Updated!",
          text: "Question updated successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await axiosInstance.post("/questions", data);
        Swal.fire({
          title: "Created!",
          text: "New question added successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
      fetchQuestions();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to save question", "error");
    }
  };

  const handleEdit = (q: Question) => setEditData(q);
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This question will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4F6F52",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/questions/${id}`);
        fetchQuestions();
        Swal.fire("Deleted!", "Question has been deleted.", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to delete question", "error");
      }
    }
  };

  const getDifficultyColor = (difficulty: Question["difficulty"]) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeColor = (type: Question["type"]) => {
    switch (type) {
      case "MCQ":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Short Answer":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "True/False":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: Question["type"]) => {
    switch (type) {
      case "MCQ":
        return "📝";
      case "Short Answer":
        return "✏️";
      case "True/False":
        return "✅";
      default:
        return "❓";
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesFilter =
      activeFilter === "all" ||
      q.type === activeFilter ||
      q.difficulty === activeFilter;
    const matchesSearch =
      (q.question ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.answer ?? "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    if (sortBy === "newest")
      return (
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
      );
    const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
    return (
      (difficultyOrder[b.difficulty] || 0) -
      (difficultyOrder[a.difficulty] || 0)
    );
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="mx-auto border-[#4F6F52] border-t-4 rounded-full w-12 h-12 animate-spin"></div>
          <p className="mt-3 text-[#3A4D39]">Loading questions...</p>
        </div>
      </div>
    );

  return (
    <div className="bg-[#FAF9EE] p-6 min-h-screen">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex md:flex-row flex-col justify-between items-center bg-gradient-to-r from-[#4F6F52] to-[#3A4D39] shadow-lg mb-6 p-6 rounded-2xl text-white">
          <div>
            <h1 className="mb-2 font-bold text-3xl">📋 Question Manager</h1>
            <p className="opacity-90">Manage your questions efficiently</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <div className="bg-white/20 p-2 rounded-lg">
              <span className="font-semibold">{questions.length}</span>{" "}
              questions
            </div>
            <div className="bg-white/20 p-2 rounded-lg">
              <span className="font-semibold">{filteredQuestions.length}</span>{" "}
              filtered
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-[#FAF9EE] shadow-md mb-6 p-6 border border-[#E2E8D5] rounded-2xl">
          <QuestionForm
            onSubmit={handleCreate}
            initialData={editData}
            onCancel={() => setEditData(null)}
          />
        </div>

        {/* Filters */}
        <div className="bg-[#FAF9EE] shadow-md mb-6 p-6 border border-[#E2E8D5] rounded-2xl">
          <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
            <input
              type="text"
              placeholder="Search questions or answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-3 border border-[#E2E8D5] rounded-lg focus:ring-[#4F6F52] focus:ring-2 w-full"
            />
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value as any)}
              className="p-3 border border-[#E2E8D5] rounded-lg focus:ring-[#4F6F52] focus:ring-2 w-full"
            >
              <option value="all">All Questions</option>
              <optgroup label="Question Type">
                <option value="MCQ">Multiple Choice</option>
                <option value="Short Answer">Short Answer</option>
                <option value="True/False">True/False</option>
              </optgroup>
              <optgroup label="Difficulty">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </optgroup>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="p-3 border border-[#E2E8D5] rounded-lg focus:ring-[#4F6F52] focus:ring-2 w-full"
            >
              <option value="newest">Newest First</option>
              <option value="difficulty">Difficulty (Hard to Easy)</option>
            </select>
          </div>
        </div>

        {/* Question Cards */}
        <div className="gap-6 grid grid-cols-1 lg:grid-cols-2">
          {sortedQuestions.map((q) => (
            <div
              key={q._id}
              className="bg-[#FAF9EE] shadow-md hover:shadow-xl border border-[#E2E8D5] rounded-2xl w-full overflow-hidden transition-all duration-300"
            >
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{getTypeIcon(q.type)}</span>
                    <div>
                      <h3 className="font-semibold text-[#3A4D39] text-lg">
                        {q.question}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                            q.difficulty
                          )}`}
                        >
                          {q.difficulty}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                            q.type
                          )}`}
                        >
                          {q.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(q)}
                      className="bg-[#4F6F52] hover:bg-[#3A4D39] p-2 rounded-lg text-white transition"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(q._id)}
                      className="bg-red-500 hover:bg-red-600 p-2 rounded-lg text-white transition"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {q.type === "MCQ" && (
                  <div className="mt-4">
                    <h4 className="mb-2 font-medium text-[#4F6F52]">
                      Options:
                    </h4>
                    <ul className="space-y-2">
                      {q.options.map((opt, i) => (
                        <li
                          key={i}
                          className={`p-3 rounded-lg ${
                            opt === q.answer
                              ? "bg-green-50 border border-green-200 text-green-800 font-medium"
                              : "bg-[#F1F5EC] border border-[#E2E8D5] text-[#3A4D39]"
                          }`}
                        >
                          <span className="mr-2 font-semibold">
                            {String.fromCharCode(65 + i)}.
                          </span>
                          {opt}
                          {opt === q.answer && (
                            <span className="ml-2 text-green-600">
                              ✓ Correct
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="bg-[#E9F5EE] mt-4 p-3 border border-[#C7E5D5] rounded-lg">
                  <h4 className="mb-1 font-medium text-[#2F5D46]">Answer:</h4>
                  <p className="text-[#1F3D2C]">{q.answer}</p>
                </div>

                {q.createdAt && (
                  <p className="mt-3 text-gray-500 text-xs">
                    Created: {new Date(q.createdAt).toLocaleDateString()} at{" "}
                    {new Date(q.createdAt).toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {sortedQuestions.length === 0 && !isLoading && (
          <div className="bg-[#FAF9EE] shadow-md mt-6 p-12 border border-[#E2E8D5] rounded-2xl text-center">
            <div className="mb-4 text-4xl">📝</div>
            <h3 className="mb-2 font-medium text-[#3A4D39] text-xl">
              No questions found
            </h3>
            <p className="text-[#3A4D39]">
              {searchTerm || activeFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Get started by adding your first question"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionList;
