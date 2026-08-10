import { FaFutbol } from "react-icons/fa";
import CardIcon from "./CardIcon";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../@/components/ui/tabs"; // adjust path if needed
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { formattedPicks } from "../hooks/formattedPicks";
import FormattedPicksCard from "./FormattedPicksCard";

export default function FixtureStats({ f, eventId }) {
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
  //const { data: eventId } = useGetCurrentEventQuery(dbName);

  const newHomePicks = formattedPicks(homePicks)
  const newAwayPicks = formattedPicks(awayPicks)
  const newAwayCap = formattedPicks(awayCap)
  const newAwayAce = formattedPicks(awayAce)
  const newAwayMid = formattedPicks(awayMid)
  const newAwayFwd = formattedPicks(awayFwd)
  const newAwayDef = formattedPicks(awayDef)
  const newHomeCap = formattedPicks(homeCap)
  const newHomeAce = formattedPicks(homeAce)
  const newHomeMid = formattedPicks(homeMid)
  const newHomeFwd = formattedPicks(homeFwd)
  const newHomeDef = formattedPicks(homeDef)

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
      .map((x) => [x.position, x.points]),
  );
  const awayStatsH2HMap = new Map(
    awayStatsH2H
      .map((x) => {
        return {
          position: x.position,
          points: x.eventPoints - x.eventTransfersCost,
        };
      })
      .map((x) => [x.position, x.points]),
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
        (a, b) => dbName === 'ffkPro' ? a.position - b.position : positions.indexOf(a.position) - positions.indexOf(b.position),
      );
  };

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
    <div className="w-full py-2">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        {dbName !== "ffkPro" && (
          <TabsList className="w-full justify-center mb-4">
            <TabsTrigger value="classic">Classic</TabsTrigger>
            <TabsTrigger value="h2h">H2H</TabsTrigger>
          </TabsList>
        )}

        {/* Classic Stats */}
        <TabsContent value="classic">
          <div className="bg-white p-4 my-4 rounded shadow text-sm w-full overflow-x-auto">
            {dbName !== "ffkPro" && <h3 className="sm:text-xl font-bold border-b pb-2 mb-4 text-left sm:text-center">
              Classic Stats
            </h3>}
            <div className="min-w-[800px] rounded-lg">
              <table className="w-full text-left border">
                <thead>
                  <tr className="border-b text-gray-600">
                    <th className="px-2 border"></th>
                    {dbName !== "ffkPro" && <th className="px-2 border"></th>}
                    <th className="px-2 border text-center">Pts</th>
                    <th className="px-2 border text-center">Hits</th>
                    <th className="px-2 border text-center">YC</th>
                    <th className="px-2 border text-center">A</th>
                    <th className="px-2 border text-center">G</th>
                    <th className="px-2 border w-[50px] text-center font-bold sm:text-base">
                      Home
                    </th>
                    <th className="w-[50px] px-2 border "></th>
                    <th className="px-2 border w-[50px] text-center font-bold text-sm sm:text-base">
                      Away
                    </th>
                    <th className="px-2 border text-center">G</th>
                    <th className="px-2 border text-center">A</th>
                    <th className="px-2 border text-center">YC</th>
                    <th className="px-2 border text-center">Hits</th>
                    <th className="px-2 border text-center">Pts</th>
                    {dbName !== "ffkPro" && <th className="px-2 border"></th>}
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
                      <>
                        {i === 5 && <tr className="text-center border border-gray-400 h-[30px]">
                          <td colSpan={16} className="text-center font-bold relative">
                            <div className="bg-accent absolute top-0 right-0 left-0 bottom-0 pt-1">Bench</div></td></tr>}
                      <tr key={i} className="border-t">
                        <td className="px-2 border">
                          {home && (
                            <div className="flex flex-col w-32">
                              <span className="font-medium truncate">
                                {home.manager}
                              </span>
                              {dbName === "X5Aside" || dbName === "app5Aside" || dbName === "ffkPro" ? (
                                <a
                                  href={
                                    eventId
                                      ? `https://fantasy.premierleague.com/entry/${home?.fplId}/event/${eventId}`
                                      : `https://fantasy.premierleague.com/entry/${home?.fplId}/history/`
                                  }
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline text-xs truncate"
                              >
                                {home.teamName}
                              </a>) : <span className="font-semibold">{home?.teamName}</span>}
                              {home.xHandle && (
                                <a
                                  href={`https://x.com/${home.xHandle.replace(
                                    /^@/,
                                    "",
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
                        {dbName !== "ffkPro" && <td className="px-2 border text-center">
                          {home && shortPosition[home.position]}
                        </td>}
                        <td
                          className={`relative px-2 border text-center
                            ${
                              topHome.includes(home?.fplId)
                                ? "text-green-600 font-semibold"
                                : ""
                            }
                          `}
                        >
                          {home?.position < 6 ? (home?.pointsXmul ?? "") : (home?.eventPoints ?? "")}
                          <div className="captain border border-gray-400">
              {home?.multiplier === 2 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  role="img"
                  focusable="false"
                  className="captain"
                >
                  <title>Captain</title>
                  <circle cx="12" cy="12" r="12" aria-hidden="true"></circle>
                  <path
                    d="M15.0769667,14.370341 C14.4472145,15.2780796 13.4066319,15.8124328 12.3019667,15.795341 C10.4380057,15.795341 8.92696674,14.284302 8.92696674,12.420341 C8.92696674,10.55638 10.4380057,9.045341 12.3019667,9.045341 C13.3988206,9.06061696 14.42546,9.58781014 15.0769667,10.470341 L17.2519667,8.295341 C15.3643505,6.02401882 12.1615491,5.35094208 9.51934028,6.67031017 C6.87713147,7.98967826 5.49079334,10.954309 6.17225952,13.8279136 C6.8537257,16.7015182 9.42367333,18.7279285 12.3769667,18.720341 C14.2708124,18.7262708 16.0646133,17.8707658 17.2519667,16.395341 L15.0769667,14.370341 Z"
                    fill="#fff"
                    aria-hidden="true"
                  ></path>
                </svg>
              ) : (
                ""
              )}
            </div>
                        </td>
                        <td className="px-2 border text-center">
                          {home?.eventTransfersCost ?? "-"}
                        </td>
                        <td className="px-2 border text-center">
                          {home?.yellows ? <CardIcon type="yellow" /> : ""}
                        </td>
                        <td className="px-2 border text-center">
                          {home?.assists
                            ? [...Array(home?.assists)].map((_, idx) => (
                                <div key={idx} className="inline-block mr-1">
                                  🅰️
                                </div>
                              ))
                            : ""}
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
                          <td rowSpan={dbName === "ffkPro" ? 7 : 5} className="px-2 border">
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
                          <td rowSpan={dbName === "ffkPro" ? 7 : 5} className="w-[50px]">
                            <div className="difference bg-red-700 text-3xl p-2 rounded-lg font-bold text-white">
                              {Math.abs(homeTotal - awayTotal)}
                            </div>
                          </td>
                        )}
                        {i === 0 && (
                          <td rowSpan={dbName === "ffkPro" ? 7 : 5} className="border px-2">
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
                          {away?.assists
                            ? [...Array(away?.assists)].map((_, idx) => (
                                <div key={idx} className="inline-block mr-1">
                                  🅰️
                                </div>
                              ))
                            : ""}
                        </td>
                        <td className="px-2 border text-center">
                          {away?.yellows ? <CardIcon type="yellow" /> : ""}
                        </td>
                        <td className="px-2 border text-center">
                          {away?.eventTransfersCost ?? "-"}
                        </td>
                        <td
                          className={`relative px-2 border text-center ${
                            topAway.includes(away?.fplId)
                              ? "text-green-600 font-semibold"
                              : ""
                          }`}
                        >
                          {away?.position < 6 ? (away?.pointsXmul ?? "") : (away?.eventPoints ?? "")}
                          <div className="captain border border-gray-400">
              {away?.multiplier === 2 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  role="img"
                  focusable="false"
                  className="captain"
                >
                  <title>Captain</title>
                  <circle cx="12" cy="12" r="12" aria-hidden="true"></circle>
                  <path
                    d="M15.0769667,14.370341 C14.4472145,15.2780796 13.4066319,15.8124328 12.3019667,15.795341 C10.4380057,15.795341 8.92696674,14.284302 8.92696674,12.420341 C8.92696674,10.55638 10.4380057,9.045341 12.3019667,9.045341 C13.3988206,9.06061696 14.42546,9.58781014 15.0769667,10.470341 L17.2519667,8.295341 C15.3643505,6.02401882 12.1615491,5.35094208 9.51934028,6.67031017 C6.87713147,7.98967826 5.49079334,10.954309 6.17225952,13.8279136 C6.8537257,16.7015182 9.42367333,18.7279285 12.3769667,18.720341 C14.2708124,18.7262708 16.0646133,17.8707658 17.2519667,16.395341 L15.0769667,14.370341 Z"
                    fill="#fff"
                    aria-hidden="true"
                  ></path>
                </svg>
              ) : (
                ""
              )}
            </div>
                        </td>
                        {dbName !== "ffkPro" && <td className="px-2 border text-center">
                          {away && shortPosition[away.position]}
                        </td>}
                        <td className="px-2 py-2 border">
                          {away && (
                            <div className="flex flex-col w-32">
                              <span className="font-medium truncate">
                                {away.manager}
                              </span>
                              {dbName === "X5Aside" || dbName === "app5Aside" || dbName === "ffkPro" ? <a
                                href={
                                  eventId
                                    ? `https://fantasy.premierleague.com/entry/${away?.fplId}/event/${eventId}`
                                    : `https://fantasy.premierleague.com/entry/${away?.fplId}/history/`
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline text-xs truncate"
                              >
                                {away.teamName}
                              </a> : <span className="font-semibold">{away?.teamName}</span>}
                              {away.xHandle && (
                                <a
                                  href={`https://x.com/${away.xHandle.replace(
                                    /^@/,
                                    "",
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
                      </>
                    );
                  })}
                </tbody>
              </table>
              <div className="mt-2">
                <h3 className="sm:text-xl font-bold border-b pb-2 mb-4 text-left sm:text-center">Differentials</h3>
                <div className="p-1">
                  {(!!newHomePicks.live.length || !!newAwayPicks.live.length) && <div className="p-1">
                    <h4 className="text-center font-bold p-1  text-green-600">Live</h4>
                    <div className="flex gap-2">
                      {
                      <FormattedPicksCard w="w-1/2" picks={newHomePicks.live} state='live' length={newHomePicks.live.length} />}
                    <div className="bg-blue-500 w-0.5"></div>
                      {
                      <FormattedPicksCard w="w-1/2" picks={newAwayPicks.live} state='live' length={newAwayPicks.live.length} />}
                    </div>
                  </div>}
                  {(!!newHomePicks.played.length || !!newAwayPicks.played.length) && <div className="p-1">
                    <h4 className="text-center font-bold p-1">Played</h4>
                    <div className="flex gap-2">
                      {
                      <FormattedPicksCard w="w-1/2" picks={newHomePicks.played} state='played' length={newHomePicks.played.length} />}
                    <div className="bg-blue-500 w-0.5"></div>
                      {
                      <FormattedPicksCard w="w-1/2" picks={newAwayPicks.played} state='played' length={newAwayPicks.played.length} />}
                    </div>
                  </div>}
                  {(!!newHomePicks.yet.length || !!newAwayPicks.yet.length) && <div className="p-1">
                    <h4 className="text-center font-bold p-1">Yet to play</h4>
                    <div className="flex gap-2">
                      {
                      <FormattedPicksCard w="w-1/2" picks={newHomePicks.yet} state='yet' length={newHomePicks.yet.length} />}
                    <div className="bg-blue-500 w-0.5"></div>
                      { 
                      <FormattedPicksCard w="w-1/2" picks={newAwayPicks.yet} state='yet' length={newAwayPicks.yet.length} />}
                    </div>
                  </div>}
                  {(!!newHomePicks.dnp.length || !!newAwayPicks.dnp.length) && <div className="p-1">
                    <h4 className="text-center font-bold">Did not play</h4>
                    <div className="flex gap-2">
                      {
                      <FormattedPicksCard w="w-1/2" picks={newHomePicks.dnp} state='dnp' length={newHomePicks.dnp.length} />}
                    <div className="bg-blue-500 w-0.5"></div>
                      {
                      <FormattedPicksCard w="w-1/2" picks={newAwayPicks.dnp} state='dnp' length={newAwayPicks.dnp.length} />}
                    </div>
                  </div>}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* H2H Stats */}
        {dbName !== "ffkPro" && (
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
                            <div className="flex flex-col w-32">
                              <span className="font-medium truncate">
                                {home.manager}
                              </span>
                             {dbName === "X5Aside" || dbName === "app5Aside" || dbName === "ffkPro" ?  <a
                                href={
                                  eventId
                                    ? `https://fantasy.premierleague.com/entry/${home?.fplId}/event/${eventId}`
                                    : `https://fantasy.premierleague.com/entry/${home?.fplId}/history/`
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline text-xs truncate"
                              >
                                {home.teamName}
                              </a> : <span className="font-semibold">{home?.teamName}</span>}
                              {home.xHandle && (
                                <a
                                  href={`https://x.com/${home.xHandle.replace(
                                    /^@/,
                                    "",
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
                        <td className="px-2 border text-center text-red-600">
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
                          <div
                            className={`${
                              home.result === "W"
                                ? "bg-green-700"
                                : home.result === "L"
                                  ? "bg-red-700"
                                  : "bg-gray-700"
                            } border text-center font-bold sm:text-base w-[80%] rounded-lg m-auto py-2  text-white`}
                          >
                            {home.result}
                          </div>
                        </td>
                        <td>
                          <div
                            className={`${
                              away.result === "W"
                                ? "bg-green-700"
                                : away.result === "L"
                                  ? "bg-red-700"
                                  : "bg-gray-700"
                            } border text-center font-bold sm:text-base w-[80%] rounded-lg m-auto py-2 text-white`}
                          >
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
                        <td className="px-2 border text-center text-red-600">
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
                            <div className="flex flex-col w-32">
                              <span className="font-medium truncate">
                                {away.manager}
                              </span>
                              {dbName === "X5Aside" || dbName === "app5Aside" || dbName === "ffkPro" ? <a
                                href={
                                  eventId
                                    ? `https://fantasy.premierleague.com/entry/${away?.fplId}/event/${eventId}`
                                    : `https://fantasy.premierleague.com/entry/${away?.fplId}/history/`
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline text-xs truncate"
                              >
                                {away.teamName}
                              </a> : <span className="font-semibold">{away?.teamName}</span>}
                              {away.xHandle && (
                                <a
                                  href={`https://x.com/${away.xHandle.replace(
                                    /^@/,
                                    "",
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
                <h3 className="sm:text-xl font-bold border-b pb-2 mb-4 text-left sm:text-center">Differentials</h3>
                <div className="p-1">
                  <div className="flex sm:justify-center items-center">
                    <h3 className="shadow-xl rounded-lg sm:text-xl font-bold border-t-2 border-blue-500 p-2 mb-4 w-36 text-center">Captain</h3>
                    </div>
                  {(!!newHomeCap.live.length || !!newAwayCap.live.length) && <div className="p-1">
                    <h4 className="text-center font-bold p-1  text-green-600">Live</h4>
                    <div className="flex gap-2">
                      {
                      <FormattedPicksCard w="w-1/2" picks={newHomeCap.live} state='live' length={newHomeCap.live.length} />}
                    <div className="bg-blue-500 w-0.5"></div>
                      {
                      <FormattedPicksCard w="w-1/2" picks={newAwayCap.live} state='live' length={newAwayCap.live.length} />}
                    </div>
                  </div>}
                  {(!!newHomeCap.played.length || !!newAwayCap.played.length) && <div className="p-1">
                    <h4 className="text-center font-bold p-1">Played</h4>
                    <div className="flex gap-2">
                      {
                      <FormattedPicksCard w="w-1/2" picks={newHomeCap.played} state='played' length={newHomeCap.played.length} />}
                    <div className="bg-blue-500 w-0.5"></div>
                      {
                      <FormattedPicksCard w="w-1/2" picks={newAwayCap.played} state='played' length={newAwayCap.played.length} />}
                    </div>
                  </div>}
                  {(!!newHomeCap.yet.length || !!newAwayCap.yet.length) && <div className="p-1">
                    <h4 className="text-center font-bold p-1">Yet to play</h4>
                    <div className="flex gap-2">
                      {
                      <FormattedPicksCard w="w-1/2" picks={newHomeCap.yet} state='yet' length={newHomeCap.yet.length} />}
                    <div className="bg-blue-500 w-0.5"></div>
                      { 
                      <FormattedPicksCard w="w-1/2" picks={newAwayCap.yet} state='yet' length={newAwayCap.yet.length} />}
                    </div>
                  </div>}
                  {(!!newHomeCap.dnp.length || !!newAwayCap.dnp.length) && <div className="p-1">
                    <h4 className="text-center font-bold">Did not play</h4>
                    <div className="flex gap-2">
                      {
                      <FormattedPicksCard w="w-1/2" picks={newHomeCap.dnp} state='dnp' length={newHomeCap.dnp.length} />}
                    <div className="bg-blue-500 w-0.5"></div>
                      {
                      <FormattedPicksCard w="w-1/2" picks={newAwayCap.dnp} state='dnp' length={newAwayCap.dnp.length} />}
                    </div>
                  </div>}
                </div>
                <div className="p-1">
                  <div className="flex sm:justify-center items-center">
                    <h3 className="shadow-xl rounded-lg sm:text-xl font-bold border-t-2 border-blue-500 p-2 mb-4 w-36 text-center">Ace</h3>
                    </div>
                  {(!!newHomeAce.live.length || !!newAwayAce.live.length) && <div className="p-1">
                    <h4 className="text-center font-bold p-1  text-green-600">Live</h4>
                    <div className="flex gap-2">
                      {
                      <FormattedPicksCard w="w-1/2" picks={newHomeAce.live} state='live' length={newHomeAce.live.length} />}
                    <div className="bg-blue-500 w-0.5"></div>
                      {
                      <FormattedPicksCard w="w-1/2" picks={newAwayAce.live} state='live' length={newAwayAce.live.length} />}
                    </div>
                  </div>}
                  {(!!newHomeAce.played.length || !!newAwayAce.played.length) && <div className="p-1">
                    <h4 className="text-center font-bold p-1">Played</h4>
                    <div className="flex gap-2">
                      {
                      <FormattedPicksCard w="w-1/2" picks={newHomeAce.played} state='played' length={newHomeAce.played.length} />}
                    <div className="bg-blue-500 w-0.5"></div>
                      {
                      <FormattedPicksCard w="w-1/2" picks={newAwayAce.played} state='played' length={newAwayAce.played.length} />}
                    </div>
                  </div>}
                  {(!!newHomeAce.yet.length || !!newAwayAce.yet.length) && <div className="p-1">
                    <h4 className="text-center font-bold p-1">Yet to play</h4>
                    <div className="flex gap-2">
                      {
                      <FormattedPicksCard w="w-1/2" picks={newHomeAce.yet} state='yet' length={newHomeAce.yet.length} />}
                    <div className="bg-blue-500 w-0.5"></div>
                      { 
                      <FormattedPicksCard w="w-1/2" picks={newAwayAce.yet} state='yet' length={newAwayAce.yet.length} />}
                    </div>
                  </div>}
                  {(!!newHomeAce.dnp.length || !!newAwayAce.dnp.length) && <div className="p-1">
                    <h4 className="text-center font-bold">Did not play</h4>
                    <div className="flex gap-2">
                      {
                      <FormattedPicksCard w="w-1/2" picks={newHomeAce.dnp} state='dnp' length={newHomeAce.dnp.length} />}
                    <div className="bg-blue-500 w-0.5"></div>
                      {
                      <FormattedPicksCard w="w-1/2" picks={newAwayAce.dnp} state='dnp' length={newAwayAce.dnp.length} />}
                    </div>
                  </div>}
                </div>
                <div className="p-1">
                  <div className="flex sm:justify-center items-center">
                    <h3 className="shadow-xl rounded-lg sm:text-xl font-bold border-t-2 border-blue-500 p-2 mb-4 w-36 text-center">Forward</h3>
                    </div>
                  {(!!newHomeFwd.live.length || !!newAwayFwd.live.length) && <div className="p-1">
                    <h4 className="text-center font-bold p-1  text-green-600">Live</h4>
                    <div className="flex gap-2">
                      {
                      <FormattedPicksCard w="w-1/2" picks={newHomeFwd.live} state='live' length={newHomeFwd.live.length} />}
                    <div className="bg-blue-500 w-0.5"></div>
                      {
                      <FormattedPicksCard w="w-1/2" picks={newAwayFwd.live} state='live' length={newAwayFwd.live.length} />}
                    </div>
                  </div>}
                  {(!!newHomeFwd.played.length || !!newAwayFwd.played.length) && <div className="p-1">
                    <h4 className="text-center font-bold p-1">Played</h4>
                    <div className="flex gap-2">
                      {
                      <FormattedPicksCard w="w-1/2" picks={newHomeFwd.played} state='played' length={newHomeFwd.played.length} />}
                    <div className="bg-blue-500 w-0.5"></div>
                      {
                      <FormattedPicksCard w="w-1/2" picks={newAwayFwd.played} state='played' length={newAwayFwd.played.length} />}
                    </div>
                  </div>}
                  {(!!newHomeFwd.yet.length || !!newAwayFwd.yet.length) && <div className="p-1">
                    <h4 className="text-center font-bold p-1">Yet to play</h4>
                    <div className="flex gap-2">
                      {
                      <FormattedPicksCard w="w-1/2" picks={newHomeFwd.yet} state='yet' length={newHomeFwd.yet.length} />}
                    <div className="bg-blue-500 w-0.5"></div>
                      { 
                      <FormattedPicksCard w="w-1/2" picks={newAwayFwd.yet} state='yet' length={newAwayFwd.yet.length} />}
                    </div>
                  </div>}
                  {(!!newHomeFwd.dnp.length || !!newAwayFwd.dnp.length) && <div className="p-1">
                    <h4 className="text-center font-bold">Did not play</h4>
                    <div className="flex gap-2">
                      {
                      <FormattedPicksCard w="w-1/2" picks={newHomeFwd.dnp} state='dnp' length={newHomeFwd.dnp.length} />}
                    <div className="bg-blue-500 w-0.5"></div>
                      {
                      <FormattedPicksCard w="w-1/2" picks={newAwayFwd.dnp} state='dnp' length={newAwayFwd.dnp.length} />}
                    </div>
                  </div>}
                </div>
                <div className="p-1">
                  <div className="flex sm:justify-center items-center">
                    <h3 className="shadow-xl rounded-lg sm:text-xl font-bold border-t-2 border-blue-500 p-2 mb-4 w-36 text-center">Midfielder</h3>
                    </div>
                  {(!!newHomeMid.live.length || !!newAwayMid.live.length) && <div className="p-1">
                    <h4 className="text-center font-bold p-1  text-green-600">Live</h4>
                    <div className="flex gap-2">
                      {
                      <FormattedPicksCard w="w-1/2" picks={newHomeMid.live} state='live' length={newHomeMid.live.length} />}
                    <div className="bg-blue-500 w-0.5"></div>
                      {
                      <FormattedPicksCard w="w-1/2" picks={newAwayMid.live} state='live' length={newAwayMid.live.length} />}
                    </div>
                  </div>}
                  {(!!newHomeMid.played.length || !!newAwayMid.played.length) && <div className="p-1">
                    <h4 className="text-center font-bold p-1">Played</h4>
                    <div className="flex gap-2">
                      {
                      <FormattedPicksCard w="w-1/2" picks={newHomeMid.played} state='played' length={newHomeMid.played.length} />}
                    <div className="bg-blue-500 w-0.5"></div>
                      {
                      <FormattedPicksCard w="w-1/2" picks={newAwayMid.played} state='played' length={newAwayMid.played.length} />}
                    </div>
                  </div>}
                  {(!!newHomeMid.yet.length || !!newAwayMid.yet.length) && <div className="p-1">
                    <h4 className="text-center font-bold p-1">Yet to play</h4>
                    <div className="flex gap-2">
                      {
                      <FormattedPicksCard w="w-1/2" picks={newHomeMid.yet} state='yet' length={newHomeMid.yet.length} />}
                    <div className="bg-blue-500 w-0.5"></div>
                      { 
                      <FormattedPicksCard w="w-1/2" picks={newAwayMid.yet} state='yet' length={newAwayMid.yet.length} />}
                    </div>
                  </div>}
                  {(!!newHomeMid.dnp.length || !!newAwayMid.dnp.length) && <div className="p-1">
                    <h4 className="text-center font-bold">Did not play</h4>
                    <div className="flex gap-2">
                      {
                      <FormattedPicksCard w="w-1/2" picks={newHomeMid.dnp} state='dnp' length={newHomeMid.dnp.length} />}
                    <div className="bg-blue-500 w-0.5"></div>
                      {
                      <FormattedPicksCard w="w-1/2" picks={newAwayMid.dnp} state='dnp' length={newAwayMid.dnp.length} />}
                    </div>
                  </div>}
                </div>
                <div className="p-1">
                  <div className="flex sm:justify-center items-center">
                    <h3 className="shadow-xl rounded-lg sm:text-xl font-bold border-t-2 border-blue-500 p-2 mb-4 w-36 text-center">Defender</h3>
                    </div>
                  {(!!newHomeDef.live.length || !!newAwayDef.live.length) && <div className="p-1">
                    <h4 className="text-center font-bold p-1  text-green-600">Live</h4>
                    <div className="flex gap-2">
                      {
                      <FormattedPicksCard w="w-1/2" picks={newHomeDef.live} state='live' length={newHomeDef.live.length} />}
                    <div className="bg-blue-500 w-0.5"></div>
                      {
                      <FormattedPicksCard w="w-1/2" picks={newAwayDef.live} state='live' length={newAwayDef.live.length} />}
                    </div>
                  </div>}
                  {(!!newHomeDef.played.length || !!newAwayDef.played.length) && <div className="p-1">
                    <h4 className="text-center font-bold p-1">Played</h4>
                    <div className="flex gap-2">
                      {
                      <FormattedPicksCard w="w-1/2" picks={newHomeDef.played} state='played' length={newHomeDef.played.length} />}
                    <div className="bg-blue-500 w-0.5"></div>
                      {
                      <FormattedPicksCard w="w-1/2" picks={newAwayDef.played} state='played' length={newAwayDef.played.length} />}
                    </div>
                  </div>}
                  {(!!newHomeDef.yet.length || !!newAwayDef.yet.length) && <div className="p-1">
                    <h4 className="text-center font-bold p-1">Yet to play</h4>
                    <div className="flex gap-2">
                      {
                      <FormattedPicksCard w="w-1/2" picks={newHomeDef.yet} state='yet' length={newHomeDef.yet.length} />}
                    <div className="bg-blue-500 w-0.5"></div>
                      { 
                      <FormattedPicksCard w="w-1/2" picks={newAwayDef.yet} state='yet' length={newAwayDef.yet.length} />}
                    </div>
                  </div>}
                  {(!!newHomeDef.dnp.length || !!newAwayDef.dnp.length) && <div className="p-1">
                    <h4 className="text-center font-bold">Did not play</h4>
                    <div className="flex gap-2">
                      {
                      <FormattedPicksCard w="w-1/2" picks={newHomeDef.dnp} state='dnp' length={newHomeDef.dnp.length} />}
                    <div className="bg-blue-500 w-0.5"></div>
                      {
                      <FormattedPicksCard w="w-1/2" picks={newAwayDef.dnp} state='dnp' length={newAwayDef.dnp.length} />}
                    </div>
                  </div>}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>)}
      </Tabs>
    </div>
  );
}
