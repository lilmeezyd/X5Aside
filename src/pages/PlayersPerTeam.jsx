
import { useMemo, useEffect, useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useGetPlayersQuery } from "../slices/playerApiSlice";
import { useSelector } from "react-redux";
import PlayerDataPerTeam from "./PlayerDataPerTeam"

const PlayersPerTeam = (props) => {
    const { teamId } = props
    const [sortConfig1, setSortConfig1] = useState(() => {
        const saved = localStorage.getItem("sortConfig1");
        return saved ? JSON.parse(saved) : { key: "fplId", direction: "asc" };
      });
    const dbName = useSelector((state) => state.database.dbName);

    const {
      data: players = [],
      isLoading: playersLoading,
      isError: playersError,
      refetch: refetchPlayers,
    } = useGetPlayersQuery({dbName, team: teamId});

    useEffect(() => {
        localStorage.setItem("sortConfig1", JSON.stringify(sortConfig1));
      }, [sortConfig1]);

      const sortedPlayers = useMemo(() => {
          const sortable = [...players];
          
          if (sortConfig1.key) {
            sortable.sort((a, b) => {
              const valA =
                sortConfig1.key === "manager"
                  ? a.manager?.toLowerCase() || ""
                  : sortConfig1.key === "team"
                  ? a.team?.short_name?.toLowerCase() || ""
                  : sortConfig1.key === "fplId"
                  ? -a["fplId"]
                  : sortConfig1.key === "overallRank"
                  ? -a["overallRank"]
                  : a[sortConfig1.key];
      
              const valB =
                sortConfig1.key === "manager"
                  ? b.manager?.toLowerCase() || ""
                  : sortConfig1.key === "team"
                  ? b.team?.short_name?.toLowerCase() || ""
                  : sortConfig1.key === "fplId"
                  ? -b["fplId"]
                  : sortConfig1.key === "overallRank"
                  ? -b["overallRank"]
                  : b[sortConfig1.key];
      
              if (valA < valB) return sortConfig1.direction === "asc" ? -1 : 1;
              if (valA > valB) return sortConfig1.direction === "asc" ? 1 : -1;
              return 0;
            });
          }
          
          return sortable.filter(x => x.overallRank || x.fplId);
        }, [players, sortConfig1 ]);


    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig1.key === key && sortConfig1.direction === "asc") {
          direction = "desc";
        }
        setSortConfig1({ key, direction });
      };
    
      const sortIcon = (key) => {
        if (sortConfig1.key !== key) return null;
        return sortConfig1.direction === "asc" ? (
          <ArrowUp size={14} className="inline ml-1" />
        ) : (
          <ArrowDown size={14} className="inline ml-1" />
        );
      };
  return (
    <div>
      <div className="border-b border-gray-300 m-1 p-1 flex items-center">
        <div className="w-[35px]"></div>
        <div className="w-[60%] p-1 truncate"></div>
        <div className="w-[50px] p-1 font-semibold text-sm text-center  flex justify-center items-center"
        onClick={() => requestSort("eventPoints")}><span>GW</span>{sortIcon("eventPoints")}</div>
        <div className="w-[50px] p-1 font-semibold text-sm text-center"
        ><span>Points</span>{/*sortIcon("overallPoints")*/}</div>
        <div className="w-[100px] p-1 font-semibold text-sm text-center flex justify-center items-center"
        onClick={() => requestSort("overallRank")}><span>Rank</span>{sortIcon("overallRank")}</div>
      </div>
      {sortedPlayers.map((player, index) => (
        <div className={`${index === sortedPlayers.length-1 ? "" : 'border-b border-gray-300'}  m-1 p-1 flex items-center`} key={player.fplId}>
            <div className="w-[35px] font-semibold border-r border-gray-400 text-center">{index+1}</div>
            <div className="w-[60%] p-1 truncate border-r border-gray-400">
                <div className="truncate text-sm">
                <a
                  href={player.eventId ? 
                    `https://fantasy.premierleague.com/entry/${player.fplId}/event/${player.eventId}` : 
                  `https://fantasy.premierleague.com/entry/${player.fplId}/history`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-medium hover:underline"
                  style={{background: !player?.isActive && '#ba1f2f', color: !player?.isActive && 'white'}}
                >
                  {player.teamName}
                </a>
                </div>
                <div className="truncate text-xs"
                 style={{background: !player?.isActive && '#ba1f2f', color: !player?.isActive && 'white'}}>{player.manager}</div>
            </div>
            <div className="w-[50px] p-1 text-center text-sm">{player.eventPoints || '-'}</div>
            <div className="w-[50px] p-1 text-center text-sm">{player.overallPoints || '-'}</div>
            <div className="w-[100px] p-1 text-center text-sm">{player.overallRank || '-'}</div>
        </div>
      ))}
    </div>
  )
}

export default PlayersPerTeam
