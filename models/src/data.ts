export type DataPrimitive = string | number | boolean | null | undefined;
export type DataArray = DataValue[];
export type DataObject = { [Key in string]?: DataValue };
export type DataValue = DataPrimitive | DataArray | DataObject;
