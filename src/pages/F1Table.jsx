import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  useFetchF1StandingsQuery,
  useFetchF1ByEventQuery,
} from "../slices/f1ApiSlice";
import { FaArrowCircleDown, FaArrowCircleUp, FaCircle } from "react-icons/fa";

export default function F1Table() {
  const dbName = useSelector((state) => state.database.dbName);
  const [eventId, setEventId] = useState(null);
  const imageComp =
    dbName === "X5Aside" ? "X5" : dbName === "app5Aside" ? "FFK" : "X5";

  const { data: standings, isLoading: isLoadingStandings } =
    useFetchF1StandingsQuery(dbName);

  const { data: eventResults, isLoading: isLoadingEvent } =
    useFetchF1ByEventQuery(
      { dbName, eventId },
      { skip: !eventId }, // only fetch if eventId is selected
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-4">
        <label className="font-medium">View Gameweek:</label>
        <select
          onChange={(e) => setEventId(Number(e.target.value))}
          value={eventId || ""}
          className="p-2 border rounded"
        >
          <option value="">-- Total Standings --</option>
          {Array.from({ length: 38 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              GW {i + 1}
            </option>
          ))}
        </select>
      </div>

      {eventId ? (
        <>
          {isLoadingEvent ? (
            <div>Loading...</div>
          ) : (
            <F1TableDisplay data={eventResults} isEvent imageComp={imageComp} />
          )}
        </>
      ) : (
        <>
          {isLoadingStandings ? (
            <div>Loading...</div>
          ) : (
            <F1TableDisplay data={standings} imageComp={imageComp} />
          )}
        </>
      )}
    </div>
  );
}

function F1TableDisplay({ data, isEvent = false, imageComp }) {
  const imageBaseURL = "https://ik.imagekit.io/cap10/";
  if (!data || data.length === 0) return <div>No data</div>;

  return (
    <div className="overflow-x-auto border rounded">
      <table className="min-w-full border border-gray-200 rounded-lg shadow text-sm">
        <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900">
          <tr>
            <th className="p-2 text-left w-16"></th>
            <th className="p-2 text-left"></th>
            {isEvent ? (
              <>
                <th className="p-2 text-center">Points</th>
                <th className="p-2 text-center">Score</th>
              </>
            ) : (
              <th className="p-2 text-center">Total Score</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data?.map((entry, index) => (
            <tr
              key={entry.teamId.id}
              className={index % 2 === 0 ? "bg-white" : "bg-blue-100"}
            >
              <td className="p-2 font-bold">
                <div className="flex items-center justify-between w-16">
                  <span className="text-center w-1/3">{entry.rank ?? index + 1}</span>
                  <span>
                    {entry.oldRank > entry.rank && entry.oldRank > 0 && (
                      <FaArrowCircleUp className="text-green-500" size={16} />
                    )}
                    {(entry.oldRank === entry.rank || entry.oldRank === 0) && (
                      <FaCircle className="text-gray-500" size={16} />
                    )}
                    {entry.oldRank < entry.rank && entry.oldRank > 0 && (
                      <FaArrowCircleDown className="text-red-500" size={16} />
                    )}
                  </span>
                  <div
                    className={`font-bold text-center w-1/3 ${
                      entry.oldRank > 0
                        ? entry.oldRank < entry.rank
                          ? "text-red-500"
                          : entry.oldRank > entry.rank
                            ? `text-green-500`
                            : "text-gray-500"
                        : "text-gray-500"
                    }`}
                  >
                    {entry.oldRank > 0
                      ? entry.oldRank < entry.rank
                        ? entry.oldRank - entry.rank
                        : entry.oldRank > entry.rank
                          ? `+${entry.oldRank - entry.rank}`
                          : ""
                      : ""}
                  </div>
                </div>
              </td>
              <td className="px-4 py-2">
                <div className="flex items-center gap-2 w-36">
                  <img
                    src={`${imageBaseURL}${entry?.teamId?.short_name}_${imageComp}.png`}
                    alt={entry?.teamId?.name}
                    className="w-6 h-6 object-contain"
                  />
                  <span className="font-bold truncate whitespace-nowrap overflow-hidden">
                    {entry?.teamId?.name}
                  </span>
                </div>
              </td>
              {isEvent ? (
                <>
                  <td className="p-2 text-center">{entry.totalPoints}</td>
                  <td className="p-2 text-center font-bold">{entry.score}</td>
                </>
              ) : (
                <td className="p-2 text-center font-bold">{entry.totalScore}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
