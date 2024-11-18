export class SensorCalc {
    temporarySavedValues = [];
    lastDataUpload = 0;

    medianCalculation = () => {
        let arraySum: number = 0;
        this.temporarySavedValues.forEach(element => {
            arraySum += element;
        });

        return arraySum / this.temporarySavedValues.length;
    }

    updateLastDataUpload = () => {
        const currentDateMS = new Date().getTime()

        const currentDateMinutes = new Date().getMinutes()

        this.lastDataUpload = currentDateMS - currentDateMinutes * 60 * 1000
    }
}