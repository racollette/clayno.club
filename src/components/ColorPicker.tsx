// import styled from "styled-components";
import { Dispatch, SetStateAction } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";

type ColorPickerProps = {
  color: string;
  onChange: Dispatch<SetStateAction<string>>;
};
const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
  return (
    <>
      <HexColorPicker color={color} onChange={onChange} />
      <div className="w-50 pt-2">
        <HexColorInput
          className="w-full rounded-md bg-black py-1 text-center focus:outline-none"
          color={color}
          onChange={onChange}
        />
      </div>
    </>
  );
};

export default ColorPicker;
