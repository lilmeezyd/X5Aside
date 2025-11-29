import { useState, useMemo, useEffect } from "react";
import FixtureStats from "./FixtureStats";
import {
  useGetFixturesQuery,
  useAddFixturesMutation,
  useCalculateClassicScoresMutation,
  useCalculateH2HScoresMutation,
} from "../slices/fixtureApiSlice"
import { useGetEventsQuery }
from "../slices/eventApiSlice";

import { Input } from "../../@/components/ui/input";
import { Button } from "../../@/components/ui/button";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const ITEMS_PER_PAGE = 1;

export default function Fixtures() {
  const dbName = useSelector((state) => state.database.dbName);
  const userInfo = useSelector((state) => state.auth.userInfo)
  const { data: fixtures = [], isLoading, refetch, isError } = useGetFixturesQuery(dbName);
  const [addFixtures] = useAddFixturesMutation();
  const [filterEventId, setFilterEventId] = useState("");
  const [filterTeam, setFilterTeam] = useState("");
  const [expandedFixtureId, setExpandedFixtureId] = useState(null);
  const [page, setPage] = useState(1);
const imageComp = dbName === 'X5Aside' ? 'X5' : dbName === 'app5Aside' ? 'FFK' : 'X5'
 const { data: events = [], isLoading: eventsLoading } = useGetEventsQuery(dbName);

useEffect(() => {
  if (!eventsLoading && events.length > 0) {
    const currentEvent = events.find(event => event.current === true);
    if (currentEvent) {
      setPage(prev => (prev !== currentEvent.eventId ? currentEvent.eventId : prev));
    }
  }
}, [events, eventsLoading]);

  const [calculateClassicScores] = useCalculateClassicScoresMutation();
  const [calculateH2HScores] = useCalculateH2HScoresMutation();

  const filteredFixtures = useMemo(() => {
    if (!fixtures.length) return [];
    if (filterEventId) {
      return fixtures.filter((f) => String(f.eventId) === filterEventId);
    }
    if (filterTeam) {
      return fixtures.filter(
        (f) =>
          f.homeTeam.toLowerCase().includes(filterTeam.toLowerCase()) ||
          f.awayTeam.toLowerCase().includes(filterTeam.toLowerCase())
      );
    }
    return fixtures;
  }, [fixtures, filterEventId, filterTeam]);

  const groupedFixtures = useMemo(() => {
    if (filterEventId || filterTeam) return [[...filteredFixtures]];
    return Object.values(
      filteredFixtures.reduce((acc, f) => {
        const key = f.eventId;
        if (!acc[key]) acc[key] = [];
        acc[key].push(f);
        return acc;
      }, {})
    );
  }, [filteredFixtures, filterEventId, filterTeam]);

  const paginatedFixtures = useMemo(() => {
    return groupedFixtures.slice(
      (page - 1) * ITEMS_PER_PAGE,
      page * ITEMS_PER_PAGE
    );
  }, [groupedFixtures, page]);
  const totalPages = useMemo(() => {
    return Math.ceil(groupedFixtures.length / ITEMS_PER_PAGE);
  }, [groupedFixtures]);

  const handleFixtureClick = (id) => {
    setExpandedFixtureId(expandedFixtureId === id ? null : id);
  };

  const handleFetchFixtures = async () => {
    toast("Fetching Fixtures from FPL...", {
      description: "This may take a few seconds",
    });
    try {
      const res = await addFixtures(dbName).unwrap();
      toast.success(res.message);
    } catch (error) {
      toast.error("Fetching Fixtures failed");
    }
  };

  const handleClassicFixtures = async () => {
    try {
      toast("Updating Classic Scores...");
      const res = await calculateClassicScores(dbName).unwrap();
      toast.success("Classic Scores Updated");
    } catch (error) {
      toast.error(error.data.message || "Failed to update classic scores");
    }
  };

  const handleH2HFixtures = async () => {
    try {
      toast("Updating H2H Scores...");
      const res = await calculateH2HScores(dbName).unwrap();
      toast.success("H2H Scores Updated");
    } catch (error) {
      toast.error(error.data.message || "Failed to update h2h scores");
    }
  };

  return (
    <div className="p-4 mt-15 md:mt-0 w-[320px] sm:w-full">
      <h2 className="text-3xl font-bold mb-6">Fixtures</h2>

        <div className="grid gap-4 py-4 grid-cols-[repeat(auto-fit,minmax(320px,1fr))]">
        <Input
          placeholder="Filter by Gameweek (e.g. 1)"
          value={filterEventId}
          onChange={(e) => {
            setPage(1);
            setFilterEventId(e.target.value);
            setFilterTeam("");
          }}
        />
        <Input
          placeholder="Filter by Team"
          value={filterTeam}
          onChange={(e) => {
            setPage(1);
            setFilterTeam(e.target.value);
            setFilterEventId("");
          }}
        />
          
        <Button onClick={handleFetchFixtures}>Fetch Fixtures from FPL</Button>
          { userInfo && <><Button onClick={handleClassicFixtures}>Update Classic Scores</Button>
        <Button onClick={handleH2HFixtures}>Update H2H Scores</Button></> }
      </div>

        {isLoading ? (
          <div className="text-center text-sm py-10">Loading...</div>
        ) : fixtures.length === 0 ? (
          <div className="text-center py-10 space-y-4">
            <p className="text-gray-500">No fixtures found. This could be due to a network issue or empty data.</p>
            <Button onClick={() => {
              toast("Retrying fetch...");
              refetch();
            }}>
              Retry
            </Button>
          </div>
        ) : (
       paginatedFixtures.map((group, i) => (
         <div key={i} className="mb-8">
           {/* Gameweek title */}
           <h3 className="text-xl font-bold text-gray-800 mb-3">
             {filterEventId
               ? `Gameweek ${filterEventId}`
               : filterTeam
               ? `Fixtures for ${filterTeam}`
               : `Gameweek ${group[0].eventId}`}
           </h3>

           <div className="space-y-2">
             {group?.sort((a,b) => {if(a.eventId !==b.eventId)return a.eventId-b.eventId
     if(a.homeTeam !== b.homeTeam) return a.homeTeam.localeCompare(b.homeTeam) }                    )?.map((f) => {
           
               const homeBadge = `https://ik.imagekit.io/cap10/${f.homeTeamShort}_${imageComp}.png`;
               const awayBadge = `https://ik.imagekit.io/cap10/${f.awayTeamShort}_${imageComp}.png`;


               return (
                 <div className="w-[320px] sm:w-full" key={f._id}>
                   <div
                     className={`${
                       expandedFixtureId === f._id ? "bg-teal-300" : "bg-white"
                     } rounded-lg border shadow-sm px-4 py-3 flex items-center justify-between hover:shadow-md transition cursor-pointer`}
                     onClick={() => handleFixtureClick(f._id)}
                   >
                     {/* Home team */}
                     <div className="w-1/3 flex items-center gap-1 px-1 justify-between">
                       
                       <div className="font-semibold text-gray-900 truncate text-xs md:text-base w-3/4 text-right">{f.homeTeam}</div>
                       <img src={homeBadge} alt={f.homeTeam} className="w-4 h-auto w-1/4 md:w-6" />
                     </div>

                     {/* Classic score */}
                     <div className="w-16 text-center shadow-inner border border-gray-800 rounded p-1">
                       <div className="text-xs text-muted-foreground">Classic</div>
                       <div className="text-xs sm:text-base font-medium bg-gray-800 text-white">
                         {f.homeScoreClassic ?? "-"} : {f.awayScoreClassic ?? "-"}
                       </div>
                     </div>

                     {/* H2H score */}
                     <div className="w-16 text-center shadow-inner border border-gray-800 rounded p-1">
                       <div className="text-xs text-muted-foreground">H2H</div>
                       <div className="text-xs sm:text-base font-medium bg-gray-800 text-white">
                         {f.homeScoreH2H ?? "-"} : {f.awayScoreH2H ?? "-"}
                       </div>
                     </div>

                     {/* Away team */}
                     <div className="w-1/3 flex items-center gap-1 px-1 justify-between">
                       <img src={awayBadge} alt={f.awayTeam} className="w-4 h-auto md:w-6 w-1/4" />
                       <div className="font-semibold text-gray-900 truncate text-left text-xs md:text-base w-3/4">
                         {f.awayTeam}
                       </div>
                       
                     </div>
                   </div>

                   {/* Expanded fixture stats */}
                   {expandedFixtureId === f._id && <FixtureStats f={f} />}
                 </div>

               );
             })}
           </div>
         </div>
  ))
      
      )}

      {!isLoading && totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <Button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            variant="outline"
          >
            Previous
          </Button>
          <span className="text-sm font-medium">
            Page {page} of {totalPages}
          </span>
          <Button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

