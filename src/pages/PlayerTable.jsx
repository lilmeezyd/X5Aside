// components/PlayerLeaderboard.jsx
import React from "react";
import { useState } from "react";
import { Button } from "../../@/components/ui/button";
export default function PlayerTable({ leaderboard }) {
  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;
const totalPages = Math.ceil(leaderboard.length / itemsPerPage);

const paginatedData = leaderboard.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);
  
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
          {paginatedData.map((entry, index) => {
            const {
              player,
              played,
              win,
              draw,
              loss,
              pointsFor,
              pointsAgainst,
              pointsDifference,
              points,
              result,
            } = entry;
            const lastFive = result.slice(-5).reverse();

            return (
              <tr key={player._id} className={index % 2 === 0 ? "bg-white" : "bg-blue-100"}>
                <td className="px-4 py-3">
                  <div className="flex flex-col text-sm">
                    <span className="font-medium">{player.manager}</span>
                    <a
                      href={`https://fantasy.premierleague.com/entry/${player.fplId}/history`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline text-xs"
                    >
                      {player.teamName}
                    </a>
                    <a
                      href={`https://x.com/${player.xHandle.replace(/^@/, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-gray-500 hover:underline"
                    >
                      {player.xHandle}
                    </a>
                  </div>
                </td>
                <td className="px-4 py-2">{played}</td>
                <td className="px-4 py-2">{win}</td>
                <td className="px-4 py-2">{draw}</td>
                <td className="px-4 py-2">{loss}</td>
                <td className="px-4 py-2">{pointsFor}</td>
                <td className="px-4 py-2">{pointsAgainst}</td>
                <td className="px-4 py-2">{pointsDifference}</td>
                <td className="px-4 py-2 font-semibold">{points}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-1">
                    {lastFive.map((r, i) => {
                      const bg =
                        r.result === "W"
                          ? "bg-green-500"
                          : r.result === "L"
                            ? "bg-red-500"
                            : "bg-gray-400";

                      return (
                        <div
                          key={i}
                          className={`w-4 h-4 rounded ${bg}`}
                          title={`GW${r.event}: ${r.result} (${r.score})`}
                        />
                      );
                    })}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex justify-center mt-4 gap-2">
  <Button
    variant="outline"
    size="sm"
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
  >
    Prev
  </Button>
  <span className="text-sm px-2 py-1">Page {currentPage} of {totalPages}</span>
  <Button
    variant="outline"
    size="sm"
    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages}
  >
    Next
  </Button>
</div>
      
    </div>
  );
}
