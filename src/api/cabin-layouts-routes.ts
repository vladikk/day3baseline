import express from 'express';
import { pool, query } from '../data-access/db';
import { CabinLayout } from '../model/cabin-layout';
import { CabinLayoutsDAL } from '../data-access/cabin-layouts-dal';
import { CabinLayouts } from '../app/cabin-layouts';

export const router = express.Router();

const dal = new CabinLayoutsDAL(pool);
const app = new CabinLayouts(dal, pool)

router.get('/', async (_req, res) => {
    try {
        const result = await app.getAll();
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const result = await app.get(req.params.id);
        if (result === null) {
            return res.status(404).json({ message: 'Cabin layout found' });
        }

        return res.json(result);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        let cabinLayout = req.body as CabinLayout;
        const result = await app.create(cabinLayout);
        return res.status(201).json(result);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const expectedVersion = parseInt(req.query.expectedVersion?.toString() || "");

    if (isNaN(expectedVersion)) {
        return res.status(400).json({ message: "Invalid or missing expectedVersion query parameter" });
    }

    let cabinLayout = req.body as CabinLayout;
    cabinLayout.version = expectedVersion;

    if (req.params.id != cabinLayout.layoutId) {
        return res.status(400).json({ message: "Invalid layout id in request body" });
    }

    try {
        await app.update(cabinLayout);
        return res.status(201).json(cabinLayout);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});

async function isLayoutValid(layout: CabinLayout): Promise<boolean> {
    if (layout.rows.find(row => row.seatGroups.length <= 1)) {
        return false;
    }

    let seatTypes = (await query('SELECT * FROM fleetops.seat_types')).rows;
    
    function getWidth(seatTypeId: string): number {
        return seatTypes.find(st => st.seat_type_id === seatTypeId)?.width_cm || 0;
    }

    function getPitch(seatTypeId: string): number {
        return seatTypes.find(st => st.seat_type_id === seatTypeId)?.pitch_cm || 0;
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