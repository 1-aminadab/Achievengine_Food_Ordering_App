import AsyncStorage from "@react-native-async-storage/async-storage";
export enum StorageKeys {
    IS_FIRST_TIME = "isFirstTime",
    USER_DATA = "userData",
    CURRENT_SCREEN = 'currentScreen'
}
export const setItem = async(key:StorageKeys, value:any): Promise<void> => {
    try {
        const jsonValue = typeof value === "string" ? value : JSON.stringify(value);  
        await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
        console.error(`Error setting item with key ${key}:`, error)
    }
}

export const getItem = async (key: StorageKeys): Promise<any> => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue) {
        try {
          return JSON.parse(jsonValue);
        } catch {
          return jsonValue;
        }
      }
      return null;
    } catch (error) {
      console.error(`Error getting item with key ${key}:`, error);
      return null;
    }
  };
  

export const removeItem = async (key: StorageKeys): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item with key ${key}:`, error);
    }
};