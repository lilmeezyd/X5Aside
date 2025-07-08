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
  const { data: fixtures = [], isLoading } = useGetFixturesQuery(dbName);
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

      <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
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
        <Button onClick={handleClassicFixtures}>Update Classic Scores</Button>
        <Button onClick={handleH2HFixtures}>Update H2H Scores</Button>
      </div>

      {isLoading ? (
        <div className="text-center text-sm py-10">Loading...</div>
      ) : (
        paginatedFixtures.map((group, i) => (
          <div key={i} className="mb-6 overflow-x-auto">
            <h3 className="text-xl font-semibold mb-2">
              {filterEventId
                ? `Gameweek ${filterEventId}`
                : filterTeam
                ? `Fixtures for ${filterTeam}`
                : `Gameweek ${group[0].eventId}`}
            </h3>

            <div className="min-w-[340px] sm:w-full rounded-md border shadow-sm">
              <div className="bg-muted px-4 py-2 font-semibold flex justify-between text-sm">
                {filterTeam && <span className="w-12">GW</span>}
                <span className="flex-1"></span>
                <span className="w-24 text-center">Classic</span>
                <span className="w-24 text-center">H2H</span>
                <span className="flex-1 text-right"></span>
              </div>

              {group.map((f) => (
                <div key={f._id}>
                  <div
                    className="px-4 py-2 border-t flex items-center text-sm cursor-pointer hover:bg-gray-100 transition"
                    onClick={() => handleFixtureClick(f._id)}
                  >
                    {filterTeam && (
                      <div className="w-12 font-medium">{f.eventId}</div>
                    )}
                    <div className="flex-1 truncate font-semibold">{f.homeTeam}</div>
                    <div className="w-24 text-center">
                      {f.homeScoreClassic ?? "-"} : {f.awayScoreClassic ?? "-"}
                    </div>
                    <div className="w-24 text-center">
                      {f.homeScoreH2H ?? "-"} : {f.awayScoreH2H ?? "-"}
                    </div>
                    <div className="flex-1 text-right truncate font-semibold">
                      {f.awayTeam}
                    </div>
                  </div>

                  {expandedFixtureId === f._id && (
                    <div className="bg-green-50 px-4 py-2 border-t overflow-x-auto">
                      <FixtureStats f={f} />
                    </div>
                  )}
                </div>
              ))}
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





