import {
  FC,
  ThHTMLAttributes,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type ChildrenProp = { children: ReactNode };

type TableProps = ChildrenProp & {
  caption?: string;
};
export const Table: FC<TableProps> = ({ caption, children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  const containerStyle = useMemo(() => ({ width: `${width}px` }), [width]);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeHandler = () => {
      if (!containerRef.current) return;
      const { left } = containerRef.current.getBoundingClientRect();
      setWidth(window.innerWidth - 2 * left);
    };

    resizeHandler();

    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [containerRef, setWidth]);

  return (
    <div
      className="overflow-y-scroll"
      ref={containerRef}
      style={containerStyle}
    >
      <table>
        {caption ? <caption className="text-lg">{caption}</caption> : null}
        {children}
      </table>
    </div>
  );
};

export const Tbody: FC<ChildrenProp> = ({ children }) => {
  return <tbody>{children}</tbody>;
};

export const Td: FC<ChildrenProp> = ({ children }) => {
  return <td className="px-2 py-1">{children}</td>;
};

export const Tfoot: FC<ChildrenProp> = ({ children }) => {
  return <tfoot>{children}</tfoot>;
};

export const Thead: FC<ChildrenProp> = ({ children }) => {
  return <thead>{children}</thead>;
};

export type ThProps = Omit<ThHTMLAttributes<HTMLTableCellElement>, "className">;
export const Th: FC<ThProps> = ({ children, ...props }) => {
  return (
    <th className="px-2 py-1 font-semibold" {...props}>
      {children}
    </th>
  );
};

export const Tr: FC<ChildrenProp> = ({ children }) => {
  return <tr className="border border-mono-300 p-1">{children}</tr>;
};
