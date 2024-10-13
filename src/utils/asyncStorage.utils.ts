import { AsyncStorageState } from "@/models/Enums/EAsyncStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";

type getProps = {
  id: AsyncStorageState;
};

type setProps = {
  id: AsyncStorageState;
  value: unknown;
};

// Hook
export const useAsyncStorage = () => {
  const getStorageData = async ({ id }: getProps) => {
    try {
      const value = await AsyncStorage.getItem(id);

      if (value !== null) {
        return JSON.parse(value);
      }
    } catch (e) {
      console.log(e);
    }
    return null;
  };

  const setStorageData = async ({ id, value }: setProps) => {
    try {
      await AsyncStorage.setItem(id, JSON.stringify(value));
    } catch (e) {
      console.log(e);
    }
    return null;
  };

  return { getStorageData, setStorageData };
};
