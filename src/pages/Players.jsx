import { useState, Suspense, lazy } from "react";
import { Button } from "../../@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../@/components/ui/tabs";
import { toast } from "sonner";

import {
  useGetPlayersQuery,
  useUpdateTopScorersMutation,
  useGetTopScorersQuery,
  useFetchPointsFromApiMutation,
  useDeleteAllPlayersMutation,
} from "../slices/playerApiSlice";
import {
  useGetPlayerTableQuery,
  useUpdatePlayerTableMutation,
} from "../slices/tableApiSlice";
import {
  useCreatePlayerFixturesMutation,
  useGetPlayerFixturesQuery,
  useCalculatePlayerFixScoresMutation,
} from "../slices/fixtureApiSlice";
import { useSelector } from "react-redux";

// Lazy imports for tab content
const PlayerData = lazy(() => import("./PlayerData"));
const PlayerTable = lazy(() => import("./PlayerTable"));
const TopScorers = lazy(() => import("./TopScorers"));
const PlayerFixtures = lazy(() => import("./PlayerFixtures"));

export default function Players() {
  const dbName = useSelector((state) => state.database.dbName);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [activeTab, setActiveTab] = useState("data");

  // Fetch queries with loading, error, refetch
  const {
    data: players = [],
    isLoading: playersLoading,
    isError: playersError,
    refetch: refetchPlayers,
  } = useGetPlayersQuery(dbName);

  const {
    data: leaderboard = [],
    isLoading: leaderboardLoading,
    isError: leaderboardError,
    refetch: refetchLeaderboard,
  } = useGetPlayerTableQuery(dbName);

  const {
    data: topScorersData = [],
    isLoading: scorersLoading,
    isError: scorersError,
    refetch: refetchScorers,
  } = useGetTopScorersQuery(dbName);

  const {
    data: playerFixtures = [],
    isLoading: fixturesLoading,
    isError: fixturesError,
    refetch: refetchFixtures,
  } = useGetPlayerFixturesQuery(dbName);

  // Mutations
  const [deleteAllPlayers] = useDeleteAllPlayersMutation();
  const [fetchPointsFromApi] = useFetchPointsFromApiMutation();
  const [createPlayerFixtures] = useCreatePlayerFixturesMutation();
  const [updateH2HFixtures] = useCalculatePlayerFixScoresMutation();
  const [updateTopScorers] = useUpdateTopScorersMutation();
  const [updatePlayerTable] = useUpdatePlayerTableMutation();

  // Handlers for buttons
  const handleDeletePlayers = async () => {
    toast("Deleting Players...");
    try {
      await deleteAllPlayers(dbName).unwrap();
      toast.success("Players successfully deleted");
    } catch {
      toast.error("Failed to delete players");
    }
  };

  const handleUpdatePoints = async () => {
    toast("Fetching Player Points...");
    try {
      await fetchPointsFromApi(dbName).unwrap();
      refetchPlayers();
      toast.success("Player Points successfully updated");
    } catch(error) {
      console.log(error)
      toast.error("Failed to fetch points");
    }
  };

  const handleCreateFixtures = async () => {
    toast("Creating Player H2H Fixtures...");
    try {
      await createPlayerFixtures(dbName).unwrap();
      toast.success("Player H2H fixtures created");
    } catch(error) {
      toast.error(error.data.message ||  "Failed to update fixtures");
    }
  };

  const handleUpdateFixtures = async () => {
    toast("Updating Player H2H Fixtures...");
    try {
      await updateH2HFixtures(dbName).unwrap();
      refetchFixtures();
      refetchLeaderboard();
      toast.success("Player H2H fixtures updated");
    } catch(error) {
      toast.error(error.data.message || "Failed to update player H2H scores");
    }
  };

  const handleUpdateTopScorers = async () => {
    toast("Updating Top Scorers...");
    try {
      await updateTopScorers(dbName).unwrap();
      refetchScorers();
      toast.success("Top scorers updated");
    } catch {
      toast.error("Failed to update top scorers");
    }
  };

  const handleTableUpdate = async () => {
    toast("Updating Table...");
    try {
      await updatePlayerTable(dbName).unwrap();
      toast.success("Table updated");
    } catch {
      toast.error("Failed to update table");
    }
  };

  // Retry UI helper
  function RetryWrapper({ isError, isLoading, dataLength, onRetry, children }) {
    if (isLoading) return <p>Loading...</p>;
    if (isError || dataLength === 0)
      return (
        <div className="text-center space-y-3">
          <p className="text-gray-500">
            {isError
              && "No data found. This might be due to slow internet or server issues."}
          </p>
          {isError && <Button onClick={onRetry}>Retry</Button>}
        </div>
      );
    return children;
  }

  return (
    <div className="overflow-auto">
        <h2 className="text-2xl font-bold mb-4 mt-15 md:mt-0">Players</h2>

      {userInfo && <div className="grid gap-4 py-4 grid-cols-[repeat(auto-fit,minmax(320px,1fr))]">
       {/*} <Button onClick={handleDeletePlayers} variant="destructive">
          Delete All Players
        </Button>*/}
        <Button onClick={handleCreateFixtures} variant="default">
          Create Player H2H fixtures
        </Button>
        <Button onClick={handleUpdatePoints} variant="default">
          Fetch Player Points
        </Button>
        <Button onClick={handleUpdateFixtures} variant="default">
          Update Player H2H Fixtures
        </Button>
        <Button onClick={handleUpdateTopScorers} variant="default">
          Update Top Scorers
        </Button>
        {/*<Button onClick={handleTableUpdate} variant="default">
          Update Players H2H Table
        </Button>*/}
      </div>}

      <Tabs className="min-w-[320px]" defaultValue="data" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 m-auto overflow-x-auto">
          <TabsTrigger className="text-xs sm:text-sm" value="data">Players</TabsTrigger>
          <TabsTrigger className="text-xs sm:text-sm" value="table">Players H2H Table</TabsTrigger>
          <TabsTrigger className="text-xs sm:text-sm" value="top">Top Scorers</TabsTrigger>
          <TabsTrigger className="text-xs sm:text-sm" value="fixtures">Fixtures</TabsTrigger>
        </TabsList>

        <TabsContent className="w-full" value="data">
          <Suspense fallback={<p>Loading Players...</p>}>
            <RetryWrapper
              isError={playersError}
              isLoading={playersLoading}
              dataLength={players.length}
              onRetry={refetchPlayers}
            >
              <PlayerData players={players} />
            </RetryWrapper>
          </Suspense>
        </TabsContent>

        <TabsContent className="w-full" value="table">
          <Suspense fallback={<p>Loading Player Table...</p>}>
            <RetryWrapper
              isError={leaderboardError}
              isLoading={leaderboardLoading}
              dataLength={leaderboard.length}
              onRetry={refetchLeaderboard}
            >
              <PlayerTable leaderboard={leaderboard} />
            </RetryWrapper>
          </Suspense>
        </TabsContent>

        <TabsContent className="w-full" value="top">
          <Suspense fallback={<p>Loading Top Scorers...</p>}>
            <RetryWrapper
              isError={scorersError}
              isLoading={scorersLoading}
              dataLength={topScorersData.length}
              onRetry={refetchScorers}
            >
              <TopScorers scorers={topScorersData} />
            </RetryWrapper>
          </Suspense>
        </TabsContent>

        <TabsContent className="w-full" value="fixtures">
          <Suspense fallback={<p>Loading Player Fixtures...</p>}>
            <RetryWrapper
              isError={fixturesError}
              isLoading={fixturesLoading}
              dataLength={playerFixtures.length}
              onRetry={refetchFixtures}
            >
              <PlayerFixtures fixtures={playerFixtures} />
            </RetryWrapper>
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
