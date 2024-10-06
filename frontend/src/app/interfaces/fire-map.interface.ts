
export interface Root {
    message: string
    data: Daum[]
}
  
export interface Daum {
    latitude: string
    longitude: string
    date: string
    time: string
    brightness: number
    brightness_c: number
}

export interface FireMapDate  {
    startDate: string
    endDate: string
  }