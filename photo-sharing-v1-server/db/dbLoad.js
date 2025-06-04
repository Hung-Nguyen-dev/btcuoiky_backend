const mongoose = require('mongoose');
const models = require('./models');
const dbConnect = require('./dbConnect');
const User = require('./userModel');
const Photo = require('./photoModel');
const SchemaInfo = require('./schemaInfo');

async function loadData() {
    try {
        await dbConnect();
        const users = models.userListModel();

        await User.insertMany(users);

        const photos = [];
        for (const user of users) {
            const userPhotos = models.photoOfUserModel(user._id);
            photos.push(...userPhotos);
        }
        await Photo.insertMany(photos);

        const schemaInfo = models.schemaInfo();
        await SchemaInfo.create(schemaInfo);

    } catch (error) {
        console.error('Lỗi khi load dữ liệu:', error);
    } finally {
        await mongoose.disconnect();
    }
}

loadData();
