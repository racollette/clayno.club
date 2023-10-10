// import styled from "styled-components";
import { Dispatch, SetStateAction, useState } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";

type ColorPickerProps = {
  color: string;
  onChange: Dispatch<SetStateAction<string>>;
};
const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
  return (
    <>
      <HexColorPicker color={color} onChange={onChange} />
      <div>
        <HexColorInput className="bg-black" color={color} onChange={onChange} />
      </div>
    </>
  );
};

export default ColorPicker;
