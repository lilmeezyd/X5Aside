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
import { useSelector } from "react-redux";
import { MdCheck, MdCheckCircle, MdClose, MdCancel } from "react-icons/md";
import { FaArrowCircleDown, FaArrowCircleUp, FaCircle } from "react-icons/fa";

const POSITIONS = ["Captain", "Ace", "Forward", "Midfielder", "Defender"];

export default function TeamCard({ team, refetch }) {
  const dbName = useSelector((state) => state.database.dbName);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [open, setOpen] = useState(false);
  const [xHandle, setXhandle] = useState("");
  const [fplId, setFplId] = useState("");
  const [position, setPosition] = useState("");
  const [startPrice, setStartPrice] = useState(0.0);
  const [addPlayer] = useAddPlayerMutation();
  const [showPlayers, setShowPlayers] = useState(false);
  const imageComp =
    dbName === "X5Aside" ? "X5" : dbName === "app5Aside" ? "FFK" : "X5";
  const handlePlayerAdded = (newPlayer) => {
    setPlayers((prev) => [...prev, newPlayer]);
  };
  const teamLength = team?.players?.filter((x) => x.isActive)?.length;

  const handleAddPlayer = async () => {
    toast("Adding player...");
    try {
      const res = await addPlayer({
        xHandle,
        fplId,
        position,
        startPrice,
        team: team._id,
        dbName,
      }).unwrap();
      refetch();
      toast.success(`${res.manager} has been added`);
      /* handlePlayerAdded({
        xHandle,
        fplId,
        position,
        manager: res.manager,
      }); */
      setXhandle("");
      setFplId("");
      setPosition("");
      setStartPrice(0.0);
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error(error.data.message || "Failed to add player");
      setXhandle("");
      setFplId("");
      setPosition("");
      setStartPrice(0.0);
      setOpen(false);
    }
  };

  return (
    <div
      className="cursor-pointer"
      onClick={() => setShowPlayers((prev) => !prev)}
    >
      <div className="bg-white p-4 rounded shadow flex flex-col gap-3 border">
        <div className="flex items-center gap-4">
          <img
            src={`https://ik.imagekit.io/cap10/${team.short_name}_${imageComp}.png`}
            alt={`${team.name} badge`}
            className="h-20 w-20 object-contain rounded"
          />

          <div>
            <h3 className="text-lg font-semibold">{team.name}</h3>
            <p className="text-sm text-gray-600">Players: {teamLength ?? 0}</p>
          </div>
        </div>
        <div className="shadow flex justify-between items-center border border-gray-300 rounded px-2">
          <div className="flex flex-col text-center justify-center px-2 ">
            <div className="border-b border-gray-500  font-bold">Rank:</div>
            <div className="flex space-x-2 items-center p-1">
              <span>{team?.rank}</span>
              <div className="flex space-x-1 items-center">
              <span>
                {team?.oldRank > team?.rank && team?.oldRank > 0 && (
                  <FaArrowCircleUp className="text-green-500" size={16} />
                )}
                {(team?.oldRank === team?.rank || team?.oldRank === 0) && (
                  <FaCircle className="text-gray-500" size={16} />
                )}
                {team?.oldRank < team?.rank && team?.oldRank > 0 && (
                  <FaArrowCircleDown className="text-red-500" size={16} />
                )}
              </span>
              <span
                className={`font-bold ${
                  team?.oldRank > 0
                    ? team?.oldRank < team?.rank
                      ? "text-red-500"
                      : team?.oldRank > team?.rank
                        ? `text-green-500`
                        : "text-gray-500"
                    : "text-gray-500"
                }`}
              >
                {team?.oldRank > 0
                  ? team?.oldRank < team?.rank
                    ? team?.oldRank - team?.rank
                    : team?.oldRank > team?.rank
                      ? `+${team?.oldRank - team?.rank}`
                      : ""
                  : ""}
              </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col text-center justify-center px-2 ">
            <div className="border-b border-gray-500 font-semibold">
              Total Points:
            </div>
            <div>{team?.total}</div>
          </div>
        </div>

        {userInfo && (
          <div className="flex flex-wrap gap-2">
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

                {dbName === "X5Aside" && (
                  <Input
                    placeholder="Enter player X handle"
                    value={xHandle}
                    onChange={(e) => setXhandle(e.target.value)}
                    className="mb-2"
                  />
                )}
                <Input
                  placeholder="Enter player FPL ID"
                  value={fplId}
                  onChange={(e) => setFplId(e.target.value)}
                  className="mb-2"
                />
                {dbName === "ghj" && (
                  <Input
                    type="number"
                    placeholder="Enter Starting Price"
                    value={startPrice}
                    onChange={(e) => setStartPrice(e.target.value)}
                  />
                )}
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
          </div>
        )}
      </div>

      {showPlayers && team?.players?.length > 0 && (
        <div className="mt-2 ml-4 border-l-2 border-gray-200 pl-4">
          <h4 className="font-semibold mb-1 text-gray-700">Players:</h4>
          <ul className="space-y-1 text-sm py-1">
            {team?.players
              ?.filter((x) => x.isActive)
              ?.map((player, index) => (
                <li key={index} className="text-gray-600">
                  • {player.manager} —{" "}
                  <span className="italic">{player.position}</span>
                  &nbsp;&nbsp;
                  <span className="italic font-bold">
                    Joined in GW{player.startGW}
                  </span>
                  <span>
                    <MdCheckCircle color="green" size={24} />
                  </span>
                </li>
              ))}
          </ul>
          {team?.players?.filter((x) => !x.isActive)?.length > 0 && (
            <h4 className="font-semibold mb-1 text-gray-700">Ex Players:</h4>
          )}
          <ul className="space-y-1 text-sm py-1">
            {team?.players
              ?.filter((x) => !x.isActive)
              ?.map((player, index) => (
                <li key={index} className="text-gray-600">
                  • {player.manager} —{" "}
                  <span className="italic">{player.position}</span>
                  &nbsp;&nbsp;
                  <span className="italic font-bold">
                    Left after GW{player.endGW}
                  </span>
                  <span>
                    <MdCancel color="red" size={24} />
                  </span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
