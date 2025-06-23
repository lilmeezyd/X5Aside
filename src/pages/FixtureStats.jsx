import { FaFutbol } from "react-icons/fa";

export default function FixtureStats({ f }) {
  const {
    homeTeam,
    awayTeam,
    homeTotal,
    awayTotal,
    homeStats,
    awayStats,
    homeStatsH2H,
    awayStatsH2H,
  } = f;
  console.log(f);

  const positions = ["Captain", "Ace", "Forward", "Midfielder", "Defender"];
  const shortPosition = {
    Captain: "Cap",
    Ace: "Ace",
    Forward: "Fwd",
    Midfielder: "Mid",
    Defender: "Def",
  };

  const sortByPosition = (stats) =>
    [...stats].sort(
      (a, b) => positions.indexOf(a.position) - positions.indexOf(b.position),
    );
  return (
    <div className="bg-white p-4 rounded shadow mt-6 space-y-6 min-w-full">
      {/* Classic Stats */}

      <h3 className="text-xl font-bold border-b pb-2">Classic Stats</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-4 px-2"></th>
              <th className="py-4 px-2"></th>
        
              <th className="py-4 px-2">Points</th>
              <th className="py-4 px-2">Hits</th>
              <th className="font-bold py-4 px-2"></th>
              <th className="font-bold py-4 px-2"></th>
              
              <th className="py-4 px-2">Hits</th>
              <th className="py-4 px-2" >Points</th>
              <th className="py-4 px-2"></th>
              <th className="py-4 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {Array.from({
              length: Math.max(homeStats.length, awayStats.length),
            }).map((_, i) => {
              const home = sortByPosition(homeStats)[i];
              const away = sortByPosition(awayStats)[i];

              return (
                <tr key={i} className="border-t">
                 <td className="px-4 py-3"> <div className="flex flex-col text-sm">
                    <span className="font-medium">{home.manager}</span>
                    <a
                      href={`https://fantasy.premierleague.com/entry/${home.fplId}/history`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline text-xs"
                    >
                      {home.teamName}
                    </a>
                    <a
                      href={`https://x.com/${home.xHandle.replace(/^@/, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-gray-500 hover:underline"
                    >
                      {home.xHandle}
                    </a>
                  </div></td>
                  {/*<td>
                    {home && (
                      <a
                        className="text-blue-600 hover:underline"
                        href={`https://fantasy.premierleague.com/entry/${home.fplId}/history`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {home.manager}
                      </a>
                    )}
                  </td>
                  <td>
                    {home && (
                      <a
                        className="text-blue-500 hover:underline"
                        href={`https://x.com/${home.xHandle.replace("@", "")}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {home.xHandle}
                      </a>
                    )}
                  </td>*/}
                  <td className="px-4 py-2">{home && shortPosition[home.position]}</td>
                  <td className="px-4 py-2">{home?.eventPoints}</td>
                  <td className="px-4 py-2">{home?.eventTransfersCost}</td>
                  <td className="px-4 py-2 text-center font-bold">
                    {i === 0 ? homeTotal : ""}
                  </td>
                  <td className="px-4 py-2 text-center font-bold">
                    {i === 0 ? awayTotal : ""}
                  </td>
                  
                  <td className="py-4 px-2">{away?.eventTransfersCost}</td>
                  <td className="py-4 px-2">{away?.eventPoints}</td>
                  <td className="py-4 px-2">{away && shortPosition[away.position]}</td>
                  <td className="px-4 py-3"> <div className="flex flex-col text-sm">
                    <span className="font-medium">{away.manager}</span>
                    <a
                      href={`https://fantasy.premierleague.com/entry/${away.fplId}/history`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline text-xs"
                    >
                      {away.teamName}
                    </a>
                    <a
                      href={`https://x.com/${away.xHandle.replace(/^@/, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-gray-500 hover:underline"
                    >
                      {away.xHandle}
                    </a>
                  </div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* H2H Stats */}
      <h3 className="text-xl font-bold border-b pb-2 mt-8">H2H Stats</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-600">
              <th>Manager</th>
              <th>X Handle</th>
              <th>Position</th>
              <th>Goals</th>
              <th>Points</th>
              <th>Hits</th>
              <th className="font-bold">{homeTeam}</th>
              <th className="font-bold">{awayTeam}</th>
              <th>Hits</th>
              <th>Points</th>
              <th>Goals</th>
              <th>Position</th>
              <th>X Handle</th>
              <th>Manager</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({
              length: Math.max(homeStatsH2H.length, awayStatsH2H.length),
            }).map((_, i) => {
              const home = sortByPosition(homeStatsH2H)[i];
              const away = sortByPosition(awayStatsH2H)[i];

              return (
                <tr key={i} className="border-t">
                  <td className="px-4 py-3"> <div className="flex flex-col text-sm">
                    <span className="font-medium">{home.manager}</span>
                    <a
                      href={`https://fantasy.premierleague.com/entry/${home.fplId}/history`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline text-xs"
                    >
                      {home.teamName}
                    </a>
                    <a
                      href={`https://x.com/${home.xHandle.replace(/^@/, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-gray-500 hover:underline"
                    >
                      {home.xHandle}
                    </a>
                  </div></td>
                  <td>{home && shortPosition[home.position]}</td>
                  <td className="text-green-600">
                    {home?.goals &&
                      [...Array(home?.goals)].map((_, idx) => (
                        <FaFutbol key={idx} className="inline-block mr-1" />
                      ))}
                  </td>
                  <td>{home?.eventPoints}</td>
                  <td>{home?.eventTransfersCost}</td>
                  <td className="text-center font-bold">
                    {i === 0 ? f.homeScoreH2H : ""}
                  </td>
                  <td className="text-center font-bold">
                    {i === 0 ? f.awayScoreH2H : ""}
                  </td>
                  <td>{away?.eventTransfersCost}</td>
                  <td>{away?.eventPoints}</td>
                  <td className="text-green-600">
                    {away?.goals &&
                      [...Array(away?.goals)].map((_, idx) => (
                        <FaFutbol key={idx} className="inline-block mr-1" />
                      ))}
                  </td>
                  <td className="px-4 py-2">{away && shortPosition[away.position]}</td>
                  <td className="px-4 py-3"> <div className="flex flex-col text-sm">
                    <span className="font-medium">{away.manager}</span>
                    <a
                      href={`https://fantasy.premierleague.com/entry/${away.fplId}/history`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline text-xs"
                    >
                      {away.teamName}
                    </a>
                    <a
                      href={`https://x.com/${away.xHandle.replace(/^@/, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-gray-500 hover:underline"
                    >
                      {away.xHandle}
                    </a>
                  </div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
