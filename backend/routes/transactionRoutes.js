// const express = require("express");
// const multer = require("multer");
// const csv = require("csv-parser");
// const fs = require("fs");
// const authMiddleware = require("../middleware/authMiddleware");

// const router = express.Router();
// const pool = require("../config/db");

// // ==============================
// // 📦 MULTER CONFIG
// // ==============================
// const upload = multer({ dest: "uploads/" });

// // ==============================
// // 🧠 AUTO CATEGORIZATION
// // ==============================
// function categorize(description = "") {
//   const text = description.toLowerCase();

//   if (text.includes("swiggy") || text.includes("zomato")) return "Food";
//   if (text.includes("uber") || text.includes("ola")) return "Transport";
//   if (text.includes("amazon") || text.includes("flipkart")) return "Shopping";
//   if (text.includes("salary")) return "Income";

//   return "Others";
// }

// // ==============================
// // 🚀 UPLOAD CSV API
// // ==============================
// router.post(
//   "/upload",
//   authMiddleware,
//   upload.single("file"),
//   async (req, res) => {
//     try {
//       if (!req.file) {
//         return res.status(400).json({
//           success: false,
//           message: "No file uploaded",
//         });
//       }

//       const results = [];
//       const userId = req.user.id;

//       fs.createReadStream(req.file.path)
//         .pipe(csv())
//         .on("data", (row) => {
//           const description =
//             row.description || row.Description || "";

//           const date = row.date || row.Date || null;

//           const amount = parseFloat(row.amount || row.Amount || 0);

//           // category from CSV or auto detect
//           let category =
//             row.category || row.Category || categorize(description);

//           results.push({
//             date,
//             description,
//             amount,
//             category,
//           });
//         })
//         .on("end", async () => {
//           try {
//             for (let tx of results) {
              
//               // ✅ FIX: determine type
//               const type =
//                 tx.category === "Income" ? "income" : "expense";

//               await pool.query(
//                 `INSERT INTO transactions 
//                 (user_id, date, description, amount, category, type) 
//                 VALUES ($1, $2, $3, $4, $5, $6)`,
//                 [
//                   userId,
//                   tx.date,
//                   tx.description,
//                   Math.abs(tx.amount), // always positive
//                   tx.category,
//                   type,
//                 ]
//               );
//             }

//             fs.unlinkSync(req.file.path);

//             res.json({
//               success: true,
//               message: "Transactions uploaded successfully",
//               count: results.length,
//             });

//           } catch (error) {
//             console.error("❌ PROCESS ERROR:", error);
//             res.status(500).json({
//               success: false,
//               message: "Error processing transactions",
//             });
//           }
//         });

//     } catch (error) {
//       console.error("❌ UPLOAD ERROR:", error);
//       res.status(500).json({
//         success: false,
//         message: "Upload failed",
//       });
//     }
//   }
// );

// // ==============================
// // 📊 GET TRANSACTIONS
// // ==============================
// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const { search = "", category = "", sort = "desc" } = req.query;

//     let query = `
//       SELECT * FROM transactions
//       WHERE user_id = $1
//     `;

//     const values = [userId];

//     if (search) {
//       query += ` AND description ILIKE $${values.length + 1}`;
//       values.push(`%${search}%`);
//     }

//     if (category) {
//       query += ` AND category = $${values.length + 1}`;
//       values.push(category);
//     }

//     query += ` ORDER BY date ${sort === "asc" ? "ASC" : "DESC"}`;

//     const result = await pool.query(query, values);

//     res.json({
//       success: true,
//       count: result.rows.length,
//       data: result.rows,
//     });

//   } catch (error) {
//     console.error("❌ FETCH ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching transactions",
//     });
//   }
// });

// // ==============================
// // 📊 STATS
// // ==============================
// router.get("/stats", authMiddleware, async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const result = await pool.query(
//       `SELECT 
//         COUNT(*) as total_transactions,
//         SUM(amount) as net_total
//        FROM transactions
//        WHERE user_id = $1`,
//       [userId]
//     );

//     res.json({
//       success: true,
//       data: result.rows[0],
//     });

//   } catch (error) {
//     console.error("❌ STATS ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching stats",
//     });
//   }
// });

// module.exports = router;




const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const pool = require("../config/db");

// ==============================
// ✅ MULTER MEMORY STORAGE (FIX)
// ==============================
const upload = multer({ storage: multer.memoryStorage() });

// ==============================
// 🧠 AUTO CATEGORIZATION
// ==============================
function categorize(description = "") {
  const text = description.toLowerCase();

  if (text.includes("swiggy") || text.includes("zomato")) return "Food";
  if (text.includes("uber") || text.includes("ola")) return "Transport";
  if (text.includes("amazon") || text.includes("flipkart")) return "Shopping";
  if (text.includes("salary")) return "Income";

  return "Others";
}

// ==============================
// 🚀 UPLOAD CSV API (FIXED)
// ==============================
router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const results = [];
      const userId = req.user.id;

      // ✅ READ FROM MEMORY (NOT FILE SYSTEM)
      const stream = require("stream");
      const bufferStream = new stream.PassThrough();
      bufferStream.end(req.file.buffer);

      bufferStream
        .pipe(csv())
        .on("data", (row) => {
          const description =
            row.description || row.Description || "";

          const date = row.date || row.Date || null;

          const amount = parseFloat(row.amount || row.Amount || 0);

          let category =
            row.category || row.Category || categorize(description);

          results.push({
            date,
            description,
            amount,
            category,
          });
        })
        .on("end", async () => {
          try {
            for (let tx of results) {
              const type =
                tx.category === "Income" ? "income" : "expense";

              await pool.query(
                `INSERT INTO transactions 
                (user_id, date, description, amount, category, type) 
                VALUES ($1, $2, $3, $4, $5, $6)`,
                [
                  userId,
                  tx.date,
                  tx.description,
                  Math.abs(tx.amount),
                  tx.category,
                  type,
                ]
              );
            }

            res.json({
              success: true,
              message: "Transactions uploaded successfully",
              count: results.length,
            });

          } catch (error) {
            console.error("❌ PROCESS ERROR:", error);
            res.status(500).json({
              success: false,
              message: "Error processing transactions",
            });
          }
        });

    } catch (error) {
      console.error("❌ UPLOAD ERROR:", error);
      res.status(500).json({
        success: false,
        message: "Upload failed",
      });
    }
  }
);

// باقي routes same (no change)
module.exports = router;