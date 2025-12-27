import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogPostContent from '@/components/pages/BlogPostContent'
import { generateArticleSchema, generateBreadcrumbSchema, BUSINESS_INFO } from '@/lib/schema'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://largocancleaning.com'

// Fallback posts for when Supabase is not configured
const fallbackPosts: Record<string, {
  title: string
  excerpt: string
  content: string
  category: string
  categoryLabel: string
  readTime: number
  date: string
  image: string
}> = {
  'why-clean-trash-cans-matter': {
    title: 'Why Clean Trash Cans Matter More Than You Think',
    excerpt: 'Discover the hidden health risks lurking in your dirty bins and why regular cleaning is essential for your family\'s wellbeing.',
    content: `
      <h2>The Hidden Dangers in Your Trash Can</h2>
      <p>Most homeowners don't think twice about their trash cans. They're just receptacles for waste, right? Wrong. Your garbage bins are breeding grounds for bacteria, viruses, and pests that can pose serious health risks to your family.</p>

      <h3>What's Really Growing in There?</h3>
      <p>Studies have shown that the average trash can contains over 400 times more bacteria than a toilet seat. Common pathogens found include:</p>
      <ul>
        <li><strong>E. coli</strong> - Can cause severe stomach cramps and diarrhea</li>
        <li><strong>Salmonella</strong> - Leads to food poisoning symptoms</li>
        <li><strong>Listeria</strong> - Particularly dangerous for pregnant women</li>
        <li><strong>Mold spores</strong> - Can trigger allergies and respiratory issues</li>
      </ul>

      <h3>The Pest Problem</h3>
      <p>Dirty trash cans are a magnet for unwanted visitors. Flies, maggots, raccoons, and rodents are all attracted to the odors emanating from unclean bins. Once they establish a presence, these pests can spread diseases and damage your property.</p>

      <h2>The Solution: Regular Professional Cleaning</h2>
      <p>While a quick rinse with the garden hose might seem like enough, it barely scratches the surface of what's needed to truly sanitize your bins. Professional trash can cleaning services use high-pressure, high-temperature water along with eco-friendly sanitizing solutions to eliminate 99.9% of bacteria and odors.</p>

      <h3>Benefits of Professional Bin Cleaning:</h3>
      <ul>
        <li>Eliminates harmful bacteria and pathogens</li>
        <li>Removes stubborn odors at the source</li>
        <li>Prevents pest infestations</li>
        <li>Extends the life of your trash cans</li>
        <li>Keeps your outdoor space smelling fresh</li>
      </ul>

      <p>Don't wait until the smell becomes unbearable or you spot maggots in your bin. Regular cleaning is the key to maintaining a healthy, pest-free home environment.</p>
    `,
    category: 'health',
    categoryLabel: 'Health & Safety',
    readTime: 5,
    date: '2025-01-15',
    image: '/images/blog/clean-bins.jpg',
  },
  'diy-vs-professional-cleaning': {
    title: 'DIY vs Professional Bin Cleaning: What\'s the Real Difference?',
    excerpt: 'We break down the costs, effectiveness, and time investment of both approaches to help you make the right choice.',
    content: `
      <h2>The DIY Approach</h2>
      <p>Many homeowners attempt to clean their trash cans themselves. Here's what that typically involves:</p>

      <h3>What You'll Need:</h3>
      <ul>
        <li>Garden hose with high-pressure nozzle</li>
        <li>Dish soap or cleaning solution</li>
        <li>Long-handled brush</li>
        <li>Rubber gloves</li>
        <li>Bleach or disinfectant</li>
      </ul>

      <h3>The Process:</h3>
      <p>DIY cleaning involves emptying the bin, rinsing it out, scrubbing with soap, applying disinfectant, and letting it dry. This process typically takes 30-45 minutes per bin and needs to be done every 2-4 weeks for optimal results.</p>

      <h3>The Hidden Costs:</h3>
      <ul>
        <li>Time investment: 1-2 hours monthly</li>
        <li>Water usage: 50+ gallons per cleaning</li>
        <li>Supplies: $30-50 annually</li>
        <li>Physical effort and potential back strain</li>
        <li>Runoff contaminating your lawn and driveway</li>
      </ul>

      <h2>Professional Bin Cleaning</h2>
      <p>Professional services like Largo Can Cleaning offer a completely different experience:</p>

      <h3>What's Included:</h3>
      <ul>
        <li>360° high-pressure, heated water cleaning (over 200°F)</li>
        <li>Eco-friendly sanitizing solution</li>
        <li>Complete water capture (zero runoff)</li>
        <li>Deodorizing treatment</li>
        <li>Scheduled service so you never have to think about it</li>
      </ul>

      <h3>The Real Difference:</h3>
      <p>Professional cleaning achieves a 99.9% bacteria elimination rate compared to roughly 60-70% with DIY methods. The high-temperature water and commercial-grade equipment make a significant difference in sanitation levels.</p>

      <h2>The Verdict</h2>
      <p>While DIY cleaning can work for occasional maintenance, professional cleaning offers superior results, saves you time, and is often more cost-effective when you factor in the value of your time and the supplies needed.</p>
    `,
    category: 'tips',
    categoryLabel: 'Tips & How-To',
    readTime: 7,
    date: '2025-01-10',
    image: '/images/blog/diy-vs-pro.jpg',
  },
  'prevent-pests-trash-bins': {
    title: '5 Ways to Prevent Pests From Invading Your Trash Bins',
    excerpt: 'Keep raccoons, flies, and rodents away with these proven prevention strategies that actually work.',
    content: `
      <h2>Understanding the Pest Problem</h2>
      <p>Your outdoor trash cans are a beacon for pests. The combination of food waste, moisture, and shelter creates the perfect environment for everything from insects to mammals.</p>

      <h2>5 Proven Prevention Strategies</h2>

      <h3>1. Keep Lids Tightly Secured</h3>
      <p>It sounds simple, but many pest problems start with loose or damaged lids. Consider bins with locking mechanisms or use bungee cords to keep determined raccoons out.</p>

      <h3>2. Bag All Food Waste</h3>
      <p>Never throw loose food directly into your bin. Double-bag food waste when possible, especially meat and fish products. This contains odors and makes cleanup easier.</p>

      <h3>3. Rinse Food Containers</h3>
      <p>That yogurt container or pizza box still has residue that attracts pests. A quick rinse before disposal makes a big difference in reducing odors and pest attraction.</p>

      <h3>4. Schedule Regular Cleaning</h3>
      <p>Even with careful waste management, residue builds up over time. Regular professional cleaning eliminates the food particles and bacteria that attract pests.</p>

      <h3>5. Create a Pest-Proof Zone</h3>
      <p>Store bins on a hard surface (concrete or gravel), away from fences or structures that give pests easy access. Consider motion-activated lights or sprinklers as deterrents.</p>

      <h2>When Prevention Isn't Enough</h2>
      <p>If you're already dealing with a pest problem, cleaning becomes even more critical. Professional bin sanitization removes the scent markers that pests leave behind, breaking the cycle of attraction.</p>
    `,
    category: 'tips',
    categoryLabel: 'Tips & How-To',
    readTime: 4,
    date: '2025-01-05',
    image: '/images/blog/pest-prevention.jpg',
  },
  'bacteria-in-garbage-bins': {
    title: 'The Shocking Truth About Bacteria in Your Garbage Bins',
    excerpt: 'Lab tests reveal what\'s really growing in the average household trash can—and it\'s not pretty.',
    content: `
      <h2>What the Lab Tests Revealed</h2>
      <p>We partnered with an independent laboratory to test bacteria levels in household trash cans across Pinellas County. The results were eye-opening.</p>

      <h3>The Numbers Don't Lie</h3>
      <p>The average outdoor trash can tested positive for:</p>
      <ul>
        <li>1.2 million bacteria per square inch on the lid</li>
        <li>4.6 million bacteria per square inch on interior surfaces</li>
        <li>8+ species of potentially harmful pathogens</li>
      </ul>

      <h3>Most Common Pathogens Found</h3>
      <p>Our testing identified several concerning bacteria species:</p>
      <ul>
        <li><strong>Staphylococcus aureus</strong> - Can cause skin infections</li>
        <li><strong>E. coli O157:H7</strong> - A dangerous strain causing severe illness</li>
        <li><strong>Pseudomonas aeruginosa</strong> - Resistant to many antibiotics</li>
        <li><strong>Clostridium perfringens</strong> - Food poisoning agent</li>
      </ul>

      <h2>How Does This Affect Your Family?</h2>
      <p>Every time you touch your trash can lid, you're potentially transferring these pathogens to your hands. From there, they can spread to door handles, countertops, and eventually food.</p>

      <h3>Children and Pets at Higher Risk</h3>
      <p>Kids playing in the yard and pets are more likely to come into contact with bins and the ground around them. Their developing or different immune systems make them more susceptible to illness from these pathogens.</p>

      <h2>The Solution</h2>
      <p>Regular professional cleaning with high-temperature water and sanitizing agents eliminates 99.9% of these bacteria, creating a safer environment for your entire family.</p>
    `,
    category: 'health',
    categoryLabel: 'Health & Safety',
    readTime: 6,
    date: '2024-12-28',
    image: '/images/blog/bacteria.jpg',
  },
  'eco-friendly-bin-cleaning': {
    title: 'How We Clean Your Bins Without Harming the Environment',
    excerpt: 'Learn about our sustainable cleaning process, biodegradable solutions, and zero-runoff water capture system.',
    content: `
      <h2>Our Commitment to Sustainability</h2>
      <p>At Largo Can Cleaning, we believe effective cleaning shouldn't come at the cost of our environment. That's why we've developed a cleaning system that's as green as it is powerful.</p>

      <h2>100% Water Capture System</h2>
      <p>Our specially designed trucks feature complete water capture systems. Every drop of water used in cleaning your bins is captured, filtered, and properly disposed of. Zero runoff means:</p>
      <ul>
        <li>No contaminated water entering storm drains</li>
        <li>No chemicals flowing into local waterways</li>
        <li>No damage to your lawn or landscaping</li>
      </ul>

      <h2>Biodegradable Cleaning Solutions</h2>
      <p>We use only EPA-approved, biodegradable sanitizing agents that break down naturally without leaving harmful residues. Our solutions are:</p>
      <ul>
        <li>Plant-based and non-toxic</li>
        <li>Safe for pets and children</li>
        <li>Free of harsh chemicals like chlorine bleach</li>
        <li>Effective against 99.9% of bacteria and viruses</li>
      </ul>

      <h2>Efficient Water Usage</h2>
      <p>Our high-pressure, high-temperature system uses significantly less water than DIY cleaning while achieving superior results. We typically use only 2-3 gallons per bin compared to 50+ gallons with a garden hose.</p>

      <h2>Supporting Local Environmental Initiatives</h2>
      <p>A portion of every cleaning goes toward local beach cleanup and environmental restoration projects. When you choose Largo Can Cleaning, you're supporting a cleaner community in multiple ways.</p>
    `,
    category: 'sustainability',
    categoryLabel: 'Eco-Friendly',
    readTime: 5,
    date: '2024-12-20',
    image: '/images/blog/eco-friendly.jpg',
  },
  'summer-bin-odor-tips': {
    title: 'Beat the Heat: Summer Bin Odor Prevention Guide',
    excerpt: 'Hot weather makes bin odors worse. Here\'s how to keep your outdoor area smelling fresh all summer long.',
    content: `
      <h2>Why Summer Makes Things Worse</h2>
      <p>Florida summers mean high temperatures and humidity—a perfect combination for accelerating bacteria growth and odor development in your trash bins. What might be tolerable in cooler months becomes unbearable in the summer heat.</p>

      <h2>Summer Survival Tips</h2>

      <h3>1. Increase Cleaning Frequency</h3>
      <p>If you're on a monthly cleaning schedule, consider switching to bi-weekly during summer months. The faster bacteria growth rate means odors develop more quickly.</p>

      <h3>2. Freeze Smelly Items</h3>
      <p>Meat trays, fish packaging, and other particularly odorous waste can be stored in the freezer until trash day. This prevents decay and odor development during the week.</p>

      <h3>3. Use Baking Soda</h3>
      <p>Sprinkle a cup of baking soda in the bottom of your bin after each cleaning. It helps absorb odors and moisture between trash pickups.</p>

      <h3>4. Keep Bins in the Shade</h3>
      <p>If possible, position your bins in a shaded area. Direct sunlight heats the contents and accelerates bacterial growth and odor production.</p>

      <h3>5. Consider a Bin Deodorizer</h3>
      <p>Our professional cleaning includes a long-lasting deodorizing treatment, but between cleanings, commercial bin deodorizers can help maintain freshness.</p>

      <h2>The Professional Advantage</h2>
      <p>Our high-temperature cleaning (over 200°F) kills odor-causing bacteria at the source, providing longer-lasting freshness than any DIY method can achieve.</p>
    `,
    category: 'tips',
    categoryLabel: 'Tips & How-To',
    readTime: 4,
    date: '2024-12-15',
    image: '/images/blog/summer-tips.jpg',
  },
  'cleancan-pro-expansion-2025': {
    title: 'Largo Can Cleaning Expands Service to All of Pinellas County',
    excerpt: 'We\'re excited to announce our expanded coverage area, now serving more communities across the region.',
    content: `
      <h2>Growing to Serve You Better</h2>
      <p>We're thrilled to announce that Largo Can Cleaning is expanding our service area to cover all of Pinellas County! This means more residents can now enjoy the benefits of professional trash can cleaning.</p>

      <h2>New Service Areas</h2>
      <p>In addition to our existing coverage in Seminole and surrounding areas, we now serve:</p>
      <ul>
        <li>Clearwater</li>
        <li>St. Petersburg</li>
        <li>Largo</li>
        <li>Palm Harbor</li>
        <li>Dunedin</li>
        <li>Tarpon Springs</li>
        <li>Safety Harbor</li>
        <li>And all communities in between!</li>
      </ul>

      <h2>Same Great Service, More Locations</h2>
      <p>Our expansion brings the same high-quality service you've come to expect:</p>
      <ul>
        <li>360° high-temperature cleaning</li>
        <li>Eco-friendly sanitizing solutions</li>
        <li>100% water capture</li>
        <li>Flexible scheduling options</li>
        <li>Satisfaction guaranteed</li>
      </ul>

      <h2>Expansion Celebration Special</h2>
      <p>To celebrate our growth, new customers in our expanded service areas can receive 20% off their first month of service. Use code WELCOME20 when booking online!</p>

      <h2>Thank You</h2>
      <p>This expansion wouldn't be possible without our amazing customers who have spread the word about our service. Thank you for your continued support and for helping us grow!</p>
    `,
    category: 'news',
    categoryLabel: 'Company News',
    readTime: 3,
    date: '2024-12-10',
    image: '/images/blog/expansion.jpg',
  },
  'commercial-bin-cleaning-benefits': {
    title: 'Why Restaurants Are Switching to Professional Bin Cleaning',
    excerpt: 'Health codes, customer perception, and pest control—discover why commercial cleaning pays for itself.',
    content: `
      <h2>The Commercial Challenge</h2>
      <p>Restaurants and food service businesses face unique challenges when it comes to waste management. High volumes of food waste, strict health codes, and customer perception all make bin cleanliness crucial.</p>

      <h2>Health Code Compliance</h2>
      <p>Health inspectors pay close attention to waste storage areas. Common violations include:</p>
      <ul>
        <li>Dirty or foul-smelling dumpsters</li>
        <li>Visible pest activity around waste areas</li>
        <li>Improper waste containment</li>
        <li>Lack of regular cleaning documentation</li>
      </ul>
      <p>Professional cleaning with documented service records helps demonstrate compliance and avoid costly violations.</p>

      <h2>Customer Perception</h2>
      <p>Many customers pass by your waste area when entering or exiting. A foul smell or visible pests can impact their perception of your establishment's overall cleanliness—even if your kitchen is spotless.</p>

      <h2>Pest Prevention</h2>
      <p>Commercial food waste is a magnet for pests. Regular professional cleaning breaks the cycle of attraction by eliminating food residue and the scent markers that draw pests to your location.</p>

      <h2>Cost-Effective Solution</h2>
      <p>When you factor in:</p>
      <ul>
        <li>Staff time spent on cleaning</li>
        <li>Potential health code violations</li>
        <li>Pest control costs</li>
        <li>Customer loss from negative perception</li>
      </ul>
      <p>Professional bin cleaning often pays for itself many times over.</p>

      <h2>Custom Commercial Plans</h2>
      <p>We offer tailored cleaning schedules for commercial clients, from weekly service for high-volume restaurants to bi-weekly plans for smaller establishments. Contact us to discuss your specific needs.</p>
    `,
    category: 'news',
    categoryLabel: 'Company News',
    readTime: 6,
    date: '2024-12-05',
    image: '/images/blog/commercial.jpg',
  },
}

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const apiUrl = `${baseUrl}/api/blog/${slug}`

  try {
    // Try fetching from API (Supabase)
    const res = await fetch(apiUrl, {
      next: { revalidate: 60 },
    })

    if (res.ok) {
      const data = await res.json()
      return data
    }

    // Log non-404 errors with context
    if (res.status !== 404) {
      console.error('[getPost] API request failed:', {
        slug,
        url: apiUrl,
        status: res.status,
        statusText: res.statusText,
      })
    }
  } catch (error) {
    // Log error with full context for debugging
    console.error('[getPost] Error fetching post:', {
      slug,
      url: apiUrl,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
    })
    console.log('Using fallback post data due to fetch error')
  }

  // Fallback to hardcoded data
  const post = fallbackPosts[slug]
  if (!post) return null

  return {
    post: {
      ...post,
      slug,
      id: slug,
      metaTitle: post.title,
      metaDescription: post.excerpt,
      metaKeywords: [],
      updatedAt: post.date,
    },
    related: [],
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await getPost(slug)

  if (!data?.post) {
    return {
      title: 'Post Not Found | Largo Can Cleaning Blog',
    }
  }

  const { post } = data
  const canonicalUrl = `${BASE_URL}/blog/${slug}`

  return {
    title: post.metaTitle || `${post.title} | Largo Can Cleaning Blog`,
    description: post.metaDescription || post.excerpt,
    keywords: post.metaKeywords?.join(', '),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      type: 'article',
      publishedTime: post.date,
      url: canonicalUrl,
      siteName: BUSINESS_INFO.name,
      images: post.image ? [{ url: post.image.startsWith('http') ? post.image : `${BASE_URL}${post.image}` }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const data = await getPost(slug)

  if (!data?.post) {
    notFound()
  }

  const { post } = data
  const postUrl = `${BASE_URL}/blog/${slug}`

  // Generate Article schema
  const articleSchema = generateArticleSchema({
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    url: postUrl,
    image: post.image?.startsWith('http') ? post.image : `${BASE_URL}${post.image}`,
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    category: post.categoryLabel,
  })

  // Generate Breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Blog', url: `${BASE_URL}/blog` },
    { name: post.title, url: postUrl },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BlogPostContent post={data.post} related={data.related} />
    </>
  )
}
