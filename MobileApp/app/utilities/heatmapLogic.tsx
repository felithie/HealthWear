import { getDataForSpecificDate, getDataForDateRange } from "./firebaseConfig"

const intensityColorLevel = {
    one: "#00cd00",
    two: "#ffff00",
    three: "#ffa500",
    four: "#cd0000",
    five: "#8b0000",

    getColorValue(value: number) {
        if (value > 80) { return this.one; }
        if (value > 60) { return this.two; }
        if (value > 40) { return this.three; }
        if (value > 20) { return this.four; }
        if (value > 0 ) { return this.five; }
    }
};

const getAverageValueOfDays = async (dayData: any[]) => {
    let averageArray: any = []
    const currentDate = getCurrentDate()
    for(let i = 0; i < getAmountOfMonthDays(currentDate.year, currentDate.month); i++) {
        let value = 0
        dayData.forEach((entry: any) => {
     
            if(entry.data[i] !== undefined) {
                for(let x = 0; x < 24; x++) {
                    if(new Date(entry.data[i].time).getDate() === i) {
                        value += entry.data[i].value
                    } 
                }
            }
        })
        averageArray.push( value / 24 * 2 )
    }
    
    return averageArray
};

export const getCurrentDate = () => {
    const date = new Date();
    return {
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear()
    };
};

const getAmountOfMonthDays = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
};

const transformIntoDateFormat = (day: number, month: number, year: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

const transformIntoDateObject =  (day: number, month: number, year: number): Date => {
    // Month is zero-based, so subtract 1
    return new Date(year, month, day);
}


const generateRandomValue = () => {
    return Math.floor(Math.random() * 100);
};

const getAllDaysFromDatabase = async (year: number, month: number) => {
    // Get the first day of the month
    const firstDay = new Date(year, month, 1); // 1st day of the month
    
    // Get the last day of the month by setting the date to 0 of the next month
    const lastDay = new Date(year, month + 1, 0); // Last day of the current month
    
    // Call the function to get data for the date range (first day to last day)
    const data = await getDataForDateRange(firstDay, lastDay);
    
    return data;
};

export const markDates = async () => {
    const currentDate = getCurrentDate(); 
    const markedDates: any = {}; 
    const dbData = await getAllDaysFromDatabase(currentDate.year, currentDate.month);
    
    const averageValues = await getAverageValueOfDays(dbData)
    for (let i = 0; i < getAmountOfMonthDays(currentDate.year, currentDate.month); i++) {
       // console.log(i)
        //console.log(intensityColorLevel.getColorValue(averageValues[i]))
        const dateKey = transformIntoDateFormat(i, currentDate.month, currentDate.year);
        markedDates[dateKey] = { 
            selected: averageValues[i] === 0 ? false : true, 
            margin: 20, 
            marked: false, 
            selectedColor: intensityColorLevel.getColorValue(averageValues[i])
    }
};
    return markedDates; 

}


