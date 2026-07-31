import { useState } from 'react'
import { Button } from "../../@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../@/components/ui/dialog";
import { Modal } from "react-bootstrap";

const PickPlayer = (props) => {
    const { player, switchPlayer, switchCaptain, switchVice, position, multiplier,
    blocked, okayed, switcher, isCaptain, isViceCaptain, communityPicks
   } = props;
   const [show, setShow] = useState(false);
   const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };
  const switchOut = () => {
    switchPlayer({ player, multiplier, position, isCaptain, isViceCaptain});
    handleClose();
  };
  const changeCaptain = () => {
    switchCaptain({ player, multiplier, position, isCaptain, isViceCaptain});
    handleClose();
  };
  const changeVice = () => {
    switchVice({  player, multiplier, position, isCaptain, isViceCaptain});
    handleClose();
  };
  const getInfo = () => {
    setShowPInfo(true)
    handleClose();
  };

  const handleCloseInfo = () => {
    setShowPInfo(false)
  }
  return (
    <>
      <div className="">
        {player?._id ? (
            <div className="relative border border-gray-400 rounded-sm shadow" id={player._id}>
                <button
                 style={{borderRadius: '0.5rem', border: `${switcher.position === position ? '1px solid darkred' : ''}`,
          opacity: `${blocked?.includes(position) ? '0.5' : '1'}`}}
          className={`${okayed?.includes(position) ? 'h-light' : ''} player-btn`} onClick={handleShow}>
            <div className='w-[100px] h-[150px] flex flex-col justify-end'>
                <div className='player-image-container'>
                    <div className='player-avatar'>
                      <img src={communityPicks?.url} 
                  className="w-12 md:w-24 h-12 md:h-24 object-contain" alt={communityPicks?.teamName} />
                    </div>
                </div>
                <div
                className={`${okayed?.includes(position) ? 'back-light' : ''}`}
                 style={{color: `${switcher.position === position ? 'white' : ''}`, background: `${switcher.position === position ? 'darkred' : ''}`}}>
                <div className='truncate px-2 font-bold text-xs'>{player.manager}</div>
                <div className='truncate px-2 font-bold text-xs'>{player.teamName}</div>
                </div>
            </div>
            <div className="captain">
              {isCaptain ? (
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
              ) : isViceCaptain ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  role="img"
                  focusable="false"
                  className="vice-captain"
                >
                  <title>Captain</title>
                  <circle cx="12" cy="12" r="12" aria-hidden="true"></circle>
                  <polygon
                    points="13.5 .375 8.925 12.375 4.65 12.375 0 .375 3.15 .375 6.75 10.05 10.35 .375"
                    transform="translate(5.25 6)"
                    fill="#fff"
                    aria-hidden="true"
                  ></polygon>
                </svg>
              ) : isCaptain ? (
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
                  <circle
                    cx="12"
                    cy="12"
                    r="12"
                    aria-hidden="true"
                    fill="white"
                  ></circle>
                  <path
                    d="M15.0769667,14.370341 C14.4472145,15.2780796 13.4066319,15.8124328 12.3019667,15.795341 C10.4380057,15.795341 8.92696674,14.284302 8.92696674,12.420341 C8.92696674,10.55638 10.4380057,9.045341 12.3019667,9.045341 C13.3988206,9.06061696 14.42546,9.58781014 15.0769667,10.470341 L17.2519667,8.295341 C15.3643505,6.02401882 12.1615491,5.35094208 9.51934028,6.67031017 C6.87713147,7.98967826 5.49079334,10.954309 6.17225952,13.8279136 C6.8537257,16.7015182 9.42367333,18.7279285 12.3769667,18.720341 C14.2708124,18.7262708 16.0646133,17.8707658 17.2519667,16.395341 L15.0769667,14.370341 Z"
                    fill="#000"
                    aria-hidden="true"
                  ></path>
                </svg>
              ) : isViceCaptain ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  role="img"
                  focusable="false"
                  className="vice-captain"
                >
                  <title>Captain</title>
                  <circle
                    cx="12"
                    cy="12"
                    r="12"
                    aria-hidden="true"
                    fill="white"
                  ></circle>
                  <polygon
                    points="13.5 .375 8.925 12.375 4.65 12.375 0 .375 3.15 .375 6.75 10.05 10.35 .375"
                    transform="translate(5.25 6)"
                    fill="#000"
                    aria-hidden="true"
                  ></polygon>
                </svg>
              ) : (
                ""
              )}
            </div></button> </div>
        ) : (
            <div className="button-wrapper" id={player._id}>
          <button className="player-btn empty-btn">
            <div className="p-holder">{}</div>
          </button>
          </div>
        )}
      </div>

      {player?._id && (
        <div className="flex flex-wrap gap-2">
            <Dialog open={show} onOpenChange={setShow}>
              {/*<DialogTrigger asChild>
                <Button size="sm" onClick={() => setShow(true)}>
                  Add Player
                </Button>
              </DialogTrigger>*/}

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{player.manager}</DialogTitle>
                </DialogHeader>


                
          {(switcher?.player?._id === player._id || Object.keys(switcher).length === 0 || 
          okayed?.includes(position)) && 
          <Button onClick={switchOut} className="btn btn-dark">
            {(switcher?.player?._id.toString() === player._id.toString()) ? 'Cancel' : 'Switch Player'}
          </Button>}
          {(multiplier > 0 && isCaptain === false && Object.keys(switcher).length === 0) && <Button onClick={changeCaptain} className="btn btn-dark">
            Captain
          </Button>}
          {(multiplier > 0 && isViceCaptain === false && Object.keys(switcher).length === 0) && <Button onClick={changeVice} className="btn btn-dark">
            Vice Captain
          </Button>}
          {/*<button onClick={getInfo} className="btn btn-info form-control my-2">
            Information
          </button>*/}
        
              </DialogContent>
            </Dialog>
          </div>
      )}
    </>
  )
}

const SwitchPopUp = (props) => {
  const {
    player,
    show,
    handleClose,
    switchPlayer,
    switchCaptain,
    switchVice,
    multiplier, isCaptain, isViceCaptain,
    blocked,okayed, switcher
  } = props;

  //const playerDetails = players?.find((player) => player._id === player?._id);
  //const [ showPInfo, setShowPInfo ] = useState(false)
  //const { data: player} = useGetPlayerQuery(player?._id)
  const switchOut = () => {
    switchPlayer({ ...player, shortPos});
    handleClose();
  };
  const changeCaptain = () => {
    switchCaptain({ ...player});
    handleClose();
  };
  const changeVice = () => {
    switchVice({ ...player});
    handleClose();
  };
  const getInfo = () => {
    setShowPInfo(true)
    handleClose();
  };

  const handleCloseInfo = () => {
    setShowPInfo(false)
  }

  return (
    <>
    <Modal show={show} onHide={handleClose}>
      <Modal.Header style={{ background: "aquamarine" }} closeButton>
        <Modal.Title style={{ fontWeight: 500 }}>
          <div className="namesection">
            <span>
              {player?.manager}
            </span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-3">
        <div className="infobuttons">
          {(switcher._id === player._id || Object.keys(switcher).length === 0 || 
          okayed?.includes(position)) && 
          <button onClick={switchOut} className="btn btn-warning form-control my-2">
            {switcher._id === player._id ? 'Cancel' : 'Switch Player'}
          </button>}
          {(multiplier > 0 && isCaptain === false && Object.keys(switcher).length === 0) && <button onClick={changeCaptain} className="btn btn-success form-control my-2">
            Captain
          </button>}
          {(multiplier > 0 && isViceCaptain === false && Object.keys(switcher).length === 0) && <button onClick={changeVice} className="btn btn-primary form-control my-2">
            Vice Captain
          </button>}
          {/*<button onClick={getInfo} className="btn btn-info form-control my-2">
            Information
          </button>*/}
        </div>
      </Modal.Body>
    </Modal>
    {/*<PlayerInfo
    player={player}
    handleCloseInfo={handleCloseInfo}
    showPInfo={showPInfo}
    ></PlayerInfo>*/}
    </>
  );
};

export default PickPlayer
