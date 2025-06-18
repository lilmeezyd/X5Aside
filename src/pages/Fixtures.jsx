import { useState, useMemo } from "react";
import {
  useGetFixturesQuery,
  useAddFixturesMutation,
  useCalculateClassicScoresMutation,
  useCalculateH2HScoresMutation,
} from "../slices/fixtureApiSlice";
import { Input } from "../../@/components/ui/input";
import { Button } from "../../@/components/ui/button";
import { Skeleton } from "../../@/components/ui/skeleton";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 1;

export default function Fixtures() {
  const { data: fixtures = [], isLoading } = useGetFixturesQuery();
  const [addFixtures] = useAddFixturesMutation();
  const [filterEventId, setFilterEventId] = useState("");
  const [filterTeam, setFilterTeam] = useState("");
  const [expandedFixtureId, setExpandedFixtureId] = useState(null);
  const [page, setPage] = useState(1);
  console.log(fixtures);

  const filteredFixtures = useMemo(() => {
    if (!fixtures.length) return [];
    if (filterEventId) {
      return fixtures.filter((f) => String(f.eventId) === filterEventId);
    }
    if (filterTeam) {
      return fixtures.filter(
        (f) =>
          f.homeTeam.toLowerCase().includes(filterTeam.toLowerCase()) ||
          f.awayTeam.toLowerCase().includes(filterTeam.toLowerCase()),
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
      }, {}),
    );
  }, [filteredFixtures, filterEventId, filterTeam]);

  const paginatedFixtures = useMemo(() => {
    return groupedFixtures.slice(
      (page - 1) * ITEMS_PER_PAGE,
      page * ITEMS_PER_PAGE,
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
      const res = await addFixtures().unwrap();
     console.log(res);
      toast.success(res.message)
    } catch (error) {
      toast.error('Fetching Fixtures failed');
    }
  };

  const handleClassicFixtures = () => {};
  const handleH2HFixtures = () => {};

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6">Fixtures Admin</h2>

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
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      ) : (
        paginatedFixtures.map((group, i) => (
          <div key={i} className="mb-6">
            <h3 className="text-xl font-semibold mb-2">
              {filterEventId
                ? `Gameweek ${filterEventId}`
                : filterTeam
                  ? `Fixtures for ${filterTeam}`
                  : `Gameweek ${group[0].eventId}`}
            </h3>

            <div className="rounded-md border shadow-sm overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    {filterTeam && <th className="px-4 py-2 text-left">GW</th>}
                    <th className="px-4 py-2 text-left">Home Team</th>
                    <th className="px-4 py-2 text-left">Away Team</th>
                    <th className="px-4 py-2 text-left">Classic</th>
                    <th className="px-4 py-2 text-left">H2H</th>
                  </tr>
                </thead>
                <tbody>
                  {group.map((f) => (
                    <>
                      <tr
                        key={f._id}
                        onClick={() => handleFixtureClick(f._id)}
                        className="cursor-pointer hover:bg-gray-100 transition"
                      >
                        {filterTeam && (
                          <td className="px-4 py-2 font-medium">{f.eventId}</td>
                        )}
                        <td className="px-4 py-2">{f.homeTeam}</td>
                        <td className="px-4 py-2">{f.awayTeam}</td>
                        <td className="px-4 py-2">
                          {f.homeScoreClassic ?? "-"} :{" "}
                          {f.awayScoreClassic ?? "-"}
                        </td>
                        <td className="px-4 py-2">
                          {f.homeScoreH2H ?? "-"} : {f.awayScoreH2H ?? "-"}
                        </td>
                      </tr>

                      {expandedFixtureId === f._id && (
                        <tr className="bg-gray-50 border-t">
                          <td
                            colSpan={filterTeam ? 5 : 4}
                            className="px-6 py-4 text-sm text-gray-700"
                          >
                            <div className="grid gap-1">
                              <p>
                                <strong>Gameweek:</strong> {f.eventId}
                              </p>
                              <p>
                                <strong>Played:</strong>{" "}
                                {f.isPlayed ? "Yes" : "No"}
                              </p>
                              <p>
                                <strong>Result Classic:</strong>{" "}
                                {f.resultClassic ?? "N/A"}
                              </p>
                              <p>
                                <strong>Result H2H:</strong>{" "}
                                {f.resultH2H ?? "N/A"}
                              </p>
                              <p>
                                <strong>Last Updated:</strong>{" "}
                                {new Date(f.updatedAt).toLocaleString()}
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
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
