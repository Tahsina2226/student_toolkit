import React, { useState, useContext, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { AuthContext } from "../../componetns/context/AuthContext";

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

  // Load sessions from localStorage and backend
  useEffect(() => {
    const storedSessions = localStorage.getItem("studySessions");
    if (storedSessions) setSessions(JSON.parse(storedSessions));

    const fetchSessions = async () => {
      if (!token) return;
      try {
        const { data } = await axiosInstance.get("/motivation/sessions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSessions(data.sessions);
      } catch (err) {
        console.error("Error fetching sessions:", err);
      }
    };
    fetchSessions();
  }, [token]);

  // Save sessions to localStorage
  useEffect(() => {
    localStorage.setItem("studySessions", JSON.stringify(sessions));
  }, [sessions]);

  // Fetch motivation & calculate stats
  useEffect(() => {
    const fetchMotivation = async () => {
      if (!token) return;
      try {
        const { data } = await axiosInstance.get("/motivation", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMotivation(data);
      } catch (err) {
        console.error("Error fetching motivation:", err);
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

      setSessions((prev) => [newSession, ...prev]);

      if (token) {
        await axiosInstance.post(
          "/motivation/add",
          { subject, duration: Number(duration) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setSubject("");
      setDuration("");
      alert("Study session added successfully!");
    } catch (err) {
      console.error(err);
      alert("Error adding session");
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
    } catch (err) {
      console.error("Error refreshing motivation:", err);
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

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8 min-h-screen">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 text-center">
          <h1 className="mb-2 font-bold text-gray-800 text-4xl">
            Study Session Dashboard
          </h1>
          <p className="text-gray-600">
            Track your progress and stay motivated
          </p>
        </header>

        {/* Stats Overview */}
        <div className="gap-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-10">
          <div className="bg-white shadow-lg hover:shadow-xl p-6 border-blue-500 border-l-4 rounded-xl transition-shadow">
            <div className="flex items-center">
              <div className="bg-blue-100 mr-4 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-blue-600"
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

          <div className="bg-white shadow-lg hover:shadow-xl p-6 border-green-500 border-l-4 rounded-xl transition-shadow">
            <div className="flex items-center">
              <div className="bg-green-100 mr-4 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-green-600"
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

          <div className="bg-white shadow-lg hover:shadow-xl p-6 border-purple-500 border-l-4 rounded-xl transition-shadow">
            <div className="flex items-center">
              <div className="bg-purple-100 mr-4 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-purple-600"
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

          <div className="bg-white shadow-lg hover:shadow-xl p-6 border-orange-500 border-l-4 rounded-xl transition-shadow">
            <div className="flex items-center">
              <div className="bg-orange-100 mr-4 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-orange-600"
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

        <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
          {/* Motivation */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl p-6 rounded-2xl h-full text-white">
              <div className="flex items-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="font-semibold text-xl">Daily Motivation</h3>
              </div>

              <div className="space-y-4 mb-6">
                {motivation?.message && (
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
                    <p className="text-sm">{motivation.message}</p>
                  </div>
                )}

                {motivation?.quote && (
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
                    <p className="text-sm italic">"{motivation.quote}"</p>
                  </div>
                )}

                {motivation?.tip && (
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
                    <p className="text-sm">
                      <span className="font-semibold">Pro Tip:</span>{" "}
                      {motivation.tip}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={refreshMotivation}
                className="flex justify-center items-center bg-white hover:bg-gray-100 py-3 rounded-xl w-full font-semibold text-indigo-600 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh Motivation
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8 lg:col-span-2">
            {/* Form */}
            <div className="bg-white shadow-xl p-6 rounded-2xl">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 mr-3 p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <h2 className="font-semibold text-gray-800 text-2xl">
                  Log New Study Session
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="What did you study?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="p-4 border border-gray-300 focus:border-blue-500 rounded-xl focus:ring-2 focus:ring-blue-200 w-full transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    placeholder="How long did you study?"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="p-4 border border-gray-300 focus:border-blue-500 rounded-xl focus:ring-2 focus:ring-blue-200 w-full transition-all"
                    min={1}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex justify-center items-center bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-4 rounded-xl w-full font-semibold text-white transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <svg
                        className="mr-3 -ml-1 w-5 h-5 text-white animate-spin"
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
                      Adding Session...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2 w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Add Study Session
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Recent Sessions */}
            <div className="bg-white shadow-xl p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="bg-green-100 mr-3 p-2 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h2 className="font-semibold text-gray-800 text-2xl">
                    Recent Study Sessions
                  </h2>
                </div>
                <span className="bg-blue-100 px-3 py-1 rounded-full font-semibold text-blue-800 text-xs">
                  {getRecentSessions().length} this week
                </span>
              </div>

              {getRecentSessions().length === 0 ? (
                <div className="py-10 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mx-auto mb-3 w-12 h-12 text-gray-400"
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
                  <p className="text-gray-500">
                    No study sessions recorded this week.
                  </p>
                  <p className="mt-1 text-gray-400 text-sm">
                    Start by adding your first session!
                  </p>
                </div>
              ) : (
                <div className="space-y-4 pr-2 max-h-96 overflow-y-auto">
                  {getRecentSessions().map((session) => (
                    <div
                      key={session._id}
                      className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 p-4 border border-gray-200 rounded-xl transition-all"
                    >
                      <div className="flex items-center">
                        <div className="bg-blue-100 mr-4 p-2 rounded-lg">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 text-blue-600"
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
                          <h4 className="font-medium text-gray-800">
                            {session.subject}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {formatDate(session.date)}
                          </p>
                        </div>
                      </div>
                      <span className="bg-blue-100 px-3 py-1 rounded-full font-semibold text-blue-800 text-sm">
                        {session.duration} min
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudySessionDashboard;
