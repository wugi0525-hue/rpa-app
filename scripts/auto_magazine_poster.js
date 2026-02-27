const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// 1. Initialize Firebase Admin SDK
// You need to generate a service account key from Firebase Console
// (Project Settings -> Service Accounts -> Generate new private key)
// Save it as 'serviceAccountKey.json' in this folder.
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
    console.error('ERROR: Missing serviceAccountKey.json');
    console.error('Please download it from Firebase Console -> Project Settings -> Service Accounts');
    process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// 2. Mock Data generation (To be replaced with NotebookLM MCP call)
// This simulates the LLM generating a blog post in Markdown format.
async function generateArticle(topic) {
    console.log(`Generating article for topic: "${topic}"...`);

    // TODO: Integrate actual LLM / NotebookLM API call here.
    // For now, returning dummy markdown content.
    const title = `Insight: ${topic}`;
    const content_md = `
# ${title}

Welcome to our deep dive into **${topic}**. This article provides a comprehensive overview designed for enterprise professionals looking to automate their workflows.

## Introduction
RPA (Robotic Process Automation) is revolutionizing the industry. When considering ${topic}, we must look at the core metrics.

### Key Benefits
* **Efficiency**: Reduces manual labor by 80%.
* **Accuracy**: Eliminates human error in repetitive tasks.
* **Scalability**: Easily deployable across multiple departments.

## Case Study Integration
In our recent deployment, utilizing ${topic} resulted in a positive ROI within 3 months.

> "Automation is not about replacing humans, but empowering them to do higher-value work."

## Conclusion
Adopting ${topic} is no longer optional for forward-thinking enterprises. Start your journey today.
  `;

    const slug = topic.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    return {
        title,
        content_md,
        slug,
        thumbnail_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', // Replace with dynamic image
        tags: ['RPA', 'Automation', 'Enterprise'],
        author: 'AI Operations',
        readTime: 5,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        published: true,
    };
}

// 3. Save to Firestore
async function uploadToFirestore(articleData) {
    try {
        const magazineRef = db.collection('magazines').doc(articleData.slug);
        await magazineRef.set(articleData);
        console.log(`Successfully uploaded article: ${articleData.title} (Slug: ${articleData.slug})`);
    } catch (error) {
        console.error('Error uploading to Firestore:', error);
    }
}

// 4. Main Execution Flow
async function main() {
    const args = process.argv.slice(2);
    let topic = args.join(' ');

    if (!topic) {
        topic = "The Future of RPA and AI Agents"; // Default topic
    }

    const article = await generateArticle(topic);
    await uploadToFirestore(article);
    console.log('Done.');
}

main().catch(console.error);
