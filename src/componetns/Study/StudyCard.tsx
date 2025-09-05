import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import StudyForm from "./StudyForm";

interface Props {
  plan: any;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate?: () => void;
}

const StudyCard = ({ plan, onComplete, onDelete, onUpdate }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [timeUntilDeadline, setTimeUntilDeadline] = useState("");
  const [progress, setProgress] = useState(0);
  const [isDeadlinePassed, setIsDeadlinePassed] = useState(false);

  useEffect(() => {
    if (!plan.deadline) return;

    const updateTime = () => {
      const today = new Date();
      const deadlineDate = new Date(plan.deadline);
      const createdDate = plan.createdAt
        ? new Date(plan.createdAt)
        : new Date(deadlineDate.getTime() - 7 * 24 * 60 * 60 * 1000);

      const totalTime = deadlineDate.getTime() - createdDate.getTime();
      const elapsedTime = today.getTime() - createdDate.getTime();
      const remainingTime = deadlineDate.getTime() - today.getTime();

      let progressValue = (elapsedTime / totalTime) * 100;
      if (progressValue < 0) progressValue = 0;
      if (progressValue > 100) progressValue = 100;
      setProgress(progressValue);

      if (remainingTime <= 0) {
        setTimeUntilDeadline("Deadline passed");
        setIsDeadlinePassed(true);
      } else {
        const diffDays = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(
          (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const diffMinutes = Math.floor(
          (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
        );

        let timeString = "";
        if (diffDays > 0) timeString += `${diffDays}d `;
        if (diffHours > 0) timeString += `${diffHours}h `;
        if (diffMinutes > 0 && diffDays === 0) timeString += `${diffMinutes}m `;
        timeString += "left";

        setTimeUntilDeadline(timeString);
        setIsDeadlinePassed(false);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [plan.deadline, plan.createdAt]);

  const getPriorityColor = () => {
    switch (plan.priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPriorityIcon = () => {
    switch (plan.priority?.toLowerCase()) {
      case "high":
        return "🔥";
      case "medium":
        return "⚠️";
      case "low":
        return "💤";
      default:
        return "📌";
    }
  };

  const getDeadlineStatus = () => {
    if (!plan.deadline) return "bg-gray-100 text-gray-800 border-gray-300";
    const today = new Date();
    const deadlineDate = new Date(plan.deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "bg-red-100 text-red-800 border-red-300";
    if (diffDays <= 1) return "bg-red-100 text-red-800 border-red-300";
    if (diffDays <= 2) return "bg-orange-100 text-orange-800 border-orange-300";
    if (diffDays <= 7) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-green-100 text-green-800 border-green-300";
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "No deadline";
    return new Date(dateString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleComplete = () => {
    Swal.fire({
      title: "Mark as completed?",
      text: "This will move the study plan to completed tasks.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#A2AF9B",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, mark as done",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        onComplete(plan._id);
        Swal.fire({
          title: "Completed!",
          text: "Study plan marked as completed.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This study plan will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(plan._id);
        Swal.fire({
          title: "Deleted!",
          text: "Your study plan has been removed.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const showDetails = () => {
    Swal.fire({
      title: plan.subject,
      html: `
        <div class="text-left">
          <p class="my-2"><strong>Topic:</strong> ${plan.topic || "Not specified"}</p>
          <p class="my-2"><strong>Priority:</strong> <span class="px-2 py-1 rounded ${getPriorityColor()}">${plan.priority || "Normal"}</span></p>
          <p class="my-2"><strong>Deadline:</strong> ${formatDate(plan.deadline)}</p>
          <p class="my-2"><strong>Day:</strong> ${plan.day || "Not specified"}</p>
          <p class="my-2"><strong>Time:</strong> ${plan.startTime || "Not specified"}</p>
          <p class="my-2"><strong>Duration:</strong> ${plan.durationMinutes} minutes</p>
          ${plan.deadline ? `<p class="my-2"><strong>Time remaining:</strong> ${timeUntilDeadline}</p>` : ""}
        </div>
      `,
      icon: "info",
      confirmButtonColor: "#A2AF9B",
    });
  };

  return (
    <div className="relative bg-gradient-to-br from-[#FAF9EE] to-[#f5f4e5] shadow-md hover:shadow-xl p-6 border border-[#A2AF9B]/40 rounded-2xl transition-all hover:-translate-y-1 duration-300 transform">
      <div className={`absolute top-0 left-0 w-2 h-full rounded-l-2xl ${getPriorityColor().split(" ")[0]}`}></div>
      <div className="flex justify-between items-start mb-4 pl-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[#2F3E2F] hover:text-[#4A6F57] text-xl truncate transition-colors cursor-pointer" onClick={showDetails} title="Click for details">{plan.subject}</h3>
          <p className="mt-1 text-gray-500 text-sm">{plan.topic || "No specific topic"}</p>
        </div>
        <span className={`flex items-center text-xs px-3 py-1.5 rounded-full border ${getPriorityColor()} font-medium whitespace-nowrap ml-2`}>
          {getPriorityIcon()} {plan.priority || "Normal"} Priority
        </span>
      </div>

      {plan.deadline && (
        <div className="mb-4 pl-3">
          <div className="flex justify-between mb-1 text-gray-600 text-xs">
            <span>Deadline Progress</span>
            <span className={isDeadlinePassed ? "text-red-600 font-bold" : ""}>{timeUntilDeadline}</span>
          </div>
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className={`h-full rounded-full ${progress > 90 || isDeadlinePassed ? "bg-red-500" : progress > 60 ? "bg-yellow-500" : "bg-green-500"}`} style={{ width: `${isDeadlinePassed ? 100 : progress}%` }}></div>
          </div>
        </div>
      )}

      <div className="gap-3 grid grid-cols-2 mb-5 pl-3">
        <div className="flex items-center bg-white shadow-sm p-3 border border-[#A2AF9B]/30 rounded-xl text-sm">
          <span className="text-lg">📅</span>
          <span className="ml-2 font-semibold truncate">{plan.day || "No day set"}</span>
        </div>
        <div className="flex items-center bg-white shadow-sm p-3 border border-[#A2AF9B]/30 rounded-xl text-sm">
          <span className="text-lg">⏰</span>
          <span className="ml-2 font-semibold">{plan.startTime || "No time"}</span>
        </div>
        <div className="flex items-center bg-white shadow-sm p-3 border border-[#A2AF9B]/30 rounded-xl text-sm">
          <span className="text-lg">⏳</span>
          <span className="ml-2 font-semibold">{plan.durationMinutes} min</span>
        </div>
        <div className="flex items-center bg-white shadow-sm p-3 border border-[#A2AF9B]/30 rounded-xl text-sm">
          <span className="text-lg">📌</span>
          <span className={`ml-2 font-semibold px-2 py-1 rounded-md text-xs ${getDeadlineStatus()} truncate`} title={formatDate(plan.deadline)}>
            {formatDate(plan.deadline)}
          </span>
        </div>
      </div>

      <div className="flex gap-3 mt-4 pt-4 border-[#A2AF9B]/30 border-t">
        {!plan.completed && (
          <button onClick={handleComplete} className="flex flex-1 justify-center items-center bg-gradient-to-r from-green-600 hover:from-green-700 to-green-700 hover:to-green-800 shadow-md hover:shadow-lg px-4 py-2.5 rounded-xl font-medium text-white transition-all" title="Mark as completed">
            <span className="mr-2">✅</span> Mark Done
          </button>
        )}
        <button onClick={() => setIsEditing(true)} className="flex flex-1 justify-center items-center bg-gradient-to-r from-[#A2AF9B] hover:from-[#8D9C84] to-[#8D9C84] hover:to-[#7A8972] shadow-md hover:shadow-lg px-4 py-2.5 rounded-xl font-medium text-white transition-all" title="Edit study plan">
          <span className="mr-2">✏️</span> Edit
        </button>
        <button onClick={handleDelete} className="flex flex-1 justify-center items-center bg-gradient-to-r from-gray-300 hover:from-gray-400 to-gray-400 hover:to-gray-500 shadow-md hover:shadow-lg px-4 py-2.5 rounded-xl font-medium text-gray-800 transition-all" title="Delete study plan">
          <span className="mr-2">🗑️</span> Delete
        </button>
      </div>

      {isEditing && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white shadow-2xl p-6 border border-[#A2AF9B]/40 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="flex items-center font-bold text-[#2F3E2F] text-xl">
                <span className="mr-2">✏️</span> Edit Study Plan
              </h2>
              <button onClick={() => setIsEditing(false)} className="bg-gray-100 hover:bg-gray-200 p-1 rounded-full text-gray-500 hover:text-gray-700 text-lg transition-colors" title="Close">
                ✕
              </button>
            </div>
            <StudyForm
              initialData={plan}
              onAdded={() => {
                setIsEditing(false);
                onUpdate?.();
                Swal.fire({
                  title: "Updated!",
                  text: "Study plan has been updated successfully.",
                  icon: "success",
                  timer: 1500,
                  showConfirmButton: false,
                });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyCard;
