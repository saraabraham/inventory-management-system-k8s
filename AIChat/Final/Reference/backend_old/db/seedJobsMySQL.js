import mysql from 'mysql2/promise';

async function seedJobs() {
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '021297bd',
        database: 'job_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    try {
        console.log("Clearing existing jobs table...");
        await pool.query('DELETE FROM jobs');

        const jobs = [
            {
                job_id: 1,
                company_id: 1,
                title: 'Senior Cloud Architect',
                description: 'Design and implement cloud infrastructure solutions.',
                location: 'Remote',
                type: 'Full-time',
                experience_level: 'Senior',
                salary_range: '$150k-$180k',
                requirements: ['AWS', 'Kubernetes', 'Terraform', 'Python', 'Go', 'Microservices'],
                benefits: ['Health Insurance', '401k', 'Remote Work'],
            },
            {
                job_id: 2,
                company_id: 2,
                title: 'Principal Machine Learning Engineer',
                description: 'Lead ML initiatives and deploy scalable ML solutions.',
                location: 'San Francisco, CA',
                type: 'Full-time',
                experience_level: 'Senior',
                salary_range: '$160k-$200k',
                requirements: ['Python', 'TensorFlow', 'PyTorch', 'C++', 'Distributed Systems', 'Statistical Modeling'],
                benefits: ['Stock Options', 'Health Insurance', 'Gym Membership'],
            },
            {
                job_id: 3,
                company_id: 3,
                title: 'Mid-level Full Stack Developer',
                description: 'Develop full stack applications with React and Node.js.',
                location: 'New York, NY',
                type: 'Full-time',
                experience_level: 'Mid-level',
                salary_range: '$90k-$120k',
                requirements: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'REST APIs'],
                benefits: ['Health Insurance', 'Paid Time Off'],
            },
            {
                job_id: 4,
                company_id: 4,
                title: 'Mid-level Backend API Developer',
                description: 'Build and maintain backend APIs with Java and Spring Boot.',
                location: 'Austin, TX',
                type: 'Full-time',
                experience_level: 'Mid-level',
                salary_range: '$95k-$125k',
                requirements: ['Java', 'Spring Boot', 'Kafka', 'PostgreSQL', 'Docker', 'API Design'],
                benefits: ['Health Insurance', '401k'],
            },
            {
                job_id: 5,
                company_id: 1,
                title: 'Mid-level Data Analyst',
                description: 'Analyze data and generate actionable insights.',
                location: 'Remote',
                type: 'Full-time',
                experience_level: 'Mid-level',
                salary_range: '$80k-$100k',
                requirements: ['SQL', 'Python', 'Pandas', 'Excel', 'Data Visualization'],
                benefits: ['Remote Work', 'Health Insurance'],
            },
            {
                job_id: 6,
                company_id: 2,
                title: 'Junior Frontend Web Developer',
                description: 'Develop user interfaces using HTML, CSS, and JavaScript.',
                location: 'Los Angeles, CA',
                type: 'Full-time',
                experience_level: 'Junior',
                salary_range: '$60k-$75k',
                requirements: ['HTML', 'CSS', 'JavaScript', 'Git', 'Figma'],
                benefits: ['Health Insurance', 'Paid Time Off'],
            },
            {
                job_id: 7,
                company_id: 3,
                title: 'Junior DevOps Intern (Conversion Track)',
                description: 'Assist in DevOps tasks and CI/CD pipeline management.',
                location: 'Remote',
                type: 'Internship',
                experience_level: 'Junior',
                salary_range: '$20/h',
                requirements: ['Linux', 'Bash Scripting', 'Docker', 'Basic Networking'],
                benefits: ['Remote Work'],
            }
        ];

        for (const job of jobs) {
            await pool.query(
                `INSERT INTO jobs 
                (job_id, company_id, title, description, location, type, experience_level, salary_range, requirements, benefits, posted_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
                [
                    job.job_id,
                    job.company_id,
                    job.title,
                    job.description,
                    job.location,
                    job.type,
                    job.experience_level,
                    job.salary_range,
                    JSON.stringify(job.requirements),
                    JSON.stringify(job.benefits)
                ]
            );
        }

        console.log("✅ Jobs table seeded successfully.");
        await pool.end();
    } catch (error) {
        console.error("❌ Error seeding jobs:", error);
        await pool.end();
    }
}

seedJobs();
