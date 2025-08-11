import { FaFutbol } from "react-icons/fa";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../@/components/ui/tabs"; // adjust path if needed
import { useState } from "react";

export default function FixtureStats({ f }) {
  const {
    homeTeam,
    awayTeam,
    homeTotal,
    awayTotal,
    homeStats = [],
    awayStats = [],
    homeStatsH2H = [],
    awayStatsH2H = [],
  } = f;

  const [tab, setTab] = useState("classic");

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
      (a, b) => positions.indexOf(a.position) - positions.indexOf(b.position)
    );

  const highlightTopScorer = (sideStats) => {
    const max = Math.max(...sideStats.map((s) => s?.eventPoints || 0));
    return sideStats.reduce((acc, curr) => {
      if (curr?.eventPoints === max) acc.push(curr?.fplId);
      return acc;
    }, []);
  };

  const topHome = highlightTopScorer(homeStats);
  const topAway = highlightTopScorer(awayStats);
  const topHomeH2H = highlightTopScorer(homeStatsH2H);
  const topAwayH2H = highlightTopScorer(awayStatsH2H);

  return (
    <div className="w-full">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="w-full justify-center mb-4">
          <TabsTrigger value="classic">Classic</TabsTrigger>
          <TabsTrigger value="h2h">H2H</TabsTrigger>
        </TabsList>

        {/* Classic Stats */}
        <TabsContent value="classic">
          <div className="bg-white p-4 my-4 rounded shadow text-sm w-full overflow-x-auto">
            <h3 className="sm:text-xl font-bold border-b pb-2 mb-4 text-left sm:text-center">Classic Stats</h3>
            <div className="min-w-[800px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-gray-600">
                    <th></th>
                    <th></th>
                    <th>Pts</th>
                    <th>Hits</th>
                    <th>Goals</th>
                    <th className="text-center font-bold sm:text-base">{homeTeam}</th>
                    <th className="text-center font-bold text-sm sm:text-base">{awayTeam}</th>
                    <th>Goals</th>
                    <th>Hits</th>
                    <th>Pts</th>
                    <th></th>
                    <th></th>
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
                        <td className="px-2 py-2">
                          {home && (
                            <div className="flex flex-col">
                              <span className="font-medium">{home.manager}</span>
                              <a
                                href={`https://fantasy.premierleague.com/entry/${home.fplId}/history`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline text-xs"
                              >
                                {home.teamName}
                              </a>
                              {home.xHandle && (
                                <a
                                  href={`https://x.com/${home.xHandle.replace(/^@/, "")}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-gray-500 hover:underline text-xs"
                                >
                                  {home.xHandle}
                                </a>
                              )}
                            </div>
                          )}
                        </td>
                        <td>{home && shortPosition[home.position]}</td>
                        <td className={topHome.includes(home?.fplId) ? "text-green-600 font-semibold" : ""}>
                          {home?.eventPoints ?? "-"}
                        </td>
                        <td>{home?.eventTransfersCost ?? "-"}</td>
                        <td className="text-green-600">
                          {home?.goals ? [...Array(home.goals)].map((_, idx) => (
                            <FaFutbol key={idx} className="inline-block mr-1" />
                          )) : ""}
                        </td>
                        <td className="text-center font-bold sm:text-base">{i === 0 ? homeTotal : ""}</td>
                        <td className="text-center font-bold sm:text-base">{i === 0 ? awayTotal : ""}</td>
                        <td className="text-green-600">
                          {away?.goals ? [...Array(away.goals)].map((_, idx) => (
                            <FaFutbol key={idx} className="inline-block mr-1" />
                          )) : ""}
                        </td>
                        <td>{away?.eventTransfersCost ?? "-"}</td>
                        <td className={topAway.includes(away?.fplId) ? "text-green-600 font-semibold" : ""}>
                          {away?.eventPoints ?? "-"}
                        </td>
                        <td>{away && shortPosition[away.position]}</td>
                        <td className="px-2 py-2">
                          {away && (
                            <div className="flex flex-col">
                              <span className="font-medium">{away.manager}</span>
                              <a
                                href={`https://fantasy.premierleague.com/entry/${away.fplId}/history`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline text-xs"
                              >
                                {away.teamName}
                              </a>
                              {away.xHandle && (
                                <a
                                  href={`https://x.com/${away.xHandle.replace(/^@/, "")}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-gray-500 hover:underline text-xs"
                                >
                                  {away.xHandle}
                                </a>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* H2H Stats */}
        <TabsContent value="h2h">
          <div className="bg-white p-4 my-4 rounded shadow text-sm w-full overflow-x-auto">
            <h3 className="sm:text-xl font-bold border-b pb-2 mb-4 text-left sm:text-center">H2H Stats</h3>
            <div className="min-w-[800px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-gray-600">
                    <th></th>
                    <th></th>
                    <th>Goals</th>
                    <th>Pts</th>
                    <th className="text-center font-bold sm:text-base">{homeTeam}</th>
                    <th className="text-center font-bold sm:text-base">{awayTeam}</th>
                    <th>Pts</th>
                    <th>Goals</th>
                    <th></th>
                    <th></th>
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
                        <td className="px-2 py-2">
                          {home && (
                            <div className="flex flex-col">
                              <span className="font-medium">{home.manager}</span>
                              <a
                                href={`https://fantasy.premierleague.com/entry/${home.fplId}/history`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline text-xs"
                              >
                                {home.teamName}
                              </a>
                              {home.xHandle && (
                                <a
                                  href={`https://x.com/${home.xHandle.replace(/^@/, "")}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-gray-500 hover:underline text-xs"
                                >
                                  {home.xHandle}
                                </a>
                              )}
                            </div>
                          )}
                        </td>
                        <td>{home && shortPosition[home.position]}</td>
                        <td className="text-green-600">
                          {home?.goals ? [...Array(home.goals)].map((_, idx) => (
                            <FaFutbol key={idx} className="inline-block mr-1" />
                          )) : ""}
                        </td>
                        <td className={topHomeH2H.includes(home?.fplId) ? "text-green-600 font-semibold" : ""}>
                          {(home?.eventPoints - home?.eventTransfersCost) ?? "-"}
                        </td>
                        
                        <td className="text-center font-bold sm:text-base">{i === 0 ? f.homeScoreH2H : ""}</td>
                        <td className="text-center font-bold sm:text-base">{i === 0 ? f.awayScoreH2H : ""}</td>
                        
                        <td className={topAwayH2H.includes(away?.fplId) ? "text-green-600 font-semibold" : ""}>
                          {(away?.eventPoints-away?.eventTransfersCost) ?? "-"}
                        </td>
                        <td className="text-green-600">
                          {away?.goals ? [...Array(away.goals)].map((_, idx) => (
                            <FaFutbol key={idx} className="inline-block mr-1" />
                          )) : ""}
                        </td>
                        <td>{away && shortPosition[away.position]}</td>
                        <td className="px-2 py-2">
                          {away && (
                            <div className="flex flex-col">
                              <span className="font-medium">{away.manager}</span>
                              <a
                                href={`https://fantasy.premierleague.com/entry/${away.fplId}/history`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline text-xs"
                              >
                                {away.teamName}
                              </a>
                              {away.xHandle && (
                                <a
                                  href={`https://x.com/${away.xHandle.replace(/^@/, "")}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-gray-500 hover:underline text-xs"
                                >
                                  {away.xHandle}
                                </a>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
