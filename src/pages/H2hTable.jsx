import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useGetH2HTableQuery } from "../slices/tableApiSlice";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../@/components/ui/tabs";
import { FaArrowCircleDown, FaArrowCircleUp, FaCircle } from "react-icons/fa";

export default function H2HTable() {
  const dbName = useSelector((state) => state.database.dbName);
  const { data = [], isLoading } = useGetH2HTableQuery(dbName);
  const [view, setView] = useState("short");
  const imageComp =
    dbName === "X5Aside" ? "X5" : dbName === "app5Aside" ? "FFK" : "X5";
  if (isLoading) return <p>Loading H2H Table...</p>;

  const imageBaseURL = "https://ik.imagekit.io/cap10/";

  return (
    <Tabs
      defaultValue="short"
      value={view}
      onValueChange={setView}
      className="w-full"
    >
      <TabsList className="mb-4 flex mx-auto w-[80%] gap-2">
        <TabsTrigger value="short">Short Table</TabsTrigger>
        <TabsTrigger value="full">Full Table</TabsTrigger>
        <TabsTrigger value="form">Form</TabsTrigger>
      </TabsList>

      {/* Short Table */}
      {data?.length === 0 ? (
        <p>No data</p>
      ) : (
        <>
          {/* Short Table */}
          <TabsContent value="short">
            <div className="overflow-auto rounded-lg border">
              <table className="min-w-full border border-gray-200 rounded-lg shadow text-sm">
                <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900">
                  <tr>
                    <th className="w-16 px-4 py-2 text-left font-semibold sticky left-0 bg-gradient-to-r from-blue-100 to-blue-200 z-20"></th>
                    <th className="px-4 py-2 text-left font-semibold sticky left-12 bg-gradient-to-r from-blue-100 to-blue-200 z-20 border-r border-gray-300"></th>
                    <th className="px-4 py-2 text-center">P</th>
                    <th className="px-4 py-2 text-center">GD</th>
                    <th className="px-4 py-2 text-center">Pts</th>
                    <th className="w-32 px-4 py-2 text-center">Form</th>
                    <th className="w-16 px-4 py-2 text-center">Next</th>
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
                      rank,
                    } = entry;
                    const lastFive = [...(result || [])]
                      .sort(
                        (a, b) =>
                          (Number(a.event) || 0) - (Number(b.event) || 0),
                      ) // oldest first
                      .slice(-5); // last 5 in ascending order

                    const isBottomThree = index >= data.length - 3;
                    const isTopFour = index < 4;

                    return (
                      <tr
                        key={team._id}
                        className={`${
                          isBottomThree
                            ? "bg-red-100"
                            : isTopFour
                              ? "bg-blue-200"
                              : index % 2 === 0
                                ? "bg-white"
                                : "bg-blue-50"
                        }`}
                      >
                        <td className="px-4 py-2 font-semibold sticky left-0 z-10 bg-inherit">
                          <div className="flex items-center justify-between w-16">
                            <span className="text-center w-1/3">{rank}</span>
                            <span>
                              {entry.oldRank > entry.rank &&
                                entry.oldRank > 0 && (
                                  <FaArrowCircleUp
                                    className="text-green-500"
                                    size={16}
                                  />
                                )}
                              {(entry.oldRank === entry.rank ||
                                entry.oldRank === 0) && (
                                <FaCircle className="text-gray-500" size={16} />
                              )}
                              {entry.oldRank < entry.rank &&
                                entry.oldRank > 0 && (
                                  <FaArrowCircleDown
                                    className="text-red-500"
                                    size={16}
                                  />
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
                        <td className="px-4 py-2 sticky left-12 z-10 bg-inherit border-r border-gray-300">
                          <div className="flex items-center gap-2 w-36">
                            <img
                              src={`${imageBaseURL}${team.short_name}_${imageComp}.png`}
                              alt={team.name}
                              className="w-6 h-6 object-contain"
                            />
                            <span className="font-bold truncate whitespace-nowrap overflow-hidden">
                              {team.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-center">{played}</td>
                        <td className="px-4 py-2 text-center">{goalDifference}</td>
                        <td className="px-4 py-2 font-semibold text-center">{points}</td>
                        <td className="px-4 py-2 text-center">
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
                                  className={`border border-gray-500 flex flex-col w-[30px] flex-shrink-0
 items-center justify-center text-[11px] font-bold text-white rounded-sm ${color}`}
                                  title={`GW${r?.event}: ${r?.result} (${r?.score})`}
                                >
                                  <div className="rounded-t-sm self-stretch text-center bg-white text-black">
                                    {r?.event}
                                  </div>
                                  <div className="">{r?.result}</div>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-center">
                          {entry.next === 'None' ? '-' : <img
                              src={`${imageBaseURL}${entry.next}_${imageComp}.png`}
                              alt={team.name}
                              className="w-6 h-6 object-contain"
                            />}
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
                    <th className="w-16 px-4 py-2 text-left font-semibold sticky left-0 bg-gradient-to-r from-blue-100 to-blue-200 z-20"></th>
                    <th className="px-4 py-2 text-left font-semibold sticky left-12 bg-gradient-to-r from-blue-100 to-blue-200 z-20 border-r border-gray-300"></th>
                    <th className="px-4 py-2 text-center">P</th>
                    <th className="px-4 py-2 text-center">W</th>
                    <th className="px-4 py-2 text-center">D</th>
                    <th className="px-4 py-2 text-center">L</th>
                    <th className="px-4 py-2 text-center">GF</th>
                    <th className="px-4 py-2 text-center">GA</th>
                    <th className="px-4 py-2 text-center">GD</th>
                    <th className="px-4 py-2 text-center">Pts</th>
                    <th className="w-16 px-4 py-2 text-center">Next</th>
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
                      rank,
                    } = entry;
                    const isBottomThree = index >= data.length - 3;
                    const isTopFour = index < 4;

                    return (
                      <tr
                        key={team._id}
                        className={`${
                          isBottomThree
                            ? "bg-red-100"
                            : isTopFour
                              ? "bg-blue-200"
                              : index % 2 === 0
                                ? "bg-white"
                                : "bg-blue-50"
                        }`}
                      >
                        <td className="px-4 py-2 font-semibold sticky left-0 z-10 bg-inherit">
                          <div className="flex items-center justify-between w-16">
                            <span className="text-center w-1/3">{rank}</span>
                            <span>
                              {entry.oldRank > entry.rank &&
                                entry.oldRank > 0 && (
                                  <FaArrowCircleUp
                                    className="text-green-500"
                                    size={16}
                                  />
                                )}
                              {(entry.oldRank === entry.rank ||
                                entry.oldRank === 0) && (
                                <FaCircle className="text-gray-500" size={16} />
                              )}
                              {entry.oldRank < entry.rank &&
                                entry.oldRank > 0 && (
                                  <FaArrowCircleDown
                                    className="text-red-500"
                                    size={16}
                                  />
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
                        <td className="px-4 py-2 sticky left-12 z-10 bg-inherit border-r border-gray-300">
                          <div className="flex items-center gap-2 w-36">
                            <img
                              src={`${imageBaseURL}${team.short_name}_${imageComp}.png`}
                              alt={team.name}
                              className="w-6 h-6 object-contain"
                            />
                            <span className="font-bold truncate whitespace-nowrap overflow-hidden">
                              {team.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-center">{played}</td>
                        <td className="px-4 py-2 text-center">{win}</td>
                        <td className="px-4 py-2 text-center">{draw}</td>
                        <td className="px-4 py-2 text-center">{loss}</td>
                        <td className="px-4 py-2 text-center">{goalsFor}</td>
                        <td className="px-4 py-2 text-center">{goalsAgainst}</td>
                        <td className="px-4 py-2 text-center">{goalDifference}</td>
                        <td className="px-4 py-2 font-semibold text-center">{points}</td>
                        <td className="px-4 py-2 text-center">
                          {entry.next === 'None' ? '-' : <img
                              src={`${imageBaseURL}${entry.next}_${imageComp}.png`}
                              alt={team.name}
                              className="w-6 h-6 object-contain"
                            />}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Form */}
          <TabsContent value="form">
            <div className="overflow-auto rounded-lg border">
              {data.map((entry, index) => {
                const { team, result } = entry;
                const lastFive = [...(result || [])].sort(
                  (a, b) => (Number(a.event) || 0) - (Number(b.event) || 0),
                ); // oldest first
                // last 5 in ascending order

                const isBottomThree = index >= data.length - 3;
                const isTopFour = index < 4;

                return (
                  <div
                    key={team._id}
                    className={`${
                      isBottomThree
                        ? "bg-red-100"
                        : isTopFour
                          ? "bg-blue-200"
                          : index % 2 === 0
                            ? "bg-white"
                            : "bg-blue-50"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-sm sm:text-base px-4 py-2 font-bold">
                        {index + 1}
                      </div>
                      <div className="px-4 py-2">
                        <div className="flex items-center gap-2 w-36">
                          <img
                            src={`${imageBaseURL}${team.short_name}_${imageComp}.png`}
                            alt={team.name}
                            className="w-6 h-6 object-contain"
                          />
                          <span className="text-sm sm:text-base font-bold truncate whitespace-nowrap overflow-hidden">
                            {team.name}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="overflow-x-auto border-t border-gray-600 min-w-[320px] px-4 py-2">
                      <div className="flex gap-2">
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
                              className={`border border-gray-500 flex flex-col w-[30px] flex-shrink-0
 items-center justify-center text-[11px] font-bold text-white rounded-sm ${color}`}
                              title={`GW${r?.event}: ${r?.result} (${r?.score})`}
                            >
                              <div className="rounded-t-sm self-stretch text-center bg-white text-black">
                                {r?.event}
                              </div>
                              <div className="">{r?.result}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </>
      )}
    </Tabs>
  );
}
