import React from "react";
import { useGetPlayerTableQuery } from "../slices/tableApiSlice";
import { useSelector } from "react-redux";
export default function PlayerTable() {
  const dbName = useSelector((state) => state.database.dbName);
  const { data: leaderboard= [], isLoading, isError } = useGetPlayerTableQuery(dbName);
  if (isLoading) return <p>Loading....</p>
  const topFive = leaderboard?.slice(0, 5);
  
  const imageComp =
    dbName === "X5Aside" ? "X5" : dbName === "app5Aside" ? "FFK" : "X5";

  const imageBaseURL = "https://ik.imagekit.io/cap10/";

  return (
      <div className="w-full overflow-x-auto space-y-4"> 
      {/*<h2 className="text-xl font-semibold mb-2">Top 5 Players</h2>*/}
     { leaderboard.length === 0? <p>No data</p> : (<table className="min-w-full text-sm">
        <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900">
          <tr>
            <th className="px-4 py-2 text-left"></th>
            <th className="px-4 py-2 text-left font-semibold"></th>
            <th className="px-4 py-2 text-left">P</th>
            <th className="px-4 py-2 text-left">Pts</th> 
          </tr>
        </thead>
        <tbody>
          {topFive?.map((entry, index) => {
            const {
              player,
              played,
              points,
            } = entry;

            return (
                <tr
                  key={player._id}
                  className={index === 0 ? "bg-yellow-100 text-font-bold" : index % 2 === 0 ? "bg-white text-sm" : "bg-blue-50 text-sm"}
                >
                  <td className={`px-4 py-3 ${index === 0 ? "font-bold text-lg" : ""}`}>{index + 1}</td>

                  <td className={`px-4 py-3 ${index === 0 ? "font-bold text-lg" : ""}`}>
                  <div className="flex flex-col text-sm w-32 p-1 relative">
                    <span className="truncate">{player.manager}</span>
                    {(dbName === "X5Aside" || dbName === "app5Aside" || dbName === "ffkPro") ? (
                      <a
                        href={entry.eventId ? 
                      `https://fantasy.premierleague.com/entry/${player.fplId}/event/${entry.eventId}` : 
                    `https://fantasy.premierleague.com/entry/${player.fplId}/history`}
                        target="_blank"
                        rel="noreferrer"
                      className="text-blue-600 hover:underline truncate"
                    >
                      {player.teamName}
                    </a>) : <span className="truncate font-semibold">{player.teamName}</span>}
                    {player.xHandle && (
                      <a
                        href={`https://x.com/${player.xHandle.replace(/^@/, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-500 hover:underline truncate"
                      >
                        {player.xHandle}
                      </a>
                    )}
                    <img
                                  src={`${imageBaseURL}${entry.team?.short_name}_${imageComp}.png`}
                                  alt={entry.team?.short_name}
                                  className="custom-shadow w-6 h-6 object-contain absolute border border-blue-500 bg-white bottom-0 right-0 rounded-full p-1"
                                />
                  </div>
                </td>
                  <td className={`px-4 py-2 ${index === 0 ? "font-bold text-lg" : "font-semibold"}`}>{played}</td>
                  <td className={`px-4 py-2 ${index === 0 ? "font-bold text-lg" : "font-semibold"}`}>{points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>)}
    </div>
  );
}
