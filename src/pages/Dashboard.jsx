import { useDatabase } from "../hooks/useDatabase";
import { Button } from "../../@/components/ui/button";
import React, { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import SelectDB from "./SelectDB";
const TopFiveScorers = lazy(() => import("../pages/TopFiveScorers"));
const TopFivePlayersH2H = lazy(() => import("../pages/TopFivePlayersH2H"));
const TopFiveTeamsClassic = lazy(() => import("../pages/TopFiveTeamsClassic"));
const TopFiveTeamsH2H = lazy(() => import("../pages/TopFiveTeamsH2H"));
const TopFiveTeamsF1 = lazy(() => import("../pages/TopFiveTeamsF1"));
const Dashboard = () => {
  const { dbName, changeDb } = useDatabase();
  const userInfo = useSelector((state) => state.auth.userInfo);
  return (
    <div className="min-w-[320px] sm:w-full relative">
      <h2 className="text-2xl font-bold mb-4 mt-15 md:mt-0">Home</h2>
      {!userInfo && <SelectDB />}
      {/* DB Selection */}
      {userInfo && (
        <div className="mb-4">
          <label className="font-semibold">Select Database: </label>
          <select
            value={dbName}
            onChange={(e) => changeDb(e.target.value)}
            className="ml-2 border px-2 py-1 rounded"
          >
            <option value="">-- Select DB --</option>
            <option value="ffkPro">FFK Pro</option>
            {/*<option value="test">Test</option>*/}
            <option value="app5Aside">WhatsApp 2026/27</option>
            <option value="X5Aside">X5Aside 2026/27</option>
            <option value="app5Aside2526">WhatsApp 2025/26</option>
            <option value="X5Aside2526">X5Aside 2025/26</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Using database:{" "}
            <span className="font-semibold">
              {dbName === "app5Aside"
                ? "WhatsApp 5 Aside"
                : dbName === "X5Aside"
                  ? "X 5 Aside"
                  : dbName === "ffkPro"
                    ? "FFK Pro"
                    : dbName === "app5Aside2526"
                ? "WhatsApp 5 Aside 2025/26" : dbName === "X5Aside2526"
                  ? "X 5 Aside 2025/26" : "none"}
            </span>
          </p>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 py-4">
        <div className="bg-white p-4 rounded-lg shadow-lg box-shadow">
          <div className="p-2 dashboard-bg">
            <h3 className="text-lg font-semibold">Top Scorers</h3>
          </div>
          <TopFiveScorers />
        </div>
        {dbName !== "ffkPro" && (
          <div className="bg-white p-4 rounded-lg shadow-lg box-shadow">
            <div className="p-2 dashboard-bg">
              <h3 className="text-lg font-semibold">Players H2H </h3>
            </div>
            <TopFivePlayersH2H />
          </div>
        )}
        {/* <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Upcoming Fixtures</h3>
          <p className="text-2xl font-bold text-orange-600">6</p>
        </div>*/}
        <div className="bg-white p-4 rounded-lg shadow-lg box-shadow">
          <div className="p-2 dashboard-bg">
            <h3 className="text-lg font-semibold">Classic Standings</h3>
          </div>
          <TopFiveTeamsClassic />
        </div>
        {dbName !== "ffkPro" && (
          <div className="bg-white p-4 rounded-lg shadow-lg box-shadow">
            <div className="p-2 dashboard-bg">
              <h3 className="text-lg font-semibold">H2H Standings</h3>
            </div>
            <TopFiveTeamsH2H />
          </div>
        )}
        {dbName !== "ffkPro" && (
          <div className="bg-white p-4 rounded-lg shadow-lg box-shadow">
            <div className="p-2 dashboard-bg">
              <h3 className="text-lg font-semibold">F1 Format Standings</h3>
            </div>
            <TopFiveTeamsF1 />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
