/* eslint-disable @next/next/no-img-element */

"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";

export default function ScreenInfoMatch({}) {
  const [live, setLive] = useState(true);

  return (
    <div className="relative ">
      <img
        src="https://images.foxtv.com/static.livenowfox.com/www.livenowfox.com/content/uploads/2024/02/932/470/GettyImages-453347919.jpg?ve=1&tl=1"
        alt="Stadium"
        className="w-full h-auto "
      />

      <div className="absolute inset-0 bg-black bg-opacity-55"></div>

      <div className="absolute inset-0 grid grid-cols-10 items-start justify-center px-4 pt-2">
        <div className="col-span-10 text-gray-300  flex flex-row items-center">
          <Icon icon="twemoji:soccer-ball" />
          <p className="pl-2 text-sm">Ý - Giải Series A</p>
        </div>
        <div className="flex flex-col items-start col-span-3">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/SSC_Neapel.svg/1024px-SSC_Neapel.svg.png"
            alt="Napoli Logo"
            className="h-12 w-12"
          />
          <span className="text-white py-2 text-sm">SSC Napoli</span>
          <div className="flex flex-row justify-around items-center w-9/12 text-white font-bold">
            <div className="bg-red-600 w-3 h-3" />
            <p>0</p>
            <div className="bg-yellow-600 w-3 h-3" />
            <p>0</p>
          </div>
        </div>

        {live ? (
          <div className="col-span-4 flex flex-col items-center justify-center text-gray-300 pt-2">
            <div className="flex flex-row items-center gap-2">
              <Icon icon="fluent:live-20-filled" width={25} color="red" />
              <p className="font-bold text-green-500">27’ Hiệp 1</p>
            </div>
            <div className="flex justify-center items-center pt-3">
              <p className="py-0.5 px-2 border-2 border-gray-300 rounded-sm font-bold text-white">0</p>
              <p className="px-3">:</p>
              <p className="py-0.5 px-2 border-2 border-gray-300 rounded-sm font-bold text-white">0</p>
            </div>
          </div>
        ) : (
          <div className="col-span-4 flex flex-col items-center justify-center text-gray-300 pt-2">
            <span className="">Ngày mai</span>
            <span className="">18:30</span>
          </div>
        )}

        <div className="flex flex-col items-end col-span-3">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/thumb/6/66/AtalantaBC.svg/1200px-AtalantaBC.svg.png"
            alt="Napoli Logo"
            className="h-12 w-12"
          />
          <span className="text-white py-2 text-sm">SSC Napoli</span>
          <div className="flex flex-row justify-around items-center w-9/12 text-white font-bold">
            <div className="bg-red-600 w-3 h-3" />
            <p>0</p>
            <div className="bg-yellow-600 w-3 h-3" />
            <p>0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
