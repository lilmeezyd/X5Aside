import TeamCard from "./TeamCard"; // adjust path if needed
import { Button } from "../../@/components/ui/button";
import { useGetQuery } from "../slices/teamApiSlice";

export default function Teams() {
  const { data: teams = [], isLoading } = useGetQuery();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Teams</h2>
      <Button className="mb-4">Add Teams from FPL API</Button>

      {isLoading ? (
        <p>Loading teams...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <TeamCard key={team._id} team={team} />
          ))}
        </div>
      )}
    </div>
  );
}
