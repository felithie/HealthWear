const intensityColorLevel = {
    one: "#00cd00",
    two: "#ffff00",
    three: "#ffa500",
    four: "#cd0000",
    five: "#8b0000",

    getRandomColorValue(value: number) {
        if (value > 80) { return this.one; }
        if (value > 60) { return this.two; }
        if (value > 40) { return this.three; }
        if (value > 20) { return this.four; }
        return this.five;
    }
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
    return new Date(year, month + 1, 0).getDate(); // Month is 0-indexed, so adding 1
};

const transformIntoDateFormat = (day: number, month: number, year: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

const generateRandomValue = () => {
    return Math.floor(Math.random() * 100);
};

export const markDates = () => {
    const currentDate = getCurrentDate(); 
    const markedDates: any = {}; 

    for (let i = 1; i <= getAmountOfMonthDays(currentDate.year, currentDate.month); i++) {
        const randomValue = generateRandomValue();
        const dateKey = transformIntoDateFormat(i, currentDate.month, currentDate.year);
        markedDates[dateKey] = { 
            selected: true, 
            margin: 20, 
            marked: true, 
            selectedColor: intensityColorLevel.getRandomColorValue(randomValue),
            dotColor: intensityColorLevel.getRandomColorValue(randomValue),  // Make sure the dot color is set
        }; 
    }

    return markedDates; 
};
