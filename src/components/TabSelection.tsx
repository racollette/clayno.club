import React, { useState } from "react";
import ToggleSwitch from "./ToggleSwitch";

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
      <div className="flex flex-wrap justify-center border-gray-300 p-4 md:p-10">
        {labels.map((category: string, index: number) => (
          <TabButton
            key={category}
            label={category}
            active={activeTab === index}
            count={counts[index]}
            onClick={() => handleTabClick(index)}
          />
        ))}
      </div>
      <div className="mx-10 mt-2 grid grid-cols-2 justify-center gap-y-2 align-middle md:flex md:flex-row md:gap-x-6">
        <ToggleSwitch
          className="justify-self-start"
          toggleState={showDactyl}
          label={"Show Dactyls"}
          onToggle={toggleDactyl}
        />
        <ToggleSwitch
          className="justify-self-end"
          toggleState={showSaga}
          label={"Show Saga"}
          onToggle={toggleSaga}
        />
        <ToggleSwitch
          className="justify-self-start"
          toggleState={showPFP}
          label={"PFP Mode"}
          onToggle={togglePFP}
        />
      </div>
      {/* eslint-disable */}
      <div className="p-4">{children[activeTab]}</div>
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
