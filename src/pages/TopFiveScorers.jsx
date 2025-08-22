import React from "react";
import { useSelector } from "react-redux";
import { useGetTopScorersQuery } from "../slices/playerApiSlice";
export default function TopFiveScorers() {
  const dbName = useSelector((state) => state.database.dbName);
  const {
    data: topScorersData = [],
    isLoading: scorersLoading,
    isError: scorersError,
    refetch: refetchScorers,
  } = useGetTopScorersQuery(dbName)
  if (scorersLoading) return <p>Loading...</p>
  const topFive = topScorersData?.slice(0, 5);

  return (
    <div className="w-full overflow-x-auto space-y-4">
      {/*<h2 className="text-xl font-semibold">Top 5 Scorers</h2>*/}

      { topScorersData.length === 0 ? <p> No data</p> : (<table className="min-w-full border border-gray-200 rounded-lg shadow text-sm">
        <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900">
          <tr>
            <th className="px-4 py-2 text-left"></th>
            <th className="px-4 py-2 text-left"></th>
            <th className="px-4 py-2 text-left"></th>
            <th className="px-4 py-2 text-left">Goals</th>
          </tr>
        </thead>
        <tbody>
          {topFive.map((player, index) => (
            <tr
              key={player.player._id}
              className={`${
                index === 0 ? "bg-yellow-100" : index % 2 === 0 ? "bg-white" : "bg-blue-50"
              }`}
            >
              <td className={`px-4 py-3 ${index === 0 ? "font-bold text-lg" : ""}`}>{index + 1}</td>
              <td className={`px-4 py-3 ${index === 0 ? "text-lg font-bold" : ""}`}>
                <div className="flex flex-col">
                    <span className="">{player?.player?.manager}</span>
                    <a
                      href={`https://fantasy.premierleague.com/entry/${player?.player?.fplId}/history`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {player?.player?.teamName}
                    </a>
                    {player?.player?.xHandle && (
                      <a
                        href={`https://x.com/${player?.player?.xHandle.replace(/^@/, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-500 hover:underline"
                      >
                        {player?.player?.xHandle}
                      </a>
                    )}
                  </div>
                
              </td>
              <td className={`px-4 py-2 ${index === 0 ? "font-bold text-lg" : ""}`}>
                {player.player.position}
              </td>
              <td className={`px-4 py-2 text-center ${index === 0 ? "font-bold text-lg" : ""}`}>
                {player.goals}
              </td>
            </tr>
          ))}
        </tbody>
      </table>)}
    </div>
  );
}
