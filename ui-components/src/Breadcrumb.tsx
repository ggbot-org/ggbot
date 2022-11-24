import type { FC, ReactNode } from "react";

export type BreadcrumbItems = BreadcrumbItemProps[];

type BreadcrumbProps = {
  items?: BreadcrumbItems;
  /** Optionally set the `aria-label`. */
  label?: string;
};

export const Breadcrumb: FC<BreadcrumbProps> = ({
  items,
  label = "Breadcrumb",
}) => {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label={label}>
      <ol className="flex flex-row items-center mx-2">
        {items.map((props, index) => (
          <BreadcrumbItem key={index} {...props} />
        ))}
      </ol>
    </nav>
  );
};

type BreadcrumbItemProps = {
  content: ReactNode;
  /** If true, set `aria-current` to `page`. */
  current?: boolean;
};

const BreadcrumbItem: FC<BreadcrumbItemProps> = ({ content, current }) => (
  <li
    className="first:before:content-[''] before:content-['/'] before:mx-2 before:text-xs"
    aria-current={current ? "page" : undefined}
  >
    {content}
  </li>
);
