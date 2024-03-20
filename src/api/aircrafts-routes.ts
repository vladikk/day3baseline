import express from 'express';
import { query } from '../data-access/db';

export const router = express.Router();

router.get('/', async (_req, res) => {
    try {
        const result = await query('SELECT * FROM fleetops.aircrafts');
        res.json(result.rows);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:model', async (req, res) => {
    try {
        const result = await query('SELECT * FROM fleetops.aircrafts WHERE model = $1', [req.params.model]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Aircraft model not found' });
        }

        return res.json(result.rows[0]);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { model, manufacturer, wingspan_m, cabin_width_m, cabin_height_m, cabin_length_m, cargo_capacity_mc, range_km, cruise_speed_m, engine_type, noise_level_epndb_min, noise_level_epndb_max, __version } = req.body;
        const result = await query(
            'INSERT INTO fleetops.aircrafts(model, manufacturer, wingspan_m, cabin_width_m, cabin_height_m, cabin_length_m, cargo_capacity_mc, range_km, cruise_speed_m, engine_type, noise_level_EPNdB_min, noise_level_EPNdB_max, __version) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
                                           [model, manufacturer, wingspan_m, cabin_width_m, cabin_height_m, cabin_length_m, cargo_capacity_mc, range_km, cruise_speed_m, engine_type, noise_level_epndb_min, noise_level_epndb_max, __version]
        );
        return res.status(201).json(result.rows[0]);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});

router.put('/:model', async (req, res) => {
    const { model } = req.params;
    const { manufacturer, wingspan_m, cabin_width_m, cabin_height_m, cabin_length_m, cargo_capacity_mc, range_km, cruise_speed_m, engine_type, noise_level_epndb_min, noise_level_epndb_max, __version } = req.body;
    const expectedVersion = parseInt(req.query.expectedVersion?.toString() || "");

    if (isNaN(expectedVersion)) {
        return res.status(400).json({ message: "Invalid or missing expectedVersion query parameter" });
    }

    try {
        const { rows } = await query(
            'UPDATE fleetops.aircrafts SET manufacturer = $2, wingspan_m = $3, cabin_width_m = $4, cabin_height_m = $5, cabin_length_m = $6, cargo_capacity_mc = $7, range_km = $8, cruise_speed_m = $9, engine_type = $10, noise_level_EPNdB_min = $11, noise_level_EPNdB_max = $12, __version = __version + 1 WHERE model = $1 AND __version = $13 RETURNING *',
            [model, manufacturer, wingspan_m, cabin_width_m, cabin_height_m, cabin_length_m, cargo_capacity_mc, range_km, cruise_speed_m, engine_type, noise_level_epndb_min, noise_level_epndb_max, expectedVersion]
        );
        if (rows.length > 0) {
            return res.json(rows[0]);
        } else {
            return res.status(409).json({ message: "Aircraft model not found or version mismatch" });
        }
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});
