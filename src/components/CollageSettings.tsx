import { Dispatch, SetStateAction, useState } from "react";
import ColorPicker from "./ColorPicker";
import { Slider as SliderBase } from "~/@/components/ui/slider";
import { CustomFlowbiteTheme, Modal } from "flowbite-react";
import { HiCog } from "react-icons/hi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/@/components/ui/tooltip";

const customTheme: CustomFlowbiteTheme["modal"] = {
  content: {
    inner: "bg-neutral-900 rounded-lg",
  },
  root: {
    sizes: {
      sm: "w-54",
    },
  },
};

type CollageSettingsProps = {
  cols: number;
  rows: number;
  outlineWidth: number;
  handleSlideColumns: (v: number[]) => void;
  handleSlideRows: (v: number[]) => void;
  handleOutlineWidth: (v: number[]) => void;
  color: string;
  setColor: Dispatch<SetStateAction<string>>;
  modalMode: boolean;
  //   openModal: string | undefined;
  //   setOpenModal: (c: string | undefined) => void;
};

export const CollageSettings = (props: CollageSettingsProps) => {
  const { modalMode } = props;
  const [openModal, setOpenModal] = useState<string | undefined>();

  return (
    <>
      {modalMode ? (
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="rounded-lg bg-emerald-600 px-3 py-2 hover:bg-emerald-500">
                <HiCog size={24} onClick={() => setOpenModal("dismissible")} />
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Modal
            size="sm"
            theme={customTheme}
            dismissible
            show={openModal === "dismissible"}
            onClose={() => setOpenModal(undefined)}
            position={"center"}
          >
            <CoreSettings {...props} />
          </Modal>
        </>
      ) : (
        <CoreSettings {...props} />
      )}
    </>
  );
};

function CoreSettings(props: CollageSettingsProps) {
  const {
    handleSlideColumns,
    cols,
    handleSlideRows,
    rows,
    handleOutlineWidth,
    outlineWidth,
    color,
    setColor,
  } = props;
  return (
    <div className="flex flex-col justify-start gap-4 rounded-md bg-neutral-800 p-6 text-white">
      <div className="flex flex-col gap-1">
        <div>Columns</div>
        <SliderBase
          onValueChange={(v) => handleSlideColumns(v)}
          defaultValue={[cols]}
          value={[cols]}
          min={1}
          max={6}
          step={1}
          className="w-48"
        />
      </div>
      <div className="flex flex-col gap-1">
        <div>Rows</div>
        <SliderBase
          onValueChange={(v) => handleSlideRows(v)}
          defaultValue={[2]}
          value={[rows]}
          min={1}
          max={4}
          step={1}
          className="w-48"
        />
      </div>
      <div className="flex flex-col gap-1">
        <div>Border Width</div>
        <SliderBase
          onValueChange={(v) => handleOutlineWidth(v)}
          defaultValue={[2]}
          value={[outlineWidth]}
          min={0}
          max={8}
          step={1}
          className="w-48"
        />
      </div>
      <div>
        <ColorPicker onChange={setColor} color={color} />
      </div>
    </div>
  );
}
