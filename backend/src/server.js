require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const careerRoutes = require('./routes/careerRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const matchRoutes = require('./routes/matchRoutes');
const skillGapRoutes = require('./routes/skillGapRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const assistantRoutes = require('./routes/assistantRoutes');

connectDB();

const app = express();
const PORT = 5000;

app.use(express.json());

app.get('/', (req, res)=>{
    res.send('FindMyPath backend is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/skill-gaps', skillGapRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/assistant', assistantRoutes);

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);   
});
