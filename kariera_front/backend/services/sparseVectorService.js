const fetch = require("node-fetch");
const SPARSE_SERVICE_URL =
  process.env.SPARSE_SERVICE_URL || "http://localhost:5000/jobs/sparse_vector";

async function getSparseVector(skills) {
  try {
    const skillsString = Array.isArray(skills)
      ? skills.join(" ")
      : skills;
    const response = await fetch(SPARSE_SERVICE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skills: skillsString }),
    });

    if (!response.ok) {
      throw new Error(`Sparse service error: ${response.statusText}`);
    }

    const data = await response.json();
    return data; 
  } catch (err) {
    console.error("Failed to fetch sparse vector:", err);
    throw err;
  }
}
module.exports = { getSparseVector };
