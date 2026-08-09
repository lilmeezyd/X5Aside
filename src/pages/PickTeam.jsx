import { useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import { useGetPicksQuery, useEditPicksMutation } from "../slices/teamApiSlice";
import { Button } from "../../@/components/ui/button";
import PickPlayer from "./PickPlayer";
import PlayersPerTeam from "./PlayersPerTeam";
import { toast } from "sonner";

const PickTeam = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: communityPicks, isLoading } = useGetPicksQuery("ffkPro");
  const [editPicksMutation] = useEditPicksMutation();

  const reducer = (state, action) => {
    const ids = state?.picks?.map((x) => x.position);
    if (action.type === "INITIAL_PICKS") {
      return action.payload;
    }
    if(action.type === "DEFAULT_PICKS") {
      return {
        ...state,
        picks: action.payload,
        save: false,
      };
    }

    if (action.type === "SWITCH_CAP") {
      const { data } = action;
      const exCap = state.picks.find((x) => x.multiplier > 1);
      const player = {
        ...data,
        multiplier: exCap.multiplier,
        isCaptain: exCap.isCaptain,
        isViceCaptain: exCap.isViceCaptain,
      };
      const exCapObj = {
        ...exCap,
        multiplier: data.multiplier,
        isCaptain: data.isCaptain,
        isViceCaptain: data.isViceCaptain,
      };
      return {
        ...state,
        captain: data?.player?._id,
        save: true,
        picks: state.picks.map((x) =>
          x.player._id === data.player._id
            ? (x = player)
            : x.player._id === exCap.player._id
              ? (x = exCapObj)
              : x,
        ),
      };
    }
    if (action.type === "SWITCH_VICE") {
      const { data } = action;
      const exCap = state.picks.find((x) => x.isViceCaptain === true);
      const player = {
        ...data,
        multiplier: exCap.multiplier,
        isCaptain: exCap.isCaptain,
        isViceCaptain: exCap.isViceCaptain,
      };
      const exCapObj = {
        ...exCap,
        multiplier: data.multiplier,
        isCaptain: data.isCaptain,
        isViceCaptain: data.isViceCaptain,
      };
      return {
        ...state,
        viceCaptain: data?._id,
        save: true,
        picks: state.picks.map((x) =>
          x.player._id === data.player._id
            ? (x = player)
            : x.player._id === exCap.player._id
              ? (x = exCapObj)
              : x,
        ),
      };
    }
    if (action.type === "SET_SWITCH") {
      const { data } = action;
      if (data.multiplier === 0) {
        const okayed = state.picks
          .filter((x) => x.player._id !== data.player._id && x.multiplier > 0)
          .map((x) => x.position);
        const blocked = state.picks
          .filter((x) => x.player._id !== data.player._id && x.multiplier === 0)
          .map((x) => x.position);
        return {
          ...state,
          switcher: data,
          okayed: okayed,
          blocked: blocked,
        };
      } else {
        const okayed = state.picks
          .filter((x) => x.player._id !== data.player._id && x.multiplier === 0)
          .map((x) => x.position);
        const blocked = state.picks
          .filter((x) => x.player._id !== data.player._id && x.multiplier > 0)
          .map((x) => x.position);
        return {
          ...state,
          switcher: data,
          okayed: okayed,
          blocked: blocked,
        };
      }
    }
    if (action.type === "SWAP_PLAYER") {
      const { data } = action;
      const { multiplier, isCaptain, isViceCaptain, position } = state.switcher;
      const player = {
        ...data,
        multiplier,
        isCaptain,
        isViceCaptain,
        position,
      };
      const newSwitcher = {
        ...state.switcher,
        multiplier: data.multiplier,
        isCaptain: data.isCaptain,
        isViceCaptain: data.isViceCaptain,
        position: data.position,
      };

      return {
        ...state,
        save: true,
        switcher: {},
        okayed: [],
        blocked: [],
        picks: state.picks.map((x) =>
          x.player._id === data.player._id
            ? (x = player)
            : x.player._id === state.switcher.player._id
              ? (x = newSwitcher)
              : x,
        ),
      };
    }
    if (action.type === "CANCEL") {
      return {
        ...state,
        switcher: {},
        okayed: [],
        blocked: [],
      };
    }

    if (action.type === "BACK_TO_FALSE") {
      return {
        ...state,
        save: false,
      };
    }
  };

  const [state, dispatch] = useReducer(reducer, {
    save: false,
    captain: "",
    oldCaptain: "",
    oldViceCaptain: "",
    viceCaptain: "",
    picks: [],
    defaultPicks: [],
    switcher: {},
    blocked: [],
    okayed: [],
  });
  const {
    picks,
    defaultPicks,
    switcher,
    blocked,
    okayed,
    captain,
    viceCaptain,
    oldCaptain,
    oldViceCaptain,
    save,
  } = state;

  useEffect(() => {
    if (communityPicks) {
      const pickCaptain = communityPicks?.picks?.find((pick) => pick?.isCaptain)
        ?.player?._id;
      const pickVice = communityPicks?.picks?.find(
        (pick) => pick?.isViceCaptain,
      )?.player?._id;
      dispatch({
        type: "INITIAL_PICKS",
        payload: {
          ...state,
          oldCaptain: pickCaptain,
          oldViceCaptain: pickVice,
          captain: pickCaptain,
          viceCaptain: pickVice,
          picks: communityPicks?.picks,
          defaultPicks: communityPicks?.picks,
        },
      });
    }
  }, [communityPicks]);

  const switchPlayer = (data) => {
    if (Object.keys(switcher)?.length === 0) {
      dispatch({ type: `SET_SWITCH`, data });
    }
    if (data.player._id === switcher?.player?._id) {
      dispatch({ type: `CANCEL` });
    }
    if (
      Object.keys(switcher)?.length > 0 &&
      data.player._id !== switcher?.player?._id
    ) {
      dispatch({ type: `SWAP_PLAYER`, data });
    }
  };
  const switchCaptain = (data) => {
    dispatch({ type: `SWITCH_CAP`, data });
  };
  const switchVice = (data) => {
    dispatch({ type: `SWITCH_VICE`, data });
  };

  const setSaveToFalse = () => {
    dispatch({ type: `BACK_TO_FALSE` });
  };
  const inform = (data) => {
    console.log("view info");
  };


  const onSave = async (e) => {
    e.preventDefault();
    const newPicks = picks.map((x) => {
      return {
        player: x.player._id,
        position: x.position,
        multiplier: x.multiplier,
        isCaptain: x.isCaptain,
        isViceCaptain: x.isViceCaptain,
      };
    });
    try {
      const res = await editPicksMutation({
        dbName: "ffkPro",
        eventId: communityPicks?.eventId,
        picks: newPicks
      }).unwrap();
      toast.success(res.message);
    } catch (error) {
      dispatch({ type: "DEFAULT_PICKS", payload: defaultPicks });
      toast.error(error.data.message)
    }
    setSaveToFalse();
  };

  if (isLoading && communityPicks === undefined) {
    return <div>Loading...</div>;
  }

  if(!isLoading && communityPicks && picks === undefined) {
    return <div>Picks are Updating...</div>
  }

  return (
    <div className="m-2 rounded-lg flex flex-col md:flex-row md:justify-between">
      <div className="rounded-lg border border-gray-400 m-2 md:w-[60%]">
        <div></div>
        <div className="picks">
          <div className="border-b border-gray-400 flex justify-center w-[50%] m-auto py-2">
              <h4 className="font-semibold">Gameweek {communityPicks?.eventId}</h4>
            </div>
          <div className="starters m-2">
            <div className="flex justify-around rounded-sm p-2 my-1">
              {picks
                .filter((pick) => pick.position === 5)
                .map((manager) => (
                  <div key={manager._id}>
                    <PickPlayer
                    communityPicks={communityPicks}
                      blocked={blocked}
                      okayed={okayed}
                      switcher={switcher}
                      position={manager.position}
                      multiplier={manager.multiplier}
                      switchCaptain={switchCaptain}
                      switchVice={switchVice}
                      switchPlayer={switchPlayer}
                      isCaptain={manager.isCaptain}
                      isViceCaptain={manager.isViceCaptain}
                      player={manager.player}
                    />
                  </div>
                ))}
            </div>
            <div className="flex justify-around rounded-sm p-2 my-1">
              {picks
                .filter((pick) => pick.position > 1 && pick.position < 5)
                .map((manager) => (
                  <div key={manager._id}>
                    <PickPlayer
                    communityPicks={communityPicks}
                      blocked={blocked}
                      okayed={okayed}
                      switcher={switcher}
                      position={manager.position}
                      multiplier={manager.multiplier}
                      switchCaptain={switchCaptain}
                      switchVice={switchVice}
                      switchPlayer={switchPlayer}
                      isCaptain={manager.isCaptain}
                      isViceCaptain={manager.isViceCaptain}
                      player={manager.player}
                    />
                  </div>
                ))}
            </div>
            <div className="flex justify-around p-2 my-1">
              {picks
                .filter((pick) => pick.position === 1)
                .map((manager) => (
                  <div key={manager._id}>
                    <PickPlayer
                    communityPicks={communityPicks}
                      blocked={blocked}
                      okayed={okayed}
                      switcher={switcher}
                      position={manager.position}
                      multiplier={manager.multiplier}
                      switchCaptain={switchCaptain}
                      switchVice={switchVice}
                      switchPlayer={switchPlayer}
                      isCaptain={manager.isCaptain}
                      isViceCaptain={manager.isViceCaptain}
                      player={manager.player}
                    />
                  </div>
                ))}
            </div>
          </div>
          <div className="bench m-2">
            <div className="border-b border-gray-400 flex justify-center w-[50%] m-auto py-2">
              <h4 className="font-semibold">Bench</h4>
            </div>
            <div className="flex justify-around rounded-sm p-2">
              {picks
                .filter((pick) => pick.position === 6)
                .map((manager) => (
                  <div key={manager._id}>
                    <PickPlayer
                    communityPicks={communityPicks}
                      blocked={blocked}
                      okayed={okayed}
                      switcher={switcher}
                      position={manager.position}
                      multiplier={manager.multiplier}
                      switchCaptain={switchCaptain}
                      switchVice={switchVice}
                      switchPlayer={switchPlayer}
                      isCaptain={manager.isCaptain}
                      isViceCaptain={manager.isViceCaptain}
                      player={manager.player}
                    />
                  </div>
                ))}
            </div>
          </div>
          <section className="form">
            <form onSubmit={onSave}>
              <div className="save-picks form-group py-3 flex justify-center">
                <Button
                  type="submit"
                  disabled={save === false}
                  className="primary btn btn-success"
                >
                  Save
                </Button>
              </div>
            </form>
          </section>
        </div>
      </div>
      <div className="m-2 md:w-[37%]">
        <div className="flex justify-center items-center space-x-2 p-2">
                <div className="border border-blue-500 shadow box-shadow p-1 rounded">
                  <img src={communityPicks?.url} 
                  className="w-6 md:w-12 h-6 md:h-12 object-contain" alt={communityPicks?.teamName} />
                </div>
                <div className="font-semibold md:text-2xl p-1 truncate">{communityPicks?.teamName}</div>
        </div>
        <PlayersPerTeam teamId={communityPicks?.teamId} />
      </div>
    </div>
  );
};

export default PickTeam;
