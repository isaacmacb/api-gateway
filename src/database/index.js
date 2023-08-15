import "dotenv/config";
import mongoose from 'mongoose';

const config = {
    url: "mongodb://root:secret@localhost:27018/develop?authSource=admin"
};

class Database {
    constructor() {
        this.connection = mongoose.connect(config.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
}

export default new Database();
