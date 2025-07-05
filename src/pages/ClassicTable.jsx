import React from "react";
import { useGetClassicTableQuery } from "../slices/tableApiSlice";
import { useSelector } from "react-redux";

export default function ClassicTable() {
  const dbName = useSelector((state) => state.database.dbName);
  const { data = [], isLoading } = useGetClassicTableQuery(dbName);

  if (isLoading) return <p>Loading Classic Table...</p>;

  return (
    <div className="overflow-auto rounded-lg border">
        <table className="min-w-full border border-gray-200 rounded-lg shadow text-sm">
            <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900">
          <tr>
            <th className="px-4 py-2 text-left font-semibold">Team</th>
            <th className="px-4 py-2 text-left ">P</th>
            <th className="px-4 py-2 text-left">W</th>
            <th className="px-4 py-2 text-left">D</th>
            <th className="px-4 py-2 text-left">L</th>
            <th className="px-4 py-2 text-left">PF</th>
            <th className="px-4 py-2 text-left">PA</th>
            <th className="px-4 py-2 text-left">PD</th>
            <th className="px-4 py-2 text-left">Pts</th>
            <th className="px-4 py-2 text-left">Last 5</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => {
            const {
              team,
              played,
              win,
              draw,
              loss,
              goalsFor,
              goalsAgainst,
              goalDifference,
              points,
              result,
            } = entry;

            const lastFive = result?.slice(-5);

            return (
              <tr key={team._id} className={index % 2 === 0 ? "bg-white" : "bg-blue-100"}>
                <td className="px-4 py-3 font-medium">{team.name}</td>
                <td className="px-4 py-2">{played}</td>
                <td className="px-4 py-2">{win}</td>
                <td className="px-4 py-2">{draw}</td>
                <td className="px-4 py-2">{loss}</td>
                <td className="px-4 py-2">{goalsFor}</td>
                <td className="px-4 py-2">{goalsAgainst}</td>
                <td className="px-4 py-2">{goalDifference}</td>
                <td className="px-4 py-2 font-semibold">{points}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-1">
                    {lastFive.map((r, i) => {
                      const color =
                        r.result === "W"
                          ? "bg-green-500"
                          : r.result === "L"
                          ? "bg-red-500"
                          : "bg-gray-500";
                      return (
                        <div
                          key={i}
                          className={`w-5 h-5 text-[11px] font-bold text-white rounded flex items-center justify-center ${color}`}
                          title={`GW${r?.event}: ${r?.result} (${r?.score})`}
                        >
                          {r?.result}
                        </div>
                      );
                    })}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

