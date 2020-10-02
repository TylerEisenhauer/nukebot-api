import mongoose from 'mongoose'

export default (connectionString: string) => {
    const connect = () => {
        mongoose
            .connect(
                connectionString,
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useFindAndModify: false
                }
            )
            .then(() => {
                return console.info(`Successfully connected to ${connectionString}`);
            })
            .catch(error => {
                console.error('Error connecting to database: ', error);
            });
    };
    connect();

    mongoose.connection.on('disconnected', connect);
}