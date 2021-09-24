import moment from "moment/moment";

export function useDateDiff() {
    const getDiff = (startDate: string, endDate: string) => {
        const d1 =  moment(startDate);
        const d2 =  moment(endDate);
        return Math.ceil(moment.duration(d1.diff(d2)).asDays());
    }

    const getDiffFromToday = (date: string) => {
        return getDiff(date, Date().toString());
    }

    return {
        getDiff,
        getDiffFromToday
    }
}