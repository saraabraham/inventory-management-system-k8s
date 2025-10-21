// db/database.js
import mysql from 'mysql2/promise';

class JobDatabase {
    constructor() {
        // MySQL connection pool configuration
        this.pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: '021297bd',
            database: 'job_db',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        console.log("Database pool initialized.");
    }

    /**
     * Find jobs matching candidate skills and experience level
     * @param {Array<string>} skills
     * @param {string} experienceLevel
     * @returns {Promise<Array<Object>>}
     */
    async findJobs(skills, experienceLevel) {
        if (!skills || skills.length === 0) {
            // No skills provided, just filter by experience level
            const [rows] = await this.pool.execute(
                'SELECT j.*, c.name AS company FROM jobs j JOIN companies c ON j.company_id = c.company_id WHERE j.experience_level = ?',
                [experienceLevel]
            );
            return this._formatRows(rows);
        }

        // Build JSON_CONTAINS conditions for each skill
        const queryConditions = [];
        const params = [experienceLevel];
        for (const skill of skills) {
            queryConditions.push('JSON_CONTAINS(j.requirements, ?)');
            params.push(`"${skill}"`); // skill must be wrapped in quotes to be valid JSON
        }

        const query = `
            SELECT j.*, c.name AS company
            FROM jobs j
            JOIN companies c ON j.company_id = c.company_id
            WHERE j.experience_level = ?
            AND (${queryConditions.join(' OR ')})
        `;

        try {
            const [rows] = await this.pool.execute(query, params);
            return this._formatRows(rows);
        } catch (err) {
            console.error('MySQL Job Search Error:', err);
            return [];
        }
    }

    /**
     * Parse JSON fields safely
     * @param {Array<Object>} rows
     * @returns {Array<Object>}
     */
    _formatRows(rows) {
        return rows.map(row => {
            const parseJsonField = (value, fieldName, rowId) => {
                if (!value) return [];
                if (typeof value === 'string') {
                    try {
                        return JSON.parse(value);
                    } catch (e) {
                        console.warn(`WARN: Failed to parse ${fieldName} for job ID ${rowId}, fallback to split.`);
                        return value.split(',').map(s => s.trim());
                    }
                }
                // Already JSON object/array
                return value;
            };

            return {
                ...row,
                requirements: parseJsonField(row.requirements, 'requirements', row.job_id),
                benefits: parseJsonField(row.benefits, 'benefits', row.job_id),
            };
        });
    }
}

export { JobDatabase };
