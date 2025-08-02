import { useDatabase } from "../hooks/useDatabase";
import { Button } from '../../@/components/ui/button'
import React, { lazy, Suspense } from 'react';
const TopFiveScorers = lazy(() => import('../pages/TopFiveScorers'));
const TopFivePlayersH2H = lazy(() => import ('../pages/TopFivePlayersH2H'));
const TopFiveTeamsClassic = lazy(() => import('../pages/TopFiveTeamsClassic'));
const TopFiveTeamsH2H = lazy(() => import('../pages/TopFiveTeamsH2H'));
const TopFiveTeamsF1 = lazy(() => import('../pages/TopFiveTeamsF1'));
const Dashboard = () => {
  const { dbName, changeDb } = useDatabase();
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      {/* DB Selection */}
      <div className="mb-4">
        <label className="font-semibold">Select Database: </label>
        <select
          value={dbName}
          onChange={(e) => changeDb(e.target.value)}
          className="ml-2 border px-2 py-1 rounded"
        >
          <option value="">-- Select DB --</option>
          <option value="app5Aside">WhatsApp</option>
          <option value="X5Aside">X5Aside</option>
        </select>
        <p className="text-sm text-gray-500 mt-1">
          Using database: <span className="font-semibold">{dbName === 'app5Aside' ? 'WhatsApp 5 Aside' : dbName === 'X5Aside' ? 'X 5 Aside' : "none"}</span>
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Top Scorers</h3>
          <TopFiveScorers />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Players H2H </h3>
          <TopFivePlayersH2H />
        </div>
        {/* <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Upcoming Fixtures</h3>
          <p className="text-2xl font-bold text-orange-600">6</p>
        </div>*/}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Classic Standings</h3>
          <TopFiveTeamsClassic />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">H2H Standings</h3>
          <TopFiveTeamsH2H />
        </div>
      <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">F1 Format Standings</h3>
          <TopFiveTeamsF1 />
      </div>
    </div>
      </div>
  )
}

export default Dashboard
