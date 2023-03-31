import React from "react";

const useLocalStorage = () => {
  async function setLocalStorage(key: string, data: string) {
    if (typeof window != undefined) {
      localStorage.setItem(key, data);
      console.log("successfully stored on local storage");
    }
  }

  async function getLocalStorage(key: string): Promise<string> {
    let data: string = "";

    if (typeof window != undefined) {
      let returnedData = localStorage.getItem(key);
      if (returnedData) {
        data = returnedData;
      }
    }

    return data;
  }

  return { setLocalStorage, getLocalStorage };
};

export default useLocalStorage;
