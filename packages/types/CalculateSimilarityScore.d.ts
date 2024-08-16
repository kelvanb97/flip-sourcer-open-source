export interface CalculateSimilarityScoreProps {
  retailer: {
    productName: string;
    imageUrl: string;
  };
  amazon: {
    productName: string;
    imageUrl: string;
  };
}

interface CalculateSimilarityScoreResult {
  imageSimilarityScore: number;
  textSimilarityScore: number;
  score: number;
}
