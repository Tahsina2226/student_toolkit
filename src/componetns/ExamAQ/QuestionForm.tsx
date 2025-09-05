import React, { useState, useEffect } from "react";

interface Props {
  onSubmit?: (data: any) => void;
  initialData?: any;
  onCancel?: () => void;
}

const QuestionForm: React.FC<Props> = ({
  onSubmit = () => {},
  initialData,
  onCancel,
}) => {
  const [question, setQuestion] = useState(initialData?.question || "");
  const [type, setType] = useState(initialData?.type || "MCQ");
  const [options, setOptions] = useState(
    initialData?.options || ["", "", "", ""]
  );
  const [answer, setAnswer] = useState(initialData?.answer || "");
  const [difficulty, setDifficulty] = useState(
    initialData?.difficulty || "easy"
  );
  const [activeTab, setActiveTab] = useState("details");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    setQuestion(initialData?.question || "");
    setType(initialData?.type || "MCQ");
    if (initialData?.type === "True/False") {
      setOptions(["True", "False"]);
    } else {
      setOptions(initialData?.options || ["", "", "", ""]);
    }
    setAnswer(initialData?.answer || "");
    setDifficulty(initialData?.difficulty || "easy");
    if (initialData?.answer) {
      const idx = (initialData.options || []).indexOf(initialData.answer);
      setSelectedAnswerIndex(idx >= 0 ? idx : null);
    } else if (initialData?.type === "True/False") {
      const idx = ["True", "False"].indexOf(initialData?.answer);
      setSelectedAnswerIndex(idx >= 0 ? idx : null);
    }
  }, [initialData]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    if (selectedAnswerIndex === index) setAnswer(value);
  };

  const addOption = () => setOptions([...options, ""]);
  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
    if (selectedAnswerIndex === index) {
      setSelectedAnswerIndex(null);
      setAnswer("");
    } else if (selectedAnswerIndex && selectedAnswerIndex > index) {
      setSelectedAnswerIndex(selectedAnswerIndex - 1);
    }
  };

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswerIndex(index);
    setAnswer(options[index]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (type === "MCQ" || type === "True/False") &&
      (selectedAnswerIndex === null || !options[selectedAnswerIndex])
    ) {
      alert("Please select a correct answer!");
      return;
    }
    setIsLoading(true);
    onSubmit({ question, type, options, answer, difficulty });
    setIsLoading(false);
    if (!initialData) {
      setQuestion("");
      setType("MCQ");
      setOptions(["", "", "", ""]);
      setAnswer("");
      setDifficulty("easy");
      setSelectedAnswerIndex(null);
    }
  };

  return (
    <div className="flex justify-center bg-[#FAF9EE] px-4 py-8">
      <div className="bg-[#A2AF9B] shadow-lg rounded-xl w-full max-w-4xl overflow-hidden">
        <div className="p-3 text-[#FAF9EE]">
          <h1 className="mb-1 font-bold text-xl">📝 Question Form</h1>
          <p className="opacity-90 text-xs">
            Create or edit your quiz questions
          </p>
        </div>

        <div className="flex border-[#FAF9EE] border-b">
          {["details", "options"].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-2 font-medium text-sm ${
                activeTab === tab
                  ? "text-[#FAF9EE] border-b-2 border-[#FAF9EE]"
                  : "text-[#FAF9EE]/90 hover:text-[#FAF9EE]"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="bg-white p-6">
          {activeTab === "details" && (
            <div className="space-y-6">
              <div>
                <label className="block mb-1 font-medium text-[#3E4B3E] text-sm">
                  Question <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Enter your question here..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                  className="px-4 py-3 border border-[#3E4B3E] focus:border-[#3E4B3E] rounded-lg focus:ring-[#3E4B3E] focus:ring-2 w-full transition"
                  rows={3}
                />
              </div>

              <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                <div>
                  <label className="block mb-1 font-medium text-[#3E4B3E] text-sm">
                    Question Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => {
                      const val = e.target.value;
                      setType(val);
                      if (val === "True/False") setOptions(["True", "False"]);
                      else if (val === "MCQ") setOptions(["", "", "", ""]);
                      setSelectedAnswerIndex(null);
                      setAnswer("");
                    }}
                    className="p-3 border border-[#3E4B3E] focus:border-[#3E4B3E] rounded-lg focus:ring-[#3E4B3E] focus:ring-2 w-full transition"
                  >
                    <option value="MCQ">Multiple Choice (MCQ)</option>
                    <option value="True/False">True/False</option>
                    <option value="Short Answer">Short Answer</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-medium text-[#3E4B3E] text-sm">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="p-3 border border-[#3E4B3E] focus:border-[#3E4B3E] rounded-lg focus:ring-[#3E4B3E] focus:ring-2 w-full transition"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              {type === "Short Answer" && (
                <div>
                  <label className="block mb-1 font-medium text-[#3E4B3E] text-sm">
                    Correct Answer <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the correct answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    required
                    className="px-4 py-3 border border-[#3E4B3E] focus:border-[#3E4B3E] rounded-lg focus:ring-[#3E4B3E] focus:ring-2 w-full transition"
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === "options" &&
            (type === "MCQ" || type === "True/False") && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="block font-medium text-[#3E4B3E] text-sm">
                    Options
                  </label>
                  {type === "MCQ" && (
                    <button
                      type="button"
                      onClick={addOption}
                      className="flex items-center font-medium text-[#3E4B3E] hover:text-[#DCCFC0] text-sm"
                    >
                      + Add Option
                    </button>
                  )}
                </div>

                {options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={selectedAnswerIndex === i}
                      onChange={() => handleSelectAnswer(i)}
                      className="accent-[#3E4B3E]"
                    />
                    <input
                      type="text"
                      placeholder={`Option ${i + 1}`}
                      value={opt}
                      onChange={(e) => handleOptionChange(i, e.target.value)}
                      className="flex-grow px-4 py-2 border border-[#3E4B3E] focus:border-[#3E4B3E] rounded-lg focus:ring-[#3E4B3E] focus:ring-2 transition"
                      disabled={type === "True/False"}
                    />
                    {type === "MCQ" && options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(i)}
                        className="text-[#3E4B3E] hover:text-[#DCCFC0]"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSubmit}
              disabled={isLoading || !question || !answer}
              className={`flex-1 py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors ${
                isLoading || !question || !answer
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#3E4B3E] text-[#FAF9EE] hover:opacity-90 shadow-md"
              }`}
            >
              {isLoading
                ? "Saving..."
                : initialData
                ? "Update Question"
                : "Add Question"}
            </button>

            {onCancel && (
              <button
                onClick={onCancel}
                className="flex-1 bg-gray-400 hover:opacity-90 px-4 py-3 rounded-lg font-medium text-white transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionForm;
