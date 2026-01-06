import { useState, useMemo, useEffect } from "react";
import { useGetEventsQuery, useGetCurrentEventQuery } from "../slices/eventApiSlice";
import { useGetPlayerFixturesQuery } from "../slices/fixtureApiSlice";
import { Button } from "../../@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../@/components/ui/select";
import { useSelector } from "react-redux"; 

const FIXTURES_PER_PAGE = 20;

export default function PlayerFixtures() {
  const dbName = useSelector((state) => state.database.dbName);
  const { data: events = [], isLoading: eventsLoading } = useGetEventsQuery(dbName);
  const { data: eventId } = useGetCurrentEventQuery(dbName)
  const { data = [], isLoading } = useGetPlayerFixturesQuery(dbName);
  const initialEventId = !eventsLoading && events.length > 0
    ? (events.find(event => event.current === true)?.eventId ?? 1)
    : 1;

  const [selectedEvent, setSelectedEvent] = useState(initialEventId);
  const [selectedPosition, setSelectedPosition] = useState("Captain");
  const [page, setPage] = useState(1);
  useEffect(() => {
    if (!eventsLoading && events.length > 0) {
      const currentEvent = events.find(event => event.current === true);
      if (currentEvent) {
        setSelectedEvent(prev => (prev !== currentEvent.eventId ? currentEvent.eventId : prev));
      }
    }
  }, [events, eventsLoading]);

  const filteredFixtures = useMemo(() => {
    let fixtures = [...data];
    if (selectedEvent) fixtures = fixtures.filter(f => f.eventId == selectedEvent);
    if (selectedPosition) fixtures = fixtures.filter(f => f.position === selectedPosition);
    return fixtures;
  }, [data, selectedEvent, selectedPosition]);

  const totalPages = Math.ceil(filteredFixtures.length / FIXTURES_PER_PAGE);
  const paginated = filteredFixtures.slice((page - 1) * FIXTURES_PER_PAGE, page * FIXTURES_PER_PAGE);

  const renderLink = (fplId) => eventId ? `https://fantasy.premierleague.com/entry/${fplId}/event/${eventId}` : 
  `https://fantasy.premierleague.com/entry/${fplId}/history/`;

  return (
    <>{eventsLoading ? (<p>Loading Events...</p>) : (<div className="p-4">
      {/*<h2 className="text-2xl font-bold mb-4">Player Fixtures</h2>*/}

      {!eventsLoading && <div className="flex gap-4 flex-wrap mb-6">
          <Select
            value={String(selectedEvent)}
            onValueChange={val => setSelectedEvent(Number(val))}
          >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by Event" />
          </SelectTrigger>
          <SelectContent>
            {[...new Set(data.map(f => f.eventId))].sort((x,y) => x-y).map(event => (
              <SelectItem key={event} value={String(event)}>Gameweek {event}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedPosition} onValueChange={setSelectedPosition}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by Position" />
          </SelectTrigger>
          <SelectContent>
            {[...new Set(data.map(f => f.position))].map(pos => (
              <SelectItem key={pos} value={pos}>{pos}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>}

      {selectedEvent && !eventsLoading && (
        <h3 className="text-xl font-semibold mb-4">Gameweek {selectedEvent}</h3>
      )}

      {isLoading ? (
        <p>Loading fixtures...</p>
      ) : (
        <div className="overflow-x-auto max-w-full">
          <table className="w-[320px] sm:w-full table-auto border border-gray-300 text-sm">
            <thead className="bg-gray-100 text-center">
              <tr>
                <th className="p-2 border w-[60px]"></th>
                <th className="p-2 border"></th>
                <th className="p-2 border w-[80px]"></th>
                <th className="p-2 border"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((fixture) => (
                <tr key={fixture._id} className="border">
                  <td className="p-2 border text-center align-middle font-semibold">
                    {fixture.eventId}
                  </td>
                  <td className="p-2 border text-right">
                    <a
                      href={renderLink(fixture.homePlayer?.fplId)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-black hover:underline block"
                    >
                      <div className="font-medium">{fixture.homePlayer?.teamName}</div>
                      <div className="text-xs text-gray-500">{fixture.homePlayer?.manager}</div>
                      <div className='italic p-1 border font-bold bg-gray-200'>
                        {fixture?.homeTeam?.name}</div>
                    </a>
                  </td>
                  <td className="p-2 border text-center font-bold text-lg align-middle">
                    {fixture.homeScore} : {fixture.awayScore}
                  </td>
                  <td className="p-2 border">
                    <a
                      href={renderLink(fixture.awayPlayer?.fplId)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-black hover:underline block"
                    >
                      <div className="font-medium">{fixture.awayPlayer?.teamName}</div>
                      <div className="text-xs text-gray-500">{fixture.awayPlayer?.manager}</div>
                      <div className='italic p-1 border bg-gray-200 font-bold'>
                        {fixture?.awayTeam?.name}</div>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Uncomment for pagination */}
          {/* 
          <div className="mt-4 flex items-center justify-between">
            <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} variant="secondary">Previous</Button>
            <span>Page {page} of {totalPages}</span>
            <Button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} variant="secondary">Next</Button>
          </div> 
          */}
        </div>
      )}
    </div>)}
    </>
  );
}
