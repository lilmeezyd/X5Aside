import React from "react";
import Footer from "./Footer";

function Unknown() {
  return (
    <div className="h-screen">
      <div className="bg-gray-900 text-white p-6 text-3xl flex flex-col justify-center items-center h-[80%]">
        {/*<>
        <div className='text-3xl font-bold'>404</div>
        <div className='font-semibold'>Unknown request</div>
        </>*/}
        <div>
          <p>
            Due to the loss of our data center in the Middle East, the FFK site
            is unavailable at the moment. It's expected back online in time for
            Gameweek 32.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Unknown;
