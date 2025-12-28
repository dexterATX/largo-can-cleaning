import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogPostContent from '@/components/pages/BlogPostContent'
import { generateBlogPostingSchema, generateBreadcrumbSchema, BUSINESS_INFO } from '@/lib/schema'

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
    title: 'Why Clean Trash Cans Matter for Health',
    excerpt: 'Discover the hidden health risks lurking in your dirty bins and why regular cleaning is essential for your family\'s wellbeing.',
    content: `
      <h2>The Hidden Dangers in Your Trash Can</h2>
      <p>Most homeowners don't think twice about their trash cans. They're just receptacles for waste, right? Wrong. Your garbage bins are breeding grounds for bacteria, viruses, and pests that can pose serious health risks to your family. Every week, food waste, liquids, and organic matter accumulate in your bins, creating the perfect environment for harmful pathogens to thrive.</p>

      <h3>What's Really Growing in There?</h3>
      <p>Studies have shown that the average trash can contains over 400 times more bacteria than a toilet seat. Common pathogens found include:</p>
      <ul>
        <li><strong>E. coli</strong> - Can cause severe stomach cramps and diarrhea</li>
        <li><strong>Salmonella</strong> - Leads to food poisoning symptoms</li>
        <li><strong>Listeria</strong> - Particularly dangerous for pregnant women</li>
        <li><strong>Mold spores</strong> - Can trigger allergies and respiratory issues</li>
      </ul>

      <h3>The Pest Problem</h3>
      <p>Dirty trash cans are a magnet for unwanted visitors. Flies, maggots, raccoons, and rodents are all attracted to the odors emanating from unclean bins. Once they establish a presence, these pests can spread diseases and damage your property. In Florida's warm, humid climate, these pest problems are amplified, making regular bin maintenance essential for every homeowner.</p>

      <h2>The Solution: Regular Professional Cleaning</h2>
      <p>While a quick rinse with the garden hose might seem like enough, it barely scratches the surface of what's needed to truly sanitize your bins. Professional trash can cleaning services use high-pressure, high-temperature water along with eco-friendly sanitizing solutions to eliminate 99.9% of bacteria and odors. Our 190°F water and commercial-grade sanitizers penetrate every surface of your bin, killing pathogens that household cleaning methods simply cannot reach.</p>

      <h3>Benefits of Professional Bin Cleaning:</h3>
      <ul>
        <li>Eliminates harmful bacteria and pathogens</li>
        <li>Removes stubborn odors at the source</li>
        <li>Prevents pest infestations</li>
        <li>Extends the life of your trash cans</li>
        <li>Keeps your outdoor space smelling fresh</li>
      </ul>

      <h3>Protecting Your Family's Health</h3>
      <p>Children and pets are particularly vulnerable to the health risks posed by dirty trash cans. Kids playing in the yard may touch bin handles or the ground near waste containers, transferring bacteria to their hands and faces. Pets are naturally curious about the smells coming from garbage bins and may lick or investigate them closely. Regular professional cleaning creates a safer environment for everyone in your household.</p>

      <p>Don't wait until the smell becomes unbearable or you spot maggots in your bin. Regular cleaning is the key to maintaining a healthy, pest-free home environment. Contact Largo Can Cleaning today for a free quote and take the first step toward cleaner, safer trash cans for your Pinellas County home.</p>
    `,
    category: 'health',
    categoryLabel: 'Health & Safety',
    readTime: 5,
    date: '2025-01-15',
    image: '/images/blog/clean-bins.jpg',
  },
  'diy-vs-professional-cleaning': {
    title: 'DIY vs Professional Bin Cleaning Compared',
    excerpt: 'We break down the costs, effectiveness, and time investment of both approaches to help you make the right choice.',
    content: `
      <h2>The DIY Approach</h2>
      <p>Many homeowners attempt to clean their trash cans themselves. While this shows initiative in maintaining a healthy home, it's important to understand what DIY cleaning actually involves and whether it delivers the results you need.</p>

      <h3>What You'll Need:</h3>
      <ul>
        <li>Garden hose with high-pressure nozzle</li>
        <li>Dish soap or cleaning solution</li>
        <li>Long-handled brush</li>
        <li>Rubber gloves</li>
        <li>Bleach or disinfectant</li>
      </ul>

      <h3>The Process:</h3>
      <p>DIY cleaning involves emptying the bin, rinsing it out, scrubbing with soap, applying disinfectant, and letting it dry. This process typically takes 30-45 minutes per bin and needs to be done every 2-4 weeks for optimal results. In Florida's humid climate, you may need to clean even more frequently to combat rapid bacterial growth.</p>

      <h3>The Hidden Costs:</h3>
      <ul>
        <li>Time investment: 1-2 hours monthly</li>
        <li>Water usage: 50+ gallons per cleaning</li>
        <li>Supplies: $30-50 annually</li>
        <li>Physical effort and potential back strain</li>
        <li>Runoff contaminating your lawn and driveway</li>
      </ul>

      <h2>Professional Bin Cleaning</h2>
      <p>Professional services like Largo Can Cleaning offer a completely different experience that transforms how you think about bin maintenance:</p>

      <h3>What's Included:</h3>
      <ul>
        <li>360° high-pressure, heated water cleaning (over 200°F)</li>
        <li>Eco-friendly sanitizing solution</li>
        <li>Complete water capture (zero runoff)</li>
        <li>Deodorizing treatment</li>
        <li>Scheduled service so you never have to think about it</li>
      </ul>

      <h3>The Real Difference:</h3>
      <p>Professional cleaning achieves a 99.9% bacteria elimination rate compared to roughly 60-70% with DIY methods. The high-temperature water and commercial-grade equipment make a significant difference in sanitation levels. Our truck-mounted systems generate consistent pressure and temperature that simply cannot be replicated with household equipment.</p>

      <h3>Environmental Considerations:</h3>
      <p>When you clean bins yourself, contaminated water flows directly onto your driveway, lawn, and eventually into storm drains. Professional services capture all wastewater and dispose of it properly, protecting local waterways and your landscaping from harmful runoff.</p>

      <h2>The Verdict</h2>
      <p>While DIY cleaning can work for occasional maintenance, professional cleaning offers superior results, saves you time, and is often more cost-effective when you factor in the value of your time and the supplies needed. For Pinellas County homeowners who want the convenience of clean bins without the hassle, professional service is the clear choice.</p>
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
      <p>Your outdoor trash cans are a beacon for pests. Here are 5 ways to prevent pests from invading your trash bins and turning your yard into their feeding ground. The combination of food waste, moisture, and shelter creates the perfect environment for everything from insects to mammals. In Florida's warm climate, pest activity is year-round, making prevention essential for every homeowner.</p>

      <h2>5 Proven Prevention Strategies</h2>

      <h3>1. Keep Lids Tightly Secured</h3>
      <p>It sounds simple, but many pest problems start with loose or damaged lids. Consider bins with locking mechanisms or use bungee cords to keep determined raccoons out. Inspect your lids regularly for cracks or warping that could allow pests to squeeze through.</p>

      <h3>2. Bag All Food Waste</h3>
      <p>Never throw loose food directly into your bin. Double-bag food waste when possible, especially meat and fish products. This contains odors and makes cleanup easier. Tie bags securely before placing them in the bin to minimize odor escape.</p>

      <h3>3. Rinse Food Containers</h3>
      <p>That yogurt container or pizza box still has residue that attracts pests. A quick rinse before disposal makes a big difference in reducing odors and pest attraction. This simple habit can significantly reduce the smell emanating from your bins between pickup days.</p>

      <h3>4. Schedule Regular Cleaning</h3>
      <p>Even with careful waste management, residue builds up over time. Regular professional cleaning eliminates the food particles and bacteria that attract pests. Our high-temperature cleaning process removes the organic matter that pests seek out.</p>

      <h3>5. Create a Pest-Proof Zone</h3>
      <p>Store bins on a hard surface (concrete or gravel), away from fences or structures that give pests easy access. Consider motion-activated lights or sprinklers as deterrents. Keeping bins away from landscaping also reduces hiding spots for rodents and other pests.</p>

      <h2>When Prevention Isn't Enough</h2>
      <p>If you're already dealing with a pest problem, cleaning becomes even more critical. Professional bin sanitization removes the scent markers that pests leave behind, breaking the cycle of attraction. Pests are territorial and leave pheromone trails that attract other pests to the same location. Our thorough cleaning eliminates these chemical signals, helping you start fresh.</p>

      <h3>Signs You Need Professional Intervention</h3>
      <p>If you notice persistent pest activity despite following prevention tips, it's time to call in professional help. Maggots, ant trails, rodent droppings near bins, or recurring raccoon visits all indicate that your bins need deep sanitization. Don't let pest problems escalate—contact Largo Can Cleaning for a thorough cleaning that addresses the root cause.</p>
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
      <p>The shocking truth about bacteria in your garbage bins is something every homeowner should know. We partnered with an independent laboratory to test bacteria levels in household trash cans across Pinellas County. The results were eye-opening and underscore why regular professional cleaning is so important for maintaining a healthy home environment.</p>

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
      <p>Every time you touch your trash can lid, you're potentially transferring these pathogens to your hands. From there, they can spread to door handles, countertops, and eventually food. This cross-contamination can happen without you even realizing it, turning a simple trip to the garbage into a health risk.</p>

      <h3>Children and Pets at Higher Risk</h3>
      <p>Kids playing in the yard and pets are more likely to come into contact with bins and the ground around them. Their developing or different immune systems make them more susceptible to illness from these pathogens. Children often touch surfaces and then put their hands near their mouths, creating a direct pathway for bacteria to enter their bodies.</p>

      <h3>Florida's Climate Accelerates Growth</h3>
      <p>Our warm, humid Florida climate creates ideal conditions for bacterial growth. What might take weeks to develop in cooler regions can happen in just days here in Pinellas County. This means bins need more frequent attention to maintain safe bacteria levels.</p>

      <h2>The Solution</h2>
      <p>Regular professional cleaning with high-temperature water and sanitizing agents eliminates 99.9% of these bacteria, creating a safer environment for your entire family. Our 190°F cleaning process doesn't just rinse away surface grime—it kills pathogens at the cellular level. Combined with EPA-approved sanitizing solutions, our cleaning provides lasting protection between services. Contact Largo Can Cleaning today to schedule your first cleaning and take control of the hidden health risks in your outdoor bins.</p>
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
      <p>How we clean your bins without harming the environment is a question we get often. At Largo Can Cleaning, we believe effective cleaning shouldn't come at the cost of our environment. That's why we've developed a cleaning system that's as green as it is powerful. Our eco-conscious approach protects Florida's beautiful waterways while delivering exceptional sanitation results.</p>

      <h2>100% Water Capture System</h2>
      <p>Our specially designed trucks feature complete water capture systems. Every drop of water used in cleaning your bins is captured, filtered, and properly disposed of. Zero runoff means:</p>
      <ul>
        <li>No contaminated water entering storm drains</li>
        <li>No chemicals flowing into local waterways</li>
        <li>No damage to your lawn or landscaping</li>
      </ul>
      <p>This is particularly important in Pinellas County, where our storm drains lead directly to Tampa Bay and the Gulf of Mexico. By capturing all wastewater, we protect the marine ecosystems that make our community special.</p>

      <h2>Biodegradable Cleaning Solutions</h2>
      <p>We use only EPA-approved, biodegradable sanitizing agents that break down naturally without leaving harmful residues. Our solutions are:</p>
      <ul>
        <li>Plant-based and non-toxic</li>
        <li>Safe for pets and children</li>
        <li>Free of harsh chemicals like chlorine bleach</li>
        <li>Effective against 99.9% of bacteria and viruses</li>
      </ul>

      <h2>Efficient Water Usage</h2>
      <p>Our high-pressure, high-temperature system uses significantly less water than DIY cleaning while achieving superior results. We typically use only 2-3 gallons per bin compared to 50+ gallons with a garden hose. This efficiency means less water waste and a smaller environmental footprint for each cleaning service we provide.</p>

      <h2>Supporting Local Environmental Initiatives</h2>
      <p>A portion of every cleaning goes toward local beach cleanup and environmental restoration projects. When you choose Largo Can Cleaning, you're supporting a cleaner community in multiple ways. We believe businesses have a responsibility to give back to the communities they serve, and environmental stewardship is central to our mission.</p>

      <h3>The Bigger Picture</h3>
      <p>By choosing professional bin cleaning with eco-friendly practices, you're making a positive choice for your family and the environment. Clean bins mean less pest attraction, which reduces the need for harmful pesticides. Proper wastewater disposal protects local waterways. And biodegradable solutions ensure no harmful chemicals linger in your outdoor spaces.</p>
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
      <p>This summer bin odor prevention guide will help you beat the heat and keep your outdoor space smelling fresh. Florida summers mean high temperatures and humidity—a perfect combination for accelerating bacteria growth and odor development in your trash bins. What might be tolerable in cooler months becomes unbearable in the summer heat. Temperatures in Pinellas County regularly exceed 90°F, turning your outdoor bins into virtual incubators for odor-causing bacteria.</p>

      <h2>Summer Odor Prevention Tips</h2>

      <h3>1. Increase Cleaning Frequency</h3>
      <p>If you're on a monthly cleaning schedule, consider switching to bi-weekly during summer months. The faster bacteria growth rate means odors develop more quickly. Many of our customers find that bi-weekly service from May through September keeps their bins fresh and pest-free.</p>

      <h3>2. Freeze Smelly Items</h3>
      <p>Meat trays, fish packaging, and other particularly odorous waste can be stored in the freezer until trash day. This prevents decay and odor development during the week. It's a simple habit that makes a significant difference in bin freshness.</p>

      <h3>3. Use Baking Soda</h3>
      <p>Sprinkle a cup of baking soda in the bottom of your bin after each cleaning. It helps absorb odors and moisture between trash pickups. This natural deodorizer is safe, inexpensive, and effective.</p>

      <h3>4. Keep Bins in the Shade</h3>
      <p>If possible, position your bins in a shaded area. Direct sunlight heats the contents and accelerates bacterial growth and odor production. Even partial shade can reduce bin temperatures significantly and slow odor development.</p>

      <h3>5. Consider a Bin Deodorizer</h3>
      <p>Our professional cleaning includes a long-lasting deodorizing treatment, but between cleanings, commercial bin deodorizers can help maintain freshness. Look for enzyme-based products that break down odor-causing organic matter rather than just masking smells.</p>

      <h2>The Professional Advantage</h2>
      <p>Our high-temperature cleaning (over 200°F) kills odor-causing bacteria at the source, providing longer-lasting freshness than any DIY method can achieve. The combination of extreme heat, high pressure, and professional-grade sanitizers eliminates the root cause of summer odors. Don't suffer through another smelly summer—contact Largo Can Cleaning for reliable service that keeps your outdoor spaces pleasant all season long.</p>
    `,
    category: 'tips',
    categoryLabel: 'Tips & How-To',
    readTime: 4,
    date: '2024-12-15',
    image: '/images/blog/summer-tips.jpg',
  },
  'cleancan-pro-expansion-2025': {
    title: 'Now Serving All of Pinellas County',
    excerpt: 'We\'re excited to announce our expanded coverage area, now serving more communities across the region.',
    content: `
      <h2>Growing to Serve You Better</h2>
      <p>We're thrilled to announce that Largo Can Cleaning is expanding our service area to cover all of Pinellas County! This means more residents can now enjoy the benefits of professional trash can cleaning. Our growth reflects the increasing demand for hygienic, convenient bin sanitization services throughout the Tampa Bay area.</p>

      <h2>New Service Areas</h2>
      <p>In addition to our existing coverage in Seminole and surrounding areas, we now serve:</p>
      <ul>
        <li>Largo (Primary)</li>
        <li>Seminole</li>
        <li>Clearwater</li>
        <li>Pinellas Park</li>
        <li>Safety Harbor</li>
        <li>Dunedin</li>
        <li>Palm Harbor</li>
        <li>Belleair</li>
      </ul>
      <p>Each of these communities will receive the same exceptional service that has made us a trusted name in trash can cleaning throughout Pinellas County.</p>

      <h2>Same Great Service, More Locations</h2>
      <p>Our expansion brings the same high-quality service you've come to expect:</p>
      <ul>
        <li>360° high-temperature cleaning</li>
        <li>Eco-friendly sanitizing solutions</li>
        <li>100% water capture</li>
        <li>Flexible scheduling options</li>
        <li>Satisfaction guaranteed</li>
      </ul>
      <p>We've invested in additional equipment and trained more team members to ensure we can maintain our high standards while serving a larger area. Every customer, whether in Largo or Palm Harbor, receives the same thorough, professional cleaning.</p>

      <h2>Why We're Expanding</h2>
      <p>The response from our existing customers has been overwhelming. Word-of-mouth referrals and positive reviews have driven demand in neighboring communities. We've heard from residents across Pinellas County who wanted access to professional bin cleaning but were previously outside our service area. This expansion is our response to that demand.</p>

      <h2>Expansion Celebration Special</h2>
      <p>To celebrate our growth, new customers in our expanded service areas can receive 20% off their first month of service. Use code WELCOME20 when booking online! This offer is our way of welcoming new communities to the Largo Can Cleaning family.</p>

      <h2>Thank You</h2>
      <p>This expansion wouldn't be possible without our amazing customers who have spread the word about our service. Thank you for your continued support and for helping us grow! We look forward to serving even more Pinellas County families and businesses with clean, sanitized trash cans.</p>
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
      <p>Why restaurants are switching to professional bin cleaning isn't a mystery—it's about health, safety, and smart business. Restaurants and food service businesses face unique challenges when it comes to waste management. High volumes of food waste, strict health codes, and customer perception all make bin cleanliness crucial for success in the competitive hospitality industry.</p>

      <h2>Health Code Compliance</h2>
      <p>Health inspectors pay close attention to waste storage areas. Common violations include:</p>
      <ul>
        <li>Dirty or foul-smelling dumpsters</li>
        <li>Visible pest activity around waste areas</li>
        <li>Improper waste containment</li>
        <li>Lack of regular cleaning documentation</li>
      </ul>
      <p>Professional cleaning with documented service records helps demonstrate compliance and avoid costly violations. We provide cleaning logs and documentation that can be presented during health inspections, showing your commitment to maintaining sanitary conditions.</p>

      <h2>Customer Perception</h2>
      <p>Many customers pass by your waste area when entering or exiting. A foul smell or visible pests can impact their perception of your establishment's overall cleanliness—even if your kitchen is spotless. First impressions matter, and a clean, odor-free exterior contributes to a positive dining experience from the moment customers arrive.</p>

      <h2>Pest Prevention</h2>
      <p>Commercial food waste is a magnet for pests. Regular professional cleaning breaks the cycle of attraction by eliminating food residue and the scent markers that draw pests to your location. For restaurants, pest issues can lead to health code violations, negative reviews, and even temporary closures. Prevention through regular cleaning is far more cost-effective than dealing with an infestation.</p>

      <h2>Cost-Effective Solution</h2>
      <p>When you factor in:</p>
      <ul>
        <li>Staff time spent on cleaning</li>
        <li>Potential health code violations</li>
        <li>Pest control costs</li>
        <li>Customer loss from negative perception</li>
      </ul>
      <p>Professional bin cleaning often pays for itself many times over. Your staff can focus on serving customers rather than scrubbing dumpsters, and you avoid the substantial costs associated with health violations or pest infestations.</p>

      <h2>Custom Commercial Plans</h2>
      <p>We offer tailored cleaning schedules for commercial clients, from weekly service for high-volume restaurants to bi-weekly plans for smaller establishments. Our commercial team understands the unique demands of food service operations and works around your schedule to minimize disruption. Contact us to discuss your specific needs and receive a customized quote for your Pinellas County business.</p>
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
  const imageUrl = post.image?.startsWith('http') ? post.image : `${BASE_URL}${post.image}`

  // Create short title for SEO (under 60 chars to avoid truncation)
  const shortTitle = (post.metaTitle || post.title).replace(/ \| .*$/, '').substring(0, 55)

  return {
    title: shortTitle,
    description: post.metaDescription || post.excerpt,
    keywords: post.metaKeywords?.join(', '),
    authors: [{ name: BUSINESS_INFO.name, url: BUSINESS_INFO.url }],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updatedAt || post.date,
      authors: [BUSINESS_INFO.name],
      section: post.categoryLabel || post.category,
      url: canonicalUrl,
      siteName: BUSINESS_INFO.name,
      locale: 'en_US',
      images: post.image ? [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: post.image ? [imageUrl] : [],
    },
    other: {
      'article:published_time': post.date,
      'article:modified_time': post.updatedAt || post.date,
      'article:author': BUSINESS_INFO.name,
      'article:section': post.categoryLabel || post.category,
    },
  }
}

// Helper function to estimate word count from HTML content
function estimateWordCount(htmlContent: string): number {
  // Strip HTML tags and count words
  const textContent = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return textContent.split(' ').filter(word => word.length > 0).length
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const data = await getPost(slug)

  if (!data?.post) {
    notFound()
  }

  const { post } = data
  const postUrl = `${BASE_URL}/blog/${slug}`
  const imageUrl = post.image?.startsWith('http') ? post.image : `${BASE_URL}${post.image}`
  const wordCount = estimateWordCount(post.content || '')

  // Generate enhanced BlogPosting schema
  const blogPostingSchema = generateBlogPostingSchema({
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    url: postUrl,
    image: imageUrl,
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    category: post.categoryLabel,
    readingTime: post.readTime,
    wordCount: wordCount,
    keywords: post.metaKeywords,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BlogPostContent post={data.post} related={data.related} />
    </>
  )
}
