import express from 'express';
import bodyParser from 'body-parser';
import { router as seatTypesRouter } from './api/seat-types-routes';
import { router as aircraftTypesRouter } from './api/aircrafts-routes';
import { router as fleetUnitsRouter } from './api/fleet-units-routes'
import { router as cabinLayoutsRouter } from './api/cabin-layouts-routes'

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/seat-types', seatTypesRouter);
app.use('/aircrafts', aircraftTypesRouter);
app.use('/fleet-units', fleetUnitsRouter);
app.use('/cabin-layouts', cabinLayoutsRouter);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});