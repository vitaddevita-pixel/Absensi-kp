export const dummyUser = {
    id: 1,
    user_is: "admin",
    name: "admin absensi",
    token: "123"
};

export const loginDummy = (userId, password) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (userId === "admin" && password === "123") {
                resolve({
                    status: 200,
                    data: dummyUser,
                });
            } else {
                reject({
                    status: 401,
                    message: "User ID atau password salah",
                });
            }
        }, 800);
    });
};