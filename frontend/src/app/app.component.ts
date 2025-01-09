import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { CrudComponent } from "./crud/crud.component";
import { CommonModule, NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CartService } from './cart.service';
import { ApiService } from './api.service';

interface Submenu {
  label: string;
  route: string;
  roles?: string[];
}

interface MenuItem {
  label: string;
  route?: string;
  isExpanded?: boolean;
  roles?: string[];
  submenus?: Submenu[];
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet,MatToolbarModule,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent implements OnInit {
  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      isExpanded: false,
      roles: ['admin'],
    },
    {
      label: 'Orders',
      isExpanded: false,
      roles: ['admin', 'user'],
      submenus: [
        { label: 'View Orders', route: '/order-details', roles: ['admin'] },
        { label: 'Your Orders', route: '/your-orders', roles: ['user'] },
        { label: 'Track Orders', route: '/order', roles: ['user'] },
        
      ],
    },
    {
      label: 'Account',
      isExpanded: false,
      roles: ['admin', 'user'],
      submenus: [
        { label: 'View Profile', route: '/account', roles: ['admin','user'] }
        
        
      ],
    },
    {
      label: 'Users',
      route: '/users',
      isExpanded: false,
      roles: ['admin'],
    },
    {
      label: 'Products',
      isExpanded: false,
      roles: ['admin'],
      submenus: [
        { label: 'All Product', route: '/product', roles: ['admin'] },
        { label: 'Add Product', route: '/add', roles: ['admin'] }
     
      ],
    },
  ];

  filteredMenuItems: MenuItem[] = [];
  isLoggedIn: boolean = false;
  cartItemCount: number = 0;
  isSidebarClosed = false;
  username: string | null = null;

  constructor(private cdr: ChangeDetectorRef,private router: Router, private cartService: CartService,private api:ApiService) {}

  ngOnInit(): void {
    this.cdr.detectChanges();
    // Check login status initially
    this.checkLoginStatus();

    // Subscribe to cart updates
    this.cartService.cartCount$.subscribe((count) => {
      this.cartItemCount = count;
    });

    // Filter menu based on user role
    
    const userRole = localStorage.getItem('userRole') || 'user';
    this.username = localStorage.getItem('userName');
   
    this.filterMenuByRole(userRole);
    console.log('menuRole',this.filterMenuByRole)

    // Detect route changes to update login status
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkLoginStatus();
      }
    });

    this.api.initializeRole(); // Initialize role from localStorage if available
    this.subscribeToRoleChanges();
    
  }

  checkLoginStatus(): void {
    this.isLoggedIn = !!localStorage.getItem('userRole');
  }

  subscribeToRoleChanges(): void {
    this.api.getUserRole().subscribe((role) => {
      if (role) {
        this.isLoggedIn = true;
        this.filterMenuByRole(role);
      } else {
        this.isLoggedIn = false;
        this.filteredMenuItems = [];
      }
      this.cdr.detectChanges(); // Ensure view updates dynamically
    });
  }

  filterMenuByRole(role: string): void {
    this.filteredMenuItems = this.menuItems
      .filter((menu) => menu.roles?.includes(role))
      .map((menu) => {
        if (menu.submenus) {
          const filteredSubmenus = menu.submenus.filter((submenu) =>
            submenu.roles?.includes(role)
          );
          return { ...menu, submenus: filteredSubmenus };
        }
        return menu;
      });
    console.log('Filtered Menu Items:', this.filteredMenuItems); // Debugging
  }


  toggleSidebar(): void {
    this.isSidebarClosed = !this.isSidebarClosed;
  }

  toggleSubmenu(menu: MenuItem): void {
    if (menu.submenus) {
      menu.isExpanded = !menu.isExpanded;
    } else if (menu.route) {
      this.navigateTo(menu.route);
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.api.logout();
    this.router.navigate(['/login']);
  }

  navigateToCart(): void {
    this.router.navigate(['/cart'], { state: { cart: [] } });
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  navigateToOrder(): void {
    this.router.navigate(['/your-orders']);
  }
}
