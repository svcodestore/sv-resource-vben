declare interface ModificationTimeFields {
  createdAt: string;
  updatedAt: string;
}

declare interface ModifierFields {
  createdBy: string;
  updatedBy: string;
}

declare type ModificationFields = ModificationTimeFields & ModifierFields;

declare type BaseModelFields = {
  id: number;
} & ModificationFields;
