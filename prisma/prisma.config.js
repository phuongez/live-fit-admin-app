import { defineConfig } from "@prisma/config";

export default defineConfig({
    seed: {

        // Nếu seed bằng JS thì đổi thành:
        run: "node prisma/seed.js"
    },
});
