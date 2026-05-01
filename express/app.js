import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

const citySchema = new mongoose.Schema({
    name: { type: String, required: true }
});

const City = mongoose.model('City', citySchema, 'cities');

app.get('/api/city', async (req, res, next) => {
    try {
        let { city } = req.query;

        // Перевірка, чи це взагалі рядок (захист від некоректних запитів)
        if (typeof city !== 'string' || !city.trim()) {
            return res.json({ cities: [] });
        }

        const searchText = city.trim();

        const escapedText = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const result = await City.find({
            name: { $regex: escapedText, $options: "i" }
        }).limit(10); 

        res.json({ cities: result.map(c => c.name) });
    } catch (error) {
        next(error); 
    }
});

app.use((req, res) => {
    res.status(404).json({ 
        message: "Маршрут не знайдено. Використовуйте GET /api/city?city=назва" 
    });
});

app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err.stack);
    res.status(500).json({ 
        error: 'Внутрішня помилка сервера. Спробуйте пізніше.' 
    });
});

if (!MONGO_URI) {
    console.error(' Помилка: MONGO_URI не знайдено в .env файлі!');
    process.exit(1);
}

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log(' MongoDB connected successfully');
        app.listen(PORT, () => {
            console.log(` Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error(' Database connection error:', err.message);
        process.exit(1);
    });