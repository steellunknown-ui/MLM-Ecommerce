import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/shop/ProductCard'
import { PageHeader } from '@/components/shared/PageHeader'

// Since the user might not have run the migrations yet, 
// we will fallback to a static list if DB fails or returns empty.
const STATIC_PRODUCTS = [
  { id: '1', name: 'Merlin Tooth Brush', slug: 'merlin-tooth-brush', price: 30, bv: 24, category: 'Personal Care', image_url: '/products/placeholder.jpg', stock: 100, is_active: true, created_at: '', description: '' },
  { id: '2', name: 'Neem Soap 75gm', slug: 'neem-soap-75gm', price: 40, bv: 32, category: 'Personal Care', image_url: '/products/placeholder.jpg', stock: 100, is_active: true, created_at: '', description: '' },
  { id: '3', name: 'Amla Hair Oil 200ML', slug: 'amla-hair-oil-200ml', price: 100, bv: 80, category: 'Hair Care', image_url: '/products/placeholder.jpg', stock: 100, is_active: true, created_at: '', description: '' },
  { id: '4', name: 'Jasmine Hair Oil 200ML', slug: 'jasmine-hair-oil-200ml', price: 100, bv: 80, category: 'Hair Care', image_url: '/products/placeholder.jpg', stock: 100, is_active: true, created_at: '', description: '' },
  { id: '5', name: 'Herbal Hair Oil 100ML', slug: 'herbal-hair-oil-100ml', price: 150, bv: 120, category: 'Hair Care', image_url: '/products/placeholder.jpg', stock: 100, is_active: true, created_at: '', description: '' },
  { id: '6', name: 'Ghas Tail 100ML', slug: 'ghas-tail-100ml', price: 180, bv: 144, category: 'Hair Care', image_url: '/products/placeholder.jpg', stock: 100, is_active: true, created_at: '', description: '' },
  { id: '7', name: 'Black Monk 300gm', slug: 'black-monk-300gm', price: 220, bv: 176, category: 'Body Care', image_url: '/products/placeholder.jpg', stock: 100, is_active: true, created_at: '', description: '' },
  { id: '8', name: 'Pimple Cure Face Wash 60ML', slug: 'pimple-cure-face-wash-60ml', price: 80, bv: 64, category: 'Skin Care', image_url: '/products/placeholder.jpg', stock: 100, is_active: true, created_at: '', description: '' },
  { id: '9', name: 'Charcoal Face Wash 60ML', slug: 'charcoal-face-wash-60ml', price: 100, bv: 80, category: 'Skin Care', image_url: '/products/placeholder.jpg', stock: 100, is_active: true, created_at: '', description: '' },
  { id: '10', name: 'Herbal Shampoo 200ML', slug: 'herbal-shampoo-200ml', price: 110, bv: 88, category: 'Hair Care', image_url: '/products/placeholder.jpg', stock: 100, is_active: true, created_at: '', description: '' },
  { id: '11', name: 'Body Lotion 300ML', slug: 'body-lotion-300ml', price: 180, bv: 144, category: 'Body Care', image_url: '/products/placeholder.jpg', stock: 100, is_active: true, created_at: '', description: '' },
  { id: '12', name: 'Signature Black 200ML', slug: 'signature-black-200ml', price: 225, bv: 180, category: 'Body Care', image_url: '/products/placeholder.jpg', stock: 100, is_active: true, created_at: '', description: '' },
  { id: '13', name: 'Karck Sol 25GM', slug: 'karck-sol-25gm', price: 80, bv: 64, category: 'Skin Care', image_url: '/products/placeholder.jpg', stock: 100, is_active: true, created_at: '', description: '' },
  { id: '14', name: 'Summer Cool 150GM', slug: 'summer-cool-150gm', price: 110, bv: 88, category: 'Body Care', image_url: '/products/placeholder.jpg', stock: 100, is_active: true, created_at: '', description: '' },
  { id: '15', name: 'Lauki Oil 200ML', slug: 'lauki-oil-200ml', price: 150, bv: 120, category: 'Hair Care', image_url: '/products/placeholder.jpg', stock: 100, is_active: true, created_at: '', description: '' },
  { id: '16', name: 'Wonder 9 XL 10PCS', slug: 'wonder-9-xl-10pcs', price: 70, bv: 56, category: 'Feminine Care', image_url: '/products/placeholder.jpg', stock: 100, is_active: true, created_at: '', description: '' },
  { id: '17', name: 'Wonder 9 XL 20PCS', slug: 'wonder-9-xl-20pcs', price: 120, bv: 96, category: 'Feminine Care', image_url: '/products/placeholder.jpg', stock: 100, is_active: true, created_at: '', description: '' },
  { id: '18', name: 'Aloe Vera Gel 120ML', slug: 'aloe-vera-gel-120ml', price: 140, bv: 112, category: 'Skin Care', image_url: '/products/placeholder.jpg', stock: 100, is_active: true, created_at: '', description: '' },
]

export const revalidate = 3600 // revalidate every hour

export default async function ProductsPage() {
  const supabase = createClient()
  
  let products = []
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true })
      
    if (error || !data || data.length === 0) {
      products = STATIC_PRODUCTS
    } else {
      products = data
    }
  } catch (err) {
    products = STATIC_PRODUCTS
  }

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))]

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader 
        title="Our Products" 
        description="Premium quality everyday products. Buy minimum ₹360 to activate your repurchase income."
      />

      {/* Since this is a server component, we'll keep it simple. 
          For interactive filtering, we'd extract the grid to a Client Component.
          But for Phase 1, showing all categorized is great. */}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
