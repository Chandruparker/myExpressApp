import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute,Router } from '@angular/router';


@Component({
  selector: 'app-view-product',
  imports: [],
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.css'
})
export class ViewProductComponent {
  item: any = {};
  
  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Retrieve the ID from the route parameters and convert it to a number
    const productId = Number(this.route.snapshot.paramMap.get('productId'));
    if (!isNaN(productId)) {
      this.api.getItemById(productId).subscribe((data) => {
        this.item = data;
        console.log('val',data)
      });
     
    } else {
      console.error('Invalid ID');
      this.router.navigate(['/items']); 
    }
  }

  goBack() {
    this.router.navigate(['/product']);
  }
}
