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

export const Table: FC<ChildrenProp> = ({ children }) => {
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
      <table>{children}</table>
    </div>
  );
};

export const Tbody: FC<ChildrenProp> = ({ children }) => {
  const className = "border-l border-r border-b border-mono-300";
  return <tbody className={className}>{children}</tbody>;
};

export const Td: FC<ChildrenProp> = ({ children }) => {
  const className = "px-2 py-1";
  return <td className={className}>{children}</td>;
};

export const Tfoot: FC<ChildrenProp> = ({ children }) => {
  const className = "border-b border-mono-300";
  return <tfoot className={className}>{children}</tfoot>;
};

export const Thead: FC<ChildrenProp> = ({ children }) => {
  const className = "my-2 border-l border-t border-mono-300";
  return <thead className={className}>{children}</thead>;
};

export type ThProps = Omit<ThHTMLAttributes<HTMLTableCellElement>, "className">;
export const Th: FC<ThProps> = ({ children, ...props }) => {
  const className = "px-2 py-1 font-semibold border-b border-r border-mono-300";
  return (
    <th className={className} {...props}>
      {children}
    </th>
  );
};

export const Tr: FC<ChildrenProp> = ({ children }) => {
  return <tr>{children}</tr>;
};
