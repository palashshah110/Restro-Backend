import app from "./api/index";
import { connectDatabase } from "./src/config/database";

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
  } catch (error) {
    console.error("❌ Failed to connect to DB", error);
    process.exit(1);
  }
})();
