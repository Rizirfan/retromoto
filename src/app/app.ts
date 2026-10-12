import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  yearRange: string;
  price: number;
  condition: string;
  stock: number;
  image: string;
  description: string;
  seller: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  name: string;
  iconKey: string;
  desc: string;
}

export interface Toast {
  message: string;
  type: string;
}

const STORAGE_KEYS = {
  CART: 'retromoto_cart_v1',
  PRODUCTS: 'retromoto_products_v1'
};

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'RMP-ENG-101',
    name: 'OEM Mikuni Carburetor (Cleaned & Tuned)',
    category: 'Engine Parts',
    brand: 'Yamaha',
    model: 'RX100 / RX135',
    yearRange: '1992 - 2002',
    price: 2450,
    condition: 'Good',
    stock: 4,
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    description: 'Original Japanese Mikuni VM20 carburetor dismantled, ultrasonically cleaned, float-adjusted, and tested for smooth idling and crisp throttle response.',
    seller: 'Veloce Vintage Works, Pune'
  },
  {
    id: 'RMP-SUS-102',
    name: 'Heavy Duty Gas-Charged Rear Shock Absorbers (Pair)',
    category: 'Suspension',
    brand: 'Royal Enfield',
    model: 'Bullet 350 / Classic 500',
    yearRange: '2008 - 2018',
    price: 1850,
    condition: 'Like New',
    stock: 3,
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
    description: 'Pristine chrome Gabriel gas shock absorbers pulled from a vintage restoration build. Minimal usage, seals intact, zero oil weepage.',
    seller: 'Heritage Pistons, New Delhi'
  },
  {
    id: 'RMP-EXH-103',
    name: 'Vintage Long Bottle Chrome Silencer / Exhaust',
    category: 'Exhausts',
    brand: 'Royal Enfield',
    model: 'Bullet 350 / Electra 350',
    yearRange: '1985 - 2012',
    price: 3200,
    condition: 'Good',
    stock: 2,
    image: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=600&q=80',
    description: 'Authentic heavy-gauge steel long bottle exhaust with warm vintage thump. Mild patina with mirror finish polishing recently completed.',
    seller: 'Bespoke Thumpers, Bengaluru'
  },
  {
    id: 'RMP-ELE-104',
    name: 'Lucas-TVS 12V 55W Headlight Dome & Lens Assembly',
    category: 'Electrical Parts',
    brand: 'Royal Enfield',
    model: 'Bullet Standard',
    yearRange: '1995 - 2008',
    price: 1100,
    condition: 'Good',
    stock: 5,
    image: 'https://images.unsplash.com/photo-1558981420-87aa9dad1fa8?auto=format&fit=crop&w=600&q=80',
    description: 'Original fluted glass dome assembly with brass pilot lamp holders and vintage chrome rim. Ideal for period-correct restorations.',
    seller: 'Heritage Pistons, New Delhi'
  },
  {
    id: 'RMP-BOD-105',
    name: 'Original Teardrop Metal Fuel Tank (Sandblasted & Primed)',
    category: 'Body Parts',
    brand: 'Hero',
    model: 'Splendor / CD100',
    yearRange: '1996 - 2004',
    price: 1650,
    condition: 'Fair',
    stock: 2,
    image: 'https://images.unsplash.com/photo-1580835239846-5bb9ce03c8c3?auto=format&fit=crop&w=600&q=80',
    description: 'Zero internal rust, sound bottom welds, pressure leak tested up to 8 PSI. Prepped in zinc-phosphate anti-rust primer ready for your custom color coat.',
    seller: 'Decade Garage, Coimbatore'
  },
  {
    id: 'RMP-BRK-106',
    name: 'Front Disc Brake Caliper & Master Cylinder Kit (Nissin)',
    category: 'Brakes',
    brand: 'Honda',
    model: 'CB Shine 125 / Unicorn 150',
    yearRange: '2005 - 2016',
    price: 1450,
    condition: 'Like New',
    stock: 6,
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
    description: 'Complete front hydraulic assembly with dual piston Nissin caliper, sight glass intact, fresh DOT4 fluid flush, and new semi-metallic pads installed.',
    seller: 'MotoRefurb Hub, Chennai'
  },
  {
    id: 'RMP-WHE-107',
    name: '18-Inch Chrome Spoke Wheel Rim & Hub (Original Sanremo)',
    category: 'Wheels',
    brand: 'Yamaha',
    model: 'RD350 / RX135',
    yearRange: '1983 - 1999',
    price: 2900,
    condition: 'Good',
    stock: 1,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    description: 'True rim with zero wobble or flat spots, newly laced with heavy gauge galvanized spokes and cleaned brake drum liners.',
    seller: 'SpeedCraft Classic, Mumbai'
  },
  {
    id: 'RMP-ENG-108',
    name: 'Original 4-Speed Gearbox Cluster & Selector Drum',
    category: 'Engine Parts',
    brand: 'Bajaj',
    model: 'Chetak 150 / Super',
    yearRange: '1984 - 1998',
    price: 1950,
    condition: 'Good',
    stock: 3,
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
    description: 'Original Bajaj Auto scooter gearbox gear dogs in pristine condition. Tooth engagement verified with negligible wear on shift cruciform.',
    seller: 'RetroScoot Spares, Surat'
  },
  {
    id: 'RMP-ELE-109',
    name: 'Digital CDI Ignition Box & High-Output Stator Coil',
    category: 'Electrical Parts',
    brand: 'Bajaj',
    model: 'Pulsar 150 / 180 (DTS-i)',
    yearRange: '2003 - 2011',
    price: 1250,
    condition: 'Good',
    stock: 4,
    image: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=600&q=80',
    description: 'Tested OEM digital microprocessor unit with pulse generator and copper-wound stator plate. Bench-tested on oscilloscope for consistent spark curve.',
    seller: 'Apex Ignition Labs, Hyderabad'
  },
  {
    id: 'RMP-ACC-110',
    name: 'Heavy-Duty Safari Crash Guard with Auxiliary Mounts',
    category: 'Accessories',
    brand: 'Royal Enfield',
    model: 'Himalayan 411',
    yearRange: '2016 - 2021',
    price: 2100,
    condition: 'Good',
    stock: 2,
    image: 'https://images.unsplash.com/photo-1596706037042-3e284a7e6b54?auto=format&fit=crop&w=600&q=80',
    description: 'Solid mild-steel 32mm pipe engine guard finished in matte black powder coat. Perfect structural integrity, minor stone chip on bottom bracket.',
    seller: 'Roamer Overland Co., Chandigarh'
  },
  {
    id: 'RMP-ENG-111',
    name: 'Cylinder Block & Piston Set (53.5mm Standard Bore)',
    category: 'Engine Parts',
    brand: 'TVS',
    model: 'Apache RTR 160',
    yearRange: '2008 - 2015',
    price: 2750,
    condition: 'For Repair',
    stock: 2,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
    description: 'Original cast-iron lined aluminum block. Requires 0.25mm overbore reboring due to slight cross-hatch scoring. Casting has zero cracks or fin damages.',
    seller: 'Decade Garage, Coimbatore'
  },
  {
    id: 'RMP-BOD-112',
    name: 'Vintage Dual-Tone Sprung Rider & Pillion Saddle',
    category: 'Body Parts',
    brand: 'Royal Enfield',
    model: 'Bullet Standard 350',
    yearRange: '1970 - 2010',
    price: 2300,
    condition: 'Like New',
    stock: 0,
    image: 'https://images.unsplash.com/photo-1558980394-4c7c9299fe96?auto=format&fit=crop&w=600&q=80',
    description: 'High-density foam saddle re-upholstered in weathered saddle-tan and black faux leather with heavy coil springs. (Currently awaiting workshop restock).',
    seller: 'Bespoke Thumpers, Bengaluru'
  }
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  // App Config
  readonly whatsappSellerNumber = '919876543210';
  readonly storeName = 'RetroMoto Parts';

  // UI state
  isMobileMenuOpen = false;
  isCartOpen = false;
  isDetailModalOpen = false;
  isSellerModalOpen = false;
  selectedProduct: Product | null = null;
  activeToast: Toast | null = null;
  sellerTab: 'list' | 'form' = 'list';
  isEditingProduct = false;

  // Categories
  categories: Category[] = [
    { name: 'Engine Parts', iconKey: 'engine', desc: 'Carburetors, cylinders, pistons & clutches' },
    { name: 'Electrical Parts', iconKey: 'electrical', desc: 'CDI units, stators, wiring looms & lights' },
    { name: 'Brakes', iconKey: 'brakes', desc: 'Calipers, master cylinders, discs & drums' },
    { name: 'Body Parts', iconKey: 'body', desc: 'Fuel tanks, side panels, fenders & seats' },
    { name: 'Suspension', iconKey: 'suspension', desc: 'Front forks, rear shockers & swing arms' },
    { name: 'Wheels', iconKey: 'wheels', desc: 'Spoke rims, alloy hubs & axle assemblies' },
    { name: 'Exhausts', iconKey: 'exhausts', desc: 'Vintage silencers, headers & heat shields' },
    { name: 'Accessories', iconKey: 'accessories', desc: 'Crash bars, luggage racks & touring kits' }
  ];

  // Brands & Conditions
  availableBrands = ['Royal Enfield', 'Yamaha', 'Hero', 'Honda', 'Bajaj', 'TVS'];
  availableConditions = ['Like New', 'Good', 'Fair', 'For Repair'];

  // Filters
  filters = {
    searchQuery: '',
    category: '',
    brand: '',
    condition: '',
    maxPrice: 6000
  };

  sortBy: 'newest' | 'price-low' | 'price-high' | 'name' = 'newest';
  viewMode: 'grid' | 'table' = 'grid';

  // Products and Cart
  products: Product[] = [];
  cart: CartItem[] = [];

  // Seller Form Model
  productForm: Product = this.createEmptyProduct();

  ngOnInit(): void {
    this.loadProducts();
    this.loadCart();
  }

  // ---------------------------------------------------------------------------
  // Storage Handling
  // ---------------------------------------------------------------------------
  loadProducts(): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        this.products = JSON.parse(saved);
        return;
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    this.products = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
    this.saveProducts();
  }

  saveProducts(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(this.products));
    } catch (e) {
      console.error('Save products failed:', e);
    }
  }

  loadCart(): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      if (saved) {
        this.cart = JSON.parse(saved);
        return;
      }
    } catch (e) {
      console.warn('LocalStorage cart error:', e);
    }
    this.cart = [];
  }

  saveCart(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(this.cart));
    } catch (e) {
      console.error('Save cart failed:', e);
    }
  }

  // ---------------------------------------------------------------------------
  // Toast notifications
  // ---------------------------------------------------------------------------
  showToast(message: string, type: string = 'info'): void {
    this.activeToast = { message, type };
    setTimeout(() => {
      this.activeToast = null;
    }, 3500);
  }

  // ---------------------------------------------------------------------------
  // Navigation & Modals
  // ---------------------------------------------------------------------------
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  toggleCart(): void {
    this.isCartOpen = !this.isCartOpen;
  }

  openCart(): void {
    this.isCartOpen = true;
  }

  closeCart(): void {
    this.isCartOpen = false;
  }

  openProductDetails(product: Product): void {
    this.selectedProduct = JSON.parse(JSON.stringify(product));
    this.isDetailModalOpen = true;
  }

  closeProductDetails(): void {
    this.isDetailModalOpen = false;
    this.selectedProduct = null;
  }

  openSellerPortal(): void {
    this.isSellerModalOpen = true;
    this.sellerTab = 'list';
    this.resetProductForm();
  }

  closeSellerPortal(): void {
    this.isSellerModalOpen = false;
  }

  // ---------------------------------------------------------------------------
  // Filter & Search Logic
  // ---------------------------------------------------------------------------
  selectCategory(categoryName: string): void {
    this.filters.category = this.filters.category === categoryName ? '' : categoryName;
    this.scrollToCatalogue();
  }

  selectBrand(brandName: string): void {
    this.filters.brand = this.filters.brand === brandName ? '' : brandName;
  }

  selectCondition(cond: string): void {
    this.filters.condition = this.filters.condition === cond ? '' : cond;
  }

  resetFilters(): void {
    this.filters = {
      searchQuery: '',
      category: '',
      brand: '',
      condition: '',
      maxPrice: 6000
    };
    this.sortBy = 'newest';
    this.showToast('All filters have been cleared.', 'info');
  }

  hasActiveFilters(): boolean {
    return Boolean(
      this.filters.searchQuery ||
      this.filters.category ||
      this.filters.brand ||
      this.filters.condition ||
      this.filters.maxPrice < 6000
    );
  }

  getCategoryCount(categoryName: string): number {
    return this.products.filter(p => p.category === categoryName).length;
  }

  get filteredProducts(): Product[] {
    let list = this.products.filter(p => {
      if (this.filters.searchQuery) {
        const q = this.filters.searchQuery.toLowerCase().trim();
        const matches = (p.name && p.name.toLowerCase().includes(q)) ||
                        (p.brand && p.brand.toLowerCase().includes(q)) ||
                        (p.model && p.model.toLowerCase().includes(q)) ||
                        (p.category && p.category.toLowerCase().includes(q)) ||
                        (p.description && p.description.toLowerCase().includes(q));
        if (!matches) return false;
      }

      if (this.filters.category && p.category !== this.filters.category) return false;
      if (this.filters.brand && p.brand !== this.filters.brand) return false;
      if (this.filters.condition && p.condition !== this.filters.condition) return false;
      if (p.price > this.filters.maxPrice) return false;

      return true;
    });

    switch (this.sortBy) {
      case 'price-low':
        return list.sort((a, b) => a.price - b.price);
      case 'price-high':
        return list.sort((a, b) => b.price - a.price);
      case 'name':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'newest':
      default:
        return list.sort((a, b) => {
          const numA = parseInt(a.id.replace(/\D/g, '') || '0', 10);
          const numB = parseInt(b.id.replace(/\D/g, '') || '0', 10);
          return numB - numA;
        });
    }
  }

  scrollToCatalogue(): void {
    setTimeout(() => {
      const elem = document.getElementById('shop-section');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  }

  // ---------------------------------------------------------------------------
  // Cart Actions
  // ---------------------------------------------------------------------------
  getCartCount(): number {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  getCartSubtotal(): number {
    return this.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  addToCart(product: Product | null, requestedQty: number = 1): void {
    if (!product) return;

    if (product.stock <= 0) {
      this.showToast('Item is currently out of stock.', 'error');
      return;
    }

    const existing = this.cart.find(i => i.product.id === product.id);
    if (existing) {
      const newQty = existing.quantity + requestedQty;
      if (newQty > product.stock) {
        this.showToast(`Cannot add more! Only ${product.stock} unit(s) available in stock.`, 'warning');
        return;
      }
      existing.quantity = newQty;
    } else {
      this.cart.push({
        product: JSON.parse(JSON.stringify(product)),
        quantity: requestedQty
      });
    }

    this.saveCart();
    this.showToast(`"${product.name}" added to cart!`, 'success');
    this.openCart();
  }

  updateCartQuantity(cartItem: CartItem, delta: number): void {
    const currentProd = this.products.find(p => p.id === cartItem.product.id);
    const maxStock = currentProd ? currentProd.stock : cartItem.product.stock;
    const newQty = cartItem.quantity + delta;

    if (newQty <= 0) {
      this.removeFromCart(cartItem);
      return;
    }

    if (newQty > maxStock) {
      this.showToast(`Only ${maxStock} units are available in inventory.`, 'warning');
      return;
    }

    cartItem.quantity = newQty;
    this.saveCart();
  }

  removeFromCart(cartItem: CartItem): void {
    const index = this.cart.indexOf(cartItem);
    if (index !== -1) {
      const name = cartItem.product.name;
      this.cart.splice(index, 1);
      this.saveCart();
      this.showToast(`Removed "${name}" from cart.`, 'info');
    }
  }

  clearCart(): void {
    if (this.cart.length === 0) return;
    this.cart = [];
    this.saveCart();
    this.showToast('Your cart has been cleared.', 'info');
  }

  proceedToWhatsAppCheckout(): void {
    if (!this.cart || this.cart.length === 0) {
      this.showToast('Your shopping cart is empty! Add parts before placing an enquiry.', 'error');
      return;
    }

    // Verify stock
    for (const item of this.cart) {
      const live = this.products.find(p => p.id === item.product.id);
      if (live && live.stock < item.quantity) {
        this.showToast(`Stock alert: "${live.name}" only has ${live.stock} remaining.`, 'error');
        return;
      }
    }

    let msg = '*NEW SPARE PARTS ENQUIRY - RetroMoto Parts*\n';
    msg += '--------------------------------------------------\n';
    msg += 'Hello RetroMoto Team, I would like to enquire about the availability and dispatch of the following vintage/used motorcycle parts:\n\n';

    this.cart.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.product.name}*\n`;
      msg += `   • Part ID: ${item.product.id}\n`;
      msg += `   • Fitment: ${item.product.brand} ${item.product.model} (${item.product.yearRange})\n`;
      msg += `   • Condition: ${item.product.condition}\n`;
      msg += `   • Qty: ${item.quantity} unit(s) @ ₹${item.product.price.toLocaleString('en-IN')} each\n`;
      msg += `   • Subtotal: ₹${(item.quantity * item.product.price).toLocaleString('en-IN')}\n\n`;
    });

    const grandTotal = this.getCartSubtotal();
    msg += '--------------------------------------------------\n';
    msg += `*Total Estimated Value: ₹${grandTotal.toLocaleString('en-IN')}*\n`;
    msg += `*Enquiry Timestamp:* ${new Date().toLocaleString()}\n\n`;
    msg += '*Notice:* I understand this is an enquiry to verify stock & packaging, not an automated payment transaction.';

    const whatsappUrl = `https://wa.me/${this.whatsappSellerNumber}?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank');
    this.showToast('Opening WhatsApp with your parts list...', 'success');
  }

  // ---------------------------------------------------------------------------
  // Seller / Admin Portal
  // ---------------------------------------------------------------------------
  createEmptyProduct(): Product {
    return {
      id: 'RMP-NEW-' + Math.floor(100 + Math.random() * 900),
      name: '',
      category: 'Engine Parts',
      brand: 'Royal Enfield',
      model: '',
      yearRange: '',
      price: 1500,
      condition: 'Good',
      stock: 1,
      image: '',
      description: '',
      seller: 'Verified Moto Specialist'
    };
  }

  resetProductForm(): void {
    this.productForm = this.createEmptyProduct();
    this.isEditingProduct = false;
  }

  setSellerTab(tab: 'list' | 'form'): void {
    this.sellerTab = tab;
    if (tab === 'form' && !this.isEditingProduct) {
      this.resetProductForm();
    }
  }

  editProductInAdmin(product: Product): void {
    this.productForm = JSON.parse(JSON.stringify(product));
    this.isEditingProduct = true;
    this.sellerTab = 'form';
  }

  saveProductFromAdmin(): void {
    if (!this.productForm.name || !this.productForm.category || !this.productForm.price) {
      this.showToast('Please fill out all required fields marked with *', 'error');
      return;
    }

    if (this.productForm.price < 0 || this.productForm.stock < 0) {
      this.showToast('Price and stock quantity must be non-negative values.', 'error');
      return;
    }

    if (this.isEditingProduct) {
      const idx = this.products.findIndex(p => p.id === this.productForm.id);
      if (idx !== -1) {
        this.products[idx] = JSON.parse(JSON.stringify(this.productForm));
        this.showToast(`Product "${this.productForm.name}" updated successfully!`, 'success');
      }
    } else {
      this.products.unshift(JSON.parse(JSON.stringify(this.productForm)));
      this.showToast('New part added to marketplace catalogue!', 'success');
    }

    this.saveProducts();
    this.resetProductForm();
    this.sellerTab = 'list';
  }

  deleteProductFromAdmin(product: Product): void {
    const confirmDelete = confirm(`Are you sure you want to delete "${product.name}" from the catalogue?`);
    if (!confirmDelete) return;

    const idx = this.products.findIndex(p => p.id === product.id);
    if (idx !== -1) {
      this.products.splice(idx, 1);
      this.saveProducts();
      this.showToast('Item deleted from catalogue.', 'info');
    }
  }

  resetDemoData(): void {
    const confirmReset = confirm('Reset all demo data back to default workshop inventory? Custom items will be removed.');
    if (!confirmReset) return;

    this.products = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
    this.saveProducts();
    this.resetFilters();
    this.showToast('Demo catalogue restored to original factory presets.', 'success');
  }

  handleImageError(event: Event, category: string): void {
    const target = event.target as HTMLImageElement;
    const label = category || 'RetroMoto Part';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
      <rect width="400" height="300" fill="#232328"/>
      <circle cx="200" cy="130" r="50" fill="#2D2D35" stroke="#D35400" stroke-width="3"/>
      <path d="M180 130 L220 130 M200 110 L200 150" stroke="#E67E22" stroke-width="4" stroke-linecap="round"/>
      <text x="200" y="210" fill="#FAF7F2" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">${label}</text>
      <text x="200" y="235" fill="#8E8B82" font-family="sans-serif" font-size="11" text-anchor="middle">Image Not Available / In Refurb</text>
    </svg>`;
    target.src = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }
}
