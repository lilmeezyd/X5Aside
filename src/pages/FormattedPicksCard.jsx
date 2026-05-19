import React from "react";

const FormattedPicksCard = ({ picks, length, state, w }) => {
  return (
    <div className={w}>
      {!!picks.length && <>
      <div className="py-1 border-b border-blue-500 flex justify-center items-center">
        {(state === 'played' || state === 'live') && <h5 className="font-bold px-2">
          {picks.every((x) => !isNaN(x.points))
            ? `${picks.reduce((x, y) => x + y.points * y.multiplier, 0)} Points`
            : ""}
        </h5>}
      </div>
      <div
        className="
                      bg-white my-2 p-2 flex flex-wrap"
      >
        {[...picks].sort((a,b) => (b.points*b.multiplier - a.points*a.multiplier)).map((pick, index) => <div
          key={pick.element}
          className={`${state === "live" ? "text-green-600" : "text-black"} text-xs md:text-sm mr-2 mb-1 font-semibold`}
        >
          {pick.multiplier > 1 && `${pick.multiplier}x`}
          {pick.webName}{" "}
          {state === "live" || state === "played"
            ? !isNaN(pick.points)
              ? `${" "}${"->"}${" "}${pick.points * pick.multiplier}`
              : ""
            : ""}
          {index < length - 1 && ","}
        </div>)}
      </div>
      </>}
    </div>
  );
};

export default FormattedPicksCard;
