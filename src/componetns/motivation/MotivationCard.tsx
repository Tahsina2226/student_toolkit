import React, { useState, useContext, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { AuthContext } from "../../componetns/context/AuthContext";
import Swal from "sweetalert2";

interface StudySession {
  _id: string;
  subject: string;
  duration: number;
  date: string;
  userId?: string;
}

interface MotivationData {
  success: boolean;
  message?: string;
  quote?: string;
  tip?: string;
}

interface StudyStats {
  totalMinutes: number;
  totalSessions: number;
  averageMinutes: number;
  weeklyMinutes: number;
}

interface StudyTip {
  id: number;
  title: string;
  description: string;
  category: string;
  icon: string;
}

const StudySessionDashboard: React.FC = () => {
  const { user } = useContext(AuthContext);
  const token = user?.token || "";

  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [motivation, setMotivation] = useState<MotivationData | null>(null);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [stats, setStats] = useState<StudyStats>({
    totalMinutes: 0,
    totalSessions: 0,
    averageMinutes: 0,
    weeklyMinutes: 0,
  });
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedTip, setExpandedTip] = useState<number | null>(null);

  const studyTips: StudyTip[] = [
    {
      id: 1,
      title: "Pomodoro Technique",
      description:
        "Break your work into 25-minute intervals separated by 5-minute breaks. After four pomodoros, take a longer break (15-30 minutes). This technique helps maintain focus and prevents burnout.",
      category: "technique",
      icon: "⏱️",
    },
    {
      id: 2,
      title: "Active Recall",
      description:
        "Test yourself on the material you're trying to learn rather than just re-reading it. Use flashcards, practice tests, or explain concepts out loud to reinforce learning.",
      category: "technique",
      icon: "🧠",
    },
    {
      id: 3,
      title: "Spaced Repetition",
      description:
        "Review information at increasing intervals over time. This technique takes advantage of the psychological spacing effect, helping you retain information more effectively.",
      category: "technique",
      icon: "🔄",
    },
    {
      id: 4,
      title: "Create a Dedicated Study Space",
      description:
        "Find a quiet, well-lit place free from distractions where you can focus solely on studying. Keep all your materials organized and within reach.",
      category: "environment",
      icon: "📚",
    },
    {
      id: 5,
      title: "Use the Feynman Technique",
      description:
        "Explain concepts in simple terms as if teaching someone else. This helps identify gaps in your understanding and reinforces learning through simplification.",
      category: "technique",
      icon: "👨‍🏫",
    },
    {
      id: 6,
      title: "Stay Hydrated and Nourished",
      description:
        "Drink plenty of water and eat brain-healthy foods like nuts, berries, and fish. Avoid heavy meals that can make you drowsy while studying.",
      category: "health",
      icon: "💧",
    },
    {
      id: 7,
      title: "Take Regular Breaks",
      description:
        "Don't try to study for hours on end. Short breaks every 45-60 minutes help maintain concentration and prevent mental fatigue.",
      category: "health",
      icon: "☕",
    },
    {
      id: 8,
      title: "Use Mnemonics and Acronyms",
      description:
        "Create memory aids like acronyms, rhymes, or visual associations to help remember complex information more easily.",
      category: "technique",
      icon: "🔤",
    },
    {
      id: 9,
      title: "Teach What You've Learned",
      description:
        "Explain concepts to a study partner or even to yourself. Teaching forces you to organize your thoughts and identify areas that need more work.",
      category: "technique",
      icon: "👥",
    },
    {
      id: 10,
      title: "Get Enough Sleep",
      description:
        "Aim for 7-9 hours of quality sleep each night. Sleep is crucial for memory consolidation and cognitive function.",
      category: "health",
      icon: "😴",
    },
  ];

  const categories = [
    { id: "all", name: "All Tips" },
    { id: "technique", name: "Study Techniques" },
    { id: "environment", name: "Study Environment" },
    { id: "health", name: "Health & Wellness" },
  ];

  const filteredTips =
    activeCategory === "all"
      ? studyTips
      : studyTips.filter((tip) => tip.category === activeCategory);

  useEffect(() => {
    const storedSessions = localStorage.getItem("studySessions");
    if (storedSessions) setSessions(JSON.parse(storedSessions));

    const fetchSessions = async () => {
      if (!token) return;
      try {
        const { data } = await axiosInstance.get("/motivation/sessions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSessions((prev) => {
          const existingIds = new Set(prev.map((s) => s._id));
          const newSessions = data.sessions.filter(
            (s: StudySession) => !existingIds.has(s._id)
          );
          const merged = [...prev, ...newSessions];
          localStorage.setItem("studySessions", JSON.stringify(merged));
          return merged;
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchSessions();
  }, [token]);

  useEffect(() => {
    const fetchMotivation = async () => {
      if (!token) return;
      try {
        const { data } = await axiosInstance.get("/motivation", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMotivation(data);
      } catch (err) {
        console.error(err);
      }
    };

    const calculateStats = () => {
      const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
      const totalSessions = sessions.length;
      const averageMinutes =
        totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weeklyMinutes = sessions
        .filter((s) => new Date(s.date) >= weekAgo)
        .reduce((sum, s) => sum + s.duration, 0);
      setStats({ totalMinutes, totalSessions, averageMinutes, weeklyMinutes });
    };

    fetchMotivation();
    calculateStats();
  }, [sessions, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newSession: StudySession = {
        _id: Date.now().toString(),
        subject,
        duration: Number(duration),
        date: new Date().toISOString(),
        userId: user?.id,
      };
      setSessions((prev) => {
        const updated = [newSession, ...prev];
        localStorage.setItem("studySessions", JSON.stringify(updated));
        return updated;
      });

      if (token) {
        await axiosInstance.post(
          "/motivation/add",
          { subject, duration: Number(duration) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setSubject("");
      setDuration("");
      Swal.fire({
        icon: "success",
        title: "Session added!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed to add session",
        timer: 1500,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshMotivation = async () => {
    if (!token) return;
    try {
      const { data } = await axiosInstance.get("/motivation", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMotivation(data);
      Swal.fire({
        icon: "success",
        title: "Motivation refreshed!",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed to refresh",
        timer: 1200,
        showConfirmButton: false,
      });
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getRecentSessions = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return sessions.filter((s) => new Date(s.date) >= weekAgo);
  };

  const toggleTipExpansion = (id: number) =>
    setExpandedTip(expandedTip === id ? null : id);

  return (
    <div className="bg-gradient-to-br from-[#DCCFC0] to-[#A2AF9B] p-4 md:p-8 min-h-screen">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 text-center">
          <h1 className="mb-2 font-bold text-gray-800 text-4xl">
            Study Session Dashboard
          </h1>
          <p className="text-gray-700">
            Track your progress and stay motivated
          </p>
        </header>

        <div className="gap-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-10">
          <div className="bg-white shadow-lg hover:shadow-xl p-6 border-[#5A6D57] border-l-4 rounded-xl transition-shadow">
            <div className="flex items-center">
              <div className="bg-[#DCCFC0] mr-4 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-[#5A6D57]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <div className="font-bold text-gray-800 text-2xl">
                  {stats.totalMinutes}
                </div>
                <div className="text-gray-500 text-sm">Total Minutes</div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg hover:shadow-xl p-6 border-[#A2AF9B] border-l-4 rounded-xl transition-shadow">
            <div className="flex items-center">
              <div className="bg-[#DCCFC0] mr-4 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-[#5A6D57]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <div className="font-bold text-gray-800 text-2xl">
                  {stats.totalSessions}
                </div>
                <div className="text-gray-500 text-sm">Sessions</div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg hover:shadow-xl p-6 border-[#DCCFC0] border-l-4 rounded-xl transition-shadow">
            <div className="flex items-center">
              <div className="bg-[#A2AF9B] mr-4 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div>
                <div className="font-bold text-gray-800 text-2xl">
                  {stats.averageMinutes}
                </div>
                <div className="text-gray-500 text-sm">Avg. Minutes</div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg hover:shadow-xl p-6 border-[#5A6D57] border-l-4 rounded-xl transition-shadow">
            <div className="flex items-center">
              <div className="bg-[#DCCFC0] mr-4 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-[#5A6D57]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <div className="font-bold text-gray-800 text-2xl">
                  {stats.weeklyMinutes}
                </div>
                <div className="text-gray-500 text-sm">This Week</div>
              </div>
            </div>
          </div>
        </div>

        <div className="gap-6 grid grid-cols-1 md:grid-cols-2 mb-10">
          <form
            className="bg-white shadow-lg p-6 border-[#A2AF9B] border-l-4 rounded-xl"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              className="mb-4 p-2 border border-gray-300 rounded-md w-full"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
            <input
              type="number"
              className="mb-4 p-2 border border-gray-300 rounded-md w-full"
              placeholder="Duration (minutes)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-[#5A6D57] py-2 rounded-md w-full text-white"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Session"}
            </button>
          </form>

          <div className="bg-white shadow-lg p-6 border-[#DCCFC0] border-l-4 rounded-xl">
            <h2 className="mb-4 font-bold text-xl">Motivation</h2>
            {motivation ? (
              <div>
                <p className="mb-2 text-gray-700">{motivation.quote}</p>
                <p className="text-gray-500">{motivation.tip}</p>
                <button
                  onClick={refreshMotivation}
                  className="bg-[#A2AF9B] mt-4 px-3 py-1 rounded-md text-white"
                >
                  Refresh
                </button>
              </div>
            ) : (
              <p className="text-gray-500">Loading...</p>
            )}
          </div>
        </div>

        <div className="mb-10">
          <h2 className="mb-4 font-bold text-2xl">Study Tips</h2>
          <div className="flex space-x-4 mb-4 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`px-4 py-2 rounded-full ${
                  activeCategory === cat.id
                    ? "bg-[#5A6D57] text-white"
                    : "bg-[#DCCFC0] text-gray-800"
                }`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            {filteredTips.map((tip) => (
              <div
                key={tip.id}
                className="bg-white shadow-lg p-4 border-[#A2AF9B] border-l-4 rounded-xl"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-gray-800">
                    {tip.icon} {tip.title}
                  </h3>
                  <button
                    onClick={() => toggleTipExpansion(tip.id)}
                    className="text-gray-500"
                  >
                    {expandedTip === tip.id ? "▲" : "▼"}
                  </button>
                </div>
                {expandedTip === tip.id && (
                  <p className="text-gray-600">{tip.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-bold text-2xl">
            Recent Sessions (Last 7 Days)
          </h2>
          <div className="space-y-2">
            {getRecentSessions().map((s) => (
              <div
                key={s._id}
                className="flex justify-between bg-white shadow-lg p-4 border-[#DCCFC0] border-l-4 rounded-xl"
              >
                <div>
                  <p className="font-bold text-gray-800">{s.subject}</p>
                  <p className="text-gray-500">{formatDate(s.date)}</p>
                </div>
                <div className="font-semibold text-gray-700">
                  {s.duration} min
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudySessionDashboard;
