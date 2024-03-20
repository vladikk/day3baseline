export class FleetUnit {
    tailNumber: string;
    model: string;
    manufacturingDate: Date;
    dateOfPurchase: Date;
    nextMaintenanceDate: Date;
    cabinLayoutId: string;
    version: number = 1;

    constructor(
        tailNumber: string,
        model: string,
        manufacturingDate: Date,
        dateOfPurchase: Date,
        nextMaintenanceDate: Date,
        cabinLayoutId: string,
        version: number
    ) {
        this.tailNumber = tailNumber;
        this.model = model;
        this.manufacturingDate = manufacturingDate;
        this.dateOfPurchase = dateOfPurchase;
        this.nextMaintenanceDate = nextMaintenanceDate;
        this.cabinLayoutId = cabinLayoutId;
        this.version = version
    }

    scheduleNextMaintenance(daysUntilNextMaintenance: number): void {
        const nextDate = new Date(this.nextMaintenanceDate);
        nextDate.setDate(nextDate.getDate() + daysUntilNextMaintenance);
        this.nextMaintenanceDate = nextDate;
    }
}