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
  } = useGetTopScorersQuery(dbName);
  if (scorersLoading) return <p>Loading...</p>;
  const topFive = [...topScorersData]
    ?.sort(
      (a, b) =>
        b.goals - a.goals ||
        b.assists - a.assists ||
        a.yellows - b.yellows ||
        (a?.player?.fplId ?? 0) - (b?.player?.fplId ?? 0),
    )
    ?.slice(0, 5);
  const imageComp =
    dbName === "X5Aside" ? "X5" : dbName === "app5Aside" ? "FFK" : "X5";

  const imageBaseURL = "https://ik.imagekit.io/cap10/";
 
  return (
    <div className="w-full overflow-x-auto space-y-4">
      {/*<h2 className="text-xl font-semibold">Top 5 Scorers</h2>*/}

      {topScorersData.length === 0 ? (
        <p> No data</p>
      ) : (
        <table className="min-w-full text-sm">
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
                  index === 0
                    ? "bg-yellow-100"
                    : index % 2 === 0
                      ? "bg-white"
                      : "bg-blue-50"
                }`}
              >
                <td
                  className={`px-4 py-3 ${index === 0 ? "font-bold text-lg" : ""}`}
                >
                  {index + 1}
                </td>
                <td
                  className={`px-4 py-3 ${index === 0 ? "text-lg font-bold" : ""}`}
                >
                  <div className="flex flex-col w-32 p-1 relative">
                    <span className="truncate">{player?.player?.manager}</span>
                    {(dbName === "X5Aside" || dbName === "app5Aside" || dbName === "ffkPro") ? (
                      <a
                        href={
                          player?.eventId
                            ? `https://fantasy.premierleague.com/entry/${player?.player?.fplId}/event/${player?.eventId}`
                            : `https://fantasy.premierleague.com/entry/${player?.player?.fplId}/history`
                        }
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline truncate"
                    >
                      {player?.player?.teamName}
                    </a>) : <span className="truncate font-semibold">{player?.player?.teamName}</span>}
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
                    <img
                      src={
                            dbName === "ffkPro"
                              ? player?.team.url
                              : `${imageBaseURL}${player?.team?.short_name}_${imageComp}.png`
                          }
                      alt={player.team?.short_name}
                      className="custom-shadow w-6 h-6 object-contain absolute border border-blue-500 bg-white bottom-0 right-0 rounded-full p-1"
                    />
                  </div>
                </td>
                <td
                  className={`px-4 py-2 ${index === 0 ? "font-bold text-lg" : ""}`}
                >
                  {player.player.position}
                </td>
                <td
                  className={`px-4 py-2 text-center ${index === 0 ? "font-bold text-lg" : ""}`}
                >
                  {player.goals}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
