const mongoose = require("mongoose");
const Course = require("./models/Course");

const MONGO_URI = "mongodb://mohammedsahal1243:eG6xw83Hh2PTPkxz@ac-hyz52xx-shard-00-00.l98fjlz.mongodb.net:27017,ac-hyz52xx-shard-00-01.l98fjlz.mongodb.net:27017,ac-hyz52xx-shard-00-02.l98fjlz.mongodb.net:27017/?authSource=admin&replicaSet=atlas-117704-shard-0&ssl=true";

const categories = [
  { id: "vlsi", label: "VLSI", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60", price: 999 },
  { id: "python-programming", label: "Introduction to Python", image: "https://images.unsplash.com/photo-1526379095098-d400fd0bfce8?w=800&auto=format&fit=crop&q=60", price: 888 },
  { id: "embedded-software", label: "Embedded Software", image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&auto=format&fit=crop&q=60", price: 799 },
  { id: "data-science", label: "Data Science", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60", price: 1299 },
  { id: "devops", label: "DevOps", image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=60", price: 1199 },
  { id: "cyber-security", label: "Cyber Security", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60", price: 999 },
  { id: "frontend-development", label: "Front End Development", image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&auto=format&fit=crop&q=60", price: 888 },
  { id: "fullstack-development", label: "Full Stack Development", image: "https://images.unsplash.com/photo-1627398225081-249e4f1dc2c2?w=800&auto=format&fit=crop&q=60", price: 1499 },
  { id: "ai-data-engineer", label: "AI Data Engineer", image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60", price: 1299 },
  { id: "web-development", label: "Web Development", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60", price: 799 },
  { id: "basic-cpp-programming", label: "Basic C++ Programming", image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format&fit=crop&q=60", price: 888 },
  { id: "cloud-computing", label: "Cloud Computing", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60", price: 999 }
];

const sampleCourses = categories.map((cat, index) => ({
  instructorId: "instructor_seed",
  instructorName: "John Doe",
  date: new Date(),
  title: `Mastering ${cat.label}`,
  category: cat.id,
  level: index % 2 === 0 ? "beginner" : "advanced",
  primaryLanguage: "english",
  subtitle: `Learn ${cat.label} from the ground up.`,
  description: `This is a comprehensive and structured course on ${cat.label}. It covers everything you need to know from basics to advanced real-world concepts.`,
  image: cat.image,
  pricing: cat.price,
  objectives: `Understand core concepts of ${cat.label},Build real-world projects,Prepare for industry roles`,
  welcomeMessage: "Welcome to the course! I am excited to have you here.",
  isPublised: true,
  duration: "10 hours",
  curriculum: [
    { title: "Introduction and Setup", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", freePreview: true },
    { title: "Core Concepts", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", freePreview: false },
    { title: "Advanced Techniques", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", freePreview: false }
  ]
}));

mongoose.connect(MONGO_URI, { family: 4 })
  .then(async () => {
    console.log("Connected to MongoDB...");
    // Remove ALL previous course data
    await Course.deleteMany({});
    console.log("Cleared ALL old course data from the database.");
    
    await Course.insertMany(sampleCourses);
    console.log(`Successfully inserted ${sampleCourses.length} sample courses!`);
    mongoose.connection.close();
  })
  .catch(err => {
    console.error("Connection error:", err);
  });
