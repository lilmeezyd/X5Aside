import React, { useState, useMemo, useEffect } from "react";
import { Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { useDeletePlayerMutation, useEditPlayerMutation } from "../slices/playerApiSlice";
import { toast } from "sonner";
import { useSelector } from "react-redux";

export default function PlayerData({ players }) {
  const dbName = useSelector((state) => state.database.dbName);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState(() => {
    const saved = localStorage.getItem("sortConfig");
    return saved ? JSON.parse(saved) : { key: "fplId", direction: "asc" };
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [editFplId, setEditFplId] = useState("");
const [ editStart, setEditStart ] = useState(0.0);
  const [ editCurrent, setEditCurrent ] = useState(0.0);

  const [editPosition, setEditPosition] = useState("");
  const [filterPosition, setFilterPosition] = useState("");
  const [editPlayer] = useEditPlayerMutation();
  const [deletePlayer] = useDeletePlayerMutation();

  useEffect(() => {
    localStorage.setItem("sortConfig", JSON.stringify(sortConfig));
  }, [sortConfig]);

  const sortedPlayers = useMemo(() => {
    const sortable = [...players];
    const filtered = filterPosition ? sortable.filter(player => player.position === filterPosition) : sortable;
    
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const valA =
          sortConfig.key === "manager"
            ? a.manager?.toLowerCase() || ""
            : sortConfig.key === "team"
            ? a.team?.short_name?.toLowerCase() || ""
            : a[sortConfig.key];

        const valB =
          sortConfig.key === "manager"
            ? b.manager?.toLowerCase() || ""
            : sortConfig.key === "team"
            ? b.team?.short_name?.toLowerCase() || ""
            : b[sortConfig.key];

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [players, sortConfig, filterPosition]);

  const paginated = sortedPlayers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(sortedPlayers?.length / itemsPerPage);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <ArrowUp size={14} className="inline ml-1" />
    ) : (
      <ArrowDown size={14} className="inline ml-1" />
    );
  };

  const openDeleteModal = (player) => {
    setSelectedPlayer(player);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
  if (!selectedPlayer?._id) return;
  try {
    toast.loading('Deleting player...', { id: 'deletePlayer' });

    await deletePlayer({dbName, id: selectedPlayer._id}).unwrap();

    toast.success('Player deleted!', { id: 'deletePlayer' });
    setShowDeleteModal(false);
  } catch (err) {
    toast.error('Failed to delete player.', { id: 'deletePlayer' });
    console.error(err);
  }
};


  const openEditModal = (player) => {
    setSelectedPlayer(player);
    setEditFplId(player.fplId);
    setEditStart(player?.startPrice);
setEditCurrent(player?.currentPrice);   setEditPosition(player.position);
    setShowEditModal(true);
  };

  const confirmEdit = async () => {
  if (!selectedPlayer?._id) return;

  try {
    toast.loading('Updating player...', { id: 'updatePlayer' });

    await editPlayer({dbName,
      id: selectedPlayer._id,
        fplId: editFplId,
        position: editPosition,
        startPrice: editStart,
        currentPrice: editCurrent
    }).unwrap();

    toast.success('Player updated!', { id: 'updatePlayer' });
    setShowEditModal(false);
  } catch (err) {
    toast.error('Failed to update player.', { id: 'updatePlayer' });
    console.error(err);
  }
};


  return (
    <>
      <div className="flex space-x-4 overflow-x-auto pb-2 text-sm">
        <button
          className={`px-4 py-1 rounded-full bg-gray-200 hover:bg-gray-300 font-semibold ${ filterPosition === "" ? "bg-gray-600" : ""} ${ filterPosition === "" ? "text-white" : ""}`}
          onClick={() => {setFilterPosition("")
                         setCurrentPage(1)}}
        >
          All
        </button>
        <button
          className={`px-4 py-1 rounded-full bg-gray-200 hover:bg-gray-300 font-semibold ${ filterPosition === "Captain" ? "bg-gray-600" : ""} ${ filterPosition === "Captain" ? "text-white" : ""}`}
          onClick={() => {setFilterPosition("Captain")
                          setCurrentPage(1)
          }}
        >
          Cap
        </button>
        <button
          className={`px-4 py-1 rounded-full bg-gray-200 hover:bg-gray-300 font-semibold ${ filterPosition === "Ace" ? "bg-gray-600" : ""} ${ filterPosition === "Ace" ? "text-white" : ""}`}
          onClick={() => {setFilterPosition("Ace")
                         setCurrentPage(1)}}
        >
          Ace
        </button>
        <button
          className={`px-4 py-1 rounded-full bg-gray-200 hover:bg-gray-300 font-semibold ${ filterPosition === "Forward" ? "bg-gray-600" : ""} ${ filterPosition === "Forward" ? "text-white" : ""}`}
          onClick={() => {setFilterPosition("Forward")
                         setCurrentPage(1)}}
        >
          Fwd
        </button>
        <button
          className={`px-4 py-1 rounded-full bg-gray-200 hover:bg-gray-300 font-semibold ${ filterPosition === "Midfielder" ? "bg-gray-600" : ""} ${ filterPosition === "Midfielder" ? "text-white" : ""}`}
          onClick={() => {setFilterPosition("Midfielder")
                         setCurrentPage(1)}}
        >
          Mid
        </button>
		<button
      className={`px-4 py-1 rounded-full bg-gray-200 hover:bg-gray-300 font-semibold ${ filterPosition === "Defender" ? "bg-gray-600" : ""} ${ filterPosition === "Defender" ? "text-white" : ""}`}
          onClick={() => {setFilterPosition("Defender")
                         setCurrentPage(1)}}
        >
          Def
        </button>
      </div>
    <div className="w-full overflow-x-auto space-y-4">
      {/*<h2 className="text-xl font-semibold">Top Players</h2>*/}
      
      <table className="min-w-full border border-gray-200 rounded-lg shadow text-sm">
        <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900">
          <tr>
            <th className="px-4 py-2"></th>
            <th
              className={`px-4 py-2 text-left cursor-pointer ${
                sortConfig.key === "manager" ? "font-bold text-blue-700" : ""
              }`}
              onClick={() => requestSort("manager")}
            >
              Manager {sortIcon("manager")}
            </th>
            <th
              className={`px-4 py-2 text-left cursor-pointer ${
                sortConfig.key === "position" ? "font-bold text-blue-700" : ""
              }`}
              onClick={() => requestSort("position")}
            >
              Position {sortIcon("position")}
            </th>
            <th
              className={`px-4 py-2 text-left cursor-pointer ${
                sortConfig.key === "team" ? "font-bold text-blue-700" : ""
              }`}
              onClick={() => requestSort("team")}
            >
              Team {sortIcon("team")}
            </th>
            {dbName !== "X5Aside" && <><th
              className={`px-4 py-2 text-left cursor-pointer ${
                sortConfig.key === "startPrice" ? "font-bold text-blue-700" : ""
              }`}
              onClick={() => requestSort("startPrice")}
            >
              Start Price {sortIcon("startPrice")}
            </th><th
              className={`px-4 py-2 text-left cursor-pointer ${
                sortConfig.key === "currentPrice" ? "font-bold text-blue-700" : ""
              }`}
              onClick={() => requestSort("currentPrice")}
            >
              Current Price{sortIcon("currentPrice")}
            </th><th
              className={`px-4 py-2 text-left cursor-pointer ${
                sortConfig.key === "delta" ? "font-bold text-blue-700" : ""
              }`}
              onClick={() => requestSort("delta")}
            >
              Price Change{sortIcon("delta")}
            </th></>}
            <th
              className={`px-4 py-2 text-left cursor-pointer ${
                sortConfig.key === "fplId" ? "font-bold text-blue-700" : ""
              }`}
              onClick={() => requestSort("fplId")}
            >
              FPL ID {sortIcon("fplId")}
            </th>
            <th className={`px-4 py-2 text-left cursor-pointer sortConfig.key === "eventPoints" ? "font-bold text-blue-700" : ""}`} onClick={() => requestSort("eventPoints")}> GW Score{sortIcon("eventPoints")} </th>


            <th
              className={`px-4 py-2 text-left cursor-pointer ${
                sortConfig.key === "overallPoints" ? "font-bold text-blue-700" : ""
              }`}
              onClick={() => requestSort("overallPoints")}
            >
              Points{sortIcon("overallPoints")}
            </th>
            <th
              className={`px-4 py-2 text-left cursor-pointer ${
                sortConfig.key === "overallRank" ? "font-bold text-blue-700" : ""
              }`}
              onClick={() => requestSort("overallRank")}
            >
              Rank{sortIcon("overallRank")}
            </th>
            { userInfo && <th className="px-4 py-2 text-center">Actions</th> }
          </tr>
        </thead>
        <tbody>
          {paginated.map((player, index) => (
            <tr
              key={player._id}
              className={`${index % 2 === 0 ? "bg-white" : "bg-blue-50"}`}
              style={{background: !player?.isActive && '#ba1f2f', color: !player?.isActive && 'white'}}
            >
              <td className="px-4 py-2 text-center font-semibold">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
              <td className="px-4 py-2">
                <a
                  href={`https://fantasy.premierleague.com/entry/${player.fplId}/history`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-medium hover:underline"
                  style={{background: !player?.isActive && '#ba1f2f', color: !player?.isActive && 'white'}}
                >
                  {player.teamName}
                </a>
                <div className="text-xs text-gray-500"
                 style={{background: !player?.isActive && '#ba1f2f', color: !player?.isActive && 'white'}}>{player.manager}</div>
              </td>
              <td className="px-4 py-2">{player.position}</td>
              <td className="px-4 py-2">{player.team?.short_name || "—"}</td>
              {dbName !== "X5Aside" && <>
              <td className="px-4 py-2">{(player.startPrice)?.toFixed(1)}</td>
              <td className="px-4 py-2">{(player.currentPrice)?.toFixed(1)}</td>
              <td className="px-4 py-2">{(player?.currentPrice - player?. startPrice)?.toFixed(1)}</td>
              </>}
              <td className="px-4 py-2">{player.fplId}</td>
              <td className="px-4 py-2">{player?.eventPoints}</td>
              <td className="px-4 py-2">{player?.overallPoints}</td>
              <td className="px-4 py-2">{player.overallRank}</td>
              { userInfo && <td className="px-4 py-2 text-center space-x-2">
                <button
                  onClick={() => openEditModal(player)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Pencil style={{color: !player?.isActive && 'black'}} size={16} />
                </button>
                <button
                  onClick={() => openDeleteModal(player)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2  style={{color: !player?.isActive && 'black'}} size={16} />
                </button>
              </td>}
            </tr>
          ))}
        </tbody>
      </table>

    </div>
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="text-sm px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <div className="text-sm">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="text-sm px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      
      {showDeleteModal && selectedPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p>
              Are you sure you want to delete{" "}
              <span className="font-medium">{selectedPlayer.teamName}</span>?
            </p>
            <div className="flex justify-end mt-4 space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    
      {showEditModal && selectedPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full space-y-4">
            <h3 className="text-lg font-semibold">Edit Player</h3>
            <div>
              <label className="block text-sm font-medium">FPL ID</label>
              <input
                type="number"
                value={editFplId}
                onChange={(e) => setEditFplId(e.target.value)}
                className="w-full px-3 py-1 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Position</label>
              <select
                value={editPosition}
                onChange={(e) => setEditPosition(e.target.value)}
                className="w-full px-3 py-1 border rounded"
              >
                <option value="Ace">Ace</option>
                <option value="Defender">Defender</option>
                <option value="Midfielder">Midfielder</option>
                <option value="Forward">Forward</option>
                <option value="Captain">Captain</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Start Price</label>
              <input
                type="number"
                value={editStart}
                onChange={(e) => setEditStart(e.target.value)}
                className="w-full px-3 py-1 border rounded"
              />
            </div>
			<div>
              <label className="block text-sm font-medium">Current Price</label>
              <input
                type="number"
                value={editCurrent}
                onChange={(e) => setEditCurrent(e.target.value)}
                className="w-full px-3 py-1 border rounded"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmEdit}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
