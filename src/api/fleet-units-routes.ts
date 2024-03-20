import express from 'express';
import { pool } from '../data-access/db';
import { FleetUnit } from '../model/fleet-unit';
import { FleetUnitsDAL } from '../data-access/fleet-units-dal';
import { FleetUnits } from '../app/fleet-units';

export const router = express.Router();

const dal = new FleetUnitsDAL(pool);
const api = new FleetUnits(dal);

router.get('/', async (_req, res) => {
    try {
        const result = await api.getAll();
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const result = await api.get(req.params.id);
        if (result === null) {
            return res.status(404).json({ message: 'Fleet unit not found' });
        }

        return res.json(result);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        let fleetUnit = req.body as FleetUnit;
        fleetUnit.version = 1;
        await api.create(fleetUnit);
        return res.status(201).json(fleetUnit);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const expectedVersion = parseInt(req.query.expectedVersion?.toString() || "");

    if (isNaN(expectedVersion)) {
        return res.status(400).json({ message: "Invalid or missing expectedVersion query parameter" });
    }

    let fleetUnit = req.body as FleetUnit;
    fleetUnit.version = expectedVersion;
    
    if (req.params.id != fleetUnit.tailNumber) {
        return res.status(400).json({ message: "Invalid tail number in request body" });
    }

    try {
        await api.update(fleetUnit);
        return res.status(201).json(fleetUnit);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});
