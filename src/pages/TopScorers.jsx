import React, { useState } from "react";

export default function TopScorers({ scorers }) {
  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(scorers.length / itemsPerPage);
  const paginated = scorers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <>
    <div className="w-full overflow-x-auto space-y-4">
      {/*<h2 className="text-xl font-semibold">Top Scorers</h2>*/}

          <table className="min-w-full border border-gray-200 rounded-lg shadow text-sm">
            <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900">
          <tr>
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2 text-left">Manager</th>
            <th className="px-4 py-2 text-left">Position</th>
            <th className="px-4 py-2 text-left">Goals</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((player, index) => (
            <tr key={player.player._id} className={index % 2 === 0 ? "bg-white" : "bg-blue-100"}>
              <td className="px-4 py-2 text-center font-semibold">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
              <td className="px-4 py-2">
                <a
                  href={`https://fantasy.premierleague.com/entry/${player.player?.fplId}/history`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-medium hover:underline"
                >
                  {player.player.teamName}
                </a>
                <div className="text-xs text-gray-500">{player.player.manager}</div>
              </td>
              <td className="px-4 py-2">{player.player.position}</td>
              <td className="px-4 py-2 text-center font-semibold">{player.goals}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-2">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="text-sm px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <div className="text-sm">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="text-sm px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
