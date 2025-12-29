// Photo Collections/Sets with detailed information
export const photoCollections = [
  {
    id: 'wedding-sarah-james',
    title: 'Sarah & James Wedding',
    category: 'wedding',
    date: '2024-06-15',
    location: 'Nairobi, Kenya',
    description: 'A beautiful outdoor ceremony at the Karura Forest. Sarah and James celebrated their love surrounded by nature and their closest friends and family. The day was filled with emotional moments, from the first look to the sunset reception.',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=85',
    collaborators: [
      { name: 'Jane Mwangi', role: 'Second Photographer' },
      { name: 'David Ochieng', role: 'Videographer' }
    ],
    photos: [
      {
        id: 'sw-1',
        src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=85',
        srcLarge: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=90',
        caption: 'The first look - a moment of pure emotion'
      },
      {
        id: 'sw-2',
        src: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=85',
        srcLarge: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1600&q=90',
        caption: 'Dancing under the stars'
      },
      {
        id: 'sw-3',
        src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=85',
        srcLarge: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1600&q=90',
        caption: 'The magical first kiss as husband and wife'
      }
    ],
    comments: [
      { id: 1, author: 'Sarah K.', text: 'These photos are absolutely stunning! You captured every emotion perfectly.', date: '2024-06-20' },
      { id: 2, author: 'James M.', text: 'We couldn\'t be happier with how these turned out. Thank you!', date: '2024-06-21' }
    ]
  },
  {
    id: 'portrait-grace-editorial',
    title: 'Grace - Editorial Session',
    category: 'portrait',
    date: '2024-08-10',
    location: 'Studio, Kiambu',
    description: 'An editorial portrait session with model Grace Akinyi. We explored themes of elegance and strength, using dramatic lighting and minimal styling to let her natural beauty shine through.',
    coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=85',
    collaborators: [
      { name: 'Lucy Wanjiku', role: 'Makeup Artist' },
      { name: 'Peter Kamau', role: 'Stylist' }
    ],
    photos: [
      {
        id: 'ge-1',
        src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=85',
        srcLarge: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1600&q=90',
        caption: 'Natural light portrait'
      },
      {
        id: 'ge-2',
        src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=85',
        srcLarge: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1600&q=90',
        caption: 'Dramatic studio lighting'
      },
      {
        id: 'ge-3',
        src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=85',
        srcLarge: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&q=90',
        caption: 'Character study in black and white'
      }
    ],
    comments: [
      { id: 1, author: 'Grace A.', text: 'I felt so confident during this shoot. The team was amazing!', date: '2024-08-15' }
    ]
  },
  {
    id: 'commercial-brand-minimal',
    title: 'Minimal Goods - Product Launch',
    category: 'commercial',
    date: '2024-09-05',
    location: 'Studio, Nairobi',
    description: 'Product photography for Minimal Goods\' new audio collection. Clean, minimalist aesthetic with focus on product details and premium quality feel.',
    coverImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=85',
    collaborators: [
      { name: 'Creative Agency XYZ', role: 'Art Direction' }
    ],
    photos: [
      {
        id: 'mg-1',
        src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=85',
        srcLarge: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&q=90',
        caption: 'Hero product shot'
      },
      {
        id: 'mg-2',
        src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=85',
        srcLarge: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&q=90',
        caption: 'Lifestyle product placement'
      },
      {
        id: 'mg-3',
        src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=85',
        srcLarge: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=90',
        caption: 'Retail environment showcase'
      }
    ],
    comments: [
      { id: 1, author: 'James C.', text: 'These product shots helped us increase conversions by 40%!', date: '2024-09-20' }
    ]
  },
  {
    id: 'event-tech-summit',
    title: 'Kenya Tech Summit 2024',
    category: 'event',
    date: '2024-10-12',
    location: 'KICC, Nairobi',
    description: 'Coverage of the annual Kenya Tech Summit featuring keynote speakers, panel discussions, and networking events. Over 2000 attendees from across Africa.',
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=85',
    collaborators: [
      { name: 'Tech Events Kenya', role: 'Event Organizer' },
      { name: 'Samuel Njoroge', role: 'Assistant Photographer' }
    ],
    photos: [
      {
        id: 'ts-1',
        src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=85',
        srcLarge: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=90',
        caption: 'Keynote presentation'
      },
      {
        id: 'ts-2',
        src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=85',
        srcLarge: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&q=90',
        caption: 'Evening networking reception'
      },
      {
        id: 'ts-3',
        src: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=85',
        srcLarge: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1600&q=90',
        caption: 'Celebration moments'
      }
    ],
    comments: []
  },
  {
    id: 'wedding-mercy-brian',
    title: 'Mercy & Brian - Garden Wedding',
    category: 'wedding',
    date: '2024-04-20',
    location: 'Lake Naivasha, Kenya',
    description: 'An intimate garden wedding at Lake Naivasha. The couple exchanged vows surrounded by lush greenery and the stunning lake backdrop. A day filled with love, laughter, and beautiful moments.',
    coverImage: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=85',
    collaborators: [
      { name: 'Flora Events', role: 'Wedding Planner' },
      { name: 'Anne Mutua', role: 'Second Photographer' }
    ],
    photos: [
      {
        id: 'mb-1',
        src: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=85',
        srcLarge: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1600&q=90',
        caption: 'Bridal preparation'
      },
      {
        id: 'mb-2',
        src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=85',
        srcLarge: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=90',
        caption: 'Walking down the aisle'
      }
    ],
    comments: [
      { id: 1, author: 'Mercy W.', text: 'Every photo tells our story perfectly. We are so grateful!', date: '2024-05-01' }
    ]
  }
]

// Hero slides
export const heroSlides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1920&q=90',
    title: 'Timeless',
    subtitle: 'Memories'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=90',
    title: 'Your Story',
    subtitle: 'Beautifully Told'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1920&q=90',
    title: 'Every Frame',
    subtitle: 'A Masterpiece'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1920&q=90',
    title: 'Love',
    subtitle: 'Captured Forever'
  }
]

export const categories = [
  { id: 'all', label: 'All Work' },
  { id: 'wedding', label: 'Weddings' },
  { id: 'portrait', label: 'Portraits' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'event', label: 'Events' }
]

export const aboutImage = 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1000&q=90'

// Legacy support - flatten collections to portfolio images
export const portfolioImages = photoCollections.flatMap(collection => 
  collection.photos.map((photo, index) => ({
    id: photo.id,
    src: photo.src,
    srcLarge: photo.srcLarge,
    title: index === 0 ? collection.title : photo.caption,
    category: collection.category,
    aspect: index === 0 ? 'landscape' : (index % 3 === 0 ? 'portrait' : 'landscape'),
    collectionId: collection.id
  }))
)
