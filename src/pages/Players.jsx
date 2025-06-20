// src/pages/Players.jsx
import { useState } from "react";
import { Button } from "../../@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../@/components/ui/tabs";
import { toast } from "sonner";
import {
  useUpdateTopScorersMutation,
  useGetTopScorersQuery,
  useFetchPointsFromApiMutation,
  useDeleteAllPlayersMutation
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

export default function Players() {
  const [activeTab, setActiveTab] = useState("table");
  const [refetchKey, setRefetchKey] = useState(0);

  const { data: table = [] } = useGetPlayerTableQuery(refetchKey);
  const { data: topScorers = [] } = useGetTopScorersQuery(refetchKey);
  const { data: playerFixtures = [] } = useGetPlayerFixturesQuery(refetchKey);
console.log(table)
  const [deleteAllPlayers] = useDeleteAllPlayersMutation();
  const [fetchPointsFromApi] = useFetchPointsFromApiMutation();

  const [createPlayerFixtures] = useCreatePlayerFixturesMutation();

  const [updateH2HFixtures] = useCalculatePlayerFixScoresMutation();
  const [updateTopScorers] = useUpdateTopScorersMutation();
  const [updatePlayerTable] = useUpdatePlayerTableMutation();
const handleDeletePlayers = async () => {
    toast("Deleting Players...");
    try {
      await deleteAllPlayers().unwrap();
      toast.success("Players successfully deleted");
      setRefetchKey((k) => k + 1); // trigger re-fetch
    } catch {
      toast.error("Failed to delete players");
    }
  };
  const handleUpdatePoints = async () => {
    toast("Fetching Player Points...");
    try {
      await fetchPointsFromApi().unwrap();
      toast.success("Player Points successfully updated");
      setRefetchKey((k) => k + 1); // trigger re-fetch
    } catch {
      toast.error("Failed to fetch points");
    }
  };

  const handleCreateFixtures = async () => {
    toast("Updating Player H2H Fixtures...");
    try {
      await createPlayerFixtures().unwrap();
      toast.success("Player H2H fixtures updated");
      setRefetchKey((k) => k + 1); // trigger re-fetch
    } catch {
      toast.error("Failed to update fixtures");
    }
  };

  const handleUpdateFixtures = async () => {
    toast("Updating Player H2H Fixtures...");
    try {
      await updateH2HFixtures().unwrap();
      toast.success("Player H2H fixtures updated");
      setRefetchKey((k) => k + 1); // trigger re-fetch
    } catch {
      toast.error("Failed to update fixtures");
    }
  };

  const handleUpdateTopScorers = async () => {
    toast("Updating Top Scorers...");
    try {
      await updateTopScorers().unwrap();
      toast.success("Top scorers updated");
      setRefetchKey((k) => k + 1); // trigger re-fetch
    } catch {
      toast.error("Failed to update top scorers");
    }
  };

  const handleTableUpdate = async () => {
    toast("Updating Table...");
    try {
      await updatePlayerTable().unwrap();
      toast.success("Table updated");
      setRefetchKey((k) => k + 1); // trigger re-fetch
    } catch {
      toast.error("Failed to update table");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Players</h2>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button onClick={handleDeletePlayers} variant="destructive">Delete All Players</Button>"
        <Button onClick={handleCreateFixtures} variant="default">
          Create Player H2H fixtures
        </Button>
        <Button onClick={handleUpdatePoints} variant="default">
          Update Player Points
        </Button>
        <Button onClick={handleUpdateFixtures} variant="default">
          Update Player H2H Fixtures
        </Button>
        <Button onClick={handleUpdateTopScorers} variant="default">
          Update Top Scorers
        </Button>
        <Button onClick={handleTableUpdate} variant="default">
          Update Players Table
        </Button>
      </div>

      <Tabs defaultValue="h2h" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="table">Leaderboard</TabsTrigger>
          <TabsTrigger value="top">Top Scorers</TabsTrigger>
          <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
        </TabsList>

        <TabsContent value="table">Table</TabsContent>
        <TabsContent value="top">Top scorers</TabsContent>
        <TabsContent value="fixtures">Fixtures</TabsContent>
      </Tabs>
    </div>
  );
}
