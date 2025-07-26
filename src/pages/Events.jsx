import { useSelector } from "react-redux";
import { useState } from "react";
import { Button } from "../../@/components/ui/button";
import { Card, CardContent } from "../../@/components/ui/card";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  useGetEventsQuery,
  useSetCurrentEventMutation,
  useResetEventsMutation,
} from "../slices/eventApiSlice"; // Adjust path if needed

export default function Events() {
  const dbName = useSelector((state) => state.database.dbName);

  const {
    data: events = [],
    isLoading,
    isError,
    refetch,
  } = useGetEventsQuery(dbName);

  const [resetEvents, { isLoading: isResetting }] = useResetEventsMutation();
  const [setCurrentEvent, { isLoading: isSetting }] = useSetCurrentEventMutation();

  const handleReset = async () => {
    const toastId = toast.loading("Resetting events...");
    try {
      await resetEvents(dbName).unwrap();
      toast.success("Events reset successfully.", { id: toastId });
    } catch (err) {
      toast.error("Failed to reset events.", { id: toastId });
      console.error(err);
    }
  };

  const handleStartGW = async () => {
    const toastId = toast.loading("Starting gameweek...");
    try {
      await setCurrentEvent(dbName).unwrap();
      toast.success("Gameweek started.", { id: toastId });
    } catch (err) {
      toast.error("Failed to start gameweek.", { id: toastId });
      console.error(err);
    }
  };

  const renderBoolIcon = (value) =>
    value ? (
      <CheckCircle className="text-green-500 w-5 h-5" />
    ) : (
      <XCircle className="text-red-500 w-5 h-5" />
    );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Events</h2>
        <div className="space-x-2">
          <Button onClick={handleReset} disabled={isResetting}>
            {isResetting && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
            Reset
          </Button>
          <Button onClick={handleStartGW} disabled={isSetting}>
            {isSetting && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
            Start GW
          </Button>
        </div>
      </div>

      {isLoading ? (
        <p>Loading events...</p>
      ) : isError ? (
        <div className="text-center text-red-500">Failed to load events.</div>
      ) : events.length === 0 ? (
        <div className="text-center text-gray-500">No events found.</div>
      ) : (
        <Card>
          <CardContent className="p-4 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">GW</th>
                  <th className="px-4 py-2">Deadline</th>
                  <th className="px-4 py-2">Current</th>
                  <th className="px-4 py-2">Next</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr
                    key={event._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-2">{event.eventId}</td>
                    <td className="px-4 py-2">
                      {format(new Date(event.deadline), "PPP p")}
                    </td>
                    <td className="px-4 py-2">{renderBoolIcon(event.current)}</td>
                    <td className="px-4 py-2">{renderBoolIcon(event.next)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
