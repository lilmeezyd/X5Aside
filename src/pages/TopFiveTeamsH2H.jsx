import React from "react";
import { useSelector } from "react-redux";
import { useGetH2HTableQuery } from "../slices/tableApiSlice";

export default function TopFiveTeamsH2H() {
  const dbName = useSelector((state) => state.database.dbName);
  const { data = [], isLoading } = useGetH2HTableQuery(dbName);

  if (isLoading) return <p>Loading Table...</p>;

  const imageBaseURL = "https://ik.imagekit.io/cap10/";
  const topFive = data?.slice(0, 5);

  return (
      <div className="w-full overflow-x-auto space-y-4">
      {/*<h2 className="text-xl font-semibold mb-2">Top 5 Teams</h2>*/}
     {data?.length === 0 ? <p>No data</p> : (<table className="min-w-full border border-gray-200 rounded-lg shadow text-sm">
        <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900">
          <tr>
            <th className="px-4 py-2 text-left font-semibold"></th>
            <th className="px-4 py-2 text-left font-semibold"></th>
            <th className="px-4 py-2 text-left">P</th>
            <th className="px-4 py-2 text-left">Pts</th>
          </tr>
        </thead>
        <tbody>
          {topFive?.map((entry, index) => {
            const {
              team,
              played,
              points,
            } = entry;

            const isTopOne = index === 0;

            return (
              <tr
                key={team._id}
                className={`${
                  isTopOne ? "bg-yellow-100" : index % 2 === 0 ? "bg-white" : "bg-blue-50"
                }`}
              >
                <td className={`px-4 py-2 ${isTopOne ? "font-bold text-lg" : "font-semibold"}`}>
                  {index + 1}
                </td>
                <td className="px-4 py-2">
                  <div className={`flex items-center gap-2 w-36 ${isTopOne ? "text-lg font-bold" : ""}`}>
                    <img
                      src={`${imageBaseURL}${team.short_name}.webp`}
                      alt={team.name}
                      className="w-6 h-6 object-contain"
                    />
                    <span className="truncate whitespace-nowrap overflow-hidden">
                      {team.name}
                    </span>
                  </div>
                </td>
                  <td className={`px-4 py-2 ${isTopOne ? "font-bold text-lg" : "font-semibold"}`}>{played}</td>
                <td className={`px-4 py-2 ${isTopOne ? "font-bold text-lg" : "font-semibold"}`}>
                  {points}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>)}
    </div>
  );
}
