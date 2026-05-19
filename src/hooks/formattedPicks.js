import { useMemo } from "react";

export function formattedPicks(picks) {
    return useMemo(() => {
        return picks.map((x) => {
          return {
            webName: x.webName,
            multiplier: x.multiplier,
            element: x.element,
            points: x?.fixtures?.total_points,
            live: x?.fixtures?.fixture.some((y) => y.started && !y.finished),
            played: x?.fixtures?.fixture.every((y) => y.started && y.finished),
            dnp: x?.fixtures?.fixture.every(
              (y) => y.started && y.finished && y.minutes === 0,
            ),
            yet: (!!x?.fixtures?.fixture?.length) && x?.fixtures?.fixture.every((y) => !y.started),
          };
        }).reduce(
          (acc, curr) => {
            let status = "played";
    
            if (curr.live) status = "live";
            else if (curr.yet) status = "yet";
            else if (curr.dnp) status = "dnp";
    
            acc[status].push(curr);
    
            return acc;
          },
          {
            live: [],
            yet: [],
            dnp: [],
            played: [],
          });
      }, [picks]);
}