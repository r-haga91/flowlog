export type ActionResult = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
  requiresForce?: boolean;
  previousMalerstand?: number;
  warning?: string;
};

export type SelectOption = {
  id: number;
  navn: string;
};

export type SettingKind = "festival" | "arrangor" | "arrangement";
