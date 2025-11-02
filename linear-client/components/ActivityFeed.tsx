import { useEffect, useState } from "react";
import { activityAPI } from "../lib/api";
import { useApp } from "../lib/context";
import User from "./icons/User";

export default function ActivityFeed() {
  const { currentTeam, user } = useApp();
  const [activities, setActivities] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "assigned" | "mentions">("all");

  useEffect(() => {
    fetchActivities();
  }, [currentTeam, filter, user]);

  const fetchActivities = async () => {
    try {
      const params: any = { team: currentTeam?._id };
      if (filter === "assigned" && user) {
        params.user = user._id;
      }
      const res = await activityAPI.getAll(params);
      const allActivities = res.data || [];
      
      // Filter mentions if needed
      let filtered = allActivities;
      if (filter === "mentions" && user) {
        filtered = allActivities.filter((act: any) =>
          act.data?.mentions?.includes(user._id)
        );
      }
      
      setActivities(filtered.slice(0, 50));
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "issue_created":
        return "➕";
      case "issue_updated":
        return "✏️";
      case "issue_assigned":
        return "👤";
      case "comment_added":
        return "💬";
      case "status_changed":
        return "🔄";
      case "mention":
        return "@";
      default:
        return "📝";
    }
  };

  const getActivityText = (activity: any) => {
    const userName = activity.user?.name || "Someone";
    switch (activity.type) {
      case "issue_created":
        return `${userName} created issue ${activity.data?.issueId || ""}`;
      case "issue_updated":
        return `${userName} updated an issue`;
      case "issue_assigned":
        return `${userName} assigned an issue`;
      case "comment_added":
        return `${userName} added a comment`;
      case "status_changed":
        return `${userName} changed status from ${activity.data?.oldStatus} to ${activity.data?.newStatus}`;
      case "mention":
        return `${userName} mentioned you`;
      default:
        return `${userName} performed an action`;
    }
  };

  return (
    <div className="activity-feed">
      <div className="activity-header">
        <h2>Activity</h2>
        <div className="activity-filters">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={filter === "assigned" ? "active" : ""}
            onClick={() => setFilter("assigned")}
          >
            Assigned
          </button>
          <button
            className={filter === "mentions" ? "active" : ""}
            onClick={() => setFilter("mentions")}
          >
            Mentions
          </button>
        </div>
      </div>
      <div className="activity-list">
        {activities.map((activity) => (
          <div key={activity._id} className="activity-item">
            <div className="activity-icon">{getActivityIcon(activity.type)}</div>
            <div className="activity-content">
              <p className="activity-text">{getActivityText(activity)}</p>
              {activity.issue && (
                <span className="activity-issue">
                  {activity.issue.title || activity.issue.issueId}
                </span>
              )}
              <span className="activity-time">
                {new Date(activity.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
        {activities.length === 0 && (
          <div className="empty-state">
            <p>No activity yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

