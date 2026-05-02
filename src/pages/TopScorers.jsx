import { useState, useEffect, useMemo } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useGetCurrentEventQuery } from "../slices/eventApiSlice";
import { useSelector } from "react-redux";

export default function TopScorers({ scorers }) {
  const dbName = useSelector((state) => state.database.dbName);
  const { data: eventId } = useGetCurrentEventQuery(dbName);
  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfigOne, setSortConfigOne] = useState(() => {
    const saved = localStorage.getItem("sortConfigOne");
    return saved ? JSON.parse(saved) : { key: "goals", direction: "desc" };
  });

  useEffect(() => {
    localStorage.setItem("sortConfigOne", JSON.stringify(sortConfigOne));
  }, [sortConfigOne]);

  const sortedPlayers = useMemo(() => {
    const sortable = [...scorers];

    if (sortConfigOne.key) {
      if (sortConfigOne.key === "goals") {
        const multiplier = sortConfigOne.direction === "asc" ? 1 : -1;
        const multiplier_1 = sortConfigOne.direction === "asc" ? -1 : 1;

        sortable.sort(
          (a, b) =>
            (a.goals - b.goals) * multiplier ||
            (a.yellows - b.yellows) * multiplier_1 ||
            ((a?.player?.fplId ?? 0) - (b?.player?.fplId ?? 0)) * multiplier_1,
        );
      } else {
        sortable.sort((a, b) => {
          const valA = a[sortConfigOne.key];

          const valB = b[sortConfigOne.key];

          if (valA < valB) return sortConfigOne.direction === "asc" ? -1 : 1;
          if (valA > valB) return sortConfigOne.direction === "asc" ? 1 : -1;
          return 0;
        });
      }
    }
    return sortable;
  }, [scorers, sortConfigOne]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfigOne.key === key && sortConfigOne.direction === "asc") {
      direction = "desc";
    }
    setSortConfigOne({ key, direction });
  };

  const sortIcon = (key) => {
    if (sortConfigOne.key !== key) return null;
    return sortConfigOne.direction === "asc" ? (
      <ArrowUp size={14} className="inline ml-1" />
    ) : (
      <ArrowDown size={14} className="inline ml-1" />
    );
  };

  const totalPages = Math.ceil(sortedPlayers?.length / itemsPerPage);
  const paginated = sortedPlayers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const imageComp =
    dbName === "X5Aside" ? "X5" : dbName === "app5Aside" ? "FFK" : "X5";

const imageBaseURL = "https://ik.imagekit.io/cap10/";

  return (
    <>
      <div className="w-full overflow-x-auto space-y-4">
        {/*<h2 className="text-xl font-semibold">Top Scorers</h2>*/}

          <table className="min-w-full border border-gray-200 rounded-lg shadow text-sm">
            <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900">
          <tr>
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2 text-left">Manager</th>
            <th className="px-4 py-2 text-center">Team</th>
            <th className="px-4 py-2 text-center">Position</th>
            <th
                className={`px-4 py-2 text-center cursor-pointer border ${
                  sortConfigOne.key === "yellows" ? "font-bold text-blue-700" : ""
                }`}
                onClick={() => requestSort("yellows")}
              >
                <div className="flex justify-center items-center w-[80px]"><span>Yellows</span>{sortIcon("yellows")}</div>
              </th>
              <th
                className={`px-4 py-2 text-center cursor-pointer border ${
                  sortConfigOne.key === "assists" ? "font-bold text-blue-700" : ""
                }`}
                onClick={() => requestSort("assists")}
              >
                <div className="flex justify-center items-center w-[80px]"><span>Assists</span> {sortIcon("assists")}</div>
              </th>
              <th
                className={`px-4 py-2 text-center cursor-pointer border ${
                  sortConfigOne.key === "goals" ? "font-bold text-blue-700" : ""
                }`}
                onClick={() => requestSort("goals")}
              >
                <div className="flex justify-center items-center w-[80px]"><span>Goals</span>{sortIcon("goals")}</div>
              </th>
          </tr>
        </thead>
          <tbody>
            {paginated.map((player, index) => (
              <tr
                key={player.player._id}
                className={index % 2 === 0 ? "bg-white" : "bg-blue-100"}
              >
                <td className="px-4 py-2 text-center font-semibold w-[20px]">
                  {index + 1 + (currentPage - 1) * itemsPerPage}
                </td>
                <td className="px-4 py-2 w-[100px]">
                  <div className="w-[150px] md:w-[300px] overflow-stuff">
                  <a
                    href={
                      eventId
                        ? `https://fantasy.premierleague.com/entry/${player?.player?.fplId}/event/${eventId}`
                        : `https://fantasy.premierleague.com/entry/${player?.player?.fplId}/history`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-medium hover:underline"
                  >
                    {player.player.teamName}
                  </a>
                  <div className="text-xs text-gray-500 overflow-stuff">
                    {player.player.manager}
                  </div>
                  </div>
                </td>
                <td className="px-4 py-2">
                <div className="w-20 border border-blue-500  mx-auto rounded shadow-lg flex items-center justify-evenly p-1">
                <img
                                  src={`${imageBaseURL}${player.team?.short_name}_${imageComp}.png`}
                                  alt={player.team?.short_name}
                                  className="w-6 h-6 object-contain"
                                />
                <span className="font-bold truncate whitespace-nowrap overflow-hidden">{player.team?.short_name || "—"}
                  </span>
                </div></td>
                <td className="px-4 py-2 text-center">{player.player.position}</td>
                <td className="px-4 py-2 text-center font-semibold w-[80px]">
                  {player.yellows}
                </td>
                <td className="px-4 py-2 text-center font-semibold w-[80px]">
                  {player.assists}
                </td>
                <td className="px-4 py-2 text-center font-semibold w-[80px]">
                  {player.goals}
                </td>
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
