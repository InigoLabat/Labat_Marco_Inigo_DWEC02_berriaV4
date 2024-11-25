'use strict'
export class GastosCombustible {
    constructor(vehicleType, fecha, kilometers, tarifa) {
        this.vehicleType = vehicleType;
        this.date = fecha;
        this.kilometers = kilometers;
        this.precioViaje = tarifa * kilometers;
    }

    convertToJSON() {
        var enJSON = JSON.stringify(this);
        return enJSON;
    }
}