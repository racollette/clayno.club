import React from "react";

type ToggleSwitchProps = {
  toggleState: boolean;
  label: string;
  onToggle: (toggleState: boolean) => void;
  className: string;
};

const ToggleSwitch = ({
  toggleState,
  onToggle,
  label,
  className,
}: ToggleSwitchProps) => {
  const handleToggle = () => {
    onToggle(!toggleState);
  };

  return (
    <label
      className={`relative inline-flex cursor-pointer items-center ${className}`}
    >
      <input
        type="checkbox"
        className="peer sr-only"
        checked={toggleState}
        onChange={handleToggle}
      />
      <div
        className={`${
          toggleState ? "bg-[#00D1D1]" : "bg-neutral-700"
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00D1D1] focus:ring-offset-2`}
      >
        <span
          className={`${
            toggleState ? "translate-x-6" : "translate-x-1"
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </div>
      <span className="ml-2 text-sm font-medium text-white">{label}</span>
    </label>
  );
};

export default ToggleSwitch;
