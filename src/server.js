 import 'dotenv/config'
 import app from './app'


const PORT = 3031;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
