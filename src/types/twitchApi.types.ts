interface TokenResponseDTO {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface StreamResponseDTO {
  id: string;
  viewer_count: number;
  type: "live" | "";
  title: string;
}

export type { TokenResponseDTO, StreamResponseDTO };
