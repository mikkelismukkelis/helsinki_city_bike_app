export interface JourneyData {
  rowid: number
  departure_station_name: string
  return_station_name: string
  covered_distance_m: number
  duration_s: number
}

// FID,ID,Nimi,Namn,Name,Osoite,Adress,Kaupunki,Stad,Operaattor,Kapasiteet,x,y
export interface StationData {
  fid: number
  id: number
  nimi: string
  namn: string
  name: string
  osoite: string
  kaupunki: string
  stad: string
  Operaattor: string
  kapasiteet: number
  x: number
  y: number
}

export type Order = 'asc' | 'desc'

export interface HeadCell {
  disablePadding: boolean
  id: keyof JourneyData
  label: string
  numeric: boolean
}
