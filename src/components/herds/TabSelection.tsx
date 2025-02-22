import React, { useState } from "react";
import ToggleSwitch from "../ToggleSwitch";

type TabButtonProps = {
  label: string;
  active: boolean;
  count: number | undefined;
  onClick: () => void;
};

type TabSelectionProps = {
  labels: string[];
  counts: number[];
  children: any;
  showDactyl: boolean;
  showSaga: boolean;
  showPFP: boolean;
  toggleDactyl: (toggleState: boolean) => void;
  toggleSaga: (toggleState: boolean) => void;
  togglePFP: (toggleState: boolean) => void;
};

const TabSelection = ({
  labels,
  counts,
  children,
  showDactyl,
  showSaga,
  showPFP,
  toggleDactyl,
  toggleSaga,
  togglePFP,
}: TabSelectionProps) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-row items-center justify-center gap-2 md:gap-4">
          <ToggleSwitch
            className=""
            toggleState={showDactyl}
            label={"Show Dactyls"}
            onToggle={toggleDactyl}
          />
          <ToggleSwitch
            className=""
            toggleState={showSaga}
            label={"Show Saga"}
            onToggle={toggleSaga}
          />
          <ToggleSwitch
            className=""
            toggleState={showPFP}
            label={"PFP Mode"}
            onToggle={togglePFP}
          />
        </div>
      </div>
      <div className="p-4">{children}</div>
    </>
  );
};

const TabButton = ({ label, active, count, onClick }: TabButtonProps) => {
  return (
    <button
      className={`texl-lg m-2 px-3 py-1 font-extrabold text-white focus:outline-none md:px-6 ${
        active ? "rounded-lg border-2 " : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        {label}
        <span className="align-self-middle md:text-md ml-2 text-sm text-zinc-500">
          [{count}]
        </span>
      </div>
    </button>
  );
};

export default TabSelection;
