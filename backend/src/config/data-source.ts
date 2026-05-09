export type DataSourceMode = "mock" | "postgres";

const rawDataSource = process.env.DATA_SOURCE?.toLowerCase();

export const dataSourceMode: DataSourceMode =
  rawDataSource === "postgres" ? "postgres" : "mock";
