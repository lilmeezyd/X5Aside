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
import PlayerFixtures from "./PlayerFixtures";
import PlayerTable from "./PlayerTable";
import TopScorers from "./TopScorers";
import PlayerData from "./PlayerData";
import {
  useGetPlayersQuery,
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
import { useSelector } from "react-redux";

export default function Players() {
  const dbName = useSelector((state) => state.database.dbName);
  const [activeTab, setActiveTab] = useState("data");

  const { data: leaderboard = [] } = useGetPlayerTableQuery(dbName);
  const { data: topScorersData = [] } = useGetTopScorersQuery(dbName);
  const { data: playerFixtures = [] } = useGetPlayerFixturesQuery(dbName);
  const { data: players = []} = useGetPlayersQuery(dbName);
//console.log(table)
  //console.log(playerFixtures)
  const [deleteAllPlayers] = useDeleteAllPlayersMutation();
  const [fetchPointsFromApi] = useFetchPointsFromApiMutation();

  const [createPlayerFixtures] = useCreatePlayerFixturesMutation();

  const [updateH2HFixtures] = useCalculatePlayerFixScoresMutation();
  const [updateTopScorers] = useUpdateTopScorersMutation();
  const [updatePlayerTable] = useUpdatePlayerTableMutation();
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
     const res = await fetchPointsFromApi(dbName).unwrap();
      console.log(res);
      toast.success("Player Points successfully updated");
    } catch(error) {
      console.log(error)
      toast.error("Failed to fetch points");
    }
  };

  const handleCreateFixtures = async () => {
    toast("Updating Player H2H Fixtures...");
    try {
      await createPlayerFixtures(dbName).unwrap();
      toast.success("Player H2H fixtures created");
    } catch(error) {
      console.log(error)
      toast.error("Failed to update fixtures");
    }
  };

  const handleUpdateFixtures = async () => {
    toast("Updating Player H2H Fixtures...");
    try {
      await updateH2HFixtures(dbName).unwrap();
      toast.success("Player H2H fixtures updated");
    } catch(error) {
      console.log(error);
      toast.error("Failed to update fixtures");
    }
  };

  const handleUpdateTopScorers = async () => {
    toast("Updating Top Scorers...");
    try {
     const res = await updateTopScorers(dbName).unwrap();
      console.log(res);
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
    } catch (error){
      console.log(error)
      toast.error("Failed to update table");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Players</h2>
      <div className="grid gap-4 py-4 grid-cols-[repeat(auto-fit,minmax(320px,1fr))]">

        <Button onClick={handleDeletePlayers} variant="destructive">Delete All Players</Button>
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
          Update Players Leaderboard
        </Button>
      </div>

      <Tabs defaultValue="h2h" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="data">Players</TabsTrigger>
          <TabsTrigger value="table">Players H2H</TabsTrigger>
          <TabsTrigger value="top">Top Scorers</TabsTrigger>
          <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
        </TabsList>
<TabsContent value="data"><PlayerData players={players} /></TabsContent>
        <TabsContent value="table">
          <PlayerTable leaderboard={leaderboard} />
        </TabsContent>
        <TabsContent value="top"><TopScorers scorers={topScorersData} />
        </TabsContent>
        <TabsContent value="fixtures">
          <PlayerFixtures fixtures={playerFixtures} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
