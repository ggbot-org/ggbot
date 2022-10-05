import { FC, PointerEventHandler, ReactNode, useMemo } from "react";

const settingsSectionIds = ["account", "binance", "billing"] as const;
export type SettingsSectionId = typeof settingsSectionIds[number];

export type SettingsMenuProps = {
  selected: SettingsSectionId;
  setSelected: (selected: SettingsSectionId) => void;
  titleOfSection: Record<SettingsSectionId, string>;
};

export const SettingsMenu: FC<SettingsMenuProps> = ({
  titleOfSection,
  selected,
  setSelected,
}) => {
  const items = useMemo<
    Array<SettingsMenuItemProps & { id: SettingsSectionId }>
  >(() => {
    return settingsSectionIds.map((section) => ({
      id: section,
      content: titleOfSection[section],
      selected: section === selected,
      onClick: (event) => {
        event.stopPropagation();
        setSelected(section);
      },
    }));
  }, [titleOfSection, selected, setSelected]);

  return (
    <menu className="md:w-48 flex flex-col gap-4">
      {items.map(({ id, ...props }) => (
        <SettingsMenuItem key={id} {...props} />
      ))}
    </menu>
  );
};

type SettingsMenuItemProps = {
  selected?: boolean;
  content: ReactNode;
  onClick?: PointerEventHandler<HTMLLIElement>;
};

const SettingsMenuItem: FC<SettingsMenuItemProps> = ({
  content,
  onClick,
  selected,
}) => {
  const className = useMemo(
    () =>
      [
        "pl-2 border-l-2 font-medium select-none border-transparent transition-all ease-in-out delay-100",
        selected
          ? "text-primary-600 border-primary-600 dark:text-primary-400 dark:border-primary-500"
          : "cursor-pointer",
      ].join(" "),
    [selected]
  );
  return (
    <li
      className={className}
      onClick={onClick}
      aria-current={selected ? "page" : undefined}
    >
      {content}
    </li>
  );
};
