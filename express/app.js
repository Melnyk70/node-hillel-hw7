import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Task 04: Підключення до бази даних
// Назва бази: hillel_homework, Колекція: cities
const mongoURI = 'mongodb://127.0.0.1:27017/hillel_homework';

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Task 04: Схема та модель
const citySchema = new mongoose.Schema({
    name: String
});

const City = mongoose.model('City', citySchema, 'cities');

// Task 05: Роут для пошуку міст
app.get('/api/city', async (req, res) => {
    try {
        const searchText = req.query.city;
        
        if (!searchText) {
            return res.json({ cities: [] });
        }

        // Пошук через regex (i - ігнорування регістру)
        const result = await City.find({
            name: {
                $regex: searchText,
                $options: "i"
            }
        });

        // Форматування відповіді: масив рядків (назв міст)
        const cityNames = result.map(item => item.name);

        res.json({ cities: cityNames });
    } catch (error) {
        console.error('Error during search:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
