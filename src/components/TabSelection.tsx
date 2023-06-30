import React, { useState, ReactNode } from "react";

type TabProps = {
  label: string[];
  active: boolean;
  count: number;
  onClick: () => void;
};

const TabSelection = (props: any) => {
  const { children, labels, counts } = props;
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div>
      <div className="flex justify-center border-gray-300 p-10">
        {labels.map((category: any, index: number) => (
          <TabButton
            key={category}
            label={category}
            active={activeTab === index}
            count={counts[index]}
            onClick={() => handleTabClick(index)}
          />
        ))}
      </div>

      <div className="p-4">{children[activeTab]}</div>
    </div>
  );
};

const TabButton = ({ label, active, count, onClick }: TabProps) => {
  return (
    <button
      className={`px-10 py-2 text-2xl font-extrabold text-white focus:outline-none ${
        active ? "rounded-lg border-2 border-sky-600" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        {label}
        <span className="align-self-middle ml-2 text-xl text-neutral-600">
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
