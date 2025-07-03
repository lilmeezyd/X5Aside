import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  useFetchF1StandingsQuery,
  useFetchF1ByEventQuery,
} from "../slices/f1Api";

export default function F1Table() {
  const dbName = useSelector((state) => state.database.dbName);
  const [eventId, setEventId] = useState(null);

  const {
    data: standings,
    isLoading: isLoadingStandings,
  } = useFetchF1StandingsQuery(dbName);

  const {
    data: eventResults,
    isLoading: isLoadingEvent,
  } = useFetchF1ByEventQuery(
    { dbName, eventId },
    { skip: !eventId } // only fetch if eventId is selected
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
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
            <F1TableDisplay data={eventResults} isEvent />
          )}
        </>
      ) : (
        <>
          {isLoadingStandings ? (
            <div>Loading...</div>
          ) : (
            <F1TableDisplay data={standings} />
          )}
        </>
      )}
    </div>
  );
}

function F1TableDisplay({ data, isEvent = false }) {
  if (!data || data.length === 0) return <div>No data</div>;

  return (
    <div className="overflow-x-auto border rounded">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">#</th>
            <th className="p-2 text-left">Team</th>
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
          {data.map((team, index) => (
            <tr key={team.teamId} className="border-t">
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{team.teamName}</td>
              {isEvent ? (
                <>
                  <td className="p-2 text-center">{team.totalPoints}</td>
                  <td className="p-2 text-center font-bold">{team.score}</td>
                </>
              ) : (
                <td className="p-2 text-center font-bold">{team.totalScore}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
