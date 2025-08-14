export interface ILocation {
    latitude: number;
      longitude: number;
}
export interface ICountry {
    name: string;
    code: string;
    flag: string;
    location: ILocation
  }
export const countries = [
    // Addis Ababa places
    {
      name: 'Bole',
      code: 'bole',
      flag: '🇪🇹',
      location: { latitude: 8.9936, longitude: 38.785 },
    },
    {
      name: 'Piassa',
      code: 'piassa',
      flag: '🇪🇹',
      location: { latitude: 9.037, longitude: 38.747 },
    },
    {
      name: 'Arat Kilo',
      code: 'arat-kilo',
      flag: '🇪🇹',
      location: { latitude: 9.034, longitude: 38.763 },
    },
    {
      name: 'Kazanchis',
      code: 'kazanchis',
      flag: '🇪🇹',
      location: { latitude: 9.0105, longitude: 38.7664 },
    },
    {
      name: 'Megenagna',
      code: 'megenagna',
      flag: '🇪🇹',
      location: { latitude: 9.005, longitude: 38.795 },
    },
    {
      name: 'Sar Bet',
      code: 'sar-bet',
      flag: '🇪🇹',
      location: { latitude: 8.9805, longitude: 38.7475 },
    },
  ];
