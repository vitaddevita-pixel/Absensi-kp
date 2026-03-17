export const loginUser = async (userId, token ) => {
    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: String(userId),
                token: String(token)
            }),
        });

        const text = await response.text();

        let data;
        try {
            data = text ? JSON.parse(text) : {};
        } catch (e) {
            if (text.includes("<doctype html>")) {
                throw new error("Server Backend (Cloudflare sedang bermasalah");
            }
            data = {message: text}
        }

        if (!response.ok) {
            if (response.status === 530 || response.status === 404) {
                throw new Error("Koneksi terputus");
            }
            throw new Error(data.message || "Login gagal (status: ${response.status})");
        }
        return data;
    } catch (error) {
        console.error("Auth Service Error: ", error);
        throw error;
    }
    
};