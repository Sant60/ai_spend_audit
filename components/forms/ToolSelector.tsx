import { TOOL_OPTIONS } from "@/constants/tools";

interface ToolSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const ToolSelector = ({ value, onChange }: ToolSelectorProps) => {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-bold text-black">AI tool using</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="border border-black bg-white px-4 py-3 text-sm text-black outline-none focus:border-[#112a5c]"
      >
        {TOOL_OPTIONS.map((tool) => (
          <option key={tool.id} value={tool.id}>
            {tool.name}
          </option>
        ))}
      </select>
    </label>
  );
};

export default ToolSelector;
