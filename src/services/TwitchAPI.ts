import c from "config";
import type {
  StreamResponseDTO,
  TokenResponseDTO,
} from "../types/twitchApi.types.js";
import { NotLiveError } from "@/interfaces/Errors.js";

class TwitchAPI {
  private tokenURL = "https://id.twitch.tv/oauth2/token";
  private clientID = c.get("twitch.clientID");
  private clientSecret = c.get("twitch.clientSecret");
  private grantType = "client_credentials";
  private token?: TokenResponseDTO;
  private sinceToken = 0;

  private isTokenValid(): boolean {
    if (!this.token) return false;
    const now = Date.now();
    const expiresAt = this.sinceToken + this.token.expires_in * 1000;
    return now < expiresAt;
  }

  /**
   * Wrapper around `fetch` that handles Authorization headers
   * @param input
   * @param init
   *
   */
  private async request<T>(
    input: Request | string,
    init?: RequestInit
  ): Promise<T> {
    if (!this.isTokenValid()) {
      await this.setToken();
    }

    const response = await fetch(input, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.token?.access_token}`,
        "Client-Id": this.clientID,
      } as HeadersInit,
    });
    const data = (await response.json()) as T;
    return data;
  }

  private async setToken() {
    const response = await fetch(`${this.tokenURL}`, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `client_id=${this.clientID}&client_secret=${this.clientSecret}&grant_type=${this.grantType}`,
      method: "POST",
    });
    const data = (await response.json()) as TokenResponseDTO;
    this.sinceToken = Date.now();
    this.token = data;
  }

  /**
   * Get the current live streams for a channel
   */
  async getStreams(channel: string): Promise<StreamResponseDTO[]> {
    const params = new URLSearchParams({
      user_login: channel,
      type: "live",
      first: "1",
    });
    const url = `https://api.twitch.tv/helix/streams?${params}`;
    const response = await this.request<{ data: StreamResponseDTO[] }>(url);

    if (!response.data.length)
      throw new NotLiveError(`Channel ${channel} is not live.`);

    return response.data;
  }
}

export { TwitchAPI };
