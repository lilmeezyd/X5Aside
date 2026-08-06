import { useState, useMemo, useRef, useEffect } from "react";
import NormalTeamCard from "./NormalTeamCard";
import SelectDB from "./SelectDB";
import { Button } from "../../@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FaArrowCircleDown, FaArrowCircleUp, FaCircle } from "react-icons/fa";
import { toast } from "sonner";
import {
  useGetQuery,
  useGetTeamTotalPointsQuery,
} from "../slices/teamApiSlice";
import { useGetPlayersQuery } from "../slices/playerApiSlice";
import { useSelector } from "react-redux";

export default function Teams() {
  const dbName = useSelector((state) => state.database.dbName);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [teamDetails, setTeamDetails] = useState({ _id: null, team: null });
  const { data: teams = [], isLoading, refetch, isError } = useGetQuery(dbName);
  const { data: totals = [] } = useGetTeamTotalPointsQuery(dbName);
  const { _id, team } = teamDetails;
  const {
    data: players = [],
    isLoading: playersLoading,
    isError: playersError,
    refetch: refetchPlayers,
  } = useGetPlayersQuery({ dbName, team: _id });

  const newTeams = useMemo(() => {
    const totalsMap = new Map(
      totals?.map((x) => [
        x?.teamName,
        { rank: x?.rank, oldRank: x?.oldRank, totalPoints: x?.totalPoints },
      ]),
    );
    return teams?.map((x) => {
      return {
        ...x,
        rank: totalsMap?.get(x.name)?.rank,
        oldRank: totalsMap?.get(x.name)?.oldRank,
        total: totalsMap?.get(x.name)?.totalPoints,
      };
    });
  }, [teams, totals]);

  useEffect(() => {
    setTeamDetails({_id: newTeams[0]?._id, team: newTeams[0]})
  }, [newTeams])


  const scrollRef = useRef(null);

  const checkScroll = () => {
    const el = scrollRef.current;

    setCanScrollLeft(el.scrollLeft > 0);

    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };
  const handleScroll = (direction) => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  const handleRetry = () => {
    toast("Retrying fetch...");
    refetch();
  };

  /*const handleRefresh = async () => {
    const result = await refetch();
  console.log(result);
    return result;
  };*/

  return (
    <div className="relative mb-4">
      {isLoading ? (
        <p>Loading teams...</p>
      ) : isError ? (
        <div className="text-center space-y-3 mt-6">
          <p className="text-red-500">
            Failed to fetch teams. Please check your connection or try again
            later.
          </p>
          <Button onClick={handleRetry}>Retry</Button>
        </div>
      ) : teams.length > 0 ? (
        <>
          <div
            style={{
              background:
                dbName !== "ffkPro"
                  ? `linear-gradient(180deg, ${team?.primaryColor || "black"}, ${team?.secondaryColor || "white"})`
                  : `linear-gradient(180deg, white, black)`,
            }}
            className="flex flex-col md:flex-row justify-between rounded-lg md:h-[300px] shadow-xl mb-2"
          >
            <div className="px-2 py-6 md:py-2 md:w-[45%] flex justify-center items-center">
                <div className="shadow-xl bg-white flex justify-between items-center border border-gray-300 rounded px-2">
                          <div className="flex flex-col text-center justify-center px-2 ">
                            <div className="border-b border-gray-500  font-bold">Rank:</div>
                            <div className="flex space-x-2 items-center p-1">
                              <span>{team?.rank}</span>
                              <div className="flex space-x-1 items-center">
                                <span>
                                  {team?.oldRank > team?.rank && team?.oldRank > 0 && (
                                    <FaArrowCircleUp className="text-green-500" size={16} />
                                  )}
                                  {(team?.oldRank === team?.rank || team?.oldRank === 0) && (
                                    <FaCircle className="text-gray-500" size={16} />
                                  )}
                                  {team?.oldRank < team?.rank && team?.oldRank > 0 && (
                                    <FaArrowCircleDown className="text-red-500" size={16} />
                                  )}
                                </span>
                                <span
                                  className={`font-bold ${
                                    team?.oldRank > 0
                                      ? team?.oldRank < team?.rank
                                        ? "text-red-500"
                                        : team?.oldRank > team?.rank
                                          ? `text-green-500`
                                          : "text-gray-500"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {team?.oldRank > 0
                                    ? team?.oldRank < team?.rank
                                      ? team?.oldRank - team?.rank
                                      : team?.oldRank > team?.rank
                                        ? `+${team?.oldRank - team?.rank}`
                                        : ""
                                    : ""}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col text-center justify-center px-2 ">
                            <div className="border-b border-gray-500 font-semibold">
                              Total Points:
                            </div>
                            <div className="p-1">{team?.total}</div>
                          </div>
                        </div>
            </div>
            <div className="md:px-2 md:w-[45%] bg-white w-full">
              <div
                className="p-2"
                style={{
                  background:
                    dbName !== "ffkPro"
                      ? `linear-gradient(180deg, ${team?.primaryColor || "black"}, ${team?.secondaryColor || "white"})`
                      : `linear-gradient(180deg, white, black)`,
                  color: dbName !== "ffkPro" ? team?.color : "white",
                }}
              >
                <h2 className="text-2xl font-semibold mb-1">{team?.name}</h2>
              </div>
              <div className="px-2 mt-2 space-y-2 text-sm py-1">
                {players
                  ?.filter((x) => x.isActive)
                  ?.map((player, index) => (
                    <div
                      className={`${index+1 === players?.length ? '' : 'border-b'} font-bold py-1 border-gray-300`}
                      key={index}
                    >
                      {player.manager}
                      {/*<span className="italic">—{" "}{player.position}</span>*/}
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="relative mt-10">
            {canScrollLeft && (
              <button
                className="shadow-xl absolute top-5 left-0 border border-gray-300 bg-white"
                onClick={() => handleScroll("left")}
              >
                <ChevronLeft size={32} color="gray" />
              </button>
            )}
            <div
              ref={scrollRef}
              onScroll={checkScroll}
              style={{ scrollbarWidth: "none" }}
              className="flex gap-2 overflow-x-auto"
            >
              {newTeams.map((team) => (
                <NormalTeamCard
                  setTeamDetails={setTeamDetails}
                  refetch={refetch}
                  key={team._id}
                  team={team}
                />
              ))}
            </div>
            {canScrollRight && (
              <button
                className="shadow-xl absolute top-5 right-0 border border-gray-300 bg-white"
                onClick={() => handleScroll("right")}
              >
                <ChevronRight size={32} color="gray" />
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="text-center space-y-3 mt-6">
          <p className="text-gray-500">No teams found.</p>
        </div>
      )}
    </div>
  );
}
