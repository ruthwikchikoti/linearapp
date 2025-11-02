import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "./api";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences?: {
    theme?: "light" | "dark";
  };
}

interface Team {
  _id: string;
  name: string;
  identifier: string;
}

interface AppContextType {
  user: User | null;
  currentTeam: Team | null;
  teams: Team[];
  setCurrentTeam: (team: Team) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Initialize with mock user and team for demo
    const mockUser: User = {
      _id: "1",
      name: "Demo User",
      email: "demo@linear.app",
      preferences: { theme: "dark" },
    };
    setUser(mockUser);
    setTheme(mockUser.preferences?.theme || "dark");

    // Fetch teams
    api.get("/team").then((res) => {
      const teamsData = res.data;
      setTeams(teamsData);
      if (teamsData.length > 0) {
        setCurrentTeam(teamsData[0]);
      }
    }).catch(() => {
      // Fallback mock team
      const mockTeam: Team = {
        _id: "1",
        name: "Engineering",
        identifier: "ENG",
      };
      setTeams([mockTeam]);
      setCurrentTeam(mockTeam);
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        currentTeam,
        teams,
        setCurrentTeam,
        theme,
        setTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}

