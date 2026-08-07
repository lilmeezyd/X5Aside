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
import { useGetPlayersQuery } from "../slices/playerApiSlice";

export default function NormalTeamCard({ team, refetch, setTeamDetails }) {
  const dbName = useSelector((state) => state.database.dbName);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [open, setOpen] = useState(false);
  const [xHandle, setXhandle] = useState("");
  const [fplId, setFplId] = useState("");
  const [position, setPosition] = useState("");
  const [startPrice, setStartPrice] = useState(0.0);
  const [addPlayer] = useAddPlayerMutation();
  const [showPlayers, setShowPlayers] = useState(false);
  const {
    data: players = [],
    isLoading: playersLoading,
    isError: playersError,
    refetch: refetchPlayers,
  } = useGetPlayersQuery({ dbName, team: team._id });
  const imageComp =
    dbName.includes("X5Aside") ? "X5" : dbName.includes("app5Aside") ? "FFK" : "X5";
  const teamLength = players?.filter((x) => x.isActive)?.length;

  return (
    <>
        <div 
      onClick={() => setTeamDetails({_id: team._id, team})} className="cursor-pointer border border-gray-300 rounded-lg shrink-0 shadow-2xl ">
          <img
            src={
              dbName === "ffkPro"
                ? team.url
                : `https://ik.imagekit.io/cap10/${team.short_name}_${imageComp}.png`
            }
            alt={team.name}
            className="p-2 w-20 h-20 object-contain rounded"
          />
        </div>
    </>
  );
}
