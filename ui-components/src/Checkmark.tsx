import { FC, useMemo } from "react";

export type CheckmarkProps = {
  label?: string;
  ok: boolean | undefined;
};

export const Checkmark: FC<CheckmarkProps> = ({ label, ok }) => {
  const className = useMemo(
    () =>
      ["mx-2 flex gap-2", ok ? "text-cyan-400" : "text-yellow-400"].join(" "),
    [ok]
  );

  return ok === undefined ? null : (
    <div className={className}>
      <span>{label}</span>
      <span>{ok ? "✓" : "✗"}</span>
    </div>
  );
};
