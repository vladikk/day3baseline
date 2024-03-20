import { Pool } from "pg";
import { CabinLayoutsDAL } from "../data-access/cabin-layouts-dal";
import { CabinLayout } from "../model/cabin-layout";

export class CabinLayouts {
    constructor(
        public dal: CabinLayoutsDAL,
        public pool: Pool
    ) { }

    async getAll(): Promise<CabinLayout[]> {
        try {
            const result = await this.dal.getCabinLayouts();
            return result;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async get(id: string): Promise<CabinLayout | null> {
        return await this.dal.getCabinLayoutById(id);
    }

    async create(cabinLayout: CabinLayout): Promise<CabinLayout> {
        if (!await this.isLayoutValid(cabinLayout)) {
            throw new Error("Invalid layout");
        }

        await this.dal.createCabinLayout(cabinLayout);
        return cabinLayout;
    }

    async update(cabinLayout: CabinLayout): Promise<CabinLayout> {
        if (!await this.isLayoutValid(cabinLayout)) {
            throw new Error("Invalid layout");
        }

        await this.dal.updateCabinLayout(cabinLayout);
        return cabinLayout;
    }

    async isLayoutValid(layout: CabinLayout): Promise<boolean> {
        if (layout.rows.find(row => row.seatGroups.length <= 1)) {
            return false;
        }
    
        let seatTypes = (await this.pool.query('SELECT * FROM fleetops.seat_types')).rows;
        
        function getWidth(seatTypeId: string): number {
            return seatTypes.find((st: { seat_type_id: string; }) => st.seat_type_id === seatTypeId)?.width_cm || 0;
        }
    
        function getPitch(seatTypeId: string): number {
            return seatTypes.find((st: { seat_type_id: string; }) => st.seat_type_id === seatTypeId)?.pitch_cm || 0;
        }
    
        let totalRowWidths = layout.rows.map(r => {
            let totalSeats = r.seatGroups.reduce((a, b) => a + b, 0);
            return totalSeats * getWidth(r.seatType);
        });
    
        console.log("Calculated widths of the layout's rows:", totalRowWidths);
        if (totalRowWidths.find(w => w > layout.width)) {
            return false;
        }
    
        let totalLength = layout.rows.reduce((a, b) => a + getPitch(b.seatType) + b.extraSpace, 0);
        console.log("Calculated total length of the layout's rows: ", totalLength);
        if (totalLength > layout.length) {
            return false;
        }
    
        return true;
    }
}