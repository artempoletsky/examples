"use client";

import { useState } from "react";
import Stairs from "./Stairs";
import Controls from "./Controls";
import { MantineProvider } from "@mantine/core";

export type StairsMaterial = "birch" | "pine" | "oak";

export default function Page() {
  const [width, setWidth] = useState(100);
  const [numStairs, setNumStairs] = useState(4);
  const [material, setMaterial] = useState<StairsMaterial>("pine");

  return <div className="relative">
    <Stairs width={width} numStairs={numStairs} material={material} />
    <MantineProvider>
      <Controls
        material={material} setMaterial={setMaterial}
        width={width} setWidth={setWidth}
        numStairs={numStairs} setNumStairs={setNumStairs}
      />
    </MantineProvider>
  </div>
}
