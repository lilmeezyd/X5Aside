import { FaFutbol } from "react-icons/fa";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../@/components/ui/tabs"; // adjust path if needed
import { useState } from "react";
import { useGetCurrentEventQuery } from "../slices/eventApiSlice";
import { useSelector } from "react-redux";

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
    homePicks = [],
    awayPicks = [],
    homeCap = [],
    awayCap = [],
    homeAce = [],
    awayAce = [],
    homeMid = [],
    awayMid = [],
    homeFwd = [],
    awayFwd = [],
    homeDef = [],
    awayDef = [],
  } = f;

  const dbName = useSelector((state) => state.database.dbName);
  const [tab, setTab] = useState("classic");
  const { data: eventId } = useGetCurrentEventQuery(dbName);

  const positions = ["Captain", "Ace", "Forward", "Midfielder", "Defender"];
  const shortPosition = {
    Captain: "Cap",
    Ace: "Ace",
    Forward: "Fwd",
    Midfielder: "Mid",
    Defender: "Def",
  };
  const homeStatsH2HWithPosition = homeStatsH2H.map((x) => {
    return {
      ...x,
      turf: "home",
    };
  });
  const awayStatsH2HWithPosition = awayStatsH2H.map((x) => {
    return {
      ...x,
      turf: "away",
    };
  });
  const homeStatsH2HMap = new Map(
    homeStatsH2H
      .map((x) => {
        return {
          position: x.position,
          points: x.eventPoints - x.eventTransfersCost,
        };
      })
      .map((x) => [x.position, x.points])
  );
  const awayStatsH2HMap = new Map(
    awayStatsH2H
      .map((x) => {
        return {
          position: x.position,
          points: x.eventPoints - x.eventTransfersCost,
        };
      })
      .map((x) => [x.position, x.points])
  );

  const sortByPosition = (stats) => {
    return [...stats]
      .map((x) => {
        const diff =
          x.turf === "home"
            ? x.eventPoints -
              x.eventTransfersCost -
              awayStatsH2HMap.get(x.position)
            : x.eventPoints -
              x.eventTransfersCost -
              homeStatsH2HMap.get(x.position);
        return {
          ...x,
          result: diff > 0 ? "W" : diff < 0 ? "L" : "D",
        };
      })
      .sort(
        (a, b) => positions.indexOf(a.position) - positions.indexOf(b.position)
      );
  };

  console.log(sortByPosition(awayStatsH2HWithPosition));
  console.log(sortByPosition(homeStatsH2HWithPosition));

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
            <h3 className="sm:text-xl font-bold border-b pb-2 mb-4 text-left sm:text-center">
              Classic Stats
            </h3>
            <div className="min-w-[800px]">
              <table className="w-full text-left border">
                <thead>
                  <tr className="border-b text-gray-600">
                    <th className="px-2 border"></th>
                    <th className="px-2 border"></th>
                    <th className="px-2 border text-center">Pts</th>
                    <th className="px-2 border text-center">Hits</th>
                    <th className="px-2 border text-center">Goals</th>
                    <th className="px-2 border w-[50px] text-center font-bold sm:text-base">
                      Home
                    </th>
                    <th className="w-[50px] px-2 border "></th>
                    <th className="px-2 border w-[50px] text-center font-bold text-sm sm:text-base">
                      Away
                    </th>
                    <th className="px-2 border text-center">Goals</th>
                    <th className="px-2 border text-center">Hits</th>
                    <th className="px-2 border text-center">Pts</th>
                    <th className="px-2 border"></th>
                    <th className="px-2 border"></th>
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
                        <td className="px-2 border">
                          {home && (
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {home.manager}
                              </span>
                              <a
                                href={
                                  eventId
                                    ? `https://fantasy.premierleague.com/entry/${home?.fplId}/event/${eventId}`
                                    : `https://fantasy.premierleague.com/entry/${home?.fplId}/history/`
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline text-xs"
                              >
                                {home.teamName}
                              </a>
                              {home.xHandle && (
                                <a
                                  href={`https://x.com/${home.xHandle.replace(
                                    /^@/,
                                    ""
                                  )}`}
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
                        <td className="px-2 border text-center">
                          {home && shortPosition[home.position]}
                        </td>
                        <td
                          className={`px-2 border text-center
                            ${
                              topHome.includes(home?.fplId)
                                ? "text-green-600 font-semibold"
                                : ""
                            }
                          `}
                        >
                          {home?.eventPoints ?? "-"}
                        </td>
                        <td className="px-2 border text-center">
                          {home?.eventTransfersCost ?? "-"}
                        </td>
                        <td className="px-2 border text-center text-green-600">
                          {home?.goals
                            ? [...Array(home.goals)].map((_, idx) => (
                                <FaFutbol
                                  key={idx}
                                  className="inline-block mr-1"
                                />
                              ))
                            : ""}
                        </td>
                        {i === 0 && (
                          <td rowSpan={5} className="px-2 border">
                            <div className="flex flex-col justify-center items-center font-semibold text-2xl">
                              {String(homeTotal)
                                .split("")
                                .map((d, i) => (
                                  <span key={i}>{d}</span>
                                ))}
                            </div>
                          </td>
                        )}
                        {i === 0 && (
                          <td rowSpan={5} className="w-[50px]">
                            <div className="difference bg-red-700 text-3xl p-2 rounded-lg font-bold text-white">
                              {Math.abs(homeTotal - awayTotal)}
                            </div>
                          </td>
                        )}
                        {i === 0 && (
                          <td rowSpan={5} className="border px-2">
                            <div className="flex flex-col justify-center items-center font-semibold text-2xl">
                              {String(awayTotal)
                                .split("")
                                .map((d, i) => (
                                  <span key={i}>{d}</span>
                                ))}
                            </div>
                          </td>
                        )}
                        <td className="px-2 border text-center text-green-600">
                          {away?.goals
                            ? [...Array(away.goals)].map((_, idx) => (
                                <FaFutbol
                                  key={idx}
                                  className="inline-block mr-1"
                                />
                              ))
                            : ""}
                        </td>
                        <td className="px-2 border text-center">
                          {away?.eventTransfersCost ?? "-"}
                        </td>
                        <td
                          className={`px-2 border text-center ${
                            topAway.includes(away?.fplId)
                              ? "text-green-600 font-semibold"
                              : ""
                          }`}
                        >
                          {away?.eventPoints ?? "-"}
                        </td>
                        <td className="px-2 border text-center">
                          {away && shortPosition[away.position]}
                        </td>
                        <td className="px-2 py-2">
                          {away && (
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {away.manager}
                              </span>
                              <a
                                href={
                                  eventId
                                    ? `https://fantasy.premierleague.com/entry/${away?.fplId}/event/${eventId}`
                                    : `https://fantasy.premierleague.com/entry/${away?.fplId}/history/`
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline text-xs"
                              >
                                {away.teamName}
                              </a>
                              {away.xHandle && (
                                <a
                                  href={`https://x.com/${away.xHandle.replace(
                                    /^@/,
                                    ""
                                  )}`}
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
              <div className="mt-2">
                <h4 className="font-semibold">Differentials</h4>
                <div className="flex flex-wrap justify-between border rounded">
                  <div className=" bg-blue-100 p-2 flex-wrap w-1/2">
                    <div className="flex flex-wrap">
                      {homePicks.map((pick, index) => (
                        <div key={pick.element} className="mr-2 mb-1">
                          {pick.multiplier > 1 && `${pick.multiplier}x`}
                          {pick.webName}
                          {index < homePicks.length - 1 && ","}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className=" bg-red-100 p-2 flex-wrap w-1/2">
                    <div className="flex flex-wrap">
                      {awayPicks.map((pick, index) => (
                        <div key={pick.element} className="mr-2 mb-1">
                          {pick.multiplier > 1 && `${pick.multiplier}x`}
                          {pick.webName}
                          {index < awayPicks.length - 1 && ","}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* H2H Stats */}
        <TabsContent value="h2h">
          <div className="bg-white p-4 my-4 rounded shadow text-sm w-full overflow-x-auto">
            <h3 className="sm:text-xl font-bold border-b pb-2 mb-4 text-left sm:text-center">
              H2H Stats
            </h3>
            <div className="min-w-[800px]">
              <table className="w-full text-left border">
                <thead>
                  <tr className="border-b text-gray-600">
                    <th className="px-2 border text-center "></th>
                    <th className="px-2 border text-center "></th>
                    <th className="px-2 border text-center ">Goals</th>
                    <th className="px-2 border text-center ">Pts</th>
                    <th className="px-2 border text-center font-bold sm:text-base">
                      Home
                    </th>
                    <th className="px-2 border text-center font-bold sm:text-base">
                      Away
                    </th>
                    <th className="px-2 border text-center">Pts</th>
                    <th className="px-2 border text-center">Goals</th>
                    <th className="px-2 border text-center"></th>
                    <th className="px-2 border text-center"></th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({
                    length: Math.max(homeStatsH2H.length, awayStatsH2H.length),
                  }).map((_, i) => {
                    const home = sortByPosition(homeStatsH2HWithPosition)[i];
                    const away = sortByPosition(awayStatsH2HWithPosition)[i];
                    return (
                      <tr key={i} className="border-t">
                        <td className="px-2 py-2">
                          {home && (
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {home.manager}
                              </span>
                              <a
                                href={
                                  eventId
                                    ? `https://fantasy.premierleague.com/entry/${home?.fplId}/event/${eventId}`
                                    : `https://fantasy.premierleague.com/entry/${home?.fplId}/history/`
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline text-xs"
                              >
                                {home.teamName}
                              </a>
                              {home.xHandle && (
                                <a
                                  href={`https://x.com/${home.xHandle.replace(
                                    /^@/,
                                    ""
                                  )}`}
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
                        <td className="px-2 border text-center">
                          {home && shortPosition[home.position]}
                        </td>
                        <td className="px-2 border text-center text-green-600">
                          {home?.goals
                            ? [...Array(home.goals)].map((_, idx) => (
                                <FaFutbol
                                  key={idx}
                                  className="inline-block mr-1"
                                />
                              ))
                            : ""}
                        </td>
                        <td
                          className={` px-2 border text-center ${
                            topHomeH2H.includes(home?.fplId)
                              ? "text-green-600 font-semibold"
                              : ""
                          }`}
                        >
                          {home?.eventPoints != null &&
                          home?.eventTransfersCost != null
                            ? home.eventPoints - home.eventTransfersCost
                            : "-"}
                        </td>

                        <td>
                          <div className={`${
                            home.result === "W"
                              ? "bg-green-700"
                              : home.result === "L"
                              ? "bg-red-700"
                              : "bg-gray-700"
                          } border text-center font-bold sm:text-base w-[80%] rounded-lg m-auto py-2  text-white`}>
                          {home.result}
                          </div>
                        </td>
                        <td
                         
                        ><div className={`${
                            away.result === "W"
                              ? "bg-green-700"
                              : away.result === "L"
                              ? "bg-red-700"
                              : "bg-gray-700"
                          } border text-center font-bold sm:text-base w-[80%] rounded-lg m-auto py-2 text-white`}>
                          {away.result}
                          </div>
                        </td>

                        <td
                          className={`px-2 border text-center ${
                            topAwayH2H.includes(away?.fplId)
                              ? "text-green-600 font-semibold"
                              : ""
                          }`}
                        >
                          {away?.eventPoints != null &&
                          away?.eventTransfersCost != null
                            ? away.eventPoints - away.eventTransfersCost
                            : "-"}
                        </td>
                        <td className="px-2 border text-center text-green-600">
                          {away?.goals
                            ? [...Array(away.goals)].map((_, idx) => (
                                <FaFutbol
                                  key={idx}
                                  className="inline-block mr-1"
                                />
                              ))
                            : ""}
                        </td>
                        <td className="px-2 border text-center">
                          {away && shortPosition[away.position]}
                        </td>
                        <td className="px-2 py-2 border">
                          {away && (
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {away.manager}
                              </span>
                              <a
                                href={
                                  eventId
                                    ? `https://fantasy.premierleague.com/entry/${away?.fplId}/event/${eventId}`
                                    : `https://fantasy.premierleague.com/entry/${away?.fplId}/history/`
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline text-xs"
                              >
                                {away.teamName}
                              </a>
                              {away.xHandle && (
                                <a
                                  href={`https://x.com/${away.xHandle.replace(
                                    /^@/,
                                    ""
                                  )}`}
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
              <div className="mt-2">
                <h4 className="font-semibold">Differentials</h4>
                <div className="flex flex-wrap border rounded my-1">
                  <div className="bg-blue-100 p-2 rounded flex-wrap w-5/12">
                    <div className="flex flex-wrap">
                      {homeCap.map((pick, index) => (
                        <div key={pick.element} className="mr-2 mb-1">
                          {pick.multiplier > 1 && `${pick.multiplier}x`}
                          {pick.webName}
                          {index < homeCap.length - 1 && ","}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="w-1/6 text-center self-center font-semibold">
                    Captain
                  </div>
                  <div className="bg-red-100 p-2 rounded flex-wrap w-5/12">
                    <div className="flex flex-wrap">
                      {awayCap.map((pick, index) => (
                        <div key={pick.element} className="mr-2 mb-1">
                          {pick.multiplier > 1 && `${pick.multiplier}x`}
                          {pick.webName}
                          {index < awayCap.length - 1 && ","}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap border rounded my-1">
                  <div className="bg-blue-100 p-2 rounded flex-wrap w-5/12">
                    <div className="flex flex-wrap">
                      {homeAce.map((pick, index) => (
                        <div key={pick.element} className="mr-2 mb-1">
                          {pick.multiplier > 1 && `${pick.multiplier}x`}
                          {pick.webName}
                          {index < homeAce.length - 1 && ","}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="w-1/6 text-center self-center font-semibold">
                    Ace
                  </div>
                  <div className="bg-red-100 p-2 rounded flex-wrap w-5/12">
                    <div className="flex flex-wrap">
                      {awayAce.map((pick, index) => (
                        <div key={pick.element} className="mr-2 mb-1">
                          {pick.multiplier > 1 && `${pick.multiplier}x`}
                          {pick.webName}
                          {index < awayAce.length - 1 && ","}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap border rounded my-1">
                  <div className="bg-blue-100 p-2 rounded flex-wrap w-5/12">
                    <div className="flex flex-wrap">
                      {homeFwd.map((pick, index) => (
                        <div key={pick.element} className="mr-2 mb-1">
                          {pick.multiplier > 1 && `${pick.multiplier}x`}
                          {pick.webName}
                          {index < homeFwd.length - 1 && ","}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="w-1/6 text-center self-center font-semibold">
                    Forward
                  </div>
                  <div className="bg-red-100 p-2 rounded flex-wrap w-5/12">
                    <div className="flex flex-wrap">
                      {awayFwd.map((pick, index) => (
                        <div key={pick.element} className="mr-2 mb-1">
                          {pick.multiplier > 1 && `${pick.multiplier}x`}
                          {pick.webName}
                          {index < awayFwd.length - 1 && ","}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap border rounded my-1">
                  <div className="bg-blue-100 p-2 rounded flex-wrap w-5/12">
                    <div className="flex flex-wrap">
                      {homeMid.map((pick, index) => (
                        <div key={pick.element} className="mr-2 mb-1">
                          {pick.multiplier > 1 && `${pick.multiplier}x`}
                          {pick.webName}
                          {index < homeMid.length - 1 && ","}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="w-1/6 text-center self-center font-semibold">
                    Midfielder
                  </div>
                  <div className="bg-red-100 p-2 rounded flex-wrap w-5/12">
                    <div className="flex flex-wrap">
                      {awayMid.map((pick, index) => (
                        <div key={pick.element} className="mr-2 mb-1">
                          {pick.multiplier > 1 && `${pick.multiplier}x`}
                          {pick.webName}
                          {index < awayMid.length - 1 && ","}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap border rounded my-1">
                  <div className="bg-blue-100 p-2 rounded flex-wrap w-5/12">
                    <div className="flex flex-wrap">
                      {homeDef.map((pick, index) => (
                        <div key={pick.element} className="mr-2 mb-1">
                          {pick.multiplier > 1 && `${pick.multiplier}x`}
                          {pick.webName}
                          {index < homeDef.length - 1 && ","}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="w-1/6 text-center self-center font-semibold">
                    Defender
                  </div>
                  <div className="bg-red-100 p-2 rounded flex-wrap w-5/12">
                    <div className="flex flex-wrap">
                      {awayDef.map((pick, index) => (
                        <div key={pick.element} className="mr-2 mb-1">
                          {pick.multiplier > 1 && `${pick.multiplier}x`}
                          {pick.webName}
                          {index < awayDef.length - 1 && ","}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
