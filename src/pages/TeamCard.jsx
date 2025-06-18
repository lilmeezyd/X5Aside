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
import { useAddPlayerMutation } from "../slices/playerApiSlice";

const POSITIONS = ["Captain", "Ace", "Forward", "Midfielder", "Defender"];

export default function TeamCard({ team }) {
  const [open, setOpen] = useState(false);
  const [xHandle, setXhandle] = useState("");
  const [fplId, setFplId] = useState("");
  const [position, setPosition] = useState("");
  const [addPlayer] = useAddPlayerMutation();

  const handleAddPlayer = async () => {
    toast("Adding player...");
    try {
      const res = await addPlayer({
        xHandle,
        fplId,
        position,
        team: team._id,
      }).unwrap();

      toast.success(`${res.manager} has been added`);
      setXhandle("");
      setFplId("");
      setPosition("");
      setOpen(false);
    } catch {
      toast.error("Failed to add player");
      setXhandle("");
      setFplId("");
      setPosition("");
      setOpen(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold">{team.name}</h3>
      <p className="text-sm text-gray-600">
        Players: {team.players?.length ?? 0}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => setOpen(true)}>
              Add Player
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Player to {team.name}</DialogTitle>
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
            <Select value={position} onValueChange={setPosition}>
              <SelectTrigger className="w-full mb-4">
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
  );
}
