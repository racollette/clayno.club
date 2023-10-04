// import styled from "styled-components";
import { Dispatch, SetStateAction, useState } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";
// import useThrottledCallback from "beautiful-react-hooks/useThrottledCallback";

// const HexInputWrapper = styled.div`
//   position: relative;

//   &:before {
//     content: "#";
//     width: 12px;
//     height: 40px;
// 	  line-height: 40px;
//     position: absolute;
//     display: inline-block;
//     left: 6px;
// 	  top: 1px;
// 	  font-size: 1.2rem;
// 	  color: ${({ theme }) => theme.palette.primary.light};
//   }
// `;

// const StyledHexInput = styled(HexColorInput)`
//   height: 26px;
//   font-size: 1.2rem;
// 	padding: 20px 6px 20px 16px;
//   border-color: ${({ theme }) => theme.palette.divider};
// 	border-style: solid;
// 	border-width: 1px;
//   border-radius: 4px;
// 	width: 200px;
// 	background-color: transparent;
// 	outline: none;
// 	color: ${({ theme }) => theme.palette.text.primary};

//   &:focus-visible, &:hover {
//     border-color: ${({ theme }) =>  theme.palette.text.primary};
//   }
// `;

type ColorPickerProps = {
  color: string;
  onChange: Dispatch<SetStateAction<string>>;
};
const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
  // const throttledSetColor = useThrottledCallback(setColor, [], 400);

  return (
    <>
      <HexColorPicker color={color} onChange={onChange} />
      {/* <HexInputWrapper> */}
      {/* <HexColorInput color={color} onChange={onChange} /> */}
      {/* </HexInputWrapper> */}
    </>
  );
};

export default ColorPicker;
