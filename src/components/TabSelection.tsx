import React, { useState } from "react";

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
};

const TabSelection = ({ labels, counts, children }: TabSelectionProps) => {
  //   const { labels, counts, children } = props;
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div>
      <div className="flex flex-wrap justify-center border-gray-300 p-10">
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
      {/* eslint-disable */}
      <div className="p-4">{children[activeTab]}</div>
    </div>
  );
};

const TabButton = ({ label, active, count, onClick }: TabButtonProps) => {
  return (
    <button
      className={`texl-xl px-4 py-2 font-extrabold text-white focus:outline-none md:px-10 md:text-2xl ${
        active ? "rounded-lg border-2 border-sky-600" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        {label}
        <span className="align-self-middle ml-2 text-lg text-neutral-600 md:text-xl">
          [{count}]
        </span>
      </div>
    </button>
  );
};

export default TabSelection;

{
  /* <TabButton
          label={labels[0]}
          active={activeTab === 0}
          count={counts[0]}
          onClick={() => handleTabClick(0)}
        />
        <TabButton
          label={labels[1]}
          active={activeTab === 1}
          count={counts[1]}
          onClick={() => handleTabClick(1)}
        />
        <TabButton
          label={labels[2]}
          active={activeTab === 2}
          count={counts[2]}
          onClick={() => handleTabClick(2)}
        />
        <TabButton
          label={labels[3]}
          active={activeTab === 3}
          count={counts[3]}
          onClick={() => handleTabClick(3)}
        /> */
}
