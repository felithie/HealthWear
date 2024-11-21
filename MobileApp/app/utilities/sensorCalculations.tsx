export class SensorCalc {
    temporarySavedValues: any = [];
    lastDataUpload = 0;

    averageCalculation = () => {
        let arraySum: number = 0;
        this.temporarySavedValues.forEach((element: number) => {
            arraySum += element;
        });

        return arraySum / this.temporarySavedValues.length;
    }

    updateLastDataUpload = () => {
        const currentDateMS = new Date().getTime()

        const currentDateMinutes = new Date().getMinutes()

        this.lastDataUpload = currentDateMS - currentDateMinutes * 60 * 1000
    }

    saveValue = (value: number) => {
        this.temporarySavedValues.push(value)
    }

    isSameHour() {
        // Get the current time in milliseconds
        const currentTimeMs = Date.now();
    
        // Convert both times to hours
        const currentHour = new Date(currentTimeMs).getHours();
        const lastSavedHour = new Date(this.lastDataUpload).getHours();
    
        // Compare the hours
        return currentHour === lastSavedHour;
    }
    

}

