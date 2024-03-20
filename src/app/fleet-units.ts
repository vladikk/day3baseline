import { FleetUnitsDAL } from "../data-access/fleet-units-dal";
import { FleetUnit } from "../model/fleet-unit";

export class FleetUnits {
    constructor(
        public dal: FleetUnitsDAL
    ) { }

    async getAll(): Promise<FleetUnit[]> {
        try {
            const result = await this.dal.getFleetUnits();
            return result;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async get(tailNumber: string): Promise<FleetUnit | null> {
        try {
            const result = await this.dal.getFleetUnitById(tailNumber);
            return result;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async create(fleetUnit: FleetUnit): Promise<void> {
        try {
            const result = await this.dal.createFleetUnit(fleetUnit);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async update(fleetUnit: FleetUnit): Promise<FleetUnit> {
        await this.dal.updateFleetUnit(fleetUnit);
        fleetUnit.version++;
        return fleetUnit;
    }
}