import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  useFetchF1StandingsQuery,
} from "../slices/f1ApiSlice";

export default function TopFiveTeamsF1() {
  const dbName = useSelector((state) => state.database.dbName);
  const imageComp = dbName === 'X5Aside' ? 'X5' : dbName === 'app5Aside' ? 'FFK' : null
  const imageBaseURL = "https://ik.imagekit.io/cap10/"

  const {
    data: standings = [],
    isLoading: isLoadingStandings,
  } = useFetchF1StandingsQuery(dbName);
if(isLoadingStandings) return <p>Loading...</p>
  const newStandings = standings?.slice(0, 5);

  return (
      <div className="w-full overflow-x-auto space-y-4">
      { standings?.length === 0 ? <p>No data</p> : (<table className="min-w-full border border-gray-200 rounded-lg shadow text-sm">
            <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900">
          <tr>
            <th className="p-2 text-left"></th>
            <th className="p-2 text-left"></th>
              <th className="p-2 text-center">Total Score</th>
            
          </tr>
        </thead>
        <tbody>
          {newStandings?.map((team, index) => (
      <tr
        key={team.teamId.id}
        className={`${
          index === 0
            ? "bg-yellow-100 text-lg font-bold shadow-md"
            : index % 2 === 0
            ? "bg-white"
            : "bg-blue-100"
        }`}
      >
        <td className="p-2">{index + 1}</td>
        <td className="px-4 py-2">
          <div className="flex items-center gap-2 w-36">
            <img
              src={`${imageBaseURL}${team?.teamId?.short_name}_${imageComp}.png`}
              alt={team?.teamId?.name}
              className="w-6 h-6 object-contain"
            />
            <span className="truncate whitespace-nowrap overflow-hidden">
              {team?.teamId?.name}
            </span>
          </div>
        </td>
        <td className="p-2 text-center font-bold">{team.totalScore}</td>
      </tr>
)) 
          }
        </tbody>
      </table>)}
    </div>
  );
}
