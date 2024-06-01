import React from "react";
import { useGlobal } from "../context";

function Limit() {
  const { limit, setLimit, modal, setModal, songs } = useGlobal();
  return (
    <>
      {modal && (
        <div className="fixed z-50 h-screen w-screen flex items-center justify-center bg-white bg-opacity-10 ">
          <div className="bg-white flex items-center justify-center rounded-[12px] h-[100px] w-[200px] ">
            <input
              className="outline-none border-b-2 border-black w-[30px] text-black text-center "
              type="number"
              value={limit}
              onChange={(e) => {
                setLimit(e.target.value);
              }}
            />
          </div>
          <button
            onClick={() => {
              setModal(false);
              console.log(songs);
            }}
            className="bg-blue-500 absolute right-5 top-3 text-white px-2 py-1 rounded-md "
          >
            close
          </button>
        </div>
      )}
    </>
  );
}

export default Limit;
