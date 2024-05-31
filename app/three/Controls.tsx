import { Dispatch, SetStateAction } from "react";
import { StairsMaterial } from "./page";
import { Button, NumberInput, Select, Slider } from "@mantine/core";

type Props = {
  width: number;
  setWidth: Dispatch<SetStateAction<number>>;
  numStairs: number;
  setNumStairs: Dispatch<SetStateAction<number>>;
  material: StairsMaterial;
  setMaterial: Dispatch<SetStateAction<StairsMaterial>>;
}

export default function Controls({ material, setMaterial, numStairs, setNumStairs, width, setWidth }: Props) {
  function countCost() {
    let materialCost = 1;
    if (material == "birch") materialCost = 1.2;
    else if (material == "oak") materialCost = 3;
    return Math.floor(materialCost * numStairs * width * 30);
  }
  return (
    <div className="absolute p-3 z-10 bg-gray-100 rounded left-[5px] top-[5px]">
      <p className="mb-3">
        Скролл: приблизить <br />
        Левая кнопка мыши: вращать
      </p>
      <div className="mb-1 text-sm">Количество ступеней:</div>
      <NumberInput className="mb-3" value={numStairs} onChange={setNumStairs as any} max={20} />
      <div className="mb-1 text-sm">Ширина:</div>
      <Slider value={width} onChange={setWidth as any} min={50} max={250} />
      <div className="mb-3">{width} см</div>
      <div className="mb-1 text-sm">Материал:</div>
      <Select allowDeselect={false}
        data={[
          { value: "pine", label: "Сосна" },
          { value: "birch", label: "Береза" },
          { value: "oak", label: "Дуб" },
        ]}
        value={material} onChange={setMaterial as any} />
      <div className="mb-1 text-sm mt-4">Стоимость:</div>
      <div className="mb-3">{countCost()} р.</div>
      <Button onClick={e => alert("Готово!")}>Заказать</Button>
    </div>
  )
}