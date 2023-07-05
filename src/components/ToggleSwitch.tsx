import React from "react";

type ToggleSwitchProps = {
  toggleState: boolean;
  label: string;
  onToggle: (toggleState: boolean) => void;
};

const ToggleSwitch = ({ toggleState, onToggle, label }: ToggleSwitchProps) => {
  const handleToggle = () => {
    onToggle(!toggleState);
  };

  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        value=""
        className="peer sr-only"
        checked={toggleState}
        onChange={handleToggle}
      />
      <div className="peer h-6 w-11 rounded-lg bg-zinc-300 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-lg after:border after:border-zinc-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-sky-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-zinc-600 dark:bg-zinc-700 dark:peer-focus:ring-sky-800"></div>
      <span className="ml-2 text-sm font-medium text-white">{label}</span>
    </label>
  );
};

export default ToggleSwitch;
