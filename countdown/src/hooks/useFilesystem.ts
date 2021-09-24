import {Storage} from "@capacitor/storage";
import {CountdownInterface} from "../interfaces/countdown.interface";

const DATES = "DATES";
const HERO = "HERO";

export function useFilesystem() {
    const getDateList = async () => {
        const {value} = await Storage.get({key: DATES});
        return {
            value: value ? JSON.parse(value) : [] as string []
        };
    }

    const saveDate = async ({name, date}: {name: string, date: string}) => {
        if (name === DATES)
            throw new Error("Invalid date name");

        const {value} = await getDateList();

        await Storage.set({
            key: name,
            value: date
        });

        return Storage.set({
            key: DATES,
            value: JSON.stringify([name, ...value])
        })
    };

    const getDate = ({name}: {name: string}) => {
        return Storage.get({key: name});
    };

    // Should be transactional but whatever
    const deleteDate = async ({name}: {name: string}) => {
        const {value: dateList} = await getDateList();
        const {value: hero} = await getHeroName();
        await Storage.remove({key: name})

        const index = dateList.indexOf(name);
        if (index > -1)
            dateList.splice(index, 1);

        await Storage.set({
            key: DATES,
            value: JSON.stringify(dateList)
        });

        if (hero === name) {
            if (dateList.length > 0) {
                return setHero({name: dateList[0]});
            } else {
                return  Storage.remove({key: HERO});
            }
        }
    }

    const getAllDates = async (): Promise<CountdownInterface[]> => {
      const {value} = await getDateList();
      if (value.length === 0)
          return [];

      return Promise.all(value.map(async (name: string) => {
          const {value: date} = await getDate({name: name});
          if (!date)
              throw new Error(`Invalid date name: ${name}`)
          return {
              name: name,
              date: date
          }
        }));
    };

    const setHero = async ({name}: {name: string}) => {
        const {value} = await getDateList();
        if (!value.includes(name))
            throw new Error("Date does not exist.")

        return Storage.set({
            key: HERO,
            value: name
        })
    }

    const getHeroName = () => {
        return Storage.get({key: HERO});
    }

    const getHero = async (): Promise<CountdownInterface | undefined> => {
        const {value: name} = await getHeroName();
        if (!name)
            return undefined;
        const {value: date} = await Storage.get({key: name || ""});
        if (name && date)
            return {
                name,
                date
            }
        throw new Error("Error getting hero.")
    }

    return {
        getDateList,
        getAllDates,
        getHeroName,
        deleteDate,
        saveDate,
        getDate,
        setHero,
        getHero
    }
}