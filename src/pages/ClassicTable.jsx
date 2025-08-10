import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useGetClassicTableQuery } from "../slices/tableApiSlice";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../@/components/ui/tabs";

export default function ClassicTable() {
  const dbName = useSelector((state) => state.database.dbName);
  const { data = [], isLoading } = useGetClassicTableQuery(dbName);
  const [view, setView] = useState("short");
  const imageComp = dbName === 'X5Aside' ? 'X5' : dbName === 'app5Aside' ? 'FFK' : null
  if (isLoading) return <p>Loading Classic Table...</p>;

  const imageBaseURL = "https://ik.imagekit.io/cap10/";

  return (
    <Tabs defaultValue="short" value={view} onValueChange={setView}>
      <TabsList className="mb-4 flex gap-2">
        <TabsTrigger value="short">Short Table</TabsTrigger>
        <TabsTrigger value="full">Full Table</TabsTrigger>
      </TabsList>
      {data?.length === 0 ? <p>No data</p> :
        ( <>
      {/* Short Table */}
      <TabsContent value="short">
        <div className="overflow-auto rounded-lg border">
          <table className="min-w-full border border-gray-200 rounded-lg shadow text-sm">
            <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900">
              <tr>
                <th className="px-4 py-2 text-left font-semibold sticky left-0 bg-gradient-to-r from-blue-100 to-blue-200 z-20"></th>
                <th className="px-4 py-2 text-left font-semibold sticky left-12 bg-gradient-to-r from-blue-100 to-blue-200 z-20 border-r border-gray-300">
                </th>
                <th className="px-4 py-2 text-left">P</th>
                <th className="px-4 py-2 text-left">GD</th>
                <th className="px-4 py-2 text-left">Pts</th>
                <th className="px-4 py-2 text-left">Form</th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry, index) => {
                const {
                  team,
                  played,
                  goalDifference,
                  points,
                  result,
                } = entry;
          const lastFive = [...(result || [])]
          .sort((a, b) => (Number(a.event) || 0) - (Number(b.event) || 0)) // oldest first
          .slice(-5); // last 5 in ascending order


                const isBottomThree = index >= data.length - 3;
      const isTopFour = index < 4

                return (
                  <tr
                    key={team._id}
                    className={`${
                      isBottomThree ? "bg-red-100" : isTopFour ? "bg-blue-200" : index % 2 === 0 ? "bg-white" : "bg-blue-50"
                    }`}
                  >
                    <td className="px-4 py-2 font-semibold sticky left-0 z-10 bg-inherit">{index + 1}</td>
                      <td className="px-4 py-2 sticky left-12 z-10 bg-inherit border-r border-gray-300">

                      <div className="flex items-center gap-2 w-36">
                        <img
                          src={`${imageBaseURL}${team.short_name}_${imageComp}.png`}
                          alt={team.name}
                          className="w-6 h-6 object-contain"
                        />
                        <span className="truncate whitespace-nowrap overflow-hidden">
                          {team.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2">{played}</td>
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
      </TabsContent>

      {/* Full Table */}
      <TabsContent value="full">
        <div className="overflow-auto rounded-lg border">
          <table className="min-w-full border border-gray-200 rounded-lg shadow text-sm">
            <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900">
              <tr>
                <th className="px-4 py-2 text-left font-semibold sticky left-0 bg-gradient-to-r from-blue-100 to-blue-200 z-20"></th>
                <th className="px-4 py-2 text-left font-semibold sticky left-12 bg-gradient-to-r from-blue-100 to-blue-200 z-20 border-r border-gray-300">
</th>
                <th className="px-4 py-2 text-left">P</th>
                <th className="px-4 py-2 text-left">W</th>
                <th className="px-4 py-2 text-left">D</th>
                <th className="px-4 py-2 text-left">L</th>
                <th className="px-4 py-2 text-left">GF</th>
                <th className="px-4 py-2 text-left">GA</th>
                <th className="px-4 py-2 text-left">GD</th>
                <th className="px-4 py-2 text-left">Pts</th>
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
                } = entry;
                const isBottomThree = index >= data.length - 3;
      const isTopFour = index < 4;

                return (
                  <tr
                    key={team._id}
                    className={`${
                      isBottomThree ? "bg-red-100" : isTopFour ? "bg-blue-200" : index % 2 === 0 ? "bg-white" : "bg-blue-50"
                    }`}
                  >
                      <td className="px-4 py-2 font-semibold sticky left-0 z-10 bg-inherit">{index + 1}</td>
                      <td className="px-4 py-2 sticky left-12 z-10 bg-inherit border-r border-gray-300">

                      <div className="flex items-center gap-2 w-36">
                        <img
                          src={`${imageBaseURL}${team.short_name}_${imageComp}.png`}
                          alt={team.name}
                          className="w-6 h-6 object-contain"
                        />
                        <span className="truncate whitespace-nowrap overflow-hidden">
                          {team.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2">{played}</td>
                    <td className="px-4 py-2">{win}</td>
                    <td className="px-4 py-2">{draw}</td>
                    <td className="px-4 py-2">{loss}</td>
                    <td className="px-4 py-2">{goalsFor}</td>
                    <td className="px-4 py-2">{goalsAgainst}</td>
                    <td className="px-4 py-2">{goalDifference}</td>
                    <td className="px-4 py-2 font-semibold">{points}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </TabsContent>
        </>)}
    </Tabs>
  );
}
