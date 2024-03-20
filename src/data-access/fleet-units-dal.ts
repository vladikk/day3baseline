import { Pool } from 'pg';
import { FleetUnit } from '../model/fleet-unit';

export class FleetUnitsDAL {
    private pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    async createFleetUnit(fleetUnit: FleetUnit): Promise<FleetUnit> {
        const query = `INSERT INTO fleetops.fleet_units (unit_id, unit_data)
                       VALUES ($1, $2)`;
        await this.pool.query(query, [fleetUnit.tailNumber, JSON.stringify(fleetUnit)]);
        return fleetUnit
    }

    async getFleetUnits(): Promise<FleetUnit[]> {
        const query = `SELECT unit_data, __version FROM fleetops.fleet_units`;
        const res = await this.pool.query(query);
        return res.rows.map(row => this.map(row.unit_data, row.__version));
    }

    async getFleetUnitById(fleetUnitId: string): Promise<FleetUnit | null> {
        const query = `SELECT unit_data, __version FROM fleetops.fleet_units WHERE unit_id = $1`;
        const res = await this.pool.query(query, [fleetUnitId]);

        if (res.rows.length) {
            return this.map(res.rows[0].unit_data, res.rows[0].__version);
        } else {
            return null;
        }
    }

    async updateFleetUnit(fleetUnit: FleetUnit): Promise<void> {
        const query = `UPDATE fleetops.fleet_units SET unit_data = $1, __version = __version + 1 
                       WHERE unit_id = $2 AND __version = $3  RETURNING *`;

        const data = JSON.stringify(fleetUnit);
        const expectedVersion = fleetUnit.version;
        const id = fleetUnit.tailNumber;

        const rows = await this.pool.query(query, [data, id, expectedVersion.toString()]);
        if (rows.rowCount === 0) {
            throw new Error("Fleet unit not found or version mismatch");
        }
    }

    async deleteFleetUnit(fleetUnit: FleetUnit): Promise<void> {
        const query = `DELETE FROM fleetops.fleet_units WHERE unit_id = $1`;
        await this.pool.query(query, [fleetUnit.tailNumber]);
    }

    private map(unitData: any, version: number): FleetUnit {
        return new FleetUnit(
            unitData.tailNumber,
            unitData.model,
            new Date(unitData.manufacturingDate),
            new Date(unitData.dateOfPurchase),
            new Date(unitData.nextMaintenanceDate),
            unitData.cabinLayoutIdm,
            version
        );
    }
}
