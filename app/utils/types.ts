export interface RankResponse {
  timestamp: number
  ranking: Ranking[]
}

export interface Ranking {
  videoIds: string[]
  artist: string
  title: string
  count: number
}

export interface ChartDataResponse {
  [artist: string]: {
    [title: string]: {
      chartInDetails: {
        hourly: number
        twentyFourHours: number
        daily: number
        weekly: number
        monthly: number
        yearly: number
        allTime: number
      }
      maxRank: {
        hourly: number
        twentyFourHours: number
        daily: number
        weekly: number
        monthly: number
        yearly: number
        allTime: number
      }
      previousRank: {
        hourly: number
        twentyFourHours: number
        daily: number
        weekly: number
        monthly: number
        yearly: number
        allTime: number
      }
    }
  }
}
