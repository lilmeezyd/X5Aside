import { useState, useMemo } from "react";
import FixtureStats from "./FixtureStats";
import {
  useGetFixturesQuery,
  useAddFixturesMutation,
  useCalculateClassicScoresMutation,
  useCalculateH2HScoresMutation,
} from "../slices/fixtureApiSlice";
import { Input } from "../../@/components/ui/input";
import { Button } from "../../@/components/ui/button";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const ITEMS_PER_PAGE = 1;

export default function Fixtures() {
  const dbName = useSelector((state) => state.database.dbName);
  const { data: fixtures = [], isLoading, refetch, isError } = useGetFixturesQuery(dbName);
  const [addFixtures] = useAddFixturesMutation();
  const [filterEventId, setFilterEventId] = useState("");
  const [filterTeam, setFilterTeam] = useState("");
  const [expandedFixtureId, setExpandedFixtureId] = useState(null);
  const [page, setPage] = useState(1);

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
      console.log(res);
      toast.success(res.message);
    } catch (error) {
      console.log(error)
      toast.error("Fetching Fixtures failed");
    }
  };

  const handleClassicFixtures = async () => {
    try {
      toast("Updating Classic Scores...");
      const res = await calculateClassicScores(dbName).unwrap();
      console.log(res);
      toast.success("Classic Scores Updated");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update classic scores");
    }
  };

  const handleH2HFixtures = async () => {
    try {
      toast("Updating H2H Scores...");
      const res = await calculateH2HScores(dbName).unwrap();
      console.log(res);
      toast.success("H2H Scores Updated");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update h2h scores");
    }
  };

  return (
    <div className="p-4">
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
          {/*
        <Button onClick={handleFetchFixtures}>Fetch Fixtures from FPL</Button>*/}
        <Button onClick={handleClassicFixtures}>Update Classic Scores</Button>
        <Button onClick={handleH2HFixtures}>Update H2H Scores</Button>
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
             {group.map((f) => {
           
               const homeBadge = `https://ik.imagekit.io/cap10/${f.homeTeamShort}.webp`;
               const awayBadge = `https://ik.imagekit.io/cap10/${f.awayTeamShort}.webp`;


               return (
                 <div className="w-[320px] sm:w-full" key={f._id}>
                   <div
  className={`${
    expandedFixtureId === f._id ? "bg-teal-300" : "bg-white"
  } rounded-lg border shadow-sm px-4 py-3 flex items-center justify-between hover:shadow-md transition cursor-pointer`}
  onClick={() => handleFixtureClick(f._id)}
>


                     {/* Home team */}
                     <div className="flex-1 flex items-center gap-2">
                       <img src={homeBadge} alt={f.homeTeam} className="w-6 h-6" />
                       <span className="font-semibold text-gray-900 truncate text-xs md:text-base">{f.homeTeam}</span>
                     </div>

                     {/* Classic score */}
                     <div className="w-20 text-center">
                       <div className="text-xs text-muted-foreground">Classic</div>
                       <div
                         className={`text-xs sm:text-base font-medium`}
                       >
                         {f.homeScoreClassic ?? "-"} : {f.awayScoreClassic ?? "-"}
                       </div>
                     </div>

                     {/* H2H score */}
                     <div className="w-20 text-center">
                       <div className="text-xs text-muted-foreground">H2H</div>
                       <div
                         className={`text-xs sm:text-base font-medium`}
                       >
                         {f.homeScoreH2H ?? "-"} : {f.awayScoreH2H ?? "-"}
                       </div>
                     </div>

                     {/* Away team */}
                     <div className="flex-1 flex items-center gap-2 justify-end">
                       <span className="font-semibold text-gray-900 truncate text-right text-xs md:text-base">
                         {f.awayTeam}
                       </span>
                       <img src={awayBadge} alt={f.awayTeam} className="w-6 h-6" />
                     </div>
                   </div>

                   {/* Expanded fixture stats */}
                   {expandedFixtureId === f._id && (
                  <FixtureStats f={f} />
                    
                   )}
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

