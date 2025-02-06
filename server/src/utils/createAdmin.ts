import User from "../models/User";

const createAdmin = async () => {
    const adminExists = await User.findOne({ role: "admin" });

    if (!adminExists) {
        const admin = new User({
            username: process.env.ADMIN_USERNAME,
            password: process.env.ADMIN_PASSWORD,
            role: "admin"
        });

        await admin.save();
        console.log("Admin user created");
    } else {
        console.log("Admin user already exists");
    }
};

export default createAdmin