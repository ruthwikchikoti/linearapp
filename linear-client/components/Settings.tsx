import { useState, useEffect } from "react";
import { useApp } from "../lib/context";
import { userAPI } from "../lib/api";

export default function Settings() {
  const { user, theme, setTheme } = useApp();
  const [settings, setSettings] = useState({
    theme: theme,
    notifications: true,
    emailNotifications: true,
  });

  useEffect(() => {
    if (user?.preferences) {
      setSettings({
        theme: user.preferences.theme || "dark",
        notifications: user.preferences.notifications ?? true,
        emailNotifications: user.preferences.emailNotifications ?? true,
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    try {
      await userAPI.update(user._id, {
        preferences: settings,
      });
      setTheme(settings.theme as "light" | "dark");
      alert("Settings saved!");
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      
      <div className="settings-section">
        <h2>Appearance</h2>
        <div className="settings-group">
          <label>Theme</label>
          <select
            value={settings.theme}
            onChange={(e) =>
              setSettings({ ...settings, theme: e.target.value as "light" | "dark" })
            }
            className="settings-select"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
      </div>

      <div className="settings-section">
        <h2>Notifications</h2>
        <div className="settings-group">
          <label className="settings-toggle">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) =>
                setSettings({ ...settings, notifications: e.target.checked })
              }
            />
            <span>Enable notifications</span>
          </label>
        </div>
        <div className="settings-group">
          <label className="settings-toggle">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) =>
                setSettings({ ...settings, emailNotifications: e.target.checked })
              }
            />
            <span>Email notifications</span>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h2>Keyboard Shortcuts</h2>
        <div className="shortcuts-list">
          <div className="shortcut-item">
            <kbd>⌘K</kbd> / <kbd>Ctrl+K</kbd>
            <span>Open command palette</span>
          </div>
          <div className="shortcut-item">
            <kbd>Esc</kbd>
            <span>Close modal</span>
          </div>
          <div className="shortcut-item">
            <kbd>I</kbd>
            <span>Create new issue</span>
          </div>
        </div>
      </div>

      <button onClick={handleSave} className="save-settings-btn">
        Save Settings
      </button>
    </div>
  );
}

