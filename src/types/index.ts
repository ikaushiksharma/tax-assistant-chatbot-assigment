export type TableRowType = {
  type: "text";
  text: string;
  signature: string;
};
export type TableDataType = Array<TableRowType>;

export type ReasoningUIPart = {
  type: "reasoning";
  reasoning: string;
  details: TableDataType;
};

export type StepStartUIPart = {
  type: "step-start";
};
