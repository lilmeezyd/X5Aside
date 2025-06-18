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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../@/components/ui/select";
import { toast } from "sonner";
import { useGetQuery } from "../slices/teamApiSlice";
import { useAddPlayerMutation } from "../slices/playerApiSlice";

const POSITIONS = ["Captain", "Ace", "Forward", "Midfielder", "Defender"];

export default function Teams() {
  const { data: teams = [], isLoading } = useGetQuery();
  console.log(teams)
  const [addPlayer] = useAddPlayerMutation();

  const [xHandle, setXhandle] = useState("");
  const [fplId, setFplId] = useState("");
  const [position, setPosition] = useState(POSITIONS[0]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddPlayer = async () => {
    toast("Adding player...");
    setIsDialogOpen(false);
    try {
      const res = await addPlayer({
        xHandle,
        fplId,
        position,
        team: selectedTeam,
      }).unwrap();
      toast.success(`${res} has been added`);
     // setIsDialogOpen(false);
      setSelectedTeam(null);
      setXhandle("");
      setFplId("");
      setPosition(POSITIONS[0]);
    } catch {
      toast.error("Failed to add player");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Teams</h2>
      <Button className="mb-4">Add Teams from FPL API</Button>

      {isLoading ? (
        <p>Loading teams…</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teams?.map((team) => (
            <div key={team?._id} className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{team?.name}</h3>
              <p className="text-sm text-gray-600">
                Players: {team?.players?.length ?? 0}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Dialog
                  open={isDialogOpen}
                  onOpenChange={setIsDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedTeam(team?._id);
                        setIsDialogOpen(true);
                      }}
                    >
                      Add Player
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Add Player to {team?.name}
                      </DialogTitle>
                    </DialogHeader>

                    <Input
                      placeholder="Enter player X handle"
                      value={xHandle}
                      onChange={(e) => setXhandle(e.target.value)}
                      className="mb-2"
                    />
                    <Input
                      placeholder="Enter player FPL ID"
                      value={fplId}
                      onChange={(e) => setFplId(e.target.value)}
                      className="mb-2"
                    />

                    <Select
                      value={position}
                      onValueChange={(val) => setPosition(val)}
                      className="mb-4"
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        {POSITIONS.map((pos) => (
                          <SelectItem key={pos} value={pos}>
                            {pos}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

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
      )}
    </div>
  );
}
