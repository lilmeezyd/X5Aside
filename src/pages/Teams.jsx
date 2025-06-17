import { useState } from "react";
import { Button } from "../../@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../@/components/ui/dialog";
import { Input } from "../../@/components/ui/input";
import { toast } from "sonner";
import { useGetQuery } from "../slices/teamApiSlice";

export default function Teams() {
  const { data, isLoading } = useGetQuery();
  console.log(data);
  const [teams, setTeams] = useState(data);
  const [xHandle, setXhandle] = useState("");
  const [fplId, setFplId] = useState("");
  const [position, setPosition] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);

  const handleAddPlayer = () => {
    toast(`Added player "${playerName}" to ${selectedTeam.name}`);
    setSelectedTeam(null);
    setXhandle("");
    setFplId("");
    setPosition("");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Teams</h2>
      <Button className="mb-4">Add Teams from FPL API</Button>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teams?.map((team) => (
          <div key={team.id} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold">{team?.name}</h3>
            <p className="text-sm text-gray-600">
              Players: {team?.players?.length}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={() => setSelectedTeam(team?._id)}>
                    Add Player
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Player to {team?.name}</DialogTitle>
                  </DialogHeader>
                  <Input
                    placeholder="Enter player X handle"
                    value={xHandle}
                    onChange={(e) => setXhandle(e.target.value)}
                  />
                  <Input
                    placeholder="Enter player FPL ID"
                    value={fplId}
                    onChange={(e) => setFplId(e.target.value)}
                  />
                  <Input
                    placeholder="Enter player position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                  />

                  <Button onClick={handleAddPlayer}>Add</Button>
                </DialogContent>
              </Dialog>
              <Button size="sm" variant="outline">
                Edit
              </Button>
              <Button size="sm" variant="destructive">
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
