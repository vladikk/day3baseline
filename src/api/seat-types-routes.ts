import express from 'express';
import { query } from '../data-access/db';

export const router = express.Router();

router.get('/', async (_req, res) => {
    try {
        const result = await query('SELECT * FROM fleetops.seat_types');
        res.json(result.rows);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const result = await query('SELECT * FROM fleetops.seat_types WHERE seat_type_id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Seat type not found' });
        }

        return res.json(result.rows[0]);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { seat_type_id, type_name, width_cm, height_cm, pitch_cm, weight_kg, production_year, comfort_level, features, __version } = req.body;
        const result = await query(
            'INSERT INTO fleetops.seat_types(seat_type_id, type_name, width_cm, height_cm, pitch_cm, weight_kg, production_year, comfort_level, features, __version) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
            [seat_type_id, type_name, width_cm, height_cm, pitch_cm, weight_kg, production_year, comfort_level, features, __version]
        );
        return res.status(201).json(result.rows[0]);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});

router.put('/:seat_type_id', async (req, res) => {
    const { seat_type_id } = req.params;
    const { type_name, width_cm, height_cm, pitch_cm, weight_kg, production_year, comfort_level, features, __version } = req.body;
    const expectedVersion = parseInt(req.query.expectedVersion?.toString() || "");

    if (isNaN(expectedVersion)) {
        return res.status(400).json({ message: "Invalid or missing expectedVersion query parameter" });
    }

    try {
        const { rows } = await query(
            'UPDATE fleetops.seat_types SET type_name = $2, width_cm = $3, height_cm = $4, pitch_cm = $5, weight_kg = $6, production_year = $7, comfort_level = $8, features = $9, __version = __version + 1 WHERE seat_type_id = $1 AND __version = $10 RETURNING *',
            [seat_type_id, type_name, width_cm, height_cm, pitch_cm, weight_kg, production_year, comfort_level, features, expectedVersion]
        );
        if (rows.length > 0) {
            return res.json(rows[0]);
        } else {
            return res.status(409).json({ message: "Seat type not found or version mismatch" });
        }
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});
