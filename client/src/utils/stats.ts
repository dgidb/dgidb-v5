// src/api/stats.ts

export interface StatsData {
  drug_claims: number;
  drugs: number;
  gene_claims: number;
  genes: number;
  interaction_claims: number;
  interactions: number;
  gene_categorization_claims: number;
  gene_categorizations: number;
  sources: number;
  publications: number;
}

export async function getStats(
  urlDomain: string,
  signal?: AbortSignal
): Promise<StatsData> {
  const response = await fetch(`${urlDomain}/api/counts`, { signal });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch stats: ${response.status} ${response.statusText}`
    );
  }

  return response.json() as Promise<StatsData>;
}
